import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertCircle, Scale, UserCheck, CreditCard, XCircle } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <FileText className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-lg text-gray-600">
          Last Updated: January 8, 2026
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Please read these terms carefully before using our services
        </p>
      </div>

      <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-6 w-6 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-900">
            <p className="font-semibold mb-2">Important Notice</p>
            <p>
              By engaging our home care services, you agree to be bound by these Terms of Service. 
              If you do not agree with any part of these terms, please do not use our services.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Scale className="h-6 w-6 text-primary" />
              <CardTitle>1. Agreement to Terms</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <p>
              These Terms of Service ("Terms") constitute a legally binding agreement between you 
              ("Client," "you," or "your") and our home care agency ("Company," "we," "us," or "our") 
              regarding your use of our home care services, website, and client portal.
            </p>
            <p>
              By requesting or receiving services, accessing our website, or using our client portal, 
              you acknowledge that you have read, understood, and agree to be bound by these Terms and 
              our Privacy Policy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Services Provided</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">2.1 Scope of Services</h3>
              <p className="text-sm text-gray-600 mb-2">
                We provide professional home care services including, but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm ml-2">
                <li>Personal care assistance (bathing, dressing, grooming)</li>
                <li>Companion care and social interaction</li>
                <li>Skilled nursing care (by licensed nurses)</li>
                <li>Medication management and reminders</li>
                <li>Dementia and Alzheimer's care</li>
                <li>Respite care for family caregivers</li>
                <li>24-hour live-in care</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">2.2 Service Limitations</h3>
              <p className="text-sm text-gray-600">
                Our caregivers are not authorized to perform medical procedures beyond their scope of 
                training and licensure. We do not provide emergency medical services. In case of medical 
                emergencies, please call 911 immediately.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">2.3 Service Customization</h3>
              <p className="text-sm text-gray-600">
                All services are customized based on an initial assessment and ongoing care plan reviews. 
                We reserve the right to modify service plans as needed to ensure client safety and appropriate care.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <UserCheck className="h-6 w-6 text-primary" />
              <CardTitle>3. Client Responsibilities</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">As a client, you agree to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 text-sm ml-2">
              <li>Provide accurate and complete health information, including medical history, medications, and physician contacts</li>
              <li>Maintain a safe working environment for caregivers, free from hazards and abuse</li>
              <li>Treat caregivers with respect and dignity; verbal or physical abuse will not be tolerated</li>
              <li>Provide necessary supplies and equipment for care delivery</li>
              <li>Allow access to the home during scheduled service times</li>
              <li>Notify us immediately of any changes in health status or care needs</li>
              <li>Inform us of any dissatisfaction with services so we can address concerns promptly</li>
              <li>Pay for services in accordance with the agreed-upon payment terms</li>
              <li>Provide at least 24 hours notice for appointment cancellations when possible</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Caregiver Assignment and Changes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <p>
              We carefully match caregivers to clients based on needs, preferences, and availability. 
              While we strive to provide consistency, we reserve the right to change caregiver assignments 
              due to scheduling, availability, or other operational needs.
            </p>
            <p>
              If you are dissatisfied with an assigned caregiver, please notify us immediately. We will 
              work with you to find a suitable alternative.
            </p>
            <p>
              All caregivers are employees or contractors of our agency. Clients may not hire caregivers 
              directly or employ them privately during or for 12 months after receiving our services without 
              our written consent and payment of applicable placement fees.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-primary" />
              <CardTitle>5. Fees and Payment Terms</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">5.1 Service Rates</h3>
              <p className="text-sm text-gray-600">
                Service rates vary based on the type and duration of care required. All rates will be 
                clearly communicated before services begin. We reserve the right to adjust rates with 
                30 days written notice.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">5.2 Payment Methods</h3>
              <p className="text-sm text-gray-600">
                We accept payment via credit card, debit card, ACH transfer, check, and select insurance plans. 
                Payment is due within 15 days of invoice date unless other arrangements have been made.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">5.3 Late Payments</h3>
              <p className="text-sm text-gray-600">
                Late payments may be subject to a service charge of 1.5% per month (18% annually) or the 
                maximum rate permitted by law. Continued non-payment may result in suspension of services.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">5.4 Insurance and Third-Party Payment</h3>
              <p className="text-sm text-gray-600">
                If services are covered by insurance or third-party payers, you are responsible for any 
                deductibles, co-payments, or amounts not covered. You agree to pay for services if insurance 
                claims are denied.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">5.5 Minimum Service Hours</h3>
              <p className="text-sm text-gray-600">
                We require a minimum of 4 hours per visit for standard care services. Live-in care requires 
                a minimum commitment of 5 consecutive days.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <XCircle className="h-6 w-6 text-primary" />
              <CardTitle>6. Cancellation and Termination</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">6.1 Cancellation by Client</h3>
              <p className="text-sm text-gray-600 mb-2">
                You may cancel scheduled visits with the following notice requirements:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm ml-2">
                <li>Standard visits: 24 hours advance notice</li>
                <li>Live-in care: 7 days advance notice</li>
              </ul>
              <p className="text-sm text-gray-600 mt-2">
                Cancellations with less notice may be subject to cancellation fees of up to 50% of the scheduled visit cost.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">6.2 Termination by Client</h3>
              <p className="text-sm text-gray-600">
                You may terminate services at any time with written notice. You are responsible for payment 
                of all services rendered through the termination date.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">6.3 Termination by Company</h3>
              <p className="text-sm text-gray-600 mb-2">
                We reserve the right to terminate services immediately without notice if:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm ml-2">
                <li>Payment obligations are not met</li>
                <li>The client or family members engage in abusive behavior toward caregivers</li>
                <li>The home environment is unsafe for caregivers</li>
                <li>The client's care needs exceed our scope of services</li>
                <li>The client violates these Terms of Service</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Liability and Insurance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <p>
              We maintain comprehensive general liability insurance and workers' compensation insurance for our employees. 
              All caregivers are bonded and insured while performing services on our behalf.
            </p>
            <p>
              While we take every precaution to ensure quality care, we are not liable for accidents, injuries, or 
              losses that occur despite reasonable care and precautions. We are not responsible for the client's 
              property or valuables unless damage results from caregiver negligence.
            </p>
            <p>
              Our liability is limited to the amount of fees paid for services during the period in which the 
              alleged incident occurred.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Confidentiality and Privacy</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            <p className="mb-3">
              We are committed to protecting your privacy and maintaining the confidentiality of your health 
              information in accordance with HIPAA regulations. Please refer to our Privacy Policy for detailed 
              information about how we collect, use, and protect your personal and health information.
            </p>
            <p>
              You consent to the sharing of necessary information with caregivers, healthcare providers, and 
              other parties involved in your care coordination.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Complaints and Dispute Resolution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <p>
              We are committed to your satisfaction. If you have concerns about our services, please contact 
              us immediately at 1-800-HOME-CARE or complaints@homecare.com.
            </p>
            <p>
              We will investigate all complaints promptly and work with you to resolve issues. If we cannot 
              resolve a dispute through discussion, both parties agree to attempt mediation before pursuing litigation.
            </p>
            <p>
              You also have the right to file complaints with your state's home care licensing agency or 
              health department.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Governing Law</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the state in which 
              services are provided, without regard to conflict of law principles. Any legal action arising from 
              these Terms shall be brought exclusively in the state or federal courts located in that jurisdiction.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>11. Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            <p>
              We reserve the right to modify these Terms at any time. Material changes will be communicated via 
              email or through your client portal. Your continued use of our services after changes are posted 
              constitutes acceptance of the revised Terms.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>12. Severability</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be 
              limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain 
              in full force and effect.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>13. Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Email: legal@homecare.com</p>
              <p>Phone: 1-800-HOME-CARE</p>
              <p>Mail: 123 Care Street, Suite 100, City, State 12345</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900 text-center">
          By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
        </p>
      </div>
    </div>
  );
}
