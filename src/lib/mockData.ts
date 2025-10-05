// Mock data for development
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'editor' | 'viewer';
  created_date: string;
}

export interface File {
  id: string;
  name: string;
  file_type: 'contract' | 'script' | 'schedule' | 'budget' | 'call_sheet' | 'release_form' | 'permit' | 'invoice' | 'other';
  file_url?: string;
  file_size?: number;
  created_date: string;
  updated_date?: string;
  description?: string;
  category?: string;
  production_id?: string;
}

export interface Production {
  id?: string;
  name: string;
  description?: string;
  status?: 'pre_production' | 'in_production' | 'post_production' | 'completed' | 'archived';
  start_date?: string;
  members?: string[];
  cover_image?: string;
  color?: string;
  created_date?: string;
  updated_date?: string;
}

// Mock users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    full_name: 'Admin User',
    role: 'admin',
    created_date: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'editor@example.com',
    full_name: 'Editor User',
    role: 'editor',
    created_date: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    email: 'viewer@example.com',
    full_name: 'Viewer User',
    role: 'viewer',
    created_date: '2024-01-03T00:00:00Z'
  }
];

// Mock productions
export const mockProductions: Production[] = [
  {
    id: '1',
    name: 'Mock Production',
    description: 'Testing production',
    created_date: '2024-01-01T00:00:00Z',
    members: ['admin@example.com', 'editor@example.com']
  }
];

// Mock files
export const mockFiles: File[] = [];

// Current user (simulate login)
export let currentUser: User = mockUsers[0]; // Default to admin

export const setCurrentUser = (user: User) => {
  currentUser = user;
};

export const getCurrentUser = (): User => {
  return currentUser;
};
