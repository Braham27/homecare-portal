"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle, Upload, AlertCircle } from "lucide-react";

const positions = [
  { id: "cna-1", title: "Certified Nursing Assistant (CNA)" },
  { id: "hha-1", title: "Home Health Aide (HHA)" },
  { id: "rn-1", title: "Registered Nurse (RN)" },
  { id: "companion-1", title: "Companion Caregiver" },
  { id: "other", title: "Other / General Application" },
];

function ApplyForm() {
  const searchParams = useSearchParams();
  const preselectedPosition = searchParams.get("position") || "";
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    // Position
    position: preselectedPosition,
    yearsExperience: "",
    // Availability
    availableFullTime: false,
    availablePartTime: false,
    availableWeekends: false,
    availableNights: false,
    startDate: "",
    // Qualifications
    hasCNA: false,
    hasHHA: false,
    hasRN: false,
    hasLPN: false,
    hasDriverLicense: false,
    hasTransportation: false,
    canLift50: false,
    // Additional
    whyInterested: "",
    // Consent
    backgroundCheckConsent: false,
    certifyAccurate: false,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!formData.backgroundCheckConsent || !formData.certifyAccurate) {
      setError("Please agree to all required consents");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      setIsSubmitted(true);
    } catch {
      setError("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="py-20">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="bg-green-50 rounded-2xl p-12">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Application Submitted!
            </h1>
            <p className="text-gray-600 mb-8">
              Thank you for your interest in joining our team. We&apos;ll review your 
              application and contact you within 5-7 business days.
            </p>
            <Link href="/careers">
              <Button>Back to Careers</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Employment Application
            </h1>
            <p className="text-gray-600">
              Complete the form below to apply for a position with our team.
            </p>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            {[
              { num: 1, label: "Personal Info" },
              { num: 2, label: "Qualifications" },
              { num: 3, label: "Review & Submit" },
            ].map((s) => (
              <div
                key={s.num}
                className={`flex items-center gap-2 ${
                  step >= s.num ? "text-primary" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= s.num
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {s.num}
                </div>
                <span className="hidden sm:inline text-sm font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-6 flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="h-5 w-5" />
                {error}
              </div>
            )}

            {/* Step 1: Personal Info */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Tell us about yourself</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleChange("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleChange("state", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => handleChange("zipCode", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Position Applying For *</Label>
                    <Select
                      value={formData.position}
                      onValueChange={(value) => handleChange("position", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a position" />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.map((pos) => (
                          <SelectItem key={pos.id} value={pos.id}>
                            {pos.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Resume (Optional)</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Drag and drop or click to upload
                      </p>
                      <p className="text-xs text-gray-500">PDF, DOC up to 5MB</p>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button type="button" onClick={() => setStep(2)}>
                      Next: Qualifications
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Qualifications */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Qualifications & Availability</CardTitle>
                  <CardDescription>Tell us about your experience and availability</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="yearsExperience">Years of Caregiving Experience</Label>
                    <Select
                      value={formData.yearsExperience}
                      onValueChange={(value) => handleChange("yearsExperience", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No experience</SelectItem>
                        <SelectItem value="1">Less than 1 year</SelectItem>
                        <SelectItem value="1-3">1-3 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5+">5+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Certifications (Check all that apply)</Label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { id: "hasCNA", label: "Certified Nursing Assistant (CNA)" },
                        { id: "hasHHA", label: "Home Health Aide (HHA)" },
                        { id: "hasRN", label: "Registered Nurse (RN)" },
                        { id: "hasLPN", label: "Licensed Practical Nurse (LPN)" },
                      ].map((cert) => (
                        <div key={cert.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={cert.id}
                            checked={formData[cert.id as keyof typeof formData] as boolean}
                            onCheckedChange={(checked) => handleChange(cert.id, checked as boolean)}
                          />
                          <label htmlFor={cert.id} className="text-sm">{cert.label}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Availability (Check all that apply)</Label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { id: "availableFullTime", label: "Full-time (40 hrs/week)" },
                        { id: "availablePartTime", label: "Part-time (< 40 hrs/week)" },
                        { id: "availableWeekends", label: "Weekends" },
                        { id: "availableNights", label: "Overnight shifts" },
                      ].map((avail) => (
                        <div key={avail.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={avail.id}
                            checked={formData[avail.id as keyof typeof formData] as boolean}
                            onCheckedChange={(checked) => handleChange(avail.id, checked as boolean)}
                          />
                          <label htmlFor={avail.id} className="text-sm">{avail.label}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Additional Requirements</Label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { id: "hasDriverLicense", label: "Valid driver's license" },
                        { id: "hasTransportation", label: "Reliable transportation" },
                        { id: "canLift50", label: "Able to lift 50 lbs" },
                      ].map((req) => (
                        <div key={req.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={req.id}
                            checked={formData[req.id as keyof typeof formData] as boolean}
                            onCheckedChange={(checked) => handleChange(req.id, checked as boolean)}
                          />
                          <label htmlFor={req.id} className="text-sm">{req.label}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whyInterested">Why are you interested in this position?</Label>
                    <Textarea
                      id="whyInterested"
                      rows={4}
                      value={formData.whyInterested}
                      onChange={(e) => handleChange("whyInterested", e.target.value)}
                      placeholder="Tell us about yourself and why you want to be a caregiver..."
                    />
                  </div>

                  <div className="pt-4 flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button type="button" onClick={() => setStep(3)}>
                      Next: Review & Submit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Review & Submit */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review & Submit</CardTitle>
                  <CardDescription>Please review your information and submit</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <h3 className="font-medium">Application Summary</h3>
                    <div className="grid sm:grid-cols-2 gap-2 text-sm">
                      <p><span className="text-gray-500">Name:</span> {formData.firstName} {formData.lastName}</p>
                      <p><span className="text-gray-500">Email:</span> {formData.email}</p>
                      <p><span className="text-gray-500">Phone:</span> {formData.phone}</p>
                      <p><span className="text-gray-500">Position:</span> {positions.find(p => p.id === formData.position)?.title || "Not selected"}</p>
                      <p><span className="text-gray-500">Experience:</span> {formData.yearsExperience || "Not specified"}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="backgroundCheckConsent"
                        checked={formData.backgroundCheckConsent}
                        onCheckedChange={(checked) => handleChange("backgroundCheckConsent", checked as boolean)}
                      />
                      <label htmlFor="backgroundCheckConsent" className="text-sm">
                        I authorize HomeCare to conduct a background check as part of the 
                        employment process. I understand this may include criminal history, 
                        driving records, and reference verification. *
                      </label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="certifyAccurate"
                        checked={formData.certifyAccurate}
                        onCheckedChange={(checked) => handleChange("certifyAccurate", checked as boolean)}
                      />
                      <label htmlFor="certifyAccurate" className="text-sm">
                        I certify that all information provided in this application is true 
                        and accurate to the best of my knowledge. I understand that any 
                        misrepresentation may result in rejection of my application or 
                        termination of employment. *
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

function ApplyFormFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-2 text-gray-600">Loading application form...</p>
      </div>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<ApplyFormFallback />}>
      <ApplyForm />
    </Suspense>
  );
}
