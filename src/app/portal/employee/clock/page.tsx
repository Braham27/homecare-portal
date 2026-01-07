"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Clock,
  MapPin,
  Play,
  Square,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

// Mock visit data
const currentVisit = {
  id: "1",
  client: "Robert Williams",
  address: "456 Oak Ave, Springfield",
  scheduledTime: "2:00 PM - 6:00 PM",
  serviceType: "Personal Care",
  tasks: [
    { id: "1", name: "Bathing assistance", required: true },
    { id: "2", name: "Medication reminder", required: true },
    { id: "3", name: "Meal preparation", required: true },
    { id: "4", name: "Light housekeeping", required: false },
    { id: "5", name: "Companionship", required: false },
  ],
};

type ClockStatus = "clocked-out" | "clocking-in" | "clocked-in" | "clocking-out";

export default function ClockPage() {
  const [status, setStatus] = useState<ClockStatus>("clocked-out");
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Get location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError(null);
        },
        () => {
          setLocationError("Unable to get location. Please enable location services.");
        }
      );
    }
  }, []);

  const handleClockIn = async () => {
    if (!location) {
      setLocationError("Location is required to clock in.");
      return;
    }

    setStatus("clocking-in");
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setClockInTime(new Date());
    setStatus("clocked-in");
  };

  const handleClockOut = async () => {
    if (!location) {
      setLocationError("Location is required to clock out.");
      return;
    }

    const requiredTasks = currentVisit.tasks.filter((t) => t.required);
    const allRequiredCompleted = requiredTasks.every((t) => completedTasks.includes(t.id));

    if (!allRequiredCompleted) {
      alert("Please complete all required tasks before clocking out.");
      return;
    }

    setStatus("clocking-out");
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Reset state
    setStatus("clocked-out");
    setClockInTime(null);
    setCompletedTasks([]);
    setNotes("");
  };

  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const getElapsedTime = () => {
    if (!clockInTime) return "0:00:00";
    const diff = Math.floor((currentTime.getTime() - clockInTime.getTime()) / 1000);
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Clock In/Out</h1>
        <p className="text-gray-600">Electronic Visit Verification (EVV)</p>
      </div>

      {/* Status Card */}
      <Card className={status === "clocked-in" ? "border-green-500 bg-green-50" : ""}>
        <CardContent className="pt-6">
          <div className="text-center">
            <div
              className={`inline-flex p-4 rounded-full mb-4 ${
                status === "clocked-in"
                  ? "bg-green-100"
                  : status === "clocking-in" || status === "clocking-out"
                  ? "bg-blue-100"
                  : "bg-gray-100"
              }`}
            >
              {status === "clocking-in" || status === "clocking-out" ? (
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
              ) : status === "clocked-in" ? (
                <CheckCircle className="h-12 w-12 text-green-600" />
              ) : (
                <Clock className="h-12 w-12 text-gray-600" />
              )}
            </div>

            <p className="text-lg font-medium text-gray-900 mb-1">
              {status === "clocked-in"
                ? "Currently Clocked In"
                : status === "clocking-in"
                ? "Clocking In..."
                : status === "clocking-out"
                ? "Clocking Out..."
                : "Not Clocked In"}
            </p>

            {status === "clocked-in" && clockInTime && (
              <>
                <p className="text-3xl font-bold text-green-600 mb-2">
                  {getElapsedTime()}
                </p>
                <p className="text-sm text-gray-500">
                  Clocked in at {clockInTime.toLocaleTimeString()}
                </p>
              </>
            )}

            <p className="text-sm text-gray-500 mt-2">
              Current time: {currentTime.toLocaleTimeString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Visit Details */}
      <Card>
        <CardHeader>
          <CardTitle>Current Visit</CardTitle>
          <CardDescription>Visit details and scheduled tasks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900">{currentVisit.client}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <MapPin className="h-4 w-4" />
                <span>{currentVisit.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Clock className="h-4 w-4" />
                <span>{currentVisit.scheduledTime}</span>
              </div>
            </div>
            <span className="text-sm font-medium px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
              {currentVisit.serviceType}
            </span>
          </div>

          {/* Location Status */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
            <MapPin className={`h-5 w-5 ${location ? "text-green-600" : "text-gray-400"}`} />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Location</p>
              {location ? (
                <p className="text-sm text-green-600">
                  Location verified ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})
                </p>
              ) : locationError ? (
                <p className="text-sm text-red-600">{locationError}</p>
              ) : (
                <p className="text-sm text-gray-500">Acquiring location...</p>
              )}
            </div>
            {location && <CheckCircle className="h-5 w-5 text-green-600" />}
          </div>
        </CardContent>
      </Card>

      {/* Clock In Button */}
      {(status === "clocked-out" || status === "clocking-in") && (
        <Button
          size="lg"
          className="w-full h-16 text-lg"
          onClick={handleClockIn}
          disabled={!location || status === "clocking-in"}
        >
          {status === "clocking-in" ? (
            <>
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              Clocking In...
            </>
          ) : (
            <>
              <Play className="mr-2 h-6 w-6" />
              Clock In
            </>
          )}
        </Button>
      )}

      {/* Tasks & Clock Out */}
      {(status === "clocked-in" || status === "clocking-out") && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Task Checklist</CardTitle>
              <CardDescription>Mark tasks as you complete them</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentVisit.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                  >
                    <Checkbox
                      id={task.id}
                      checked={completedTasks.includes(task.id)}
                      onCheckedChange={() => toggleTask(task.id)}
                    />
                    <Label
                      htmlFor={task.id}
                      className={`flex-1 cursor-pointer ${
                        completedTasks.includes(task.id) ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {task.name}
                    </Label>
                    {task.required && (
                      <span className="text-xs font-medium px-2 py-0.5 bg-red-100 text-red-700 rounded">
                        Required
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visit Notes</CardTitle>
              <CardDescription>Document any observations or concerns</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter notes about this visit..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          <Button
            size="lg"
            variant="destructive"
            className="w-full h-16 text-lg"
            onClick={handleClockOut}
            disabled={status === "clocking-out"}
          >
            {status === "clocking-out" ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Clocking Out...
              </>
            ) : (
              <>
                <Square className="mr-2 h-6 w-6" />
                Clock Out
              </>
            )}
          </Button>

          {/* Warning about required tasks */}
          {!currentVisit.tasks
            .filter((t) => t.required)
            .every((t) => completedTasks.includes(t.id)) && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">Complete all required tasks before clocking out</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
