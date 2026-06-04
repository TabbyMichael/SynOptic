import { db } from '../../../infrastructure/database/db.service';
import { alertRules, alertEvents } from '../../../../drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { auditLogger } from '../../audit/services/audit-logger.service';
import { logger } from '../../../infrastructure/logger/logger.service';
import { WeatherSnapshot } from '../../weather/utils/weather.mapper';

export class AlertService {
  async evaluateRules(farmId: string, snapshot: WeatherSnapshot): Promise<void> {
    const rules = await db.select().from(alertRules).where(
      and(eq(alertRules.farmId, farmId), eq(alertRules.active, true))
    );

    for (const rule of rules) {
      const value = (snapshot as any)[rule.metric];
      if (value === undefined) continue;

      if (this.checkCondition(value, rule.operator, rule.threshold)) {
        await this.triggerAlert(rule.id, value);
      }
    }
  }

  private checkCondition(value: number, operator: string, threshold: number): boolean {
    switch (operator) {
      case '>': return value > threshold;
      case '<': return value < threshold;
      case '>=': return value >= threshold;
      case '<=': return value <= threshold;
      case '==': return value === threshold;
      default: return false;
    }
  }

  private async triggerAlert(ruleId: string, value: number): Promise<void> {
    const [event] = await db.insert(alertEvents).values({
      ruleId,
      triggeredValue: value,
      status: 'OPEN',
    }).returning();

    logger.warn({ msg: 'Alert triggered', ruleId, eventId: event.id, value });

    await auditLogger.log({
      action: 'ALERT_TRIGGERED',
      entityType: 'alert_event',
      entityId: event.id,
      metadata: { rule_id: ruleId, value },
    });
  }
}

export const alertService = new AlertService();
