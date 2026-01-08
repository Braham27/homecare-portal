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
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

async function getClientDashboardData(clientId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Get upcoming visits
  const upcomingVisits = await prisma.visit.findMany({
    where: {
      clientId,
      scheduledStart: {
        gte: today,
      },
    },
    include: {
      employee: {
        include: {
          user: true,
        },
      },
      service: true,
    },
    orderBy: { scheduledStart: "asc" },
    take: 3,
  });

  // Get this month's hours
  const monthVisits = await prisma.visit.findMany({
    where: {
      clientId,
      scheduledStart: {
        gte: startOfMonth,
      },
      status: "COMPLETED",
    },
    select: {
      actualStart: true,
      actualEnd: true,
    },
  });

  const hoursThisMonth = monthVisits.reduce((sum, v) => {
    if (v.actualStart && v.actualEnd) {
      return sum + (new Date(v.actualEnd).getTime() - new Date(v.actualStart).getTime()) / (1000 * 60 * 60);
    }
    return sum;
  }, 0);

  // Get primary caregiver (most assigned)
  const careTeam = await prisma.careTeam.findFirst({
    where: { clientId, isPrimary: true },
    include: {
      employee: {
        include: { user: true },
      },
    },
  });

  // Get pending invoice
  const pendingInvoice = await prisma.invoice.findFirst({
    where: {
      clientId,
      status: { in: ["PENDING", "OVERDUE"] },
    },
    orderBy: { dueDate: "asc" },
  });

  // Get recent care notes from visits
  const recentVisitsWithNotes = await prisma.visit.findMany({
    where: {
      clientId,
      notes: { not: null },
    },
    include: {
      employee: {
        include: { user: true },
      },
    },
    orderBy: { scheduledEnd: "desc" },
    take: 2,
  });

  return {
    upcomingVisits: upcomingVisits.map((visit) => ({
      id: visit.id,
      date: visit.scheduledStart.toISOString().split("T")[0],
      time: `${new Date(visit.scheduledStart).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} - ${new Date(visit.scheduledEnd).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`,
      caregiver: visit.employee ? `${visit.employee.user.firstName} ${visit.employee.user.lastName}` : "Unassigned",
      serviceType: visit.service?.name || "Personal Care",
      status: visit.status === "COMPLETED" ? "confirmed" : "scheduled",
    })),
    hoursThisMonth: Math.round(hoursThisMonth),
    primaryCaregiver: careTeam ? `${careTeam.employee.user.firstName} ${careTeam.employee.user.lastName}` : "Not assigned",
    pendingInvoice: pendingInvoice
      ? {
          id: pendingInvoice.invoiceNumber,
          amount: Number(pendingInvoice.amountDue),
          dueDate: pendingInvoice.dueDate.toISOString().split("T")[0],
          status: pendingInvoice.status.toLowerCase(),
        }
      : null,
    recentNotes: recentVisitsWithNotes.map((visit) => ({
      id: visit.id,
      date: visit.scheduledEnd.toISOString().split("T")[0],
      caregiver: visit.employee ? `${visit.employee.user.firstName} ${visit.employee.user.lastName}` : "Caregiver",
      summary: visit.notes || "",
    })),
    nextVisitDate: upcomingVisits[0]?.scheduledStart,
  };
}

export default async function ClientDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Get client record for the logged-in user
  const client = await prisma.client.findFirst({
    where: { userId: session.user.id },
  });

  if (!client) {
    redirect("/unauthorized");
  }

  const { upcomingVisits, hoursThisMonth, primaryCaregiver, pendingInvoice, recentNotes, nextVisitDate } =
    await getClientDashboardData(client.id);
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
                <p className="font-semibold">
                  {nextVisitDate
                    ? new Date(nextVisitDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : "Not scheduled"}
                </p>
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
                <p className="font-semibold">{hoursThisMonth} hours</p>
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
                <p className="font-semibold">{primaryCaregiver}</p>
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
                <p className="font-semibold">${pendingInvoice?.amount?.toFixed(2) || "0.00"}</p>
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
