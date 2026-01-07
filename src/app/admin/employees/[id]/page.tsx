"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Mail, Phone, MapPin, Calendar, DollarSign } from "lucide-react";

interface Employee {
  id: string;
  employeeNumber: string;
  type: string;
  hireDate: string;
  hourlyRate: number;
  status: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export default function EmployeeDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmployee();
  }, [params.id]);

  const fetchEmployee = async () => {
    try {
      const response = await fetch(`/api/admin/employees?id=${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch employee");
      
      const data = await response.json();
      setEmployee(data.employee);
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

  if (error || !employee) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error || "Employee not found"}
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
            {employee.user.firstName} {employee.user.lastName}
          </h1>
          <p className="text-gray-600">{employee.employeeNumber}</p>
        </div>
        <Button onClick={() => router.push(`/admin/employees/${employee.id}/edit`)}>
          Edit Employee
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{employee.user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Hire Date</p>
                <p className="font-medium">{new Date(employee.hireDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Hourly Rate</p>
                <p className="font-medium">${employee.hourlyRate.toFixed(2)}/hr</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Employee Type</p>
              <p className="font-medium">{employee.type}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                employee.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
              }`}>
                {employee.status}
              </span>
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
                <p className="font-medium">{employee.address}</p>
                <p className="text-gray-600">
                  {employee.city}, {employee.state} {employee.zipCode}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
