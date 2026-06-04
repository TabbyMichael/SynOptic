import { eq } from 'drizzle-orm';
import { db } from '../../../infrastructure/database/db.service';
import { farms } from '../../../../drizzle/schema';
import { IFarmRepository, Farm, NewFarm } from './farm.repository.interface';

export class FarmRepository implements IFarmRepository {
  async create(data: NewFarm): Promise<Farm> {
    const [farm] = await db.insert(farms).values(data).returning();
    return farm;
  }

  async findById(id: string): Promise<Farm | undefined> {
    const [farm] = await db.select().from(farms).where(eq(farms.id, id));
    return farm;
  }

  async findByOwnerId(ownerId: string): Promise<Farm[]> {
    return db.select().from(farms).where(eq(farms.ownerId, ownerId));
  }

  async update(id: string, data: Partial<NewFarm>): Promise<Farm> {
    const [farm] = await db
      .update(farms)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(farms.id, id))
      .returning();
    return farm;
  }

  async delete(id: string): Promise<void> {
    await db.delete(farms).where(eq(farms.id, id));
  }

  async listAll(): Promise<Farm[]> {
    return db.select().from(farms);
  }
}

export const farmRepository = new FarmRepository();
