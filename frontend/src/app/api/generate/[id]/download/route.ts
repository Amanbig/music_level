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
    
    // Forward the download request to the NestJS backend
    const response = await backendApi.get(`/generate/${id}/download`, {
      headers: createAuthHeaders(token),
      responseType: 'arraybuffer',
    });
    
    // Return the MIDI file as a blob
    return new NextResponse(response.data, {
      status: 200,
      headers: {
        'Content-Type': 'audio/midi',
        'Content-Disposition': `attachment; filename="music-${id}.mid"`,
      },
    });
    
  } catch (error: any) {
    console.error('Download generation API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || 'Failed to download generation',
      },
      { status: error.response?.status || 500 }
    );
  }
}