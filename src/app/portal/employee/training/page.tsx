"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  ExternalLink,
  Award,
  BookOpen,
  Video,
  FileText,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO, differenceInDays, isPast } from "date-fns";

interface Training {
  id: string;
  completedAt: string | null;
  expiresAt: string | null;
  certificateUrl: string | null;
  training: {
    id: string;
    name: string;
    description: string | null;
    category: string;
    durationHours: number | null;
    isRequired: boolean;
    externalUrl: string | null;
  };
}

export default function EmployeeTrainingPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "required" | "completed" | "pending">("all");

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/employee/training");
      
      if (!response.ok) {
        throw new Error("Failed to fetch trainings");
      }
      
      const data = await response.json();
      setTrainings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getTrainingStatus = (training: Training) => {
    if (!training.completedAt) return "pending";
    if (training.expiresAt && isPast(parseISO(training.expiresAt))) return "expired";
    if (training.expiresAt) {
      const daysUntilExpiry = differenceInDays(parseISO(training.expiresAt), new Date());
      if (daysUntilExpiry <= 30) return "expiring";
    }
    return "completed";
  };

  const filteredTrainings = trainings.filter((t) => {
    const status = getTrainingStatus(t);
    if (filter === "all") return true;
    if (filter === "required") return t.training.isRequired;
    if (filter === "completed") return status === "completed";
    if (filter === "pending") return status === "pending" || status === "expired";
    return true;
  });

  const stats = {
    total: trainings.length,
    completed: trainings.filter((t) => getTrainingStatus(t) === "completed").length,
    pending: trainings.filter((t) => getTrainingStatus(t) === "pending").length,
    expiring: trainings.filter((t) => getTrainingStatus(t) === "expiring").length,
    expired: trainings.filter((t) => getTrainingStatus(t) === "expired").length,
    required: trainings.filter((t) => t.training.isRequired).length,
    requiredCompleted: trainings.filter((t) => t.training.isRequired && t.completedAt).length,
  };

  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "video":
        return Video;
      case "online":
        return BookOpen;
      default:
        return FileText;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-[400px] bg-gray-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <h2 className="text-xl font-semibold mb-2">Error Loading Training</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={fetchTrainings}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Training</h1>
        <p className="text-gray-600">View and track your training requirements</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.expiring + stats.expired}</p>
                <p className="text-sm text-gray-500">Expiring/Expired</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.requiredCompleted}/{stats.required}</p>
                <p className="text-sm text-gray-500">Required</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Training Completion</h3>
              <p className="text-sm text-gray-500">Your overall progress</p>
            </div>
            <span className="text-2xl font-bold text-primary">{Math.round(completionRate)}%</span>
          </div>
          <Progress value={completionRate} className="h-3" />
          <p className="text-sm text-gray-500 mt-2">
            {stats.completed} of {stats.total} trainings completed
          </p>
        </CardContent>
      </Card>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "all", label: "All" },
          { key: "required", label: "Required" },
          { key: "pending", label: "Pending" },
          { key: "completed", label: "Completed" },
        ].map((f) => (
          <Button
            key={f.key}
            variant={filter === f.key ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f.key as typeof filter)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* Training List */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredTrainings.length === 0 ? (
          <Card className="md:col-span-2">
            <CardContent className="py-12 text-center text-gray-500">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No trainings found</p>
            </CardContent>
          </Card>
        ) : (
          filteredTrainings.map((training) => {
            const status = getTrainingStatus(training);
            const Icon = getCategoryIcon(training.training.category);

            return (
              <Card key={training.id} className={cn(
                "overflow-hidden",
                status === "expired" && "border-red-200",
                status === "expiring" && "border-yellow-200"
              )}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        status === "completed" && "bg-green-100",
                        status === "pending" && "bg-gray-100",
                        status === "expiring" && "bg-yellow-100",
                        status === "expired" && "bg-red-100"
                      )}>
                        <Icon className={cn(
                          "h-5 w-5",
                          status === "completed" && "text-green-600",
                          status === "pending" && "text-gray-600",
                          status === "expiring" && "text-yellow-600",
                          status === "expired" && "text-red-600"
                        )} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{training.training.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {training.training.category}
                          {training.training.durationHours && (
                            <span> • {training.training.durationHours} hours</span>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {training.training.isRequired && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                          Required
                        </span>
                      )}
                      <span className={cn(
                        "px-2 py-0.5 text-xs rounded-full font-medium",
                        status === "completed" && "bg-green-100 text-green-700",
                        status === "pending" && "bg-gray-100 text-gray-700",
                        status === "expiring" && "bg-yellow-100 text-yellow-700",
                        status === "expired" && "bg-red-100 text-red-700"
                      )}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {training.training.description && (
                    <p className="text-sm text-gray-600 mb-4">{training.training.description}</p>
                  )}

                  <div className="space-y-2 text-sm">
                    {training.completedAt && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Completed: {format(parseISO(training.completedAt), "MMM d, yyyy")}</span>
                      </div>
                    )}
                    {training.expiresAt && (
                      <div className={cn(
                        "flex items-center gap-2",
                        isPast(parseISO(training.expiresAt)) ? "text-red-600" : "text-gray-600"
                      )}>
                        <Calendar className="h-4 w-4" />
                        <span>
                          {isPast(parseISO(training.expiresAt)) ? "Expired: " : "Expires: "}
                          {format(parseISO(training.expiresAt), "MMM d, yyyy")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    {training.training.externalUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a
                          href={training.training.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Start Training
                        </a>
                      </Button>
                    )}
                    {training.certificateUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a
                          href={training.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Award className="h-4 w-4 mr-2" />
                          View Certificate
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
