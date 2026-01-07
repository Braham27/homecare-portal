import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Heart,
  Users,
  Stethoscope,
  Brain,
  Home,
  Moon,
  HandHeart,
  Car,
  Pill,
  Activity,
  ClipboardCheck,
  UserCheck,
  ArrowRight,
  CheckCircle,
  Phone,
} from "lucide-react";

const medicalServices = [
  {
    icon: Stethoscope,
    title: "Skilled Nursing Care",
    slug: "skilled-nursing",
    description: "Licensed RN and LPN nurses provide professional medical care in the comfort of home.",
    tasks: [
      "Wound care and dressing changes",
      "IV therapy and injections",
      "Vital signs monitoring",
      "Post-surgical care",
      "Catheter and ostomy care",
      "Tracheostomy care",
    ],
  },
  {
    icon: Pill,
    title: "Medication Management",
    slug: "medication-management",
    description: "Ensuring medications are taken correctly and safely under professional supervision.",
    tasks: [
      "Medication reminders and administration",
      "Pillbox organization",
      "Prescription coordination",
      "Side effect monitoring",
      "Pharmacy liaison services",
      "Medication reconciliation",
    ],
  },
  {
    icon: Activity,
    title: "Therapy Services",
    slug: "therapy-services",
    description: "In-home physical, occupational, and speech therapy to help regain independence.",
    tasks: [
      "Physical therapy",
      "Occupational therapy",
      "Speech therapy",
      "Mobility training",
      "Strength exercises",
      "Balance improvement",
    ],
  },
  {
    icon: ClipboardCheck,
    title: "Post-Hospitalization Care",
    slug: "post-hospitalization",
    description: "Transitional care to ensure a safe recovery after hospital discharge.",
    tasks: [
      "Discharge planning coordination",
      "Medication management",
      "Follow-up appointment scheduling",
      "Rehabilitation support",
      "Vital signs monitoring",
      "Preventing readmission",
    ],
  },
];

const nonMedicalServices = [
  {
    icon: HandHeart,
    title: "Personal Care Assistance",
    slug: "personal-care",
    description: "Help with daily activities while maintaining dignity and independence.",
    tasks: [
      "Bathing and showering assistance",
      "Dressing and grooming",
      "Toileting and incontinence care",
      "Mobility assistance",
      "Transferring (bed to chair)",
      "Feeding assistance",
    ],
  },
  {
    icon: Users,
    title: "Companion Care",
    slug: "companion-care",
    description: "Meaningful companionship to enhance quality of life and combat loneliness.",
    tasks: [
      "Conversation and social interaction",
      "Games, puzzles, and activities",
      "Reading and letter writing",
      "Accompanying to appointments",
      "Shopping and errands",
      "Light exercise and walks",
    ],
  },
  {
    icon: Home,
    title: "Homemaking Services",
    slug: "homemaking",
    description: "Help maintaining a clean, safe, and comfortable living environment.",
    tasks: [
      "Light housekeeping",
      "Meal planning and preparation",
      "Laundry and linen changes",
      "Grocery shopping",
      "Organizing and decluttering",
      "Plant and pet care",
    ],
  },
  {
    icon: Brain,
    title: "Dementia & Alzheimer's Care",
    slug: "dementia-care",
    description: "Specialized care from trained professionals for memory-related conditions.",
    tasks: [
      "Cognitive stimulation activities",
      "Safety supervision",
      "Routine maintenance",
      "Wandering prevention",
      "Behavioral management",
      "Family education and support",
    ],
  },
  {
    icon: UserCheck,
    title: "Respite Care",
    slug: "respite-care",
    description: "Temporary relief for family caregivers while ensuring continued quality care.",
    tasks: [
      "Hourly respite sessions",
      "Overnight stays",
      "Weekend coverage",
      "Vacation coverage",
      "Emergency backup care",
      "Regular scheduled breaks",
    ],
  },
  {
    icon: Moon,
    title: "24-Hour & Live-In Care",
    slug: "24-hour-care",
    description: "Around-the-clock care for those needing continuous supervision and assistance.",
    tasks: [
      "Day and night supervision",
      "All personal care needs",
      "Medication reminders",
      "Safety monitoring",
      "Companion services",
      "Household management",
    ],
  },
  {
    icon: Car,
    title: "Transportation Services",
    slug: "transportation",
    description: "Safe transportation to appointments, errands, and social activities.",
    tasks: [
      "Medical appointments",
      "Pharmacy trips",
      "Grocery shopping",
      "Social outings",
      "Religious services",
      "Family visits",
    ],
  },
  {
    icon: Heart,
    title: "Hospice Support",
    slug: "hospice-support",
    description: "Compassionate non-medical support in coordination with hospice providers.",
    tasks: [
      "Comfort care assistance",
      "Personal care support",
      "Companionship",
      "Family respite",
      "Light household duties",
      "Emotional support",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Our Home Care Services
            </h1>
            <p className="text-lg text-gray-600">
              Comprehensive medical and non-medical home care services tailored to your 
              family&apos;s unique needs. All care is delivered by trained, compassionate 
              professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Medical Services */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-red-100 p-2 rounded-lg">
              <Stethoscope className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Medical Home Care Services</h2>
          </div>
          <p className="text-gray-600 mb-8 max-w-3xl">
            Our skilled medical services are provided by licensed nurses and therapists, 
            offering hospital-quality care in the comfort of home.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {medicalServices.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="bg-red-50 p-3 rounded-lg">
                      <service.icon className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <CardDescription className="mt-1">{service.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Services include:</h4>
                  <ul className="grid grid-cols-2 gap-1 text-sm text-gray-600">
                    {service.tasks.map((task, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                        {task}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-primary font-medium inline-flex items-center gap-1 mt-4 hover:gap-2 transition-all"
                  >
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Non-Medical Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-primary/10 p-2 rounded-lg">
              <HandHeart className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Non-Medical Home Care Services</h2>
          </div>
          <p className="text-gray-600 mb-8 max-w-3xl">
            Our personal care and companion services help clients maintain their independence 
            and quality of life while receiving the support they need.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nonMedicalServices.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm text-gray-600 mb-4">
                    {service.tasks.slice(0, 4).map((task, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                        {task}
                      </li>
                    ))}
                    {service.tasks.length > 4 && (
                      <li className="text-gray-500 text-xs">+ {service.tasks.length - 4} more...</li>
                    )}
                  </ul>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-primary font-medium inline-flex items-center gap-1 hover:gap-2 transition-all text-sm"
                  >
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Link>
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
            Not Sure Which Services You Need?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            We offer a free, no-obligation care assessment to understand your unique 
            situation and recommend the right combination of services.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/get-started">
              <Button size="lg" variant="secondary">
                Schedule Free Assessment
              </Button>
            </Link>
            <Link href="tel:1-800-HOMECARE">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <Phone className="mr-2 h-4 w-4" />
                1-800-HOMECARE
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
