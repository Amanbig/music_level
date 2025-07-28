import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Midi } from '@tonejs/midi';
import { Note } from './noteDto';
import { GeminiService } from 'src/gemini/gemini.service';
import { AppwriteService } from 'src/appwrite/appwrite.service';
import { GenerationRequestDto, SaveGenerationDto, GenerationResponse } from './dto/generation.dto';
import { ID, Query } from 'node-appwrite';

@Injectable()
export class GenerateService {
    private readonly logger = new Logger(GenerateService.name);
    private readonly generationsCollectionId = 'generations'; // Add this to your Appwrite config

    constructor(
        private geminiService: GeminiService,
        private appwriteService: AppwriteService
    ) {} 

    // Function to save a generation to Appwrite
    async saveGeneration(saveDto: SaveGenerationDto): Promise<GenerationResponse> {
        try {
            const document = await this.appwriteService.databases.createDocument(
                this.appwriteService.databaseId,
                this.generationsCollectionId,
                ID.unique(),
                {
                    name: saveDto.name,
                    notes: saveDto.notes,
                    description: saveDto.description || '',
                    userId: saveDto.userId,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }
            );

            return {
                id: document.$id,
                name: document.name,
                notes: document.notes,
                description: document.description,
                userId: document.userId,
                createdAt: document.createdAt,
                updatedAt: document.updatedAt,
            };
        } catch (error) {
            this.logger.error('Error saving generation:', error);
            throw new Error('Failed to save generation');
        }
    }

    // Function to get a user's generations
    async getUserGenerations(userId: string): Promise<GenerationResponse[]> {
        try {
            const response = await this.appwriteService.databases.listDocuments(
                this.appwriteService.databaseId,
                this.generationsCollectionId,
                [Query.equal('userId', userId), Query.orderDesc('createdAt')]
            );

            return response.documents.map(doc => ({
                id: doc.$id,
                name: doc.name,
                notes: doc.notes,
                description: doc.description,
                userId: doc.userId,
                createdAt: doc.createdAt,
                updatedAt: doc.updatedAt,
            }));
        } catch (error) {
            this.logger.error('Error getting user generations:', error);
            throw new Error('Failed to get user generations');
        }
    }

    // Function to get a specific generation
    async getGeneration(generationId: string): Promise<GenerationResponse> {
        try {
            const document = await this.appwriteService.databases.getDocument(
                this.appwriteService.databaseId,
                this.generationsCollectionId,
                generationId
            );

            return {
                id: document.$id,
                name: document.name,
                notes: document.notes,
                description: document.description,
                userId: document.userId,
                createdAt: document.createdAt,
                updatedAt: document.updatedAt,
            };
        } catch (error) {
            this.logger.error(`Error getting generation ${generationId}:`, error);
            throw new NotFoundException('Generation not found');
        }
    }

    // Function to delete a generation
    async deleteGeneration(generationId: string, userId: string): Promise<void> {
        try {
            const document = await this.appwriteService.databases.getDocument(
                this.appwriteService.databaseId,
                this.generationsCollectionId,
                generationId
            );

            if (document.userId !== userId) {
                throw new Error('Unauthorized');
            }

            await this.appwriteService.databases.deleteDocument(
                this.appwriteService.databaseId,
                this.generationsCollectionId,
                generationId
            );
        } catch (error) {
            this.logger.error(`Error deleting generation ${generationId}:`, error);
            throw new Error('Failed to delete generation');
        }
    }

    // Function to get structured note data from Gemini with song reference
    async getAIResponse(dto: GenerationRequestDto): Promise<Note[]> {
        let prompt;
        const instrument = dto.instrument || 'piano';

        if (dto.songName) {
            // Prompt for recreating an existing song
            prompt = `
        Generate a JSON array of objects representing ${instrument} notes for an accurate ${instrument} transcription of "${dto.songName}".
        Focus on the main melody and basic chord structure of the song.

        Each object must include:
        - "note": scientific pitch notation (e.g., "C4", "G#5")
        - "time": start time in seconds (non-negative, sequential, e.g., 0, 0.5, 1.0)
        - "duration": note length in seconds (0.1 to 2.0, typically 0.25, 0.5, or 1.0 for rhythmic coherence)
        - "velocity": volume (0.5 to 1.0)

        Requirements:
        - Match the actual notes, key signature, and tempo of "${dto.songName}" as accurately as possible
        - Include both melody and basic accompaniment/chords
        - Start at time 0 and increment times sequentially
        - Aim for at least 16 bars of music to capture the recognizable part of the song
        ${dto.extra ? `- ${dto.extra}` : ''}

        Return only a valid JSON array of note objects, no additional text or code blocks.
        `;
                } else {
                    // Original prompt for generating a new melody
                    prompt = `
        Generate a JSON array of objects representing ${instrument} notes for a musically coherent melody.
        Each object must include:
        - "note": scientific pitch notation (e.g., "C4", "G#5")
        - "time": start time in seconds (non-negative, sequential, e.g., 0, 0.5, 1.0)
        - "duration": note length in seconds (0.1 to 2.0, typically 0.25, 0.5, or 1.0 for rhythmic coherence)
        - "velocity": volume (0.5 to 1.0)

        Requirements:
        - Ensure rhythmic coherence (use common note durations: quarter=0.5s, eighth=0.25s, half=1.0s)
        - Maintain musical flow (avoid large pitch jumps, use stepwise motion or small intervals)
        - Start at time 0 and increment times sequentially
        ${dto.extra ? `- ${dto.extra}` : ''}

        Return only a valid JSON array of note objects, no additional text or code blocks.
        `;
        }

        try {
            const response = await this.geminiService.generateAI(prompt);
            

            // Parse the response safely
            var content = response?.choices?.[0]?.message?.content || '';
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

    // Function to generate MIDI buffer from notes
    async saveNotesAsMidi(notes: Note[], instrument: string = 'piano'): Promise<Buffer> {
        const midi = new Midi();
        const track = midi.addTrack();

        const instrumentNumbers: Record<string, number> = {
            piano: 0, // Acoustic Grand Piano
            guitar: 24, // Acoustic Guitar (nylon)
            violin: 40, // Violin
            flute: 73, // Flute
            drums: 118, // Synth Drum
            trumpet: 56, // Trumpet
            saxophone: 66, // Alto Sax
            cello: 42, // Cello
        };

        track.instrument.number = instrumentNumbers[instrument] || 0;

        for (const note of notes) {
            try {
                track.addNote({
                    name: note.note,
                    time: note.time,
                    duration: note.duration,
                    velocity: note.velocity,
                });
            } catch (error) {
                console.warn(`Skipping invalid note: ${JSON.stringify(note)}`);
            }
        }

        return Buffer.from(midi.toArray());
    }
}
