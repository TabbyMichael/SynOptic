import { pgTable, text, timestamp, uuid, doublePrecision, integer, index } from 'drizzle-orm/pg-core';
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
}, (table) => ({
  farmIdIdx: index('analysis_farm_id_idx').on(table.farmId),
  createdAtIdx: index('analysis_created_at_idx').on(table.createdAt),
}));

export const weatherSnapshots = pgTable('weather_snapshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  farmId: uuid('farm_id').references(() => farms.id, { onDelete: 'cascade' }).notNull(),
  temperature: doublePrecision('temperature').notNull(),
  humidity: doublePrecision('humidity').notNull(),
  windSpeed: doublePrecision('wind_speed').notNull(),
  rainfall: doublePrecision('rainfall').notNull(),
  pressure: doublePrecision('pressure').notNull(),
  capturedAt: timestamp('captured_at').defaultNow().notNull(),
}, (table) => ({
  farmIdIdx: index('weather_snapshot_farm_id_idx').on(table.farmId),
  capturedAtIdx: index('weather_snapshot_captured_at_idx').on(table.capturedAt),
}));
