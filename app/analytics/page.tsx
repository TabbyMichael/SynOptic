'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/providers/auth-provider';
import { AppShell } from '@/components/app-shell';
import { AnalyticsPage } from '@/components/modules/analytics/analytics-page';

export default function AnalyticsRoute() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppShell>
      <AnalyticsPage />
    </AppShell>
  );
}
