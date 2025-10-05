import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'icon';
  children: React.ReactNode;
  asChild?: boolean;
}

export function Button({ 
  variant = 'default', 
  size = 'default', 
  className = '', 
  children, 
  asChild = false,
  ...props 
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer hover:cursor-grab active:cursor-grabbing';
  
  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground'
  };
  
  const sizeClasses = {
    default: 'h-10 py-2 px-4',
    icon: 'h-10 w-10'
  };

  if (asChild) {
    const { disabled: _disabled, form: _form, formAction: _formAction, formEncType: _formEncType, formMethod: _formMethod, formNoValidate: _formNoValidate, formTarget: _formTarget, name: _name, type: _type, value: _value, ...divProps } = props;
    return (
      <div 
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...(divProps as React.HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </div>
    );
  }

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}