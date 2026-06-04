import type { AlertRule, AlertEvent } from '@/lib/types';
import { mockAlertRules, mockAlertEvents } from '@/lib/mock-data';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const AlertApi = {
  async getRules(): Promise<AlertRule[]> {
    await delay(300);
    return [...mockAlertRules];
  },
  async getEvents(): Promise<AlertEvent[]> {
    await delay(400);
    return [...mockAlertEvents];
  },
  async createRule(data: Omit<AlertRule, 'id' | 'createdAt'>): Promise<AlertRule> {
    await delay(500);
    return { ...data, id: `rule-${Date.now()}`, createdAt: new Date().toISOString() };
  },
};
