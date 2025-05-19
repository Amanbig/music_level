'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabaseAuth } from '@/lib/supabase';
import { getUserMidiFiles, getMidiFileDownloadUrl, deleteMidiFile } from '@/lib/storage';

interface GeneratedTrack {
    id: string;
    name: string;
    date: string;
    notes: number;
    fileName: string;
}

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [tracks, setTracks] = useState<GeneratedTrack[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            if (loading) return;

            const isLoggedIn = await supabaseAuth.isLoggedIn();
            if (!isLoggedIn || !user) {
                window.location.href = '/auth/login';
                return;
            }
            fetchUserTracks();
        };

        checkAuth();
    }, [user, loading, router]);

    const fetchUserTracks = async () => {
        setIsLoading(true);
        setError('');
        try {
            if (!user) throw new Error('User not authenticated');
            const { files } = await getUserMidiFiles(user.id);
            const userTracks = files.map((file) => ({
                id: file.id,
                name: file.metadata?.fileName?.replace('.mid', '') || file.name.replace('.mid', ''),
                date: new Date(file.created_at).toLocaleDateString(),
                notes: file.metadata?.noteCount || 0,
                fileName: file.name,
            }));
            setTracks(userTracks);
        } catch (error: any) {
            console.error('Error fetching tracks:', error);
            setError('Failed to load your tracks. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = async (track: GeneratedTrack) => {
        try {
            setError('');
            const url = await getMidiFileDownloadUrl(user!.id, track.fileName);

            // Fetch the file from the signed URL
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch MIDI file');
            }
            const blob = await response.blob();

            // Create a download link
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `${track.name}.mid`; // Ensure .mid extension
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error: any) {
            console.error('Error downloading track:', error);
            setError('Failed to download track: ' + (error.message || 'Unknown error'));
        }
    };

    const handleDelete = async (track: GeneratedTrack) => {
        try {
            setError('');
            const success = await deleteMidiFile(user!.id, track.fileName);
            if (success) {
                setTracks(tracks.filter((t) => t.id !== track.id));
                setShowDeleteConfirm(null);
            } else {
                throw new Error('Delete operation returned false');
            }
        } catch (error: any) {
            console.error('Error deleting track:', error);
            setError('Failed to delete track: ' + (error.message || 'Unknown error'));
        }
    };

    if (loading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="flex items-center gap-2">
                    <svg
                        className="animate-spin h-6 w-6 text-indigo-600"
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

    return (
        <div className="min-h-screen p-4 sm:p-8 lg:p-12 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 animate-fade-in">
                    <h1 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600 dark:from-indigo-400 dark:to-pink-400">
                        My Dashboard
                    </h1>
                    <div className="flex gap-3">
                        <Link
                            href="/profile"
                            className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 focus:ring-2 focus:ring-indigo-300"
                            aria-label="View your profile"
                        >
                            Profile
                        </Link>
                        <Link
                            href="/instruments"
                            className="py-2 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200 focus:ring-2 focus:ring-indigo-300"
                            aria-label="Create a new music track"
                        >
                            Create New
                        </Link>
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

                {/* Tracks Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8 shadow-sm animate-fade-in-up">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Your Generated Music
                    </h2>

                    {tracks.length === 0 ? (
                        <div className="text-center py-12">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
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
                            <p className="mt-2 text-gray-500 dark:text-gray-400">
                                You haven't generated any music yet.
                            </p>
                            <Link
                                href="/generate"
                                className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 font-medium hover:underline underline-offset-4"
                                aria-label="Create your first music track"
                            >
                                Create your first track
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                                            Name
                                        </th>
                                        <th className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                                            Date
                                        </th>
                                        <th className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                                            Notes
                                        </th>
                                        <th className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tracks.map((track) => (
                                        <tr
                                            key={track.id}
                                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                                        >
                                            <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                                                {track.name}
                                            </td>
                                            <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                                                {track.date}
                                            </td>
                                            <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                                                {track.notes} notes
                                            </td>
                                            <td className="py-3 px-4 text-right space-x-3">
                                                <button
                                                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded"
                                                    onClick={() => handleDownload(track)}
                                                    aria-label={`Download ${track.name}`}
                                                >
                                                    Download
                                                </button>
                                                <button
                                                    className="text-sm text-red-500 dark:text-red-400 hover:underline focus:outline-none focus:ring-2 focus:ring-red-300 rounded"
                                                    onClick={() => setShowDeleteConfirm(track.id)}
                                                    aria-label={`Delete ${track.name}`}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Delete Confirmation Dialog */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Confirm Delete
                            </h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Are you sure you want to delete this track? This action cannot be undone.
                            </p>
                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => setShowDeleteConfirm(null)}
                                    aria-label="Cancel delete"
                                >
                                    Cancel
                                </button>
                                <button
                                    className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    onClick={() => handleDelete(tracks.find((t) => t.id === showDeleteConfirm)!)}
                                    aria-label="Confirm delete"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tips and Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm animate-fade-in-up">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            Tips for Better Generation
                        </h2>
                        <ul className="space-y-2 list-disc pl-5 text-gray-600 dark:text-gray-400">
                            <li>Be specific with your song name and description</li>
                            <li>Try different variations of the same idea</li>
                            <li>Experiment with different musical styles</li>
                            <li>Use descriptive terms like "upbeat", "melancholic", or "energetic"</li>
                        </ul>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm animate-fade-in-up">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            Quick Links
                        </h2>
                        <div className="space-y-3">
                            {[
                                { href: '/', text: 'Back to Home' },
                                { href: '/instruments', text: 'Generate New Music' },
                                { href: '/about', text: 'About This Project' },
                                { href: '/profile', text: 'Your Profile' },
                            ].map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block text-indigo-600 dark:text-indigo-400 hover:underline underline-offset-4"
                                    aria-label={link.text}
                                >
                                    {link.text}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}