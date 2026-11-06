/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Persistent Left Navigation Sidebar
 * 260px desktop, collapses to 72px rail on tablet
 * Active state: 4px vertical UEAB Gold bar, #0B2A6F text & soft highlight
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useKampasStore } from '../../lib/store';
import { PERMISSIONS } from '../../lib/permissions';
import {
  Home,
  Calendar,
  MapPin,
  DoorOpen,
  CheckSquare,
  FileText,
  Users,
  Compass,
  Briefcase,
  SearchCheck,
  Settings,
  Bell,
  UserCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useKampasStore();

  const isStaffOrAdmin = PERMISSIONS.canAccessManage(user.role);

  const navGroups = [
    {
      title: 'CAMPUS LIFE',
      items: [
        { to: '/home', label: 'Campus Home', icon: Home },
        { to: '/campus/timetable', label: 'My Timetable', icon: Calendar },
        { to: '/campus/venues/all', label: 'Venues & Map', icon: MapPin },
        { to: '/campus/free-rooms', label: 'Free Rooms', icon: DoorOpen },
        { to: '/campus/deadlines', label: 'Deadlines', icon: CheckSquare },
      ],
    },
    {
      title: 'ACADEMIC SHARE',
      items: [
        { to: '/share', label: 'Notes Library', icon: FileText },
        { to: '/share/groups', label: 'Study Groups', icon: Users },
      ],
    },
    {
      title: 'COMMUNITY',
      items: [
        { to: '/community/events', label: 'Events & Chapel', icon: Compass },
        { to: '/community/clubs', label: 'Student Clubs', icon: Users },
        { to: '/community/alumni', label: 'Alumni Network', icon: UserCheck },
        { to: '/community/opportunities', label: 'Opportunities', icon: Briefcase },
        { to: '/found', label: 'Lost & Found', icon: SearchCheck },
      ],
    },
  ];

  if (isStaffOrAdmin) {
    navGroups.push({
      title: 'INSTITUTION',
      items: [
        { to: '/manage', label: 'Manage & Admin', icon: Settings },
      ],
    });
  }

  return (
    <aside className="w-18 xl:w-64 bg-white dark:bg-[#071B4A] border-r border-[#E3E8F0] dark:border-[#1E3158] flex flex-col justify-between shrink-0 select-none py-4 transition-all">
      <div className="space-y-6">
        {navGroups.map((group) => (
          <div key={group.title} className="px-3">
            <div className="hidden xl:block px-3 mb-2 text-[10px] font-bold tracking-wider text-[#5B6475] dark:text-slate-400 uppercase">
              {group.title}
            </div>
            <nav className="space-y-1">
              {group.items.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-[#0B2A6F]/10 dark:bg-blue-900/30 text-[#0B2A6F] dark:text-[#F2B705] font-bold'
                        : 'text-[#5B6475] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0B2A6F] dark:hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active Left Indicator Bar */}
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#F2B705] rounded-r-md" />
                      )}
                      <Icon
                        className={`w-5 h-5 shrink-0 transition-colors ${
                          isActive
                            ? 'text-[#0B2A6F] dark:text-[#F2B705]'
                            : 'text-[#5B6475] dark:text-slate-400 group-hover:text-[#0B2A6F] dark:group-hover:text-white'
                        }`}
                      />
                      <span className="hidden xl:inline truncate">{label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* Bottom Academic Term Card */}
      <div className="hidden xl:block px-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="p-3 bg-[#F7F9FC] dark:bg-slate-800/80 rounded-xl border border-[#E3E8F0] dark:border-slate-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-[#071B4A] dark:text-white">
              1st Trimester 2026/27
            </span>
            <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
          </div>
          <p className="text-[10px] text-[#5B6475] dark:text-slate-300">
            Week 8 of 14 • Study Period
          </p>
        </div>
      </div>
    </aside>
  );
};
