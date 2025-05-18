'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { appwriteAuth } from '@/lib/appwrite';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loading } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            await login(email, password);
            // Wait for a brief moment to ensure auth state is updated
            await new Promise(resolve => setTimeout(resolve, 100));
            // Check if user is actually logged in before redirecting
            if (await appwriteAuth.isLoggedIn()) {
                router.push('/dashboard');
            } else {
                setError('Login successful but session not established. Please try again.');
            }
        } catch (err: any) {
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

                <div className="text-center mt-4">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link href="/auth/signup" className="text-primary hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>

                <div className="mt-6 text-center">
                    <Link href="/" className="text-sm text-muted-foreground hover:underline">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}