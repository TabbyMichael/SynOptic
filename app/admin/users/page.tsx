'use client';

import { useAuth } from '@/lib/providers/auth-provider';
import { LoginForm } from '@/components/login-form';
import { AppShell } from '@/components/app-shell';
import { AdminUsers } from '@/components/modules/admin/admin-pages';

export default function AdminUsersRoute() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <LoginForm />;
  if (user?.role !== 'ADMIN') return <LoginForm />;

  return (
    <AppShell>
      <AdminUsers />
    </AppShell>
  );
}
