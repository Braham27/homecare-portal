import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Heart, Clock, Shield } from "lucide-react";
import Link from "next/link";

export default function TwentyFourHourCarePage() {
  const services = [
    "Round-the-clock care and supervision",
    "Live-in caregiver services available",
    "All personal care and daily living assistance",
    "24/7 medication management",
    "Continuous safety monitoring",
    "Meal preparation for all meals",
    "Night-time care and assistance",
    "Emergency response and support"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">24-Hour Care Services</h1>
            <p className="text-xl mb-8">
              Round-the-clock care and live-in services providing comprehensive support and constant supervision for maximum safety and comfort.
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
            <h2 className="text-3xl font-bold mb-6">What is 24-Hour Care?</h2>
            <p className="text-lg text-gray-700 mb-6">
              Our 24-hour care and live-in services provide comprehensive, around-the-clock assistance for individuals who require constant supervision and support. Whether you need continuous care due to advanced illness, safety concerns, or complex medical needs, our professional caregivers are available day and night to ensure your loved one is never alone.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              We offer both live-in care (where one caregiver resides in the home) and 24-hour shift care (with multiple caregivers rotating throughout the day). This level of care provides maximum safety, allows individuals to remain in their own homes, and gives families complete peace of mind knowing their loved one has constant professional support.
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
            <p className="text-gray-700 mb-4">24-hour care services are ideal for individuals who:</p>
            <ul className="space-y-2 text-gray-700 ml-6 mb-8">
              <li>• Require constant supervision for safety</li>
              <li>• Have advanced dementia or Alzheimer's disease</li>
              <li>• Are recovering from major surgery or hospitalization</li>
              <li>• Have complex medical needs requiring continuous monitoring</li>
              <li>• Are at risk for falls or wandering</li>
              <li>• Need overnight assistance and daytime care</li>
            </ul>

            <h3 className="text-2xl font-bold mb-4 mt-8">Our 24-Hour Caregivers</h3>
            <p className="text-gray-700 mb-4">
              Our round-the-clock care team consists of experienced professionals who provide consistent, reliable care. They undergo:
            </p>
            <ul className="space-y-2 text-gray-700 ml-6">
              <li>• Comprehensive training in all aspects of home care</li>
              <li>• Thorough background checks and drug screening</li>
              <li>• Specialized training for complex care needs</li>
              <li>• Regular supervision and quality monitoring</li>
              <li>• CPR, First Aid, and emergency response certification</li>
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
                      <h4 className="font-semibold">Constant Presence</h4>
                      <p className="text-sm text-gray-600">Never alone, always supported</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Maximum Safety</h4>
                      <p className="text-sm text-gray-600">24/7 monitoring and care</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-6 w-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Complete Coverage</h4>
                      <p className="text-sm text-gray-600">Day, night, and weekends</p>
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
          <h2 className="text-3xl font-bold mb-4">Complete Peace of Mind, 24/7</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Ensure your loved one receives constant professional care and supervision with our comprehensive 24-hour services.
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
