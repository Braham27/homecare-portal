import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET - Fetch all employees with related data OR single employee by ID
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "SCHEDULER", "HR_STAFF"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const status = searchParams.get("status");
    const role = searchParams.get("role");

    // If ID is provided, fetch single employee
    if (id) {
      const employee = await prisma.employee.findUnique({
        where: { id },
        include: {
          user: true,
        },
      });

      if (!employee) {
        return NextResponse.json({ error: "Employee not found" }, { status: 404 });
      }

      return NextResponse.json({ employee });
    }

    const whereClause: Record<string, unknown> = {};
    
    if (status && status !== "all") {
      whereClause.status = status.toUpperCase();
    }
    
    if (role && role !== "all") {
      whereClause.type = role.toUpperCase();
    }

    const employees = await prisma.employee.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            role: true,
            status: true,
          },
        },
        credentials: {
          where: {
            expirationDate: {
              gte: new Date(),
            },
          },
          select: {
            credentialType: true,
            expirationDate: true,
          },
        },
        assignments: {
          where: {
            endDate: null,
          },
          select: {
            id: true,
          },
        },
        visits: {
          where: {
            scheduledDate: {
              gte: new Date(new Date().setDate(new Date().getDate() - 7)),
              lte: new Date(),
            },
            status: "COMPLETED",
          },
          select: {
            actualStart: true,
            actualEnd: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate hours this week for each employee
    const transformedEmployees = employees.map((employee: typeof employees[number]) => {
      const hoursThisWeek = employee.visits.reduce((total: number, visit: { actualStart: Date | null; actualEnd: Date | null }) => {
        if (visit.actualStart && visit.actualEnd) {
          const hours = (visit.actualEnd.getTime() - visit.actualStart.getTime()) / (1000 * 60 * 60);
          return total + hours;
        }
        return total;
      }, 0);

      return {
        id: employee.id,
        employeeNumber: employee.employeeNumber,
        firstName: employee.user.firstName,
        lastName: employee.user.lastName,
        email: employee.user.email,
        phone: employee.user.phone || "",
        role: employee.user.role,
        type: employee.type,
        hireDate: employee.hireDate.toISOString().split("T")[0],
        status: employee.status.toLowerCase(),
        certifications: employee.credentials.map((c: { credentialType: string }) => c.credentialType),
        clientCount: employee.assignments.length,
        hoursThisWeek: Math.round(hoursThisWeek * 10) / 10,
        hourlyRate: Number(employee.hourlyRate),
      };
    });

    return NextResponse.json(transformedEmployees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

// POST - Create a new employee
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "HR_STAFF"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const bcrypt = require("bcryptjs");
    const defaultPassword = await bcrypt.hash("Employee@123!", 12);

    // Create user first
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: defaultPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.type === "RN" || data.type === "LPN" ? "NURSE" : "CAREGIVER",
        status: "ACTIVE",
        emailVerified: new Date(),
      },
    });

    // Create employee record
    const employee = await prisma.employee.create({
      data: {
        userId: user.id,
        employeeNumber: `EMP-${user.id.slice(0, 8).toUpperCase()}`,
        type: data.type,
        hireDate: new Date(data.hireDate),
        dateOfBirth: new Date(data.dateOfBirth),
        hourlyRate: parseFloat(data.hourlyRate),
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
      },
    });

    return NextResponse.json({ employee }, { status: 201 });
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 }
    );
  }
}

// PUT - Update an employee
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "HR_STAFF"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Employee ID required" }, { status: 400 });
    }

    const data = await request.json();

    const employee = await prisma.employee.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    // Update user info
    await prisma.user.update({
      where: { id: employee.userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      },
    });

    // Update employee info
    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: {
        type: data.type,
        hourlyRate: parseFloat(data.hourlyRate),
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json({ employee: updatedEmployee });
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 }
    );
  }
}
