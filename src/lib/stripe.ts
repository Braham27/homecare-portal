import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
});

// Create a payment intent for an invoice
export async function createPaymentIntent({
  amount,
  currency = 'usd',
  customerId,
  invoiceId,
  metadata = {},
}: {
  amount: number; // in cents
  currency?: string;
  customerId?: string;
  invoiceId?: string;
  metadata?: Record<string, string>;
}) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    customer: customerId,
    metadata: {
      invoiceId: invoiceId || '',
      ...metadata,
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return paymentIntent;
}

// Create or get a Stripe customer
export async function createOrGetCustomer({
  email,
  name,
  phone,
  userId,
}: {
  email: string;
  name: string;
  phone?: string;
  userId: string;
}) {
  // Check if customer already exists
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0];
  }

  // Create new customer
  const customer = await stripe.customers.create({
    email,
    name,
    phone,
    metadata: {
      userId,
    },
  });

  return customer;
}

// Create a setup intent for saving payment methods
export async function createSetupIntent(customerId: string) {
  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return setupIntent;
}

// Get customer's payment methods
export async function getPaymentMethods(customerId: string) {
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerId,
    type: 'card',
  });

  return paymentMethods.data;
}

// Charge a saved payment method
export async function chargePaymentMethod({
  amount,
  currency = 'usd',
  customerId,
  paymentMethodId,
  invoiceId,
}: {
  amount: number;
  currency?: string;
  customerId: string;
  paymentMethodId: string;
  invoiceId?: string;
}) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    customer: customerId,
    payment_method: paymentMethodId,
    off_session: true,
    confirm: true,
    metadata: {
      invoiceId: invoiceId || '',
    },
  });

  return paymentIntent;
}

// Create a subscription for premium services
export async function createSubscription({
  customerId,
  priceId,
  metadata = {},
}: {
  customerId: string;
  priceId: string;
  metadata?: Record<string, string>;
}) {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    metadata,
    payment_behavior: 'default_incomplete',
    payment_settings: {
      save_default_payment_method: 'on_subscription',
    },
    expand: ['latest_invoice.payment_intent'],
  });

  return subscription;
}

// Cancel a subscription
export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.cancel(subscriptionId);
  return subscription;
}

// Create a refund
export async function createRefund({
  paymentIntentId,
  amount,
  reason,
}: {
  paymentIntentId: string;
  amount?: number;
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer';
}) {
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount,
    reason,
  });

  return refund;
}

// Webhook event handler
export async function handleWebhookEvent(
  body: string | Buffer,
  signature: string
) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set');
  }

  const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

  return event;
}

// Convert dollars to cents for Stripe
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

// Convert cents to dollars
export function centsToDollars(cents: number): number {
  return cents / 100;
}
