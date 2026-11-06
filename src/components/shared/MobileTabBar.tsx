/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Mobile Fixed Bottom Tab Bar
 * Height: 60px (under 15% viewport cap), 44px touch targets
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, CheckSquare, FileText, Compass } from 'lucide-react';

export const MobileTabBar: React.FC = () => {
  const tabs = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/campus/timetable', label: 'Timetable', icon: Calendar },
    { to: '/campus/deadlines', label: 'Deadlines', icon: CheckSquare },
    { to: '/share', label: 'Share', icon: FileText },
    { to: '/community/events', label: 'Campus', icon: Compass },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-white/95 dark:bg-[#071B4A]/95 backdrop-blur-md border-t border-[#E3E8F0] dark:border-[#1E3158] px-2 flex items-center justify-around select-none">
      {tabs.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full py-1 min-h-[44px] transition-colors ${
              isActive
                ? 'text-[#0B2A6F] dark:text-[#F2B705] font-bold'
                : 'text-[#5B6475] dark:text-slate-400 hover:text-[#0B2A6F]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="relative">
                <Icon className="w-5 h-5" />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-[#F2B705]" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
