import pino from 'pino';

// Next.js 15 workers can crash with pino-pretty transport.
// We'll use a standard logger in development and only use pretty printing if we're not in a worker context
// or just keep it simple to ensure stability.
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: {
    env: process.env.NODE_ENV,
  },
});

export type Logger = typeof logger;
