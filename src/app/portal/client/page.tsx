import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  FileText,
  CreditCard,
  MessageSquare,
  User,
  AlertCircle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

// Mock data - would come from API
const upcomingVisits = [
  {
    id: "1",
    date: "2026-01-05",
    time: "9:00 AM - 1:00 PM",
    caregiver: "Jane Smith",
    serviceType: "Personal Care",
    status: "confirmed",
  },
  {
    id: "2",
    date: "2026-01-07",
    time: "9:00 AM - 1:00 PM",
    caregiver: "Jane Smith",
    serviceType: "Personal Care",
    status: "scheduled",
  },
  {
    id: "3",
    date: "2026-01-09",
    time: "10:00 AM - 2:00 PM",
    caregiver: "Maria Garcia",
    serviceType: "Companion Care",
    status: "scheduled",
  },
];

const recentNotes = [
  {
    id: "1",
    date: "2026-01-03",
    caregiver: "Jane Smith",
    summary: "Client in good spirits. Assisted with bathing and breakfast. Took a short walk.",
  },
  {
    id: "2",
    date: "2026-01-01",
    caregiver: "Jane Smith",
    summary: "Medication reminder given. Light housekeeping completed. Prepared lunch.",
  },
];

const pendingInvoice = {
  id: "INV-2026-001",
  amount: 450.00,
  dueDate: "2026-01-15",
  status: "pending",
};

export default function ClientDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back!</h1>
          <p className="text-gray-600">Here&apos;s an overview of your care services</p>
        </div>
        <Button asChild>
          <Link href="/portal/client/messages">
            <MessageSquare className="mr-2 h-4 w-4" />
            Send Message
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Next Visit</p>
                <p className="font-semibold">Jan 5, 2026</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Hours This Month</p>
                <p className="font-semibold">32 hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Primary Caregiver</p>
                <p className="font-semibold">Jane Smith</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <CreditCard className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Balance Due</p>
                <p className="font-semibold">${pendingInvoice.amount.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Visits */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Visits</CardTitle>
              <CardDescription>Your scheduled care visits</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/portal/client/schedule">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="bg-white p-2 rounded-lg shadow-sm text-center min-w-[60px]">
                    <p className="text-xs text-gray-500">
                      {new Date(visit.date).toLocaleDateString("en-US", { month: "short" })}
                    </p>
                    <p className="text-lg font-bold">
                      {new Date(visit.date).getDate()}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{visit.serviceType}</p>
                    <p className="text-sm text-gray-600">{visit.time}</p>
                    <p className="text-sm text-gray-500">with {visit.caregiver}</p>
                  </div>
                  <div>
                    {visit.status === "confirmed" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                        <CheckCircle className="h-3 w-3" />
                        Confirmed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                        Scheduled
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Care Notes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Care Notes</CardTitle>
              <CardDescription>Updates from your caregivers</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/portal/client/care-plan">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNotes.map((note) => (
                <div key={note.id} className="border-l-2 border-primary pl-4 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900">{note.caregiver}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(note.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{note.summary}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing Alert */}
      {pendingInvoice && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Invoice Due</p>
                  <p className="text-sm text-gray-600">
                    {pendingInvoice.id} - ${pendingInvoice.amount.toFixed(2)} due by{" "}
                    {new Date(pendingInvoice.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/portal/client/billing">View Invoice</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/portal/client/billing/pay">Pay Now</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/portal/client/schedule/request">
            <CardContent className="pt-6 text-center">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="font-medium">Request Visit Change</p>
              <p className="text-sm text-gray-500">Reschedule or cancel a visit</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/portal/client/care-plan">
            <CardContent className="pt-6 text-center">
              <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="font-medium">View Care Plan</p>
              <p className="text-sm text-gray-500">See your care details</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/portal/client/messages">
            <CardContent className="pt-6 text-center">
              <MessageSquare className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="font-medium">Contact Office</p>
              <p className="text-sm text-gray-500">Send a secure message</p>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
}
