import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Heart, Clock, Shield } from "lucide-react";
import Link from "next/link";

export default function DementiaCarePage() {
  const services = [
    "Specialized Alzheimer's and dementia care",
    "Memory care techniques and engagement",
    "Cognitive stimulation activities",
    "Safe supervision and wandering prevention",
    "Personal care assistance adapted to abilities",
    "Medication reminders and monitoring",
    "Routine establishment and consistency",
    "Family education and support"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Dementia & Memory Care</h1>
            <p className="text-xl mb-8">
              Specialized care for individuals with Alzheimer's and dementia, providing safety, engagement, and dignity at home.
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
            <h2 className="text-3xl font-bold mb-6">What is Dementia Care?</h2>
            <p className="text-lg text-gray-700 mb-6">
              Our dementia and memory care services provide specialized support for individuals living with Alzheimer's disease, dementia, or other cognitive impairments. Our caregivers are specially trained in dementia care techniques, including communication strategies, behavioral management, and activities designed to stimulate memory and cognitive function.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              We understand the unique challenges that memory loss presents and create a safe, supportive environment that preserves dignity while ensuring safety. Our approach focuses on maintaining routines, reducing confusion and anxiety, and engaging your loved one in meaningful activities that enhance their quality of life.
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
            <p className="text-gray-700 mb-4">Dementia care services are ideal for individuals who:</p>
            <ul className="space-y-2 text-gray-700 ml-6 mb-8">
              <li>• Have been diagnosed with Alzheimer's or dementia</li>
              <li>• Experience memory loss or confusion</li>
              <li>• Require supervision to prevent wandering</li>
              <li>• Need assistance with daily activities due to cognitive decline</li>
              <li>• Benefit from structured routines and familiar environments</li>
              <li>• Have families who need specialized dementia care support</li>
            </ul>

            <h3 className="text-2xl font-bold mb-4 mt-8">Our Specialized Caregivers</h3>
            <p className="text-gray-700 mb-4">
              Our dementia care specialists receive extensive training in memory care. They undergo:
            </p>
            <ul className="space-y-2 text-gray-700 ml-6">
              <li>• Specialized Alzheimer's and dementia care certification</li>
              <li>• Training in communication techniques for memory loss</li>
              <li>• Behavioral management and de-escalation strategies</li>
              <li>• Comprehensive background checks</li>
              <li>• Ongoing education in latest dementia care practices</li>
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
                      <h4 className="font-semibold">Specialized Training</h4>
                      <p className="text-sm text-gray-600">Dementia care experts</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Safety & Security</h4>
                      <p className="text-sm text-gray-600">24/7 supervision available</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-6 w-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Consistent Care</h4>
                      <p className="text-sm text-gray-600">Familiar faces and routines</p>
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
          <h2 className="text-3xl font-bold mb-4">Specialized Memory Care at Home</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Trust our dementia care specialists to provide compassionate, expert care that preserves dignity and quality of life.
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
