import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Heart,
  DollarSign,
  Clock,
  GraduationCap,
  Users,
  Shield,
  MapPin,
  Briefcase,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const benefits = [
  {
    icon: DollarSign,
    title: "Competitive Pay",
    description: "Above-average wages with regular reviews and opportunities for raises.",
  },
  {
    icon: Clock,
    title: "Flexible Schedules",
    description: "Choose shifts that fit your life—full-time, part-time, or PRN.",
  },
  {
    icon: GraduationCap,
    title: "Paid Training",
    description: "Comprehensive orientation and ongoing education opportunities.",
  },
  {
    icon: Shield,
    title: "Benefits Package",
    description: "Health insurance, PTO, and retirement plans for eligible employees.",
  },
  {
    icon: Users,
    title: "Supportive Team",
    description: "24/7 support from supervisors and a caring team culture.",
  },
  {
    icon: Heart,
    title: "Meaningful Work",
    description: "Make a real difference in people's lives every single day.",
  },
];

const openPositions = [
  {
    id: "cna-1",
    title: "Certified Nursing Assistant (CNA)",
    type: "Full-time / Part-time",
    location: "Multiple Locations",
    description: "Provide personal care and assistance to clients in their homes.",
    requirements: [
      "Valid CNA certification",
      "1+ year experience preferred",
      "Valid driver's license",
      "Ability to lift 50 lbs",
    ],
  },
  {
    id: "hha-1",
    title: "Home Health Aide (HHA)",
    type: "Full-time / Part-time / PRN",
    location: "Multiple Locations",
    description: "Assist clients with daily activities and provide companionship.",
    requirements: [
      "HHA certification or willing to train",
      "Compassionate and reliable",
      "Valid driver's license",
      "Background check required",
    ],
  },
  {
    id: "rn-1",
    title: "Registered Nurse (RN)",
    type: "Full-time",
    location: "Main Office + Field",
    description: "Provide skilled nursing care and supervise care teams.",
    requirements: [
      "Active RN license",
      "2+ years home health experience",
      "Strong assessment skills",
      "Leadership abilities",
    ],
  },
  {
    id: "companion-1",
    title: "Companion Caregiver",
    type: "Part-time / PRN",
    location: "Multiple Locations",
    description: "Provide companionship and light assistance to seniors.",
    requirements: [
      "No certification required",
      "Friendly and patient demeanor",
      "Reliable transportation",
      "Background check required",
    ],
  },
];

export default function CareersPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Join Our Caregiving Team
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Make a difference in people&apos;s lives while building a rewarding career. 
              We&apos;re always looking for compassionate individuals to join our family.
            </p>
            <Link href="#positions">
              <Button size="lg" className="gap-2">
                View Open Positions <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Work With Us
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We value our caregivers and provide the support, training, and benefits 
              you need to succeed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="positions" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Open Positions
            </h2>
            <p className="text-gray-600">
              Find the perfect role for you and apply today.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {openPositions.map((position) => (
              <Card key={position.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">{position.title}</CardTitle>
                      <CardDescription className="flex flex-wrap items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {position.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {position.location}
                        </span>
                      </CardDescription>
                    </div>
                    <Link href={`/careers/apply?position=${position.id}`}>
                      <Button>Apply Now</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{position.description}</p>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements:</h4>
                    <ul className="grid sm:grid-cols-2 gap-1">
                      {position.requirements.map((req, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Join our team of dedicated caregivers and start a rewarding career 
            helping others live independently at home.
          </p>
          <Link href="/careers/apply">
            <Button size="lg" variant="secondary">
              Apply Now
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
