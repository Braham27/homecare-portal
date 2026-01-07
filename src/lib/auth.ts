import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma, isDatabaseConnectionError } from "./db";
import { UserRole } from "@prisma/client";
import { createAuditLog } from "./audit";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: UserRole;
      mfaEnabled: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    mfaEnabled: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    mfaEnabled: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes - HIPAA compliant session timeout
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
          });

          if (!user) {
            throw new Error("Invalid email or password");
          }

          // Check if account is locked
          if (user.lockedUntil && user.lockedUntil > new Date()) {
            throw new Error("Account is temporarily locked. Please try again later.");
          }

          // Check if user is active
          if (user.status !== "ACTIVE" && user.status !== "PENDING") {
            throw new Error("Account is not active. Please contact support.");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );

          if (!isPasswordValid) {
            // Increment failed login count
            const failedCount = user.failedLoginCount + 1;
            const updateData: { failedLoginCount: number; lockedUntil?: Date } = {
              failedLoginCount: failedCount,
            };

            // Lock account after 5 failed attempts for 15 minutes
            if (failedCount >= 5) {
              updateData.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
            }

            await prisma.user.update({
              where: { id: user.id },
              data: updateData,
            });

            // Log failed attempt
            await createAuditLog({
              userId: user.id,
              action: "LOGIN_FAILED",
              entityType: "User",
              entityId: user.id,
              ipAddress: (req as { headers?: { "x-forwarded-for"?: string } })?.headers?.["x-forwarded-for"] || "unknown",
            });

            throw new Error("Invalid email or password");
          }

          // Reset failed login count and update last login
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginCount: 0,
              lockedUntil: null,
              lastLoginAt: new Date(),
            },
          });

          // Log successful login
          await createAuditLog({
            userId: user.id,
            action: "LOGIN_SUCCESS",
            entityType: "User",
            entityId: user.id,
            ipAddress: (req as { headers?: { "x-forwarded-for"?: string } })?.headers?.["x-forwarded-for"] || "unknown",
          });

          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            mfaEnabled: user.mfaEnabled,
          };
        } catch (error) {
          // Handle known authentication errors
          if (error instanceof Error) {
            // Check for database connection error
            if (isDatabaseConnectionError(error)) {
              throw new Error("Unable to sign in at this time. Please try again later.");
            }
            
            const knownErrors = [
              "Email and password are required",
              "Invalid email or password",
              "Account is temporarily locked",
              "Account is not active",
            ];
            
            // If it's a known auth error, pass it through
            if (knownErrors.some(msg => error.message.includes(msg))) {
              throw error;
            }
          }
          
          // For other errors, show generic message
          console.error("Authentication error:", error);
          throw new Error("Unable to sign in at this time. Please try again later.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
        token.mfaEnabled = user.mfaEnabled;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.role = token.role;
        session.user.mfaEnabled = token.mfaEnabled;
      }
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      if (token?.id) {
        await createAuditLog({
          userId: token.id,
          action: "LOGOUT",
          entityType: "User",
          entityId: token.id,
        });
      }
    },
  },
};

// Password hashing utilities
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Role-based access control helpers
export function hasRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}

export function isAdmin(role: UserRole): boolean {
  return role === "ADMIN";
}

export function isStaff(role: UserRole): boolean {
  return ["ADMIN", "SCHEDULER", "BILLING_STAFF", "HR_STAFF"].includes(role);
}

export function isCaregiver(role: UserRole): boolean {
  return ["CAREGIVER", "NURSE"].includes(role);
}

export function isClient(role: UserRole): boolean {
  return role === "CLIENT" || role === "FAMILY_MEMBER";
}

// Password validation
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 12) {
    errors.push("Password must be at least 12 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
