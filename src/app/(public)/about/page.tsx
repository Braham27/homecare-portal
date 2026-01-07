import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Heart,
  Shield,
  Users,
  Award,
  Clock,
  CheckCircle,
  Building2,
  MapPin,
  Phone,
} from "lucide-react";

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-primary">ComfortCare</span> Home Health
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              For over 15 years, we&apos;ve been providing compassionate, 
              high-quality home care services to families in our community. 
              Our mission is simple: to help your loved ones live safely and 
              independently at home, with the dignity and respect they deserve.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  ComfortCare Home Health was founded in 2010 by a team of healthcare 
                  professionals who recognized a growing need for quality, compassionate 
                  home care services. Having witnessed firsthand the challenges families 
                  face when caring for aging or ill loved ones, they set out to create 
                  an agency that truly puts clients first.
                </p>
                <p>
                  What started as a small team of dedicated caregivers has grown into 
                  a full-service home care agency serving hundreds of families across 
                  the region. Despite our growth, we&apos;ve never lost sight of our 
                  founding principles: treat every client like family, hire only the 
                  best caregivers, and always go the extra mile.
                </p>
                <p>
                  Today, we continue to lead the industry with innovative care programs, 
                  rigorous caregiver training, and a commitment to exceeding expectations 
                  every single day.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4">
                  <p className="text-4xl font-bold text-primary">15+</p>
                  <p className="text-gray-600">Years of Service</p>
                </div>
                <div className="text-center p-4">
                  <p className="text-4xl font-bold text-primary">500+</p>
                  <p className="text-gray-600">Families Served</p>
                </div>
                <div className="text-center p-4">
                  <p className="text-4xl font-bold text-primary">150+</p>
                  <p className="text-gray-600">Trained Caregivers</p>
                </div>
                <div className="text-center p-4">
                  <p className="text-4xl font-bold text-primary">98%</p>
                  <p className="text-gray-600">Satisfaction Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600">
                  To enhance the quality of life for our clients by providing 
                  exceptional, personalized home care services that promote 
                  independence, dignity, and peace of mind for families.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-600">
                  To be the most trusted home care provider in our community, 
                  known for our compassionate caregivers, innovative programs, 
                  and unwavering commitment to excellence.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Our Values</h3>
                <p className="text-gray-600">
                  Compassion, Integrity, Excellence, Respect, and Reliability. 
                  These core values guide every decision we make and every 
                  interaction we have with clients and families.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Families Trust ComfortCare
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Licensed & Accredited",
                description:
                  "Fully licensed by the state, with accreditations that demonstrate our commitment to the highest standards of care.",
              },
              {
                icon: Users,
                title: "Carefully Vetted Caregivers",
                description:
                  "Rigorous hiring process including background checks, reference verification, and skills assessment.",
              },
              {
                icon: Award,
                title: "Award-Winning Care",
                description:
                  "Recognized by industry organizations for excellence in home care services and client satisfaction.",
              },
              {
                icon: Clock,
                title: "24/7 Availability",
                description:
                  "Care is available around the clock, with on-call supervisors always ready to assist.",
              },
              {
                icon: CheckCircle,
                title: "Personalized Care Plans",
                description:
                  "Every client receives a customized care plan tailored to their unique needs and preferences.",
              },
              {
                icon: Heart,
                title: "Family Communication",
                description:
                  "Transparent updates and easy communication keep families informed and involved.",
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Licensing & Credentials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Licensing & Credentials
            </h2>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">State Licensing</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      State Home Care License #HC-12345
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      Medicare Certified Agency
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      Medicaid Approved Provider
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Insurance & Bonding</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      Fully Bonded
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      Comprehensive Liability Insurance
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      Workers' Compensation Coverage
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Compliance</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      HIPAA Compliant
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      EVV Compliant for Medicaid Services
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      All Staff Background Checked
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Affiliations</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      Home Care Association Member
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      Better Business Bureau A+ Rating
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      Chamber of Commerce Member
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Service Areas
            </h2>
            <p className="text-gray-600 mb-8">
              We proudly serve clients throughout the greater metropolitan area 
              and surrounding counties. Contact us to confirm service availability 
              in your specific location.
            </p>
            <Link href="/service-areas">
              <Button variant="outline">View All Service Areas</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Learn More?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Contact us today for a free, no-obligation consultation. We&apos;d love 
            to discuss how we can help your family.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" variant="secondary">
                Contact Us
              </Button>
            </Link>
            <Link href="tel:1-800-HOMECARE">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary"
              >
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
