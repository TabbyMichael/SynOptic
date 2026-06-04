import { pgTable, text, timestamp, uuid, doublePrecision } from 'drizzle-orm/pg-core';
import { users } from './users';

export const farms = pgTable('farms', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  county: text('county').notNull(),
  latitude: doublePrecision('latitude').notNull(),
  longitude: doublePrecision('longitude').notNull(),
  acres: doublePrecision('acres').notNull(),
  status: text('status').default('ACTIVE').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
