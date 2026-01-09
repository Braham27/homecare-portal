import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Play,
} from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

async function getEmployeeDashboardData(employeeId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  // Get today's visits
  const todaysVisits = await prisma.visit.findMany({
    where: {
      employeeId,
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
    },
    orderBy: { scheduledStart: "asc" },
  });

  // Get this week's visits for stats
  const weeklyVisits = await prisma.visit.findMany({
    where: {
      employeeId,
      scheduledStart: {
        gte: startOfWeek,
      },
    },
    select: {
      status: true,
      actualStart: true,
      actualEnd: true,
    },
  });

  const visitsCompleted = weeklyVisits.filter((v) => v.status === "COMPLETED").length;
  const hoursWorked = weeklyVisits
    .filter((v) => v.actualStart && v.actualEnd)
    .reduce((sum, v) => {
      if (v.actualStart && v.actualEnd) {
        return sum + (new Date(v.actualEnd).getTime() - new Date(v.actualStart).getTime()) / (1000 * 60 * 60);
      }
      return sum;
    }, 0);

  // Get pending documentation
  const pendingDocumentation = await prisma.visit.count({
    where: {
      employeeId,
      status: "COMPLETED",
      notes: null,
    },
  });

  // Get pending time entries (unapproved)
  const pendingTimesheets = await prisma.timeEntry.count({
    where: {
      employeeId,
      approved: false,
    },
  });

  return {
    todaysVisits: todaysVisits.map((visit) => ({
      id: visit.id,
      client: `${visit.client.user.firstName} ${visit.client.user.lastName}`,
      address: `${visit.client.address}, ${visit.client.city}`,
      time: `${new Date(visit.scheduledStart).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} - ${new Date(visit.scheduledEnd).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`,
      serviceType: visit.serviceType || "Personal Care",
      status: visit.status === "COMPLETED" ? "completed" : "upcoming",
      clockInTime: visit.actualStart ? new Date(visit.actualStart).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : undefined,
      clockOutTime: visit.actualEnd ? new Date(visit.actualEnd).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : undefined,
      tasks: ["Bathing assistance", "Medication reminder", "Meal preparation"],
      clientId: visit.clientId,
    })),
    weeklyStats: {
      hoursWorked: Math.round(hoursWorked),
      hoursScheduled: 40,
      visitsCompleted,
      pendingDocumentation,
    },
    pendingTasks: [
      ...(pendingDocumentation > 0
        ? [
            {
              id: "doc-1",
              type: "documentation",
              description: `Complete care notes for ${pendingDocumentation} visit(s)`,
              dueDate: "Today",
              priority: "high" as const,
            },
          ]
        : []),
      ...(pendingTimesheets > 0
        ? [
            {
              id: "timesheet-1",
              type: "timesheet",
              description: `Submit ${pendingTimesheets} pending timesheet(s)`,
              dueDate: "End of week",
              priority: "medium" as const,
            },
          ]
        : []),
    ],
  };
}

export default async function EmployeeDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login");
  }

  // Get employee record for the logged-in user
  const employee = await prisma.employee.findFirst({
    where: { userId: session.user.id },
  });

  if (!employee) {
    redirect("/unauthorized");
  }

  const { todaysVisits, weeklyStats, pendingTasks } = await getEmployeeDashboardData(employee.id);
  const currentVisit = todaysVisits.find((v) => v.status === "upcoming");

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Good Morning!</h1>
          <p className="text-gray-600">
            Today is {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        {currentVisit && (
          <Button size="lg" asChild>
            <Link href="/portal/employee/clock">
              <Play className="mr-2 h-4 w-4" />
              Start Next Visit
            </Link>
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Hours This Week</p>
                <p className="font-semibold">
                  {weeklyStats.hoursWorked} / {weeklyStats.hoursScheduled}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Visits Completed</p>
                <p className="font-semibold">{weeklyStats.visitsCompleted}</p>
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
                <p className="text-sm text-gray-500">Today&apos;s Visits</p>
                <p className="font-semibold">{todaysVisits.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Notes</p>
                <p className="font-semibold">{weeklyStats.pendingDocumentation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current/Next Visit */}
      {currentVisit && (
        <Card className="border-primary bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Next Visit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2">
                <p className="text-lg font-semibold text-gray-900">{currentVisit.client}</p>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{currentVisit.address}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{currentVisit.time}</span>
                </div>
                <p className="text-sm text-gray-500">{currentVisit.serviceType}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Scheduled Tasks:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {currentVisit.tasks?.map((task, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-2">
                <Button size="lg" asChild>
                  <Link href="/portal/employee/clock">
                    <Play className="mr-2 h-4 w-4" />
                    Clock In
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/portal/employee/clients/${currentVisit.clientId}`}>
                    View Care Plan
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Today&apos;s Schedule</CardTitle>
              <CardDescription>Your visits for today</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/portal/employee/schedule">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div
                    className={`p-2 rounded-lg ${
                      visit.status === "completed" ? "bg-green-100" : "bg-blue-100"
                    }`}
                  >
                    {visit.status === "completed" ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{visit.client}</p>
                    <p className="text-sm text-gray-600">{visit.time}</p>
                    <p className="text-sm text-gray-500">{visit.serviceType}</p>
                    {visit.status === "completed" && (
                      <p className="text-xs text-green-600 mt-1">
                        Completed: {visit.clockInTime} - {visit.clockOutTime}
                      </p>
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      visit.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {visit.status === "completed" ? "Completed" : "Upcoming"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Action Required</CardTitle>
            <CardDescription>Tasks that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border ${
                    task.priority === "high"
                      ? "border-red-200 bg-red-50"
                      : "border-orange-200 bg-orange-50"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      task.priority === "high" ? "bg-red-100" : "bg-orange-100"
                    }`}
                  >
                    <AlertCircle
                      className={`h-5 w-5 ${
                        task.priority === "high" ? "text-red-600" : "text-orange-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{task.description}</p>
                    <p className="text-sm text-gray-500">Due: {task.dueDate}</p>
                  </div>
                  <Button
                    variant={task.priority === "high" ? "destructive" : "outline"}
                    size="sm"
                  >
                    {task.type === "documentation" ? "Complete" : "Start"}
                  </Button>
                </div>
              ))}

              {pendingTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p>All caught up! No pending tasks.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/portal/employee/clock">
            <CardContent className="pt-6 text-center">
              <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="font-medium">Clock In/Out</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/portal/employee/documentation">
            <CardContent className="pt-6 text-center">
              <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="font-medium">Submit Notes</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/portal/employee/schedule">
            <CardContent className="pt-6 text-center">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="font-medium">My Schedule</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/portal/employee/training">
            <CardContent className="pt-6 text-center">
              <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="font-medium">Training</p>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
}
