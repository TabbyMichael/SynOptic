import type { User, AuditLog, SystemMetrics } from '@/lib/types';

export const mockUsers: User[] = [
  {
    id: 'usr-admin-1',
    email: 'admin@agroinsight.ai',
    name: 'Sarah Mwangi',
    role: 'ADMIN',
    createdAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 'usr-farmer-1',
    email: 'farmer@agroinsight.ai',
    name: 'James Ochieng',
    role: 'FARMER',
    createdAt: '2024-03-22T10:30:00Z',
  },
  {
    id: 'usr-3',
    email: 'w.kiprop@agroinsight.ai',
    name: 'Winfred Kiprop',
    role: 'FARMER',
    createdAt: '2024-05-10T09:00:00Z',
  },
  {
    id: 'usr-4',
    email: 'd.njoroge@agroinsight.ai',
    name: 'David Njoroge',
    role: 'FARMER',
    createdAt: '2024-07-18T14:00:00Z',
  },
  {
    id: 'usr-5',
    email: 'a.wekesa@agroinsight.ai',
    name: 'Alice Wekesa',
    role: 'ADMIN',
    createdAt: '2024-09-01T08:00:00Z',
  },
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'usr-admin-1',
    userName: 'Sarah Mwangi',
    action: 'CREATE',
    entity: 'Farm',
    entityId: 'farm-8',
    timestamp: '2026-06-04T07:30:00Z',
  },
  {
    id: 'log-2',
    userId: 'usr-farmer-1',
    userName: 'James Ochieng',
    action: 'UPDATE',
    entity: 'AlertRule',
    entityId: 'rule-1',
    timestamp: '2026-06-03T15:00:00Z',
  },
  {
    id: 'log-3',
    userId: 'usr-admin-1',
    userName: 'Sarah Mwangi',
    action: 'DELETE',
    entity: 'Farm',
    entityId: 'farm-9',
    timestamp: '2026-06-02T10:00:00Z',
  },
  {
    id: 'log-4',
    userId: 'usr-3',
    userName: 'Winfred Kiprop',
    action: 'UPLOAD',
    entity: 'ForestryImage',
    entityId: 'fr-2',
    timestamp: '2026-06-01T11:30:00Z',
  },
  {
    id: 'log-5',
    userId: 'usr-admin-1',
    userName: 'Sarah Mwangi',
    action: 'CREATE',
    entity: 'User',
    entityId: 'usr-5',
    timestamp: '2026-05-30T09:00:00Z',
  },
];

export const mockSystemMetrics: SystemMetrics = {
  totalFarms: 8,
  totalUsers: 5,
  totalAnalyses: 47,
  activeAlerts: 2,
};
