/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Fixed Mobile Bottom Tab Bar (60px high, 44px touch targets)
 * 5 Main Sections:
 * 1. Home
 * 2. Campus (Map / Timetable)
 * 3. House Find
 * 4. Share Hub
 * 5. Community
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MapPin, Building, FileText, Users } from 'lucide-react';

export const MobileTabBar: React.FC = () => {
  const tabs = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/campus/map', label: 'Campus', icon: MapPin },
    { to: '/housing', label: 'Housing', icon: Building, badge: 'New' },
    { to: '/share', label: 'Share', icon: FileText },
    { to: '/community/events', label: 'Community', icon: Users },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-[60px] bg-white/95 dark:bg-[#071B4A]/95 backdrop-blur-md border-t border-[#E3E8F0] dark:border-[#1E3158] flex items-center justify-around px-2 select-none">
      {tabs.map(({ to, label, icon: Icon, badge }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center min-w-[56px] h-full touch-target transition-all duration-150 ${
              isActive
                ? 'text-[#0B2A6F] dark:text-[#F2B705] font-black'
                : 'text-[#5B6475] dark:text-slate-400 font-semibold hover:text-[#0B2A6F]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {/* Top Active Gold Pip */}
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-[#F2B705] rounded-b-md" />
              )}
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {badge && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-[#F2B705]" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight leading-none truncate">
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
