import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/homecare_db';

let pool: pg.Pool | null = null;
let adapter: PrismaPg | null = null;

try {
  pool = new pg.Pool({ 
    connectionString,
    ssl: connectionString.includes('sslmode=require') ? { rejectUnauthorized: false } : false
  });
  adapter = new PrismaPg(pool);
} catch (error) {
  console.error('Failed to initialize database pool:', error);
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    adapter: adapter!,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Helper to check if an error is a database connection error
export function isDatabaseConnectionError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes("Can't reach database server") ||
      error.message.includes('Connection refused') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('connect ENOTFOUND') ||
      error.message.includes('database')
    );
  }
  return false;
}

export default prisma;
