import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/reports - Fetch report statistics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "BILLING_STAFF"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "month";

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    let previousStartDate: Date;
    let previousEndDate: Date;

    switch (range) {
      case "week":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        previousStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14);
        previousEndDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        break;
      case "quarter":
        const currentQuarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), currentQuarter * 3, 1);
        previousStartDate = new Date(now.getFullYear(), (currentQuarter - 1) * 3, 1);
        previousEndDate = new Date(now.getFullYear(), currentQuarter * 3, 0);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        previousStartDate = new Date(now.getFullYear() - 1, 0, 1);
        previousEndDate = new Date(now.getFullYear() - 1, 11, 31);
        break;
      default: // month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        previousEndDate = new Date(now.getFullYear(), now.getMonth(), 0);
    }

    // Fetch current period stats
    const [
      totalRevenue,
      previousRevenue,
      totalVisits,
      previousVisits,
      activeClients,
      evvCompliance,
    ] = await Promise.all([
      // Current revenue
      prisma.invoice.aggregate({
        where: {
          status: "PAID",
          paidAt: { gte: startDate },
        },
        _sum: { amountPaid: true },
      }),
      // Previous period revenue
      prisma.invoice.aggregate({
        where: {
          status: "PAID",
          paidAt: { gte: previousStartDate, lte: previousEndDate },
        },
        _sum: { amountPaid: true },
      }),
      // Current visits
      prisma.visit.count({
        where: {
          scheduledStart: { gte: startDate },
          status: "COMPLETED",
        },
      }),
      // Previous visits
      prisma.visit.count({
        where: {
          scheduledStart: { gte: previousStartDate, lte: previousEndDate },
          status: "COMPLETED",
        },
      }),
      // Active clients
      prisma.client.count({
        where: { status: "ACTIVE" },
      }),
      // EVV Compliance (visits with check-in/out times)
      prisma.visit.findMany({
        where: {
          scheduledStart: { gte: startDate },
          status: "COMPLETED",
        },
        select: {
          actualStart: true,
          actualEnd: true,
        },
      }),
    ]);

    // Calculate EVV compliance rate
    const verifiedVisits = evvCompliance.filter(v => v.actualStart && v.actualEnd).length;
    const evvRate = evvCompliance.length > 0
      ? ((verifiedVisits / evvCompliance.length) * 100).toFixed(1)
      : "0.0";

    // Calculate percentage changes
    const currentRevNum = Number(totalRevenue._sum?.amountPaid || 0);
    const prevRevNum = Number(previousRevenue._sum?.amountPaid || 0);
    const revenueChange = prevRevNum > 0
      ? (((currentRevNum - prevRevNum) / prevRevNum) * 100).toFixed(1)
      : "0";

    const visitsChange = previousVisits > 0
      ? (((totalVisits - previousVisits) / previousVisits) * 100).toFixed(1)
      : "0";

    // Get new clients this period
    const newClients = await prisma.client.count({
      where: {
        createdAt: { gte: startDate },
        status: "ACTIVE",
      },
    });

    return NextResponse.json({
      stats: {
        totalRevenue: currentRevNum,
        revenueChange: parseFloat(revenueChange),
        totalVisits,
        visitsChange: parseFloat(visitsChange),
        activeClients,
        newClients,
        evvCompliance: parseFloat(evvRate),
      },
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}
