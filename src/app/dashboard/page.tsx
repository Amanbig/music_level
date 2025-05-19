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
    fileName: string; // Changed from fileId to fileName for clarity
}

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [tracks, setTracks] = useState<GeneratedTrack[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const checkAuth = async () => {
            console.log('Dashboard - Initial loading state:', loading);
            if (loading) return;

            const isLoggedIn = await supabaseAuth.isLoggedIn();
            console.log('Dashboard - isLoggedIn check result:', isLoggedIn);
            console.log('Dashboard - Current user:', user);

            if (!isLoggedIn || !user) {
                console.log('Dashboard - User not authenticated, redirecting to login');
                window.location.href = '/auth/login';
                return;
            }

            console.log('Dashboard - User is authenticated, fetching tracks');
            fetchUserTracks();
        };

        checkAuth();
    }, [user, loading, router]);

    const fetchUserTracks = async () => {
        setIsLoading(true);
        setError('');
        try {
            if (!user) throw new Error('User not authenticated');

            console.log('Dashboard - Fetching tracks for user:', user.id);
            const { files } = await getUserMidiFiles(user.id);
            console.log('Dashboard - Fetched files:', files);

            const userTracks = files.map(file => ({
                id: file.id,
                name: file.metadata?.fileName?.replace('.mid', '') || file.name.replace('.mid', ''),
                date: new Date(file.created_at).toLocaleDateString(),
                notes: file.metadata?.noteCount || 0,
                fileName: file.name // Store the actual file name (e.g., timestamp_song.mid)
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
            console.log('Dashboard - Downloading track:', { userId: user?.id, fileName: track.fileName });
            const url = await getMidiFileDownloadUrl(user!.id, track.fileName);
            window.open(url, '_blank');
        } catch (error: any) {
            console.error('Error downloading track:', error);
            setError('Failed to download track: ' + (error.message || 'Unknown error'));
        }
    };

    const handleDelete = async (track: GeneratedTrack) => {
        try {
            setError('');
            console.log('Dashboard - Deleting track:', { userId: user?.id, fileName: track.fileName });
            const success = await deleteMidiFile(user!.id, track.fileName);
            if (success) {
                setTracks(tracks.filter(t => t.id !== track.id));
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
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">My Dashboard</h1>
                    <div className="flex gap-4">
                        <Link
                            href="/profile"
                            className="py-2 px-4 border rounded-md hover:bg-muted transition-colors"
                        >
                            Profile
                        </Link>
                        <Link
                            href="/instruments"
                            className="py-2 px-4 bg-foreground text-background rounded-md font-medium hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors"
                        >
                            Create New
                        </Link>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                        {error}
                    </div>
                )}

                <div className="bg-card rounded-lg border p-6">
                    <h2 className="text-xl font-semibold mb-4">Your Generated Music</h2>

                    {tracks.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">You haven't generated any music yet.</p>
                            <Link
                                href="/generate"
                                className="mt-4 inline-block underline text-primary hover:text-primary/80"
                            >
                                Create your first track
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 font-medium">Name</th>
                                        <th className="text-left py-3 px-4 font-medium">Date</th>
                                        <th className="text-left py-3 px-4 font-medium">Notes</th>
                                        <th className="text-right py-3 px-4 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tracks.map((track) => (
                                        <tr key={track.id} className="border-b hover:bg-muted/50">
                                            <td className="py-3 px-4">{track.name}</td>
                                            <td className="py-3 px-4">{track.date}</td>
                                            <td className="py-3 px-4">{track.notes} notes</td>
                                            <td className="py-3 px-4 text-right">
                                                <button
                                                    className="text-sm text-primary hover:underline mr-3"
                                                    onClick={() => handleDownload(track)}
                                                >
                                                    Download
                                                </button>
                                                <button
                                                    className="text-sm text-red-500 hover:underline"
                                                    onClick={() => handleDelete(track)}
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

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-card rounded-lg border p-6">
                        <h2 className="text-xl font-semibold mb-4">Tips for Better Generation</h2>
                        <ul className="space-y-2 list-disc pl-5">
                            <li>Be specific with your song name and description</li>
                            <li>Try different variations of the same idea</li>
                            <li>Experiment with different musical styles</li>
                            <li>Use descriptive terms like "upbeat", "melancholic", or "energetic"</li>
                        </ul>
                    </div>

                    <div className="bg-card rounded-lg border p-6">
                        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
                        <div className="space-y-3">
                            <Link href="/" className="block hover:underline">← Back to Home</Link>
                            <Link href="/generate" className="block hover:underline">Generate New Music</Link>
                            <Link href="/about" className="block hover:underline">About This Project</Link>
                            <Link href="/profile" className="block hover:underline">Your Profile</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}