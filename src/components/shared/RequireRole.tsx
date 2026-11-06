/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas RequireRole Route Guard
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useKampasStore } from '../../lib/store';
import { KampasRole } from '../../styles/tokens';
import { ShieldAlert, Clock, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface RequireRoleProps {
  allowedRoles: KampasRole[];
  children: React.ReactNode;
}

export const RequireRole: React.FC<RequireRoleProps> = ({ allowedRoles, children }) => {
  const { user, setRole } = useKampasStore();

  // 1. Check if user is pending approval (e.g. Alumnus or Employer signup)
  if (user.status === 'pending_approval') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-[#0C1D3D] border border-[#E3E8F0] dark:border-[#1E3158] rounded-2xl p-6 sm:p-8 text-center shadow-lg">
          <div className="w-14 h-14 bg-[#FEF3C7] text-[#D97706] rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-[#071B4A] dark:text-white mb-2">
            Awaiting Institutional Verification
          </h2>
          <p className="text-sm text-[#5B6475] dark:text-[#94A3B8] leading-relaxed mb-6">
            Your {user.role === 'alumnus' ? 'Alumni Profile' : 'Employer Account'} has been submitted to UEAB Alumni & Career Services for credential verification. Profiles remain hidden from public directories until approved.
          </p>
          <div className="p-3 bg-[#F7F9FC] dark:bg-slate-800 rounded-xl text-xs text-left mb-6 space-y-1">
            <div className="font-semibold text-slate-700 dark:text-slate-300">Submitted details:</div>
            <div className="text-slate-500 dark:text-slate-400">Name: {user.fullName}</div>
            <div className="text-slate-500 dark:text-slate-400">Email: {user.email}</div>
            <div className="text-slate-500 dark:text-slate-400">Role: {user.role.toUpperCase()}</div>
          </div>
          <div className="space-y-2">
            <Button
              className="w-full"
              variant="primary"
              onClick={() => {
                // Instantly approve in demo mode
                user.status = 'active';
                setRole(user.role);
              }}
            >
              Demo: Instant Admin Approve
            </Button>
            <Button
              className="w-full"
              variant="ghost"
              onClick={() => setRole('student')}
            >
              Switch back to Student
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Check Role Authorization
  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-[#0C1D3D] border border-[#E3E8F0] dark:border-[#1E3158] rounded-2xl p-6 text-center shadow-lg">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#071B4A] dark:text-white mb-1">
            Access Restricted
          </h2>
          <p className="text-xs text-[#5B6475] dark:text-[#94A3B8] mb-4">
            This module requires staff, lecturer, or administrator privileges. Students do not have permission to view management tools.
          </p>
          <div className="flex gap-2 justify-center">
            <Button
              size="sm"
              variant="primary"
              onClick={() => (window.location.hash = '#/home')}
            >
              Return Home
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setRole('staff')}
            >
              Switch to Staff Demo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
