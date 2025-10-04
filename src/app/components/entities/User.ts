export interface UserData {
  id?: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'editor' | 'viewer';
  created_date?: string;
}

export class User {
  static async me(): Promise<UserData> {
    // TODO: Implement API call to get current user
    throw new Error('Not implemented');
  }

  static async logout(): Promise<void> {
    // TODO: Implement API call to logout
    throw new Error('Not implemented');
  }

  static async create(data: Omit<UserData, 'id'>): Promise<UserData> {
    // TODO: Implement API call to create user
    throw new Error('Not implemented');
  }

  static async update(_id: string, _data: Partial<UserData>): Promise<UserData> {
    // TODO: Implement API call to update user
    throw new Error('Not implemented');
  }
}
