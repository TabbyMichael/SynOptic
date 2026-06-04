import { pgTable, text, timestamp, uuid, doublePrecision, boolean } from 'drizzle-orm/pg-core';
import { farms } from './farms';

export const alertRules = pgTable('alert_rules', {
  id: uuid('id').primaryKey().defaultRandom(),
  farmId: uuid('farm_id').references(() => farms.id, { onDelete: 'cascade' }).notNull(),
  metric: text('metric').notNull(),
  operator: text('operator').notNull(),
  threshold: doublePrecision('threshold').notNull(),
  severity: text('severity').notNull(),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const alertEvents = pgTable('alert_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  ruleId: uuid('rule_id').references(() => alertRules.id, { onDelete: 'cascade' }).notNull(),
  triggeredValue: doublePrecision('triggered_value').notNull(),
  status: text('status').default('OPEN').notNull(),
  triggeredAt: timestamp('triggered_at').defaultNow().notNull(),
});
