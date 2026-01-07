import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createPaymentIntent } from "@/lib/stripe";

// POST create a payment intent for an invoice
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { invoiceId } = body;

    // Get the invoice
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        client: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Verify the user can pay this invoice
    const isAdmin = ["ADMIN", "BILLING_STAFF"].includes(session.user.role);
    const isOwnClient = session.user.role === "CLIENT" && invoice.client.userId === session.user.id;

    if (!isAdmin && !isOwnClient) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if invoice is already paid
    if (invoice.status === "PAID") {
      return NextResponse.json({ error: "Invoice already paid" }, { status: 400 });
    }

    // Create Stripe payment intent
    const paymentIntent = await createPaymentIntent({
      amount: Number(invoice.total) * 100, // Convert Decimal to number and to cents
      currency: "usd",
      metadata: {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        clientId: invoice.clientId,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: Number(invoice.total),
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
