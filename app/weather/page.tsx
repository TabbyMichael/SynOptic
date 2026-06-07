import { Metadata } from 'next';
import { AppShell } from '@/components/app-shell';
import WeatherPage from '@/components/modules/weather/weather-page';
import { generateWeatherMetadata } from '../metadata';

export async function generateMetadata(): Promise<Metadata> {
  return generateWeatherMetadata();
}

export default function WeatherRoute() {
  return (
    <AppShell>
      <WeatherPage />
    </AppShell>
  );
}
