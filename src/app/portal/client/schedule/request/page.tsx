"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock,
  User,
  Plus,
  CheckCircle,
  AlertCircle,
  FileText,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function ScheduleRequestPage() {
  const [requestType, setRequestType] = useState<"new-visit" | "modify" | "cancel">("new-visit");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission - would send to API
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-500 rounded-full">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Request Submitted!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Your schedule request has been received and is being reviewed by our care coordination team.
            </p>
            <div className="bg-white rounded-lg p-4 mb-6">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Request Number</span>
                  <span className="font-semibold text-gray-900">REQ-{Date.now()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Submitted</span>
                  <span className="font-semibold text-gray-900">
                    {new Date().toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Expected Response</span>
                  <span className="font-semibold text-gray-900">Within 24 hours</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              You will receive a confirmation email and notification once your request has been reviewed.
              For urgent scheduling needs, please call us at 1-800-HOME-CARE.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/portal/client/schedule">
                <Button variant="outline">View Schedule</Button>
              </Link>
              <Link href="/portal/client">
                <Button>Return to Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/portal/client/schedule">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Schedule
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule Request</h1>
        <p className="text-gray-600">
          Request new visits, modify existing appointments, or cancel scheduled services
        </p>
      </div>

      <div className="grid gap-6">
        {/* Request Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Request Type</CardTitle>
            <CardDescription>What would you like to do?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => setRequestType("new-visit")}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  requestType === "new-visit"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Plus className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="font-medium text-gray-900">Request New Visit</p>
                <p className="text-sm text-gray-500 mt-1">Schedule additional care</p>
              </button>

              <button
                onClick={() => setRequestType("modify")}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  requestType === "modify"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="font-medium text-gray-900">Modify Appointment</p>
                <p className="text-sm text-gray-500 mt-1">Change time or services</p>
              </button>

              <button
                onClick={() => setRequestType("cancel")}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  requestType === "cancel"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <AlertCircle className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="font-medium text-gray-900">Cancel Visit</p>
                <p className="text-sm text-gray-500 mt-1">Remove from schedule</p>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Request Form */}
        <Card>
          <CardHeader>
            <CardTitle>
              {requestType === "new-visit" && "New Visit Details"}
              {requestType === "modify" && "Modification Details"}
              {requestType === "cancel" && "Cancellation Details"}
            </CardTitle>
            <CardDescription>
              {requestType === "new-visit" && "Provide details for your new visit request"}
              {requestType === "modify" && "Select the visit to modify and provide new details"}
              {requestType === "cancel" && "Select the visit to cancel and provide a reason"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {requestType === "modify" || requestType === "cancel" ? (
                <div>
                  <Label htmlFor="existingVisit">Select Existing Visit</Label>
                  <select
                    id="existingVisit"
                    required
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Choose a visit...</option>
                    <option value="1">Jan 10, 2026 - 9:00 AM - Personal Care with Jane Smith</option>
                    <option value="2">Jan 12, 2026 - 9:00 AM - Personal Care with Jane Smith</option>
                    <option value="3">Jan 14, 2026 - 10:00 AM - Companion Care with Maria Garcia</option>
                  </select>
                </div>
              ) : null}

              {requestType !== "cancel" && (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="requestDate">
                        {requestType === "new-visit" ? "Preferred Date" : "New Date"}
                      </Label>
                      <div className="relative mt-1">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="requestDate"
                          type="date"
                          required
                          className="pl-10"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="requestTime">
                        {requestType === "new-visit" ? "Preferred Time" : "New Time"}
                      </Label>
                      <div className="relative mt-1">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="requestTime"
                          type="time"
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="duration">Visit Duration</Label>
                    <select
                      id="duration"
                      required
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select duration...</option>
                      <option value="4">4 hours</option>
                      <option value="6">6 hours</option>
                      <option value="8">8 hours</option>
                      <option value="12">12 hours</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="serviceType">Service Type</Label>
                    <select
                      id="serviceType"
                      required
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select service type...</option>
                      <option value="personal">Personal Care</option>
                      <option value="companion">Companion Care</option>
                      <option value="skilled">Skilled Nursing</option>
                      <option value="dementia">Dementia Care</option>
                      <option value="respite">Respite Care</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="caregiverPreference">Caregiver Preference (Optional)</Label>
                    <select
                      id="caregiverPreference"
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">No preference</option>
                      <option value="jane">Jane Smith</option>
                      <option value="maria">Maria Garcia</option>
                      <option value="robert">Robert Johnson</option>
                    </select>
                  </div>

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="recurring"
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor="recurring" className="font-normal cursor-pointer">
                        Make this a recurring visit
                      </Label>
                      <p className="text-sm text-gray-500 mt-1">
                        Schedule this visit to repeat on a regular basis
                      </p>
                    </div>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="notes">
                  {requestType === "cancel" ? "Reason for Cancellation" : "Additional Notes"}
                  {requestType === "cancel" && <span className="text-red-500"> *</span>}
                </Label>
                <Textarea
                  id="notes"
                  placeholder={
                    requestType === "cancel"
                      ? "Please provide a reason for cancellation..."
                      : "Any special requests or additional information..."
                  }
                  className="mt-1 min-h-[100px]"
                  required={requestType === "cancel"}
                />
              </div>

              {requestType === "cancel" && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-900">
                      <p className="font-semibold mb-1">Cancellation Policy</p>
                      <p>
                        Please provide at least 24 hours notice for cancellations to avoid fees.
                        Cancellations with less than 24 hours notice may be subject to a 50% charge.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Submit Request
                </Button>
                <Link href="/portal/client/schedule">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-2">Request Processing Time</p>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Standard requests are reviewed within 24 hours</li>
                  <li>You will receive email and portal notifications once approved</li>
                  <li>For urgent needs (within 48 hours), please call 1-800-HOME-CARE</li>
                  <li>Cancellations require 24 hours notice to avoid fees</li>
                  <li>Schedule modifications are subject to caregiver availability</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
