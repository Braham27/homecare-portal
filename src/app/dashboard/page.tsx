"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.replace("/login");
      return;
    }

    // Redirect based on user role
    const role = session.user.role;
    
    switch (role) {
      case "ADMIN":
      case "SCHEDULER":
      case "BILLING_STAFF":
      case "HR_STAFF":
        router.replace("/admin");
        break;
      case "CAREGIVER":
      case "NURSE":
        router.replace("/portal/employee");
        break;
      case "CLIENT":
      case "FAMILY_MEMBER":
        router.replace("/portal/client");
        break;
      default:
        router.replace("/");
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
