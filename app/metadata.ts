import type { Metadata } from 'next';

const SITE_NAME = 'AgroInsight AI';
const TAGLINE = 'Weather Intelligence & Forestry Analytics';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://agroinsight.example';
const TWITTER_HANDLE = process.env.NEXT_PUBLIC_TWITTER ?? '@AgroInsightAI';

export const SITE = {
  name: SITE_NAME,
  tagline: TAGLINE,
  url: SITE_URL,
  twitter: TWITTER_HANDLE,
};

export const DEFAULT_METADATA: Metadata = {
  title: {
    default: SITE_NAME,
    template: '%s | ' + SITE_NAME,
  },
  description:
    'Monitor weather conditions, analyze farm imagery, track forestry insights, and receive intelligent agricultural alerts powered by WeatherAI.',
  keywords: [
    'agriculture',
    'weather',
    'forestry',
    'AI',
    'agtech',
    'farm monitoring',
    'analytics',
    'WeatherAI',
  ],
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  authors: [{ name: 'AgroInsight AI', url: SITE_URL }],
  creator: 'AgroInsight AI Team',
  publisher: 'AgroInsight AI',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: SITE_NAME,
    description:
      'Monitor weather conditions, analyze farm imagery, track forestry insights, and receive intelligent agricultural alerts powered by WeatherAI.',
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: SITE_NAME,
        type: 'image/png',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description:
      'Monitor weather conditions, analyze farm imagery, track forestry insights, and receive intelligent agricultural alerts powered by WeatherAI.',
    creator: TWITTER_HANDLE,
    images: ['/twitter-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/icon.png',
    apple: '/apple-icon.png',
    other: [{ rel: 'manifest', url: '/manifest.json' }],
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export function createPageMetadata({
  title,
  description,
  image,
  path,
  keywords = [],
}: {
  title: string;
  description?: string;
  image?: string;
  path?: string;
  keywords?: string[];
}): Metadata {
  const pageTitle = `${title} | ${SITE_NAME}`;
  const pageDescription = description ?? DEFAULT_METADATA.description;
  const absoluteUrl = path ? `${SITE_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}` : SITE_URL;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: Array.from(new Set([...(DEFAULT_METADATA.keywords as string[]), ...keywords])),
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: absoluteUrl,
      siteName: SITE_NAME,
      images: [{ url: image ?? '/opengraph-image.png', width: 1200, height: 630, alt: pageTitle }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [image ?? '/twitter-image.png'],
    },
  };
}

export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL.replace(/\/$/, '')}/icon.png`,
  sameAs: [],
  description: DEFAULT_METADATA.description,
};

export const WEBAPP_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE_NAME,
  url: SITE_URL,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: DEFAULT_METADATA.description,
  author: {
    '@type': 'Organization',
    name: SITE_NAME,
  },
};

export default DEFAULT_METADATA;

// Page-level generateMetadata() helpers — use these in page components to keep pages consistent.
export async function generateDashboardMetadata(): Promise<Metadata> {
  return createPageMetadata({
    title: 'Dashboard',
    description: 'Overview of your farms, weather summaries, forestry analyses, and recent alerts.',
    path: '/dashboard',
    keywords: ['dashboard', 'overview', 'metrics'],
  });
}

export async function generateWeatherMetadata(): Promise<Metadata> {
  return createPageMetadata({
    title: 'Weather Analytics',
    description: 'Current conditions, hourly and multi-day forecasts powered by WeatherAI.',
    path: '/weather',
    keywords: ['weather', 'forecast', 'current conditions'],
  });
}

export async function generateForestryMetadata(): Promise<Metadata> {
  return createPageMetadata({
    title: 'Forestry Analysis',
    description: 'Upload aerial or drone imagery to count trees, assess canopy health, and get agronomic recommendations.',
    path: '/forestry',
    keywords: ['forestry', 'tree count', 'canopy', 'analysis'],
  });
}

export async function generateAlertsMetadata(): Promise<Metadata> {
  return createPageMetadata({
    title: 'Alerts',
    description: 'Create and manage weather alerts for your farms with simple rules and notifications.',
    path: '/alerts',
    keywords: ['alerts', 'weather alerts', 'notifications'],
  });
}

export async function generateAnalyticsMetadata(): Promise<Metadata> {
  return createPageMetadata({
    title: 'Analytics',
    description: 'Usage, quota, and analytical insights about your farms and API usage.',
    path: '/analytics',
    keywords: ['analytics', 'usage', 'quota'],
  });
}

export async function generateSettingsMetadata(): Promise<Metadata> {
  return createPageMetadata({
    title: 'Settings',
    description: 'Application settings, API key management, and account preferences.',
    path: '/settings',
    keywords: ['settings', 'preferences', 'api keys'],
  });
}

export async function generateAuthMetadata(pageTitle = 'Sign in'): Promise<Metadata> {
  return createPageMetadata({
    title: pageTitle,
    description: 'Sign in to AgroInsight AI to manage farms, view weather, and run forestry analyses.',
    path: '/auth',
    keywords: ['login', 'authentication', 'signin'],
  });
}
