import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Calendar,
  FileText,
  Heart,
  Phone,
  Mail,
  MapPin,
  Clock,
  Activity,
  Pill,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Home,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

// Mock data - would come from API based on [id]
const clientDetails = {
  id: "CLT-001",
  name: "Mary Johnson",
  age: 78,
  gender: "Female",
  photo: "MJ",
  address: "456 Oak Avenue, Apt 3B, Springfield, IL 62701",
  phone: "(555) 123-4567",
  emergencyContact: {
    name: "Robert Johnson (Son)",
    phone: "(555) 987-6543",
    relation: "Son",
  },
  primaryDiagnoses: ["Hypertension", "Type 2 Diabetes", "Osteoarthritis"],
  allergies: ["Penicillin", "Sulfa drugs"],
  mobility: "Walker-assisted",
  cognitiveStatus: "Alert and oriented",
  careLevel: "Moderate Assistance",
};

const upcomingVisits = [
  {
    id: "1",
    date: "2026-01-09",
    time: "9:00 AM - 1:00 PM",
    services: ["Personal Care", "Meal Preparation"],
    status: "Scheduled",
  },
  {
    id: "2",
    date: "2026-01-11",
    time: "9:00 AM - 1:00 PM",
    services: ["Personal Care", "Light Housekeeping"],
    status: "Scheduled",
  },
];

const carePlanSummary = {
  goals: [
    "Maintain independence with daily activities",
    "Improve mobility and reduce fall risk",
    "Manage chronic conditions effectively",
  ],
  tasks: [
    { task: "Assist with bathing and grooming", frequency: "Daily" },
    { task: "Medication reminders", frequency: "Twice daily" },
    { task: "Prepare nutritious meals", frequency: "Daily" },
    { task: "Light housekeeping", frequency: "As needed" },
    { task: "Assist with exercises", frequency: "3x per week" },
    { task: "Monitor vital signs", frequency: "Weekly" },
  ],
  preferences: [
    "Prefers morning showers",
    "Enjoys classical music",
    "Likes to sit by the window",
    "Vegetarian diet",
  ],
};

const medications = [
  {
    name: "Lisinopril 10mg",
    dosage: "1 tablet",
    schedule: "Once daily - Morning",
    purpose: "Blood pressure control",
  },
  {
    name: "Metformin 500mg",
    dosage: "1 tablet",
    schedule: "Twice daily - With meals",
    purpose: "Diabetes management",
  },
  {
    name: "Vitamin D 1000 IU",
    dosage: "1 tablet",
    schedule: "Once daily - Morning",
    purpose: "Bone health",
  },
  {
    name: "Aspirin 81mg",
    dosage: "1 tablet",
    schedule: "Once daily - Morning",
    purpose: "Heart health",
  },
];

const recentNotes = [
  {
    date: "2026-01-06",
    caregiver: "You",
    note: "Client in good spirits today. Completed morning hygiene and breakfast without issues. Took 15-minute walk around the block with walker. Blood pressure: 128/82.",
  },
  {
    date: "2026-01-04",
    caregiver: "You",
    note: "Client mentioned slight knee pain. Applied heat pack as instructed. All medications taken on time. Enjoyed conversation about family.",
  },
];

const safetyAlerts = [
  {
    type: "Fall Risk",
    description: "Client uses walker for mobility. Ensure clear pathways.",
    severity: "Medium",
  },
  {
    type: "Medication",
    description: "Allergic to Penicillin and Sulfa drugs",
    severity: "High",
  },
];

export default function ClientDetailsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/portal/employee/clients">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Clients
          </Button>
        </Link>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-semibold">
              {clientDetails.photo}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{clientDetails.name}</h1>
              <p className="text-gray-600">
                {clientDetails.age} years old • {clientDetails.gender} • ID: {clientDetails.id}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {clientDetails.careLevel}
                </span>
                <span className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full">
                  Active Client
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Message
            </Button>
            <Button variant="outline" className="gap-2">
              <Phone className="h-4 w-4" />
              Call
            </Button>
          </div>
        </div>
      </div>

      {/* Safety Alerts */}
      {safetyAlerts.length > 0 && (
        <div className="mb-6 space-y-3">
          {safetyAlerts.map((alert, idx) => (
            <Card
              key={idx}
              className={`border-2 ${
                alert.severity === "High"
                  ? "border-red-300 bg-red-50"
                  : "border-amber-300 bg-amber-50"
              }`}
            >
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <AlertCircle
                    className={`h-5 w-5 mt-0.5 ${
                      alert.severity === "High" ? "text-red-600" : "text-amber-600"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p
                        className={`font-semibold ${
                          alert.severity === "High" ? "text-red-900" : "text-amber-900"
                        }`}
                      >
                        {alert.type}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          alert.severity === "High"
                            ? "bg-red-200 text-red-800"
                            : "bg-amber-200 text-amber-800"
                        }`}
                      >
                        {alert.severity} Priority
                      </span>
                    </div>
                    <p
                      className={`text-sm ${
                        alert.severity === "High" ? "text-red-800" : "text-amber-800"
                      }`}
                    >
                      {alert.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Info Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Address</p>
                <p className="text-sm font-medium text-gray-900">{clientDetails.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Contact</p>
                <p className="text-sm font-medium text-gray-900">{clientDetails.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Emergency Contact</p>
                <p className="text-sm font-medium text-gray-900">{clientDetails.emergencyContact.name}</p>
                <p className="text-xs text-gray-500">{clientDetails.emergencyContact.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="care-plan" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="care-plan">Care Plan</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="notes">Visit Notes</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Care Plan Tab */}
        <TabsContent value="care-plan" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Care Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {carePlanSummary.goals.map((goal, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{goal}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Client Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Mobility</p>
                  <p className="text-sm font-medium text-gray-900">{clientDetails.mobility}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cognitive Status</p>
                  <p className="text-sm font-medium text-gray-900">{clientDetails.cognitiveStatus}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Primary Diagnoses</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {clientDetails.primaryDiagnoses.map((diagnosis, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                      >
                        {diagnosis}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Daily Care Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {carePlanSummary.tasks.map((task, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 border rounded-lg">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{task.task}</p>
                      <p className="text-xs text-gray-500 mt-1">{task.frequency}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                Client Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {carePlanSummary.preferences.map((pref, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    {pref}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Visits
              </CardTitle>
              <CardDescription>Your scheduled visits with this client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingVisits.map((visit) => (
                  <div key={visit.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{visit.date}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Clock className="h-4 w-4" />
                          {visit.time}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {visit.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Services:</p>
                      <div className="flex flex-wrap gap-2">
                        {visit.services.map((service, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medical Tab */}
        <TabsContent value="medical" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-primary" />
                Current Medications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medications.map((med, idx) => (
                  <div key={idx} className="border-b last:border-0 pb-4 last:pb-0">
                    <h4 className="font-semibold text-gray-900">{med.name}</h4>
                    <div className="grid md:grid-cols-3 gap-4 mt-2 text-sm">
                      <div>
                        <p className="text-gray-500">Dosage</p>
                        <p className="text-gray-900">{med.dosage}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Schedule</p>
                        <p className="text-gray-900">{med.schedule}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Purpose</p>
                        <p className="text-gray-900">{med.purpose}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-900">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Allergies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {clientDetails.allergies.map((allergy, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-red-100 text-red-800 font-semibold rounded-full"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Recent Visit Notes
              </CardTitle>
              <CardDescription>Your documented visits with this client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentNotes.map((note, idx) => (
                  <div key={idx} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-900">{note.date}</p>
                      <p className="text-xs text-gray-500">By {note.caregiver}</p>
                    </div>
                    <p className="text-sm text-gray-700">{note.note}</p>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline">
                Add New Visit Note
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Client Documents
              </CardTitle>
              <CardDescription>Important documents and forms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Care Plan - January 2026</p>
                      <p className="text-xs text-gray-500">Updated: 01/01/2026</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Medical History</p>
                      <p className="text-xs text-gray-500">Updated: 12/01/2025</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Emergency Contacts</p>
                      <p className="text-xs text-gray-500">Updated: 11/15/2025</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
