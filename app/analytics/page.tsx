'use client';

import { useAuth } from '@/lib/providers/auth-provider';
import { LoginForm } from '@/components/login-form';
import { AppShell } from '@/components/app-shell';
import { AnalyticsPage } from '@/components/modules/analytics/analytics-page';

export default function AnalyticsRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <LoginForm />;

  return (
    <AppShell>
      <AnalyticsPage />
    </AppShell>
  );
}
