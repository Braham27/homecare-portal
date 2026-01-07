import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logPHIAccess } from "@/lib/audit";

// GET single client
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        carePlan: true,
        insuranceInfo: true,
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Check authorization
    const isAdmin = ["ADMIN", "SCHEDULER", "BILLING_STAFF"].includes(session.user.role);
    const isOwnClient = session.user.role === "CLIENT" && client.userId === session.user.id;
    
    if (!isAdmin && !isOwnClient) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Log PHI access
    await logPHIAccess({
      userId: session.user.id,
      entityType: "Client",
      entityId: id,
      action: "READ",
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error("Error fetching client:", error);
    return NextResponse.json(
      { error: "Failed to fetch client" },
      { status: 500 }
    );
  }
}

// PUT update a client
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session || !["ADMIN", "SCHEDULER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const client = await prisma.client.update({
      where: { id },
      data: {
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
        address: body.address,
        city: body.city,
        state: body.state,
        zipCode: body.zipCode,
        emergencyContact: body.emergencyContact,
        emergencyPhone: body.emergencyPhone,
        emergencyRelation: body.emergencyRelation,
        primaryDiagnosis: body.primaryDiagnosis,
        allergies: body.allergies,
        medications: body.medications,
        specialInstructions: body.specialInstructions,
        payerType: body.payerType,
        status: body.status,
      },
    });

    // Log the update
    await logPHIAccess({
      userId: session.user.id,
      entityType: "Client",
      entityId: id,
      action: "UPDATE",
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

// DELETE a client (soft delete)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.client.update({
      where: { id },
      data: { status: "INACTIVE" },
    });

    // Log the deletion
    await logPHIAccess({
      userId: session.user.id,
      entityType: "Client",
      entityId: id,
      action: "DELETE",
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
