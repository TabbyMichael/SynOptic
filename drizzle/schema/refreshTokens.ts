import { pgTable, text, timestamp, uuid, boolean, integer, index } from 'drizzle-orm/pg-core';
import { users } from './users';
import { sessions } from './sessions';

export const refreshTokens = pgTable('refresh_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  sessionId: uuid('session_id').references(() => sessions.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'),
  revoked: boolean('revoked').default(false).notNull(),
  revokedAt: timestamp('revoked_at'),
  replacedBy: uuid('replaced_by'),
  rotationCount: integer('rotation_count').default(0).notNull(),
}, (table) => ({
  userIdIdx: index('refresh_token_user_id_idx').on(table.userId),
  sessionIdIdx: index('refresh_token_session_id_idx').on(table.sessionId),
  tokenHashIdx: index('refresh_token_hash_idx').on(table.tokenHash),
}));

export type RefreshToken = typeof refreshTokens.$inferSelect;
