import { NextRequest, NextResponse } from 'next/server';

const NESTJS_BACKEND_URL = process.env.NESTJS_BACKEND_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authorization header required' },
        { status: 401 }
      );
    }

    // Get the form data from the request
    const formData = await request.formData();
    
    // Forward the form data to NestJS backend
    const response = await fetch(`${NESTJS_BACKEND_URL}/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Upload failed' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}