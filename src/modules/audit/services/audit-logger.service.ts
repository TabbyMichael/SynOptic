import { db } from '../../../infrastructure/database/db.service';
import { auditLogs } from '../../../../drizzle/schema';
import { logger } from '../../../infrastructure/logger/logger.service';

export type AuditAction =
  | 'FARM_CREATED'
  | 'FARM_UPDATED'
  | 'ANALYSIS_COMPLETED'
  | 'ALERT_CREATED'
  | 'ALERT_TRIGGERED'
  | 'LOGIN_SUCCESS'
  | 'SESSION_CREATED'
  | 'USER_REGISTERED'
  | 'SESSION_REVOKED'
  | 'SESSION_REVOKED_ALL'
  | 'ADMIN_LIST_USERS';

export interface AuditLogPayload {
  userId?: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  metadata?: Record<string, any>;
}

export class AuditLoggerService {
  async log(payload: AuditLogPayload): Promise<void> {
    try {
      await db.insert(auditLogs).values({
        userId: payload.userId,
        action: payload.action,
        entityType: payload.entityType,
        entityId: payload.entityId,
        metadata: payload.metadata,
      });

      logger.info({
        msg: 'Audit log created',
        action: payload.action,
        entityType: payload.entityType,
        entityId: payload.entityId,
      });
    } catch (error) {
      logger.error({
        msg: 'Failed to create audit log',
        error,
        payload,
      });
      // We don't throw here to avoid failing the main business transaction
    }
  }
}

export const auditLogger = new AuditLoggerService();
