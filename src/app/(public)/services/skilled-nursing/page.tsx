import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Heart, Clock, Shield } from "lucide-react";
import Link from "next/link";

export default function SkilledNursingPage() {
  const services = [
    "Injectable medications and IV therapy",
    "Wound care and dressing changes",
    "Vital sign monitoring and assessment",
    "Medication management and education",
    "Post-surgical care and monitoring",
    "Disease management and education",
    "Catheter and tube feeding care",
    "Pain management strategies"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Skilled Nursing Care</h1>
            <p className="text-xl mb-8">
              Professional medical care delivered by licensed nurses in the comfort and safety of your home.
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
            <h2 className="text-3xl font-bold mb-6">What is Skilled Nursing Care?</h2>
            <p className="text-lg text-gray-700 mb-6">
              Skilled nursing care provides medically necessary services performed by licensed nurses (RNs and LPNs) for individuals who require professional medical attention but prefer to receive care at home. Our experienced nurses deliver high-quality medical services including injections, wound care, vital sign monitoring, and medication management.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Whether you're recovering from surgery, managing a chronic illness, or require ongoing medical interventions, our skilled nursing team provides expert care with compassion. We work closely with your physician to ensure your treatment plan is followed precisely and your health is monitored carefully.
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
            <p className="text-gray-700 mb-4">Skilled nursing services are ideal for individuals who:</p>
            <ul className="space-y-2 text-gray-700 ml-6 mb-8">
              <li>• Require injectable medications or IV therapy</li>
              <li>• Need wound care or post-surgical monitoring</li>
              <li>• Have chronic conditions requiring medical oversight</li>
              <li>• Are transitioning home after hospitalization</li>
              <li>• Need catheter or feeding tube management</li>
              <li>• Require regular vital sign monitoring and assessment</li>
            </ul>

            <h3 className="text-2xl font-bold mb-4 mt-8">Our Nursing Team</h3>
            <p className="text-gray-700 mb-4">
              All our nurses are licensed professionals with extensive clinical experience. They undergo:
            </p>
            <ul className="space-y-2 text-gray-700 ml-6">
              <li>• State nursing licensure verification (RN/LPN)</li>
              <li>• Comprehensive background checks</li>
              <li>• Ongoing clinical education and training</li>
              <li>• Regular supervision and quality reviews</li>
              <li>• CPR, First Aid, and specialized certifications</li>
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
                      <h4 className="font-semibold">Licensed Professionals</h4>
                      <p className="text-sm text-gray-600">Experienced RNs and LPNs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Medical Excellence</h4>
                      <p className="text-sm text-gray-600">High-quality clinical care</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-6 w-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Coordinated Care</h4>
                      <p className="text-sm text-gray-600">Working with your physician</p>
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
          <h2 className="text-3xl font-bold mb-4">Expert Medical Care at Home</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Receive professional nursing care in the comfort of your own home with our licensed medical team.
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
