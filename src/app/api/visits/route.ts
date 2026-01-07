import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";

// GET all visits
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");
    const employeeId = searchParams.get("employeeId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};

    // Filter by client
    if (clientId) {
      where.clientId = clientId;
    }

    // Filter by employee
    if (employeeId) {
      where.employeeId = employeeId;
    }

    // Filter by date range
    if (startDate || endDate) {
      where.scheduledDate = {};
      if (startDate) {
        (where.scheduledDate as Record<string, unknown>).gte = new Date(startDate);
      }
      if (endDate) {
        (where.scheduledDate as Record<string, unknown>).lte = new Date(endDate);
      }
    }

    // Filter by status
    if (status) {
      where.status = status;
    }

    // Role-based filtering
    if (session.user.role === "CAREGIVER" || session.user.role === "NURSE") {
      const employee = await prisma.employee.findFirst({
        where: { userId: session.user.id },
      });
      if (employee) {
        where.employeeId = employee.id;
      }
    } else if (session.user.role === "CLIENT" || session.user.role === "FAMILY_MEMBER") {
      const client = await prisma.client.findFirst({
        where: { userId: session.user.id },
      });
      if (client) {
        where.clientId = client.id;
      }
    }

    const visits = await prisma.visit.findMany({
      where,
      include: {
        client: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        employee: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: { scheduledDate: "asc" },
    });

    return NextResponse.json(visits);
  } catch (error) {
    console.error("Error fetching visits:", error);
    return NextResponse.json(
      { error: "Failed to fetch visits" },
      { status: 500 }
    );
  }
}

// POST create a new visit
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !["ADMIN", "SCHEDULER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const visit = await prisma.visit.create({
      data: {
        clientId: body.clientId,
        employeeId: body.employeeId,
        serviceType: body.serviceType,
        scheduledDate: new Date(body.scheduledDate),
        scheduledStart: new Date(`${body.scheduledDate}T${body.scheduledStartTime}`),
        scheduledEnd: new Date(`${body.scheduledDate}T${body.scheduledEndTime}`),
        status: "SCHEDULED",
        notes: body.notes,
      },
      include: {
        client: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        employee: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    // Log the creation
    await createAuditLog({
      userId: session.user.id,
      action: "CREATE",
      entityType: "Visit",
      entityId: visit.id,
    });

    return NextResponse.json(visit, { status: 201 });
  } catch (error) {
    console.error("Error creating visit:", error);
    return NextResponse.json(
      { error: "Failed to create visit" },
      { status: 500 }
    );
  }
}
