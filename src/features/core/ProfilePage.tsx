/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Student Profile & Digital University ID Card (/profile)
 * Features: Digital Student ID card, field visibility toggles,
 * dark mode, text-only low-data mode
 */

import React from 'react';
import { useKampasStore } from '../../lib/store';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  GraduationCap,
  Shield,
  Eye,
  EyeOff,
  Moon,
  Sun,
  WifiOff,
  QrCode,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const {
    user,
    updateProfile,
    darkMode,
    toggleDarkMode,
    lowDataMode,
    setLowDataMode,
  } = useKampasStore();

  const toggleVisibility = (field: keyof typeof user.visibilitySettings) => {
    updateProfile({
      visibilitySettings: {
        ...user.visibilitySettings,
        [field]: !user.visibilitySettings[field],
      },
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#071B4A] dark:text-white">
          Student Profile & Identity
        </h1>
        <p className="text-xs text-[#5B6475] dark:text-slate-400 mt-1">
          Manage your official university credentials, privacy visibility controls, and offline cached ID card.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Digital Student ID Card (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold text-[#071B4A] dark:text-white uppercase tracking-wider block">
            Official Digital University ID
          </span>

          {/* Student ID Card Shell */}
          <div className="w-full bg-gradient-to-br from-[#071B4A] via-[#0B2A6F] to-[#0A255E] text-white p-5 rounded-2xl shadow-xl border-2 border-[#F2B705]/40 relative overflow-hidden select-none">
            {/* Background Seal Watermark */}
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-6 translate-y-6">
              <svg viewBox="0 0 100 100" className="w-44 h-44" fill="currentColor">
                <circle cx="50" cy="50" r="45" />
              </svg>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/20 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#F2B705] text-[#071B4A] font-black flex items-center justify-center text-sm shadow-xs">
                  U
                </div>
                <div>
                  <div className="text-[11px] font-black tracking-wider text-[#F2B705] uppercase">
                    Univ. of Eastern Africa, Baraton
                  </div>
                  <div className="text-[9px] text-slate-300 font-medium">
                    Student Identification Card
                  </div>
                </div>
              </div>
              <Badge variant="academic" className="bg-[#16A34A] text-white font-bold text-[10px]">
                ACTIVE
              </Badge>
            </div>

            {/* Avatar & Core Info */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-white text-[#0B2A6F] font-black text-xl flex items-center justify-center ring-2 ring-[#F2B705] shadow-md shrink-0">
                {user.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-extrabold truncate leading-tight">
                  {user.fullName}
                </h3>
                <div className="text-xs font-mono font-bold text-[#F2B705] mt-0.5">
                  ID: {user.studentId || 'S21/04589'}
                </div>
                <div className="text-[11px] text-slate-200 mt-0.5 truncate">
                  {user.course || 'BSc Software Engineering'}
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-2 text-[10px] bg-black/25 p-2.5 rounded-xl border border-white/10 mb-4 font-mono">
              <div>
                <span className="text-slate-400 block">YEAR / LEVEL</span>
                <span className="font-bold text-white">Year {user.yearOfStudy || 3} (Junior)</span>
              </div>
              <div>
                <span className="text-slate-400 block">VALID TRIMESTER</span>
                <span className="font-bold text-white">1st Trimester 2026/27</span>
              </div>
            </div>

            {/* Simulated Barcode */}
            <div className="bg-white p-2 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-1 h-6">
                {[4, 2, 6, 2, 8, 3, 5, 2, 7, 3, 2, 5, 8, 2, 4, 3, 6, 2, 5].map((w, i) => (
                  <span
                    key={i}
                    className="h-full bg-slate-900 inline-block"
                    style={{ width: `${w}px` }}
                  />
                ))}
              </div>
              <span className="font-mono text-[9px] font-bold text-slate-700">
                {user.studentId || 'S21/04589'}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5 pt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cached offline by Kampas PWA service worker</span>
          </div>
        </div>

        {/* Right: Settings & Visibility Toggles (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Privacy & Visibility Toggles */}
          <Card padding="md">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Lock className="w-4 h-4 text-[#0B2A6F] dark:text-[#F2B705]" />
              <h2 className="text-sm font-bold text-[#071B4A] dark:text-white uppercase tracking-wider">
                Directory Field Visibility
              </h2>
            </div>
            <p className="text-xs text-[#5B6475] dark:text-slate-400 mb-4">
              Control what personal information classmates and recruiters can see in student search.
            </p>

            <div className="space-y-3">
              {[
                { key: 'email', label: 'University Email', value: user.email },
                { key: 'phone', label: 'Phone Number', value: user.phone || '+254 712 345 678' },
                { key: 'course', label: 'Enrolled Course & Year', value: `${user.course} (Yr ${user.yearOfStudy})` },
                { key: 'interests', label: 'Interests & Skills', value: user.interests.join(', ') },
              ].map((item) => {
                const isVisible = user.visibilitySettings[item.key as keyof typeof user.visibilitySettings];

                return (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg text-xs"
                  >
                    <div>
                      <div className="font-bold text-[#071B4A] dark:text-white">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">
                        {item.value}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleVisibility(item.key as any)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition ${
                        isVisible
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {isVisible ? (
                        <>
                          <Eye className="w-3 h-3" /> Visible
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" /> Hidden
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Display & Bandwidth Preferences */}
          <Card padding="md">
            <h2 className="text-sm font-bold text-[#071B4A] dark:text-white uppercase tracking-wider mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              Display & Bandwidth Optimization
            </h2>

            <div className="space-y-3">
              {/* Dark mode */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <div>
                  <div className="text-xs font-bold text-[#071B4A] dark:text-white">
                    Dark Theme Mode
                  </div>
                  <div className="text-[11px] text-slate-500">
                    High contrast for low-light night study sessions.
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={toggleDarkMode}
                  className="text-xs"
                >
                  {darkMode ? <Sun className="w-3.5 h-3.5 mr-1" /> : <Moon className="w-3.5 h-3.5 mr-1" />}
                  {darkMode ? 'Light' : 'Dark'}
                </Button>
              </div>

              {/* Low data mode */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <div>
                  <div className="text-xs font-bold text-[#071B4A] dark:text-white">
                    Low-Data Text-Only Mode
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Suppresses large images and media for slow 3G cellular data in rural Nandi County.
                  </div>
                </div>
                <button
                  onClick={() => setLowDataMode(!lowDataMode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    lowDataMode
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {lowDataMode ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
