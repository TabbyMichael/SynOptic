import { farms } from '../../../infrastructure/database/schema';

export type Farm = typeof farms.$inferSelect;
export type NewFarm = typeof farms.$inferInsert;

export interface IFarmRepository {
  create(data: NewFarm): Promise<Farm>;
  findById(id: string): Promise<Farm | undefined>;
  findByOwnerId(ownerId: string): Promise<Farm[]>;
  update(id: string, data: Partial<NewFarm>): Promise<Farm>;
  delete(id: string): Promise<void>;
  listAll(): Promise<Farm[]>;
}
