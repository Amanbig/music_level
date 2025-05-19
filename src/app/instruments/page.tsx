'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface Instrument {
    id: string;
    name: string;
    description: string;
    image: string;
}

const instruments: Instrument[] = [
    {
        id: 'piano',
        name: 'Piano',
        description: 'Classical piano with rich, expressive tones',
        image: '/instruments/piano.svg',
    },
    {
        id: 'guitar',
        name: 'Guitar',
        description: 'Acoustic guitar with warm, natural sound',
        image: '/instruments/guitar.svg',
    },
    {
        id: 'violin',
        name: 'Violin',
        description: 'Elegant violin with emotional depth',
        image: '/instruments/violin.svg',
    },
    {
        id: 'flute',
        name: 'Flute',
        description: 'Melodic flute with bright, airy tones',
        image: '/instruments/flute.svg',
    },
    {
        id: 'drums',
        name: 'Drums',
        description: 'Powerful drum kit with dynamic rhythms',
        image: '/instruments/drums.svg',
    },
    {
        id: 'trumpet',
        name: 'Trumpet',
        description: 'Brass trumpet with bold, vibrant sound',
        image: '/instruments/trumpet.svg',
    },
    {
        id: 'saxophone',
        name: 'Saxophone',
        description: 'Smooth saxophone with rich, soulful tones',
        image: '/instruments/saxophone.svg',
    },
    {
        id: 'cello',
        name: 'Cello',
        description: 'Deep cello with warm, resonant sound',
        image: '/instruments/cello.svg',
    },
];

export default function InstrumentsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [selectedInstrument, setSelectedInstrument] = useState<string>('');

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/login');
        }
    }, [user, loading, router]);

    const handleInstrumentSelect = (instrumentId: string) => {
        setSelectedInstrument(instrumentId);
        setTimeout(() => {
            router.push(`/generate?instrument=${instrumentId}`);
        }, 300); // Delay navigation for animation feedback
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
                    <p className="text-lg text-gray-700 dark:text-gray-300">Loading instruments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 sm:p-8 lg:p-12 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 animate-fade-in">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600 dark:from-indigo-400 dark:to-pink-400">
                            Choose Your Instrument
                        </h1>
                        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                            Select an instrument to start generating your music.
                        </p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 focus:ring-2 focus:ring-indigo-300"
                        aria-label="Back to dashboard"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                {/* Instrument Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {instruments.map((instrument, index) => (
                        <div
                            key={instrument.id}
                            className={`relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${selectedInstrument === instrument.id
                                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/30 shadow-md'
                                    : 'hover:border-indigo-300'
                                } animate-fade-in-up`}
                            style={{ animationDelay: `${index * 100}ms` }}
                            onClick={() => handleInstrumentSelect(instrument.id)}
                            role="button"
                            tabIndex={0}
                            aria-label={`Select ${instrument.name}`}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleInstrumentSelect(instrument.id);
                                }
                            }}
                        >
                            <div className="w-24 h-24 mx-auto mb-4">
                                <img
                                    src={instrument.image}
                                    alt={instrument.name}
                                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center mb-2">
                                {instrument.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                                {instrument.description}
                            </p>
                            {selectedInstrument === instrument.id && (
                                <div className="absolute inset-0 rounded-xl border-2 border-indigo-500 pointer-events-none animate-pulse"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}