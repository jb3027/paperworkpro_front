"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { UserService, ProductionService } from '@/lib/services';
import { User, Production } from '@/lib/mockData';

interface CreateProductionData {
  name: string;
  description?: string;
  status?: 'pre_production' | 'in_production' | 'post_production' | 'completed' | 'archived';
  start_date?: string;
  color?: string;
}
import { Lock, LockOpen, ChevronDown, Plus, ArrowUpDown } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import CreateProductionModal from '@/app/components/productions/createProductionModal';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/app/components/ui/dropdown-menu';

type SortOption = 'date_created' | 'start_date' | 'name';
type ProductionStatus = 'pre_production' | 'in_production' | 'post_production' | 'completed' | 'archived';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [productions, setProductions] = useState<Production[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('date_created');
  const [selectedStatuses, setSelectedStatuses] = useState<Set<ProductionStatus | 'all'>>(new Set(['all']));
  const avatarButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-dropdown') && !target.closest('.dropdown-menu-portal')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleAvatarClick = () => {
    if (avatarButtonRef.current) {
      const rect = avatarButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        right: window.innerWidth - rect.right - window.scrollX
      });
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const loadData = async () => {
    try {
      const [userData, productionsData] = await Promise.all([
        UserService.me(),
        ProductionService.getAll()
      ]);
      
      setUser(userData);
      setProductions(productionsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProduction = async (formData: CreateProductionData) => {
    try {
      const newProduction = await ProductionService.create(formData);
      setProductions(prev => [...prev, newProduction]);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating production:', error);
    }
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  const hasAccess = (production: Production) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return production.members?.includes(user.email) || false;
  };

  const filterProductions = (productions: Production[], statuses: Set<ProductionStatus | 'all'>): Production[] => {
    if (statuses.has('all')) {
      return productions;
    }
    return productions.filter(production => {
      const status = production.status || 'pre_production';
      return statuses.has(status);
    });
  };

  const sortProductions = (productions: Production[], sortOption: SortOption): Production[] => {
    return [...productions].sort((a, b) => {
      switch (sortOption) {
        case 'date_created':
          const dateA = a.created_date ? new Date(a.created_date).getTime() : 0;
          const dateB = b.created_date ? new Date(b.created_date).getTime() : 0;
          return dateB - dateA; // Most recent first
        case 'start_date':
          const startA = a.start_date ? new Date(a.start_date).getTime() : 0;
          const startB = b.start_date ? new Date(b.start_date).getTime() : 0;
          return startA - startB; // Earliest first
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  };

  const handleStatusToggle = (status: ProductionStatus | 'all') => {
    setSelectedStatuses(prev => {
      const newSet = new Set(prev);
      if (status === 'all') {
        if (newSet.has('all')) {
          newSet.clear();
          newSet.add('all');
        } else {
          newSet.clear();
          newSet.add('all');
        }
      } else {
        newSet.delete('all');
        if (newSet.has(status)) {
          newSet.delete(status);
          if (newSet.size === 0) {
            newSet.add('all');
          }
        } else {
          newSet.add(status);
        }
      }
      return newSet;
    });
  };

  const filteredProductions = filterProductions(productions, selectedStatuses);
  const sortedProductions = sortProductions(filteredProductions, sortBy);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-green flex items-center justify-center">
        <div className="text-[#fafaf9] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--white)' }}>

      <nav className="nav-toolbar">
          <div className="toolbar-group left">
            <span className="brand-text">PaperworkPRO</span>
          </div>

          <div className="toolbar-group right">
            <div className="user-dropdown">
              <span className="welcome-text">Welcome, {user?.full_name || 'User'}</span>
              <button 
                ref={avatarButtonRef}
                className="user-avatar-button"
                onClick={handleAvatarClick}
              >
                <div className="user-avatar">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                </div>
                <ChevronDown className={`chevron ${isDropdownOpen ? 'open' : ''}`} />
              </button>
            </div>
          </div>
      </nav>

      <div className="max-w-7xl mx-auto pt-32">
        {/* Header */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold text-dark-green">
              Your Productions
            </h1>
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline"
                    className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 flex items-center gap-2"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                    Sort by: {sortBy === 'date_created' ? 'Date Created' : sortBy === 'start_date' ? 'Start Date' : 'Name'}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg">
                  <DropdownMenuItem 
                    onClick={() => setSortBy('date_created')}
                    className="hover:bg-gray-100"
                  >
                    Date Created
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortBy('start_date')}
                    className="hover:bg-gray-100"
                  >
                    Start Date
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortBy('name')}
                    className="hover:bg-gray-100"
                  >
                    Name
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-[#065f46] to-[#0d9488] hover:from-[#064e3b] hover:to-[#0f766e] text-[#fafaf9] px-6 py-3 flex items-center gap-2 transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                Create New Production
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-8">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter by Status</h3>
            <div className="flex flex-wrap gap-4">
              {/* All checkbox */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedStatuses.has('all')}
                  onChange={() => handleStatusToggle('all')}
                  className="w-4 h-4 text-[#065f46] bg-white border-gray-300 rounded focus:ring-[#065f46] focus:ring-2 accent-[#065f46]"
                />
                <span className="text-sm text-gray-700 font-medium">All</span>
              </label>
              
              {/* Status checkboxes */}
              {(['pre_production', 'in_production', 'post_production', 'completed', 'archived'] as ProductionStatus[]).map((status) => (
                <label key={status} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedStatuses.has(status)}
                    onChange={() => handleStatusToggle(status)}
                    className="w-4 h-4 text-[#065f46] bg-white border-gray-300 rounded focus:ring-[#065f46] focus:ring-2 accent-[#065f46]"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {status.replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Productions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProductions.map((production) => {
            const userHasAccess = hasAccess(production);
            
            return (
              <Link 
                key={production.id} 
                href={userHasAccess ? `/production/${production.id}` : '#'}
                className={!userHasAccess ? 'pointer-events-none' : ''}
              >
                <motion.div
                  whileHover={userHasAccess ? { scale: 1.02, y: -4 } : {}}
                  transition={{ duration: 0.2 }}
                >
                  <Card className={`bg-[#1e293b] border-gray-800 p-6 transition-all duration-300 relative overflow-hidden ${
                    userHasAccess 
                      ? 'hover:border-[#0d9488] hover:shadow-lg hover:shadow-[#0d9488]/20 cursor-pointer' 
                      : 'opacity-60 cursor-not-allowed'
                  }`}>
                    {/* Theme color accent bar */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-1"
                      style={{ backgroundColor: production.color || '#065f46' }}
                    />
                    
                    {/* Lock icon */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#fafaf9] mb-2">
                          {production.name}
                        </h3>
                      </div>
                      <div 
                        className="p-3 rounded-lg"
                        style={{ 
                          backgroundColor: userHasAccess 
                            ? '#065f4620' 
                            : '#991b1b20'
                        }}
                      >
                        {userHasAccess ? (
                          <LockOpen 
                            className="w-6 h-6 text-[#10b981]" 
                          />
                        ) : (
                          <Lock className="w-6 h-6 text-[#991b1b]" />
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {production.description || 'No description available'}
                    </p>
                    
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
                      <span className="text-gray-500 text-xs">
                        Created {production.created_date ? new Date(production.created_date).toLocaleDateString() : 'Unknown'}
                      </span>
                      <span 
                        className="text-xs font-semibold"
                        style={{ 
                          color: userHasAccess 
                            ? (production.color || '#065f46') 
                            : '#991b1b'
                        }}
                      >
                        {userHasAccess ? '' : 'No Access'}
                      </span>
                    </div>
                  </Card>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {sortedProductions.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No productions available</p>
          </div>
        )}
      </div>

      {/* Portal Dropdown */}
      {isDropdownOpen && typeof window !== 'undefined' && createPortal(
        <div 
          className="dropdown-menu-portal"
          style={{
            position: 'absolute',
            top: dropdownPosition.top,
            right: dropdownPosition.right,
            zIndex: 10000
          }}
        >
          <div className="dropdown-menu">
            <Link href="/settings" className="dropdown-item">
              Manage Account
            </Link>
            <button className="dropdown-item logout-item">
              Logout
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* Create Production Modal */}
      {isCreateModalOpen && (
        <CreateProductionModal
          onClose={handleCloseModal}
          onSubmit={handleCreateProduction}
        />
      )}
    </div>
  );
}
