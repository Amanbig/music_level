import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    // Get the pathname of the request
    const path = request.nextUrl.pathname;

    // Define public paths that don't require authentication
    const isPublicPath = [
        '/',
        '/auth/login',
        '/auth/signup',
        '/auth/callback',
        '/about',
    ].includes(path);

    // Check if the path is for the API
    const isApiPath = path.startsWith('/api/');

    // Get the session token from cookies
    const hasSession = request.cookies.has('access_token') && request.cookies.has('refresh_token');
    console.log('Middleware - Path:', path);
    console.log('Middleware - Has session:', hasSession);

    // If the path is public or an API route, allow access
    if (isPublicPath || isApiPath) {
        console.log('Middleware - Allowing access to public path:', path);
        return NextResponse.next();
    }

    // If there's no session and the path is not public, redirect to login
    if (!hasSession) {
        console.log('Middleware - No session found, redirecting to login');
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Otherwise, allow access to protected routes
    console.log('Middleware - Session found, allowing access to protected route:', path);
    return NextResponse.next();
}

// See "Matching Paths" below to learn more
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