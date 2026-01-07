"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Clock,
  Loader2,
  AlertCircle,
  RefreshCw,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AddVisitDialog } from "@/components/admin/AddVisitDialog";

interface Visit {
  id: string;
  client: string;
  clientId: string;
  clientAddress: string;
  caregiver: string;
  caregiverId: string | null;
  date: string;
  startTime: string;
  endTime: string;
  actualStart: string | null;
  actualEnd: string | null;
  serviceType: string;
  status: string;
  notes: string | null;
  evvVerified: boolean;
}

// Color palette for caregivers
const caregiverColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-indigo-500",
  "bg-red-500",
];

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const hours = Array.from({ length: 12 }, (_, i) => i + 7); // 7 AM to 6 PM

export default function SchedulingPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week">("week");
  const [showAddVisitDialog, setShowAddVisitDialog] = useState(false);

  // Build caregiver list and color mapping from visits
  const caregiverColorMap = new Map<string, string>();
  const uniqueCaregivers: { id: string; name: string; color: string }[] = [];
  
  visits.forEach((visit) => {
    if (visit.caregiver && visit.caregiver !== "Unassigned" && !caregiverColorMap.has(visit.caregiver)) {
      const colorIndex = caregiverColorMap.size % caregiverColors.length;
      caregiverColorMap.set(visit.caregiver, caregiverColors[colorIndex]);
      uniqueCaregivers.push({
        id: visit.caregiverId || visit.caregiver,
        name: visit.caregiver,
        color: caregiverColors[colorIndex],
      });
    }
  });

  const getWeekDates = useCallback(() => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });
  }, [currentDate]);

  const weekDates = getWeekDates();

  const formatDateString = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const fetchVisits = useCallback(async () => {
    try {
      setLoading(true);
      const weekDatesLocal = getWeekDates();
      const startDate = formatDateString(weekDatesLocal[0]);
      const endDate = formatDateString(weekDatesLocal[6]);
      
      const response = await fetch(`/api/admin/visits?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) {
        throw new Error("Failed to fetch visits");
      }
      const data = await response.json();
      setVisits(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setVisits([]);
    } finally {
      setLoading(false);
    }
  }, [getWeekDates]);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  const getVisitsForDate = (dateStr: string) => {
    return visits.filter((v) => v.date === dateStr);
  };

  const getVisitStyle = (startTime: string, endTime: string) => {
    const [startHour, startMin = 0] = startTime.split(":").map(Number);
    const [endHour, endMin = 0] = endTime.split(":").map(Number);
    const top = (startHour - 7) * 60 + startMin;
    const height = Math.max((endHour - startHour) * 60 + (endMin - startMin), 30);
    return { top: `${top}px`, height: `${height}px` };
  };

  const getCaregiverColor = (name: string) => {
    return caregiverColorMap.get(name) || "bg-gray-500";
  };

  const prevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const todayStr = formatDateString(new Date());

  // Unassigned visits
  const unassignedVisits = visits.filter((v) => !v.caregiverId || v.caregiver === "Unassigned");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scheduling</h1>
          <p className="text-gray-600">Manage visit schedules and assignments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchVisits}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button onClick={() => setShowAddVisitDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Visit
          </Button>
        </div>
      </div>

      {/* Calendar Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                <Button variant="outline" size="icon" onClick={prevWeek}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextWeek}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <h2 className="text-lg font-semibold">
                {weekDates[0].toLocaleDateString("en-US", { month: "long", day: "numeric" })} -{" "}
                {weekDates[6].toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </h2>
            </div>
            <div className="flex gap-2">
              <Button
                variant={view === "day" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("day")}
              >
                Day
              </Button>
              <Button
                variant={view === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("week")}
              >
                Week
              </Button>
            </div>
          </div>

          {/* Caregiver Legend */}
          {uniqueCaregivers.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
              {uniqueCaregivers.map((caregiver) => (
                <div key={caregiver.id} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${caregiver.color}`} />
                  <span className="text-sm text-gray-600">{caregiver.name}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Failed to load schedule</h3>
              <p className="mt-2 text-gray-500">{error}</p>
              <Button className="mt-4" onClick={fetchVisits}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && !error && visits.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No visits scheduled</h3>
              <p className="mt-2 text-gray-500">
                No visits are scheduled for this week.
              </p>
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Schedule Visit
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Week Calendar */}
      {!loading && !error && (
      <Card>
        <CardContent className="pt-6 overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="grid grid-cols-8 border-b">
              <div className="p-2 text-center text-sm text-gray-500">Time</div>
              {weekDates.map((date, i) => {
                const dateStr = formatDateString(date);
                const isToday = dateStr === todayStr;
                return (
                  <div
                    key={i}
                    className={cn(
                      "p-2 text-center border-l",
                      isToday && "bg-primary/5"
                    )}
                  >
                    <p className="text-sm text-gray-500">{weekDays[date.getDay()]}</p>
                    <p
                      className={cn(
                        "text-lg font-semibold",
                        isToday && "text-primary"
                      )}
                    >
                      {date.getDate()}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Time Grid */}
            <div className="relative">
              {/* Time slots */}
              {hours.map((hour) => (
                <div key={hour} className="grid grid-cols-8 border-b" style={{ height: "60px" }}>
                  <div className="p-2 text-xs text-gray-500 text-right pr-4">
                    {hour > 12 ? `${hour - 12} PM` : hour === 12 ? "12 PM" : `${hour} AM`}
                  </div>
                  {weekDates.map((_, i) => (
                    <div key={i} className="border-l" />
                  ))}
                </div>
              ))}

              {/* Visits */}
              {weekDates.map((date, dayIndex) => {
                const dateStr = formatDateString(date);
                const dayVisits = getVisitsForDate(dateStr);
                return dayVisits.map((visit) => {
                  const style = getVisitStyle(visit.startTime, visit.endTime);
                  const leftPosition = `calc(${(dayIndex + 1) * 12.5}% + 4px)`;
                  return (
                    <div
                      key={visit.id}
                      className={cn(
                        "absolute rounded-lg p-2 text-white text-xs cursor-pointer hover:opacity-90 transition-opacity overflow-hidden",
                        getCaregiverColor(visit.caregiver)
                      )}
                      style={{
                        ...style,
                        left: leftPosition,
                        width: "calc(12.5% - 8px)",
                      }}
                    >
                      <p className="font-medium truncate">{visit.client}</p>
                      <p className="opacity-80 truncate">
                        {visit.startTime} - {visit.endTime}
                      </p>
                      <p className="opacity-80 truncate">{visit.caregiver}</p>
                    </div>
                  );
                });
              })}
            </div>
          </div>
        </CardContent>
      </Card>
      )}

      {/* Unassigned Visits */}
      <Card>
        <CardHeader>
          <CardTitle>Visits Needing Assignment</CardTitle>
          <CardDescription>Visits that need a caregiver assigned</CardDescription>
        </CardHeader>
        <CardContent>
          {unassignedVisits.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>No unassigned visits</p>
            </div>
          ) : (
            <div className="space-y-3">
              {unassignedVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{visit.client}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(visit.date).toLocaleDateString()} • {visit.startTime} - {visit.endTime}
                    </p>
                    <p className="text-sm text-gray-500">{visit.serviceType}</p>
                  </div>
                  <Button size="sm">Assign</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddVisitDialog
        open={showAddVisitDialog}
        onOpenChange={setShowAddVisitDialog}
        onVisitAdded={fetchVisits}
      />
    </div>
  );
}
