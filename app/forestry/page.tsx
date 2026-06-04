'use client';

import { useAuth } from '@/lib/providers/auth-provider';
import { LoginForm } from '@/components/login-form';
import { AppShell } from '@/components/app-shell';
import { ForestryUpload } from '@/components/modules/forestry/forestry-upload';

export default function ForestryRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <LoginForm />;

  return (
    <AppShell>
      <ForestryUpload />
    </AppShell>
  );
}
