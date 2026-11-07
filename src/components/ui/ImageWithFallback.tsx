/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Resilient Image Component with Skeleton Loader & Graceful Fallback
 */

import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  containerClassName?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'Kampas visual asset',
  className = 'w-full h-full object-cover',
  containerClassName = 'relative overflow-hidden bg-slate-100 dark:bg-slate-800',
  fallbackTitle,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // If no source or error, show graceful styled fallback container
  if (!src || error) {
    return (
      <div
        className={`${containerClassName} flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#071B4A]/10 to-[#0B2A6F]/20 dark:from-[#071B4A] dark:to-[#0B2A6F] border border-slate-200 dark:border-slate-700 min-h-[140px]`}
      >
        <ImageIcon className="w-8 h-8 text-[#0B2A6F]/40 dark:text-[#F2B705]/60 mb-2" />
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-1">
          {fallbackTitle || alt}
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
          UEAB Baraton Campus
        </span>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      {/* Skeleton pulse while image is loading */}
      {!loaded && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`${className} transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
};
