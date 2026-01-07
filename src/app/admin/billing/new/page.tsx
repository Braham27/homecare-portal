"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Loader2,
  Save,
  Plus,
  Trash2,
  AlertCircle,
  Calculator,
} from "lucide-react";

interface Client {
  id: string;
  clientNumber: string;
  firstName: string;
  lastName: string;
  payerType: string;
}

interface LineItem {
  id: string;
  description: string;
  serviceDate: string;
  quantity: number;
  unitPrice: number;
  serviceCode: string;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);

  const [formData, setFormData] = useState({
    clientId: "",
    billingPeriodStart: "",
    billingPeriodEnd: "",
    dueDate: "",
    taxRate: 0,
    notes: "",
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: "1",
      description: "",
      serviceDate: "",
      quantity: 1,
      unitPrice: 0,
      serviceCode: "",
    },
  ]);

  const fetchClients = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/clients");
      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }
      const data = await response.json();
      setClients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load clients");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Set default dates
  useEffect(() => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const dueDateObj = new Date(today);
    dueDateObj.setDate(dueDateObj.getDate() + 30);

    setFormData((prev) => ({
      ...prev,
      billingPeriodStart: startOfMonth.toISOString().split("T")[0],
      billingPeriodEnd: endOfMonth.toISOString().split("T")[0],
      dueDate: dueDateObj.toISOString().split("T")[0],
    }));

    // Set default service date for first line item
    setLineItems((prev) =>
      prev.map((item, index) =>
        index === 0
          ? { ...item, serviceDate: startOfMonth.toISOString().split("T")[0] }
          : item
      )
    );
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
    setError(null);
  };

  const handleLineItemChange = (
    id: string,
    field: keyof LineItem,
    value: string | number
  ) => {
    setLineItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "quantity" || field === "unitPrice"
                  ? parseFloat(String(value)) || 0
                  : value,
            }
          : item
      )
    );
  };

  const addLineItem = () => {
    const newId = String(Date.now());
    setLineItems((prev) => [
      ...prev,
      {
        id: newId,
        description: "",
        serviceDate: formData.billingPeriodStart,
        quantity: 1,
        unitPrice: 0,
        serviceCode: "",
      },
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length === 1) return;
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (formData.taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const validateForm = (): string | null => {
    if (!formData.clientId) return "Please select a client";
    if (!formData.billingPeriodStart) return "Billing period start date is required";
    if (!formData.billingPeriodEnd) return "Billing period end date is required";
    if (!formData.dueDate) return "Due date is required";
    
    const validLineItems = lineItems.filter(
      (item) => item.description.trim() && item.quantity > 0 && item.unitPrice > 0
    );
    if (validLineItems.length === 0) {
      return "At least one valid line item is required";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const validLineItems = lineItems.filter(
        (item) => item.description.trim() && item.quantity > 0 && item.unitPrice > 0
      );

      const response = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          lineItems: validLineItems.map((item) => ({
            description: item.description,
            serviceDate: item.serviceDate || formData.billingPeriodStart,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            serviceCode: item.serviceCode || null,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create invoice");
      }

      router.push("/admin/billing");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedClient = clients.find((c) => c.id === formData.clientId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/billing">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Invoice</h1>
          <p className="text-gray-600">Generate a new invoice for a client</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client & Period */}
            <Card>
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
                <CardDescription>Select client and billing period</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="clientId">Client *</Label>
                  <select
                    id="clientId"
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    aria-label="Client"
                    required
                  >
                    <option value="">Select a client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.firstName} {client.lastName} ({client.clientNumber})
                      </option>
                    ))}
                  </select>
                  {selectedClient && (
                    <p className="text-sm text-gray-500">
                      Payer Type: {selectedClient.payerType.replace("_", " ")}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billingPeriodStart">Billing Period Start *</Label>
                  <Input
                    id="billingPeriodStart"
                    name="billingPeriodStart"
                    type="date"
                    value={formData.billingPeriodStart}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billingPeriodEnd">Billing Period End *</Label>
                  <Input
                    id="billingPeriodEnd"
                    name="billingPeriodEnd"
                    type="date"
                    value={formData.billingPeriodEnd}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    name="taxRate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.taxRate}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Line Items */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Line Items</CardTitle>
                    <CardDescription>Add services and charges</CardDescription>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Header */}
                  <div className="hidden sm:grid sm:grid-cols-12 gap-4 text-sm font-medium text-gray-500 pb-2 border-b">
                    <div className="col-span-4">Description</div>
                    <div className="col-span-2">Service Date</div>
                    <div className="col-span-2">Qty/Hours</div>
                    <div className="col-span-2">Rate</div>
                    <div className="col-span-1 text-right">Total</div>
                    <div className="col-span-1"></div>
                  </div>

                  {/* Line Items */}
                  {lineItems.map((item) => (
                    <div
                      key={item.id}
                      className="grid sm:grid-cols-12 gap-4 items-start pb-4 border-b last:border-0"
                    >
                      <div className="sm:col-span-4">
                        <Label className="sm:hidden">Description</Label>
                        <Input
                          placeholder="Service description"
                          value={item.description}
                          onChange={(e) =>
                            handleLineItemChange(item.id, "description", e.target.value)
                          }
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="sm:hidden">Service Date</Label>
                        <Input
                          type="date"
                          value={item.serviceDate}
                          onChange={(e) =>
                            handleLineItemChange(item.id, "serviceDate", e.target.value)
                          }
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="sm:hidden">Quantity/Hours</Label>
                        <Input
                          type="number"
                          step="0.5"
                          min="0"
                          placeholder="0"
                          value={item.quantity || ""}
                          onChange={(e) =>
                            handleLineItemChange(item.id, "quantity", e.target.value)
                          }
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="sm:hidden">Rate</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            $
                          </span>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={item.unitPrice || ""}
                            onChange={(e) =>
                              handleLineItemChange(item.id, "unitPrice", e.target.value)
                            }
                            className="pl-7"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-1 flex items-center sm:justify-end">
                        <span className="font-medium">
                          ${(item.quantity * item.unitPrice).toFixed(2)}
                        </span>
                      </div>
                      <div className="sm:col-span-1 flex items-center justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLineItem(item.id)}
                          disabled={lineItems.length === 1}
                        >
                          <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
                <CardDescription>Additional notes for the invoice</CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Add any notes or special instructions..."
                  className="w-full px-3 py-2 border rounded-lg min-h-[100px]"
                />
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Invoice Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                </div>
                {formData.taxRate > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax ({formData.taxRate}%)</span>
                    <span className="font-medium">${calculateTax().toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-green-600">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Create Invoice
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" className="w-full" asChild>
                    <Link href="/admin/billing">Cancel</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
