"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Search, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "How do I start services with your agency?",
        answer: "Starting services is simple. Contact us by phone at 1-800-HOMECARE or fill out our online inquiry form. We'll schedule a free in-home assessment to understand your needs and create a personalized care plan. Once you approve the plan, we can typically begin services within 24-48 hours.",
      },
      {
        question: "What is included in the initial assessment?",
        answer: "Our free assessment includes a comprehensive evaluation of the client's physical, emotional, and social needs. A care coordinator will visit the home to assess the living environment, discuss care preferences, review medical history (with permission), and understand the family's goals. Based on this, we develop a customized care plan.",
      },
      {
        question: "How quickly can you start providing care?",
        answer: "In most cases, we can begin care within 24-48 hours after the initial assessment and care plan approval. For urgent situations, we offer same-day service starts when possible. Contact us to discuss your timeline.",
      },
    ],
  },
  {
    category: "Services & Care",
    questions: [
      {
        question: "What services do you offer?",
        answer: "We offer a comprehensive range of medical and non-medical home care services including: Personal Care (bathing, dressing, grooming), Companion Care, Homemaking, Skilled Nursing, Medication Management, Physical/Occupational/Speech Therapy, Dementia Care, Respite Care, 24-Hour/Live-In Care, Transportation, and Hospice Support.",
      },
      {
        question: "Do you provide 24-hour or live-in care?",
        answer: "Yes, we offer both 24-hour care (with rotating caregivers in shifts) and live-in care (where a caregiver stays in the home). We'll help you determine which option best fits your needs and budget.",
      },
      {
        question: "Can you help with Alzheimer's or dementia care?",
        answer: "Absolutely. We have specially trained caregivers experienced in dementia care. They're skilled in managing challenging behaviors, maintaining safety, providing cognitive stimulation, and following established routines that comfort individuals with memory conditions.",
      },
      {
        question: "What if my loved one's needs change over time?",
        answer: "Care needs often evolve, and we're prepared for that. We regularly reassess clients and adjust care plans accordingly. Whether you need to increase hours, add services, or modify the schedule, we work with you to ensure care always matches current needs.",
      },
    ],
  },
  {
    category: "Caregivers & Staff",
    questions: [
      {
        question: "How do you select and screen your caregivers?",
        answer: "All our caregivers undergo a rigorous screening process including comprehensive background checks (criminal, sex offender registry, abuse registry), reference verification, credential verification, skills assessment, and in-person interviews. We only hire caregivers who demonstrate compassion, reliability, and professionalism.",
      },
      {
        question: "Are your caregivers bonded and insured?",
        answer: "Yes, all our caregivers are fully bonded and insured. Our agency carries comprehensive liability insurance and workers' compensation coverage, protecting both our clients and employees.",
      },
      {
        question: "Can I choose or change my caregiver?",
        answer: "We carefully match caregivers with clients based on care needs, personality, schedule, and preferences. If you're not satisfied with a caregiver match, simply let us know and we'll find a better fit. Your comfort and satisfaction are our priority.",
      },
      {
        question: "What training do your caregivers receive?",
        answer: "All caregivers complete our comprehensive orientation program covering safety, infection control, client rights, emergency procedures, and more. Many hold certifications (CNA, HHA). We provide ongoing training in specialized areas like dementia care, fall prevention, and chronic disease management.",
      },
    ],
  },
  {
    category: "Scheduling & Availability",
    questions: [
      {
        question: "What are your hours of operation?",
        answer: "Our caregivers are available 24 hours a day, 7 days a week, 365 days a year. Office hours for administrative matters are Monday-Friday 8am-6pm and Saturday 9am-2pm, but our on-call supervisors are available 24/7 for urgent matters.",
      },
      {
        question: "What is the minimum number of hours required?",
        answer: "Our minimum visit is typically 2-4 hours depending on the service type and your location. For ongoing care, we can discuss scheduling options that work best for your budget and needs.",
      },
      {
        question: "What happens if my regular caregiver is sick or unavailable?",
        answer: "We maintain a team of qualified backup caregivers familiar with your care plan. If your regular caregiver is unavailable, we'll ensure a suitable replacement is sent so your care is never interrupted. We always notify you in advance when possible.",
      },
    ],
  },
  {
    category: "Payment & Insurance",
    questions: [
      {
        question: "How much do your services cost?",
        answer: "Rates vary depending on the type of care, hours needed, and location. We offer competitive hourly rates and can provide a detailed quote after understanding your specific needs. Contact us for a free assessment and cost estimate.",
      },
      {
        question: "Do you accept Medicaid?",
        answer: "Yes, we are an approved Medicaid provider. We can help determine if you or your loved one qualifies for Medicaid-covered home care services and assist with the authorization process.",
      },
      {
        question: "Do you work with long-term care insurance?",
        answer: "Yes, we work with most long-term care insurance providers. We can help you understand your policy benefits and assist with claims submission. Many families are surprised to find their policies cover more than expected.",
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept various payment methods including credit cards, debit cards, ACH bank transfers, and checks. We can also set up automatic payments for convenience. Private pay clients are invoiced weekly or bi-weekly.",
      },
      {
        question: "What is your Premium Care Plan?",
        answer: "Our Premium Care Plan offers enhanced services including weekly RN supervision visits, priority caregiver matching, extended hours availability, 24/7 on-call nursing support, and dedicated family care coordination. It's ideal for clients who want an extra layer of oversight and support.",
      },
    ],
  },
  {
    category: "Safety & Compliance",
    questions: [
      {
        question: "Is your agency licensed?",
        answer: "Yes, we are a fully licensed home care agency, meeting all state requirements for operation. Our license number is displayed on our website and can be verified with the state health department.",
      },
      {
        question: "How do you ensure HIPAA compliance?",
        answer: "We take privacy seriously. All staff are trained in HIPAA regulations. We use secure, encrypted systems for all client information. Access to records is strictly limited to those involved in care, and we maintain comprehensive audit trails of all data access.",
      },
      {
        question: "What safety measures do you have in place?",
        answer: "Safety is paramount. We conduct home safety assessments, train caregivers in fall prevention and emergency procedures, and maintain 24/7 on-call support. For Medicaid clients, we use Electronic Visit Verification (EVV) to ensure visits occur as scheduled.",
      },
    ],
  },
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);

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
