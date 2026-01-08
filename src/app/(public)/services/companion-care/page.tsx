import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Heart, Clock, Shield } from "lucide-react";
import Link from "next/link";

export default function CompanionCarePage() {
  const services = [
    "Friendly conversation and companionship",
    "Supervision and safety monitoring",
    "Light activities and entertainment",
    "Meal preparation and sharing meals together",
    "Medication reminders",
    "Light housekeeping and organization",
    "Escort to appointments and errands",
    "Engaging hobbies and recreational activities"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Companion Care Services</h1>
            <p className="text-xl mb-8">
              Meaningful companionship and social engagement to enhance quality of life and combat loneliness at home.
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
            <h2 className="text-3xl font-bold mb-6">What is Companion Care?</h2>
            <p className="text-lg text-gray-700 mb-6">
              Companion care provides non-medical support focused on social interaction, supervision, and light assistance to help seniors maintain an active, engaged lifestyle. Our compassionate companions offer friendship, conversation, and supervision while helping with light daily tasks that make life more enjoyable and safe.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              This service is ideal for individuals who are relatively independent but would benefit from regular social interaction, supervision for safety, and assistance with light activities. Companion care helps combat isolation and loneliness while providing peace of mind to families knowing their loved one is safe and engaged.
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
            <p className="text-gray-700 mb-4">Companion care services are ideal for individuals who:</p>
            <ul className="space-y-2 text-gray-700 ml-6 mb-8">
              <li>• Live alone and experience loneliness or social isolation</li>
              <li>• Are relatively independent but need supervision for safety</li>
              <li>• Enjoy conversation and social activities</li>
              <li>• Need help with light household tasks and meal preparation</li>
              <li>• Benefit from gentle reminders and routine structure</li>
              <li>• Have families who need peace of mind about their safety</li>
            </ul>

            <h3 className="text-2xl font-bold mb-4 mt-8">Our Caregivers</h3>
            <p className="text-gray-700 mb-4">
              Our companion caregivers are warm, engaging individuals who are carefully selected for their compassion and communication skills. They undergo:
            </p>
            <ul className="space-y-2 text-gray-700 ml-6">
              <li>• Comprehensive background checks</li>
              <li>• Professional training in companionship and safety</li>
              <li>• Ongoing supervision and quality monitoring</li>
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
                      <h4 className="font-semibold">Genuine Companionship</h4>
                      <p className="text-sm text-gray-600">Warm, friendly relationships</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Safety & Supervision</h4>
                      <p className="text-sm text-gray-600">Vigilant monitoring and support</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-6 w-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Flexible Scheduling</h4>
                      <p className="text-sm text-gray-600">From a few hours to full days</p>
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
          <h2 className="text-3xl font-bold mb-4">Compassionate Companionship</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Combat loneliness and enhance quality of life with our caring companion services.
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
