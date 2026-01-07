"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Bell,
  Shield,
  Calendar,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  mfaEnabled: boolean;
}

interface EmployeeInfo {
  id: string;
  employeeNumber: string;
  position: string;
  department: string | null;
  hireDate: string;
  status: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  scheduleReminders: boolean;
  documentationReminders: boolean;
  trainingReminders: boolean;
}

interface AvailabilitySlot {
  day: string;
  available: boolean;
  startTime: string;
  endTime: string;
}

export default function EmployeeSettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo | null>(null);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    scheduleReminders: true,
    documentationReminders: true,
    trainingReminders: true,
  });
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([
    { day: "Monday", available: true, startTime: "08:00", endTime: "17:00" },
    { day: "Tuesday", available: true, startTime: "08:00", endTime: "17:00" },
    { day: "Wednesday", available: true, startTime: "08:00", endTime: "17:00" },
    { day: "Thursday", available: true, startTime: "08:00", endTime: "17:00" },
    { day: "Friday", available: true, startTime: "08:00", endTime: "17:00" },
    { day: "Saturday", available: false, startTime: "08:00", endTime: "12:00" },
    { day: "Sunday", available: false, startTime: "08:00", endTime: "12:00" },
  ]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/employee/settings");
      
      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }
      
      const data = await response.json();
      setProfile(data.profile);
      setEmployeeInfo(data.employee);
      if (data.notifications) {
        setNotifications(data.notifications);
      }
      if (data.availability) {
        setAvailability(data.availability);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setSaving(true);
      setSuccessMessage(null);
      
      const response = await fetch("/api/employee/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "profile",
          data: {
            firstName: profile.firstName,
            lastName: profile.lastName,
            phone: profile.phone,
            address: profile.address,
            city: profile.city,
            state: profile.state,
            zipCode: profile.zipCode,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");
      
      setSuccessMessage("Profile updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationUpdate = async () => {
    try {
      setSaving(true);
      setSuccessMessage(null);
      
      const response = await fetch("/api/employee/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "notifications",
          data: notifications,
        }),
      });

      if (!response.ok) throw new Error("Failed to update notifications");
      
      setSuccessMessage("Notification settings saved!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleAvailabilityUpdate = async () => {
    try {
      setSaving(true);
      setSuccessMessage(null);
      
      const response = await fetch("/api/employee/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "availability",
          data: availability,
        }),
      });

      if (!response.ok) throw new Error("Failed to update availability");
      
      setSuccessMessage("Availability saved!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-[400px] bg-gray-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <h2 className="text-xl font-semibold mb-2">Error Loading Settings</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={fetchSettings}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your profile and preferences</p>
      </div>

      {successMessage && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
          <CheckCircle2 className="h-5 w-5" />
          <p className="text-sm">{successMessage}</p>
        </div>
      )}

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="availability" className="gap-2">
            <Calendar className="h-4 w-4" />
            Availability
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Employee Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Employee Information</CardTitle>
                <CardDescription>Your employment details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{profile?.firstName} {profile?.lastName}</p>
                    <p className="text-sm text-gray-500">{employeeInfo?.position}</p>
                  </div>
                </div>
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Employee #</span>
                    <span className="font-medium">{employeeInfo?.employeeNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Department</span>
                    <span className="font-medium">{employeeInfo?.department || "N/A"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      employeeInfo?.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    )}>
                      {employeeInfo?.status}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Form */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profile?.firstName || ""}
                        onChange={(e) => setProfile(p => p ? { ...p, firstName: e.target.value } : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profile?.lastName || ""}
                        onChange={(e) => setProfile(p => p ? { ...p, lastName: e.target.value } : null)}
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          value={profile?.email || ""}
                          disabled
                          className="pl-10 bg-gray-50"
                        />
                      </div>
                      <p className="text-xs text-gray-500">Contact admin to change email</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          value={profile?.phone || ""}
                          onChange={(e) => setProfile(p => p ? { ...p, phone: e.target.value } : null)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="address"
                        value={profile?.address || ""}
                        onChange={(e) => setProfile(p => p ? { ...p, address: e.target.value } : null)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={profile?.city || ""}
                        onChange={(e) => setProfile(p => p ? { ...p, city: e.target.value } : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={profile?.state || ""}
                        onChange={(e) => setProfile(p => p ? { ...p, state: e.target.value } : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={profile?.zipCode || ""}
                        onChange={(e) => setProfile(p => p ? { ...p, zipCode: e.target.value } : null)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={saving}>
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive updates via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked: boolean) =>
                      setNotifications((n) => ({ ...n, emailNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-gray-500">Receive updates via text message</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.smsNotifications}
                    onCheckedChange={(checked: boolean) =>
                      setNotifications((n) => ({ ...n, smsNotifications: checked }))
                    }
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Reminder Types</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Schedule Reminders</p>
                        <p className="text-sm text-gray-500">Get notified about upcoming visits</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.scheduleReminders}
                      onCheckedChange={(checked: boolean) =>
                        setNotifications((n) => ({ ...n, scheduleReminders: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="font-medium">Documentation Reminders</p>
                        <p className="text-sm text-gray-500">Reminders for pending documentation</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.documentationReminders}
                      onCheckedChange={(checked: boolean) =>
                        setNotifications((n) => ({ ...n, documentationReminders: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="font-medium">Training Reminders</p>
                        <p className="text-sm text-gray-500">Alerts for upcoming or expiring training</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.trainingReminders}
                      onCheckedChange={(checked: boolean) =>
                        setNotifications((n) => ({ ...n, trainingReminders: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleNotificationUpdate} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Preferences"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weekly Availability</CardTitle>
              <CardDescription>Set your regular working hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availability.map((slot, index) => (
                  <div
                    key={slot.day}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg border",
                      slot.available ? "bg-white" : "bg-gray-50"
                    )}
                  >
                    <div className="w-28">
                      <Switch
                        checked={slot.available}
                        onCheckedChange={(checked: boolean) => {
                          const newAvailability = [...availability];
                          newAvailability[index].available = checked;
                          setAvailability(newAvailability);
                        }}
                      />
                    </div>
                    <div className="w-28 font-medium">{slot.day}</div>
                    {slot.available ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => {
                            const newAvailability = [...availability];
                            newAvailability[index].startTime = e.target.value;
                            setAvailability(newAvailability);
                          }}
                          className="w-32"
                        />
                        <span className="text-gray-500">to</span>
                        <Input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => {
                            const newAvailability = [...availability];
                            newAvailability[index].endTime = e.target.value;
                            setAvailability(newAvailability);
                          }}
                          className="w-32"
                        />
                      </div>
                    ) : (
                      <span className="text-gray-500">Not available</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-6">
                <Button onClick={handleAvailabilityUpdate} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Availability"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">
                        {profile?.mfaEnabled
                          ? "Your account is protected with 2FA"
                          : "Add an extra layer of security"}
                      </p>
                    </div>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium",
                    profile?.mfaEnabled
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  )}>
                    {profile?.mfaEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Password</h4>
                <p className="text-sm text-gray-500 mb-4">
                  For security reasons, password changes must be done through the admin or by using the &quot;Forgot Password&quot; feature on the login page.
                </p>
                <Button variant="outline" disabled>
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
