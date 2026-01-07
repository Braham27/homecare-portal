import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DEFAULT_SETTINGS = {
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

// GET /api/admin/settings - Get current settings
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has admin or HR role
    if (session.user.role !== "ADMIN" && session.user.role !== "HR_STAFF") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch settings from database using SystemSetting model
    const settingsRecords = await prisma.systemSetting.findMany();

    // If no settings exist, return defaults
    if (!settingsRecords || settingsRecords.length === 0) {
      return NextResponse.json({ settings: DEFAULT_SETTINGS });
    }

    // Convert array of settings to nested object structure
    const settings = { ...DEFAULT_SETTINGS };
    
    settingsRecords.forEach((record) => {
      const [category, key] = record.key.split(".");
      if (category && key && settings[category as keyof typeof settings]) {
        try {
          // Try to parse as JSON first (for boolean/number values)
          settings[category as keyof typeof settings][key] = JSON.parse(record.value);
        } catch {
          // If not JSON, use as string
          settings[category as keyof typeof settings][key] = record.value;
        }
      }
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/settings - Update settings
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admin can update settings
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    // Convert nested object to flat key-value pairs
    const updates = [];
    for (const [category, values] of Object.entries(body)) {
      if (typeof values === "object" && values !== null) {
        for (const [key, value] of Object.entries(values)) {
          updates.push({
            key: `${category}.${key}`,
            value: typeof value === "string" ? value : JSON.stringify(value),
            category,
          });
        }
      }
    }

    // Use upsert to create or update each setting
    await Promise.all(
      updates.map((setting) =>
        prisma.systemSetting.upsert({
          where: { key: setting.key },
          update: {
            value: setting.value,
            updatedAt: new Date(),
          },
          create: {
            key: setting.key,
            value: setting.value,
            category: setting.category,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
    });
  } catch (error) {
    console.error("Failed to update settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
