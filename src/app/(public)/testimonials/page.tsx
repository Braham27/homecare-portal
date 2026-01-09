"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Quote, Loader2 } from "lucide-react";
import Link from "next/link";

interface Testimonial {
  id: string;
  clientName: string;
  relationship: string | null;
  content: string;
  rating: number | null;
  isFeatured: boolean;
  createdAt: string;
}

// Fallback testimonials
const fallbackTestimonials: Testimonial[] = [
  { id: "1", clientName: "Sarah Johnson", relationship: "Daughter", content: "The care my mother received was exceptional. The caregivers were professional, compassionate, and truly treated her like family.", rating: 5, isFeatured: true, createdAt: new Date().toISOString() },
  { id: "2", clientName: "Michael Chen", relationship: "Son", content: "After Dad's stroke, we needed skilled nursing care at home. The nurses were knowledgeable and helped him recover faster than expected.", rating: 5, isFeatured: true, createdAt: new Date().toISOString() },
  { id: "3", clientName: "Linda Martinez", relationship: "Wife", content: "As a full-time caregiver for my husband with Alzheimer's, respite care has been a lifesaver.", rating: 5, isFeatured: false, createdAt: new Date().toISOString() },
];

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const response = await fetch("/api/testimonials");
        if (response.ok) {
          const data = await response.json();
          if (data.testimonials && data.testimonials.length > 0) {
            setTestimonials(data.testimonials);
          }
        }
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

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
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-blue-200 mb-2" />
                  <p className="text-gray-700 mb-4 italic">&quot;{testimonial.content}&quot;</p>
                  <div className="border-t pt-4">
                    <div className="font-semibold text-gray-900">{testimonial.clientName}</div>
                    <div className="text-sm text-gray-600">{testimonial.relationship || "Family Member"}</div>
                    <div className="text-xs text-gray-500 mt-1">{formatDate(testimonial.createdAt)}</div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
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
