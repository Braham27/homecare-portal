"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CreditCard,
  Lock,
  CheckCircle,
  DollarSign,
  Calendar,
  AlertCircle,
  Shield,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank">("card");
  const [paymentComplete, setPaymentComplete] = useState(false);

  // Mock invoice data
  const invoice = {
    invoiceNumber: "INV-2026-001",
    invoiceDate: "2026-01-01",
    dueDate: "2026-01-15",
    amount: 1250.00,
    services: [
      { description: "Personal Care Services - Week 1", hours: 20, rate: 30, amount: 600 },
      { description: "Personal Care Services - Week 2", hours: 20, rate: 30, amount: 600 },
      { description: "Care Coordination Fee", hours: 1, rate: 50, amount: 50 },
    ],
    subtotal: 1250.00,
    tax: 0,
    total: 1250.00,
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock payment processing - would integrate with Stripe
    setTimeout(() => {
      setPaymentComplete(true);
    }, 1500);
  };

  if (paymentComplete) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-500 rounded-full">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Your payment of ${invoice.total.toFixed(2)} has been processed successfully.
            </p>
            <div className="bg-white rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-left">
                  <p className="text-gray-500">Confirmation Number</p>
                  <p className="font-semibold text-gray-900">PAY-{Date.now()}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              A receipt has been sent to your email address on file.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/portal/client/billing">
                <Button variant="outline">View Billing History</Button>
              </Link>
              <Button onClick={() => window.print()}>Print Receipt</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/portal/client/billing">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Billing
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Make a Payment</h1>
        <p className="text-gray-600">Secure payment processing powered by Stripe</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Method Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Choose how you would like to pay</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 border-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    paymentMethod === "card"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <CreditCard className="h-5 w-5" />
                  <span className="font-medium">Credit/Debit Card</span>
                </button>
                <button
                  onClick={() => setPaymentMethod("bank")}
                  className={`p-4 border-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    paymentMethod === "bank"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <DollarSign className="h-5 w-5" />
                  <span className="font-medium">Bank Account</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details Form */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>
                {paymentMethod === "card"
                  ? "Enter your card information"
                  : "Enter your bank account details"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment} className="space-y-4">
                {paymentMethod === "card" ? (
                  <>
                    <div>
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <div className="relative mt-1">
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          required
                          maxLength={19}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
                          <CreditCard className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiration Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          required
                          maxLength={5}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          required
                          maxLength={4}
                          type="password"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="accountName">Account Holder Name</Label>
                      <Input
                        id="accountName"
                        placeholder="John Doe"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="routingNumber">Routing Number</Label>
                      <Input
                        id="routingNumber"
                        placeholder="123456789"
                        required
                        maxLength={9}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        placeholder="1234567890"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountType">Account Type</Label>
                      <select
                        id="accountType"
                        required
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select account type</option>
                        <option value="checking">Checking</option>
                        <option value="savings">Savings</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Billing Address */}
                <div className="pt-4 border-t">
                  <h3 className="font-semibold text-gray-900 mb-3">Billing Address</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        placeholder="123 Main St"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="City" required className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input id="state" placeholder="CA" required className="mt-1" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input
                          id="zip"
                          placeholder="12345"
                          required
                          maxLength={5}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          defaultValue="United States"
                          disabled
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="savePayment"
                    className="mt-1"
                  />
                  <Label htmlFor="savePayment" className="text-sm font-normal cursor-pointer">
                    Save this payment method for future payments
                  </Label>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Pay ${invoice.total.toFixed(2)}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Secure Payment</p>
                  <p>
                    Your payment information is encrypted and processed securely through Stripe.
                    We never store your complete card or bank account details on our servers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
              <CardDescription>Invoice {invoice.invoiceNumber}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Invoice Date
                  </span>
                  <span className="font-medium">{invoice.invoiceDate}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    Due Date
                  </span>
                  <span className="font-medium">{invoice.dueDate}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Services</h3>
                <div className="space-y-2">
                  {invoice.services.map((service, idx) => (
                    <div key={idx} className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600">{service.description}</span>
                        <span className="font-medium">${service.amount.toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {service.hours} hours × ${service.rate}/hr
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${invoice.tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ${invoice.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Lock className="h-4 w-4" />
                  <span>Secured by Stripe</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
