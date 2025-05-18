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
        '/about',
    ].includes(path);

    // Check if the path is for the API
    const isApiPath = path.startsWith('/api/');

    // Get the token from the cookies
    const token = request.cookies.get('appwrite-session')?.value || '';

    // If the path is public or an API route, allow access
    if (isPublicPath || isApiPath) {
        return NextResponse.next();
    }

    // If there's no token and the path is not public, redirect to login
    if (!token) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Otherwise, allow access to protected routes
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