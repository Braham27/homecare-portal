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

    // Get client for logged-in user
    const client = await prisma.client.findFirst({
      where: { userId: session.user.id },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const visits = await prisma.visit.findMany({
      where: { clientId: client.id },
      include: {
        employee: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { scheduledStart: "asc" },
    });

    const formattedVisits = visits.map((visit) => ({
      id: visit.id,
      date: visit.scheduledStart.toISOString().split("T")[0],
      startTime: new Date(visit.scheduledStart).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      endTime: new Date(visit.scheduledEnd).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      caregiver: visit.employee
        ? `${visit.employee.user.firstName} ${visit.employee.user.lastName}`
        : "Unassigned",
      serviceType: visit.serviceType || "Personal Care",
      status: visit.status === "COMPLETED" ? "confirmed" : "scheduled",
      tasks: ["Bathing assistance", "Medication reminder", "Meal preparation"],
    }));

    return NextResponse.json({ visits: formattedVisits });
  } catch (error) {
    console.error("Error fetching client visits:", error);
    return NextResponse.json(
      { error: "Failed to fetch visits" },
      { status: 500 }
    );
  }
}
