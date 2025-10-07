"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Github, ExternalLink, Database, Code, BookOpen, Settings } from 'lucide-react';
import { Repository } from '@/lib/repositories';

interface RepositoryButtonProps {
  repository: Repository;
  variant?: 'button' | 'card';
  className?: string;
}

const getIconForType = (type: Repository['type']) => {
  switch (type) {
    case 'backend':
      return <Database className="w-5 h-5" />;
    case 'api':
      return <Code className="w-5 h-5" />;
    case 'docs':
      return <BookOpen className="w-5 h-5" />;
    case 'frontend':
      return <Github className="w-5 h-5" />;
    default:
      return <Settings className="w-5 h-5" />;
  }
};

const getTypeColor = (type: Repository['type']) => {
  switch (type) {
    case 'backend':
      return 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 hover:border-blue-300';
    case 'api':
      return 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200 hover:border-green-300';
    case 'docs':
      return 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 hover:border-purple-300';
    case 'frontend':
      return 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200 hover:border-orange-300';
    default:
      return 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-300';
  }
};

export const RepositoryButton: React.FC<RepositoryButtonProps> = ({ 
  repository, 
  variant = 'button',
  className = ''
}) => {
  const handleClick = () => {
    window.open(repository.url, '_blank');
  };

  if (variant === 'card') {
    return (
      <Card 
        className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-md ${getTypeColor(repository.type)} ${className}`}
        onClick={handleClick}
      >
        <div className="flex items-center gap-3">
          {getIconForType(repository.type)}
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{repository.name}</h3>
            <p className="text-xs opacity-75">{repository.description}</p>
          </div>
          <ExternalLink className="w-4 h-4 opacity-60" />
        </div>
      </Card>
    );
  }

  return (
    <Button 
      onClick={handleClick}
      className={`${getTypeColor(repository.type)} px-6 py-4 flex items-center gap-3 transition-all duration-300 shadow-sm hover:shadow-md rounded-xl font-semibold text-base group ${className}`}
    >
      {getIconForType(repository.type)}
      {repository.name}
      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
    </Button>
  );
};

export const RepositoryGrid: React.FC<{ repositories: Repository[] }> = ({ repositories }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {repositories.map((repo) => (
        <RepositoryButton 
          key={repo.url} 
          repository={repo} 
          variant="card"
        />
      ))}
    </div>
  );
};
