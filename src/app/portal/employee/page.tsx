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

// Mock data
const todaysVisits = [
  {
    id: "1",
    client: "Eleanor Johnson",
    address: "123 Maple St, Springfield",
    time: "9:00 AM - 1:00 PM",
    serviceType: "Personal Care",
    status: "completed",
    clockInTime: "8:58 AM",
    clockOutTime: "1:02 PM",
  },
  {
    id: "2",
    client: "Robert Williams",
    address: "456 Oak Ave, Springfield",
    time: "2:00 PM - 6:00 PM",
    serviceType: "Personal Care",
    status: "upcoming",
    tasks: ["Bathing assistance", "Medication reminder", "Meal preparation", "Light housekeeping"],
  },
];

const weeklyStats = {
  hoursWorked: 28,
  hoursScheduled: 40,
  visitsCompleted: 7,
  pendingDocumentation: 1,
};

const pendingTasks = [
  {
    id: "1",
    type: "documentation",
    description: "Complete care notes for Eleanor Johnson (Jan 3)",
    dueDate: "Today",
    priority: "high",
  },
  {
    id: "2",
    type: "training",
    description: "Annual HIPAA compliance training due",
    dueDate: "Jan 15, 2026",
    priority: "medium",
  },
];

export default function EmployeeDashboard() {
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
                  <Link href={`/portal/employee/clients/${currentVisit.id}`}>
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
