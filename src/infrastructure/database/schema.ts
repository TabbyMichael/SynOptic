import { pgTable, text, timestamp, uuid, doublePrecision, integer, boolean, jsonb, pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'FARMER']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  role: userRoleEnum('role').default('FARMER').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

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

export const analyses = pgTable('analyses', {
  id: uuid('id').primaryKey().defaultRandom(),
  farmId: uuid('farm_id').references(() => farms.id, { onDelete: 'cascade' }).notNull(),
  analysisId: text('analysis_id').notNull(),
  treeCount: integer('tree_count').notNull(),
  healthyCount: integer('healthy_count').notNull(),
  needsCareCount: integer('needs_care_count').notNull(),
  needsReplacementCount: integer('needs_replacement_count').notNull(),
  canopyCoverage: doublePrecision('canopy_coverage').notNull(),
  treeDensity: doublePrecision('tree_density').notNull(),
  confidenceScore: doublePrecision('confidence_score').notNull(),
  overlayUrl: text('overlay_url').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const weatherSnapshots = pgTable('weather_snapshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  farmId: uuid('farm_id').references(() => farms.id, { onDelete: 'cascade' }).notNull(),
  temperature: doublePrecision('temperature').notNull(),
  humidity: doublePrecision('humidity').notNull(),
  windSpeed: doublePrecision('wind_speed').notNull(),
  rainfall: doublePrecision('rainfall').notNull(),
  pressure: doublePrecision('pressure').notNull(),
  capturedAt: timestamp('captured_at').defaultNow().notNull(),
});

export const alertRules = pgTable('alert_rules', {
  id: uuid('id').primaryKey().defaultRandom(),
  farmId: uuid('farm_id').references(() => farms.id, { onDelete: 'cascade' }).notNull(),
  metric: text('metric').notNull(), // temperature, rainfall, wind_speed
  operator: text('operator').notNull(), // >, <, >=, <=, ==
  threshold: doublePrecision('threshold').notNull(),
  severity: text('severity').notNull(), // info, warning, critical
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const alertEvents = pgTable('alert_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  ruleId: uuid('rule_id').references(() => alertRules.id, { onDelete: 'cascade' }).notNull(),
  triggeredValue: doublePrecision('triggered_value').notNull(),
  status: text('status').default('OPEN').notNull(), // OPEN, ACKNOWLEDGED, RESOLVED
  triggeredAt: timestamp('triggered_at').defaultNow().notNull(),
});

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
