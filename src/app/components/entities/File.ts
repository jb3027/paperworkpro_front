export interface File {
  id?: string;
  production_id: string;
  name: string;
  file_type: 'contract' | 'script' | 'schedule' | 'budget' | 'call_sheet' | 'release_form' | 'permit' | 'invoice' | 'other';
  file_url?: string;
  file_size?: number;
  created_date?: string;
  updated_date?: string;
  description?: string;
}

export class File {
  static async create(data: Omit<File, 'id'>): Promise<File> {
    // TODO: Implement API call to create file
    throw new Error('Not implemented');
  }

  static async filter(filter: { production_id?: string }, orderBy?: string): Promise<File[]> {
    // TODO: Implement API call to filter files
    throw new Error('Not implemented');
  }

  static async update(id: string, data: Partial<File>): Promise<File> {
    // TODO: Implement API call to update file
    throw new Error('Not implemented');
  }

  static async delete(id: string): Promise<void> {
    // TODO: Implement API call to delete file
    throw new Error('Not implemented');
  }
}
