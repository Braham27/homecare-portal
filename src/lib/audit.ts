import { prisma } from "./db";

interface AuditLogParams {
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  phiAccessed?: boolean;
}

/**
 * Create an audit log entry - HIPAA compliant logging
 * All PHI access and modifications must be logged
 */
export async function createAuditLog({
  userId,
  action,
  entityType,
  entityId,
  oldValues,
  newValues,
  ipAddress,
  userAgent,
  phiAccessed = false,
}: AuditLogParams) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        oldValues: oldValues ? JSON.parse(JSON.stringify(oldValues)) : undefined,
        newValues: newValues ? JSON.parse(JSON.stringify(newValues)) : undefined,
        ipAddress,
        userAgent,
        phiAccessed,
      },
    });
  } catch (error) {
    // Log to console but don't throw - auditing shouldn't break the main operation
    console.error("Failed to create audit log:", error);
  }
}

// PHI entity types that require special logging
export const PHI_ENTITY_TYPES = [
  "Client",
  "CarePlan",
  "CarePlanTask",
  "Visit",
  "VisitTaskLog",
  "ClientDocument",
  "ClientInsurance",
];

// Actions that should always be logged
export const AUDITABLE_ACTIONS = [
  "CREATE",
  "READ",
  "UPDATE",
  "DELETE",
  "LOGIN_SUCCESS",
  "LOGIN_FAILED",
  "LOGOUT",
  "PASSWORD_CHANGE",
  "MFA_ENABLED",
  "MFA_DISABLED",
  "PERMISSION_CHANGE",
  "EXPORT_DATA",
  "IMPORT_DATA",
  "PAYMENT_PROCESSED",
  "DOCUMENT_UPLOADED",
  "DOCUMENT_DOWNLOADED",
  "SIGNATURE_CAPTURED",
];

/**
 * Check if an entity type contains PHI
 */
export function isPHIEntity(entityType: string): boolean {
  return PHI_ENTITY_TYPES.includes(entityType);
}

/**
 * Get audit logs with filtering
 */
export async function getAuditLogs({
  userId,
  entityType,
  entityId,
  action,
  startDate,
  endDate,
  phiOnly = false,
  limit = 100,
  offset = 0,
}: {
  userId?: string;
  entityType?: string;
  entityId?: string;
  action?: string;
  startDate?: Date;
  endDate?: Date;
  phiOnly?: boolean;
  limit?: number;
  offset?: number;
}) {
  const where: Record<string, unknown> = {};

  if (userId) where.userId = userId;
  if (entityType) where.entityType = entityType;
  if (entityId) where.entityId = entityId;
  if (action) where.action = action;
  if (phiOnly) where.phiAccessed = true;
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) (where.createdAt as Record<string, Date>).gte = startDate;
    if (endDate) (where.createdAt as Record<string, Date>).lte = endDate;
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    logs,
    total,
    hasMore: offset + logs.length < total,
  };
}

/**
 * Create PHI access log - specialized for healthcare data access
 */
export async function logPHIAccess({
  userId,
  action,
  entityType,
  entityId,
  ipAddress,
  userAgent,
}: {
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  return createAuditLog({
    userId,
    action,
    entityType,
    entityId,
    ipAddress,
    userAgent,
    phiAccessed: true,
  });
}
