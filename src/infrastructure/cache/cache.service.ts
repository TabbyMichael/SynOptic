import { Pool } from 'pg';
import { CacheManager } from './CacheManager';
import { PostgresCacheProvider } from './PostgresCacheProvider';
import CacheMetrics from './CacheMetrics';
import RequestCoalescingService from './RequestCoalescingService';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const provider = new PostgresCacheProvider(pool);
const metrics = new CacheMetrics();
const coalescer = new RequestCoalescingService();

export const cacheManager = new CacheManager({
  provider,
  metrics,
  coalescer,
});

export default cacheManager;
