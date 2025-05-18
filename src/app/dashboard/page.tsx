'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { appwriteAuth } from '@/lib/appwrite';

interface GeneratedTrack {
    id: string;
    name: string;
    date: string;
    notes: number;
    fileId?: string;
}

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [tracks, setTracks] = useState<GeneratedTrack[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            // Wait for initial loading to complete
            if (loading) return;

            // Check if user is authenticated
            const isLoggedIn = await appwriteAuth.isLoggedIn();

            if (!isLoggedIn || !user) {
                router.replace('/auth/login');
                return;
            }

            // Fetch user's tracks when authenticated
            fetchUserTracks();
        };

        checkAuth();
    }, [user, loading, router]);

    const fetchUserTracks = async () => {
        setIsLoading(true);
        try {
            // In a real implementation, this would fetch from Appwrite storage
            // For now, we'll use mock data
            setTracks([
                {
                    id: '1',
                    name: 'Piano Melody',
                    date: new Date().toLocaleDateString(),
                    notes: 120,
                    fileId: 'mock-file-id-1'
                },
                {
                    id: '2',
                    name: 'Fur Elise Recreation',
                    date: new Date(Date.now() - 86400000).toLocaleDateString(), // Yesterday
                    notes: 245,
                    fileId: 'mock-file-id-2'
                }
            ]);
        } catch (error) {
            console.error('Error fetching tracks:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = async (track: GeneratedTrack) => {
        try {
            // In a real implementation, this would download from Appwrite storage
            alert(`Downloading track: ${track.name}`);
            // Example implementation with Appwrite:
            // const file = await storage.getFileDownload('bucket-id', track.fileId);
            // window.open(file.href, '_blank');
        } catch (error) {
            console.error('Error downloading track:', error);
        }
    };

    const handleDelete = async (trackId: string) => {
        try {
            // In a real implementation, this would delete from Appwrite storage
            // Example implementation with Appwrite:
            // await storage.deleteFile('bucket-id', track.fileId);
            setTracks(tracks.filter(t => t.id !== trackId));
        } catch (error) {
            console.error('Error deleting track:', error);
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
                                                    onClick={() => handleDelete(track.id)}
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