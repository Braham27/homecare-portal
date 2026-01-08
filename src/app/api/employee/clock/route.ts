import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET - Get current visit or recent clock data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "CAREGIVER" && session.user.role !== "NURSE") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get employee record
    const employee = await prisma.employee.findFirst({
      where: { userId: session.user.id },
    });

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    // Get current visit (today's visits for this employee)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const visits = await prisma.visit.findMany({
      where: {
        employeeId: employee.id,
        scheduledDate: {
          gte: today,
          lt: tomorrow,
        },
        status: {
          in: ["SCHEDULED", "IN_PROGRESS"],
        },
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
            carePlan: {
              include: {
                tasks: true,
              },
            },
          },
        },
      },
      orderBy: {
        scheduledStart: "asc",
      },
    });

    // Get the next upcoming visit or current in-progress visit
    const currentVisit = visits.find(v => v.status === "IN_PROGRESS") || visits[0];

    if (!currentVisit) {
      return NextResponse.json({ 
        currentVisit: null,
        message: "No visits scheduled for today" 
      });
    }

    return NextResponse.json({
      currentVisit: {
        id: currentVisit.id,
        clientName: `${currentVisit.client.user.firstName} ${currentVisit.client.user.lastName}`,
        address: `${currentVisit.client.address}, ${currentVisit.client.city}, ${currentVisit.client.state}`,
        scheduledStart: currentVisit.scheduledStart,
        scheduledEnd: currentVisit.scheduledEnd,
        actualStart: currentVisit.actualStart,
        actualEnd: currentVisit.actualEnd,
        serviceType: currentVisit.serviceType,
        status: currentVisit.status,
        tasks: currentVisit.client.carePlan?.tasks || [],
        latitude: currentVisit.clockInLatitude,
        longitude: currentVisit.clockInLongitude,
      },
    });
  } catch (error) {
    console.error("Error fetching clock data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Clock in/out
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "CAREGIVER" && session.user.role !== "NURSE") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { visitId, action, latitude, longitude, notes, completedTasks } = body;

    if (!visitId || !action || !latitude || !longitude) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the visit
    const visit = await prisma.visit.findUnique({
      where: { id: visitId },
      include: {
        client: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!visit) {
      return NextResponse.json({ error: "Visit not found" }, { status: 404 });
    }

    if (action === "clock-in") {
      // Update visit with clock-in data
      const updatedVisit = await prisma.visit.update({
        where: { id: visitId },
        data: {
          actualStart: new Date(),
          clockInLatitude: latitude.toString(),
          clockInLongitude: longitude.toString(),
          status: "IN_PROGRESS",
        },
      });

      return NextResponse.json({
        success: true,
        message: "Clocked in successfully",
        visit: updatedVisit,
      });
    } else if (action === "clock-out") {
      // Update visit with clock-out data
      const updatedVisit = await prisma.visit.update({
        where: { id: visitId },
        data: {
          actualEnd: new Date(),
          clockOutLatitude: latitude.toString(),
          clockOutLongitude: longitude.toString(),
          caregiverNotes: notes || null,
          status: "COMPLETED",
          evvVerified: true, // Auto-verify EVV when clocked out
        },
      });

      // Update completed tasks if provided
      if (completedTasks && Array.isArray(completedTasks)) {
        // Store completed tasks (you might want to create a separate table for this)
        // For now, we'll just log it
        console.log("Completed tasks:", completedTasks);
      }

      return NextResponse.json({
        success: true,
        message: "Clocked out successfully",
        visit: updatedVisit,
      });
    } else {
      return NextResponse.json(
        { error: "Invalid action. Use 'clock-in' or 'clock-out'" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing clock action:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
