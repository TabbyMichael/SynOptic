const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const backupDir = path.join(__dirname, '../database/backups');
const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.sql')).sort().reverse();

if (files.length === 0) {
  console.error('No backup files found in', backupDir);
  process.exit(1);
}

const latestBackup = path.join(backupDir, files[0]);

const user = process.env.POSTGRES_USER || 'postgres';
const db = process.env.POSTGRES_DB || 'agroinsight_dev';
const password = process.env.POSTGRES_PASSWORD || 'postgres';

console.log(`Restoring ${db} from ${latestBackup}...`);

try {
  // Drop and recreate public schema to ensure clean restore
  execSync(`PGPASSWORD='${password}' psql -h localhost -U ${user} -d ${db} -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"`);
  execSync(`PGPASSWORD='${password}' psql -h localhost -U ${user} -d ${db} < ${latestBackup}`);
  console.log(`Restore completed successfully from: ${latestBackup}`);
} catch (error) {
  console.error('Restore failed:', error.message);
  process.exit(1);
}
