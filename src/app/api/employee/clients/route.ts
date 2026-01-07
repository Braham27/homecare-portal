import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only caregivers and nurses can access their client assignments
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

    // Get all client assignments for this employee
    const assignments = await prisma.caregiverAssignment.findMany({
      where: {
        employeeId: employee.id,
        endDate: null, // Only active assignments
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
                tasks: {
                  orderBy: {
                    category: "asc",
                  },
                },
              },
            },
          },
        },
      },
      orderBy: [
        { isPrimary: "desc" },
        { startDate: "desc" },
      ],
    });

    return NextResponse.json(assignments);
  } catch (error) {
    console.error("Error fetching client assignments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
