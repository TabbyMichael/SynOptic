import type { User, AuditLog, SystemMetrics } from '@/lib/types';
import { mockUsers, mockAuditLogs, mockSystemMetrics } from '@/lib/mock-data';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const AdminApi = {
  async getUsers(): Promise<User[]> {
    await delay(300);
    return [...mockUsers];
  },
  async getAuditLogs(): Promise<AuditLog[]> {
    await delay(400);
    return [...mockAuditLogs];
  },
  async getSystemMetrics(): Promise<SystemMetrics> {
    await delay(200);
    return { ...mockSystemMetrics };
  },
};
