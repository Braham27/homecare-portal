import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Heart,
  Activity,
  Pill,
  Target,
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  Download,
  Edit,
  Users,
  Stethoscope,
} from "lucide-react";

// Mock data - would come from API
const carePlan = {
  clientName: "Mary Johnson",
  startDate: "2025-12-01",
  lastReview: "2026-01-01",
  nextReview: "2026-04-01",
  careCoordinator: "Sarah Johnson, RN",
  primaryCaregiver: "Jane Smith",
  status: "Active",
};

const careGoals = [
  {
    id: "1",
    category: "Mobility",
    goal: "Increase walking distance to 100 feet with walker",
    progress: 75,
    status: "On Track",
    target: "March 2026",
    tasks: [
      { task: "Daily assisted walks", completed: true },
      { task: "Strength exercises 3x/week", completed: true },
      { task: "Physical therapy sessions", completed: false },
    ],
  },
  {
    id: "2",
    category: "Nutrition",
    goal: "Maintain healthy weight of 135-140 lbs",
    progress: 90,
    status: "Achieved",
    target: "Ongoing",
    tasks: [
      { task: "Balanced meal preparation", completed: true },
      { task: "Daily fluid intake monitoring", completed: true },
      { task: "Weekly weight checks", completed: true },
    ],
  },
  {
    id: "3",
    category: "Social Engagement",
    goal: "Participate in 3 social activities per week",
    progress: 60,
    status: "Needs Attention",
    target: "February 2026",
    tasks: [
      { task: "Weekly family video calls", completed: true },
      { task: "Senior center activities", completed: false },
      { task: "Book club participation", completed: true },
    ],
  },
  {
    id: "4",
    category: "Medication Management",
    goal: "100% medication adherence",
    progress: 100,
    status: "Achieved",
    target: "Ongoing",
    tasks: [
      { task: "Daily medication reminders", completed: true },
      { task: "Weekly pillbox setup", completed: true },
      { task: "Monthly pharmacy coordination", completed: true },
    ],
  },
];

const dailyRoutine = [
  { time: "7:30 AM", activity: "Wake up, morning hygiene", caregiver: "Jane Smith" },
  { time: "8:00 AM", activity: "Breakfast and medications", caregiver: "Jane Smith" },
  { time: "9:00 AM", activity: "Light exercises and stretching", caregiver: "Jane Smith" },
  { time: "10:00 AM", activity: "Personal activities, reading", caregiver: "Independent" },
  { time: "12:00 PM", activity: "Lunch preparation and meal", caregiver: "Jane Smith" },
  { time: "1:00 PM", activity: "Assisted walk outdoors", caregiver: "Jane Smith" },
  { time: "2:00 PM", activity: "Rest period", caregiver: "Independent" },
  { time: "3:00 PM", activity: "Social activities or hobbies", caregiver: "Independent" },
  { time: "5:00 PM", activity: "Dinner preparation", caregiver: "Family/Jane Smith" },
  { time: "6:00 PM", activity: "Evening medications", caregiver: "Family" },
  { time: "8:00 PM", activity: "Evening hygiene, prepare for bed", caregiver: "Family" },
];

const medications = [
  {
    name: "Lisinopril 10mg",
    purpose: "Blood pressure",
    schedule: "Once daily - Morning",
    prescriber: "Dr. Michael Chen",
  },
  {
    name: "Metformin 500mg",
    purpose: "Diabetes",
    schedule: "Twice daily - With meals",
    prescriber: "Dr. Michael Chen",
  },
  {
    name: "Vitamin D 1000 IU",
    purpose: "Bone health",
    schedule: "Once daily - Morning",
    prescriber: "Dr. Michael Chen",
  },
  {
    name: "Aspirin 81mg",
    purpose: "Heart health",
    schedule: "Once daily - Morning",
    prescriber: "Dr. Michael Chen",
  },
];

const healthConditions = [
  { condition: "Hypertension", status: "Controlled", since: "2020" },
  { condition: "Type 2 Diabetes", status: "Managed", since: "2018" },
  { condition: "Osteoarthritis", status: "Managed", since: "2015" },
];

export default function CarePlanPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Care Plan</h1>
            <p className="text-gray-600">
              Comprehensive care plan for {carePlan.clientName}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Request Changes
            </Button>
          </div>
        </div>

        {/* Care Plan Overview */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-semibold text-gray-900">{carePlan.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Care Coordinator</p>
                  <p className="font-semibold text-gray-900 text-sm">{carePlan.careCoordinator}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Review</p>
                  <p className="font-semibold text-gray-900">{carePlan.lastReview}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Next Review</p>
                  <p className="font-semibold text-gray-900">{carePlan.nextReview}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="goals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="goals">Care Goals</TabsTrigger>
          <TabsTrigger value="routine">Daily Routine</TabsTrigger>
          <TabsTrigger value="medical">Medical Info</TabsTrigger>
          <TabsTrigger value="team">Care Team</TabsTrigger>
        </TabsList>

        {/* Care Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Care Goals & Progress
              </CardTitle>
              <CardDescription>
                Track progress toward personalized care objectives
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {careGoals.map((goal) => (
                <div key={goal.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{goal.category}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            goal.status === "Achieved"
                              ? "bg-green-100 text-green-700"
                              : goal.status === "On Track"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {goal.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{goal.goal}</p>
                      <p className="text-xs text-gray-500">Target: {goal.target}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-gray-900">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Tasks:</p>
                    {goal.tasks.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        {item.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />
                        )}
                        <span className={item.completed ? "text-gray-500" : "text-gray-700"}>
                          {item.task}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Daily Routine Tab */}
        <TabsContent value="routine" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Daily Care Routine
              </CardTitle>
              <CardDescription>
                Typical daily schedule and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dailyRoutine.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-20">
                      <p className="text-sm font-semibold text-primary">{item.time}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.activity}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {item.caregiver}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> This is a typical routine and may be adjusted based on daily needs, 
                  appointments, and preferences. Caregivers are flexible to accommodate changes.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medical Info Tab */}
        <TabsContent value="medical" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Medications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-primary" />
                  Current Medications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {medications.map((med, idx) => (
                  <div key={idx} className="border-b last:border-0 pb-3 last:pb-0">
                    <h4 className="font-semibold text-gray-900 text-sm">{med.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Purpose:</strong> {med.purpose}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Schedule:</strong> {med.schedule}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Prescribed by {med.prescriber}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Health Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Health Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {healthConditions.map((condition, idx) => (
                  <div key={idx} className="border-b last:border-0 pb-3 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{condition.condition}</h4>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        {condition.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Since {condition.since}</p>
                  </div>
                ))}

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Allergies:</p>
                  <p className="text-sm text-gray-600">Penicillin, Sulfa drugs</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Emergency Contacts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Emergency Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Primary Physician</p>
                  <p className="text-sm text-gray-600">Dr. Michael Chen</p>
                  <p className="text-sm text-gray-500">(555) 123-4567</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Emergency Contact</p>
                  <p className="text-sm text-gray-600">Robert Johnson (Son)</p>
                  <p className="text-sm text-gray-500">(555) 987-6543</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Hospital Preference</p>
                  <p className="text-sm text-gray-600">City General Hospital</p>
                  <p className="text-sm text-gray-500">123 Medical Center Dr</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Care Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Care Coordinator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-semibold">
                    SJ
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Sarah Johnson, RN</h3>
                    <p className="text-sm text-gray-600">Registered Nurse</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Available: Mon-Fri, 8 AM - 6 PM
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">Message</Button>
                      <Button size="sm" variant="outline">Call</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Primary Caregiver
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-semibold">
                    JS
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Jane Smith</h3>
                    <p className="text-sm text-gray-600">Certified Nursing Assistant</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Schedule: Mon, Wed, Fri - 8 AM - 4 PM
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">Message</Button>
                      <Button size="sm" variant="outline">View Schedule</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  Medical Director
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-xl font-semibold">
                    MC
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Dr. Michael Chen</h3>
                    <p className="text-sm text-gray-600">Medical Director</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Oversees medical care and treatment plans
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">Message</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Support Staff
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Backup Caregiver</p>
                    <p className="text-sm text-gray-600">Maria Garcia, CNA</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Billing Contact</p>
                    <p className="text-sm text-gray-600">billing@homecare.com</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">24/7 Support Line</p>
                    <p className="text-sm text-gray-600">1-800-HOME-CARE</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
