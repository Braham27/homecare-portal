import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserCheck,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  FileText,
} from "lucide-react";
import Link from "next/link";

// Mock data
const stats = {
  activeClients: 156,
  activeEmployees: 42,
  visitsToday: 89,
  visitsThisWeek: 412,
  revenue: {
    thisMonth: 124500,
    lastMonth: 118200,
    growth: 5.3,
  },
  pendingInvoices: 23,
  pendingAmount: 34500,
  openPositions: 5,
};

const recentActivity = [
  {
    id: "1",
    type: "new_client",
    message: "New client registered: Margaret Anderson",
    time: "10 minutes ago",
  },
  {
    id: "2",
    type: "clock_in",
    message: "Jane Smith clocked in for visit with Robert Williams",
    time: "25 minutes ago",
  },
  {
    id: "3",
    type: "payment",
    message: "Payment received: $450.00 from Eleanor Johnson",
    time: "1 hour ago",
  },
  {
    id: "4",
    type: "application",
    message: "New job application received for Caregiver position",
    time: "2 hours ago",
  },
  {
    id: "5",
    type: "schedule",
    message: "Visit rescheduled for Thomas Brown",
    time: "3 hours ago",
  },
];

const alerts = [
  {
    id: "1",
    type: "warning",
    title: "Staffing Alert",
    message: "3 unfilled shifts for tomorrow",
    action: "/admin/scheduling",
    actionLabel: "View Schedule",
  },
  {
    id: "2",
    type: "info",
    title: "Pending Approvals",
    message: "5 timesheets awaiting approval",
    action: "/admin/employees/timesheets",
    actionLabel: "Review",
  },
  {
    id: "3",
    type: "warning",
    title: "Overdue Invoices",
    message: "8 invoices are overdue",
    action: "/admin/billing",
    actionLabel: "View Billing",
  },
];

const upcomingVisits = [
  {
    id: "1",
    client: "Eleanor Johnson",
    caregiver: "Jane Smith",
    time: "9:00 AM - 1:00 PM",
    status: "confirmed",
  },
  {
    id: "2",
    client: "Robert Williams",
    caregiver: "Maria Garcia",
    time: "10:00 AM - 2:00 PM",
    status: "pending",
  },
  {
    id: "3",
    client: "Thomas Brown",
    caregiver: "Sarah Johnson",
    time: "2:00 PM - 6:00 PM",
    status: "confirmed",
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/reports">
              <FileText className="mr-2 h-4 w-4" />
              Reports
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/clients/new">Add Client</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Clients</p>
                <p className="text-2xl font-bold">{stats.activeClients}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <Link
              href="/admin/clients"
              className="text-sm text-primary hover:underline mt-2 inline-block"
            >
              View all clients →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Caregivers</p>
                <p className="text-2xl font-bold">{stats.activeEmployees}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <Link
              href="/admin/employees"
              className="text-sm text-primary hover:underline mt-2 inline-block"
            >
              Manage team →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Today&apos;s Visits</p>
                <p className="text-2xl font-bold">{stats.visitsToday}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <Link
              href="/admin/scheduling"
              className="text-sm text-primary hover:underline mt-2 inline-block"
            >
              View schedule →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Monthly Revenue</p>
                <p className="text-2xl font-bold">
                  ${(stats.revenue.thisMonth / 1000).toFixed(1)}k
                </p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              {stats.revenue.growth > 0 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">+{stats.revenue.growth}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-red-600">{stats.revenue.growth}%</span>
                </>
              )}
              <span className="text-gray-500">vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Card
              key={alert.id}
              className={`${
                alert.type === "warning"
                  ? "border-orange-200 bg-orange-50"
                  : "border-blue-200 bg-blue-50"
              }`}
            >
              <CardContent className="py-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        alert.type === "warning" ? "bg-orange-100" : "bg-blue-100"
                      }`}
                    >
                      <AlertTriangle
                        className={`h-5 w-5 ${
                          alert.type === "warning" ? "text-orange-600" : "text-blue-600"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{alert.title}</p>
                      <p className="text-sm text-gray-600">{alert.message}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={alert.action}>{alert.actionLabel}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Today&apos;s Schedule</CardTitle>
              <CardDescription>Upcoming visits for today</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/scheduling">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        visit.status === "confirmed" ? "bg-green-100" : "bg-yellow-100"
                      }`}
                    >
                      {visit.status === "confirmed" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{visit.client}</p>
                      <p className="text-sm text-gray-600">{visit.caregiver}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{visit.time}</p>
                    <p
                      className={`text-xs ${
                        visit.status === "confirmed"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {visit.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from across the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Invoices</p>
                <p className="text-xl font-bold">{stats.pendingInvoices}</p>
                <p className="text-sm text-gray-600">
                  ${(stats.pendingAmount / 1000).toFixed(1)}k outstanding
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">This Week</p>
                <p className="text-xl font-bold">{stats.visitsThisWeek} visits</p>
                <p className="text-sm text-gray-600">
                  Across {stats.activeClients} clients
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <UserCheck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Open Positions</p>
                <p className="text-xl font-bold">{stats.openPositions}</p>
                <Link
                  href="/admin/employees/hiring"
                  className="text-sm text-primary hover:underline"
                >
                  View applicants →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
