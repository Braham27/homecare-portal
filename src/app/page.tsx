import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header, Footer } from "@/components/layout/header-footer";
import {
  Heart,
  Users,
  Clock,
  Shield,
  Star,
  ArrowRight,
  Stethoscope,
  Home,
  Brain,
  HandHeart,
  Car,
  Moon,
  Phone,
  CheckCircle,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Compassionate Care for Your{" "}
                  <span className="text-primary">Loved Ones</span> at Home
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Professional, personalized home care services that allow your family members 
                  to maintain their independence while receiving the support they need. 
                  Available 24/7 with medical and non-medical care options.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/contact">
                    <Button size="lg" className="gap-2">
                      Get Started Today <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button size="lg" variant="outline">
                      View Our Services
                    </Button>
                  </Link>
                </div>
                <div className="flex flex-wrap gap-6 mt-8 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Licensed & Insured
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Background Checked Staff
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    HIPAA Compliant
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl p-8 relative">
                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Call Us 24/7</p>
                        <p className="text-xl font-bold text-gray-900">1-800-HOMECARE</p>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Free consultation and care assessment available
                    </p>
                    <Link href="/contact">
                      <Button className="w-full">Request Free Consultation</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Comprehensive Home Care Services
              </h2>
              <p className="text-gray-600">
                From personal care assistance to skilled nursing, we offer a full range of 
                services to meet your family&apos;s unique needs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: HandHeart,
                  title: "Personal Care",
                  description: "Bathing, dressing, grooming, and hygiene assistance with dignity and respect.",
                  href: "/services",
                },
                {
                  icon: Users,
                  title: "Companion Care",
                  description: "Meaningful companionship, conversation, and activities to combat loneliness.",
                  href: "/services",
                },
                {
                  icon: Stethoscope,
                  title: "Skilled Nursing",
                  description: "RN and LPN services including wound care, medication management, and more.",
                  href: "/services",
                },
                {
                  icon: Brain,
                  title: "Dementia Care",
                  description: "Specialized memory care with trained caregivers for Alzheimer's and dementia.",
                  href: "/services",
                },
                {
                  icon: Home,
                  title: "Homemaking",
                  description: "Light housekeeping, meal preparation, laundry, and errands.",
                  href: "/services",
                },
                {
                  icon: Moon,
                  title: "24-Hour & Live-In Care",
                  description: "Around-the-clock care for those needing continuous support.",
                  href: "/services",
                },
              ].map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow group">
                  <CardHeader>
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href={service.href}
                      className="text-primary font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Learn More <ArrowRight className="h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/services">
                <Button size="lg" variant="outline">
                  View All Services
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Families Choose ComfortCare
              </h2>
              <p className="text-gray-600">
                We&apos;re committed to providing exceptional care that makes a real difference in 
                people&apos;s lives.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Shield,
                  title: "Licensed & Bonded",
                  description: "Fully licensed, bonded, and insured for your protection and peace of mind.",
                },
                {
                  icon: Users,
                  title: "Vetted Caregivers",
                  description: "All caregivers undergo thorough background checks and training.",
                },
                {
                  icon: Clock,
                  title: "24/7 Availability",
                  description: "Round-the-clock support with on-call supervisors always available.",
                },
                {
                  icon: Heart,
                  title: "Personalized Care",
                  description: "Custom care plans tailored to each client's unique needs and preferences.",
                },
              ].map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Payment Options */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Flexible Payment Options
                </h2>
                <p className="text-gray-600 mb-6">
                  We work with you to find the right payment solution for your family&apos;s budget 
                  and situation.
                </p>
                <ul className="space-y-4">
                  {[
                    { title: "Private Pay", desc: "Flexible hourly rates with transparent pricing" },
                    { title: "Medicaid Accepted", desc: "We accept Medicaid for eligible clients" },
                    { title: "Long-Term Care Insurance", desc: "We work with most insurance providers" },
                    { title: "Premium Care Plans", desc: "Enhanced services with priority scheduling" },
                  ].map((option, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <span className="font-medium text-gray-900">{option.title}:</span>{" "}
                        <span className="text-gray-600">{option.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <Card className="bg-gradient-to-br from-primary to-primary/80 text-white">
                <CardContent className="p-8">
                  <Car className="h-12 w-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Premium Care Plan</h3>
                  <p className="text-white/90 mb-6">
                    Get enhanced services including weekly nurse oversight, 24/7 on-call support, 
                    priority scheduling, and more.
                  </p>
                  <ul className="space-y-2 mb-6">
                    {[
                      "Weekly RN supervision visits",
                      "Priority caregiver matching",
                      "Extended hours availability",
                      "Family care coordination",
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact">
                    <Button variant="secondary" className="w-full">
                      Learn About Premium
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What Families Say About Us
              </h2>
              <p className="text-gray-600">
                Real stories from families we&apos;ve had the privilege of serving.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  quote: "The caregivers are truly angels. They treat my mother with such kindness and patience. I can finally rest easy knowing she's in good hands.",
                  author: "Sarah M.",
                  relation: "Daughter of client",
                  rating: 5,
                },
                {
                  quote: "Professional, reliable, and compassionate. The team goes above and beyond every single day. Highly recommend their services.",
                  author: "James T.",
                  relation: "Son of client",
                  rating: 5,
                },
                {
                  quote: "From the first consultation to daily care, every interaction has been excellent. They've truly become part of our family.",
                  author: "Maria L.",
                  relation: "Wife of client",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 italic">&quot;{testimonial.quote}&quot;</p>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.relation}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-8">
              Contact us today for a free, no-obligation consultation. We&apos;ll create a 
              personalized care plan that fits your family&apos;s needs and budget.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" variant="secondary">
                  Request Free Consultation
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

        {/* Careers Banner */}
        <section className="py-12 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Join Our Caregiving Team</h3>
                <p className="text-gray-600">
                  We&apos;re looking for compassionate individuals to make a difference.
                </p>
              </div>
              <Link href="/careers">
                <Button variant="outline">View Open Positions</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
