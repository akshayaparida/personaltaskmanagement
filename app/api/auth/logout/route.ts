import { NextResponse } from 'next/server';
import { db } from '@/lib/drizzle';
import { sessions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'No authentication token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    // Clear the session from database
    await db
      .delete(sessions)
      .where(eq(sessions.token, token));

    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );

    // Set cookie expiration directly in the response
    response.cookies.set({
      name: 'auth-token',
      value: '',
      expires: new Date(0),
      path: '/',
      secure: true,
      httpOnly: true,
      sameSite: 'strict'
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Error during logout' },
      { status: 500 }
    );
  }
}