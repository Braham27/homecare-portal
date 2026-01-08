import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Heart, Clock, Shield } from "lucide-react";
import Link from "next/link";

export default function RespiteCarePage() {
  const services = [
    "Temporary relief for family caregivers",
    "Flexible scheduling from hours to days",
    "All personal care and assistance needs",
    "Medication reminders and monitoring",
    "Meal preparation and companionship",
    "Safety supervision and support",
    "Continuation of established care routines",
    "Emergency and planned respite options"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Respite Care Services</h1>
            <p className="text-xl mb-8">
              Temporary relief for family caregivers, providing peace of mind that your loved one receives excellent care while you rest and recharge.
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
            <h2 className="text-3xl font-bold mb-6">What is Respite Care?</h2>
            <p className="text-lg text-gray-700 mb-6">
              Respite care provides temporary relief for family caregivers who need a break from the demanding responsibilities of caring for a loved one. Whether you need a few hours to run errands, a day to attend to personal matters, or a week for vacation, our professional caregivers step in to provide the same quality care your loved one needs.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              We understand that family caregiving can be physically and emotionally exhausting. Taking time for yourself isn't selfish—it's essential for your health and your ability to provide care long-term. Our respite care services ensure your loved one is safe, comfortable, and well-cared for, giving you the peace of mind to truly rest.
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
            <p className="text-gray-700 mb-4">Respite care services are ideal for:</p>
            <ul className="space-y-2 text-gray-700 ml-6 mb-8">
              <li>• Family caregivers who need time for self-care or rest</li>
              <li>• Caregivers attending appointments or personal matters</li>
              <li>• Families planning vacations or extended absences</li>
              <li>• Those experiencing caregiver burnout or stress</li>
              <li>• Emergency situations requiring temporary care coverage</li>
              <li>• Anyone needing professional backup care support</li>
            </ul>

            <h3 className="text-2xl font-bold mb-4 mt-8">Our Respite Caregivers</h3>
            <p className="text-gray-700 mb-4">
              Our respite care team is trained to seamlessly step into your caregiving role. They undergo:
            </p>
            <ul className="space-y-2 text-gray-700 ml-6">
              <li>• Comprehensive training in all aspects of care</li>
              <li>• Thorough background checks and screening</li>
              <li>• Detailed orientation to your loved one's needs and routines</li>
              <li>• Supervision and quality assurance</li>
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
                      <h4 className="font-semibold">Caregiver Relief</h4>
                      <p className="text-sm text-gray-600">Rest and recharge with confidence</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Seamless Transition</h4>
                      <p className="text-sm text-gray-600">Maintaining familiar routines</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-6 w-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Flexible Duration</h4>
                      <p className="text-sm text-gray-600">Hours, days, or weeks available</p>
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
          <h2 className="text-3xl font-bold mb-4">Take the Break You Deserve</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let our professional caregivers provide exceptional care while you rest, recharge, and attend to your own needs.
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
