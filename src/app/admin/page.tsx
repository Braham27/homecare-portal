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
import { prisma } from "@/lib/db";

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  
  if (diffInMinutes < 1) return "just now";
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
}

async function getDashboardData() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

  // Get active clients count
  const activeClients = await prisma.client.count({
    where: { status: "ACTIVE" },
  });

  // Get active employees count
  const activeEmployees = await prisma.employee.count({
    where: { status: "ACTIVE" },
  });

  // Get today's visits
  const visitsToday = await prisma.visit.count({
    where: {
      scheduledStart: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  // Get this week's visits
  const visitsThisWeek = await prisma.visit.count({
    where: {
      scheduledStart: {
        gte: startOfWeek,
      },
    },
  });

  // Get this month's revenue
  const thisMonthInvoices = await prisma.invoice.findMany({
    where: {
      status: "PAID",
      paidAt: {
        gte: startOfMonth,
      },
    },
    select: { total: true },
  });
  const revenueThisMonth = thisMonthInvoices.reduce((sum, inv) => sum + Number(inv.total), 0);

  // Get last month's revenue
  const lastMonthInvoices = await prisma.invoice.findMany({
    where: {
      status: "PAID",
      paidAt: {
        gte: startOfLastMonth,
        lte: endOfLastMonth,
      },
    },
    select: { total: true },
  });
  const revenueLastMonth = lastMonthInvoices.reduce((sum, inv) => sum + Number(inv.total), 0);

  const revenueGrowth = revenueLastMonth > 0 
    ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100 
    : 0;

  // Get pending invoices
  const pendingInvoices = await prisma.invoice.findMany({
    where: {
      status: { in: ["PENDING", "OVERDUE"] },
    },
    select: { amountDue: true },
  });
  const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + Number(inv.amountDue), 0);

  // Get open positions
  const openPositions = await prisma.jobPosting.count({
    where: { isActive: true },
  });

  // Get upcoming visits today
  const upcomingVisits = await prisma.visit.findMany({
    where: {
      scheduledStart: {
        gte: today,
        lt: tomorrow,
      },
    },
    include: {
      client: {
        include: {
          user: true,
        },
      },
      employee: {
        include: {
          user: true,
        },
      },
    },
    orderBy: { scheduledStart: "asc" },
    take: 3,
  });

  // Get recent audit logs
  const recentActivity = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      user: true,
    },
  });

  // Generate alerts
  const alerts = [];

  // Check unfilled visits for tomorrow
  const unfilledVisitsTomorrow = await prisma.visit.count({
    where: {
      scheduledStart: {
        gte: tomorrow,
        lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
      },
      status: "SCHEDULED",
      employeeId: null,
    },
  });
  if (unfilledVisitsTomorrow > 0) {
    alerts.push({
      id: "unfilled-visits",
      type: "warning",
      title: "Staffing Alert",
      message: `${unfilledVisitsTomorrow} unfilled shifts for tomorrow`,
      action: "/admin/scheduling",
      actionLabel: "View Schedule",
    });
  }

  // Check pending time entries (unapproved)
  const pendingTimeEntries = await prisma.timeEntry.count({
    where: { approved: false },
  });
  if (pendingTimeEntries > 0) {
    alerts.push({
      id: "pending-timesheets",
      type: "info",
      title: "Pending Approvals",
      message: `${pendingTimeEntries} time entries awaiting approval`,
      action: "/admin/employees",
      actionLabel: "Review",
    });
  }

  // Check overdue invoices
  const overdueInvoices = await prisma.invoice.count({
    where: { status: "OVERDUE" },
  });
  if (overdueInvoices > 0) {
    alerts.push({
      id: "overdue-invoices",
      type: "warning",
      title: "Overdue Invoices",
      message: `${overdueInvoices} invoices are overdue`,
      action: "/admin/billing",
      actionLabel: "View Billing",
    });
  }

  return {
    stats: {
      activeClients,
      activeEmployees,
      visitsToday,
      visitsThisWeek,
      revenue: {
        thisMonth: revenueThisMonth,
        lastMonth: revenueLastMonth,
        growth: revenueGrowth,
      },
      pendingInvoices: pendingInvoices.length,
      pendingAmount,
      openPositions,
    },
    upcomingVisits,
    recentActivity,
    alerts,
  };
}

export default async function AdminDashboard() {
  const { stats, upcomingVisits, recentActivity, alerts } = await getDashboardData();
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
              {upcomingVisits.length > 0 ? (
                upcomingVisits.map((visit) => {
                  const startTime = new Date(visit.scheduledStart).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  });
                  const endTime = new Date(visit.scheduledEnd).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  });
                  const status = visit.status === "COMPLETED" ? "confirmed" : "pending";

                  return (
                    <div
                      key={visit.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            status === "confirmed" ? "bg-green-100" : "bg-yellow-100"
                          }`}
                        >
                          {status === "confirmed" ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-yellow-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {visit.client.user.firstName} {visit.client.user.lastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {visit.employee ? `${visit.employee.user.firstName} ${visit.employee.user.lastName}` : "Unassigned"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{startTime} - {endTime}</p>
                        <p
                          className={`text-xs ${
                            status === "confirmed"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {visit.status.toLowerCase()}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No visits scheduled for today</p>
              )}
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
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => {
                  const timeAgo = getTimeAgo(new Date(activity.createdAt));
                  const activityDescription = `${activity.action} ${activity.entityType}${activity.entityId ? ` #${activity.entityId.slice(0, 8)}` : ""}`;
                  return (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activityDescription}</p>
                        <p className="text-xs text-gray-500">{timeAgo}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
              )}
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
