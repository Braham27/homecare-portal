"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Building2,
  CreditCard,
  Bell,
  Shield,
  Save,
  Loader2,
  Check,
} from "lucide-react";

// Settings stored locally for now - in production, these would come from a database
const defaultSettings = {
  general: {
    agencyName: "HomeCare Agency",
    address: "123 Care Street",
    city: "Springfield",
    state: "IL",
    zipCode: "62701",
    phone: "(555) 123-4567",
    fax: "(555) 123-4568",
    email: "info@homecareagency.com",
    website: "https://homecareagency.com",
    npiNumber: "",
    taxId: "",
  },
  billing: {
    taxRate: 0,
    paymentTermsDays: 30,
    invoicePrefix: "INV",
    invoiceFooter: "Thank you for choosing our services.",
    acceptCreditCards: true,
    acceptACH: true,
    acceptChecks: true,
    lateFeePercentage: 0,
    lateFeeGraceDays: 15,
  },
  notifications: {
    emailNewClient: true,
    emailNewEmployee: true,
    emailVisitReminder: true,
    emailInvoiceCreated: true,
    emailPaymentReceived: true,
    emailExpiringCredentials: true,
    emailMissedClockIn: true,
    dailySummary: true,
    weeklySummary: true,
  },
  security: {
    sessionTimeoutMinutes: 30,
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumber: true,
    passwordRequireSpecial: true,
    maxLoginAttempts: 5,
    lockoutDurationMinutes: 15,
    mfaEnabled: false,
  },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings || defaultSettings);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      general: {
        ...prev.general,
        [name]: value,
      },
    }));
    setSaved(false);
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      billing: {
        ...prev.billing,
        [name]: type === "number" ? parseFloat(value) || 0 : value,
      },
    }));
    setSaved(false);
  };

  const handleBillingSwitchChange = (name: string, checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      billing: {
        ...prev.billing,
        [name]: checked,
      },
    }));
    setSaved(false);
  };

  const handleNotificationChange = (name: string, checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: checked,
      },
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert("Failed to save settings");
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage agency settings and preferences</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agency Information</CardTitle>
              <CardDescription>Basic information about your agency</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="agencyName">Agency Name</Label>
                <Input
                  id="agencyName"
                  name="agencyName"
                  value={settings.general.agencyName}
                  onChange={handleGeneralChange}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={settings.general.address}
                  onChange={handleGeneralChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={settings.general.city}
                  onChange={handleGeneralChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={settings.general.state}
                    onChange={handleGeneralChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={settings.general.zipCode}
                    onChange={handleGeneralChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How clients and staff can reach the agency</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={settings.general.phone}
                  onChange={handleGeneralChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fax">Fax Number</Label>
                <Input
                  id="fax"
                  name="fax"
                  value={settings.general.fax}
                  onChange={handleGeneralChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={settings.general.email}
                  onChange={handleGeneralChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={settings.general.website}
                  onChange={handleGeneralChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Legal Information</CardTitle>
              <CardDescription>Required for billing and compliance</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="npiNumber">NPI Number</Label>
                <Input
                  id="npiNumber"
                  name="npiNumber"
                  value={settings.general.npiNumber}
                  onChange={handleGeneralChange}
                  placeholder="1234567890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID (EIN)</Label>
                <Input
                  id="taxId"
                  name="taxId"
                  value={settings.general.taxId}
                  onChange={handleGeneralChange}
                  placeholder="12-3456789"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Settings</CardTitle>
              <CardDescription>Configure how invoices are generated</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="invoicePrefix">Invoice Number Prefix</Label>
                <Input
                  id="invoicePrefix"
                  name="invoicePrefix"
                  value={settings.billing.invoicePrefix}
                  onChange={handleBillingChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentTermsDays">Payment Terms (Days)</Label>
                <Input
                  id="paymentTermsDays"
                  name="paymentTermsDays"
                  type="number"
                  min="0"
                  value={settings.billing.paymentTermsDays}
                  onChange={handleBillingChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  name="taxRate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={settings.billing.taxRate}
                  onChange={handleBillingChange}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="invoiceFooter">Invoice Footer Message</Label>
                <textarea
                  id="invoiceFooter"
                  name="invoiceFooter"
                  value={settings.billing.invoiceFooter}
                  onChange={handleBillingChange}
                  className="w-full px-3 py-2 border rounded-lg min-h-[80px]"
                  placeholder="Enter a message to display at the bottom of invoices"
                  aria-label="Invoice Footer Message"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Enable payment options for clients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Credit Cards</p>
                  <p className="text-sm text-gray-500">Accept Visa, Mastercard, Amex</p>
                </div>
                <Switch
                  checked={settings.billing.acceptCreditCards}
                  onCheckedChange={(checked) => handleBillingSwitchChange("acceptCreditCards", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">ACH/Bank Transfer</p>
                  <p className="text-sm text-gray-500">Direct bank account payments</p>
                </div>
                <Switch
                  checked={settings.billing.acceptACH}
                  onCheckedChange={(checked) => handleBillingSwitchChange("acceptACH", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Checks</p>
                  <p className="text-sm text-gray-500">Accept paper checks</p>
                </div>
                <Switch
                  checked={settings.billing.acceptChecks}
                  onCheckedChange={(checked) => handleBillingSwitchChange("acceptChecks", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Late Fees</CardTitle>
              <CardDescription>Configure late payment penalties</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lateFeePercentage">Late Fee (%)</Label>
                <Input
                  id="lateFeePercentage"
                  name="lateFeePercentage"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={settings.billing.lateFeePercentage}
                  onChange={handleBillingChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lateFeeGraceDays">Grace Period (Days)</Label>
                <Input
                  id="lateFeeGraceDays"
                  name="lateFeeGraceDays"
                  type="number"
                  min="0"
                  value={settings.billing.lateFeeGraceDays}
                  onChange={handleBillingChange}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Configure which events trigger email notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Client Registered</p>
                  <p className="text-sm text-gray-500">When a new client account is created</p>
                </div>
                <Switch
                  checked={settings.notifications.emailNewClient}
                  onCheckedChange={(checked) => handleNotificationChange("emailNewClient", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Employee Onboarded</p>
                  <p className="text-sm text-gray-500">When a new employee is added</p>
                </div>
                <Switch
                  checked={settings.notifications.emailNewEmployee}
                  onCheckedChange={(checked) => handleNotificationChange("emailNewEmployee", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Visit Reminders</p>
                  <p className="text-sm text-gray-500">Remind caregivers of upcoming visits</p>
                </div>
                <Switch
                  checked={settings.notifications.emailVisitReminder}
                  onCheckedChange={(checked) => handleNotificationChange("emailVisitReminder", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Invoice Created</p>
                  <p className="text-sm text-gray-500">When a new invoice is generated</p>
                </div>
                <Switch
                  checked={settings.notifications.emailInvoiceCreated}
                  onCheckedChange={(checked) => handleNotificationChange("emailInvoiceCreated", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Payment Received</p>
                  <p className="text-sm text-gray-500">When a payment is processed</p>
                </div>
                <Switch
                  checked={settings.notifications.emailPaymentReceived}
                  onCheckedChange={(checked) => handleNotificationChange("emailPaymentReceived", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Expiring Credentials</p>
                  <p className="text-sm text-gray-500">When employee certifications are expiring</p>
                </div>
                <Switch
                  checked={settings.notifications.emailExpiringCredentials}
                  onCheckedChange={(checked) => handleNotificationChange("emailExpiringCredentials", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Missed Clock-In</p>
                  <p className="text-sm text-gray-500">When a caregiver misses scheduled clock-in</p>
                </div>
                <Switch
                  checked={settings.notifications.emailMissedClockIn}
                  onCheckedChange={(checked) => handleNotificationChange("emailMissedClockIn", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary Reports</CardTitle>
              <CardDescription>Automated activity summaries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Daily Summary</p>
                  <p className="text-sm text-gray-500">End-of-day activity recap</p>
                </div>
                <Switch
                  checked={settings.notifications.dailySummary}
                  onCheckedChange={(checked) => handleNotificationChange("dailySummary", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly Summary</p>
                  <p className="text-sm text-gray-500">Weekly metrics and insights</p>
                </div>
                <Switch
                  checked={settings.notifications.weeklySummary}
                  onCheckedChange={(checked) => handleNotificationChange("weeklySummary", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Management</CardTitle>
              <CardDescription>HIPAA-compliant session settings</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Session Timeout</Label>
                <p className="text-2xl font-bold">{settings.security.sessionTimeoutMinutes} minutes</p>
                <p className="text-sm text-gray-500">Users are logged out after inactivity</p>
              </div>
              <div className="space-y-2">
                <Label>Account Lockout</Label>
                <p className="text-2xl font-bold">{settings.security.maxLoginAttempts} attempts</p>
                <p className="text-sm text-gray-500">Locks for {settings.security.lockoutDurationMinutes} min after failed attempts</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Password Requirements</CardTitle>
              <CardDescription>Password policy for all users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span>Minimum {settings.security.passwordMinLength} characters</span>
                </div>
                {settings.security.passwordRequireUppercase && (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span>At least one uppercase letter</span>
                  </div>
                )}
                {settings.security.passwordRequireNumber && (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span>At least one number</span>
                  </div>
                )}
                {settings.security.passwordRequireSpecial && (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span>At least one special character (!@#$%^&*)</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Additional security layer for user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable MFA for All Users</p>
                  <p className="text-sm text-gray-500">Require two-factor authentication at login</p>
                </div>
                <Switch
                  checked={settings.security.mfaEnabled}
                  onCheckedChange={(checked) => {
                    setSettings((prev) => ({
                      ...prev,
                      security: {
                        ...prev.security,
                        mfaEnabled: checked,
                      },
                    }));
                    setSaved(false);
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Shield className="h-6 w-6 text-blue-500 shrink-0" />
                <div>
                  <p className="font-medium text-blue-900">HIPAA Compliance</p>
                  <p className="text-sm text-blue-700 mt-1">
                    These security settings are configured to meet HIPAA requirements for protecting 
                    patient health information (PHI). Session timeouts, password policies, and audit 
                    logging are automatically enforced.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
