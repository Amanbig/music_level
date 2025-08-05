import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import backendApi from '@/lib/backend-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward the signup request to the NestJS backend
    const response = await backendApi.post('/auth/signup', body);
    
    const { token, user, ...rest } = response.data;
    
    if (token) {
      // Set HTTP-only cookie for security
      const cookieStore = await cookies();
      cookieStore.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      });
    }
    
    // Return user data without the token (for security)
    return NextResponse.json({
      success: true,
      user,
      ...rest,
    });
    
  } catch (error: any) {
    console.error('Signup API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || 'Signup failed',
      },
      { status: error.response?.status || 500 }
    );
  }
}