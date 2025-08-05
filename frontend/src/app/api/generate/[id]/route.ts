import { NextRequest, NextResponse } from 'next/server';
import backendApi from '@/lib/backend-api';
import { getAuthToken, createAuthHeaders } from '@/lib/auth-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    
    const { id } = await params;
    
    // Forward the request to the NestJS backend
    const response = await backendApi.get(`/generate/${id}`, {
      headers: createAuthHeaders(token),
    });
    
    return NextResponse.json(response.data);
    
  } catch (error: any) {
    console.error('Get generation API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || 'Failed to get generation',
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    
    const { id } = await params;
    const body = await request.json();
    
    // Forward the delete request to the NestJS backend
    const response = await backendApi.delete(`/generate/${id}`, {
      headers: createAuthHeaders(token),
      data: body,
    });
    
    return NextResponse.json(response.data);
    
  } catch (error: any) {
    console.error('Delete generation API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || 'Failed to delete generation',
      },
      { status: error.response?.status || 500 }
    );
  }
}