export interface FileData {
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
  static async create(data: Omit<FileData, 'id'>): Promise<FileData> {
    // TODO: Implement API call to create file
    throw new Error('Not implemented');
  }

  static async filter(_filter: { production_id?: string }, _orderBy?: string): Promise<FileData[]> {
    // TODO: Implement API call to filter files
    throw new Error('Not implemented');
  }

  static async update(_id: string, _data: Partial<FileData>): Promise<FileData> {
    // TODO: Implement API call to update file
    throw new Error('Not implemented');
  }

  static async delete(_id: string): Promise<void> {
    // TODO: Implement API call to delete file
    throw new Error('Not implemented');
  }
}
