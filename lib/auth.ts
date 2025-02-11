import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const AUTH_COOKIE_NAME = 'auth_token';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

interface SessionUser {
    id: string;
    email: string;
    // Add any other user properties you need
}

interface Session {
    user: SessionUser;
    expires: Date;
}

/**
 * Sets the authentication token as an HTTP-only cookie
 * @param token JWT token to be stored in the cookie
 */
export async function setAuthToken(token: string): Promise<void> {
    const cookieStore = await cookies();
    
    cookieStore.set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: COOKIE_MAX_AGE,
        path: '/'
    });
}

/**
 * Retrieves the authentication token from cookies
 * @returns The stored JWT token or null if not found
 */
export async function getAuthToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null;
}

/**
 * Removes the authentication token cookie
 */
export async function removeAuthToken(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);
}

/**
 * Verifies and decodes the JWT token
 * @param token JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export function verifyToken<T>(token: string): T | null {
    try {
        return jwt.verify(token, process.env.JWT_SECRET!) as T;
    } catch (error) {
        return null;
    }
}

/**
 * Creates a new JWT token
 * @param payload Data to encode in the token
 * @returns Signed JWT token
 */
export function createToken<T extends object>(payload: T): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: COOKIE_MAX_AGE
    });
}

/**
 * Gets the current session information from the auth token
 * @returns Session object containing user information and expiration, or null if no valid session exists
 */
export async function getSession(): Promise<Session | null> {
    const token = await getAuthToken();
    if (!token) return null;

    const payload = verifyToken<{ user: SessionUser; exp: number }>(token);
    if (!payload) return null;

    return {
        user: payload.user,
        expires: new Date(payload.exp * 1000)
    };
}