import { User, File, Production, mockUsers, mockFiles, mockProductions, getCurrentUser, setCurrentUser } from './mockData';

// User service
export class UserService {
  static async me(): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return getCurrentUser();
  }

  static async login(email: string, _password: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    setCurrentUser(user);
    return user;
  }

  static async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    // In a real app, you'd clear tokens, etc.
  }

  static async getAll(): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUsers;
  }

  static async create(data: Omit<User, 'id'>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newUser: User = {
      id: Date.now().toString(),
      ...data,
      created_date: new Date().toISOString()
    };
    mockUsers.push(newUser);
    return newUser;
  }

  static async update(id: string, data: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 600));
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    
    mockUsers[index] = { ...mockUsers[index], ...data };
    return mockUsers[index];
  }

  static async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    mockUsers.splice(index, 1);
  }
}

// File service
export class FileService {
  static async getAll(): Promise<File[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockFiles];
  }

  static async getByProduction(productionId: string): Promise<File[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockFiles.filter(f => f.production_id === productionId);
  }

  static async create(data: Omit<File, 'id'>): Promise<File> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newFile: File = {
      id: Date.now().toString(),
      ...data,
      created_date: new Date().toISOString()
    };
    mockFiles.push(newFile);
    return newFile;
  }

  static async update(id: string, data: Partial<File>): Promise<File> {
    await new Promise(resolve => setTimeout(resolve, 600));
    const index = mockFiles.findIndex(f => f.id === id);
    if (index === -1) throw new Error('File not found');
    
    mockFiles[index] = { 
      ...mockFiles[index], 
      ...data, 
      updated_date: new Date().toISOString() 
    };
    return mockFiles[index];
  }

  static async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = mockFiles.findIndex(f => f.id === id);
    if (index === -1) throw new Error('File not found');
    mockFiles.splice(index, 1);
  }

  static async upload(file: globalThis.File, productionId?: string): Promise<File> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate file upload
    const uploadedFile: File = {
      id: Date.now().toString(),
      name: file.name,
      file_type: 'other', // Default type
      file_url: URL.createObjectURL(file),
      file_size: file.size,
      created_date: new Date().toISOString(),
      description: `Uploaded file: ${file.name}`,
      production_id: productionId
    };
    
    mockFiles.push(uploadedFile);
    return uploadedFile;
  }
}

// Production service
export class ProductionService {
  static async getAll(): Promise<Production[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockProductions];
  }

  static async getById(id: string): Promise<Production | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockProductions.find(p => p.id === id) || null;
  }

  static async create(data: Omit<Production, 'id'>): Promise<Production> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newProduction: Production = {
      id: Date.now().toString(),
      ...data,
      created_date: new Date().toISOString()
    };
    mockProductions.push(newProduction);
    return newProduction;
  }

  static async update(id: string, data: Partial<Production>): Promise<Production> {
    await new Promise(resolve => setTimeout(resolve, 600));
    const index = mockProductions.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Production not found');
    
    mockProductions[index] = { 
      ...mockProductions[index], 
      ...data, 
      updated_date: new Date().toISOString() 
    };
    return mockProductions[index];
  }

  static async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = mockProductions.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Production not found');
    mockProductions.splice(index, 1);
  }
}
