import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const weatherCache = pgTable('weather_cache', {
  id: uuid('id').defaultRandom().primaryKey(),
  cache_key: text('cache_key').notNull().unique(),
  payload: text('payload').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  expires_at: timestamp('expires_at').notNull(),
});
