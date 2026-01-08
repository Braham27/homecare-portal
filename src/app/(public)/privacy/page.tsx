import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, FileText, Database, Users, Bell, CheckCircle } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <Shield className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-lg text-gray-600">
          Last Updated: January 8, 2026
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Your privacy and the security of your health information is our top priority
        </p>
      </div>

      {/* HIPAA Compliance Notice */}
      <Card className="mb-8 border-primary bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Lock className="h-6 w-6 text-primary" />
            <CardTitle>HIPAA Compliance</CardTitle>
          </div>
          <CardDescription>
            We are fully compliant with the Health Insurance Portability and Accountability Act (HIPAA)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Our home care services are subject to HIPAA regulations. We maintain strict safeguards to protect
            your Protected Health Information (PHI) and ensure your medical information remains confidential
            and secure at all times.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-sm">
                <strong>Administrative Safeguards</strong>
                <p className="text-gray-600">Policies and procedures to protect PHI</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-sm">
                <strong>Physical Safeguards</strong>
                <p className="text-gray-600">Secure facilities and equipment</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-sm">
                <strong>Technical Safeguards</strong>
                <p className="text-gray-600">Encryption and access controls</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Sections */}
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Database className="h-6 w-6 text-primary" />
              <CardTitle>Information We Collect</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm ml-2">
                <li>Name, contact information, and emergency contacts</li>
                <li>Date of birth and Social Security Number (for billing purposes)</li>
                <li>Payment and insurance information</li>
                <li>Login credentials and account preferences</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Protected Health Information (PHI)</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm ml-2">
                <li>Medical history, diagnoses, and treatment information</li>
                <li>Medication lists and prescriptions</li>
                <li>Physician and healthcare provider information</li>
                <li>Care plans and service documentation</li>
                <li>Visit notes and caregiver observations</li>
                <li>Assessments and health status updates</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Usage Information</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm ml-2">
                <li>Website and portal usage data</li>
                <li>Device information and IP addresses</li>
                <li>Communication logs and preferences</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Eye className="h-6 w-6 text-primary" />
              <CardTitle>How We Use Your Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              We use your information only for legitimate purposes related to providing and improving our home care services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 text-sm ml-2">
              <li><strong>Care Delivery:</strong> To provide personalized home care services tailored to your needs</li>
              <li><strong>Care Coordination:</strong> To communicate with healthcare providers, family members, and caregivers</li>
              <li><strong>Billing and Payment:</strong> To process payments and work with insurance companies</li>
              <li><strong>Scheduling:</strong> To arrange and manage caregiver visits</li>
              <li><strong>Quality Improvement:</strong> To monitor service quality and caregiver performance</li>
              <li><strong>Legal Compliance:</strong> To meet regulatory requirements and legal obligations</li>
              <li><strong>Safety and Security:</strong> To ensure the safety of clients and caregivers</li>
              <li><strong>Communication:</strong> To send appointment reminders, service updates, and important notices</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-primary" />
              <CardTitle>Information Sharing and Disclosure</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              We respect your privacy and will never sell your personal or health information. We may share your information only in the following circumstances:
            </p>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">With Your Consent</h3>
              <p className="text-sm text-gray-600">
                We share information with family members, authorized representatives, or others you designate.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">For Care Coordination</h3>
              <p className="text-sm text-gray-600">
                We share necessary information with physicians, hospitals, therapists, and other healthcare providers involved in your care.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">With Our Caregivers</h3>
              <p className="text-sm text-gray-600">
                We provide our caregivers with the information they need to deliver safe and effective care.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">For Payment and Operations</h3>
              <p className="text-sm text-gray-600">
                We share information with insurance companies, billing services, and payment processors as needed.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">As Required by Law</h3>
              <p className="text-sm text-gray-600">
                We may disclose information when required by law, court order, or government regulations.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">For Health and Safety</h3>
              <p className="text-sm text-gray-600">
                We may disclose information to prevent serious harm to you or others, or to report abuse or neglect.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Lock className="h-6 w-6 text-primary" />
              <CardTitle>Data Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600 mb-3">
              We implement comprehensive security measures to protect your information:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-gray-900">Technical Security</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm ml-2">
                  <li>256-bit SSL/TLS encryption</li>
                  <li>Secure, encrypted databases</li>
                  <li>Multi-factor authentication</li>
                  <li>Regular security audits</li>
                  <li>Intrusion detection systems</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-gray-900">Organizational Security</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm ml-2">
                  <li>Role-based access controls</li>
                  <li>Employee training on HIPAA compliance</li>
                  <li>Background checks for all staff</li>
                  <li>Confidentiality agreements</li>
                  <li>Incident response protocols</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <CardTitle>Your Privacy Rights</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Under HIPAA and applicable privacy laws, you have the following rights:
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <strong>Right to Access:</strong> Request copies of your health records
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <strong>Right to Amend:</strong> Request corrections to your health information
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <strong>Right to an Accounting:</strong> Request a list of disclosures of your information
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <strong>Right to Request Restrictions:</strong> Ask us to limit how we use or share your information
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <strong>Right to Confidential Communication:</strong> Request communication through specific means or locations
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <strong>Right to a Paper Copy:</strong> Receive a paper copy of this privacy notice
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6 text-primary" />
              <CardTitle>Breach Notification</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              In the unlikely event of a breach of your unsecured protected health information, we will notify you 
              without unreasonable delay and no later than 60 days after discovery of the breach. We will also 
              notify the U.S. Department of Health and Human Services and, if applicable, the media, as required by law.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              We retain your health information for the minimum period required by law and regulation. Medical records 
              are typically retained for at least 7 years from the date of service, or longer if required by state law 
              or ongoing treatment needs. After the retention period, records are securely destroyed in accordance with 
              HIPAA requirements.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              While we provide care to individuals of all ages, our online services are not intended for use by 
              children under 13. When providing care to minors, we work with parents or legal guardians and obtain 
              appropriate consent for treatment and information sharing.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              We reserve the right to modify this privacy policy at any time. Changes will be effective immediately 
              upon posting to our website. We will notify you of material changes via email or through your client portal. 
              Your continued use of our services after changes are posted constitutes acceptance of the revised policy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              If you have questions about this privacy policy or wish to exercise your privacy rights, please contact us:
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Privacy Officer</strong></p>
              <p>Email: privacy@homecare.com</p>
              <p>Phone: 1-800-HOME-CARE</p>
              <p>Mail: 123 Care Street, Suite 100, City, State 12345</p>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              You also have the right to file a complaint with the U.S. Department of Health and Human Services 
              Office for Civil Rights if you believe your privacy rights have been violated.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
