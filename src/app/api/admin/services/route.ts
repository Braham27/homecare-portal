import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Service types based on the Visit serviceType field and ServiceRate model
// We'll use the ServiceRate model to manage service rates

// GET - Fetch all service rates
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "BILLING_STAFF", "SCHEDULER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const serviceRates = await prisma.serviceRate.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { serviceType: "asc" },
        { payerType: "asc" },
      ],
    });

    // Group by service type
    const servicesMap = new Map<string, {
      serviceType: string;
      rates: Array<{
        id: string;
        payerType: string;
        rate: number;
        unitType: string;
        effectiveDate: string;
      }>;
    }>();

    for (const rate of serviceRates) {
      if (!servicesMap.has(rate.serviceType)) {
        servicesMap.set(rate.serviceType, {
          serviceType: rate.serviceType,
          rates: [],
        });
      }
      servicesMap.get(rate.serviceType)!.rates.push({
        id: rate.id,
        payerType: rate.payerType,
        rate: Number(rate.rate),
        unitType: rate.unitType,
        effectiveDate: rate.effectiveDate.toISOString().split("T")[0],
      });
    }

    const services = Array.from(servicesMap.values());

    return NextResponse.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

// POST - Create a new service rate
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "BILLING_STAFF"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      serviceType,
      payerType,
      rate,
      unitType,
      effectiveDate,
    } = body;

    if (!serviceType || !payerType || rate === undefined || !unitType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if a rate already exists for this service type and payer type
    const existingRate = await prisma.serviceRate.findFirst({
      where: {
        serviceType,
        payerType,
        isActive: true,
      },
    });

    if (existingRate) {
      // Deactivate the old rate
      await prisma.serviceRate.update({
        where: { id: existingRate.id },
        data: {
          isActive: false,
          endDate: new Date(),
        },
      });
    }

    const serviceRate = await prisma.serviceRate.create({
      data: {
        serviceType,
        payerType,
        rate,
        unitType,
        effectiveDate: effectiveDate ? new Date(effectiveDate) : new Date(),
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      serviceRate: {
        id: serviceRate.id,
        serviceType: serviceRate.serviceType,
      },
      message: "Service rate created successfully",
    });
  } catch (error) {
    console.error("Error creating service rate:", error);
    return NextResponse.json(
      { error: "Failed to create service rate" },
      { status: 500 }
    );
  }
}

// DELETE - Deactivate a service rate
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Service rate ID required" },
        { status: 400 }
      );
    }

    await prisma.serviceRate.update({
      where: { id },
      data: {
        isActive: false,
        endDate: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Service rate deactivated successfully",
    });
  } catch (error) {
    console.error("Error deleting service rate:", error);
    return NextResponse.json(
      { error: "Failed to delete service rate" },
      { status: 500 }
    );
  }
}
