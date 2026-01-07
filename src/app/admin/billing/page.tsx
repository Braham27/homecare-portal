"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Download,
  Send,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  RefreshCw,
  Loader2,
  FileText,
} from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  client: {
    user: {
      firstName: string;
      lastName: string;
    };
    clientNumber: string;
  };
  total: number;
  amountDue: number;
  createdAt: string;
  dueDate: string;
  status: string;
  payerType: string;
  paidAt: string | null;
}

interface Payment {
  id: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  invoice: {
    invoiceNumber: string;
    client: {
      user: {
        firstName: string;
        lastName: string;
      };
    };
  };
}

// Claims are not yet in the database, so we keep placeholder data
const claims = [
  {
    id: "1",
    claimNumber: "CLM-2026-001",
    client: "Robert Williams",
    payer: "State Medicaid",
    amount: 1200.00,
    serviceDate: "2025-12-16",
    submittedDate: "2025-12-20",
    status: "submitted",
  },
  {
    id: "2",
    claimNumber: "CLM-2025-089",
    client: "Margaret Anderson",
    payer: "Blue Cross",
    amount: 800.00,
    serviceDate: "2025-12-01",
    submittedDate: "2025-12-05",
    status: "denied",
    denialReason: "Missing documentation",
  },
];

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/invoices");
      if (!response.ok) {
        throw new Error("Failed to fetch invoices");
      }
      const data = await response.json();
      setInvoices(data.invoices || []);
      setPayments(data.payments || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const pendingAmount = invoices
    .filter((inv) => inv.status === "PENDING" || inv.status === "OVERDUE")
    .reduce((sum, inv) => sum + inv.amountDue, 0);

  const overdueCount = invoices.filter((inv) => inv.status === "OVERDUE").length;

  const paidThisMonth = invoices
    .filter((inv) => {
      if (inv.status !== "PAID" || !inv.paidAt) return false;
      const paidDate = new Date(inv.paidAt);
      const now = new Date();
      return paidDate.getMonth() === now.getMonth() && paidDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, inv) => sum + inv.total, 0);

  const filteredInvoices = invoices.filter((invoice) => {
    const clientName = `${invoice.client.user.firstName} ${invoice.client.user.lastName}`;
    const matchesSearch =
      `${invoice.invoiceNumber} ${clientName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || invoice.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
          <p className="text-gray-600">Manage invoices, payments, and claims</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchInvoices}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <Link href="/admin/billing/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Invoice
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Paid (MTD)</p>
                <p className="text-xl font-bold">${paidThisMonth.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-xl font-bold">${pendingAmount.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Overdue</p>
                <p className="text-xl font-bold">{overdueCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Send className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Claims Pending</p>
                <p className="text-xl font-bold">
                  {claims.filter((c) => c.status === "submitted").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Failed to load invoices</h3>
              <p className="mt-2 text-gray-500">{error}</p>
              <Button className="mt-4" onClick={fetchInvoices}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && !error && (
      <Tabs defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices">Invoices ({invoices.length})</TabsTrigger>
          <TabsTrigger value="claims">Insurance Claims</TabsTrigger>
          <TabsTrigger value="payments">Payments ({payments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="mt-6 space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                  aria-label="Filter by status"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Empty State */}
          {filteredInvoices.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">No invoices found</h3>
                  <p className="mt-2 text-gray-500">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your search or filter."
                      : "Create your first invoice to get started."}
                  </p>
                  <Button className="mt-4" asChild>
                    <Link href="/admin/billing/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Invoice
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
          /* Invoices Table */
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>
                {filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Invoice</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Client</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Due Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Payer</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((invoice) => {
                      const clientName = `${invoice.client.user.firstName} ${invoice.client.user.lastName}`;
                      return (
                      <tr key={invoice.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(invoice.createdAt).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-gray-900">{clientName}</p>
                          <p className="text-sm text-gray-500">{invoice.client.clientNumber}</p>
                        </td>
                        <td className="py-4 px-4 font-medium">
                          ${invoice.total.toFixed(2)}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full">
                            {invoice.payerType.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                              invoice.status === "PAID"
                                ? "bg-green-100 text-green-700"
                                : invoice.status === "OVERDUE"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {invoice.status === "PAID" ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : invoice.status === "OVERDUE" ? (
                              <AlertCircle className="h-3 w-3" />
                            ) : (
                              <Clock className="h-3 w-3" />
                            )}
                            {invoice.status.toLowerCase()}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                            {invoice.status !== "PAID" && (
                              <Button variant="ghost" size="icon">
                                <Send className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          )}
        </TabsContent>

        <TabsContent value="claims" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Insurance Claims</CardTitle>
              <CardDescription>Track Medicaid and insurance claim submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Claim #</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Client</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Payer</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Submitted</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claims.map((claim) => (
                      <tr key={claim.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4 font-medium">{claim.claimNumber}</td>
                        <td className="py-4 px-4">{claim.client}</td>
                        <td className="py-4 px-4">{claim.payer}</td>
                        <td className="py-4 px-4">${claim.amount.toFixed(2)}</td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {new Date(claim.submittedDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              claim.status === "submitted"
                                ? "bg-blue-100 text-blue-700"
                                : claim.status === "denied"
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {claim.status}
                          </span>
                          {claim.denialReason && (
                            <p className="text-xs text-red-600 mt-1">{claim.denialReason}</p>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">View</Button>
                            {claim.status === "denied" && (
                              <Button variant="outline" size="sm">Resubmit</Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>Payment history and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No payments recorded yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Invoice</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Client</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Method</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => {
                        const clientName = `${payment.invoice.client.user.firstName} ${payment.invoice.client.user.lastName}`;
                        return (
                          <tr key={payment.id} className="border-b hover:bg-gray-50">
                            <td className="py-4 px-4 font-medium">{payment.invoice.invoiceNumber}</td>
                            <td className="py-4 px-4">{clientName}</td>
                            <td className="py-4 px-4 text-green-600 font-medium">
                              +${payment.amount.toFixed(2)}
                            </td>
                            <td className="py-4 px-4 text-sm">
                              {payment.paymentMethod.replace("_", " ")}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">
                              {new Date(payment.paymentDate).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      )}
    </div>
  );
}
