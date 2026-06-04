CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'FARMER');--> statement-breakpoint
ALTER TABLE "alert_events" DROP CONSTRAINT "alert_events_rule_id_alert_rules_id_fk";
--> statement-breakpoint
ALTER TABLE "alert_rules" DROP CONSTRAINT "alert_rules_farm_id_farms_id_fk";
--> statement-breakpoint
ALTER TABLE "analyses" DROP CONSTRAINT "analyses_farm_id_farms_id_fk";
--> statement-breakpoint
ALTER TABLE "weather_snapshots" DROP CONSTRAINT "weather_snapshots_farm_id_farms_id_fk";
--> statement-breakpoint
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "farms" DROP CONSTRAINT "farms_owner_id_users_id_fk";
--> statement-breakpoint
DROP INDEX "alert_events_rule_id_idx";--> statement-breakpoint
DROP INDEX "alert_rules_farm_id_idx";--> statement-breakpoint
DROP INDEX "analyses_farm_id_idx";--> statement-breakpoint
DROP INDEX "weather_snapshots_farm_id_idx";--> statement-breakpoint
DROP INDEX "weather_snapshots_captured_at_idx";--> statement-breakpoint
DROP INDEX "audit_logs_user_id_idx";--> statement-breakpoint
DROP INDEX "audit_logs_created_at_idx";--> statement-breakpoint
DROP INDEX "farms_owner_id_idx";--> statement-breakpoint
DROP INDEX "users_email_idx";--> statement-breakpoint
ALTER TABLE "alert_events" ALTER COLUMN "triggered_value" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "alert_events" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "alert_events" ALTER COLUMN "status" SET DEFAULT 'OPEN';--> statement-breakpoint
ALTER TABLE "alert_rules" ALTER COLUMN "metric" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "alert_rules" ALTER COLUMN "operator" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "alert_rules" ALTER COLUMN "threshold" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "weather_snapshots" ALTER COLUMN "captured_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "action" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "entity_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "entity_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "entity_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "entity_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "farms" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "alert_events" ADD COLUMN "triggered_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "alert_rules" ADD COLUMN "severity" text NOT NULL;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "analysis_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "tree_count" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "healthy_count" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "needs_care_count" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "needs_replacement_count" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "canopy_coverage" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "tree_density" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "confidence_score" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "overlay_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "weather_snapshots" ADD COLUMN "temperature" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "weather_snapshots" ADD COLUMN "humidity" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "weather_snapshots" ADD COLUMN "wind_speed" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "weather_snapshots" ADD COLUMN "rainfall" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "weather_snapshots" ADD COLUMN "pressure" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "farms" ADD COLUMN "county" text NOT NULL;--> statement-breakpoint
ALTER TABLE "farms" ADD COLUMN "latitude" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "farms" ADD COLUMN "longitude" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "farms" ADD COLUMN "acres" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "farms" ADD COLUMN "status" text DEFAULT 'ACTIVE' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_role" DEFAULT 'FARMER' NOT NULL;--> statement-breakpoint
ALTER TABLE "alert_events" ADD CONSTRAINT "alert_events_rule_id_alert_rules_id_fk" FOREIGN KEY ("rule_id") REFERENCES "public"."alert_rules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alert_rules" ADD CONSTRAINT "alert_rules_farm_id_farms_id_fk" FOREIGN KEY ("farm_id") REFERENCES "public"."farms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_farm_id_farms_id_fk" FOREIGN KEY ("farm_id") REFERENCES "public"."farms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weather_snapshots" ADD CONSTRAINT "weather_snapshots_farm_id_farms_id_fk" FOREIGN KEY ("farm_id") REFERENCES "public"."farms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "farms" ADD CONSTRAINT "farms_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alert_events" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "analyses" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "analyses" DROP COLUMN "payload";--> statement-breakpoint
ALTER TABLE "weather_snapshots" DROP COLUMN "metrics";--> statement-breakpoint
ALTER TABLE "weather_snapshots" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "farms" DROP COLUMN "location";--> statement-breakpoint
ALTER TABLE "farms" DROP COLUMN "metadata";