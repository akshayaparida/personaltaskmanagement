import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/drizzle';
import { users } from '@/db/schema';

// Type definitions
interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

interface SignupResponse {
  message: string;
  user: Omit<typeof users.$inferSelect, 'password'>;
}

// Environment validation
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

export async function POST(req: Request): Promise<NextResponse<SignupResponse | { error: string }>> {
  try {
    const { email, password, name }: SignupRequest = await req.json();

    // Input validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required.' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format.' },
        { status: 400 }
      );
    }

    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute();

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User already exists.' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        name,
        createdAt: new Date()
      })
      .returning()
      .execute();

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser[0];

    return NextResponse.json({
      message: 'User created successfully.',
      user: userWithoutPassword
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('missing_connection_string')) {
        return NextResponse.json(
          { error: 'Database configuration error. Please check DATABASE_URL environment variable.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}