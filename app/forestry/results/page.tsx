'use client';

import { useAuth } from '@/lib/providers/auth-provider';
import { LoginForm } from '@/components/login-form';
import { AppShell } from '@/components/app-shell';
import { ForestryResults } from '@/components/modules/forestry/forestry-results';

export default function ForestryResultsRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <LoginForm />;

  return (
    <AppShell>
      <ForestryResults />
    </AppShell>
  );
}
