export const APP_NAME = 'AgroInsight AI';

export const NAV_ITEMS = {
  FARMER: [
    { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Farms', href: '/farms', icon: 'Warehouse' },
    { label: 'Forestry', href: '/forestry', icon: 'TreePine' },
    { label: 'Weather', href: '/weather', icon: 'Cloud' },
    { label: 'Alerts', href: '/alerts', icon: 'Bell' },
    { label: 'Analytics', href: '/analytics', icon: 'BarChart3' },
  ],
  ADMIN: [
    { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Farms', href: '/farms', icon: 'Warehouse' },
    { label: 'Forestry', href: '/forestry', icon: 'TreePine' },
    { label: 'Weather', href: '/weather', icon: 'Cloud' },
    { label: 'Alerts', href: '/alerts', icon: 'Bell' },
    { label: 'Analytics', href: '/analytics', icon: 'BarChart3' },
    { label: 'Users', href: '/admin/users', icon: 'Users' },
    { label: 'Audit Logs', href: '/admin/audit-logs', icon: 'ScrollText' },
    { label: 'System Metrics', href: '/admin/system-metrics', icon: 'Activity' },
  ],
} as const;

export const FARM_STATUS_COLORS = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
} as const;

export const SEVERITY_COLORS = {
  low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
} as const;

export const ALERT_STATUS_COLORS = {
  active: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  acknowledged: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  resolved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
} as const;

export const METRIC_OPTIONS = [
  'Temperature',
  'Humidity',
  'Wind Speed',
  'Rain Probability',
  'Health Score',
  'Canopy Coverage',
] as const;

export const OPERATOR_OPTIONS = [
  { label: 'Greater than', value: '>' },
  { label: 'Less than', value: '<' },
  { label: 'Greater or equal', value: '>=' },
  { label: 'Less or equal', value: '<=' },
  { label: 'Equal to', value: '==' },
] as const;

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
