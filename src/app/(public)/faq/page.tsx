"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Search, HelpCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FAQCategory {
  category: string;
  questions: FAQ[];
}

// Fallback FAQs for when database is empty
const fallbackFaqs: FAQCategory[] = [
  {
    category: "Getting Started",
    questions: [
      { id: "1", question: "How do I start services with your agency?", answer: "Starting services is simple. Contact us by phone at 1-800-HOMECARE or fill out our online inquiry form. We'll schedule a free in-home assessment to understand your needs and create a personalized care plan.", category: "Getting Started" },
      { id: "2", question: "How quickly can you start providing care?", answer: "In most cases, we can begin care within 24-48 hours after the initial assessment and care plan approval. For urgent situations, we offer same-day service starts when possible.", category: "Getting Started" },
    ],
  },
  {
    category: "Services",
    questions: [
      { id: "3", question: "What services do you offer?", answer: "We offer a comprehensive range of home care services including Personal Care, Companion Care, Skilled Nursing, Dementia Care, Respite Care, and 24-Hour Care.", category: "Services" },
      { id: "4", question: "Do you provide 24-hour or live-in care?", answer: "Yes, we offer both 24-hour care with rotating caregivers and live-in care options.", category: "Services" },
    ],
  },
  {
    category: "Billing",
    questions: [
      { id: "5", question: "Do you accept Medicaid?", answer: "Yes, we are an approved Medicaid provider. We can help determine eligibility and assist with authorization.", category: "Billing" },
      { id: "6", question: "What payment methods do you accept?", answer: "We accept credit cards, debit cards, ACH bank transfers, and checks. Automatic payment options are available.", category: "Billing" },
    ],
  },
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [faqs, setFaqs] = useState<FAQCategory[]>(fallbackFaqs);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFAQs() {
      try {
        const response = await fetch("/api/faq");
        if (response.ok) {
          const data = await response.json();
          const faqList = data.faqs || [];
          
          if (faqList.length > 0) {
            // Group FAQs by category
            const grouped = faqList.reduce((acc: Record<string, FAQ[]>, faq: FAQ) => {
              const category = faq.category || "General";
              if (!acc[category]) acc[category] = [];
              acc[category].push(faq);
              return acc;
            }, {});

            const categorizedFaqs: FAQCategory[] = Object.entries(grouped).map(
              ([category, questions]) => ({
                category,
                questions: questions as FAQ[],
              })
            );
            setFaqs(categorizedFaqs);
          }
        }
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFAQs();
  }, []);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = faqs
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Find answers to common questions about our home care services, 
              caregivers, scheduling, and more.
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search questions..."
                className="pl-10 h-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-10">
            {filteredFaqs.map((category) => (
              <div key={category.category}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">
                  {category.category}
                </h2>
                <div className="space-y-4">
                  {category.questions.map((faq, index) => {
                    const itemId = `${category.category}-${index}`;
                    const isOpen = openItems.includes(itemId);
                    return (
                      <Card key={itemId} className="overflow-hidden">
                        <button
                          onClick={() => toggleItem(itemId)}
                          className="w-full text-left p-4 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900">
                            {faq.question}
                          </span>
                          {isOpen ? (
                            <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                          )}
                        </button>
                        {isOpen && (
                          <CardContent className="pt-0 pb-4 px-4">
                            <p className="text-gray-600">{faq.answer}</p>
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  No questions found matching your search. Try different keywords or{" "}
                  <a href="/contact" className="text-primary hover:underline">
                    contact us
                  </a>{" "}
                  directly.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Can&apos;t find what you&apos;re looking for? Our team is here to help. 
            Contact us and we&apos;ll get back to you as soon as possible.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="tel:1-800-HOMECARE"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Call 1-800-HOMECARE
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
