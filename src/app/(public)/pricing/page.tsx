import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Heart,
  Clock,
  Stethoscope,
  Moon,
  CheckCircle,
  CreditCard,
  Shield,
  DollarSign,
  FileText,
  Phone,
  ArrowRight,
} from "lucide-react";

const serviceRates = [
  {
    icon: Heart,
    title: "Personal Care",
    hourly: "$28-35",
    description: "Assistance with daily activities and personal hygiene",
    includes: [
      "Bathing and grooming",
      "Dressing assistance",
      "Meal preparation",
      "Light housekeeping",
      "Mobility assistance",
    ],
  },
  {
    icon: Heart,
    title: "Companion Care",
    hourly: "$25-30",
    description: "Social interaction and non-medical support",
    includes: [
      "Conversation and companionship",
      "Medication reminders",
      "Light meal preparation",
      "Errands and transportation",
      "Activity participation",
    ],
  },
  {
    icon: Stethoscope,
    title: "Skilled Nursing",
    hourly: "$55-75",
    description: "Licensed nurse providing medical care",
    includes: [
      "Wound care and dressing",
      "IV therapy",
      "Medication administration",
      "Vital signs monitoring",
      "Post-surgical care",
    ],
  },
  {
    icon: Clock,
    title: "Dementia Care",
    hourly: "$32-40",
    description: "Specialized care for cognitive impairment",
    includes: [
      "Memory care techniques",
      "Behavioral support",
      "Safety supervision",
      "Routine establishment",
      "Family education",
    ],
  },
];

const packageOptions = [
  {
    title: "Part-Time Care",
    hours: "4-8 hours/day",
    priceRange: "$600-1,200/week",
    description: "Ideal for clients who need assistance with specific daily tasks",
    features: [
      "Flexible scheduling",
      "Same caregiver when possible",
      "No minimum commitment",
      "Care plan included",
    ],
    popular: false,
  },
  {
    title: "Full-Time Care",
    hours: "8-12 hours/day",
    priceRange: "$1,400-2,800/week",
    description: "Comprehensive daily support for clients requiring extended care",
    features: [
      "Dedicated caregiver team",
      "Priority scheduling",
      "Weekly care plan reviews",
      "Care coordinator assigned",
      "10% discount on hourly rates",
    ],
    popular: true,
  },
  {
    title: "24-Hour Live-In Care",
    hours: "24/7 presence",
    priceRange: "$3,500-5,000/week",
    description: "Round-the-clock care with live-in caregiver",
    features: [
      "Live-in caregiver",
      "8 hours sleep time",
      "Two caregivers rotate shifts",
      "15% discount on hourly rates",
      "Dedicated care coordinator",
      "Bi-weekly care plan reviews",
    ],
    popular: false,
  },
];

const paymentOptions = [
  {
    icon: CreditCard,
    title: "Private Pay",
    description: "Pay directly with flexible payment methods",
    details: [
      "Credit/debit card",
      "ACH bank transfer",
      "Check or money order",
      "Flexible payment plans available",
    ],
  },
  {
    icon: Shield,
    title: "Long-Term Care Insurance",
    description: "We work with most major insurance providers",
    details: [
      "Direct billing to insurer",
      "Help with claims filing",
      "Pre-authorization assistance",
      "Coverage verification",
    ],
  },
  {
    icon: FileText,
    title: "Veterans Benefits",
    description: "Accept VA benefits and Aid & Attendance",
    details: [
      "VA Aid & Attendance",
      "Veterans Directed Care",
      "Application assistance",
      "Benefits maximization",
    ],
  },
  {
    icon: Heart,
    title: "Medicare/Medicaid",
    description: "Limited services covered by government programs",
    details: [
      "Skilled nursing visits",
      "Therapy services",
      "State Medicaid waivers",
      "Eligibility verification",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <DollarSign className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Transparent, Affordable Pricing
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Quality home care that fits your budget. No hidden fees, flexible payment options,
              and competitive rates for all service types.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/get-started">
                <Button size="lg" className="gap-2">
                  Get Free Assessment <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="gap-2">
                  <Phone className="h-4 w-4" /> 1-800-HOME-CARE
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hourly Service Rates */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Hourly Service Rates</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our competitive hourly rates vary based on the type of care required and caregiver qualifications.
              All rates include comprehensive care coordination and 24/7 support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceRates.map((service) => (
              <Card key={service.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-primary">{service.hourly}</span>
                    <span className="text-gray-500">/hour</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900 text-center">
              <strong>Note:</strong> Rates may vary based on location, caregiver experience, and specific care needs. 
              4-hour minimum per visit applies to most services.
            </p>
          </div>
        </div>
      </section>

      {/* Care Packages */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Care Packages</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Save up to 15% with our comprehensive care packages designed for ongoing support needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packageOptions.map((pkg) => (
              <Card
                key={pkg.title}
                className={`relative ${
                  pkg.popular
                    ? "border-2 border-primary shadow-xl scale-105"
                    : "hover:shadow-lg transition-shadow"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white text-sm font-semibold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl mb-2">{pkg.title}</CardTitle>
                  <CardDescription className="text-base mb-4">{pkg.hours}</CardDescription>
                  <div>
                    <span className="text-3xl font-bold text-primary">{pkg.priceRange}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{pkg.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/get-started">
                    <Button className="w-full" variant={pkg.popular ? "default" : "outline"}>
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Options */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Options</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer multiple payment options to make quality home care accessible and affordable for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {paymentOptions.map((option) => (
              <Card key={option.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <option.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-lg text-center">{option.title}</CardTitle>
                  <CardDescription className="text-center text-sm">
                    {option.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {option.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 max-w-3xl mx-auto">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="text-center">Need Help with Payment Options?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600 mb-6">
                  Our billing specialists can help you navigate insurance coverage, verify benefits, 
                  and explore all available payment options to make care affordable.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/contact">
                    <Button className="gap-2">
                      <Phone className="h-4 w-4" /> Contact Billing Department
                    </Button>
                  </Link>
                  <Link href="/get-started">
                    <Button variant="outline">Request Free Assessment</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Pricing Information & Policies
          </h2>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's Included in Our Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Comprehensive initial assessment and care planning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Background-checked, trained, and insured caregivers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Ongoing supervision and quality monitoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>24/7 on-call support and emergency response</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Caregiver substitution at no extra charge</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Regular care plan reviews and updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Access to secure client portal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>General liability and workers' compensation insurance</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Considerations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <p>
                  <strong>Minimum Hours:</strong> 4-hour minimum per visit for most services. Live-in care 
                  requires a minimum 5-day commitment.
                </p>
                <p>
                  <strong>Holiday & Weekend Rates:</strong> Services on major holidays may be subject to 
                  time-and-a-half rates. Weekend rates typically remain standard.
                </p>
                <p>
                  <strong>Rush Scheduling:</strong> Same-day or next-day service requests may incur an 
                  additional fee based on availability.
                </p>
                <p>
                  <strong>Travel:</strong> No travel fees within our standard service area. Extended travel 
                  beyond 30 miles may include mileage reimbursement.
                </p>
                <p>
                  <strong>Cancellation Policy:</strong> 24-hour notice required for cancellations to avoid fees. 
                  Late cancellations may be charged up to 50% of scheduled visit.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <p className="text-center text-gray-700 font-semibold mb-2">
                  Every client's needs are unique
                </p>
                <p className="text-center text-sm text-gray-600">
                  Contact us for a free, no-obligation assessment and personalized pricing quote 
                  tailored to your specific situation.
                </p>
                <div className="flex justify-center mt-4">
                  <Link href="/get-started">
                    <Button size="lg" className="gap-2">
                      Schedule Free Assessment <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
