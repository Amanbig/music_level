'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        // Get the auth code from the URL
        const handleEmailConfirmation = async () => {
            try {
                // Get the hash from the URL
                const hash = window.location.hash;
                console.log('Auth callback - Processing hash:', hash);

                // Check if we have a hash (Supabase appends auth info to hash)
                if (hash) {
                    console.log('Auth callback - Hash found, refreshing session');
                    // Exchange the auth code for a session
                    const { error } = await supabase.auth.refreshSession();

                    if (error) {
                        console.error('Error refreshing session:', error);
                        throw error;
                    }

                    // Check if we have a session
                    const { data: { session } } = await supabase.auth.getSession();
                    console.log('Auth callback - Session check result:', !!session);

                    if (session) {
                        console.log('Auth callback - Session found, redirecting to dashboard');
                        // Use window.location for a hard navigation
                        window.location.href = '/dashboard';
                    } else {
                        console.log('Auth callback - No session found, redirecting to login');
                        // Use window.location for a hard navigation
                        window.location.href = '/auth/login';
                    }
                } else {
                    console.log('Auth callback - No hash found, redirecting to login');
                    // Use window.location for a hard navigation
                    window.location.href = '/auth/login';
                }
            } catch (error) {
                console.error('Error handling email confirmation:', error);
                // Use window.location for a hard navigation
                window.location.href = '/auth/login';
            }
        };

        handleEmailConfirmation();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg border shadow-sm">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Verifying your email...</h1>
                    <p className="text-muted-foreground mt-2">Please wait while we confirm your email address.</p>
                </div>
            </div>
        </div>
    );
}