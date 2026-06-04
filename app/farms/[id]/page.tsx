'use client';

import { use } from 'react';
import { useAuth } from '@/lib/providers/auth-provider';
import { LoginForm } from '@/components/login-form';
import { AppShell } from '@/components/app-shell';
import { FarmDetails } from '@/components/modules/farms/farm-details';

export default function FarmDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <LoginForm />;

  return (
    <AppShell>
      <FarmDetails farmId={id} />
    </AppShell>
  );
}
