/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Header Component
 * Top Header Bar: 68px desktop, 56px mobile
 * UEAB official emblem + Kampas wordmark, global search, notification bell with unread badge, profile avatar
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useKampasStore } from '../../lib/store';
import { Search, Bell, Menu, X, Moon, Sun, WifiOff, Sparkles, BookOpen } from 'lucide-react';
import { DevRoleSwitcher } from './DevRoleSwitcher';
import { Badge } from '../ui/Badge';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileMenu,
  isMobileMenuOpen = false,
}) => {
  const navigate = useNavigate();
  const {
    user,
    notifications,
    darkMode,
    toggleDarkMode,
    lowDataMode,
    setLowDataMode,
  } = useKampasStore();

  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full h-14 sm:h-[68px] bg-white dark:bg-[#071B4A] border-b border-[#E3E8F0] dark:border-[#1E3158] transition-colors">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left Zone: UEAB Logo & Kampas Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 -ml-2 text-[#0B2A6F] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg touch-target flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <Link to="/home" className="flex items-center gap-2.5 group">
            {/* UEAB Crest Emblem */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#0B2A6F] border border-[#F2B705]/40 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 100 100" className="w-6 h-6" fill="none">
                <path d="M50 15 L80 32 L80 68 L50 85 L20 68 L20 32 Z" fill="#F2B705" />
                <path d="M50 25 L70 36 L70 64 L50 75 L30 64 L30 36 Z" fill="#071B4A" />
                <text x="50" y="58" textAnchor="middle" fill="#FFFFFF" fontSize="24" fontWeight="800" fontFamily="Inter">
                  U
                </text>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-[#071B4A] dark:text-white">
                  Kampas
                </span>
                <span className="hidden xs:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F2B705] text-[#071B4A]">
                  UEAB
                </span>
              </div>
              <span className="hidden sm:block text-[10px] font-semibold text-[#5B6475] dark:text-slate-300 tracking-wider uppercase">
                The campus, in one place
              </span>
            </div>
          </Link>
        </div>

        {/* Center Zone: Centered Expandable Global Search */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-md hidden md:flex items-center relative"
        >
          <Search className="w-4 h-4 text-[#5B6475] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search units, venues, documents, events, clubs... (⌘K)"
            className="w-full h-11 pl-10 pr-12 rounded-lg bg-[#F7F9FC] dark:bg-slate-900 border border-[#E3E8F0] dark:border-[#1E3158] text-sm text-[#0F172A] dark:text-white placeholder-[#5B6475] focus:outline-none focus:border-[#0B2A6F] focus:ring-2 focus:ring-[#F2B705] transition"
          />
          <kbd className="absolute right-3 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-xs pointer-events-none">
            ⌘K
          </kbd>
        </form>

        {/* Right Zone: Controls, Dev Role Switcher, Notifications & Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Dev Role Switcher */}
          <DevRoleSwitcher />

          {/* Low Data Mode Toggle */}
          <button
            onClick={() => setLowDataMode(!lowDataMode)}
            className={`p-2 rounded-lg text-xs font-semibold transition hidden lg:flex items-center gap-1 ${
              lowDataMode
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'
            }`}
            title="Toggle Text-Only Low-Data Mode for Slow Network"
          >
            <WifiOff className="w-4 h-4" />
            <span className="text-[11px]">{lowDataMode ? 'Low-Data On' : 'Low-Data'}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-slate-500 hover:text-[#0B2A6F] dark:text-slate-300 dark:hover:text-[#F2B705] rounded-lg transition"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notification Bell */}
          <Link
            to="/notifications"
            className="relative p-2 text-slate-600 hover:text-[#0B2A6F] dark:text-slate-300 dark:hover:text-white rounded-lg transition"
            aria-label={`Notifications (${unreadCount} unread)`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#DC2626] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          {/* User Profile Avatar Pill */}
          <Link
            to="/profile"
            className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700 hover:opacity-90 transition group"
          >
            <div className="w-8 h-8 rounded-full bg-[#0B2A6F] text-[#F2B705] font-bold text-xs flex items-center justify-center ring-2 ring-[#F2B705]/40 shadow-sm">
              {user.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
            <div className="hidden xl:block text-left text-xs">
              <div className="font-bold text-[#071B4A] dark:text-white leading-tight">
                {user.fullName}
              </div>
              <div className="text-[10px] text-[#5B6475] dark:text-slate-400 capitalize">
                {user.role.replace('_', ' ')}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};
