'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/providers/auth-provider';
import { AppShell } from '@/components/app-shell';
import { FarmDetails } from '@/components/modules/farms/farm-details';

export default function FarmDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
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
      <FarmDetails farmId={id} />
    </AppShell>
  );
}
