import { Metadata } from 'next';
import { AppShell } from '@/components/app-shell';
import DashboardPage from '@/components/modules/dashboard/dashboard-page';
import { generateDashboardMetadata } from '../metadata';

export async function generateMetadata(): Promise<Metadata> {
  return generateDashboardMetadata();
}

export default function DashboardRoute() {
  return (
    <AppShell>
      <DashboardPage />
    </AppShell>
  );
}
