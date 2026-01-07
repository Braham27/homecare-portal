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

    // Only caregivers and nurses can access their training
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

    // Get all training assignments for this employee
    const employeeTrainings = await prisma.employeeTraining.findMany({
      where: {
        employeeId: employee.id,
      },
      include: {
        training: true,
      },
      orderBy: [
        { training: { isRequired: "desc" } },
        { completedAt: "asc" },
        { training: { title: "asc" } },
      ],
    });

    return NextResponse.json(employeeTrainings);
  } catch (error) {
    console.error("Error fetching employee training:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
