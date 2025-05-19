'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { uploadMidiFile } from '@/lib/storage';
import { useParams } from 'next/navigation';

export default function GeneratePage() {
    const { user } = useAuth();
    const [songName, setSongName] = useState('');
    const params = useParams()
    const [extra, setExtra] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleGenerate = async () => {
        if (!user) {
            setError('You must be logged in to generate music');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');
        const instrument = params?.instrument;

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    songName,
                    instrument,
                    extra,
                    userId: user.id,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate MIDI');
            }

            const data = await response.json();
            const { midiFile, noteCount } = data;

            // Decode base64 to binary
            const binary = atob(midiFile);
            const len = binary.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binary.charCodeAt(i);
            }

            // Create Buffer for upload
            const midiBuffer = bytes.buffer;

            // Upload to Supabase storage
            await uploadMidiFile(
                midiBuffer,
                user.id,
                songName || 'custom_melody',
                { noteCount }
            );

            setSuccess('MIDI file generated and uploaded successfully!');
        } catch (error: any) {
            setError('Failed to generate and upload MIDI: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDismissError = () => setError('');
    const handleDismissSuccess = () => setSuccess('');

    return (
        <div className="min-h-screen p-4 sm:p-8 lg:p-12 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center">
            <div className="w-full max-w-lg mx-auto animate-fade-in">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600 dark:from-indigo-400 dark:to-pink-400">
                        Generate Music
                    </h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                        Create unique melodies with your chosen instrument and style.
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm animate-fade-in-up">
                    <div className="space-y-6">
                        <div>
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
                                placeholder="e.g., Twinkle Twinkle Little Star"
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                aria-describedby="songName-description"
                            />
                            <p id="songName-description" className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Enter a song name to recreate or leave blank for an original melody.
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="extra"
                                className="block text-sm font-medium text-gray-900 dark:text-gray-100"
                            >
                                Extra Instructions (optional)
                            </label>
                            <textarea
                                id="extra"
                                value={extra}
                                onChange={(e) => setExtra(e.target.value)}
                                placeholder="e.g., Keep it simple, use quarter notes"
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 h-32 resize-y"
                                aria-describedby="extra-description"
                            />
                            <p id="extra-description" className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Add specific instructions to customize your music.
                            </p>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !user}
                            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                            aria-label={isLoading ? 'Generating music' : 'Generate and save music'}
                        >
                            {isLoading ? (
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
                                    Generating...
                                </>
                            ) : (
                                'Generate and Save'
                            )}
                        </button>
                    </div>
                </div>

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
                {success && (
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-700 rounded-lg text-green-600 dark:text-green-300 flex justify-between items-center animate-fade-in-up">
                        <span>{success}</span>
                        <button
                            onClick={handleDismissSuccess}
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
                )}
            </div>
        </div>
    );
}
