import { db } from '../src/infrastructure/database/db.service';
import { weatherCache } from '../drizzle/schema/cache';

async function main() {
  try {
    const result = await db.select().from(weatherCache).limit(1);
    console.log('Result:', result);
  } catch (e) {
    console.error('Error:', e);
  }
}
main();
