import Redis from 'ioredis';
import { logger } from '../logger/logger.service';

const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redisClient.on('error', (err) => logger.error({ err }, 'Redis connection error'));
redisClient.on('connect', () => logger.info('Redis connected'));

export { redisClient };
