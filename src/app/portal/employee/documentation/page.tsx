"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  User,
  Loader2,
  FileCheck,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

interface Visit {
  id: string;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart: string | null;
  actualEnd: string | null;
  status: string;
  careNotes: string | null;
  tasksPerformed: string | null;
  client: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

export default function EmployeeDocumentationPage() {
  const [pendingVisits, setPendingVisits] = useState<Visit[]>([]);
  const [completedVisits, setCompletedVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [careNotes, setCareNotes] = useState("");
  const [tasksPerformed, setTasksPerformed] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/employee/documentation");
      
      if (!response.ok) {
        throw new Error("Failed to fetch visits");
      }
      
      const data = await response.json();
      setPendingVisits(data.pending || []);
      setCompletedVisits(data.completed || []);
      
      // Auto-select first pending visit
      if (data.pending?.length > 0) {
        setSelectedVisit(data.pending[0]);
        setCareNotes(data.pending[0].careNotes || "");
        setTasksPerformed(data.pending[0].tasksPerformed || "");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVisit = (visit: Visit) => {
    setSelectedVisit(visit);
    setCareNotes(visit.careNotes || "");
    setTasksPerformed(visit.tasksPerformed || "");
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVisit) return;

    try {
      setSubmitting(true);
      const response = await fetch("/api/employee/documentation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visitId: selectedVisit.id,
          careNotes,
          tasksPerformed,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save documentation");
      }

      setSuccessMessage("Documentation saved successfully!");
      
      // Refresh visits list
      await fetchVisits();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (dateString: string) => {
    return format(parseISO(dateString), "h:mm a");
  };

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "MMM d, yyyy");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="h-[400px] bg-gray-100 rounded-lg animate-pulse" />
          <div className="lg:col-span-2 h-[400px] bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <h2 className="text-xl font-semibold mb-2">Error Loading Documentation</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={fetchVisits}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Documentation</h1>
        <p className="text-gray-600">Document care notes and tasks performed during visits</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingVisits.length}</p>
              <p className="text-sm text-gray-500">Pending Documentation</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileCheck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedVisits.length}</p>
              <p className="text-sm text-gray-500">Documented (7 days)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Visit List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Pending ({pendingVisits.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {pendingVisits.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p>All caught up!</p>
                <p className="text-sm">No pending documentation</p>
              </div>
            ) : (
              <div className="divide-y max-h-[300px] overflow-y-auto">
                {pendingVisits.map((visit) => (
                  <button
                    key={visit.id}
                    onClick={() => handleSelectVisit(visit)}
                    className={cn(
                      "w-full p-4 text-left hover:bg-gray-50 transition-colors",
                      selectedVisit?.id === visit.id && "bg-primary/5 border-l-2 border-l-primary"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-gray-400" />
                      <p className="font-medium text-sm">
                        {visit.client.user.firstName} {visit.client.user.lastName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(visit.scheduledStart)}</span>
                      <span>•</span>
                      <span>{formatTime(visit.scheduledStart)} - {formatTime(visit.scheduledEnd)}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>

          {completedVisits.length > 0 && (
            <>
              <CardHeader className="pb-3 pt-4 border-t">
                <CardTitle className="text-lg flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  Documented
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y max-h-[200px] overflow-y-auto">
                  {completedVisits.map((visit) => (
                    <button
                      key={visit.id}
                      onClick={() => handleSelectVisit(visit)}
                      className={cn(
                        "w-full p-4 text-left hover:bg-gray-50 transition-colors",
                        selectedVisit?.id === visit.id && "bg-primary/5 border-l-2 border-l-primary"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-gray-400" />
                        <p className="font-medium text-sm">
                          {visit.client.user.firstName} {visit.client.user.lastName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(visit.scheduledStart)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </>
          )}
        </Card>

        {/* Documentation Form */}
        <Card className="lg:col-span-2">
          {selectedVisit ? (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Visit Documentation
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {selectedVisit.client.user.firstName} {selectedVisit.client.user.lastName} • {formatDate(selectedVisit.scheduledStart)}
                    </CardDescription>
                  </div>
                  {selectedVisit.careNotes && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      Documented
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Visit Details */}
                  <div className="p-4 bg-gray-50 rounded-lg grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Scheduled Time</p>
                      <p className="font-medium">
                        {formatTime(selectedVisit.scheduledStart)} - {formatTime(selectedVisit.scheduledEnd)}
                      </p>
                    </div>
                    {selectedVisit.actualStart && selectedVisit.actualEnd && (
                      <div>
                        <p className="text-gray-500">Actual Time</p>
                        <p className="font-medium">
                          {formatTime(selectedVisit.actualStart)} - {formatTime(selectedVisit.actualEnd)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Tasks Performed */}
                  <div className="space-y-2">
                    <Label htmlFor="tasksPerformed">Tasks Performed</Label>
                    <Textarea
                      id="tasksPerformed"
                      placeholder="List the care tasks you performed during this visit..."
                      value={tasksPerformed}
                      onChange={(e) => setTasksPerformed(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                    <p className="text-xs text-gray-500">
                      Document each task completed (e.g., medication reminders, personal care, meal preparation)
                    </p>
                  </div>

                  {/* Care Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="careNotes">Care Notes</Label>
                    <Textarea
                      id="careNotes"
                      placeholder="Document any observations, concerns, or important notes about the visit..."
                      value={careNotes}
                      onChange={(e) => setCareNotes(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                    <p className="text-xs text-gray-500">
                      Include client condition observations, any changes noticed, or concerns
                    </p>
                  </div>

                  {successMessage && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                      <CheckCircle2 className="h-5 w-5" />
                      <p className="text-sm">{successMessage}</p>
                    </div>
                  )}

                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setCareNotes(selectedVisit.careNotes || "");
                        setTasksPerformed(selectedVisit.tasksPerformed || "");
                      }}
                    >
                      Reset
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Save Documentation
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </>
          ) : (
            <CardContent className="py-12 text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a visit to document</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
