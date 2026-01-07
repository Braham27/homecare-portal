"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  DollarSign,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface ServiceRate {
  id: string;
  payerType: string;
  rate: number;
  unitType: string;
  effectiveDate: string;
}

interface Service {
  serviceType: string;
  rates: ServiceRate[];
}

const payerTypes = [
  { value: "PRIVATE_PAY", label: "Private Pay" },
  { value: "MEDICAID", label: "Medicaid" },
  { value: "MEDICARE", label: "Medicare" },
  { value: "INSURANCE", label: "Insurance" },
  { value: "MIXED", label: "Mixed" },
];

const unitTypes = [
  { value: "Hourly", label: "Per Hour" },
  { value: "Per Visit", label: "Per Visit" },
];

// Default service types commonly used in home care
const defaultServiceTypes = [
  "Personal Care",
  "Companion Care",
  "Homemaker Services",
  "Skilled Nursing",
  "Physical Therapy",
  "Occupational Therapy",
  "Respite Care",
  "Live-In Care",
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state for new service rate
  const [newRate, setNewRate] = useState({
    serviceType: "",
    customServiceType: "",
    payerType: "PRIVATE_PAY",
    rate: "",
    unitType: "Hourly",
    effectiveDate: new Date().toISOString().split("T")[0],
  });

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/services");
      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }
      const data = await response.json();
      setServices(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleAddRate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const serviceType = newRate.serviceType === "custom" 
        ? newRate.customServiceType 
        : newRate.serviceType;

      if (!serviceType) {
        throw new Error("Service type is required");
      }

      const response = await fetch("/api/admin/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceType,
          payerType: newRate.payerType,
          rate: parseFloat(newRate.rate),
          unitType: newRate.unitType,
          effectiveDate: newRate.effectiveDate,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add service rate");
      }

      // Reset form and refresh data
      setNewRate({
        serviceType: "",
        customServiceType: "",
        payerType: "PRIVATE_PAY",
        rate: "",
        unitType: "Hourly",
        effectiveDate: new Date().toISOString().split("T")[0],
      });
      setShowAddForm(false);
      fetchServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRate = async (rateId: string) => {
    if (!confirm("Are you sure you want to deactivate this service rate?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/services?id=${rateId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete service rate");
      }

      fetchServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const getPayerLabel = (payerType: string) => {
    return payerTypes.find((p) => p.value === payerType)?.label || payerType;
  };

  // Get all service types including defaults not yet in the database
  const allServiceTypes = [...new Set([
    ...defaultServiceTypes,
    ...services.map((s) => s.serviceType),
  ])];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600">Manage service types and billing rates</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchServices}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Service Rate
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-red-700">{error}</p>
          <Button variant="ghost" size="sm" onClick={() => setError(null)} className="ml-auto">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Add Service Rate Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Service Rate</CardTitle>
            <CardDescription>Define billing rates for a service type and payer</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddRate} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="serviceType">Service Type *</Label>
                  <select
                    id="serviceType"
                    value={newRate.serviceType}
                    onChange={(e) => setNewRate({ ...newRate, serviceType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    aria-label="Service Type"
                    required
                  >
                    <option value="">Select Service Type</option>
                    {allServiceTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                    <option value="custom">+ Add Custom Type</option>
                  </select>
                </div>
                
                {newRate.serviceType === "custom" && (
                  <div className="space-y-2">
                    <Label htmlFor="customServiceType">Custom Service Name *</Label>
                    <Input
                      id="customServiceType"
                      value={newRate.customServiceType}
                      onChange={(e) => setNewRate({ ...newRate, customServiceType: e.target.value })}
                      placeholder="Enter service name"
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="payerType">Payer Type *</Label>
                  <select
                    id="payerType"
                    value={newRate.payerType}
                    onChange={(e) => setNewRate({ ...newRate, payerType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    aria-label="Payer Type"
                    required
                  >
                    {payerTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rate">Rate ($) *</Label>
                  <Input
                    id="rate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newRate.rate}
                    onChange={(e) => setNewRate({ ...newRate, rate: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unitType">Unit Type *</Label>
                  <select
                    id="unitType"
                    value={newRate.unitType}
                    onChange={(e) => setNewRate({ ...newRate, unitType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    aria-label="Unit Type"
                    required
                  >
                    {unitTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="effectiveDate">Effective Date</Label>
                  <Input
                    id="effectiveDate"
                    type="date"
                    value={newRate.effectiveDate}
                    onChange={(e) => setNewRate({ ...newRate, effectiveDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Add Rate
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Services List */}
      {services.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No service rates defined</h3>
              <p className="mt-2 text-gray-500">
                Get started by adding your first service rate.
              </p>
              <Button className="mt-4" onClick={() => setShowAddForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Service Rate
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {services.map((service) => (
            <Card key={service.serviceType}>
              <CardHeader>
                <CardTitle>{service.serviceType}</CardTitle>
                <CardDescription>
                  {service.rates.length} rate{service.rates.length !== 1 ? "s" : ""} configured
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Payer Type</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Rate</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Unit</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Effective Date</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {service.rates.map((rate) => (
                        <tr key={rate.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {getPayerLabel(rate.payerType)}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-medium">
                            ${rate.rate.toFixed(2)}
                          </td>
                          <td className="py-4 px-4 text-gray-600">
                            {rate.unitType}
                          </td>
                          <td className="py-4 px-4 text-gray-600">
                            {new Date(rate.effectiveDate).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => alert(`Edit functionality for rate ${rate.id} coming soon`)}
                                title="Edit rate"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteRate(rate.id)}
                                title="Delete rate"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Reference</CardTitle>
          <CardDescription>Available service types and their default rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {defaultServiceTypes.map((type) => {
              const service = services.find((s) => s.serviceType === type);
              const hasRates = service && service.rates.length > 0;
              const privatPayRate = service?.rates.find((r) => r.payerType === "PRIVATE_PAY");
              
              return (
                <div
                  key={type}
                  className={`p-4 rounded-lg border ${hasRates ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
                >
                  <p className="font-medium text-gray-900">{type}</p>
                  {hasRates ? (
                    <p className="text-sm text-green-600">
                      {privatPayRate ? `$${privatPayRate.rate.toFixed(2)}/${privatPayRate.unitType === "Hourly" ? "hr" : "visit"}` : "Configured"}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">No rates set</p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
