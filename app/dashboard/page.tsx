'use client';

import { useAuth } from '@/lib/providers/auth-provider';
import { LoginForm } from '@/components/login-form';
import { AppShell } from '@/components/app-shell';
import DashboardPage from '@/components/modules/dashboard/dashboard-page';

export default function DashboardRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <LoginForm />;

  return (
    <AppShell>
      <DashboardPage />
    </AppShell>
  );
}
