import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET - Fetch all employees with related data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "SCHEDULER", "HR_STAFF"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const role = searchParams.get("role");

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

    // Employee creation logic would go here
    // For now, return not implemented
    await request.json(); // Consume the request body
    return NextResponse.json(
      { error: "Employee creation not yet implemented" },
      { status: 501 }
    );
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 }
    );
  }
}
