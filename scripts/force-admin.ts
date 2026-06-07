import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './drizzle/schema';
import { users } from './drizzle/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';

const connectionString = "postgresql://postgres.avmxdjdnmaitjdoruoyz:gCa73M2%2BxU%26V3Qf@aws-0-eu-west-1.pooler.supabase.com:6543/postgres";

async function setup() {
  console.log('Connecting to database...');
  const pool = new Pool({ connectionString });
  const db = drizzle(pool, { schema });

  const email = 'kibuguian@gmail.com';
  const password = 'Tata203##';

  try {
    console.log(`Setting up admin: ${email}`);
    const passwordHash = await bcrypt.hash(password, 10);
    
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existing.length > 0) {
      await db.update(users)
        .set({ passwordHash, role: 'ADMIN', isVerified: true, emailVerified: new Date() })
        .where(eq(users.id, existing[0].id));
      console.log('✅ Admin updated!');
    } else {
      await db.insert(users).values({
        email,
        name: 'Admin User',
        passwordHash,
        role: 'ADMIN',
        isVerified: true,
        emailVerified: new Date()
      });
      console.log('✅ Admin created!');
    }
  } catch (err) {
    console.error('❌ Failed:', err);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

setup();
