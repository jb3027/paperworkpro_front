"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { UserService, FileService } from '@/lib/services';
import { User, File } from '@/lib/mockData';
import { 
  Plus, Upload, Search, Grid, List, 
  FileText, Film, Calendar, DollarSign, FileCheck, 
  ClipboardList, ShieldCheck, Receipt, MoreVertical, 
  Trash2, ExternalLink, Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const fileTypeIcons = {
  contract: { icon: FileCheck, color: "text-[#f59e0b]", bg: "bg-[#f59e0b]/20" },
  script: { icon: Film, color: "text-[#0d9488]", bg: "bg-[#0d9488]/20" },
  schedule: { icon: Calendar, color: "text-[#10b981]", bg: "bg-[#10b981]/20" },
  budget: { icon: DollarSign, color: "text-[#991b1b]", bg: "bg-[#991b1b]/20" },
  call_sheet: { icon: ClipboardList, color: "text-[#065f46]", bg: "bg-[#065f46]/20" },
  release_form: { icon: FileCheck, color: "text-[#f59e0b]", bg: "bg-[#f59e0b]/20" },
  permit: { icon: ShieldCheck, color: "text-[#10b981]", bg: "bg-[#10b981]/20" },
  invoice: { icon: Receipt, color: "text-[#991b1b]", bg: "bg-[#991b1b]/20" },
  other: { icon: FileText, color: "text-gray-400", bg: "bg-gray-700/20" }
};

export default function FilesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editMode, setEditMode] = useState(false);

  const filterFiles = useCallback(() => {
    let filtered = files;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(file =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(file => file.file_type === filterType);
    }

    setFilteredFiles(filtered);
  }, [files, searchTerm, filterType]);

  const loadData = async () => {
    try {
      const [userData, filesData] = await Promise.all([
        UserService.me(),
        FileService.getAll()
      ]);
      
      setUser(userData);
      setFiles(filesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterFiles();
  }, [files, searchTerm, filterType, filterFiles]);

  const handleDeleteFile = async (fileId: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await FileService.delete(fileId);
        setFiles(files.filter(f => f.id !== fileId));
      } catch (error) {
        console.error('Error deleting file:', error);
        alert('Failed to delete file');
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        await FileService.upload(file);
      }
      await loadData(); // Reload files
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files');
    }
  };

  const canEdit = user?.role === 'admin' || user?.role === 'editor';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-zinc-900 dark:bg-[var(--dark-dark-green)] dark:text-zinc-100">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-white text-zinc-900 dark:bg-[var(--dark-dark-green)] dark:text-zinc-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#fafaf9] mb-2">File Management</h1>
              <p className="text-gray-400">
                Manage and organize your production files
              </p>
            </div>
            {canEdit && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-[#065f46] hover:text-[#fafaf9]"
                  onClick={() => setEditMode(!editMode)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {editMode ? 'Exit Edit' : 'Edit Mode'}
                </Button>
                <label htmlFor="file-upload">
                  <Button className="bg-[#065f46] hover:bg-[#065f46]/80 text-[#fafaf9]" asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Files
                    </span>
                  </Button>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button className="bg-[#0d9488] hover:bg-[#0d9488]/80 text-[#fafaf9]">
                  <Plus className="w-4 h-4 mr-2" />
                  Create File
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#1e293b] border-gray-800 text-[#fafaf9]"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <option value="all">All Types</option>
              <option value="contract">Contract</option>
              <option value="script">Script</option>
              <option value="schedule">Schedule</option>
              <option value="budget">Budget</option>
              <option value="call_sheet">Call Sheet</option>
              <option value="release_form">Release Form</option>
              <option value="permit">Permit</option>
              <option value="invoice">Invoice</option>
              <option value="other">Other</option>
            </Select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-[#065f46] text-[#fafaf9]' : 'border-gray-700 text-gray-300'}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-[#065f46] text-[#fafaf9]' : 'border-gray-700 text-gray-300'}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Files Grid/List */}
        {filteredFiles.length === 0 ? (
          <Card className="bg-[#1e293b] border-gray-800 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#fafaf9] mb-2">No files found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Upload or create your first file to get started'
              }
            </p>
            {canEdit && (
              <div className="flex gap-3 justify-center">
                <label htmlFor="file-upload-empty">
                  <Button className="bg-[#065f46] hover:bg-[#065f46]/80 text-[#fafaf9]" asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Files
                    </span>
                  </Button>
                </label>
                <input
                  id="file-upload-empty"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-[#065f46] hover:text-[#fafaf9]">
                  <Plus className="w-4 h-4 mr-2" />
                  Create File
                </Button>
              </div>
            )}
          </Card>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {filteredFiles.map((file) => {
              const fileTypeConfig = fileTypeIcons[file.file_type] || fileTypeIcons.other;
              const IconComponent = fileTypeConfig.icon;

              if (viewMode === 'list') {
                return (
                  <Card key={file.id} className="bg-[#1e293b] border-gray-800 p-4 hover:border-[#0d9488] transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`w-12 h-12 rounded-lg ${fileTypeConfig.bg} flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className={`w-6 h-6 ${fileTypeConfig.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[#fafaf9] font-semibold truncate">{file.name}</h3>
                          <p className="text-gray-400 text-sm">
                            {new Date(file.created_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <Badge className="bg-[#065f46]/20 text-[#10b981] border-[#065f46]/30 border flex-shrink-0">
                        {file.file_type.replace(/_/g, ' ')}
                      </Badge>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {file.file_url && (
                          <a
                            href={file.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#10b981]">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </a>
                        )}
                        {editMode && canEdit && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#fafaf9]">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-[#1e293b] border-gray-800">
                              <DropdownMenuItem 
                                onClick={() => handleDeleteFile(file.id)} 
                                className="text-[#991b1b] focus:text-[#991b1b]"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              }

              return (
                <Card key={file.id} className="group relative bg-[#1e293b] rounded-2xl p-5 border border-gray-800 hover:border-[#0d9488] transition-all duration-300 shadow-lg hover:shadow-[#0d9488]/10">
                  {editMode && canEdit && (
                    <div className="absolute top-3 right-3 z-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="w-8 h-8 bg-dark-green/80 backdrop-blur-sm text-gray-400 hover:text-[#fafaf9] hover:bg-dark-green"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#1e293b] border-gray-800">
                          <DropdownMenuItem 
                            onClick={() => handleDeleteFile(file.id)} 
                            className="text-[#991b1b] focus:text-[#991b1b]"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}

                  <div className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-2xl ${fileTypeConfig.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`w-8 h-8 ${fileTypeConfig.color}`} />
                    </div>

                    <h3 className="text-[#fafaf9] font-semibold mb-1 line-clamp-2 text-sm">
                      {file.name}
                    </h3>

                    <p className="text-gray-500 text-xs mb-3">
                      {new Date(file.created_date).toLocaleDateString()}
                    </p>

                    <Badge className="bg-[#065f46]/20 text-[#10b981] border-[#065f46]/30 border text-xs">
                      {file.file_type.replace(/_/g, ' ')}
                    </Badge>

                    {file.file_url && (
                      <a
                        href={file.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 text-[#0d9488] hover:text-[#10b981] text-xs font-medium flex items-center gap-1 transition-colors duration-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Open File
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
