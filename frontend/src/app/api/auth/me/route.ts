import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import backendApi from '@/lib/backend-api';
import { getAuthToken, createAuthHeaders } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'No authentication token found',
        },
        { status: 401 }
      );
    }
    
    // Forward the request to the NestJS backend
    const response = await backendApi.get('/auth/me', {
      headers: createAuthHeaders(token),
    });
    
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