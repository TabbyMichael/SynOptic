'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/providers/auth-provider';
import { AppShell } from '@/components/app-shell';
import { FarmsList } from '@/components/modules/farms/farms-list';

export default function FarmsRoute() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <AppShell>
      <FarmsList />
    </AppShell>
  );
}
