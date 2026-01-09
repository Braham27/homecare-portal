"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft } from "lucide-react";

interface Client {
  id: string;
  clientNumber: string;
  dateOfBirth: string;
  primaryPhone: string;
  secondaryPhone?: string;
  emergencyContact: string;
  emergencyPhone: string;
  emergencyRelation: string;
  payerType: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  address: string;
  city: string;
  state: string;
  zipCode: string;
  primaryDiagnosis?: string;
  allergies?: string;
  medications?: string;
}

export default function EditClientPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchClient();
  }, [params.id]);

  const fetchClient = async () => {
    try {
      const response = await fetch(`/api/admin/clients/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch client");
      
      const data = await response.json();
      // API returns client directly, not wrapped in data.client
      setClient(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      primaryPhone: formData.get("primaryPhone") as string,
      secondaryPhone: formData.get("secondaryPhone") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      zipCode: formData.get("zipCode") as string,
      emergencyContact: formData.get("emergencyContact") as string,
      emergencyPhone: formData.get("emergencyPhone") as string,
      emergencyRelation: formData.get("emergencyRelation") as string,
      payerType: formData.get("payerType") as string,
      primaryDiagnosis: formData.get("primaryDiagnosis") as string,
      allergies: formData.get("allergies") as string,
      medications: formData.get("medications") as string,
    };

    try {
      const response = await fetch(`/api/admin/clients?id=${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update client");
      }

      router.push(`/admin/clients/${params.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error && !client) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!client) return null;

  return (
    <div className="space-y-6">
      <div>
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Client</h1>
        <p className="text-gray-600">{client.clientNumber}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input 
                    id="firstName" 
                    name="firstName" 
                    defaultValue={client.user.firstName}
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input 
                    id="lastName" 
                    name="lastName" 
                    defaultValue={client.user.lastName}
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email"
                    defaultValue={client.user.email}
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryPhone">Primary Phone *</Label>
                  <Input 
                    id="primaryPhone" 
                    name="primaryPhone" 
                    defaultValue={client.primaryPhone}
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryPhone">Secondary Phone</Label>
                  <Input 
                    id="secondaryPhone" 
                    name="secondaryPhone" 
                    defaultValue={client.secondaryPhone || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payerType">Payer Type *</Label>
                  <select
                    id="payerType"
                    name="payerType"
                    defaultValue={client.payerType}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="PRIVATE_PAY">Private Pay</option>
                    <option value="MEDICAID">Medicaid</option>
                    <option value="MEDICARE">Medicare</option>
                    <option value="INSURANCE">Insurance</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address *</Label>
                <Input 
                  id="address" 
                  name="address" 
                  defaultValue={client.address}
                  required 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input 
                    id="city" 
                    name="city" 
                    defaultValue={client.city}
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input 
                    id="state" 
                    name="state" 
                    defaultValue={client.state}
                    required 
                    maxLength={2} 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input 
                    id="zipCode" 
                    name="zipCode" 
                    defaultValue={client.zipCode}
                    required 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Name *</Label>
                  <Input 
                    id="emergencyContact" 
                    name="emergencyContact" 
                    defaultValue={client.emergencyContact}
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Phone *</Label>
                  <Input 
                    id="emergencyPhone" 
                    name="emergencyPhone" 
                    defaultValue={client.emergencyPhone}
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyRelation">Relationship *</Label>
                  <Input 
                    id="emergencyRelation" 
                    name="emergencyRelation" 
                    defaultValue={client.emergencyRelation}
                    required 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Medical Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primaryDiagnosis">Primary Diagnosis</Label>
                <Input 
                  id="primaryDiagnosis" 
                  name="primaryDiagnosis" 
                  defaultValue={client.primaryDiagnosis || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea 
                  id="allergies" 
                  name="allergies" 
                  defaultValue={client.allergies || ""}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medications">Medications</Label>
                <Textarea 
                  id="medications" 
                  name="medications" 
                  defaultValue={client.medications || ""}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
