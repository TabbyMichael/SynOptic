import { z } from 'zod';

// During the Next.js production build phase, server-side secrets are not available.
// Use defaults so static page generation can complete; real values are enforced at runtime.
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

const envSchema = z.object({
  // Database
  POSTGRES_USER: z.string().default(''),
  POSTGRES_PASSWORD: z.string().default(''),
  POSTGRES_DB: z.string().default(''),
  POSTGRES_PORT: z.coerce.number().default(5432),
  DATABASE_URL: z.string().default(''),
  TEST_DATABASE_URL: z.string().default(''),

  // Auth
  NEXTAUTH_URL: z.string().default(''),
  NEXTAUTH_SECRET: z.string().default(''),

  // Third Party
  WEATHERAI_API_KEY: z.string().optional(),
  VERCEL_CRON_TOKEN: z.string().optional(),

  // Environment
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(_env.error.format(), null, 2));
  process.exit(1);
}

if (!isBuildPhase) {
  const required = ['POSTGRES_USER', 'POSTGRES_PASSWORD', 'POSTGRES_DB', 'DATABASE_URL', 'NEXTAUTH_URL', 'NEXTAUTH_SECRET'] as const;
  const missing = required.filter(k => !_env.data![k]);
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    process.exit(1);
  }
}

export const env = _env.data;

export type Env = typeof env;
