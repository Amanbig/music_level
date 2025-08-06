import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import backendApi from '@/lib/backend-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward the login request to the NestJS backend
    const response = await backendApi.post('/auth/login', body);
    
    const { accessToken, user, ...rest } = response.data;
    console.log('Login API route - Backend response:', { hasAccessToken: !!accessToken, hasUser: !!user, ...rest });
    
    if (accessToken) {
      // Set HTTP-only cookie for security
      const cookieStore = await cookies();
      cookieStore.set('token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      });
      console.log('Login API route - Token cookie set successfully');
    } else {
      console.log('Login API route - No token in backend response');
    }
    
    // Return user data without the token (for security)
    return NextResponse.json({
      success: true,
      user,
      ...rest,
    });
    
  } catch (error: unknown) {
    console.error('Login API error:', error);
    
    const axiosError = error as any;
    return NextResponse.json(
      {
        success: false,
        message: axiosError.response?.data?.message || 'Login failed',
      },
      { status: axiosError.response?.status || 500 }
    );
  }
}