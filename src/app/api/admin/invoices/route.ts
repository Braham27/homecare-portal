import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET - Fetch all invoices
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "BILLING_STAFF"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const clientId = searchParams.get("clientId");

    const whereClause: Record<string, unknown> = {};
    
    if (status && status !== "all") {
      whereClause.status = status.toUpperCase();
    }

    if (clientId) {
      whereClause.clientId = clientId;
    }

    const invoicesRaw = await prisma.invoice.findMany({
      where: whereClause,
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
        lineItems: true,
        payments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const invoices = invoicesRaw.map((invoice: typeof invoicesRaw[number]) => {
      const totalPaid = invoice.payments.reduce((sum: number, p: { amount: unknown }) => sum + Number(p.amount), 0);

      return {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        client: {
          user: {
            firstName: invoice.client.user.firstName,
            lastName: invoice.client.user.lastName,
          },
          clientNumber: invoice.client.clientNumber,
        },
        clientId: invoice.client.id,
        total: Number(invoice.total),
        subtotal: Number(invoice.subtotal),
        tax: Number(invoice.tax),
        discount: Number(invoice.discount),
        amountPaid: totalPaid,
        amountDue: Number(invoice.amountDue),
        createdAt: invoice.createdAt.toISOString(),
        billingPeriodStart: invoice.billingPeriodStart.toISOString().split("T")[0],
        billingPeriodEnd: invoice.billingPeriodEnd.toISOString().split("T")[0],
        dueDate: invoice.dueDate.toISOString().split("T")[0],
        status: invoice.status,
        payerType: invoice.payerType,
        lineItems: invoice.lineItems.map((item: typeof invoice.lineItems[number]) => ({
          id: item.id,
          description: item.description,
          serviceDate: item.serviceDate.toISOString().split("T")[0],
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          total: Number(item.total),
        })),
        paidAt: invoice.paidAt?.toISOString() || null,
      };
    });

    // Fetch recent payments
    const payments = await prisma.payment.findMany({
      include: {
        invoice: {
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
        },
      },
      orderBy: {
        receivedAt: "desc",
      },
      take: 50, // Limit to recent 50 payments
    });

    return NextResponse.json({ invoices, payments });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}

// POST - Create a new invoice
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "BILLING_STAFF"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      clientId,
      billingPeriodStart,
      billingPeriodEnd,
      dueDate,
      lineItems,
      taxRate = 0,
      notes,
    } = body;

    if (!clientId || !billingPeriodStart || !billingPeriodEnd || !dueDate || !lineItems || lineItems.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = lineItems.reduce((sum: number, item: { quantity: number; unitPrice: number }) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);
    
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;

    // Get client to determine payer type
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    // Generate invoice number
    const year = new Date().getFullYear();
    const lastInvoice = await prisma.invoice.findFirst({
      where: {
        invoiceNumber: {
          startsWith: `INV-${year}`,
        },
      },
      orderBy: { invoiceNumber: "desc" },
    });
    
    const lastNumber = lastInvoice 
      ? parseInt(lastInvoice.invoiceNumber.split("-")[2]) 
      : 0;
    const invoiceNumber = `INV-${year}-${String(lastNumber + 1).padStart(3, "0")}`;

    // Create invoice with line items in a transaction
    const invoice = await prisma.$transaction(async (tx) => {
      const newInvoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          clientId,
          billingPeriodStart: new Date(billingPeriodStart),
          billingPeriodEnd: new Date(billingPeriodEnd),
          subtotal,
          tax,
          discount: 0,
          total,
          amountPaid: 0,
          amountDue: total,
          status: "DRAFT",
          dueDate: new Date(dueDate),
          payerType: client.payerType,
          notes,
        },
      });

      // Create line items
      for (const item of lineItems) {
        await tx.invoiceLineItem.create({
          data: {
            invoiceId: newInvoice.id,
            description: item.description,
            serviceDate: new Date(item.serviceDate || billingPeriodStart),
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice,
            serviceCode: item.serviceCode || null,
          },
        });
      }

      return newInvoice;
    });

    return NextResponse.json({
      success: true,
      invoice: {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
      },
      message: "Invoice created successfully",
    });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}
