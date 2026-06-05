import { eq, and } from 'drizzle-orm';
import { db } from '../infrastructure/database/db.service';
import * as schema from '../../drizzle/schema';

export interface AlertRepository {
  findActiveRulesForFarm(farmId: string): Promise<any[]>;
  createEvent(data: any): Promise<any>;
}

export const alertRepository: AlertRepository = {
  async findActiveRulesForFarm(farmId){
    return await db.select().from(schema.alertRules).where(and(eq(schema.alertRules.farmId, farmId), eq(schema.alertRules.active, true)));
  },
  async createEvent(data){
    const [row] = await db.insert(schema.alertEvents).values(data).returning();
    return row;
  }
};
