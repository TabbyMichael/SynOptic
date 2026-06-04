'use client';

import { useAuth } from '@/lib/providers/auth-provider';
import { LoginForm } from '@/components/login-form';
import { AppShell } from '@/components/app-shell';
import { AlertRulesPage } from '@/components/modules/alerts/alert-rules-page';

export default function AlertsRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <LoginForm />;

  return (
    <AppShell>
      <AlertRulesPage />
    </AppShell>
  );
}
