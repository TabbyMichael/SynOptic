CREATE TABLE "alert_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rule_id" uuid NOT NULL,
	"triggered_value" integer NOT NULL,
	"status" varchar(32) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "alert_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"farm_id" uuid NOT NULL,
	"metric" varchar(64) NOT NULL,
	"operator" varchar(4) NOT NULL,
	"threshold" integer NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"farm_id" uuid NOT NULL,
	"type" varchar(128) NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weather_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"farm_id" uuid NOT NULL,
	"metrics" jsonb NOT NULL,
	"captured_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"action" varchar(128) NOT NULL,
	"entity_type" varchar(128),
	"entity_id" uuid,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "farms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"location" jsonb,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "alert_events" ADD CONSTRAINT "alert_events_rule_id_alert_rules_id_fk" FOREIGN KEY ("rule_id") REFERENCES "public"."alert_rules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alert_rules" ADD CONSTRAINT "alert_rules_farm_id_farms_id_fk" FOREIGN KEY ("farm_id") REFERENCES "public"."farms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_farm_id_farms_id_fk" FOREIGN KEY ("farm_id") REFERENCES "public"."farms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weather_snapshots" ADD CONSTRAINT "weather_snapshots_farm_id_farms_id_fk" FOREIGN KEY ("farm_id") REFERENCES "public"."farms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "farms" ADD CONSTRAINT "farms_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "alert_events_rule_id_idx" ON "alert_events" USING btree ("rule_id");--> statement-breakpoint
CREATE INDEX "alert_rules_farm_id_idx" ON "alert_rules" USING btree ("farm_id");--> statement-breakpoint
CREATE INDEX "analyses_farm_id_idx" ON "analyses" USING btree ("farm_id");--> statement-breakpoint
CREATE INDEX "weather_snapshots_farm_id_idx" ON "weather_snapshots" USING btree ("farm_id");--> statement-breakpoint
CREATE INDEX "weather_snapshots_captured_at_idx" ON "weather_snapshots" USING btree ("captured_at");--> statement-breakpoint
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "farms_owner_id_idx" ON "farms" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'FARMER');--> statement-breakpoint
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
ALTER TABLE "farms" DROP COLUMN "metadata";CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"device_name" text,
	"browser" text,
	"operating_system" text,
	"user_agent" text,
	"ip_address" text,
	"location" jsonb,
	"current" boolean DEFAULT false NOT NULL,
	"trusted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_used_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"revoked" boolean DEFAULT false NOT NULL,
	"revoked_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"session_id" uuid,
	"token_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"revoked" boolean DEFAULT false NOT NULL,
	"revoked_at" timestamp,
	"replaced_by" uuid,
	"rotation_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password_hash" text;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "refresh_token_user_id_idx" ON "refresh_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "refresh_token_session_id_idx" ON "refresh_tokens" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "refresh_token_hash_idx" ON "refresh_tokens" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "analysis_farm_id_idx" ON "analyses" USING btree ("farm_id");--> statement-breakpoint
CREATE INDEX "analysis_created_at_idx" ON "analyses" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "weather_snapshot_farm_id_idx" ON "weather_snapshots" USING btree ("farm_id");--> statement-breakpoint
CREATE INDEX "weather_snapshot_captured_at_idx" ON "weather_snapshots" USING btree ("captured_at");--> statement-breakpoint
CREATE INDEX "farm_owner_id_idx" ON "farms" USING btree ("owner_id");CREATE TABLE "weather_cache" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cache_key" text NOT NULL,
	"payload" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "weather_cache_cache_key_unique" UNIQUE("cache_key")
);
