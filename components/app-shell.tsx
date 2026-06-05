'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/providers/auth-provider';
import { AppSidebar } from '@/components/shared/app-sidebar';
import { AppHeader } from '@/components/shared/app-header';
import { cn } from '@/lib/utils';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  console.log('AppShell mounted');

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <div
        className={cn(
          'transition-all duration-300',
          collapsed ? 'ml-16' : 'ml-64',
          'max-md:ml-0'
        )}
      >
        <AppHeader onMenuClick={() => setMobileOpen(true)} />
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
