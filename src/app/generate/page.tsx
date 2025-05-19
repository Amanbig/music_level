'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { uploadMidiFile } from '@/lib/storage';
import axios from 'axios';

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
            const response = await axios.post('/api/generate', {
                songName,
                extra,
                instrument,
                userId: user?.id,
            });

            if (!response.data) {
                throw new Error(response.data?.message || 'Failed to generate music');
            }

            const data = response.data;
            setResult(data.message);

            const noteCount = data.noteCount || 0;
            const midiBlob = new Blob([data.midiFile], { type: 'audio/midi' });
            const fileName = `${user?.id}_${Date.now()}_${songName || 'generated'}_melody.mid`;
            const file = new File([midiBlob], fileName, { type: 'audio/midi' });

            await uploadMidiFile(file, user?.id || '', {
                songName,
                instrument,
                noteCount,
            });

            setResult(`Music generated and saved to your account!`);
            setTimeout(() => router.push('/dashboard'), 2000);
        } catch (err: any) {
            setError(err.message || 'An error occurred while generating music');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDismissError = () => setError('');
    const handleDismissResult = () => setResult('');

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

    return (
        <div className="min-h-screen p-4 sm:p-8 lg:p-12 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center">
            <div className="w-full max-w-2xl mx-auto animate-fade-in">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600 dark:from-indigo-400 dark:to-pink-400">
                        Generate Music
                    </h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                        Create stunning {instrument || 'instrumental'} melodies with AI. Name your song or let our AI compose an original piece.
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm space-y-6 animate-fade-in-up"
                >
                    <div className="space-y-2">
                        <label
                            htmlFor="songName"
                            className="block text-sm font-medium text-gray-900 dark:text-gray-100"
                        >
                            Song Name (optional)
                        </label>
                        <input
                            id="songName"
                            type="text"
                            value={songName}
                            onChange={(e) => setSongName(e.target.value)}
                            placeholder="E.g., 'Moonlight Sonata' or leave blank for an original melody"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            aria-describedby="songName-description"
                        />
                        <p id="songName-description" className="text-sm text-gray-500 dark:text-gray-400">
                            Enter a song name to recreate or leave blank for a unique composition.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="extra"
                            className="block text-sm font-medium text-gray-900 dark:text-gray-100"
                        >
                            Additional Instructions (optional)
                        </label>
                        <textarea
                            id="extra"
                            value={extra}
                            onChange={(e) => setExtra(e.target.value)}
                            placeholder="E.g., 'Make it upbeat with a jazzy feel' or 'Include soft piano chords'"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 h-32 resize-y"
                            aria-describedby="extra-description"
                        />
                        <p id="extra-description" className="text-sm text-gray-500 dark:text-gray-400">
                            Provide specific instructions to customize your music.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isGenerating || isSaving}
                        className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                        aria-label={isGenerating ? 'Generating music' : isSaving ? 'Saving music' : 'Generate music'}
                    >
                        {isGenerating || isSaving ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
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
                                {isGenerating ? 'Generating...' : 'Saving...'}
                            </>
                        ) : (
                            'Generate Music'
                        )}
                    </button>
                </form>

                {/* Error Message */}
                {error && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-lg text-red-600 dark:text-red-300 flex justify-between items-center animate-fade-in-up">
                        <span>{error}</span>
                        <button
                            onClick={handleDismissError}
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

                {/* Success Message */}
                {result && (
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-700 rounded-lg text-green-600 dark:text-green-300 animate-fade-in-up">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">Success!</p>
                                <p className="mt-2 whitespace-pre-line">{result}</p>
                            </div>
                            <button
                                onClick={handleDismissResult}
                                className="text-green-600 dark:text-green-300 hover:text-green-800 dark:hover:text-green-100"
                                aria-label="Dismiss success message"
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
                    </div>
                )}

                {/* Navigation Links */}
                <div className="mt-8 flex justify-between text-sm animate-fade-in-up">
                    <Link
                        href="/"
                        className="text-indigo-600 dark:text-indigo-400 hover:underline underline-offset-4 font-medium"
                        aria-label="Back to home"
                    >
                        ← Back to Home
                    </Link>
                    <Link
                        href="/dashboard"
                        className="text-indigo-600 dark:text-indigo-400 hover:underline underline-offset-4 font-medium"
                        aria-label="View dashboard"
                    >
                        View Dashboard →
                    </Link>
                </div>
            </div>
        </div>
    );
}