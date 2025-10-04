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
import { Lock, LockOpen, ChevronDown, Plus } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import CreateProductionModal from '@/app/components/productions/createProductionModal';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [productions, setProductions] = useState<Production[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-green flex items-center justify-center">
        <div className="text-[#fafaf9] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

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
          <h1 className="text-4xl font-bold text-dark-green mb-2">
            Your Productions
          </h1>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-[#065f46] to-[#0d9488] hover:from-[#064e3b] hover:to-[#0f766e] text-[#fafaf9] px-6 py-3 flex items-center gap-2 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Create New Production
          </Button>
        </div>

        {/* Productions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productions.map((production) => {
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
                    {/* Color accent bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1 ${
                      userHasAccess 
                        ? 'bg-gradient-to-r from-[#0d9488] to-[#10b981]' 
                        : 'bg-gradient-to-r from-[#991b1b] to-[#f59e0b]'
                    }`} />
                    
                    {/* Lock icon */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#fafaf9] mb-2">
                          {production.name}
                        </h3>
                      </div>
                      <div className={`p-3 rounded-lg ${
                        userHasAccess 
                          ? 'bg-[#0d9488]/20' 
                          : 'bg-[#991b1b]/20'
                      }`}>
                        {userHasAccess ? (
                          <LockOpen className={`w-6 h-6 text-[#10b981]`} />
                        ) : (
                          <Lock className={`w-6 h-6 text-[#991b1b]`} />
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
                      <span className={`text-xs font-semibold ${
                        userHasAccess ? 'text-[#10b981]' : 'text-[#991b1b]'
                      }`}>
                        {userHasAccess ? 'Access Granted' : 'No Access'}
                      </span>
                    </div>
                  </Card>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {productions.length === 0 && (
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
