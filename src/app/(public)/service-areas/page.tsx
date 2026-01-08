import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Check, Phone } from "lucide-react";
import Link from "next/link";

const serviceAreas = [
  {
    county: "Cook County",
    cities: ["Chicago", "Evanston", "Skokie", "Oak Park", "Cicero", "Berwyn", "Oak Lawn"],
    zipCodes: "60601-60827"
  },
  {
    county: "DuPage County",
    cities: ["Naperville", "Wheaton", "Downers Grove", "Lombard", "Carol Stream", "Addison"],
    zipCodes: "60101-60199"
  },
  {
    county: "Lake County",
    cities: ["Waukegan", "Highland Park", "Lake Forest", "Libertyville", "Mundelein"],
    zipCodes: "60001-60099"
  },
  {
    county: "Will County",
    cities: ["Joliet", "Bolingbrook", "Romeoville", "Plainfield", "Lockport"],
    zipCodes: "60403-60585"
  },
  {
    county: "Kane County",
    cities: ["Aurora", "Elgin", "Carpentersville", "St. Charles", "Batavia"],
    zipCodes: "60101-60177"
  }
];

export default function ServiceAreasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Service Areas</h1>
            <p className="text-xl">
              Providing quality home care across the greater metropolitan area
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto mb-12">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4 mb-6">
                <MapPin className="h-8 w-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold mb-2">Not Sure If We Serve Your Area?</h2>
                  <p className="text-gray-600 mb-4">
                    We're continually expanding our service areas. Even if your location isn't listed below, please contact us - we may be able to accommodate your needs or can refer you to a trusted partner.
                  </p>
                  <Link href="/contact">
                    <Button>Check Availability</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-3xl font-bold mb-8 text-center">Counties We Serve</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {serviceAreas.map((area, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <Check className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">{area.county}</h3>
                    <p className="text-sm text-gray-500 mb-3">ZIP Codes: {area.zipCodes}</p>
                    <p className="text-gray-700 font-semibold mb-2">Cities include:</p>
                    <div className="flex flex-wrap gap-2">
                      {area.cities.map((city, cityIndex) => (
                        <span key={cityIndex} className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact us today for a free consultation and learn how we can help your loved one
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-started">
              <Button size="lg" variant="secondary">
                Request Free Assessment
              </Button>
            </Link>
            <a href="tel:1-800-HOMECARE">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                <Phone className="mr-2 h-5 w-5" />
                1-800-HOMECARE
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
