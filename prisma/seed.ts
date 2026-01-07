import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

// Set up connection
const connectionString = process.env.DATABASE_URL || "";
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// User roles and status as strings (matching Prisma enums)
type UserRoleType = "ADMIN" | "SCHEDULER" | "BILLING_STAFF" | "HR_STAFF" | "CAREGIVER" | "NURSE" | "CLIENT" | "FAMILY_MEMBER";
type UserStatusType = "ACTIVE" | "INACTIVE" | "PENDING" | "SUSPENDED";

// Test credentials - SAVE THESE!
const TEST_CREDENTIALS: Record<string, {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRoleType;
}> = {
  admin: {
    email: "admin@homecare.com",
    password: "Admin@123!",
    firstName: "Sarah",
    lastName: "Admin",
    role: "ADMIN",
  },
  scheduler: {
    email: "scheduler@homecare.com",
    password: "Scheduler@123!",
    firstName: "Mike",
    lastName: "Scheduler",
    role: "SCHEDULER",
  },
  billing: {
    email: "billing@homecare.com",
    password: "Billing@123!",
    firstName: "Jane",
    lastName: "Billing",
    role: "BILLING_STAFF",
  },
  hr: {
    email: "hr@homecare.com",
    password: "HRStaff@123!",
    firstName: "Tom",
    lastName: "HumanResources",
    role: "HR_STAFF",
  },
  caregiver: {
    email: "caregiver@homecare.com",
    password: "Caregiver@123!",
    firstName: "Emily",
    lastName: "Caregiver",
    role: "CAREGIVER",
  },
  nurse: {
    email: "nurse@homecare.com",
    password: "Nurse@123!",
    firstName: "Dr. Lisa",
    lastName: "Nurse",
    role: "NURSE",
  },
  client: {
    email: "client@example.com",
    password: "Client@123!",
    firstName: "John",
    lastName: "Client",
    role: "CLIENT",
  },
  family: {
    email: "family@example.com",
    password: "Family@123!",
    firstName: "Mary",
    lastName: "FamilyMember",
    role: "FAMILY_MEMBER",
  },
};

async function main() {
  console.log("🌱 Starting database seed...\n");

  // Create all test users
  for (const [key, userData] of Object.entries(TEST_CREDENTIALS)) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      console.log(`✓ User ${userData.email} already exists, skipping...`);
      continue;
    }

    await prisma.user.create({
      data: {
        email: userData.email,
        passwordHash: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        status: "ACTIVE" as UserStatusType,
        emailVerified: new Date(),
      },
    });

    console.log(`✓ Created ${key} user: ${userData.email}`);
  }

  console.log("\n✅ Database seed completed!");
  console.log("\n📋 TEST CREDENTIALS (Save these!):\n");
  console.log("═".repeat(60));
  
  console.log("\n🔐 ADMIN PORTAL (http://localhost:3000/admin):");
  console.log(`   Email: ${TEST_CREDENTIALS.admin.email}`);
  console.log(`   Password: ${TEST_CREDENTIALS.admin.password}`);
  
  console.log("\n📅 SCHEDULER:");
  console.log(`   Email: ${TEST_CREDENTIALS.scheduler.email}`);
  console.log(`   Password: ${TEST_CREDENTIALS.scheduler.password}`);
  
  console.log("\n💰 BILLING STAFF:");
  console.log(`   Email: ${TEST_CREDENTIALS.billing.email}`);
  console.log(`   Password: ${TEST_CREDENTIALS.billing.password}`);
  
  console.log("\n👥 HR STAFF:");
  console.log(`   Email: ${TEST_CREDENTIALS.hr.email}`);
  console.log(`   Password: ${TEST_CREDENTIALS.hr.password}`);
  
  console.log("\n👨‍⚕️ EMPLOYEE PORTAL (http://localhost:3000/employee):");
  console.log(`   Caregiver Email: ${TEST_CREDENTIALS.caregiver.email}`);
  console.log(`   Caregiver Password: ${TEST_CREDENTIALS.caregiver.password}`);
  console.log(`   Nurse Email: ${TEST_CREDENTIALS.nurse.email}`);
  console.log(`   Nurse Password: ${TEST_CREDENTIALS.nurse.password}`);
  
  console.log("\n👤 CLIENT PORTAL (http://localhost:3000/client):");
  console.log(`   Email: ${TEST_CREDENTIALS.client.email}`);
  console.log(`   Password: ${TEST_CREDENTIALS.client.password}`);
  
  console.log("\n👨‍👩‍👧 FAMILY MEMBER:");
  console.log(`   Email: ${TEST_CREDENTIALS.family.email}`);
  console.log(`   Password: ${TEST_CREDENTIALS.family.password}`);
  
  console.log("\n" + "═".repeat(60));
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
