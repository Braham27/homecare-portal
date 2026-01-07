"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Mail, Phone, MapPin, Calendar, Users } from "lucide-react";

interface Client {
  id: string;
  clientNumber: string;
  status: string;
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

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchClient();
  }, [params.id]);

  const fetchClient = async () => {
    try {
      const response = await fetch(`/api/admin/clients?id=${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch client");
      
      const data = await response.json();
      setClient(data.client);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error || "Client not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="outline" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            {client.user.firstName} {client.user.lastName}
          </h1>
          <p className="text-gray-600">{client.clientNumber}</p>
        </div>
        <Button onClick={() => router.push(`/admin/clients/${client.id}/edit`)}>
          Edit Client
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{client.user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Primary Phone</p>
                <p className="font-medium">{client.primaryPhone}</p>
              </div>
            </div>

            {client.secondaryPhone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Secondary Phone</p>
                  <p className="font-medium">{client.secondaryPhone}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">{new Date(client.dateOfBirth).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                client.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
              }`}>
                {client.status}
              </span>
            </div>

            <div>
              <p className="text-sm text-gray-500">Payer Type</p>
              <p className="font-medium">{client.payerType.replace(/_/g, " ")}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <p className="font-medium">{client.address}</p>
                <p className="text-gray-600">
                  {client.city}, {client.state} {client.zipCode}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{client.emergencyContact}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{client.emergencyPhone}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Relationship</p>
              <p className="font-medium">{client.emergencyRelation}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Medical Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {client.primaryDiagnosis && (
              <div>
                <p className="text-sm text-gray-500">Primary Diagnosis</p>
                <p className="font-medium">{client.primaryDiagnosis}</p>
              </div>
            )}

            {client.allergies && (
              <div>
                <p className="text-sm text-gray-500">Allergies</p>
                <p className="font-medium">{client.allergies}</p>
              </div>
            )}

            {client.medications && (
              <div>
                <p className="text-sm text-gray-500">Medications</p>
                <p className="font-medium">{client.medications}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
