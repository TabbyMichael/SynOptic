'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/shared';
import { CreateFarmForm } from '@/components/modules/farms/create-farm-form';

export default function CreateFarmPage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      router.push('/farms');
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader title="Create Farm" description="Add a new farm to your portfolio" />
        <div className="max-w-2xl">
          <CreateFarmForm open={open} onOpenChange={handleOpenChange} />
        </div>
      </div>
    </AppShell>
  );
}
