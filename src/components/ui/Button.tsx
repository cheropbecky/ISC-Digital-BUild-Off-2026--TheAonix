/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Standard Button Component
 * Follows UEAB Design System:
 * Primary: Solid #0B2A6F, hovers dynamically to #F2B705 with #071B4A text.
 * Min height 44px for touch targets.
 */

import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 select-none whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2B705] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'min-h-[36px] px-3 text-xs gap-1.5',
    md: 'min-h-[44px] px-4 text-sm gap-2',
    lg: 'min-h-[48px] px-6 text-base gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[#0B2A6F] text-white hover:bg-[#F2B705] hover:text-[#071B4A] shadow-sm hover:shadow active:bg-[#DDA704] dark:bg-[#1E3A8A] dark:hover:bg-[#F2B705] dark:hover:text-[#071B4A]',
    secondary:
      'bg-white text-[#0B2A6F] border border-[#0B2A6F] hover:bg-[#0B2A6F]/8 dark:bg-transparent dark:text-[#93C5FD] dark:border-[#93C5FD] dark:hover:bg-[#93C5FD]/10',
    ghost:
      'bg-transparent text-[#5B6475] hover:bg-slate-100 hover:text-[#0B2A6F] dark:text-[#94A3B8] dark:hover:bg-slate-800 dark:hover:text-white',
    danger:
      'bg-[#DC2626] text-white hover:bg-[#B91C1C] shadow-sm active:bg-[#991B1B]',
    gold:
      'bg-[#F2B705] text-[#071B4A] hover:bg-[#DDA704] shadow-sm active:bg-[#B58500]',
  };

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};
