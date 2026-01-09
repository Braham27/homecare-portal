import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Filter,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Award,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";

async function getHiringData() {
  // Get job applications from database
  const jobApplications = await prisma.jobApplication.findMany({
    include: {
      jobPosting: true,
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  // Get open job postings
  const openPositions = await prisma.jobPosting.findMany({
    where: { isActive: true },
  });

  // Calculate stats based on actual ApplicationStatus enum
  const newApplications = jobApplications.filter((app) => app.status === "SUBMITTED").length;
  const inReview = jobApplications.filter((app) => app.status === "UNDER_REVIEW").length;
  const interviewScheduled = jobApplications.filter((app) => app.status === "INTERVIEW_SCHEDULED").length;
  const interviewed = jobApplications.filter((app) => app.status === "INTERVIEWED").length;
  const offerMade = jobApplications.filter((app) => app.status === "OFFER_EXTENDED").length;
  const rejected = jobApplications.filter((app) => app.status === "REJECTED").length;
  const hired = jobApplications.filter((app) => app.status === "HIRED").length;

  return {
    applicationStats: {
      total: jobApplications.length,
      new: newApplications,
      inReview: inReview + interviewScheduled,
      interviewed,
      offerMade,
      rejected,
    },
    applications: jobApplications.map((app) => ({
      id: app.id,
      applicantName: `${app.firstName} ${app.lastName}`,
      position: app.jobPosting?.title || "General Application",
      appliedDate: app.createdAt.toISOString().split("T")[0],
      status: app.status.toLowerCase().replace("_", "-"),
      experience: app.yearsExperience ? `${app.yearsExperience} years` : "Not specified",
      email: app.email,
      phone: app.phone || "Not provided",
      location: "Springfield, IL",
      certifications: [],
      availability: "Full-time",
    })),
    hiringPipeline: [
      { stage: "Application Received", count: newApplications, color: "bg-blue-500" },
      { stage: "Under Review", count: inReview, color: "bg-purple-500" },
      { stage: "Interviewed", count: interviewed, color: "bg-amber-500" },
      { stage: "Offer Made", count: offerMade, color: "bg-green-500" },
      { stage: "Hired", count: hired, color: "bg-teal-500" },
    ],
    openPositionsCount: openPositions.length,
    // Get upcoming interviews from applications with INTERVIEW_SCHEDULED status
    upcomingInterviews: jobApplications
      .filter((app) => app.status === "INTERVIEW_SCHEDULED")
      .slice(0, 5)
      .map((app) => ({
        id: app.id,
        applicantName: `${app.firstName} ${app.lastName}`,
        position: app.jobPosting?.title || "General Application",
        date: app.reviewedAt ? app.reviewedAt.toISOString().split("T")[0] : "TBD",
        time: "10:00 AM",
        interviewer: "HR Manager",
        type: "In-person",
      })),
  };
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "new":
      return "bg-blue-100 text-blue-700";
    case "in-review":
    case "reviewing":
      return "bg-purple-100 text-purple-700";
    case "interviewed":
      return "bg-amber-100 text-amber-700";
    case "offer-made":
      return "bg-green-100 text-green-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    case "hired":
      return "bg-teal-100 text-teal-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "new":
      return "New Application";
    case "in-review":
    case "reviewing":
      return "Under Review";
    case "interviewed":
      return "Interviewed";
    case "offer-made":
      return "Offer Extended";
    case "rejected":
      return "Not Selected";
    case "hired":
      return "Hired";
    default:
      return status;
  }
};

export default async function HiringPage() {
  const { applicationStats, applications, hiringPipeline, openPositionsCount, upcomingInterviews } = await getHiringData();
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hiring Pipeline</h1>
        <p className="text-gray-600">
          Manage job applications and track candidates through the hiring process
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{applicationStats.total}</p>
              <p className="text-sm text-gray-500 mt-1">Total Applications</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{applicationStats.new}</p>
              <p className="text-sm text-gray-500 mt-1">New</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{applicationStats.inReview}</p>
              <p className="text-sm text-gray-500 mt-1">In Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">{applicationStats.interviewed}</p>
              <p className="text-sm text-gray-500 mt-1">Interviewed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{applicationStats.offerMade}</p>
              <p className="text-sm text-gray-500 mt-1">Offers Made</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{applicationStats.rejected}</p>
              <p className="text-sm text-gray-500 mt-1">Rejected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hiring Pipeline Visualization */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Hiring Pipeline
          </CardTitle>
          <CardDescription>Visual overview of candidate progression</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-2">
            {hiringPipeline.map((stage, idx) => (
              <div key={idx} className="text-center">
                <div className={`${stage.color} rounded-lg p-4 text-white mb-2`}>
                  <p className="text-2xl font-bold">{stage.count}</p>
                </div>
                <p className="text-xs text-gray-600">{stage.stage}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Applications List */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="all" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">All ({applicationStats.total})</TabsTrigger>
                <TabsTrigger value="new">New ({applicationStats.new})</TabsTrigger>
                <TabsTrigger value="review">Review ({applicationStats.inReview})</TabsTrigger>
                <TabsTrigger value="interviewed">Interviewed ({applicationStats.interviewed})</TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search..." className="pl-10 w-48" />
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>

            <TabsContent value="all" className="space-y-4">
              {applications.map((app) => (
                <Card key={app.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-lg font-semibold">
                          {app.applicantName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{app.applicantName}</h3>
                          <p className="text-sm text-gray-600">{app.position}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Applied {app.appliedDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {app.experience} experience
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full ${getStatusBadge(app.status)}`}>
                        {getStatusText(app.status)}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{app.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{app.phone}</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{app.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{app.availability}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-2">Certifications:</p>
                      <div className="flex flex-wrap gap-2">
                        {app.certifications.map((cert, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <Button variant="outline" size="sm" className="flex-1">
                        View Application
                      </Button>
                      <Button size="sm" className="flex-1">
                        Schedule Interview
                      </Button>
                      <Button variant="outline" size="sm">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="new" className="space-y-4">
              {applications.filter(app => app.status === 'new').map((app) => (
                <Card key={app.id}>
                  <CardContent className="pt-6">
                    <p className="text-gray-600">New application from <strong>{app.applicantName}</strong> for {app.position}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="review" className="space-y-4">
              {applications.filter(app => app.status === 'in-review').map((app) => (
                <Card key={app.id}>
                  <CardContent className="pt-6">
                    <p className="text-gray-600">Under review: <strong>{app.applicantName}</strong> for {app.position}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="interviewed" className="space-y-4">
              {applications.filter(app => app.status === 'interviewed' || app.status === 'offer-made').map((app) => (
                <Card key={app.id}>
                  <CardContent className="pt-6">
                    <p className="text-gray-600">Interviewed: <strong>{app.applicantName}</strong> for {app.position}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Interviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Interviews
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingInterviews.map((interview) => (
                <div key={interview.id} className="border-b last:border-0 pb-4 last:pb-0">
                  <p className="font-semibold text-gray-900 mb-1">{interview.applicantName}</p>
                  <p className="text-sm text-gray-600 mb-2">{interview.position}</p>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-3 w-3" />
                      <span>{interview.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-3 w-3" />
                      <span>{interview.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="h-3 w-3" />
                      <span>{interview.interviewer}</span>
                    </div>
                  </div>
                  <span className="inline-block mt-2 text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {interview.type}
                  </span>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full">
                View All Interviews
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileText className="h-4 w-4" />
                Post New Job Opening
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Users className="h-4 w-4" />
                Bulk Import Applications
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Mail className="h-4 w-4" />
                Send Bulk Email
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-gray-900">Offer sent to David Chen</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-gray-900">Interview scheduled with Jennifer Lee</p>
                    <p className="text-xs text-gray-500">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-gray-900">New application from Sarah Martinez</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
