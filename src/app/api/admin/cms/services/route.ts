import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";

// GET /api/admin/cms/services - Fetch CMS service pages
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session || !["ADMIN", "HR_STAFF"].includes(session.user?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For now, return static data since we don't have CMS table
    // In production, you'd create a CMS table in Prisma schema
    const services = [
      {
        id: "1",
        name: "Personal Care",
        slug: "personal-care",
        shortDescription: "Assistance with daily living activities",
        description: "Our personal care services include assistance with bathing, grooming, dressing, and mobility. Our trained caregivers provide dignified, compassionate support.",
        category: "medical",
        isActive: true,
        order: 1,
      },
      {
        id: "2",
        name: "Companion Care",
        slug: "companion-care",
        shortDescription: "Social interaction and emotional support",
        description: "Combat loneliness and isolation with our companion care services. Our caregivers provide meaningful conversation, activities, and emotional support.",
        category: "non-medical",
        isActive: true,
        order: 2,
      },
      {
        id: "3",
        name: "Skilled Nursing",
        slug: "skilled-nursing",
        shortDescription: "Professional medical care at home",
        description: "Licensed nurses provide medical care including medication management, wound care, IV therapy, and chronic disease management.",
        category: "medical",
        isActive: true,
        order: 3,
      },
    ];

    return NextResponse.json({ services });
  } catch (error) {
    console.error("Error fetching CMS services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

// POST /api/admin/cms/services - Create CMS service page
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    
    // Would save to CMS table in production
    return NextResponse.json({ 
      service: {
        id: Date.now().toString(),
        ...data,
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating CMS service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}
