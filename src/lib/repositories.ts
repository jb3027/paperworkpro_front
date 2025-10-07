export interface Repository {
  name: string;
  url: string;
  description: string;
  type: 'backend' | 'frontend' | 'api' | 'docs' | 'other';
}

export const repositories: Repository[] = [
  {
    name: 'PaperworkPRO Backend',
    url: 'https://github.com/your-username/paperworkpro-backend',
    description: 'Backend API and database management',
    type: 'backend'
  },
  {
    name: 'PaperworkPRO API',
    url: 'https://github.com/your-username/paperworkpro-api',
    description: 'REST API endpoints and business logic',
    type: 'api'
  },
  {
    name: 'PaperworkPRO Docs',
    url: 'https://github.com/your-username/paperworkpro-docs',
    description: 'Documentation and guides',
    type: 'docs'
  },
  {
    name: 'PaperworkPRO Mobile',
    url: 'https://github.com/your-username/paperworkpro-mobile',
    description: 'Mobile application for iOS and Android',
    type: 'frontend'
  }
];

export const getRepositoriesByType = (type: Repository['type']) => {
  return repositories.filter(repo => repo.type === type);
};

export const getAllRepositories = () => {
  return repositories;
};
