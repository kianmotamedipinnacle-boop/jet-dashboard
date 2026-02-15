import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if user is authenticated
  const authCookie = request.cookies.get('auth');
  const isAuthenticated = authCookie?.value === 'authenticated';

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/api/auth'];
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));

  // API paths (except auth) require authentication or password in request
  const isApiPath = request.nextUrl.pathname.startsWith('/api/') && !request.nextUrl.pathname.startsWith('/api/auth');

  if (!isAuthenticated) {
    if (isApiPath) {
      // Allow API access but they need to include password in request
      return NextResponse.next();
    } else if (!isPublicPath) {
      // Redirect to login page
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

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