'use client';

import { useAuth } from '@/lib/providers/auth-provider';
import { LoginForm } from '@/components/login-form';
import { AppShell } from '@/components/app-shell';
import WeatherPage from '@/components/modules/weather/weather-page';

export default function WeatherRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <LoginForm />;

  return (
    <AppShell>
      <WeatherPage />
    </AppShell>
  );
}
