import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export function getAuthToken(request?: NextRequest): string | null {
  if (request) {
    // For API routes with request object
    return request.cookies.get('token')?.value || null;
  } else {
    // For server components - this should be called in an async context
    throw new Error('getAuthToken without request should be called in an async context');
  }
}

export async function getAuthTokenAsync(): Promise<string | null> {
  // For server components
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value || null;
}

export function createAuthHeaders(token?: string | null) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
}