import { db } from '../drizzle/config';
import { 
  users, farms, analyses, weatherSnapshots, 
  alertRules, alertEvents, auditLogs 
} from '../drizzle/schema';
import { 
  UserFactory, FarmFactory, AnalysisFactory, 
  WeatherSnapshotFactory, AlertRuleFactory, 
  AlertEventFactory, AuditLogFactory 
} from '../database/factories';

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Users (10)
  const newUsers = UserFactory.createMany(10);
  const createdUsers = await db.insert(users).values(newUsers).returning();
  console.log(`✅ Created ${createdUsers.length} users`);

  // 2. Farms (50) - Distribute among users
  const newFarms = Array.from({ length: 50 }).map(() => {
    const owner = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    return FarmFactory.create(owner.id);
  });
  const createdFarms = await db.insert(farms).values(newFarms).returning();
  console.log(`✅ Created ${createdFarms.length} farms`);

  // 3. Weather Snapshots (500) - For random farms
  const newWeather = Array.from({ length: 500 }).map(() => {
    const farm = createdFarms[Math.floor(Math.random() * createdFarms.length)];
    // Random date in the last 30 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    return WeatherSnapshotFactory.create(farm.id, date);
  });
  const createdWeather = await db.insert(weatherSnapshots).values(newWeather).returning();
  console.log(`✅ Created ${createdWeather.length} weather snapshots`);

  // 4. Analyses (100) - For random farms
  const newAnalyses = Array.from({ length: 100 }).map(() => {
    const farm = createdFarms[Math.floor(Math.random() * createdFarms.length)];
    return AnalysisFactory.create(farm.id);
  });
  const createdAnalyses = await db.insert(analyses).values(newAnalyses).returning();
  console.log(`✅ Created ${createdAnalyses.length} analyses`);

  // 5. Alert Rules (50) - For random farms
  const newRules = Array.from({ length: 50 }).map(() => {
    const farm = createdFarms[Math.floor(Math.random() * createdFarms.length)];
    return AlertRuleFactory.create(farm.id);
  });
  const createdRules = await db.insert(alertRules).values(newRules).returning();
  console.log(`✅ Created ${createdRules.length} alert rules`);

  // 6. Alert Events (200) - For random rules
  const newEvents = Array.from({ length: 200 }).map(() => {
    const rule = createdRules[Math.floor(Math.random() * createdRules.length)];
    return AlertEventFactory.create(rule.id);
  });
  const createdEvents = await db.insert(alertEvents).values(newEvents).returning();
  console.log(`✅ Created ${createdEvents.length} alert events`);

  // 7. Audit Logs (500) - For random users and actions
  const actions = ['USER_LOGIN', 'FARM_CREATED', 'ANALYSIS_STARTED', 'ALERT_TRIGGERED'];
  const newAudit = Array.from({ length: 500 }).map(() => {
    const user = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    return AuditLogFactory.create(user.id, action);
  });
  const createdAudit = await db.insert(auditLogs).values(newAudit).returning();
  console.log(`✅ Created ${createdAudit.length} audit logs`);

  console.log('✨ Seeding completed!');
}

main().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
