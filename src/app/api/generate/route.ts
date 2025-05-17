import axios from 'axios';
import { Midi } from '@tonejs/midi';
import { writeFile } from 'fs/promises';

// Interface for note structure
interface Note {
    note: string;
    time: number;
    duration: number;
    velocity: number;
}

// POST endpoint handler
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const songName = body.songName || ''; // Add song name parameter
        const extra = body.extra || '';

        const notes = await getAIResponse(songName, extra);
        await saveNotesAsMidi(notes, 'output.mid');

        return new Response(`MIDI file saved with ${notes.length} notes for "${songName || 'custom melody'}".`, {
            headers: { 'Content-Type': 'text/plain' },
            status: 200
        });
    } catch (error: any) {
        console.error('Error:', error);
        return new Response(`Error: ${error.message}`, {
            status: 500,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

// Function to get structured note data from Gemini with song reference
async function getAIResponse(songName: string, extra: string): Promise<Note[]> {
    let prompt;

    if (songName) {
        // Prompt for recreating an existing song
        prompt = `
Generate a JSON array of objects representing piano notes for an accurate piano transcription of "${songName}".
Focus on the main melody and basic chord structure of the song.

Each object must include:
- "note": scientific pitch notation (e.g., "C4", "G#5")
- "time": start time in seconds (non-negative, sequential, e.g., 0, 0.5, 1.0)
- "duration": note length in seconds (0.1 to 2.0, typically 0.25, 0.5, or 1.0 for rhythmic coherence)
- "velocity": volume (0.5 to 1.0)

Requirements:
- Match the actual notes, key signature, and tempo of "${songName}" as accurately as possible
- Include both melody and basic accompaniment/chords
- Start at time 0 and increment times sequentially
- Aim for at least 16 bars of music to capture the recognizable part of the song
- ${extra}

Return only a valid JSON array of note objects, no additional text or code blocks.
`;
    } else {
        // Original prompt for generating a new melody
        prompt = `
Generate a JSON array of objects representing piano notes for a musically coherent melody.
Each object must include:
- "note": scientific pitch notation (e.g., "C4", "G#5")
- "time": start time in seconds (non-negative, sequential, e.g., 0, 0.5, 1.0)
- "duration": note length in seconds (0.1 to 2.0, typically 0.25, 0.5, or 1.0 for rhythmic coherence)
- "velocity": volume (0.5 to 1.0)

Requirements:
- Ensure rhythmic coherence (use common note durations: quarter=0.5s, eighth=0.25s, half=1.0s)
- Maintain musical flow (avoid large pitch jumps, use stepwise motion or small intervals)
- Start at time 0 and increment times sequentially
- ${extra}

Return only a valid JSON array of note objects, no additional text or code blocks.
`;
    }

    try {
        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
            {
                model: 'gemini-2.0-flash',
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
                },
            }
        );

        // Parse the response safely
        var content = response.data?.choices?.[0]?.message?.content || '';
        if (!content) {
            throw new Error('No content in AI response');
        }

        // Strip markdown code fences if present
        content = content.replace(/```json\n|\n```/g, '').trim();

        let notes;
        try {
            notes = JSON.parse(content);
        } catch (e) {
            throw new Error(`Failed to parse JSON: ${content}`);
        }

        // Validate notes
        if (!Array.isArray(notes)) {
            throw new Error('Response is not an array');
        }

        // Validate each note
        return notes.filter((note: any): note is Note => {
            return typeof note.note === 'string' &&
                typeof note.time === 'number' && note.time >= 0 &&
                typeof note.duration === 'number' && note.duration > 0 &&
                typeof note.velocity === 'number' && note.velocity >= 0 && note.velocity <= 1;
        });
    } catch (error: any) {
        throw new Error(`Failed to get valid AI response: ${error.message}`);
    }
}

// Function to save structured note data as a MIDI file
async function saveNotesAsMidi(notes: Note[], filePath: string) {
    const midi = new Midi();
    const track = midi.addTrack();
    track.instrument.number = 0; // Acoustic Grand Piano

    for (const note of notes) {
        try {
            track.addNote({
                name: note.note,
                time: note.time,
                duration: note.duration,
                velocity: note.velocity
            });
        } catch (error) {
            console.warn(`Skipping invalid note: ${JSON.stringify(note)}`);
        }
    }

    const data = Buffer.from(midi.toArray());
    await writeFile(filePath, data);
}