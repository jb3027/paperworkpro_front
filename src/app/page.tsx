"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { UserService, ProductionService } from '@/lib/services';
import { User, Production } from '@/lib/mockData';
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

interface CreateProductionData {
  name: string;
  description?: string;
  status?: 'pre_production' | 'in_production' | 'post_production' | 'completed' | 'archived';
  start_date?: string;
  color?: string;
}
import { Lock, LockOpen, ChevronDown, Plus, SortAsc } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import CreateProductionModal from '@/app/components/modals/createProductionModal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

function ModeToggle() {
  const { setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="bg-white hover:bg-gray-50">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" sideOffset={16} className="!min-w-0 w-fit">
        <DropdownMenuItem
          className="hover:bg-[var(--accent-green)] hover:text-white focus:bg-[var(--accent-green)] focus:text-white"
          onClick={() => setTheme("light")}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:bg-[var(--accent-green)] hover:text-white focus:bg-[var(--accent-green)] focus:text-white"
          onClick={() => setTheme("dark")}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:bg-[var(--accent-green)] hover:text-white focus:bg-[var(--accent-green)] focus:text-white"
          onClick={() => setTheme("system")}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [productions, setProductions] = useState<Production[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const avatarButtonRef = useRef<HTMLButtonElement>(null);
  const [sortBy, setSortBy] = useState<'created' | 'start' | 'name'>('created');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set(['all']));

  const allStatuses: Array<NonNullable<Production['status']>> = [
    'pre_production',
    'in_production',
    'post_production',
    'completed',
    'archived'
  ];

  const getSortLabel = (sortType: string) => {
    switch (sortType) {
      case 'created': return 'Date Created';
      case 'start': return 'Start Date';
      case 'name': return 'Name';
      default: return 'Date Created';
    }
  };

  const statusLabel = (status: string) => status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const isAllSelected = useMemo(() => selectedStatuses.has('all') || allStatuses.every(s => selectedStatuses.has(s)), [selectedStatuses]);

  const toggleStatus = (key: string) => {
    setSelectedStatuses(prev => {
      const next = new Set(prev);
      
      if (key === 'all') {
        // If All is currently selected, deselect it and select all individual statuses
        if (isAllSelected) {
          return new Set(allStatuses);
        }
        // If All is not selected, select it (which means all individual statuses are selected)
        return new Set(['all']);
      }
      
      // Handle individual status toggles
      if (next.has('all')) {
        // If All is selected, deselect it and select all other statuses except the one being toggled
        next.delete('all');
        allStatuses.forEach(status => {
          if (status !== key) {
            next.add(status);
          }
        });
      } else {
        // Normal toggle behavior when All is not selected
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }
        
        // Only switch to "All" if ALL individual statuses are manually selected
        if (allStatuses.every(s => next.has(s))) {
          return new Set(['all']);
        }
      }
      
      // If no statuses are selected, default to "All"
      if (next.size === 0) {
        return new Set(['all']);
      }
      
      return next;
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const clickedInsideAvatarArea = !!target.closest('.user-dropdown-modern') || !!target.closest('.user-avatar-button');
      const clickedInsidePortal = !!target.closest('.dropdown-menu-portal');
      if (!clickedInsideAvatarArea && !clickedInsidePortal) {
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


  const displayedProductions = useMemo(() => {
    let list = [...productions];

    // Filter by status
    if (!isAllSelected) {
      list = list.filter(p => !p.status ? true : selectedStatuses.has(p.status));
    }

    // Sort
    if (sortBy === 'created') {
      list.sort((a, b) => {
        const ad = a.created_date ? Date.parse(a.created_date) : 0;
        const bd = b.created_date ? Date.parse(b.created_date) : 0;
        return bd - ad; // newest first
      });
    } else if (sortBy === 'start') {
      list.sort((a, b) => {
        const ad = a.start_date ? Date.parse(a.start_date) : Number.MAX_SAFE_INTEGER;
        const bd = b.start_date ? Date.parse(b.start_date) : Number.MAX_SAFE_INTEGER;
        return ad - bd; // earliest start first
      });
    } else if (sortBy === 'name') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return list;
  }, [productions, selectedStatuses, sortBy, isAllSelected]);

  // Status-driven color mapping aligned with CreateProductionModal
  const getStatusColors = (status?: string) => {
    const colorMap = {
      pre_production: {
        primary: '#065f46',
        secondary: '#0d9488',
        accent: '#35c29a',
        background: '#073229',
        text: '#fafaf9',
        textSecondary: '#e2e8f0',
        border: '#35c29a'
      },
      in_production: {
        primary: '#7c2d12',
        secondary: '#dc2626',
        accent: '#f87171',
        background: '#431407',
        text: '#fef2f2',
        textSecondary: '#fecaca',
        border: '#f87171'
      },
      post_production: {
        primary: '#9a3412',
        secondary: '#ea580c',
        accent: '#fb923c',
        background: '#431407',
        text: '#fff7ed',
        textSecondary: '#fed7aa',
        border: '#fb923c'
      },
      completed: {
        primary: '#a16207',
        secondary: '#eab308',
        accent: '#fde047',
        background: '#451a03',
        text: '#fefce8',
        textSecondary: '#fef3c7',
        border: '#fde047'
      },
      archived: {
        primary: '#0f766e',
        secondary: '#14b8a6',
        accent: '#5eead4',
        background: '#042f2e',
        text: '#f0fdfa',
        textSecondary: '#ccfbf1',
        border: '#5eead4'
      }
    } as const;
    return colorMap[(status as keyof typeof colorMap) || 'pre_production'];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <nav className="nav-toolbar-modern">
          <div className="toolbar-group left">
            <span className="brand-text-modern">PaperworkPRO</span>
          </div>
          <div className="toolbar-group right">
            <div className="user-dropdown-modern">
              <span className="welcome-text-modern">Loading...</span>
              <div className="ml-5"><ModeToggle /></div>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto pt-32 flex items-center justify-center">
          <div className="text-slate-700 text-xl font-semibold">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">

      {/* Top nav without sidebar: brand on the left */}
      <nav className="nav-toolbar-modern">
        <div className="toolbar-group left">
          <span className="brand-text-modern">PaperworkPRO</span>
        </div>
        <div className="toolbar-group right">
          <div className="user-dropdown-modern">
            <span className="welcome-text-modern">Welcome, {user?.full_name || 'User'}</span>
            <button 
              ref={avatarButtonRef}
              className="user-avatar-button"
              onClick={handleAvatarClick}
            >
              <div className="user-avatar">
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </div>              
              </button>
          </div>
          <div className="ml-5"><ModeToggle /></div>
        </div>
      </nav>

      <div className="flex flex-col overflow-y-auto mt-30">
        <div className="max-w-7xl mx-auto px-6 pb-8 relative z-10 flex-1">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-clip-text text-[var(--dark-green)] mb-4 tracking-tight">
              Your Productions
            </h1>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-700 hover:via-emerald-600 hover:to-teal-600 text-white px-8 py-4 flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 rounded-xl font-semibold text-base group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Create New Production
            </Button>
            
            <DropdownMenu open={isSortDropdownOpen} onOpenChange={setIsSortDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 flex items-center gap-3 px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 font-medium">
                  <SortAsc className="w-4 h-4" />
                  Sort by: {getSortLabel(sortBy)}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border border-slate-200 rounded-xl shadow-xl p-2 min-w-[200px]">
                <DropdownMenuItem 
                  onClick={() => {
                    setSortBy('created');
                    setIsSortDropdownOpen(false);
                  }} 
                  className="hover:bg-emerald-50 hover:text-emerald-700 rounded-lg px-3 py-2 cursor-pointer transition-colors duration-200"
                >
                  Date Created (newest)
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    setSortBy('start');
                    setIsSortDropdownOpen(false);
                  }} 
                  className="hover:bg-emerald-50 hover:text-emerald-700 rounded-lg px-3 py-2 cursor-pointer transition-colors duration-200"
                >
                  Start Date (earliest)
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    setSortBy('name');
                    setIsSortDropdownOpen(false);
                  }} 
                  className="hover:bg-emerald-50 hover:text-emerald-700 rounded-lg px-3 py-2 cursor-pointer transition-colors duration-200"
                >
                  Name (A–Z)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-12">
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 shadow-sm mt-[-8]">
            <div className="flex flex-wrap items-center gap-6">
              <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Filter by Status:</span>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleStatus('all')}>
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      checked={isAllSelected} 
                      readOnly 
                      className="w-5 h-5 accent-emerald-500 cursor-pointer opacity-0 absolute" 
                    />
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                      isAllSelected 
                        ? 'bg-emerald-500 border-emerald-500' 
                        : 'border-slate-300 group-hover:border-emerald-400'
                    }`}>
                      {isAllSelected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-emerald-600 transition-colors duration-200">All</span>
                </div>
                {allStatuses.map(s => (
                  <div key={s} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleStatus(s)}>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={isAllSelected ? true : selectedStatuses.has(s)} 
                        readOnly 
                        className="w-5 h-5 accent-emerald-500 cursor-pointer opacity-0 absolute" 
                      />
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                        isAllSelected ? true : selectedStatuses.has(s)
                          ? 'bg-emerald-500 border-emerald-500' 
                          : 'border-slate-300 group-hover:border-emerald-400'
                      }`}>
                        {(isAllSelected ? true : selectedStatuses.has(s)) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-emerald-600 transition-colors duration-200">{statusLabel(s)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Productions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProductions.map((production) => {
            const userHasAccess = hasAccess(production);
            const colors = getStatusColors(production.status);
            const displayStatus = ((production.status || '').split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')) || 'Unknown';
            
            return (
              <Link 
                key={production.id} 
                href={userHasAccess ? `/production/${production.id}` : '#'}
                className={!userHasAccess ? 'pointer-events-none' : ''}
              >
                <motion.div
                  whileHover={userHasAccess ? { scale: 1.02, y: -8 } : {}}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="group"
                >
                  <Card className={`bg-white/90 backdrop-blur-sm border border-slate-200 p-8 transition-all duration-300 relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl hover:shadow-slate-200/50 ${
                    userHasAccess 
                      ? 'hover:border-emerald-300 cursor-pointer group-hover:bg-white' 
                      : 'opacity-60 cursor-not-allowed'
                  }`}>
                    {/* Status-colored accent bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${userHasAccess ? 'from-emerald-500 to-teal-500' : 'from-red-400 to-red-500'} rounded-t-2xl`} />
                    
                    {/* Header with lock icon */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1 pr-4">
                        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors duration-200">
                          {production.name}
                        </h3>
                        <div 
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium`} 
                          style={{ 
                            color: colors.text, 
                            backgroundColor: colors.accent,
                            border: `1px solid ${colors.border}`
                          }}
                        >
                          {displayStatus}
                        </div>
                      </div>
                      <div className={`p-3 rounded-xl transition-all duration-200 ${
                        userHasAccess 
                          ? 'bg-emerald-50 group-hover:bg-emerald-100' 
                          : 'bg-red-50'
                      }`}>
                        {userHasAccess ? (
                          <LockOpen className="w-6 h-6 text-emerald-600" />
                        ) : (
                          <Lock className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {production.description || 'No description available'}
                    </p>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-xs font-medium text-slate-500">
                          Created {production.created_date ? new Date(production.created_date).toLocaleDateString() : 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <span>View Details</span>
                        <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {productions.length === 0 && (
          <div className="text-center py-24">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No productions yet</h3>
              <p className="text-slate-600 mb-6">Get started by creating your first production project</p>
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Create Your First Production
              </Button>
            </div>
          </div>
        )}
        </div>
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
          <div className="dropdown-menu-modern">
            <Link href="/settings" className="dropdown-item-modern">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Manage Account
            </Link>
            <button className="dropdown-item-modern logout-item-modern">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
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
