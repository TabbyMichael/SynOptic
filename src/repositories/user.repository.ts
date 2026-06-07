import { eq, or } from 'drizzle-orm';
import { db } from '../infrastructure/database/db.service';
import { users } from '../../drizzle/schema';
import { UserRepository, User, NewUser } from '../infrastructure/database/repositories/interfaces';

export const userRepository: UserRepository = {
  async findById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  },
  async findByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return user;
  },
  async create(data: NewUser): Promise<User> {
    const [row] = await db.insert(users).values(data).returning();
    return row;
  },
  async update(id: string, data: Partial<NewUser>): Promise<User> {
    const [row] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return row;
  },
  async findDemoUsers(): Promise<User[]> {
    // Fetch one admin and one farmer for demo purposes
    const admin = await db.select().from(users).where(eq(users.role, 'ADMIN')).limit(1);
    const farmer = await db.select().from(users).where(eq(users.role, 'FARMER')).limit(1);
    return [...admin, ...farmer];
  }
};
