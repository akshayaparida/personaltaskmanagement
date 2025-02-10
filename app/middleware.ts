import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

const PUBLIC_PATHS = ['/login', '/signup', '/api/auth/login', '/api/auth/signup', '/'] as const;
const API_PREFIX = '/api/';
const DEFAULT_REDIRECT = '/dashboard';
const LOGIN_PATH = '/login';

export function middleware(request: NextRequest) {
    try {
        const { pathname } = request.nextUrl;
        const token = request.cookies.get('auth_token')?.value;

        // Handle public paths
        if (PUBLIC_PATHS.includes(pathname as typeof PUBLIC_PATHS[number])) {
            if (token) {
                const verified = verifyToken(token);
                if (verified) {
                    // Ensure the dashboard page exists at /app/dashboard/page.tsx
                    return NextResponse.redirect(new URL(DEFAULT_REDIRECT, request.url));
                }
            }
            return NextResponse.next();
        }

        // Handle protected routes
        if (!token) {
            return pathname.startsWith(API_PREFIX)
                ? NextResponse.json({ error: 'Authentication required' }, { status: 401 })
                : NextResponse.redirect(new URL(LOGIN_PATH, request.url));
        }

        const verified = verifyToken(token);
        if (!verified) {
            const response = NextResponse.redirect(new URL(LOGIN_PATH, request.url));
            response.cookies.delete('auth_token');
            return response;
        }

        return NextResponse.next();
    } catch (error) {
        // Log the error but don't expose it to the client
        console.error('Middleware error:', error);
        return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|public/).*)'
    ]
};