'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { uploadMidiFile } from '@/lib/storage';

export default function GeneratePage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [songName, setSongName] = useState('');
    const [extra, setExtra] = useState('');
    const [instrument, setInstrument] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Get the instrument from URL parameters
        const params = new URLSearchParams(window.location.search);
        const instrumentParam = params.get('instrument');
        if (instrumentParam) {
            setInstrument(instrumentParam);
        } else {
            // Redirect to instrument selection if no instrument is specified
            router.push('/instruments');
        }
    }, [router]);

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!loading && !user) {
            router.push('/auth/login');
        }
    }, [user, loading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);
        setResult('');
        setError('');

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    songName,
                    extra,
                    instrument,
                    userId: user?.$id // Include user ID for tracking
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to generate music');
            }

            const data = await response.json();
            setResult(data.message);

            // Store the note count for later use
            const noteCount = data.noteCount || 0;

            // Trigger download of the generated MIDI file
            const downloadLink = document.createElement('a');
            downloadLink.href = '/output.mid';
            downloadLink.download = `${songName || 'generated'}_melody.mid`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            // Save to user's account if authenticated
            if (user) {
                await saveToUserAccount(noteCount);
            }

        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsGenerating(false);
        }
    };

    const saveToUserAccount = async (noteCount = 0) => {
        try {
            setIsSaving(true);

            // Fetch the generated MIDI file
            const response = await fetch('/output.mid');
            const blob = await response.blob();
            const file = new File([blob], `${songName || 'generated'}_melody.mid`, { type: 'audio/midi' });

            // Upload to Appwrite storage with metadata
            await uploadMidiFile(file, user!.$id, {
                songName: songName || 'Untitled Melody',
                instrument: instrument || 'piano',
                extra: extra || '',
                noteCount: noteCount, // Use the note count from API response
                generatedAt: new Date().toISOString()
            });

            setResult(prev => prev + '\nSaved to your account!');

            // Redirect to dashboard after short delay
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (err: any) {
            console.error('Error saving to account:', err);
            setError('Generated successfully but failed to save to your account');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 flex flex-col items-center">
            <div className="w-full max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Generate Music</h1>
                    <p className="text-muted-foreground">
                        Create beautiful piano instrumentals with AI. Enter a song name to recreate it or leave it blank for an original melody.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="songName" className="block text-sm font-medium">
                            Song Name (optional)
                        </label>
                        <input
                            id="songName"
                            type="text"
                            value={songName}
                            onChange={(e) => setSongName(e.target.value)}
                            placeholder="Enter a song name to recreate or leave blank for original melody"
                            className="w-full p-3 border rounded-md"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="extra" className="block text-sm font-medium">
                            Additional Instructions (optional)
                        </label>
                        <textarea
                            id="extra"
                            value={extra}
                            onChange={(e) => setExtra(e.target.value)}
                            placeholder="E.g., 'Make it more upbeat' or 'Add more bass notes'"
                            className="w-full p-3 border rounded-md h-24"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isGenerating || isSaving}
                        className="w-full py-3 px-4 bg-foreground text-background rounded-md font-medium hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? 'Generating...' : isSaving ? 'Saving...' : 'Generate Music'}
                    </button>
                </form>

                {error && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                        {error}
                    </div>
                )}

                {result && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-600">
                        <p className="font-medium">Success!</p>
                        <p className="mt-2 whitespace-pre-line">{result}</p>
                    </div>
                )}

                <div className="mt-8 flex justify-between">
                    <Link
                        href="/"
                        className="text-sm text-muted-foreground hover:underline"
                    >
                        ← Back to Home
                    </Link>
                    <Link
                        href="/dashboard"
                        className="text-sm text-muted-foreground hover:underline"
                    >
                        View Dashboard →
                    </Link>
                </div>
            </div>
        </div>
    );
}