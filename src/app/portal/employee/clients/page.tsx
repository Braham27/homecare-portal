"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Phone,
  MapPin,
  Clock,
  FileText,
  AlertTriangle,
  Heart,
  Pill,
  User,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Client {
  id: string;
  clientNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  primaryPhone: string;
  emergencyContact: string;
  emergencyPhone: string;
  emergencyRelation: string;
  primaryDiagnosis: string | null;
  allergies: string | null;
  medications: string | null;
  specialInstructions: string | null;
  status: string;
  user: {
    firstName: string;
    lastName: string;
  };
  carePlan: {
    id: string;
    hoursPerWeek: number | null;
    goals: string | null;
    mobilityStatus: string | null;
    cognitiveStatus: string | null;
    safetyRisks: string | null;
    tasks: {
      id: string;
      category: string;
      taskName: string;
      description: string | null;
      frequency: string | null;
    }[];
  } | null;
}

interface Assignment {
  id: string;
  isPrimary: boolean;
  startDate: string;
  client: Client;
}

export default function EmployeeClientsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/employee/clients");
      
      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }
      
      const data = await response.json();
      setAssignments(data);
      
      // Auto-select first client if available
      if (data.length > 0) {
        setSelectedClient(data[0].client);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const clientName = `${assignment.client.user.firstName} ${assignment.client.user.lastName}`.toLowerCase();
    return clientName.includes(searchTerm.toLowerCase()) || 
           assignment.client.clientNumber.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="h-[400px] bg-gray-100 rounded-lg animate-pulse" />
          <div className="lg:col-span-2 h-[400px] bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <h2 className="text-xl font-semibold mb-2">Error Loading Clients</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={fetchAssignments}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Clients</h1>
        <p className="text-gray-600">View client information and care plans</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Client List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Assigned Clients</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredAssignments.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No clients found</p>
              </div>
            ) : (
              <div className="divide-y max-h-[500px] overflow-y-auto">
                {filteredAssignments.map((assignment) => (
                  <button
                    key={assignment.id}
                    onClick={() => setSelectedClient(assignment.client)}
                    className={cn(
                      "w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between",
                      selectedClient?.id === assignment.client.id && "bg-primary/5 border-l-2 border-l-primary"
                    )}
                  >
                    <div>
                      <p className="font-medium">
                        {assignment.client.user.firstName} {assignment.client.user.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{assignment.client.clientNumber}</p>
                      {assignment.isPrimary && (
                        <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Primary
                        </span>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Client Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedClient ? (
            <>
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>
                        {selectedClient.user.firstName} {selectedClient.user.lastName}
                      </CardTitle>
                      <CardDescription>{selectedClient.clientNumber}</CardDescription>
                    </div>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium",
                      selectedClient.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    )}>
                      {selectedClient.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Address</p>
                        <p>{selectedClient.address}</p>
                        <p>{selectedClient.city}, {selectedClient.state} {selectedClient.zipCode}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p>{selectedClient.primaryPhone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100">
                    <p className="text-sm font-medium text-red-800 mb-2">Emergency Contact</p>
                    <div className="grid sm:grid-cols-2 gap-2 text-sm">
                      <p><span className="text-gray-600">Name:</span> {selectedClient.emergencyContact}</p>
                      <p><span className="text-gray-600">Relation:</span> {selectedClient.emergencyRelation}</p>
                      <p><span className="text-gray-600">Phone:</span> {selectedClient.emergencyPhone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Medical Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Medical Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Primary Diagnosis</p>
                      <p>{selectedClient.primaryDiagnosis || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        Allergies
                      </p>
                      <p className={selectedClient.allergies ? "text-orange-700 font-medium" : ""}>
                        {selectedClient.allergies || "No known allergies"}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                        <Pill className="h-4 w-4 text-blue-500" />
                        Medications
                      </p>
                      <p className="whitespace-pre-wrap">{selectedClient.medications || "None listed"}</p>
                    </div>
                    {selectedClient.specialInstructions && (
                      <div className="sm:col-span-2 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                        <p className="text-sm font-medium text-yellow-800 mb-1">Special Instructions</p>
                        <p className="text-yellow-900 whitespace-pre-wrap">{selectedClient.specialInstructions}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Care Plan Tasks */}
              {selectedClient.carePlan && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Care Plan
                      </CardTitle>
                      {selectedClient.carePlan.hoursPerWeek && (
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {Number(selectedClient.carePlan.hoursPerWeek)} hrs/week
                        </span>
                      )}
                    </div>
                    {selectedClient.carePlan.goals && (
                      <CardDescription className="mt-2">{selectedClient.carePlan.goals}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    {/* Status Information */}
                    <div className="grid sm:grid-cols-3 gap-4 mb-6">
                      {selectedClient.carePlan.mobilityStatus && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs font-medium text-gray-500">Mobility</p>
                          <p className="text-sm">{selectedClient.carePlan.mobilityStatus}</p>
                        </div>
                      )}
                      {selectedClient.carePlan.cognitiveStatus && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs font-medium text-gray-500">Cognitive</p>
                          <p className="text-sm">{selectedClient.carePlan.cognitiveStatus}</p>
                        </div>
                      )}
                      {selectedClient.carePlan.safetyRisks && (
                        <div className="p-3 bg-red-50 rounded-lg">
                          <p className="text-xs font-medium text-red-600">Safety Risks</p>
                          <p className="text-sm text-red-700">{selectedClient.carePlan.safetyRisks}</p>
                        </div>
                      )}
                    </div>

                    {/* Tasks */}
                    {selectedClient.carePlan.tasks.length > 0 ? (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">Care Tasks</p>
                        {Object.entries(
                          selectedClient.carePlan.tasks.reduce((acc, task) => {
                            if (!acc[task.category]) acc[task.category] = [];
                            acc[task.category].push(task);
                            return acc;
                          }, {} as Record<string, typeof selectedClient.carePlan.tasks>)
                        ).map(([category, tasks]) => (
                          <div key={category} className="border rounded-lg p-4">
                            <p className="font-medium text-sm text-primary mb-2">{category}</p>
                            <ul className="space-y-2">
                              {tasks.map((task) => (
                                <li key={task.id} className="flex items-start gap-2 text-sm">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                  <div>
                                    <span className="font-medium">{task.taskName}</span>
                                    {task.frequency && (
                                      <span className="text-gray-500 ml-2">({task.frequency})</span>
                                    )}
                                    {task.description && (
                                      <p className="text-gray-500 text-xs mt-0.5">{task.description}</p>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No care tasks defined</p>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a client to view their information</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
