"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Visit {
  id: string;
  scheduledDate: string;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart: string | null;
  actualEnd: string | null;
  status: string;
  serviceType: string;
  notes: string | null;
  client: {
    id: string;
    address: string;
    city: string;
    state: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  SCHEDULED: { icon: Clock, color: "text-blue-500 bg-blue-50", label: "Scheduled" },
  CONFIRMED: { icon: CheckCircle, color: "text-green-500 bg-green-50", label: "Confirmed" },
  IN_PROGRESS: { icon: AlertCircle, color: "text-orange-500 bg-orange-50", label: "In Progress" },
  COMPLETED: { icon: CheckCircle, color: "text-green-600 bg-green-50", label: "Completed" },
  CANCELLED: { icon: XCircle, color: "text-red-500 bg-red-50", label: "Cancelled" },
  NO_SHOW: { icon: XCircle, color: "text-red-600 bg-red-50", label: "No Show" },
  RESCHEDULED: { icon: Calendar, color: "text-purple-500 bg-purple-50", label: "Rescheduled" },
};

export default function EmployeeSchedulePage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"week" | "list">("week");

  const fetchVisits = useCallback(async () => {
    try {
      setLoading(true);
      // Calculate week range
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);

      const response = await fetch(
        `/api/visits?startDate=${startOfWeek.toISOString()}&endDate=${endOfWeek.toISOString()}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch schedule");
      }
      
      const data = await response.json();
      setVisits(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentDate(newDate);
  };

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const getVisitsForDate = (date: Date) => {
    return visits.filter((visit) => {
      const visitDate = new Date(visit.scheduledDate);
      return visitDate.toDateString() === date.toDateString();
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const weekDates = getWeekDates();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>
          <p className="text-gray-600">View and manage your upcoming visits</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("week")}
          >
            Week
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            List
          </Button>
        </div>
      </div>

      {/* Week Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => navigateWeek("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => navigateWeek("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="text-lg font-semibold">
              {weekDates[0].toLocaleDateString("en-US", { month: "long", day: "numeric" })} -{" "}
              {weekDates[6].toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </h2>
            <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
          </div>

          {error ? (
            <div className="text-center py-8 text-red-500">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p>{error}</p>
              <Button variant="outline" className="mt-4" onClick={fetchVisits}>
                Try Again
              </Button>
            </div>
          ) : viewMode === "week" ? (
            <div className="grid grid-cols-7 gap-2">
              {/* Day Headers */}
              {weekDates.map((date, index) => (
                <div
                  key={index}
                  className={cn(
                    "text-center py-2 rounded-lg",
                    date.toDateString() === new Date().toDateString()
                      ? "bg-primary text-primary-foreground"
                      : "bg-gray-50"
                  )}
                >
                  <p className="text-xs font-medium">
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </p>
                  <p className="text-lg font-bold">{date.getDate()}</p>
                </div>
              ))}

              {/* Visit Cards for each day */}
              {weekDates.map((date, index) => {
                const dayVisits = getVisitsForDate(date);
                return (
                  <div key={`visits-${index}`} className="min-h-[120px] space-y-1">
                    {dayVisits.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-4">No visits</p>
                    ) : (
                      dayVisits.map((visit) => {
                        const config = statusConfig[visit.status] || statusConfig.SCHEDULED;
                        return (
                          <Link
                            key={visit.id}
                            href={`/portal/employee/clock?visitId=${visit.id}`}
                            className={cn(
                              "block p-2 rounded text-xs hover:opacity-80 transition-opacity",
                              config.color
                            )}
                          >
                            <p className="font-medium truncate">
                              {visit.client.user.firstName} {visit.client.user.lastName}
                            </p>
                            <p className="text-[10px] opacity-75">
                              {formatTime(visit.scheduledStart)}
                            </p>
                          </Link>
                        );
                      })
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {visits.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No visits scheduled for this week</p>
                </div>
              ) : (
                visits
                  .sort((a, b) => new Date(a.scheduledStart).getTime() - new Date(b.scheduledStart).getTime())
                  .map((visit) => {
                    const config = statusConfig[visit.status] || statusConfig.SCHEDULED;
                    const StatusIcon = config.icon;
                    return (
                      <Card key={visit.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={cn("px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1", config.color)}>
                                  <StatusIcon className="h-3 w-3" />
                                  {config.label}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {new Date(visit.scheduledDate).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              <h3 className="font-semibold text-lg">
                                {visit.client.user.firstName} {visit.client.user.lastName}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">{visit.serviceType}</p>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {formatTime(visit.scheduledStart)} - {formatTime(visit.scheduledEnd)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {visit.client.address}, {visit.client.city}
                                </span>
                              </div>
                            </div>
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/portal/employee/clock?visitId=${visit.id}`}>
                                View
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed This Week</p>
                <p className="text-2xl font-bold">
                  {visits.filter((v) => v.status === "COMPLETED").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Upcoming</p>
                <p className="text-2xl font-bold">
                  {visits.filter((v) => v.status === "SCHEDULED" || v.status === "CONFIRMED").length}
                </p>
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
                <p className="text-sm text-gray-500">Unique Clients</p>
                <p className="text-2xl font-bold">
                  {new Set(visits.map((v) => v.client.id)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
