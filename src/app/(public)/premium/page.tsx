import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Crown,
  Star,
  CheckCircle,
  Sparkles,
  Users,
  Clock,
  Heart,
  Shield,
  Phone,
  Video,
  Smartphone,
  Headphones,
  Calendar,
  FileText,
  Activity,
  Home,
  ArrowRight,
} from "lucide-react";

const premiumFeatures = [
  {
    icon: Users,
    title: "Dedicated Care Team",
    description: "A consistent team of 2-3 specialized caregivers exclusively assigned to you",
  },
  {
    icon: Clock,
    title: "Priority Scheduling",
    description: "First choice on caregiver schedules and guaranteed same-day response for schedule changes",
  },
  {
    icon: Video,
    title: "Virtual Care Monitoring",
    description: "Optional remote monitoring with smart home devices and video check-ins",
  },
  {
    icon: Phone,
    title: "24/7 Concierge Support",
    description: "Direct line to your personal care coordinator, available anytime day or night",
  },
  {
    icon: Activity,
    title: "Advanced Health Monitoring",
    description: "Daily vital signs tracking with nurse review and physician communication",
  },
  {
    icon: FileText,
    title: "Enhanced Care Documentation",
    description: "Detailed daily reports, photos, and real-time updates through secure portal",
  },
];

const premiumServices = [
  {
    category: "Wellness & Therapy",
    icon: Heart,
    services: [
      "In-home physical therapy coordination",
      "Occupational therapy sessions",
      "Personalized exercise programs",
      "Nutrition consultation and meal planning",
      "Mental health and cognitive exercises",
    ],
  },
  {
    category: "Concierge Services",
    icon: Crown,
    services: [
      "Personal shopping and errand services",
      "Travel coordination and accompaniment",
      "Event and activity planning",
      "Technology setup and training",
      "Home organization and safety upgrades",
    ],
  },
  {
    category: "Medical Coordination",
    icon: Shield,
    services: [
      "Physician appointment coordination",
      "Specialist referrals and navigation",
      "Medication reconciliation and optimization",
      "Medical records management",
      "Insurance claims assistance",
    ],
  },
  {
    category: "Family Support",
    icon: Users,
    services: [
      "Weekly family video conferences",
      "Monthly care review meetings",
      "Respite care planning",
      "Caregiver education sessions",
      "End-of-life planning support",
    ],
  },
];

const premiumBenefits = [
  {
    title: "Higher Caregiver Qualifications",
    description: "All Premium caregivers have 5+ years experience and specialized certifications",
    icon: Star,
  },
  {
    title: "Reduced Caregiver Turnover",
    description: "Dedicated team approach ensures continuity and stronger relationships",
    icon: Users,
  },
  {
    title: "Faster Response Times",
    description: "Guaranteed 2-hour response for urgent needs, 24-hour for routine requests",
    icon: Clock,
  },
  {
    title: "Comprehensive Care Planning",
    description: "Monthly in-person reviews with RN care manager and quarterly physician updates",
    icon: FileText,
  },
  {
    title: "Technology Integration",
    description: "Smart home devices, medication dispensers, and fall detection systems included",
    icon: Smartphone,
  },
  {
    title: "Premium Support Access",
    description: "Direct access to nursing staff, social workers, and administrative leadership",
    icon: Headphones,
  },
];

export default function PremiumCarePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 via-white to-purple-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full">
                <Crown className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Premium Home Care Services
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Exceptional, personalized care with dedicated teams, advanced health monitoring, 
              and comprehensive support services for the highest quality of life at home.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/get-started">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700">
                  <Sparkles className="h-5 w-5" />
                  Upgrade to Premium
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="gap-2">
                  <Phone className="h-4 w-4" /> Schedule Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Features Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Makes Premium Care Different</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our Premium tier elevates home care with exclusive features and personalized attention 
              that goes beyond standard services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {premiumFeatures.map((feature) => (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow border-amber-100">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Services */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-amber-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Enhanced Services Included</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Premium members receive access to comprehensive services that address all aspects of health, 
              wellness, and quality of life.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {premiumServices.map((category) => (
              <Card key={category.category} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <category.icon className="h-6 w-6 text-amber-600" />
                    </div>
                    <CardTitle className="text-xl">{category.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.services.map((service) => (
                      <li key={service} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{service}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Premium Care Benefits</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the difference that premium care makes in daily life and long-term outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {premiumBenefits.map((benefit) => (
              <Card key={benefit.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <benefit.icon className="h-6 w-6 text-amber-600" />
                    </div>
                  </div>
                  <CardTitle className="text-lg mb-2">{benefit.title}</CardTitle>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Standard vs. Premium Care</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See how Premium care compares to our standard service tier.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Standard Care</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-amber-700 bg-amber-50">
                          <div className="flex items-center justify-center gap-2">
                            <Crown className="h-4 w-4" />
                            Premium Care
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">Caregiver Experience</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">2+ years</td>
                        <td className="px-6 py-4 text-center text-sm font-semibold text-amber-700 bg-amber-50/50">5+ years</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">Dedicated Care Team</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">—</td>
                        <td className="px-6 py-4 text-center bg-amber-50/50">
                          <CheckCircle className="h-5 w-5 text-amber-600 mx-auto" />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">Response Time</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">24 hours</td>
                        <td className="px-6 py-4 text-center text-sm font-semibold text-amber-700 bg-amber-50/50">2 hours</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">Care Coordinator</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">Shared</td>
                        <td className="px-6 py-4 text-center text-sm font-semibold text-amber-700 bg-amber-50/50">Personal</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">Care Plan Reviews</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">Quarterly</td>
                        <td className="px-6 py-4 text-center text-sm font-semibold text-amber-700 bg-amber-50/50">Monthly</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">Health Monitoring</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">As needed</td>
                        <td className="px-6 py-4 text-center text-sm font-semibold text-amber-700 bg-amber-50/50">Daily</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">Virtual Monitoring</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">—</td>
                        <td className="px-6 py-4 text-center bg-amber-50/50">
                          <CheckCircle className="h-5 w-5 text-amber-600 mx-auto" />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">Concierge Services</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">—</td>
                        <td className="px-6 py-4 text-center bg-amber-50/50">
                          <CheckCircle className="h-5 w-5 text-amber-600 mx-auto" />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">24/7 Nursing Access</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">—</td>
                        <td className="px-6 py-4 text-center bg-amber-50/50">
                          <CheckCircle className="h-5 w-5 text-amber-600 mx-auto" />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">Smart Home Integration</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">—</td>
                        <td className="px-6 py-4 text-center bg-amber-50/50">
                          <CheckCircle className="h-5 w-5 text-amber-600 mx-auto" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="border-2 border-amber-300 shadow-xl">
              <CardHeader className="bg-gradient-to-br from-amber-50 to-amber-100 border-b border-amber-200">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full">
                    <Crown className="h-10 w-10 text-white" />
                  </div>
                </div>
                <CardTitle className="text-3xl text-center">Premium Care Investment</CardTitle>
                <CardDescription className="text-center text-base mt-2">
                  Exceptional care with comprehensive support and peace of mind
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="text-center mb-8">
                  <p className="text-gray-600 mb-2">Starting at</p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-amber-600">$45-65</span>
                    <span className="text-xl text-gray-500">/hour</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    15-20% premium over standard rates
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                    <span className="text-gray-600">All standard care services included</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                    <span className="text-gray-600">Enhanced features and monitoring</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                    <span className="text-gray-600">Dedicated care team and coordinator</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                    <span className="text-gray-600">Smart home technology included</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                    <span className="text-gray-600">Concierge and wellness services</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Link href="/get-started">
                    <Button size="lg" className="w-full gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700">
                      <Sparkles className="h-5 w-5" />
                      Get Started with Premium
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="w-full">
                      Schedule Consultation
                    </Button>
                  </Link>
                </div>

                <p className="text-xs text-center text-gray-500 mt-6">
                  Premium care packages available with additional savings for full-time and live-in arrangements
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Who Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Who Benefits from Premium Care?
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ideal For</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>Clients with complex medical needs requiring close monitoring</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>Families seeking maximum peace of mind and oversight</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>Individuals who value consistency and relationship-based care</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>Those transitioning from hospital or rehabilitation facilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>Clients who want access to comprehensive wellness services</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Advantages</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>Proactive health management prevents complications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>Stronger caregiver relationships improve outcomes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>Enhanced communication keeps families informed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>Technology integration improves safety and independence</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>Comprehensive approach addresses all aspects of wellbeing</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-amber-600 to-amber-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Sparkles className="h-12 w-12 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Experience the Difference Premium Care Makes
            </h2>
            <p className="text-lg mb-8 text-amber-50">
              Join families who have chosen Premium care for their loved ones and discovered 
              the peace of mind that comes with exceptional, personalized home care.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/get-started">
                <Button size="lg" variant="secondary" className="gap-2">
                  <Crown className="h-5 w-5" />
                  Upgrade to Premium
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                  Compare All Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
