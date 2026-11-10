/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Real-Time Toast Notifications Container
 */

import React from 'react';
import { useKampasStore } from '../../lib/store';
import { Badge } from './Badge';
import { Bell, CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useKampasStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isTimetableSuccess = toast.type === 'timetable_scanned';
        const icon =
          toast.priority === 'urgent' ? (
            <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0" />
          ) : toast.priority === 'important' ? (
            <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
          );

        return (
          <div
            key={toast.id}
            role={isTimetableSuccess ? 'status' : undefined}
            aria-live={isTimetableSuccess ? 'polite' : undefined}
            className={`pointer-events-auto bg-white dark:bg-[#0C1D3D] border border-[#E3E8F0] dark:border-[#1E3158] rounded-xl shadow-xl p-4 flex items-start gap-3 animate-in slide-in-from-top-2 duration-200 ${isTimetableSuccess ? 'border-[#CBD9F5] font-light' : ''}`}
          >
            {!isTimetableSuccess && icon}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className={`truncate ${isTimetableSuccess ? 'text-sm font-light tracking-wide' : 'text-xs font-bold'} text-[#071B4A] dark:text-white`}>
                  {toast.title}
                </span>
                {!isTimetableSuccess && <Badge
                  variant={toast.priority === 'urgent' ? 'urgent' : toast.priority === 'important' ? 'soon' : 'done'}
                >{toast.priority.toUpperCase()}</Badge>}
              </div>
              <p className={`${isTimetableSuccess ? 'text-xs font-light tracking-wide' : 'text-xs'} text-[#5B6475] dark:text-[#94A3B8] line-clamp-2 leading-relaxed`}>
                {toast.body}
              </p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
