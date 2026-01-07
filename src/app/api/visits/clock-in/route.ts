import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createAuditLog, logPHIAccess } from "@/lib/audit";

// POST clock in
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !["CAREGIVER", "NURSE"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { visitId, latitude, longitude } = body;

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
      include: {
        client: true,
      },
    });

    if (!visit) {
      return NextResponse.json({ error: "Visit not found" }, { status: 404 });
    }

    // Verify the visit belongs to this employee
    if (visit.employeeId !== employee.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the visit is not already clocked in
    if (visit.actualStart) {
      return NextResponse.json(
        { error: "Visit already clocked in" },
        { status: 400 }
      );
    }

    // Update the visit with clock-in data (EVV)
    const updatedVisit = await prisma.visit.update({
      where: { id: visitId },
      data: {
        actualStart: new Date(),
        clockInLatitude: latitude,
        clockInLongitude: longitude,
        clockInMethod: "GPS",
        status: "IN_PROGRESS",
      },
    });

    // Log the clock-in
    await createAuditLog({
      userId: session.user.id,
      action: "CLOCK_IN",
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
    console.error("Error clocking in:", error);
    return NextResponse.json(
      { error: "Failed to clock in" },
      { status: 500 }
    );
  }
}
