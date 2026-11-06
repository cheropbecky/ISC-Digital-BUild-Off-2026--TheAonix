/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Card Component
 */

import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'md',
  hoverable = false,
  ...props
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4 sm:p-5',
    lg: 'p-5 sm:p-6',
  };

  return (
    <div
      className={cn(
        'bg-white dark:bg-[#0C1D3D] border border-[#E3E8F0] dark:border-[#1E3158] rounded-xl shadow-[0px_1px_3px_rgba(11,42,111,0.04),0px_4px_8px_rgba(11,42,111,0.02)] transition-all duration-150',
        paddingStyles[padding],
        hoverable &&
          'hover:border-[#CBD5E1] dark:hover:border-[#2D4575] hover:shadow-[0px_4px_12px_rgba(7,27,74,0.08)] cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
