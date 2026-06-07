import { db } from '../src/infrastructure/database/db.service';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';

async function setupAdmin() {
  const email = 'kibuguian@gmail.com';
  const password = 'Tata203##';
  const name = 'Admin User';

  console.log(`Setting up admin user: ${email}`);

  try {
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    const passwordHash = await bcrypt.hash(password, 10);

    if (existing.length > 0) {
      console.log('User exists, updating password and role...');
      await db.update(users)
        .set({ 
          passwordHash, 
          role: 'ADMIN',
          isVerified: true,
          emailVerified: new Date()
        })
        .where(eq(users.id, existing[0].id));
      console.log('Admin user updated successfully.');
    } else {
      console.log('Creating new admin user...');
      await db.insert(users).values({
        email,
        name,
        passwordHash,
        role: 'ADMIN',
        isVerified: true,
        emailVerified: new Date()
      });
      console.log('Admin user created successfully.');
    }
  } catch (error) {
    console.error('Failed to setup admin user:', error);
  } finally {
    process.exit(0);
  }
}

setupAdmin();
