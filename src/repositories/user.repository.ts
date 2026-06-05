import { eq } from 'drizzle-orm';
import { db } from '../infrastructure/database/db.service';
import * as schema from '../../drizzle/schema';

export interface UserRepository {
  findById(id: string): Promise<any | null>;
  findByEmail(email: string): Promise<any | null>;
  create(data: any): Promise<any>;
}

export const userRepository: UserRepository = {
  async findById(id){
    return await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1).then(r=>r[0] ?? null);
  },
  async findByEmail(email){
    return await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1).then(r=>r[0] ?? null);
  },
  async create(data){
    const [row] = await db.insert(schema.users).values(data).returning();
    return row;
  }
};
