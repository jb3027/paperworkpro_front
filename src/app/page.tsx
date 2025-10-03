"use client";

import React, { useState, useEffect } from 'react';
import { UserService, FileService, ProductionService } from '@/lib/services';
import { User, File, Production } from '@/lib/mockData';
import { Folder, Plus, Upload, Users, FileText, Settings } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import Link from 'next/link';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [productions, setProductions] = useState<Production[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userData, filesData, productionsData] = await Promise.all([
        UserService.me(),
        FileService.getAll(),
        ProductionService.getAll()
      ]);
      
      setUser(userData);
      setFiles(filesData);
      setProductions(productionsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canEdit = user?.role === 'admin' || user?.role === 'editor';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-[#fafaf9] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#fafaf9] mb-2">
            Welcome back, {user?.full_name || 'User'}!
          </h1>
          <p className="text-gray-400">
            Manage your production files and documents
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#1e293b] border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Files</p>
                <p className="text-2xl font-bold text-[#fafaf9]">{files.length}</p>
              </div>
              <FileText className="w-8 h-8 text-[#0d9488]" />
            </div>
          </Card>

          <Card className="bg-[#1e293b] border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Productions</p>
                <p className="text-2xl font-bold text-[#fafaf9]">{productions.length}</p>
              </div>
              <Folder className="w-8 h-8 text-[#f59e0b]" />
            </div>
          </Card>

          <Card className="bg-[#1e293b] border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Your Role</p>
                <Badge className={`mt-1 ${
                  user?.role === 'admin' ? 'bg-[#f59e0b]/20 text-[#f59e0b]' :
                  user?.role === 'editor' ? 'bg-[#0d9488]/20 text-[#0d9488]' :
                  'bg-gray-700/20 text-gray-400'
                }`}>
                  {user?.role?.toUpperCase()}
                </Badge>
              </div>
              <Users className="w-8 h-8 text-[#10b981]" />
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#fafaf9] mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            {canEdit && (
              <>
                <Button className="bg-[#065f46] hover:bg-[#065f46]/80 text-[#fafaf9]">
                  <Plus className="w-4 h-4 mr-2" />
                  Create File
                </Button>
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-[#065f46] hover:text-[#fafaf9]">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </Button>
              </>
            )}
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-[#065f46] hover:text-[#fafaf9]">
              <Folder className="w-4 h-4 mr-2" />
              View Productions
            </Button>
            {user?.role === 'admin' && (
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-[#065f46] hover:text-[#fafaf9]">
                <Settings className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
            )}
          </div>
        </div>

        {/* Recent Files */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#fafaf9]">Recent Files</h2>
            <Link href="/files">
              <Button variant="ghost" className="text-[#0d9488] hover:text-[#10b981]">
                View All
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.slice(0, 6).map((file) => (
              <Card key={file.id} className="bg-[#1e293b] border-gray-800 p-4 hover:border-[#0d9488] transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-[#fafaf9] font-medium truncate">{file.name}</h3>
                  <Badge className="bg-[#065f46]/20 text-[#10b981] text-xs">
                    {file.file_type.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  {new Date(file.created_date).toLocaleDateString()}
                </p>
                {file.file_url && (
                  <a
                    href={file.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0d9488] hover:text-[#10b981] text-sm font-medium"
                  >
                    Open File →
                  </a>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Productions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#fafaf9]">Productions</h2>
            <Link href="/productions">
              <Button variant="ghost" className="text-[#0d9488] hover:text-[#10b981]">
                View All
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productions.map((production) => (
              <Card key={production.id} className="bg-[#1e293b] border-gray-800 p-6 hover:border-[#0d9488] transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-[#fafaf9] font-semibold">{production.name}</h3>
                  <Folder className="w-5 h-5 text-[#f59e0b]" />
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  {production.description || 'No description available'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs">
                    Created {new Date(production.created_date).toLocaleDateString()}
                  </span>
                  <Link href={`/productions/${production.id}`}>
                    <Button size="sm" className="bg-[#065f46] hover:bg-[#065f46]/80 text-[#fafaf9]">
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
