// types/session.ts

/**
 * Represents a user session after authentication
 */
export interface Session {
    // User identification
    userId: string;
    email: string;
    name?: string;
    // JWT specific fields
    exp?: number;  // Unix timestamp for when the token expires
    iat?: number;  // Unix timestamp for when the token was issued
}

/**
 * Represents the payload structure for JWT tokens
 */
export interface TokenPayload {
    userId: string;
    email: string;
    name?: string;
}

/**
 * Represents the response structure when creating/validating a session
 */
export interface SessionResponse {
    user: {
        id: string;
        email: string;
        name?: string;
    };
    token: string;
}

/**
 * Represents the decoded JWT token structure
 */
export interface DecodedToken extends TokenPayload {
    exp: number;  // Expiration time
    iat: number;  // Issued at time
}

/**
 * Represents the session error types
 */
export type SessionError = {
    message: string;
    code: 'UNAUTHORIZED' | 'INVALID_TOKEN' | 'EXPIRED_TOKEN' | 'SERVER_ERROR';
};

/**
 * Represents the possible session status
 */
export type SessionStatus = {
    isAuthenticated: boolean;
    isLoading: boolean;
    error?: SessionError;
};

/**
 * Represents the session validation result
 */
export interface SessionValidationResult {
    isValid: boolean;
    session?: Session;
    error?: SessionError;
}

/**
 * Represents the session creation parameters
 */
export interface CreateSessionParams {
    userId: string;
    email: string;
    name?: string;
}

/**
 * Represents the refresh token structure
 */
export interface RefreshToken {
    token: string;
    userId: string;
    expiresAt: Date;
}

/**
 * Type guard to check if an object is a valid Session
 */
export function isSession(obj: any): obj is Session {
    return (
        obj &&
        typeof obj === 'object' &&
        typeof obj.userId === 'string' &&
        typeof obj.email === 'string'
    );
}

/**
 * Type guard to check if an object is a valid SessionError
 */
export function isSessionError(obj: any): obj is SessionError {
    return (
        obj &&
        typeof obj === 'object' &&
        typeof obj.message === 'string' &&
        typeof obj.code === 'string' &&
        ['UNAUTHORIZED', 'INVALID_TOKEN', 'EXPIRED_TOKEN', 'SERVER_ERROR'].includes(obj.code)
    );
}

/**
 * Constants for session-related values
 */
export const SESSION_CONSTANTS = {
    COOKIE_NAME: 'auth_token',
    MAX_AGE: 7 * 24 * 60 * 60, // 7 days in seconds
    REFRESH_TOKEN_EXPIRY: 30 * 24 * 60 * 60, // 30 days in seconds
} as const;