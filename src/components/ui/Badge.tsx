/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Status Chips & Badges
 */

import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps {
  variant?: 'done' | 'soon' | 'urgent' | 'academic' | 'neutral' | 'gold';
  children: React.ReactNode;
  showDot?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'academic',
  children,
  showDot = false,
  className,
  onClick,
}) => {
  const variantStyles = {
    done: 'bg-[#DCFCE7] text-[#16A34A] dark:bg-[#064E3B]/40 dark:text-[#4ADE80]',
    soon: 'bg-[#FEF3C7] text-[#D97706] dark:bg-[#78350F]/40 dark:text-[#FCD34D]',
    urgent: 'bg-[#FEE2E2] text-[#DC2626] dark:bg-[#7F1D1D]/40 dark:text-[#F87171]',
    academic: 'bg-[#EEF2F6] text-[#0B2A6F] dark:bg-[#1E293B] dark:text-[#93C5FD]',
    neutral: 'bg-slate-100 text-[#5B6475] dark:bg-slate-800 dark:text-slate-300',
    gold: 'bg-[#FEF3C7] text-[#854D0E] border border-[#F2B705]/40 dark:bg-[#713F12]/40 dark:text-[#FEF08A]',
  };

  const dotColors = {
    done: 'bg-[#16A34A]',
    soon: 'bg-[#D97706]',
    urgent: 'bg-[#DC2626]',
    academic: 'bg-[#0B2A6F]',
    neutral: 'bg-[#5B6475]',
    gold: 'bg-[#F2B705]',
  };

  return (
    <span
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 h-[26px] px-2.5 rounded-full text-xs font-semibold whitespace-nowrap select-none',
        variantStyles[variant],
        onClick && 'cursor-pointer hover:opacity-80 transition-opacity',
        className
      )}
    >
      {showDot && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />
      )}
      {children}
    </span>
  );
};
