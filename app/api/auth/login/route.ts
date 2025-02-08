import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { db } from '@/lib/drizzle';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sign } from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and Password are required.' }, 
        { status: 400 }
      );
    }

    // Use Drizzle query to find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password.' }, 
        { status: 400 }
      );
    }

    const isValid = await compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password.' }, 
        { status: 400 }
      );
    }

    // Use JWT secret from environment variable
    const token = sign(
      { userId: user.id }, 
      process.env.JWT_SECRET!, 
      { expiresIn: '1h' }
    );

    return NextResponse.json({ 
      message: 'Login successful.', 
      token 
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}