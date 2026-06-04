import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/lib/providers/theme-provider';
import { AuthProvider } from '@/lib/providers/auth-provider';
import { QueryProvider } from '@/lib/providers/query-provider';
import { Toaster } from '@/components/ui/sonner';
import { DEFAULT_METADATA, ORGANIZATION_SCHEMA } from './metadata';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = DEFAULT_METADATA;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              {children}
              <Toaster />
              {/* Structured data: Organization JSON-LD. For larger schemas, move this to `app/head.tsx`. */}
              <script
                id="organization-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }}
              />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
