import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import backendApi from '@/lib/backend-api';
import { getAuthToken, createAuthHeaders } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    console.log('Auth/me API route - Token found:', !!token);
    console.log('Auth/me API route - Token value:', token ? `${token.substring(0, 20)}...` : 'null');
    
    if (!token) {
      console.log('Auth/me API route - No token found, returning 401');
      return NextResponse.json(
        {
          success: false,
          message: 'No authentication token found',
        },
        { status: 401 }
      );
    }
    
    console.log('Auth/me API route - Forwarding request to backend with token');
    // Forward the request to the NestJS backend
    const response = await backendApi.get('/auth/me', {
      headers: createAuthHeaders(token),
    });
    
    // console.log('Auth/me API route - Backend response:', response.data);
    return NextResponse.json(response.data);
    
  } catch (error: any) {
    console.error('Get current user API error:', error);
    
    if (error.response?.status === 401) {
      // Token is invalid, clear the cookie
      const cookieStore = await cookies();
      cookieStore.delete('token');
    }
    
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || 'Failed to get user information',
      },
      { status: error.response?.status || 500 }
    );
  }
}