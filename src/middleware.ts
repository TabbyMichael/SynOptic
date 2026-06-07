import { auth } from './infrastructure/auth/auth.config';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isApiRoute = req.nextUrl.pathname.startsWith('/api');
  const isAuthRoute = req.nextUrl.pathname.startsWith('/auth');
  const isAuthInternal = req.nextUrl.pathname.startsWith('/api/auth');
  const isPublicAsset = req.nextUrl.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|json|txt|xml)$/);

  // 1. Allow public assets and sitemaps/robots
  if (isPublicAsset || req.nextUrl.pathname === '/robots.txt' || req.nextUrl.pathname === '/sitemap.xml') {
    return NextResponse.next();
  }

  // 2. Allow internal auth routes
  if (isAuthInternal) {
    return NextResponse.next();
  }

  // 2. If user is on an Auth Page (login/signup)
  if (isAuthRoute) {
    if (isLoggedIn) {
      // If already logged in, send them straight to the dashboard
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    }
    return NextResponse.next();
  }

  // 3. Root Page Protection: Always force login check
  if (req.nextUrl.pathname === '/') {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    }
    return NextResponse.redirect(new URL('/auth/login', req.nextUrl));
  }

  // 4. Global Protection: If not logged in and trying to access anything else
  if (!isLoggedIn) {
    if (isApiRoute) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/auth/login', req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
