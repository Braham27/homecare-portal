import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logPHIAccess } from "@/lib/audit";

// GET all clients (admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !["ADMIN", "SCHEDULER", "BILLING_STAFF"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clients = await prisma.client.findMany({
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
      },
      orderBy: { createdAt: "desc" },
    });

    // Log PHI access
    await logPHIAccess({
      userId: session.user.id,
      entityType: "Client",
      entityId: "all",
      action: "READ",
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}

// POST create a new client
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !["ADMIN", "SCHEDULER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Generate client number
    const lastClient = await prisma.client.findFirst({
      orderBy: { clientNumber: "desc" },
    });
    const nextNumber = lastClient 
      ? parseInt(lastClient.clientNumber.replace("CLT-", "")) + 1 
      : 1;
    const clientNumber = `CLT-${String(nextNumber).padStart(5, "0")}`;

    const client = await prisma.client.create({
      data: {
        user: {
          connect: { id: body.userId },
        },
        clientNumber,
        dateOfBirth: new Date(body.dateOfBirth),
        address: body.address,
        city: body.city,
        state: body.state,
        zipCode: body.zipCode,
        primaryPhone: body.primaryPhone || body.phone || "",
        emergencyContact: body.emergencyContact,
        emergencyPhone: body.emergencyPhone,
        emergencyRelation: body.emergencyRelation,
        primaryDiagnosis: body.primaryDiagnosis,
        allergies: body.allergies,
        medications: body.medications,
        specialInstructions: body.specialInstructions,
        payerType: body.payerType,
      },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Log the creation
    await logPHIAccess({
      userId: session.user.id,
      entityType: "Client",
      entityId: client.id,
      action: "CREATE",
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 }
    );
  }
}
