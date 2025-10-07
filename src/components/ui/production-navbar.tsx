"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useUser } from "@/hooks/use-user";

interface ProductionNavbarProps {
  productionId: string;
  onOpenBroadcast?: () => void;
}

export function ProductionNavbar({ productionId, onOpenBroadcast }: ProductionNavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const avatarButtonRef = useRef<HTMLButtonElement>(null);
  const { state } = useSidebar();
  const { user, isLoading } = useUser();

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

  const handleBroadcastMode = () => {
    if (onOpenBroadcast) onOpenBroadcast();
  };

  return (
    <>
      <nav 
        className="nav-toolbar"
        style={{
          left: state === 'expanded' ? 'var(--sidebar-width)' : 'var(--sidebar-width-icon)',
          width: state === 'expanded' ? 'calc(100% - var(--sidebar-width))' : 'calc(100% - var(--sidebar-width-icon))',
          transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundColor: 'var(--white)',
          boxShadow: 'none',
          borderBottom: 'none'
        }}
      >
        <div className="flex items-center justify-center h-full flex-1">
          <div className="flex flex-col sm:flex-row items-center gap-10">
            <Link href={`/production/${productionId}/edit-mode`}>
              <Button className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-700 hover:via-emerald-600 hover:to-teal-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-md hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 group">
                <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Paperwork
              </Button>
            </Link>
            
            <Button 
              onClick={handleBroadcastMode}
              className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 hover:from-red-700 hover:via-red-600 hover:to-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-md hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300 group">
              <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Broadcast Mode
            </Button>
          </div>
        </div>

        <div className="toolbar-group right">
          <div className="flex items-center gap-2">
            {!isLoading && (
              <div className="user-dropdown">
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
            )}
            <div className="ml-2 mr-6"><ModeToggle /></div>
          </div>
        </div>
      </nav>

      {/* Portal Dropdown */}
      {isDropdownOpen && typeof window !== 'undefined' && createPortal(
        <div 
          className="dropdown-menu-portal"
          style={{
            position: 'absolute',
            zIndex: 10000,
            top: dropdownPosition.top,
            right: dropdownPosition.right,
            transition: 'none'
          }}
        >
          <div className="dropdown-menu">
            <a href="/settings" className="dropdown-item">
              Manage Account
            </a>
            <button className="dropdown-item logout-item">
              Logout
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
