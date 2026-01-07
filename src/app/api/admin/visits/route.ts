import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET - Fetch visits with optional date range filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "SCHEDULER", "BILLING_STAFF", "HR_STAFF"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const status = searchParams.get("status");
    const employeeId = searchParams.get("employeeId");
    const clientId = searchParams.get("clientId");

    const whereClause: Record<string, unknown> = {};
    
    if (startDate && endDate) {
      whereClause.scheduledDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      whereClause.scheduledDate = {
        gte: new Date(startDate),
      };
    } else if (endDate) {
      whereClause.scheduledDate = {
        lte: new Date(endDate),
      };
    }

    if (status && status !== "all") {
      whereClause.status = status.toUpperCase();
    }

    if (employeeId) {
      whereClause.employeeId = employeeId;
    }

    if (clientId) {
      whereClause.clientId = clientId;
    }

    const visits = await prisma.visit.findMany({
      where: whereClause,
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
      orderBy: [
        { scheduledDate: "asc" },
        { scheduledStart: "asc" },
      ],
    });

    const transformedVisits = visits.map((visit: typeof visits[number]) => {
      const clientName = `${visit.client.user.firstName} ${visit.client.user.lastName}`;
      const caregiverName = visit.employee 
        ? `${visit.employee.user.firstName} ${visit.employee.user.lastName}`
        : "Unassigned";

      return {
        id: visit.id,
        client: clientName,
        clientId: visit.clientId,
        clientAddress: `${visit.client.address}`,
        caregiver: caregiverName,
        caregiverId: visit.employeeId,
        date: visit.scheduledDate.toISOString().split("T")[0],
        startTime: visit.scheduledStart.toISOString().substring(11, 16),
        endTime: visit.scheduledEnd.toISOString().substring(11, 16),
        actualStart: visit.actualStart?.toISOString().substring(11, 16) || null,
        actualEnd: visit.actualEnd?.toISOString().substring(11, 16) || null,
        serviceType: visit.serviceType,
        status: visit.status.toLowerCase(),
        notes: visit.notes,
        evvVerified: visit.evvVerified,
      };
    });

    return NextResponse.json(transformedVisits);
  } catch (error) {
    console.error("Error fetching visits:", error);
    return NextResponse.json(
      { error: "Failed to fetch visits" },
      { status: 500 }
    );
  }
}

// POST - Create a new visit
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "SCHEDULER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      clientId,
      employeeId,
      scheduledDate,
      startTime,
      endTime,
      serviceType,
      notes,
    } = body;

    if (!clientId || !scheduledDate || !startTime || !endTime || !serviceType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const scheduledDateObj = new Date(scheduledDate);
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const scheduledStart = new Date(scheduledDateObj);
    scheduledStart.setHours(startHour, startMinute, 0, 0);

    const scheduledEnd = new Date(scheduledDateObj);
    scheduledEnd.setHours(endHour, endMinute, 0, 0);

    const visit = await prisma.visit.create({
      data: {
        clientId,
        employeeId: employeeId || null,
        scheduledDate: scheduledDateObj,
        scheduledStart,
        scheduledEnd,
        serviceType,
        notes,
        status: "SCHEDULED",
      },
    });

    return NextResponse.json({
      success: true,
      visit: {
        id: visit.id,
      },
      message: "Visit created successfully",
    });
  } catch (error) {
    console.error("Error creating visit:", error);
    return NextResponse.json(
      { error: "Failed to create visit" },
      { status: 500 }
    );
  }
}
