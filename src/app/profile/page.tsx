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
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/login');
        } else if (user) {
            setName(user.user_metadata?.name || '');
            setEmail(user.email || '');
            fetchTotalTracks();
        }
    }, [user, loading, router]);

    const fetchTotalTracks = async () => {
        try {
            if (!user) throw new Error('User not authenticated');
            const { total } = await getUserMidiFiles(user.id);
            setTotalTracks(total);
        } catch (err: any) {
            setError('Failed to load track count: ' + (err.message || 'Unknown error'));
        }
    };

    const handleLogout = async () => {
        try {
            setError('');
            await logout();
            router.push('/');
        } catch (error: any) {
            setError('Failed to log out: ' + (error.message || 'Unknown error'));
        } finally {
            setShowLogoutConfirm(false);
        }
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return 'Invalid date';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="flex items-center gap-2">
                    <svg
                        className="animate-spin h-8 w-8 text-indigo-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    <p className="text-lg text-gray-700 dark:text-gray-300">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const createdAt = user.created_at;
    const updatedAt = user.updated_at;

    return (
        <div className="min-h-screen p-4 sm:p-8 lg:p-12 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 animate-fade-in">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600 dark:from-indigo-400 dark:to-pink-400">
                            Your Profile
                        </h1>
                        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                            Manage your account and view your music creation stats.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/dashboard"
                            className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 focus:ring-2 focus:ring-indigo-300"
                            aria-label="Go to dashboard"
                        >
                            Dashboard
                        </Link>
                        <button
                            onClick={() => setShowLogoutConfirm(true)}
                            className="py-2 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all duration-200 foci:ring-2 focus:ring-red-300"
                            aria-label="Log out"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-lg text-red-600 dark:text-red-300 flex justify-between items-center animate-fade-in-up">
                        <span>{error}</span>
                        <button
                            onClick={() => setError('')}
                            className="text-red-600 dark:text-red-300 hover:text-red-800 dark:hover:text-red-100"
                            aria-label="Dismiss error message"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                ></path>
                            </svg>
                        </button>
                    </div>
                )}

                {/* Account Information */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-sm mb-8 animate-fade-in-up">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Account Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Name
                            </label>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-gray-100">
                                {name || 'N/A'}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email
                            </label>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-gray-100">
                                {email}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Statistics */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-sm mb-8 animate-fade-in-up">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Account Statistics
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                            {
                                label: 'Total Tracks',
                                value: totalTracks,
                                icon: (
                                    <svg
                                        className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 18V5l12-2v13M6 18a3 3 0 100-6 3 3 0 000 6zm12-2a3 3 0 100-6 3 3 0 000 6z"
                                        ></path>
                                    </svg>
                                ),
                            },
                            {
                                label: 'Account Created',
                                value: formatDate(createdAt),
                                icon: (
                                    <svg
                                        className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        ></path>
                                    </svg>
                                ),
                            },
                            {
                                label: 'Last Updated',
                                value: formatDate(updatedAt),
                                icon: (
                                    <svg
                                        className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                ),
                            },
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200"
                            >
                                {stat.icon}
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Account Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-sm animate-fade-in-up">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Account Actions
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Explore more or start creating new music.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/"
                            className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 focus:ring-2 focus:ring-indigo-300"
                            aria-label="Return to home"
                        >
                            Return to Home
                        </Link>
                        <Link
                            href="/generate"
                            className="py-2 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200 focus:ring-2 focus:ring-indigo-300"
                            aria-label="Generate new music"
                        >
                            Generate New Music
                        </Link>
                    </div>
                </div>

                {/* Logout Confirmation Dialog */}
                {showLogoutConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Confirm Logout
                            </h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Are you sure you want to log out?
                            </p>
                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => setShowLogoutConfirm(false)}
                                    aria-label="Cancel logout"
                                >
                                    Cancel
                                </button>
                                <button
                                    className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    onClick={handleLogout}
                                    aria-label="Confirm logout"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}