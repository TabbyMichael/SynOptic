import { useQuery } from '@tanstack/react-query';

export interface DashboardData {
  weather: any;
  forecast: any;
  usage: any;
  alerts: any[];
  timestamp: string;
}

export function useDashboardData() {
  return useQuery<DashboardData>({
    queryKey: ['dashboard-data'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
