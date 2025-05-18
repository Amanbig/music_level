'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

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
        image: '/instruments/piano.svg'
    },
    {
        id: 'guitar',
        name: 'Guitar',
        description: 'Acoustic guitar with warm, natural sound',
        image: '/instruments/guitar.svg'
    },
    {
        id: 'violin',
        name: 'Violin',
        description: 'Elegant violin with emotional depth',
        image: '/instruments/violin.svg'
    },
    {
        id: 'flute',
        name: 'Flute',
        description: 'Melodic flute with bright, airy tones',
        image: '/instruments/flute.svg'
    }
];

export default function InstrumentsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [selectedInstrument, setSelectedInstrument] = useState<string>('');

    const handleInstrumentSelect = (instrumentId: string) => {
        setSelectedInstrument(instrumentId);
        router.push(`/generate?instrument=${instrumentId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!user) {
        router.push('/auth/login');
        return null;
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Choose Your Instrument</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {instruments.map((instrument) => (
                        <div
                            key={instrument.id}
                            className={`p-6 rounded-lg border cursor-pointer transition-all hover:shadow-lg ${selectedInstrument === instrument.id
                                    ? 'border-primary bg-primary/5'
                                    : 'border-gray-200 hover:border-primary'
                                }`}
                            onClick={() => handleInstrumentSelect(instrument.id)}
                        >
                            <div className="w-24 h-24 mx-auto mb-4">
                                <img
                                    src={instrument.image}
                                    alt={instrument.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-center mb-2">
                                {instrument.name}
                            </h3>
                            <p className="text-sm text-gray-600 text-center">
                                {instrument.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}