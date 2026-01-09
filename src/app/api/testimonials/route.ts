import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET all testimonials
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const approvedOnly = searchParams.get("approved") !== "false";
    const featured = searchParams.get("featured") === "true";

    const whereClause: { isApproved?: boolean; isFeatured?: boolean } = {};
    
    if (approvedOnly) {
      whereClause.isApproved = true;
    }
    
    if (featured) {
      whereClause.isFeatured = true;
    }

    const testimonials = await prisma.testimonial.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

// POST create a new testimonial
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "HR_STAFF"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const testimonial = await prisma.testimonial.create({
      data: {
        clientName: body.clientName,
        relationship: body.relationship,
        content: body.content,
        rating: body.rating || 5,
        imageUrl: body.imageUrl,
        isApproved: body.isApproved ?? true,
        isFeatured: body.isFeatured ?? false,
      },
    });

    return NextResponse.json({ testimonial }, { status: 201 });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
