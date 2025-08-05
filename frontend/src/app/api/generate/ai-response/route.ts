import { NextRequest, NextResponse } from 'next/server';
import backendApi from '@/lib/backend-api';
import { getAuthToken, createAuthHeaders } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
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
    
    const body = await request.json();
    
    // Forward the generation request to the NestJS backend
    const response = await backendApi.post('/generate/ai-response', body, {
      headers: createAuthHeaders(token),
    });
    
    return NextResponse.json(response.data);
    
  } catch (error: any) {
    console.error('AI generation API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || 'Music generation failed',
      },
      { status: error.response?.status || 500 }
    );
  }
}