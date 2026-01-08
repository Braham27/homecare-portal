import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        carePlan: {
          select: {
            id: true,
            goals: true,
            routines: true,
          },
        },
        familyMembers: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        assignments: {
          include: {
            employee: {
              select: {
                id: true,
                employeeNumber: true,
                type: true,
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: { startDate: "desc" },
        },
        visits: {
          orderBy: { scheduledStart: "desc" },
          take: 50,
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error("Error fetching client:", error);
    return NextResponse.json(
      { error: "Failed to fetch client" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const data = await req.json();

    const client = await prisma.client.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        primaryPhone: data.primaryPhone,
        secondaryPhone: data.secondaryPhone,
        emergencyContact: data.emergencyContact,
        emergencyPhone: data.emergencyPhone,
        emergencyRelation: data.emergencyRelation,
        primaryDiagnosis: data.primaryDiagnosis,
        allergies: data.allergies,
        medications: data.medications,
        specialInstructions: data.specialInstructions,
        physicianName: data.physicianName,
        physicianPhone: data.physicianPhone,
        payerType: data.payerType,
        isPremium: data.isPremium,
        status: data.status,
        notes: data.notes,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json(
      { error: "Failed to update client" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Soft delete by setting status to DISCHARGED
    await prisma.client.update({
      where: { id },
      data: {
        status: "DISCHARGED",
        dischargeDate: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json(
      { error: "Failed to delete client" },
      { status: 500 }
    );
  }
}
