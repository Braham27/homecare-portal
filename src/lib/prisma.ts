/**
 * Re-export prisma from db.ts for compatibility
 * Some files import from @/lib/prisma instead of @/lib/db
 */
export { prisma } from "./db";
