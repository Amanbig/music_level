import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import backendApi from '@/lib/backend-api';
import { getAuthToken, createAuthHeaders } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    
    if (token) {
      // Forward the logout request to the NestJS backend
      try {
        await backendApi.post('/auth/logout', {}, {
          headers: createAuthHeaders(token),
        });
      } catch (error) {
        // Continue with logout even if backend call fails
        console.warn('Backend logout failed:', error);
      }
    }
    
    // Clear the HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.delete('token');
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
    
  } catch (error: any) {
    console.error('Logout API error:', error);
    
    // Still clear the cookie even if there's an error
    const cookieStore = await cookies();
    cookieStore.delete('token');
    
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || 'Logout failed',
      },
      { status: error.response?.status || 500 }
    );
  }
}