import api from './api';

export interface GenerationRequest {
  songName?: string;
  extra?: string;
  instrument?: string;
}

export interface SaveGenerationData {
  name: string;
  notes: any[];
  description?: string;
  userId: string;
  instrument?: string;
}

export interface Generation {
  id: string;
  name: string;
  notes: any[];
  midiData?: any;
  fileId?: string;
  description?: string;
  userId: string;
  instrument?: string;
  createdAt: string;
  updatedAt: string;
}

export const musicService = {
  async generateMusic(data: GenerationRequest) {
    const response = await api.post('/generate/ai-response', data);
    return response.data;
  },

  async saveGeneration(data: SaveGenerationData) {
    const response = await api.post('/generate/save', data);
    return response.data;
  },

  async getUserGenerations(userId: string): Promise<Generation[]> {
    const response = await api.get(`/generate/user/${userId}`);
    return response.data;
  },

  async getGeneration(id: string): Promise<Generation> {
    const response = await api.get(`/generate/${id}`);
    return response.data;
  },

  async deleteGeneration(id: string, userId: string) {
    const response = await api.delete(`/generate/${id}`, {
      data: { userId }
    });
    return response.data;
  },

  async downloadGeneration(id: string): Promise<Blob> {
    const response = await api.get(`/generate/${id}/download`, {
      responseType: 'blob'
    });
    return response.data;
  }
};