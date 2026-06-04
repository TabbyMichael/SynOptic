export type Role = 'ADMIN' | 'FARMER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
}

export interface Farm {
  id: string;
  name: string;
  county: string;
  latitude: number;
  longitude: number;
  acres: number;
  healthScore: number;
  lastAnalysis: string | null;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

export interface WeatherCurrent {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  pressure: number;
  rainProbability: number;
  condition: string;
  feelsLike: number;
  updatedAt: string;
}

export interface ForecastDay {
  date: string;
  high: number;
  low: number;
  rainProbability: number;
  windSpeed: number;
  condition: string;
}

export interface ForestryResult {
  id: string;
  farmId: string;
  imageUrl: string;
  treeCount: number;
  canopyCoverage: number;
  density: number;
  confidenceScore: number;
  healthDistribution: {
    healthy: number;
    moderate: number;
    poor: number;
  };
  analyzedAt: string;
}

export interface AlertRule {
  id: string;
  farmId: string;
  farmName: string;
  metric: string;
  operator: '>' | '<' | '>=' | '<=' | '==';
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  createdAt: string;
}

export interface AlertEvent {
  id: string;
  ruleId: string;
  farmId: string;
  farmName: string;
  metric: string;
  value: number;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved';
  triggeredAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
}

export interface SystemMetrics {
  totalFarms: number;
  totalUsers: number;
  totalAnalyses: number;
  activeAlerts: number;
}

export interface DashboardWidget {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  trend?: 'up' | 'down' | 'neutral';
}
