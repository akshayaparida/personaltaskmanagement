import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

const PUBLIC_PATHS = ['/login', '/signup', '/api/auth/login', '/api/auth/signup', '/'];
const API_PREFIX = '/api/';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('auth_token')?.value;

    // Allow public paths
    if (PUBLIC_PATHS.includes(pathname)) {
        if (token) {
            try {
                verifyToken(token);
                return NextResponse.redirect(new URL('/dashboard', request.url));
            } catch {
                // Invalid token, continue to public path
            }
        }
        return NextResponse.next();
    }

    // Handle protected routes
    if (!token) {
        return pathname.startsWith(API_PREFIX)
            ? NextResponse.json({ error: 'Authentication required' }, { status: 401 })
            : NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        verifyToken(token);
        return NextResponse.next();
    } catch {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('auth_token');
        return response;
    }
}

export const config = {
    matcher: ['/((?!_next/static|favicon.ico).*)']
};