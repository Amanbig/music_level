'use client';

import { useState, useRef, useCallback } from 'react';
import * as Tone from 'tone';
import { Midi } from '@tonejs/midi';

interface MidiNote {
  note: string;
  time: number;
  duration: number;
  velocity: number;
}

interface UseMidiPlayerReturn {
  isPlaying: boolean;
  isLoading: boolean;
  duration: number;
  currentTime: number;
  play: (midiData: MidiNote[] | string) => Promise<void>;
  pause: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
}

export const useMidiPlayer = (): UseMidiPlayerReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const initializeSynth = useCallback(async () => {
    if (!synthRef.current) {
      await Tone.start();
      synthRef.current = new Tone.PolySynth({
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
    }
  }, []);

  const play = useCallback(async (midiData: MidiNote[] | string) => {
    try {
      setIsLoading(true);
      await initializeSynth();

      let midi: Midi;
      
      if (typeof midiData === 'string') {
        // Load from URL
        midi = await Midi.fromUrl(midiData);
      } else {
        // Create from note data
        midi = new Midi();
        const track = midi.addTrack();
        
        midiData.forEach((note) => {
          track.addNote({
            name: note.note,
            time: note.time,
            duration: note.duration,
            velocity: note.velocity
          });
        });
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

      // Update current time
      intervalRef.current = setInterval(() => {
        const position = Tone.Transport.seconds;
        setCurrentTime(position);
        
        if (position >= midi.duration) {
          stop();
        }
      }, 100);

    } catch (error) {
      console.error('Error playing MIDI:', error);
    } finally {
      setIsLoading(false);
    }
  }, [initializeSynth]);

  const pause = useCallback(() => {
    Tone.Transport.pause();
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    Tone.Transport.position = 0;
    setIsPlaying(false);
    setCurrentTime(0);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (synthRef.current) {
      synthRef.current.volume.value = Tone.gainToDb(volume);
    }
  }, []);

  return {
    isPlaying,
    isLoading,
    duration,
    currentTime,
    play,
    pause,
    stop,
    setVolume
  };
};