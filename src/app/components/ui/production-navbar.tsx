"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { UserService } from "@/lib/services";
import { User } from "@/lib/mockData";

interface ProductionNavbarProps {
  productionId: string;
}

export function ProductionNavbar({}: ProductionNavbarProps) {
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

  return (
    <>
      <nav className="nav-toolbar">
        <div className="toolbar-group left">
          <span className="brand-text">PaperworkPRO</span>
        </div>

        <div className="toolbar-group right">
          <div className="flex items-center gap-3">
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
        </div>
      </nav>

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
