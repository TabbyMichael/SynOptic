import { db } from '../../../infrastructure/database/db.service';
import { analyses, alertEvents, alertRules } from '../../../infrastructure/database/schema';
import { eq, desc, sql } from 'drizzle-orm';

export interface FarmAnalytics {
  healthScore: number;
  treeHealthStats: {
    healthy: number;
    unhealthy: number;
    dead: number;
  };
  activeAlerts: number;
}

export class AnalyticsService {
  async getFarmAnalytics(farmId: string): Promise<FarmAnalytics> {
    // 1. Get latest analysis
    const [latestAnalysis] = await db.select().from(analyses)
      .where(eq(analyses.farmId, farmId))
      .orderBy(desc(analyses.createdAt))
      .limit(1);

    // 2. Get active alerts
    const activeAlertsCount = await db.select({
      count: sql<number>`count(*)`
    }).from(alertEvents)
      .innerJoin(alertRules, eq(alertEvents.ruleId, alertRules.id))
      .where(and(eq(alertRules.farmId, farmId), eq(alertEvents.status, 'OPEN')));

    const treeHealth = latestAnalysis ? {
      healthy: latestAnalysis.healthyCount,
      unhealthy: latestAnalysis.needsCareCount,
      dead: latestAnalysis.needsReplacementCount,
    } : { healthy: 0, unhealthy: 0, dead: 0 };

    const healthScore = this.calculateHealthScore(treeHealth, Number(activeAlertsCount[0]?.count || 0));

    return {
      healthScore,
      treeHealthStats: treeHealth,
      activeAlerts: Number(activeAlertsCount[0]?.count || 0),
    };
  }

  private calculateHealthScore(stats: any, activeAlerts: number): number {
    const total = stats.healthy + stats.unhealthy + stats.dead;
    if (total === 0) return 0;

    const baseScore = (stats.healthy / total) * 100;
    const alertPenalty = activeAlerts * 5;
    
    return Math.max(0, Math.min(100, baseScore - alertPenalty));
  }
}

import { and } from 'drizzle-orm';
export const analyticsService = new AnalyticsService();
