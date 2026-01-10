import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

// Set up connection
const connectionString = process.env.DATABASE_URL || "";
const pool = new pg.Pool({ 
  connectionString,
  ssl: connectionString.includes('sslmode=require') ? { rejectUnauthorized: false } : false
});
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
  const createdUsers: Record<string, any> = {};
  
  for (const [key, userData] of Object.entries(TEST_CREDENTIALS)) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    let user = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (!user) {
      user = await prisma.user.create({
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
    } else {
      console.log(`✓ User ${userData.email} already exists, skipping...`);
    }
    
    createdUsers[key] = user;
  }

  // Create Employee records for test caregiver and nurse users
  console.log("\n👷 Creating Employee records for test users...");
  
  // Create employee record for caregiver test user
  if (createdUsers.caregiver) {
    const existingCaregiverEmployee = await prisma.employee.findUnique({
      where: { userId: createdUsers.caregiver.id },
    });
    if (!existingCaregiverEmployee) {
      await prisma.employee.create({
        data: {
          userId: createdUsers.caregiver.id,
          employeeNumber: `EMP-CAREGIVER-01`,
          type: "CNA",
          hireDate: new Date("2024-01-01"),
          dateOfBirth: new Date("1990-06-15"),
          hourlyRate: 25.00,
          address: "123 Test Caregiver St",
          city: "Springfield",
          state: "IL",
          zipCode: "62701",
        },
      });
      console.log(`✓ Created Employee record for test caregiver: ${createdUsers.caregiver.email}`);
    } else {
      console.log(`✓ Employee record for test caregiver already exists`);
    }
  }

  // Create employee record for nurse test user
  if (createdUsers.nurse) {
    const existingNurseEmployee = await prisma.employee.findUnique({
      where: { userId: createdUsers.nurse.id },
    });
    if (!existingNurseEmployee) {
      await prisma.employee.create({
        data: {
          userId: createdUsers.nurse.id,
          employeeNumber: `EMP-NURSE-01`,
          type: "RN",
          hireDate: new Date("2023-06-01"),
          dateOfBirth: new Date("1985-09-20"),
          hourlyRate: 45.00,
          address: "456 Test Nurse Ave",
          city: "Springfield",
          state: "IL",
          zipCode: "62702",
        },
      });
      console.log(`✓ Created Employee record for test nurse: ${createdUsers.nurse.email}`);
    } else {
      console.log(`✓ Employee record for test nurse already exists`);
    }
  }

  // Create Client record for test client user
  if (createdUsers.client) {
    const existingClientRecord = await prisma.client.findUnique({
      where: { userId: createdUsers.client.id },
    });
    if (!existingClientRecord) {
      await prisma.client.create({
        data: {
          userId: createdUsers.client.id,
          clientNumber: `CLT-TEST-001`,
          dateOfBirth: new Date("1955-03-20"),
          address: "789 Test Client Rd",
          city: "Springfield",
          state: "IL",
          zipCode: "62703",
          primaryPhone: "(555) 111-2222",
          emergencyContact: "Family Member",
          emergencyPhone: "(555) 333-4444",
          emergencyRelation: "Spouse",
          payerType: "PRIVATE_PAY",
        },
      });
      console.log(`✓ Created Client record for test client: ${createdUsers.client.email}`);
    } else {
      console.log(`✓ Client record for test client already exists`);
    }
  }

  // Create Client record for test family member
  if (createdUsers.family) {
    const existingFamilyClientRecord = await prisma.client.findUnique({
      where: { userId: createdUsers.family.id },
    });
    if (!existingFamilyClientRecord) {
      await prisma.client.create({
        data: {
          userId: createdUsers.family.id,
          clientNumber: `CLT-TEST-002`,
          dateOfBirth: new Date("1960-07-10"),
          address: "321 Test Family Ln",
          city: "Springfield",
          state: "IL",
          zipCode: "62704",
          primaryPhone: "(555) 555-6666",
          emergencyContact: "Another Family Member",
          emergencyPhone: "(555) 777-8888",
          emergencyRelation: "Child",
          payerType: "PRIVATE_PAY",
        },
      });
      console.log(`✓ Created Client record for test family member: ${createdUsers.family.email}`);
    } else {
      console.log(`✓ Client record for test family member already exists`);
    }
  }

  // Create sample clients
  console.log("\n📋 Creating sample clients...");
  
  const clientData = [
    {
      email: "eleanor.johnson@example.com",
      firstName: "Eleanor",
      lastName: "Johnson",
      dateOfBirth: new Date("1938-05-15"),
      address: "123 Maple St",
      city: "Springfield",
      state: "IL",
      zipCode: "62701",
      phoneNumber: "(555) 234-5678",
    },
    {
      email: "robert.williams@example.com",
      firstName: "Robert",
      lastName: "Williams",
      dateOfBirth: new Date("1945-08-22"),
      address: "456 Oak Ave",
      city: "Springfield",
      state: "IL",
      zipCode: "62702",
      phoneNumber: "(555) 345-6789",
    },
    {
      email: "margaret.brown@example.com",
      firstName: "Margaret",
      lastName: "Brown",
      dateOfBirth: new Date("1942-03-10"),
      address: "789 Pine Rd",
      city: "Springfield",
      state: "IL",
      zipCode: "62703",
      phoneNumber: "(555) 456-7890",
    },
  ];

  const clients = [];
  for (const [index, data] of clientData.entries()) {
    let clientUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!clientUser) {
      const hashedPassword = await bcrypt.hash("Client@123!", 12);
      clientUser = await prisma.user.create({
        data: {
          email: data.email,
          passwordHash: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          role: "CLIENT",
          status: "ACTIVE" as UserStatusType,
          emailVerified: new Date(),
        },
      });
    }

    const existingClient = await prisma.client.findUnique({
      where: { userId: clientUser.id },
    });

    if (!existingClient) {
      const client = await prisma.client.create({
        data: {
          userId: clientUser.id,
          clientNumber: `CLT-${String(index + 1).padStart(5, "0")}`,
          dateOfBirth: data.dateOfBirth,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          primaryPhone: data.phoneNumber,
          emergencyContact: `${data.firstName} Jr.`,
          emergencyPhone: data.phoneNumber.replace("5678", "9999"),
          emergencyRelation: "Son/Daughter",
          payerType: "PRIVATE_PAY",
        },
      });
      clients.push(client);
      console.log(`✓ Created client: ${data.firstName} ${data.lastName}`);
    } else {
      clients.push(existingClient);
      console.log(`✓ Client ${data.firstName} ${data.lastName} already exists`);
    }
  }

  // Create sample employees (caregivers and nurses)
  console.log("\n👨‍⚕️ Creating sample employees...");
  
  const employeeData = [
    {
      email: "jane.smith@homecare.com",
      firstName: "Jane",
      lastName: "Smith",
      role: "CAREGIVER" as UserRoleType,
      type: "CNA" as const,
      certifications: ["CNA", "CPR", "First Aid"],
      hireDate: new Date("2024-01-15"),
      dateOfBirth: new Date("1990-03-15"),
      hourlyRate: 25.00,
      address: "100 Care St",
      city: "Springfield",
      state: "IL",
      zipCode: "62701",
    },
    {
      email: "maria.garcia@homecare.com",
      firstName: "Maria",
      lastName: "Garcia",
      role: "CAREGIVER" as UserRoleType,
      type: "HHA" as const,
      certifications: ["HHA", "CPR"],
      hireDate: new Date("2024-03-01"),
      dateOfBirth: new Date("1988-07-22"),
      hourlyRate: 23.00,
      address: "200 Helping Ln",
      city: "Springfield",
      state: "IL",
      zipCode: "62702",
    },
    {
      email: "david.chen@homecare.com",
      firstName: "David",
      lastName: "Chen",
      role: "NURSE" as UserRoleType,
      type: "RN" as const,
      certifications: ["RN", "BLS", "ACLS"],
      hireDate: new Date("2023-06-15"),
      dateOfBirth: new Date("1985-11-30"),
      hourlyRate: 45.00,
      address: "300 Medical Dr",
      city: "Springfield",
      state: "IL",
      zipCode: "62703",
    },
  ];

  const employees = [];
  for (const data of employeeData) {
    let empUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!empUser) {
      const hashedPassword = await bcrypt.hash("Employee@123!", 12);
      empUser = await prisma.user.create({
        data: {
          email: data.email,
          passwordHash: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          status: "ACTIVE" as UserStatusType,
          emailVerified: new Date(),
        },
      });
    }

    const existingEmployee = await prisma.employee.findUnique({
      where: { userId: empUser.id },
    });

    if (!existingEmployee) {
      const employee = await prisma.employee.create({
        data: {
          userId: empUser.id,
          employeeNumber: `EMP-${empUser.id.slice(0, 8).toUpperCase()}`,
          type: data.type,
          hireDate: data.hireDate,
          dateOfBirth: data.dateOfBirth,
          hourlyRate: data.hourlyRate,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
        },
      });
      employees.push(employee);
      console.log(`✓ Created employee: ${data.firstName} ${data.lastName} (${data.role})`);
    } else {
      employees.push(existingEmployee);
      console.log(`✓ Employee ${data.firstName} ${data.lastName} already exists`);
    }
  }

  // Create sample visits
  console.log("\n📅 Creating sample visits...");
  
  if (employees.length > 0 && clients.length > 0) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const visits = [
      {
        clientId: clients[0].id,
        employeeId: employees[0].id,
        scheduledDate: new Date(yesterday.setHours(0, 0, 0, 0)),
        scheduledStart: new Date(yesterday.setHours(9, 0, 0, 0)),
        scheduledEnd: new Date(yesterday.setHours(13, 0, 0, 0)),
        actualStart: new Date(yesterday.setHours(8, 58, 0, 0)),
        actualEnd: new Date(yesterday.setHours(13, 2, 0, 0)),
        serviceType: "PERSONAL_CARE",
        status: "COMPLETED",
        caregiverNotes: "Client in good spirits. Assisted with bathing and breakfast. Took a short walk around the neighborhood.",
      },
      {
        clientId: clients[0].id,
        employeeId: employees[0].id,
        scheduledDate: new Date(today.setHours(0, 0, 0, 0)),
        scheduledStart: new Date(today.setHours(9, 0, 0, 0)),
        scheduledEnd: new Date(today.setHours(13, 0, 0, 0)),
        serviceType: "PERSONAL_CARE",
        status: "SCHEDULED",
      },
      {
        clientId: clients[1].id,
        employeeId: employees[0].id,
        scheduledDate: new Date(today.setHours(0, 0, 0, 0)),
        scheduledStart: new Date(today.setHours(14, 0, 0, 0)),
        scheduledEnd: new Date(today.setHours(18, 0, 0, 0)),
        serviceType: "PERSONAL_CARE",
        status: "SCHEDULED",
      },
      {
        clientId: clients[1].id,
        employeeId: employees[1].id,
        scheduledDate: new Date(tomorrow.setHours(0, 0, 0, 0)),
        scheduledStart: new Date(tomorrow.setHours(10, 0, 0, 0)),
        scheduledEnd: new Date(tomorrow.setHours(14, 0, 0, 0)),
        serviceType: "COMPANION_CARE",
        status: "SCHEDULED",
      },
      {
        clientId: clients[2].id,
        employeeId: employees[2].id,
        scheduledDate: new Date(nextWeek.setHours(0, 0, 0, 0)),
        scheduledStart: new Date(nextWeek.setHours(11, 0, 0, 0)),
        scheduledEnd: new Date(nextWeek.setHours(12, 0, 0, 0)),
        serviceType: "SKILLED_NURSING",
        status: "SCHEDULED",
      },
    ];

    for (const visit of visits) {
      const existing = await prisma.visit.findFirst({
        where: {
          clientId: visit.clientId,
          employeeId: visit.employeeId,
          scheduledStart: visit.scheduledStart,
        },
      });

      if (!existing) {
        await prisma.visit.create({ data: visit });
        console.log(`✓ Created visit: ${visit.serviceType} - ${visit.status}`);
      }
    }
  }

  // Create sample invoices
  console.log("\n💰 Creating sample invoices...");
  
  if (clients.length > 0) {
    const invoice = await prisma.invoice.findFirst({
      where: { clientId: clients[0].id },
    });

    if (!invoice) {
      // Create invoice first
      const newInvoice = await prisma.invoice.create({
        data: {
          clientId: clients[0].id,
          invoiceNumber: "INV-2026-001",
          billingPeriodStart: new Date("2025-12-01"),
          billingPeriodEnd: new Date("2025-12-31"),
          dueDate: new Date("2026-01-15"),
          subtotal: 400.00,
          tax: 0,
          total: 400.00,
          amountPaid: 0,
          amountDue: 400.00,
          status: "PENDING",
          payerType: "PRIVATE_PAY",
        },
      });
      
      // Create line items separately
      await prisma.invoiceLineItem.createMany({
        data: [
          {
            invoiceId: newInvoice.id,
            description: "Personal Care Services (4 hours)",
            serviceDate: new Date("2025-12-15"),
            quantity: 4,
            unitPrice: 50.00,
            total: 200.00,
          },
          {
            invoiceId: newInvoice.id,
            description: "Personal Care Services (4 hours)",
            serviceDate: new Date("2025-12-18"),
            quantity: 4,
            unitPrice: 50.00,
            total: 200.00,
          },
        ],
      });
      
      console.log(`✓ Created invoice: ${newInvoice.invoiceNumber}`);
    } else {
      console.log(`✓ Invoice already exists for client`);
    }
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
