import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

async function getBillingData(clientId: string) {
  const invoices = await prisma.invoice.findMany({
    where: { clientId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return {
    invoices: invoices.map((inv) => ({
      id: inv.invoiceNumber,
      date: inv.createdAt.toISOString().split("T")[0],
      dueDate: inv.dueDate.toISOString().split("T")[0],
      amount: Number(inv.total),
      status: inv.status.toLowerCase(),
      paidDate: inv.paidAt?.toISOString().split("T")[0],
      period: `${inv.billingPeriodStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${inv.billingPeriodEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
    })),
  };
}

export default async function BillingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const client = await prisma.client.findFirst({
    where: { userId: session.user.id },
  });

  if (!client) {
    redirect("/unauthorized");
  }

  const { invoices } = await getBillingData(client.id);

  const paymentMethods = [
    {
      id: "1",
      type: "card",
      brand: "Visa",
      last4: "4242",
      expiry: "12/27",
      isDefault: true,
    },
  ];
  const pendingAmount = invoices
    .filter((inv) => inv.status === "pending")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const paidThisYear = invoices
    .filter((inv) => inv.status === "paid" && inv.date.startsWith("2025"))
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
        <p className="text-gray-600">Manage your invoices and payment methods</p>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount Due</p>
                <p className="text-2xl font-bold">${pendingAmount.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Paid This Year</p>
                <p className="text-2xl font-bold">${paidThisYear.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="text-lg font-medium">
                  {paymentMethods[0]?.brand} •••• {paymentMethods[0]?.last4}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pay Now Button */}
      {pendingAmount > 0 && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold text-gray-900">
                    You have ${pendingAmount.toFixed(2)} due
                  </p>
                  <p className="text-sm text-gray-600">
                    Pay now to avoid any service interruptions
                  </p>
                </div>
              </div>
              <Button size="lg" asChild>
                <Link href="/portal/client/billing/pay">
                  Pay ${pendingAmount.toFixed(2)}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>View and download your invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-2 rounded-lg ${
                          invoice.status === "paid"
                            ? "bg-green-100"
                            : "bg-orange-100"
                        }`}
                      >
                        {invoice.status === "paid" ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-orange-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{invoice.id}</p>
                        <p className="text-sm text-gray-600">{invoice.period}</p>
                        <p className="text-xs text-gray-500">
                          {invoice.status === "paid"
                            ? `Paid on ${new Date(invoice.paidDate!).toLocaleDateString()}`
                            : `Due ${new Date(invoice.dueDate).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-lg">${invoice.amount.toFixed(2)}</p>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            invoice.status === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {invoice.status === "paid" ? "Paid" : "Pending"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                        {invoice.status === "pending" && (
                          <Button size="sm" asChild>
                            <Link href={`/portal/client/billing/pay?invoice=${invoice.id}`}>
                              Pay
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-methods" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your saved payment methods</CardDescription>
              </div>
              <Button>Add Payment Method</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <CreditCard className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {method.brand} •••• {method.last4}
                        </p>
                        <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                      </div>
                      {method.isDefault && (
                        <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      Remove
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Auto-Pay</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Enable auto-pay to automatically pay your invoices on the due date.
                </p>
                <Button variant="outline">Enable Auto-Pay</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
