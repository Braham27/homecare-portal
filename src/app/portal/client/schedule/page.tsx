"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  User,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const visits = [
  {
    id: "1",
    date: "2026-01-05",
    startTime: "9:00 AM",
    endTime: "1:00 PM",
    caregiver: "Jane Smith",
    serviceType: "Personal Care",
    status: "scheduled",
    tasks: ["Bathing assistance", "Medication reminder", "Meal preparation", "Light housekeeping"],
  },
  {
    id: "2",
    date: "2026-01-07",
    startTime: "9:00 AM",
    endTime: "1:00 PM",
    caregiver: "Jane Smith",
    serviceType: "Personal Care",
    status: "confirmed",
    tasks: ["Bathing assistance", "Medication reminder", "Meal preparation"],
  },
  {
    id: "3",
    date: "2026-01-09",
    startTime: "10:00 AM",
    endTime: "2:00 PM",
    caregiver: "Maria Garcia",
    serviceType: "Companion Care",
    status: "scheduled",
    tasks: ["Companionship", "Reading", "Light exercise", "Meal preparation"],
  },
  {
    id: "4",
    date: "2026-01-12",
    startTime: "9:00 AM",
    endTime: "1:00 PM",
    caregiver: "Jane Smith",
    serviceType: "Personal Care",
    status: "scheduled",
    tasks: ["Bathing assistance", "Medication reminder", "Meal preparation", "Light housekeeping"],
  },
];

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); // January 2026
  const [selectedDate, setSelectedDate] = useState<string | null>("2026-01-05");
  const [view, setView] = useState<"calendar" | "list">("calendar");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getVisitsForDate = (date: string) => {
    return visits.filter((v) => v.date === date);
  };

  const formatDateString = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const selectedVisits = selectedDate ? getVisitsForDate(selectedDate) : [];

  const renderCalendarDays = () => {
    const days = [];

    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDateString(day);
      const dayVisits = getVisitsForDate(dateString);
      const isSelected = selectedDate === dateString;
      const isToday = dateString === "2026-01-03"; // Mock "today"

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(dateString)}
          className={cn(
            "p-2 text-center rounded-lg transition-colors relative min-h-[80px] flex flex-col",
            isSelected
              ? "bg-primary text-primary-foreground"
              : isToday
              ? "bg-blue-50 border-2 border-primary"
              : "hover:bg-gray-100"
          )}
        >
          <span className={cn("text-sm font-medium", isSelected && "text-primary-foreground")}>
            {day}
          </span>
          {dayVisits.length > 0 && (
            <div className="flex-1 flex flex-col justify-end gap-1 mt-1">
              {dayVisits.slice(0, 2).map((visit) => (
                <div
                  key={visit.id}
                  className={cn(
                    "text-xs px-1 py-0.5 rounded truncate",
                    isSelected
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : visit.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  )}
                >
                  {visit.startTime}
                </div>
              ))}
              {dayVisits.length > 2 && (
                <span
                  className={cn(
                    "text-xs",
                    isSelected ? "text-primary-foreground/80" : "text-gray-500"
                  )}
                >
                  +{dayVisits.length - 2} more
                </span>
              )}
            </div>
          )}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Visit Schedule</h1>
          <p className="text-gray-600">View your upcoming and past care visits</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === "calendar" ? "default" : "outline"}
            onClick={() => setView("calendar")}
          >
            Calendar
          </Button>
          <Button
            variant={view === "list" ? "default" : "outline"}
            onClick={() => setView("list")}
          >
            List
          </Button>
        </div>
      </div>

      {view === "calendar" ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {monthNames[month]} {year}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="p-2 text-center text-sm font-medium text-gray-500"
                  >
                    {day}
                  </div>
                ))}
                {renderCalendarDays()}
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-100 border border-green-300" />
                  <span className="text-gray-600">Confirmed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-100 border border-blue-300" />
                  <span className="text-gray-600">Scheduled</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Day Details */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDate
                  ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })
                  : "Select a Date"}
              </CardTitle>
              <CardDescription>
                {selectedVisits.length} visit{selectedVisits.length !== 1 ? "s" : ""} scheduled
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedVisits.length > 0 ? (
                <div className="space-y-4">
                  {selectedVisits.map((visit) => (
                    <div
                      key={visit.id}
                      className="p-4 bg-gray-50 rounded-lg space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={cn(
                            "text-xs font-medium px-2 py-1 rounded-full",
                            visit.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          )}
                        >
                          {visit.status === "confirmed" ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Confirmed
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Scheduled
                            </span>
                          )}
                        </span>
                      </div>

                      <div>
                        <p className="font-medium text-gray-900">{visit.serviceType}</p>
                        <p className="text-sm text-gray-600">
                          {visit.startTime} - {visit.endTime}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span>{visit.caregiver}</span>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-2">Tasks:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {visit.tasks.map((task, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button variant="outline" size="sm" className="w-full">
                        Request Change
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No visits scheduled for this day</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        /* List View */
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Visits</CardTitle>
            <CardDescription>All scheduled care visits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {visits.map((visit) => (
                <div
                  key={visit.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border rounded-lg"
                >
                  <div className="bg-gray-100 p-3 rounded-lg text-center min-w-[80px]">
                    <p className="text-xs text-gray-500">
                      {new Date(visit.date + "T00:00:00").toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </p>
                    <p className="text-lg font-bold">
                      {new Date(visit.date + "T00:00:00").getDate()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(visit.date + "T00:00:00").toLocaleDateString("en-US", {
                        month: "short",
                      })}
                    </p>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900">{visit.serviceType}</p>
                      <span
                        className={cn(
                          "text-xs font-medium px-2 py-0.5 rounded-full",
                          visit.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        )}
                      >
                        {visit.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {visit.startTime} - {visit.endTime}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {visit.caregiver}
                      </span>
                    </div>
                  </div>

                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
