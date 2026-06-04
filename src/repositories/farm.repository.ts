import { db } from '../infrastructure/database/db.service';
import * as schema from '../../drizzle/schema';

export interface FarmRepository {
  findById(id: string): Promise<any | null>;
  findByOwner(ownerId: string): Promise<any[]>;
  create(data: any): Promise<any>;
}

export const farmRepository: FarmRepository = {
  async findById(id){
    return await db.select().from(schema.farms).where(schema.farms.id.eq(id)).limit(1).then(r=>r[0] ?? null);
  },
  async findByOwner(ownerId){
    return await db.select().from(schema.farms).where(schema.farms.ownerId.eq(ownerId));
  },
  async create(data){
    const [row] = await db.insert(schema.farms).values(data).returning();
    return row;
  }
};
