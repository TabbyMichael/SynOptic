import { Client } from 'pg';

const connectionString = "postgresql://postgres.avmxdjdnmaitjdoruoyz:gCa73M2%2BxU%26V3Qf@aws-0-eu-west-1.pooler.supabase.com:6543/postgres";

async function migrate() {
  const client = new Client({ connectionString });
  try {
    console.log('Connecting to database...');
    await client.connect();
    
    console.log('Checking for missing columns in "users" table...');
    
    // Add is_verified if missing
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false NOT NULL,
      ADD COLUMN IF NOT EXISTS email_verified TIMESTAMP;
    `);
    
    console.log('✅ Database schema updated!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    await client.end();
    process.exit(0);
  }
}

migrate();
