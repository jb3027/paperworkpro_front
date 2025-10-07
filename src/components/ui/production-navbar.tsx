"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ArrowLeft } from "lucide-react";
import { UserService } from "@/lib/services";
import { User } from "@/lib/mockData";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function ModeToggle() {
  const { setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
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

interface ProductionNavbarProps {
  productionId: string;
  onOpenBroadcast?: () => void;
}

export function ProductionNavbar({ productionId, onOpenBroadcast }: ProductionNavbarProps) {
  const [user, setUser] = useState<User | null>(null);
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

  const loadUserData = async () => {
    try {
      const userData = await UserService.me();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

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
      <nav className="nav-toolbar-modern nav-toolbar-inset relative w-auto">
      <div className="max-w-7xl mx-auto pt-8">
          {/* Back button */}
          <Link href="/">
            <Button variant="ghost" className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 mb-8 transition-all duration-200 rounded-xl px-4 py-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center h-full">
        <div className="flex flex-col sm:flex-row items-center gap-10">
                <Link href={`/production/${productionId}/edit-mode`}>
                  <Button className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-700 hover:via-emerald-600 hover:to-teal-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 group">
                    <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Paperwork
                  </Button>
                </Link>
                
                <Button 
                  onClick={handleBroadcastMode}
                  className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 hover:from-red-700 hover:via-red-600 hover:to-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-red-500/25 transition-all duration-300 group">
                  <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Broadcast Mode
                </Button>
              </div>
            </div>

        <div className="toolbar-group right">
          <div className="flex items-center gap-2">
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
            <div className="ml-2 mr-10"><ModeToggle /></div>
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
