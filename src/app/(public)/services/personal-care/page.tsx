import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Heart, Clock, Shield } from "lucide-react";
import Link from "next/link";

export default function PersonalCarePage() {
  const services = [
    "Assistance with bathing and showering",
    "Help with dressing and grooming",
    "Toileting and incontinence care",
    "Mobility assistance and transfers",
    "Medication reminders",
    "Light exercise and range of motion",
    "Fall prevention and safety monitoring",
    "Assistance with eating and nutrition"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Personal Care Services</h1>
            <p className="text-xl mb-8">
              Compassionate assistance with daily activities to help your loved ones maintain dignity and independence at home.
            </p>
            <Link href="/get-started">
              <Button size="lg" variant="secondary">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6">What is Personal Care?</h2>
            <p className="text-lg text-gray-700 mb-6">
              Our personal care services provide hands-on assistance with activities of daily living (ADLs) to help individuals who need support maintaining their personal hygiene, mobility, and overall wellbeing. Our compassionate caregivers are trained to provide respectful, dignified care that preserves your loved one's independence.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Whether recovering from surgery, managing a chronic condition, or simply needing extra help with daily tasks, our personal care aides are here to provide the support needed to live comfortably and safely at home.
            </p>

            <h3 className="text-2xl font-bold mb-4 mt-8">Services Included</h3>
            <div className="grid md:grid-cols-2 gap-3 mb-8">
              {services.map((service, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{service}</span>
                </div>
              ))}
            </div>

            <h3 className="text-2xl font-bold mb-4 mt-8">Who Can Benefit?</h3>
            <p className="text-gray-700 mb-4">Personal care services are ideal for individuals who:</p>
            <ul className="space-y-2 text-gray-700 ml-6 mb-8">
              <li>• Have difficulty with bathing, dressing, or grooming independently</li>
              <li>• Need assistance with mobility and transfers</li>
              <li>• Require help managing medications</li>
              <li>• Are recovering from surgery or illness</li>
              <li>• Have chronic conditions affecting daily functioning</li>
              <li>• Want to age in place safely and comfortably</li>
            </ul>

            <h3 className="text-2xl font-bold mb-4 mt-8">Our Caregivers</h3>
            <p className="text-gray-700 mb-4">
              All our personal care aides are carefully selected, thoroughly screened, and professionally trained. They undergo:
            </p>
            <ul className="space-y-2 text-gray-700 ml-6">
              <li>• Comprehensive background checks</li>
              <li>• Professional training and certification</li>
              <li>• Ongoing education and supervision</li>
              <li>• CPR and First Aid certification</li>
            </ul>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4">Why Choose Us?</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Heart className="h-6 w-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Compassionate Care</h4>
                      <p className="text-sm text-gray-600">Respectful, dignified support</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Trained Professionals</h4>
                      <p className="text-sm text-gray-600">Certified and background-checked</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-6 w-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Flexible Scheduling</h4>
                      <p className="text-sm text-gray-600">Available 24/7 as needed</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Ready to Get Started?</h4>
                  <p className="text-sm text-gray-600 mb-4">Schedule a free consultation to discuss your needs</p>
                  <Link href="/get-started" className="block">
                    <Button className="w-full">Request Free Assessment</Button>
                  </Link>
                  <p className="text-center text-sm text-gray-500 mt-4">Or call us at</p>
                  <a href="tel:1-800-HOMECARE" className="block text-center font-semibold text-blue-600 hover:underline">
                    1-800-HOMECARE
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Quality Care Starts Here</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let us help your loved one maintain independence and dignity with our compassionate personal care services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-started">
              <Button size="lg" variant="secondary">
                Get Started Today
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
