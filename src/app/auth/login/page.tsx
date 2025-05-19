'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabaseAuth } from '@/lib/supabase';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loading, user } = useAuth();
    const router = useRouter();

    // Check if user is already logged in
    useEffect(() => {
        const checkAuth = async () => {
            const isLoggedIn = await supabaseAuth.isLoggedIn();
            console.log('Initial auth check - isLoggedIn:', isLoggedIn);
            if (isLoggedIn) {
                console.log('User already logged in, redirecting to dashboard');
                window.location.href = '/dashboard';
            }
        };
        checkAuth();
    }, []);

    // Watch for user changes
    useEffect(() => {
        console.log('User state changed:', user);
        if (user) {
            console.log('User detected in context, redirecting to dashboard');
            window.location.href = '/dashboard';
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            console.log('Attempting login...');
            await login(email, password);
            console.log('Login function completed successfully');

            // The user effect above will handle the redirect if login is successful
            // But we'll add a fallback check just in case
            const isLoggedIn = await supabaseAuth.isLoggedIn();
            console.log('Post-login check - isLoggedIn:', isLoggedIn);

            if (!isLoggedIn) {
                console.log('Login appeared successful but session not detected');
                setError('Login successful but session not established. Please try again.');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'Failed to login. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg border shadow-sm">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Login to Your Account</h1>
                    <p className="text-muted-foreground mt-2">Welcome back! Please enter your details.</p>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border rounded-md"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border rounded-md"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-foreground text-background rounded-md font-medium hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="text-center text-sm">
                    <p className="text-muted-foreground">
                        Don't have an account?{' '}
                        <Link href="/auth/signup" className="text-foreground hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}