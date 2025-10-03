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
}

export interface Production {
  id: string;
  name: string;
  description?: string;
  created_date: string;
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
    name: 'Movie Production Alpha',
    description: 'Main movie production',
    created_date: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'TV Series Beta',
    description: 'Television series production',
    created_date: '2024-01-15T00:00:00Z'
  }
];

// Mock files
export const mockFiles: File[] = [
  {
    id: '1',
    name: 'Script Draft 1',
    file_type: 'script',
    file_url: 'https://example.com/script1.pdf',
    file_size: 1024000,
    created_date: '2024-01-01T10:00:00Z',
    description: 'Initial script draft',
    category: 'Creative'
  },
  {
    id: '2',
    name: 'Budget Overview',
    file_type: 'budget',
    file_url: 'https://example.com/budget.xlsx',
    file_size: 512000,
    created_date: '2024-01-02T14:30:00Z',
    description: 'Production budget breakdown',
    category: 'Financial'
  },
  {
    id: '3',
    name: 'Actor Contract',
    file_type: 'contract',
    file_url: 'https://example.com/contract.pdf',
    file_size: 256000,
    created_date: '2024-01-03T09:15:00Z',
    description: 'Lead actor contract',
    category: 'Legal'
  },
  {
    id: '4',
    name: 'Shooting Schedule',
    file_type: 'schedule',
    file_url: 'https://example.com/schedule.pdf',
    file_size: 768000,
    created_date: '2024-01-04T16:45:00Z',
    description: 'Weekly shooting schedule',
    category: 'Production'
  }
];

// Current user (simulate login)
export let currentUser: User = mockUsers[0]; // Default to admin

export const setCurrentUser = (user: User) => {
  currentUser = user;
};

export const getCurrentUser = (): User => {
  return currentUser;
};
