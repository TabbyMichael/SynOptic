import { pgTable, text, timestamp, uuid, boolean, jsonb } from 'drizzle-orm/pg-core';
import { users } from './users';

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  deviceName: text('device_name'),
  browser: text('browser'),
  operatingSystem: text('operating_system'),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  location: jsonb('location'),
  current: boolean('current').default(false).notNull(),
  trusted: boolean('trusted').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastUsedAt: timestamp('last_used_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'),
  revoked: boolean('revoked').default(false).notNull(),
  revokedAt: timestamp('revoked_at'),
});

export type Session = typeof sessions.$inferSelect;
