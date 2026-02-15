import { NextRequest, NextResponse } from 'next/server';
import { validatePassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const isValid = validatePassword(password);

    if (isValid) {
      const response = NextResponse.json({ success: true });
      // Set a simple session cookie (in production, use JWT or better session management)
      response.cookies.set('auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24 hours
      });
      return response;
    } else {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error during authentication:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('auth');
  return response;
}