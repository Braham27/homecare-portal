import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only caregivers and nurses can access documentation
    if (session.user.role !== "CAREGIVER" && session.user.role !== "NURSE") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get the employee record for the current user
    const employee = await prisma.employee.findFirst({
      where: { userId: session.user.id },
    });

    if (!employee) {
      return NextResponse.json({ error: "Employee record not found" }, { status: 404 });
    }

    // Get date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get completed visits that need documentation (no care notes)
    const pendingVisits = await prisma.visit.findMany({
      where: {
        employeeId: employee.id,
        status: { in: ["COMPLETED", "IN_PROGRESS"] },
        caregiverNotes: null,
        scheduledStart: {
          gte: sevenDaysAgo,
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
          },
        },
      },
      orderBy: {
        scheduledStart: "desc",
      },
    });

    // Get documented visits from the last 7 days
    const completedVisits = await prisma.visit.findMany({
      where: {
        employeeId: employee.id,
        caregiverNotes: { not: null },
        scheduledStart: {
          gte: sevenDaysAgo,
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
          },
        },
      },
      orderBy: {
        scheduledStart: "desc",
      },
      take: 20,
    });

    return NextResponse.json({
      pending: pendingVisits,
      completed: completedVisits,
    });
  } catch (error) {
    console.error("Error fetching documentation visits:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only caregivers and nurses can submit documentation
    if (session.user.role !== "CAREGIVER" && session.user.role !== "NURSE") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { visitId, careNotes, tasksPerformed } = await request.json();

    if (!visitId) {
      return NextResponse.json({ error: "Visit ID is required" }, { status: 400 });
    }

    // Get the employee record for the current user
    const employee = await prisma.employee.findFirst({
      where: { userId: session.user.id },
    });

    if (!employee) {
      return NextResponse.json({ error: "Employee record not found" }, { status: 404 });
    }

    // Verify the visit belongs to this employee
    const visit = await prisma.visit.findFirst({
      where: {
        id: visitId,
        employeeId: employee.id,
      },
    });

    if (!visit) {
      return NextResponse.json({ error: "Visit not found" }, { status: 404 });
    }

    // Update the visit with documentation
    const updatedVisit = await prisma.visit.update({
      where: { id: visitId },
      data: {
        caregiverNotes: careNotes || null,
        notes: tasksPerformed || null,
      },
    });

    return NextResponse.json(updatedVisit);
  } catch (error) {
    console.error("Error saving documentation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
