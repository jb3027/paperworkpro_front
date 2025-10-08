// API Bridge - Connects frontend to backend submodule
import { PaperworkAPI } from '../../backend/src/api/PaperworkAPI';

// Create a singleton instance of the API
export const paperworkAPI = new PaperworkAPI();

// Export types for TypeScript support
export interface PaperworkData {
  id?: string;
  title: string;
  description?: string;
  content: any;
  status?: 'draft' | 'published' | 'archived';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreatePaperworkRequest {
  title: string;
  description?: string;
  content: any;
}

export interface UpdatePaperworkRequest {
  title?: string;
  description?: string;
  content?: any;
  status?: 'draft' | 'published' | 'archived';
}

// Convenience functions for common operations
export const paperworkService = {
  async create(data: CreatePaperworkRequest) {
    return await paperworkAPI.createPaperwork(data);
  },

  async get(id: string) {
    return await paperworkAPI.getPaperwork(id);
  },

  async update(id: string, data: UpdatePaperworkRequest) {
    return await paperworkAPI.updatePaperwork(id, data);
  },

  async delete(id: string) {
    return await paperworkAPI.deletePaperwork(id);
  },

  async list() {
    return await paperworkAPI.listPaperwork();
  }
};
