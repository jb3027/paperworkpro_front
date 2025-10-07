"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { UserService } from '@/lib/services';
import { User } from '@/lib/mockData';
import { ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function Settings() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const avatarButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    loadUserData();
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

  const loadUserData = async () => {
    try {
      const userData = await UserService.me();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-zinc-900 dark:bg-[var(--dark-dark-green)] dark:text-zinc-100">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-[var(--dark-dark-green)] dark:text-zinc-100">
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

      {/* Back to Dashboard Link - positioned below navbar */}
      <div className="w-full px-6 py-4" style={{ marginTop: '100px' }}>
        <div className="max-w-4xl mx-auto">
          <Link 
              href="/"
              className="inline-flex items-center text-accent-green hover:text-accent-green-hover font-medium"
          >
              ← Back to Dashboard
          </Link>
        </div>
      </div>
            
      <div className="max-w-4xl mx-auto px-6 mt-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dark-green mb-2">
            Account Settings
          </h1>
          <p className="text-dark-green text-lg">
            Manage your account information and preferences
          </p>
        </div>

        {/* Settings Cards */}
        <div className="space-y-6">
          {/* Profile Information */}
          <Card className="bg-white border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-dark-green mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={user?.full_name || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-green focus:border-transparent"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-green focus:border-transparent"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={user?.role || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-green focus:border-transparent"
                  readOnly
                />
              </div>
            </div>
          </Card>

          {/* Security Settings
          <Card className="bg-white border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-dark-green mb-4">Security</h2>
            <div className="space-y-4">
              <button className="bg-accent-green text-dark-green px-4 py-2 rounded-md font-medium hover:bg-accent-green-hover transition-colors">
                Change Password
              </button>
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors ml-4">
                Two-Factor Authentication
              </button>
            </div>
          </Card> */}

          {/* Preferences
          <Card className="bg-white border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-dark-green mb-4">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Email Notifications</span>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Production Updates</span>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">File Upload Alerts</span>
                <input type="checkbox" className="rounded" />
              </div>
            </div>
          </Card> */}

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
    </div>
  );
}
