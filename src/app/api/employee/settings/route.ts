import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only caregivers and nurses can access their settings
    if (session.user.role !== "CAREGIVER" && session.user.role !== "NURSE") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        mfaEnabled: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the employee record for the current user
    const employee = await prisma.employee.findFirst({
      where: { userId: session.user.id },
      select: {
        id: true,
        employeeNumber: true,
        type: true,
        hireDate: true,
        status: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
      },
    });

    if (!employee) {
      return NextResponse.json({ error: "Employee record not found" }, { status: 404 });
    }

    return NextResponse.json({
      profile: user,
      employee: employee,
      // Default notification settings (would be stored in DB in production)
      notifications: {
        emailNotifications: true,
        smsNotifications: false,
        scheduleReminders: true,
        documentationReminders: true,
        trainingReminders: true,
      },
      // Default availability (would be stored in DB in production)
      availability: [
        { day: "Monday", available: true, startTime: "08:00", endTime: "17:00" },
        { day: "Tuesday", available: true, startTime: "08:00", endTime: "17:00" },
        { day: "Wednesday", available: true, startTime: "08:00", endTime: "17:00" },
        { day: "Thursday", available: true, startTime: "08:00", endTime: "17:00" },
        { day: "Friday", available: true, startTime: "08:00", endTime: "17:00" },
        { day: "Saturday", available: false, startTime: "08:00", endTime: "12:00" },
        { day: "Sunday", available: false, startTime: "08:00", endTime: "12:00" },
      ],
    });
  } catch (error) {
    console.error("Error fetching employee settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only caregivers and nurses can update their settings
    if (session.user.role !== "CAREGIVER" && session.user.role !== "NURSE") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { type, data } = await request.json();

    if (type === "profile") {
      // Update user profile (name and phone)
      const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        },
      });

      // Update employee record (address fields)
      if (data.address || data.city || data.state || data.zipCode) {
        await prisma.employee.updateMany({
          where: { userId: session.user.id },
          data: {
            address: data.address,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
          },
        });
      }

      return NextResponse.json(updatedUser);
    }

    if (type === "notifications") {
      // In production, save to a UserPreferences table
      // For now, we just acknowledge the save
      return NextResponse.json({ success: true, message: "Notifications updated" });
    }

    if (type === "availability") {
      // In production, save to an EmployeeAvailability table
      // For now, we just acknowledge the save
      return NextResponse.json({ success: true, message: "Availability updated" });
    }

    return NextResponse.json({ error: "Invalid update type" }, { status: 400 });
  } catch (error) {
    console.error("Error updating employee settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
