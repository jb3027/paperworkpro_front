export interface ProductionData {
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
  static async create(data: Omit<ProductionData, 'id'>): Promise<ProductionData> {
    // TODO: Implement API call to create production
    throw new Error('Not implemented');
  }

  static async filter(_filter: { id?: string }, _orderBy?: string): Promise<ProductionData[]> {
    // TODO: Implement API call to filter productions
    throw new Error('Not implemented');
  }

  static async update(_id: string, _data: Partial<ProductionData>): Promise<ProductionData> {
    // TODO: Implement API call to update production
    throw new Error('Not implemented');
  }

  static async delete(_id: string): Promise<void> {
    // TODO: Implement API call to delete production
    throw new Error('Not implemented');
  }
}
