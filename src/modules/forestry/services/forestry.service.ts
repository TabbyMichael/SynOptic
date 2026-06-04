import { weatherAiClient } from '../../../infrastructure/weather-ai/weather-ai.client';
import { db } from '../../../infrastructure/database/db.service';
import { analyses } from '../../../../drizzle/schema';
import { auditLogger } from '../../audit/services/audit-logger.service';
import { farmService } from '../../farms/services/farm.service';
import { logger } from '../../../infrastructure/logger/logger.service';
import { UserRole } from '../../auth/types/auth.types';

export class ForestryService {
  async analyzeFarmImage(userId: string, role: UserRole, farmId: string, imageUrl: string) {
    // 1. Authorization check via FarmService (it will throw if not allowed)
    const farm = await farmService.getFarm(userId, role, farmId);

    logger.info({ msg: 'Starting forestry analysis', farmId, userId, imageUrl });

    // 2. Call WeatherAI
    const result = await weatherAiClient.analyzeForestry(imageUrl);

    // 3. Store results
    const [analysis] = await db.insert(analyses).values({
      farmId,
      analysisId: result.id,
      treeCount: result.tree_stats.total,
      healthyCount: result.tree_stats.healthy,
      needsCareCount: result.tree_stats.unhealthy,
      needsReplacementCount: result.tree_stats.dead,
      canopyCoverage: result.coverage.canopy,
      treeDensity: result.coverage.density,
      confidenceScore: result.score,
      overlayUrl: result.overlay,
    }).returning();

    // 4. Audit Log
    await auditLogger.log({
      userId,
      action: 'ANALYSIS_COMPLETED',
      entityType: 'analysis',
      entityId: analysis.id,
      metadata: { 
        farm_id: farmId,
        tree_count: result.tree_stats.total,
        score: result.score 
      },
    });

    return analysis;
  }
}

export const forestryService = new ForestryService();
