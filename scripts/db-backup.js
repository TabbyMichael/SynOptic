const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const backupDir = path.join(__dirname, '../database/backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFile = path.join(backupDir, `backup-${timestamp}.sql`);

const user = process.env.POSTGRES_USER || 'postgres';
const db = process.env.POSTGRES_DB || 'agroinsight_dev';
const password = process.env.POSTGRES_PASSWORD || 'postgres';

console.log(`Starting backup of ${db} to ${backupFile}...`);

try {
  // Use PGPASSWORD to avoid interactive prompt
  execSync(`PGPASSWORD='${password}' pg_dump -h localhost -U ${user} -d ${db} -F p > ${backupFile}`);
  console.log(`Backup completed successfully: ${backupFile}`);
} catch (error) {
  console.error('Backup failed:', error.message);
  process.exit(1);
}
