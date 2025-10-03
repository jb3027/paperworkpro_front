import React, { createContext, useContext, useState } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
  children: React.ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

export function Sidebar({ children, className = '' }: SidebarProps) {
  const context = useContext(SidebarContext);
  if (!context) throw new Error('Sidebar must be used within SidebarProvider');

  const { isOpen } = context;

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden ${className}`}>
      {children}
    </aside>
  );
}

interface SidebarHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarHeader({ children, className = '' }: SidebarHeaderProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

interface SidebarContentProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarContent({ children, className = '' }: SidebarContentProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

interface SidebarGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarGroup({ children, className = '' }: SidebarGroupProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

interface SidebarGroupContentProps {
  children: React.ReactNode;
}

export function SidebarGroupContent({ children }: SidebarGroupContentProps) {
  return (
    <div>
      {children}
    </div>
  );
}

interface SidebarMenuProps {
  children: React.ReactNode;
}

export function SidebarMenu({ children }: SidebarMenuProps) {
  return (
    <ul className="space-y-1">
      {children}
    </ul>
  );
}

interface SidebarMenuItemProps {
  children: React.ReactNode;
}

export function SidebarMenuItem({ children }: SidebarMenuItemProps) {
  return (
    <li>
      {children}
    </li>
  );
}

interface SidebarMenuButtonProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

export function SidebarMenuButton({ children, asChild = false, className = '' }: SidebarMenuButtonProps) {
  if (asChild) {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <button className={`w-full text-left ${className}`}>
      {children}
    </button>
  );
}

interface SidebarFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarFooter({ children, className = '' }: SidebarFooterProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

interface SidebarTriggerProps {
  className?: string;
}

export function SidebarTrigger({ className = '' }: SidebarTriggerProps) {
  const context = useContext(SidebarContext);
  if (!context) throw new Error('SidebarTrigger must be used within SidebarProvider');

  const { isOpen, setIsOpen } = context;

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className={className}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}
