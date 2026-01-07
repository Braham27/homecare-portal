import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

// GET - Fetch all clients with related data OR single client by ID
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "SCHEDULER", "BILLING_STAFF", "HR_STAFF"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // If ID is provided, fetch single client
    if (id) {
      const client = await prisma.client.findUnique({
        where: { id },
        include: {
          user: true,
        },
      });

      if (!client) {
        return NextResponse.json({ error: "Client not found" }, { status: 404 });
      }

      return NextResponse.json({ client });
    }

    const whereClause: Record<string, unknown> = {};
    
    if (status && status !== "all") {
      whereClause.status = status.toUpperCase();
    }

    const clients = await prisma.client.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            status: true,
          },
        },
        carePlan: {
          select: {
            id: true,
            hoursPerWeek: true,
            status: true,
          },
        },
        assignments: {
          where: {
            isPrimary: true,
            endDate: null,
          },
          include: {
            employee: {
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
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the data for the frontend
    const transformedClients = clients.map((client: typeof clients[number]) => {
      const primaryAssignment = client.assignments[0];
      const primaryCaregiver = primaryAssignment
        ? `${primaryAssignment.employee.user.firstName} ${primaryAssignment.employee.user.lastName}`
        : null;

      return {
        id: client.id,
        clientNumber: client.clientNumber,
        firstName: client.user.firstName,
        lastName: client.user.lastName,
        email: client.user.email,
        phone: client.primaryPhone,
        dateOfBirth: client.dateOfBirth.toISOString().split("T")[0],
        address: client.address,
        city: client.city,
        state: client.state,
        zipCode: client.zipCode,
        payerType: client.payerType,
        status: client.status.toLowerCase(),
        userStatus: client.user.status.toLowerCase(),
        primaryCaregiver,
        weeklyHours: client.carePlan?.hoursPerWeek ? Number(client.carePlan.hoursPerWeek) : 0,
        carePlanStatus: client.carePlan?.status || null,
      };
    }).filter((client: { firstName: string; lastName: string; clientNumber: string; email: string }) => {
      if (!search) return true;
      const searchLower = search.toLowerCase();
      return (
        client.firstName.toLowerCase().includes(searchLower) ||
        client.lastName.toLowerCase().includes(searchLower) ||
        client.clientNumber.toLowerCase().includes(searchLower) ||
        client.email.toLowerCase().includes(searchLower)
      );
    });

    return NextResponse.json(transformedClients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}

// POST - Create a new client
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "SCHEDULER", "HR_STAFF"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      dateOfBirth,
      address,
      city,
      state,
      zipCode,
      phone,
      emergencyContact,
      emergencyPhone,
      emergencyRelation,
      payerType,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !dateOfBirth || !address || !city || !state || !zipCode || !phone || !emergencyContact || !emergencyPhone || !emergencyRelation) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 400 }
      );
    }

    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8) + "A1!";
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    // Generate client number
    const lastClient = await prisma.client.findFirst({
      orderBy: { clientNumber: "desc" },
    });
    const lastNumber = lastClient 
      ? parseInt(lastClient.clientNumber.replace("CLT-", "")) 
      : 0;
    const clientNumber = `CLT-${String(lastNumber + 1).padStart(5, "0")}`;

    // Create user and client in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the user
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          passwordHash,
          firstName,
          lastName,
          phone,
          role: "CLIENT",
          status: "PENDING",
        },
      });

      // Create the client
      const client = await tx.client.create({
        data: {
          userId: user.id,
          clientNumber,
          dateOfBirth: new Date(dateOfBirth),
          address,
          city,
          state,
          zipCode,
          primaryPhone: phone,
          emergencyContact,
          emergencyPhone,
          emergencyRelation,
          payerType: payerType || "PRIVATE_PAY",
          status: "PENDING_ASSESSMENT",
        },
      });

      return { user, client, tempPassword };
    });

    return NextResponse.json({
      success: true,
      client: {
        id: result.client.id,
        clientNumber: result.client.clientNumber,
        userId: result.user.id,
      },
      tempPassword: result.tempPassword,
      message: "Client created successfully",
    });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 }
    );
  }
}

// PUT - Update a client
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "HR_STAFF"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Client ID required" }, { status: 400 });
    }

    const data = await request.json();

    const client = await prisma.client.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Update user info
    await prisma.user.update({
      where: { id: client.userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      },
    });

    // Update client info
    const updatedClient = await prisma.client.update({
      where: { id },
      data: {
        primaryPhone: data.primaryPhone,
        secondaryPhone: data.secondaryPhone || null,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        emergencyContact: data.emergencyContact,
        emergencyPhone: data.emergencyPhone,
        emergencyRelation: data.emergencyRelation,
        payerType: data.payerType,
        primaryDiagnosis: data.primaryDiagnosis || null,
        allergies: data.allergies || null,
        medications: data.medications || null,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json({ client: updatedClient });
  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json(
      { error: "Failed to update client" },
      { status: 500 }
    );
  }
}
