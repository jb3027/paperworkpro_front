export interface Production {
  id?: string;
  name: string;
  description?: string;
  status?: 'pre_production' | 'in_production' | 'post_production' | 'completed' | 'archived';
  start_date?: string;
  members?: string[];
  cover_image?: string;
  color?: string;
}

export class Production {
  static async create(data: Omit<Production, 'id'>): Promise<Production> {
    // TODO: Implement API call to create production
    throw new Error('Not implemented');
  }

  static async filter(filter: { id?: string }, orderBy?: string): Promise<Production[]> {
    // TODO: Implement API call to filter productions
    throw new Error('Not implemented');
  }

  static async update(id: string, data: Partial<Production>): Promise<Production> {
    // TODO: Implement API call to update production
    throw new Error('Not implemented');
  }

  static async delete(id: string): Promise<void> {
    // TODO: Implement API call to delete production
    throw new Error('Not implemented');
  }
}
