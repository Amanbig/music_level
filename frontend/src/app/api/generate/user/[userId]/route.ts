import { NextRequest, NextResponse } from 'next/server';
import backendApi from '@/lib/backend-api';
import { getAuthToken, createAuthHeaders } from '@/lib/auth-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const token = getAuthToken(request);
    
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication required',
        },
        { status: 401 }
      );
    }
    
    const { userId } = await params;
    
    // Forward the request to the NestJS backend
    const response = await backendApi.get(`/generate/user/${userId}`, {
      headers: createAuthHeaders(token),
    });
    
    return NextResponse.json(response.data);
    
  } catch (error: any) {
    console.error('Get user generations API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || 'Failed to get user generations',
      },
      { status: error.response?.status || 500 }
    );
  }
}