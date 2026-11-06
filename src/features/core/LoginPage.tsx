/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Authentication Page (Clerk & Student ID Gateway)
 * University of Eastern Africa, Baraton (UEAB)
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useKampasStore } from '../../lib/store';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import {
  GraduationCap,
  KeyRound,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser, setRole } = useKampasStore();

  const [authMode, setAuthMode] = useState<'student_id' | 'magic_link'>('student_id');
  const [studentId, setStudentId] = useState('S21/04589');
  const [email, setEmail] = useState('cheropbecky348@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<'student' | 'alumnus' | 'employer'>('student');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // If logging in as alumnus or employer, they might need approval or jump right in
      if (selectedRole === 'alumnus' || selectedRole === 'employer') {
        setUser((prev) => ({
          ...prev,
          role: selectedRole,
          status: 'pending_approval',
          fullName: selectedRole === 'alumnus' ? 'Edwin Bett (Alumnus)' : 'Tech Recruiters Africa',
          email,
        }));
      } else {
        setUser((prev) => ({
          ...prev,
          role: 'student',
          studentId: studentId.trim() || 'S21/04589',
          status: 'active',
          email,
        }));
      }

      // Check onboarding state
      if (!user.isOnboarded) {
        navigate('/onboarding');
      } else {
        navigate('/home');
      }
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6 px-4">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#0B2A6F] border-2 border-[#F2B705] flex items-center justify-center mx-auto mb-3 shadow-md">
            <GraduationCap className="w-8 h-8 text-[#F2B705]" />
          </div>
          <h1 className="text-2xl font-black text-[#071B4A] dark:text-white tracking-tight">
            Sign in to Kampas
          </h1>
          <p className="text-xs text-[#5B6475] dark:text-slate-400 mt-1">
            University of Eastern Africa, Baraton (UEAB)
          </p>
        </div>

        <Card padding="lg" className="shadow-xl">
          {/* Auth Mode Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg mb-6">
            <button
              type="button"
              onClick={() => setAuthMode('student_id')}
              className={`py-2 text-xs font-bold rounded-md transition-colors ${
                authMode === 'student_id'
                  ? 'bg-white dark:bg-[#071B4A] text-[#0B2A6F] dark:text-[#F2B705] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Student ID / Staff
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('magic_link')}
              className={`py-2 text-xs font-bold rounded-md transition-colors ${
                authMode === 'magic_link'
                  ? 'bg-white dark:bg-[#071B4A] text-[#0B2A6F] dark:text-[#F2B705] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Email Magic Link
            </button>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            {authMode === 'student_id' ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-[#071B4A] dark:text-slate-200 mb-1">
                    Student / Staff Registration Number
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="e.g. S21/04589 or EMP/0142"
                      required
                      className="w-full h-11 pl-10 pr-3 rounded-lg bg-[#F7F9FC] dark:bg-slate-900 border border-[#E3E8F0] dark:border-[#1E3158] text-sm text-[#0F172A] dark:text-white focus:outline-none focus:border-[#0B2A6F] focus:ring-2 focus:ring-[#F2B705]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#071B4A] dark:text-slate-200">
                      Password
                    </label>
                    <a href="#reset" className="text-[11px] text-[#0B2A6F] dark:text-[#93C5FD] font-semibold hover:underline">
                      Forgot?
                    </a>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full h-11 pl-10 pr-3 rounded-lg bg-[#F7F9FC] dark:bg-slate-900 border border-[#E3E8F0] dark:border-[#1E3158] text-sm text-[#0F172A] dark:text-white focus:outline-none focus:border-[#0B2A6F] focus:ring-2 focus:ring-[#F2B705]"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-bold text-[#071B4A] dark:text-slate-200 mb-1">
                  University or Personal Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@baraton.ac.ke or gmail.com"
                    required
                    className="w-full h-11 pl-10 pr-3 rounded-lg bg-[#F7F9FC] dark:bg-slate-900 border border-[#E3E8F0] dark:border-[#1E3158] text-sm text-[#0F172A] dark:text-white focus:outline-none focus:border-[#0B2A6F] focus:ring-2 focus:ring-[#F2B705]"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  We will send a single-use secure login token to your email inbox.
                </p>
              </div>
            )}

            {/* Persona Switch for Testing Signup */}
            <div className="pt-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Signing In As:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'student', label: 'Student' },
                  { id: 'alumnus', label: 'Alumnus' },
                  { id: 'employer', label: 'Employer' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedRole(item.id as any)}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                      selectedRole === item.id
                        ? 'bg-[#0B2A6F] text-white border-[#0B2A6F]'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full font-bold shadow-md mt-4"
            >
              Enter Kampas
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          {/* Institutional Trust Notice */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Protected by Clerk Identity & UEAB Single Sign-On</span>
          </div>
        </Card>
      </div>
    </div>
  );
};
