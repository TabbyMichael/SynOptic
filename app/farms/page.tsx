'use client';

import { useAuth } from '@/lib/providers/auth-provider';
import { LoginForm } from '@/components/login-form';
import { AppShell } from '@/components/app-shell';
import { FarmsList } from '@/components/modules/farms/farms-list';

export default function FarmsRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <LoginForm />;

  return (
    <AppShell>
      <FarmsList />
    </AppShell>
  );
}
