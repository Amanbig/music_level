'use client';

import React, { useState, useRef } from 'react';
import * as Tone from 'tone';
import { Midi } from '@tonejs/midi';
import { Button } from './ui/Button';
import { Play, Pause, Square, Volume2 } from 'lucide-react';

interface MidiPlayerProps {
    midiUrl?: string;
    midiData?: any; // Your stored MIDI data
    className?: string;
}

export const MidiPlayer: React.FC<MidiPlayerProps> = ({
    midiUrl,
    midiData,
    className = ''
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(0.7);

    const synthRef = useRef<Tone.PolySynth | null>(null);
    const transportRef = useRef<boolean>(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const initializeSynth = async () => {
        if (!synthRef.current) {
            await Tone.start();
            synthRef.current = new Tone.PolySynth(Tone.Synth, {
                oscillator: {
                    type: 'triangle'
                },
                envelope: {
                    attack: 0.02,
                    decay: 0.1,
                    sustain: 0.3,
                    release: 1
                }
            }).toDestination();

            synthRef.current.volume.value = Tone.gainToDb(volume);
        }
    };

    const loadAndPlayMidi = async () => {
        try {
            setIsLoading(true);
            await initializeSynth();

            let midi: Midi;

            if (midiUrl) {
                // Load from URL
                midi = await Midi.fromUrl(midiUrl);
            } else if (midiData) {
                // Use stored MIDI data
                midi = new Midi();
                const track = midi.addTrack();

                // Add notes from stored data
                midiData.notes?.forEach((note: any) => {
                    track.addNote({
                        name: note.note,
                        time: note.time,
                        duration: note.duration,
                        velocity: note.velocity
                    });
                });
            } else {
                throw new Error('No MIDI data provided');
            }

            setDuration(midi.duration);

            // Clear any existing scheduled events
            Tone.Transport.cancel();
            Tone.Transport.stop();
            Tone.Transport.position = 0;

            // Schedule all notes
            midi.tracks.forEach(track => {
                track.notes.forEach(note => {
                    Tone.Transport.schedule((time) => {
                        synthRef.current?.triggerAttackRelease(
                            note.name,
                            note.duration,
                            time,
                            note.velocity
                        );
                    }, note.time);
                });
            });

            // Start playback
            Tone.Transport.start();
            setIsPlaying(true);
            transportRef.current = true;

            // Update current time
            intervalRef.current = setInterval(() => {
                const position = Tone.Transport.seconds;
                setCurrentTime(position);

                if (position >= midi.duration) {
                    stopPlayback();
                }
            }, 100);

        } catch (error) {
            console.error('Error playing MIDI:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const pausePlayback = () => {
        Tone.Transport.pause();
        setIsPlaying(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const resumePlayback = () => {
        Tone.Transport.start();
        setIsPlaying(true);

        intervalRef.current = setInterval(() => {
            const position = Tone.Transport.seconds;
            setCurrentTime(position);

            if (position >= duration) {
                stopPlayback();
            }
        }, 100);
    };

    const stopPlayback = () => {
        Tone.Transport.stop();
        Tone.Transport.cancel();
        Tone.Transport.position = 0;
        setIsPlaying(false);
        setCurrentTime(0);
        transportRef.current = false;

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const handleVolumeChange = (newVolume: number) => {
        setVolume(newVolume);
        if (synthRef.current) {
            synthRef.current.volume.value = Tone.gainToDb(newVolume);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handlePlayPause = () => {
        if (!isPlaying && currentTime === 0) {
            loadAndPlayMidi();
        } else if (isPlaying) {
            pausePlayback();
        } else {
            resumePlayback();
        }
    };

    return (
        <div className={`bg-card border border-border rounded-lg p-4 space-y-4 ${className}`}>
            {/* Controls */}
            <div className="flex items-center space-x-3">
                <Button
                    onClick={handlePlayPause}
                    disabled={isLoading}
                    size="sm"
                    variant="outline"
                >
                    {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    ) : isPlaying ? (
                        <Pause className="h-4 w-4" />
                    ) : (
                        <Play className="h-4 w-4" />
                    )}
                </Button>

                <Button
                    onClick={stopPlayback}
                    disabled={!transportRef.current}
                    size="sm"
                    variant="ghost"
                >
                    <Square className="h-4 w-4" />
                </Button>

                {/* Time Display */}
                <div className="text-sm text-muted-foreground">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-secondary rounded-full h-2">
                <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-100"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                />
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-muted-foreground w-8">
                    {Math.round(volume * 100)}%
                </span>
            </div>
        </div>
    );
};