/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Fixed Desktop Sidebar
 * - Fixed left sidebar (1024px and up) that never scrolls with the page
 * - Items: Home, Campus (Map, Timetable, Deadlines), House Find, Share Hub, Community, Lost & Found
 * - Highlight active item in UEAB Gold (#F2B705)
 * - Collapsible to compact icons rail
 */

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useKampasStore } from '../../lib/store';
import {
  Home,
  MapPin,
  Calendar,
  CheckSquare,
  Building,
  FileText,
  Users,
  Compass,
  SearchCheck,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface SidebarProps {
  isMobileDrawer?: boolean;
  onCloseDrawer?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileDrawer = false, onCloseDrawer }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useKampasStore();

  const navSections = [
    {
      heading: 'MAIN',
      items: [
        { to: '/home', label: 'Campus Home', icon: Home },
      ],
    },
    {
      heading: 'CAMPUS LIFE',
      items: [
        { to: '/campus/map', label: 'Campus GIS Map', icon: MapPin },
        { to: '/campus/timetable', label: 'Class Timetable', icon: Calendar },
        { to: '/campus/deadlines', label: 'Deadlines & CATs', icon: CheckSquare },
      ],
    },
    {
      heading: 'STUDENT SERVICES',
      items: [
        { to: '/housing', label: 'House Find (Rentals)', icon: Building, badge: 'New' },
        { to: '/share', label: 'Share Hub (Notes)', icon: FileText },
        { to: '/community/events', label: 'Community & Events', icon: Users },
        { to: '/found', label: 'Lost & Found Desk', icon: SearchCheck },
      ],
    },
  ];

  const handleLinkClick = () => {
    if (isMobileDrawer && onCloseDrawer) {
      onCloseDrawer();
    }
  };

  return (
    <aside
      className={`h-full flex flex-col justify-between bg-white dark:bg-[#071B4A] border-r border-[#E3E8F0] dark:border-[#1E3158] select-none transition-all duration-200 ${
        isMobileDrawer
          ? 'w-full'
          : isCollapsed
          ? 'w-20'
          : 'w-64'
      }`}
    >
      {/* Top Navigation Items */}
      <div className="p-3 space-y-5 overflow-y-auto flex-1">
        {navSections.map((sec, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 text-[10px] font-black uppercase tracking-widest text-[#5B6475] dark:text-slate-400">
                {sec.heading}
              </div>
            )}
            <nav className="space-y-1">
              {sec.items.map(({ to, label, icon: Icon, badge }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 ${
                      isActive
                        ? 'bg-[#0B2A6F]/10 dark:bg-white/10 text-[#0B2A6F] dark:text-[#F2B705]'
                        : 'text-[#5B6475] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0B2A6F] dark:hover:text-white'
                    } ${isCollapsed && !isMobileDrawer ? 'justify-center px-0' : ''}`
                  }
                  title={isCollapsed ? label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      {/* Active Left Indicator Bar (Gold #F2B705) */}
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
                      {(!isCollapsed || isMobileDrawer) && (
                        <span className="truncate flex-1">{label}</span>
                      )}
                      {badge && (!isCollapsed || isMobileDrawer) && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-[#F2B705] text-[#071B4A]">
                          {badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* Bottom Academic Term & Collapse Button */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
        {(!isCollapsed || isMobileDrawer) && (
          <div className="p-3 bg-[#F7F9FC] dark:bg-slate-800/80 rounded-xl border border-[#E3E8F0] dark:border-slate-700 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#071B4A] dark:text-white">
                1st Trimester 2026/27
              </span>
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            </div>
            <p className="text-[10px] text-[#5B6475] dark:text-slate-400">
              Week 8 of 14 • Study Period
            </p>
          </div>
        )}

        {!isMobileDrawer && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full py-1.5 px-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition text-xs font-semibold"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar to Icons'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <div className="flex items-center gap-1.5">
                <ChevronLeft className="w-4 h-4" />
                <span className="text-[11px]">Collapse sidebar</span>
              </div>
            )}
          </button>
        )}
      </div>
    </aside>
  );
};
