import { pgTable, text, timestamp, uuid, doublePrecision, integer } from 'drizzle-orm/pg-core';
import { farms } from './farms';

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
