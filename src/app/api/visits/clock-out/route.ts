import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createAuditLog, logPHIAccess } from "@/lib/audit";

// POST clock out
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !["CAREGIVER", "NURSE"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { visitId, latitude, longitude, notes, completedTasks } = body;

    // Get the employee
    const employee = await prisma.employee.findFirst({
      where: { userId: session.user.id },
    });

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    // Get the visit
    const visit = await prisma.visit.findUnique({
      where: { id: visitId },
    });

    if (!visit) {
      return NextResponse.json({ error: "Visit not found" }, { status: 404 });
    }

    // Verify the visit belongs to this employee
    if (visit.employeeId !== employee.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the visit is clocked in
    if (!visit.actualStart) {
      return NextResponse.json(
        { error: "Visit not clocked in" },
        { status: 400 }
      );
    }

    // Verify the visit is not already clocked out
    if (visit.actualEnd) {
      return NextResponse.json(
        { error: "Visit already clocked out" },
        { status: 400 }
      );
    }

    // Update the visit with clock-out data (EVV)
    const updatedVisit = await prisma.visit.update({
      where: { id: visitId },
      data: {
        actualEnd: new Date(),
        clockOutLatitude: latitude,
        clockOutLongitude: longitude,
        clockOutMethod: "GPS",
        status: "COMPLETED",
        notes,
      },
    });

    // Create task logs if provided
    if (completedTasks && completedTasks.length > 0) {
      await prisma.visitTaskLog.createMany({
        data: completedTasks.map((task: { taskId: string; notes?: string }) => ({
          visitId,
          taskId: task.taskId,
          completedAt: new Date(),
          completedBy: employee.id,
          notes: task.notes,
        })),
      });
    }

    // Log the clock-out
    await createAuditLog({
      userId: session.user.id,
      action: "CLOCK_OUT",
      entityType: "Visit",
      entityId: visitId,
    });

    await logPHIAccess({
      userId: session.user.id,
      entityType: "Visit",
      entityId: visitId,
      action: "UPDATE",
    });

    return NextResponse.json(updatedVisit);
  } catch (error) {
    console.error("Error clocking out:", error);
    return NextResponse.json(
      { error: "Failed to clock out" },
      { status: 500 }
    );
  }
}
