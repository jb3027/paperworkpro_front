import React, { createContext, useContext, useState } from 'react';

interface DropdownMenuContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownMenuContext = createContext<DropdownMenuContextType | undefined>(undefined);

interface DropdownMenuProps {
  children: React.ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export function DropdownMenuTrigger({ children, asChild = false }: DropdownMenuTriggerProps) {
  const context = useContext(DropdownMenuContext);
  if (!context) throw new Error('DropdownMenuTrigger must be used within DropdownMenu');

  const { open, setOpen } = context;

  if (asChild) {
    return (
      <div onClick={() => setOpen(!open)}>
        {children}
      </div>
    );
  }

  return (
    <button onClick={() => setOpen(!open)}>
      {children}
    </button>
  );
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
}

export function DropdownMenuContent({ children, className = '' }: DropdownMenuContentProps) {
  const context = useContext(DropdownMenuContext);
  if (!context) throw new Error('DropdownMenuContent must be used within DropdownMenu');

  const { open } = context;

  if (!open) return null;

  return (
    <div className={`absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${className}`}>
      <div className="py-1">
        {children}
      </div>
    </div>
  );
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function DropdownMenuItem({ children, onClick, className = '' }: DropdownMenuItemProps) {
  const context = useContext(DropdownMenuContext);
  if (!context) throw new Error('DropdownMenuItem must be used within DropdownMenu');

  const { setOpen } = context;

  const handleClick = () => {
    if (onClick) onClick();
    setOpen(false);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${className}`}
    >
      {children}
    </button>
  );
}
