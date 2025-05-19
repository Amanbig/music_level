'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUserMidiFiles } from '@/lib/storage';

export default function ProfilePage() {
    const { user, logout, loading } = useAuth();
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [totalTracks, setTotalTracks] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!loading && !user) {
            console.log('Profile - User not authenticated, redirecting to login');
            router.push('/auth/login');
        } else if (user) {
            console.log('Profile - Setting user data:', { id: user.id, email: user.email });
            setName(user.user_metadata?.name || '');
            setEmail(user.email || '');
            fetchTotalTracks();
        }
    }, [user, loading, router]);

    const fetchTotalTracks = async () => {
        try {
            if (!user) return;
            console.log('Profile - Fetching total tracks for user:', user.id);
            const { total } = await getUserMidiFiles(user.id);
            setTotalTracks(total);
            console.log('Profile - Total tracks:', total);
        } catch (err: any) {
            console.error('Profile - Error fetching tracks:', err);
            setError('Failed to load track count. Please try again.');
        }
    };

    const handleLogout = async () => {
        try {
            setError('');
            console.log('Profile - Initiating logout');
            await logout();
            router.push('/');
        } catch (error: any) {
            console.error('Profile - Logout failed:', error);
            setError('Failed to log out: ' + (error.message || 'Unknown error'));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg">Loading...</p>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect in useEffect
    }

    // Format dates safely
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (error) {
            return 'Invalid date';
        }
    };

    // Access Supabase user properties
    const createdAt = user.created_at;
    const updatedAt = user.updated_at;

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-RACEway">
                    <h1 className="text-3xl font-bold">Your Profile</h1>
                    <div className="flex gap-4">
                        <Link
                            href="/dashboard"
                            className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            Dashboard
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                        {error}
                    </div>
                )}

                <div className="bg-card border rounded-lg shadow-sm p-6 mb-8">
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Name</label>
                                    <div className="p-3 bg-muted rounded-md">{name}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <div className="p-3 bg-muted rounded-md">{email}</div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <h2 className="text-xl font-semibold mb-4">Account Statistics</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="bg-background p-4 rounded-md border">
                                    <p className="text-sm text-muted-foreground">Total Tracks</p>
                                    <p className="text-2xl font-bold">{totalTracks}</p>
                                </div>
                                <div className="bg-background p-4 rounded-md border">
                                    <p className="text-sm text-muted-foreground">Account Created</p>
                                    <p className="text-2xl font-bold">{formatDate(createdAt)}</p>
                                </div>
                                <div className="bg-background p-4 rounded-md border">
                                    <p className="text-sm text-muted-foreground">Last Updated</p>
                                    <p className="text-2xl font-bold">{formatDate(updatedAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-card border rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
                    <div className="space-y-4">
                        <p className="text-muted-foreground">These actions affect your account and data.</p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/"
                                className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                Return to Home
                            </Link>
                            <Link
                                href="/generate"
                                className="px-4 py-2 bg-foreground text-background rounded-md hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors"
                            >
                                Generate New Music
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}