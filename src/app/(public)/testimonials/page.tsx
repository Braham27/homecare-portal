import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Quote } from "lucide-react";
import Link from "next/link";

const testimonials = [
  {
    name: "Sarah Johnson",
    relation: "Daughter of Eleanor J.",
    rating: 5,
    text: "The care my mother received was exceptional. The caregivers were professional, compassionate, and truly treated her like family. It gave our whole family peace of mind knowing she was in such good hands.",
    service: "Personal Care",
    date: "December 2025"
  },
  {
    name: "Michael Chen",
    relation: "Son of Robert C.",
    rating: 5,
    text: "After Dad's stroke, we needed skilled nursing care at home. The nurses were knowledgeable, attentive, and helped him recover faster than we expected. We couldn't have done it without them.",
    service: "Skilled Nursing",
    date: "November 2025"
  },
  {
    name: "Linda Martinez",
    relation: "Wife of James M.",
    rating: 5,
    text: "As a full-time caregiver for my husband with Alzheimer's, respite care has been a lifesaver. Knowing he's with someone who understands his needs allows me to recharge and be a better caregiver.",
    service: "Respite Care & Dementia Care",
    date: "October 2025"
  },
  {
    name: "David Thompson",
    relation: "Son of Margaret T.",
    rating: 5,
    text: "Mom wanted to stay in her own home, and your 24-hour care made that possible. The caregivers became like family to her. She loved their company and we loved the peace of mind.",
    service: "24-Hour Care",
    date: "September 2025"
  },
  {
    name: "Jennifer Williams",
    relation: "Daughter of Dorothy W.",
    rating: 5,
    text: "The companion care services brought joy back into my mother's life. Her caregiver not only helps with daily tasks but has become a true friend. Mom looks forward to their time together every day.",
    service: "Companion Care",
    date: "August 2025"
  },
  {
    name: "Robert Anderson",
    relation: "Husband of Patricia A.",
    rating: 5,
    text: "After my wife's hip replacement, we needed someone who could help with physical therapy exercises at home. The therapist was patient, professional, and got her back on her feet quickly.",
    service: "Physical Therapy",
    date: "July 2025"
  },
  {
    name: "Emily Rodriguez",
    relation: "Daughter of Carlos R.",
    rating: 5,
    text: "Transitioning from hospital to home was scary, but your post-hospitalization care team made it seamless. They coordinated with doctors, managed medications, and monitored Dad's recovery closely.",
    service: "Post-Hospital Care",
    date: "June 2025"
  },
  {
    name: "Thomas Baker",
    relation: "Son of Helen B.",
    rating: 5,
    text: "The level of professionalism and care is outstanding. Every caregiver who has worked with Mom has been thoroughly trained, respectful, and genuinely caring. You can tell they love what they do.",
    service: "Personal Care",
    date: "May 2025"
  },
  {
    name: "Angela White",
    relation: "Daughter of Richard W.",
    rating: 5,
    text: "My father has specific dietary needs and mobility challenges. The care plan was customized to his exact needs, and the team adapts as those needs change. Truly personalized care.",
    service: "Personal Care & Homemaker",
    date: "April 2025"
  },
  {
    name: "Christopher Lee",
    relation: "Son of Marie L.",
    rating: 5,
    text: "Billing and scheduling through the online portal is so convenient. We can see Mom's care notes, schedule changes, and pay invoices all in one place. The transparency is refreshing.",
    service: "Multiple Services",
    date: "March 2025"
  },
  {
    name: "Patricia Green",
    relation: "Daughter of William G.",
    rating: 5,
    text: "Dad was resistant to having help at first, but his caregiver won him over with patience and kindness. Now he considers her part of the family. Thank you for matching us so perfectly.",
    service: "Companion Care",
    date: "February 2025"
  },
  {
    name: "Steven Harris",
    relation: "Son of Barbara H.",
    rating: 5,
    text: "The communication from the office staff is excellent. They keep us informed, respond quickly to concerns, and truly care about our family's experience. Five stars all around!",
    service: "Personal Care",
    date: "January 2025"
  }
];

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">What Families Are Saying</h1>
            <p className="text-xl">
              Real stories from families who trust us with their loved ones' care
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Families Served</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
              <div className="text-gray-600">Years Experience</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="text-gray-600">5-Star Reviews</div>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-blue-200 mb-2" />
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.relation}</div>
                  <div className="text-sm text-blue-600 mt-1">{testimonial.service}</div>
                  <div className="text-xs text-gray-500 mt-1">{testimonial.date}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Video Testimonials Section (Placeholder) */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Video Testimonials</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((video) => (
              <Card key={video}>
                <CardContent className="pt-6">
                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                      <p className="text-gray-600 text-sm">Coming Soon</p>
                    </div>
                  </div>
                  <h3 className="font-semibold mb-1">Family Story #{video}</h3>
                  <p className="text-sm text-gray-600">Hear directly from families we serve</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Experience the Difference</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join hundreds of families who trust us with their loved ones' care
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-started">
              <Button size="lg" variant="secondary">
                Get Started Today
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>

        {/* Leave a Review CTA */}
        <Card className="mt-12">
          <CardContent className="pt-6 text-center">
            <h3 className="text-2xl font-bold mb-4">Share Your Experience</h3>
            <p className="text-gray-600 mb-6">
              Have you or your family received care from us? We'd love to hear about your experience.
            </p>
            <Link href="/contact">
              <Button>Leave a Testimonial</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
