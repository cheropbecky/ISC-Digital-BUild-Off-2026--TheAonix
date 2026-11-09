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
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useKampasStore } from '../../lib/store';
import campusImage from '../../assets/images/ueab_campus_hero_1794150142310.jpg';
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
} from 'lucide-react';

interface SidebarProps {
  isMobileDrawer?: boolean;
  onCloseDrawer?: () => void;
  isCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileDrawer = false, onCloseDrawer, isCollapsed: controlledCollapsed, onCollapsedChange }) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = controlledCollapsed ?? internalCollapsed;
  const { user } = useKampasStore();
  const shouldReduceMotion = useReducedMotion();

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
        { to: '/community', label: 'Community & Events', icon: Users },
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
      className={`relative h-full flex flex-col justify-between overflow-hidden bg-[#06163E] text-white border-r border-white/10 select-none transition-[width] duration-300 ease-out ${
        isMobileDrawer
          ? 'w-full'
          : isCollapsed
          ? 'w-20'
          : 'w-56'
      }`}
    >
      {/* Decorative campus image retained at the bottom of the sidebar. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-cover bg-center opacity-45"
        style={{ backgroundImage: `url(${campusImage})` }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[#06163E] via-[#06163E]/95 to-transparent" />

      {/* Top Navigation Items */}
      <div className="relative z-10 flex-1 overflow-y-auto p-2.5 space-y-5 scrollbar-none">
        {navSections.map((sec, sIdx) => (
          <div key={sIdx} className="space-y-1.5">
            {!isCollapsed && (
              <div className="px-3 text-[10px] font-black uppercase tracking-[0.18em] text-blue-200/55">
                {sec.heading}
              </div>
            )}
            <nav className="space-y-1" aria-label={sec.heading}>
              {sec.items.map(({ to, label, icon: Icon, badge }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-[#1769FF] text-white shadow-[0_8px_22px_rgba(23,105,255,0.28)]'
                        : 'text-blue-100/70 hover:bg-white/10 hover:text-white'
                    } ${isCollapsed && !isMobileDrawer ? 'justify-center px-0' : ''}`
                  }
                  title={isCollapsed ? label : undefined}
                  aria-label={isCollapsed ? label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <span className="absolute left-1.5 top-2 bottom-2 w-0.5 rounded-full bg-[#F2B705]" />}
                      <motion.span
                        className="flex shrink-0"
                        animate={shouldReduceMotion ? undefined : { scale: isActive ? 1.04 : 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-blue-200/70 group-hover:text-[#F2B705]'}`} />
                      </motion.span>
                      <AnimatePresence initial={false} mode="popLayout">
                        {(!isCollapsed || isMobileDrawer) && (
                          <motion.span
                            key={`label-${to}`}
                            initial={shouldReduceMotion ? false : { opacity: 0, x: -6 }}
                            animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                            exit={shouldReduceMotion ? undefined : { opacity: 0, x: -6 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                            className="truncate flex-1"
                          >
                            {label}
                          </motion.span>
                        )}
                        {badge && (!isCollapsed || isMobileDrawer) && (
                          <motion.span
                            key={`badge-${to}`}
                            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
                            animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
                            exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.18 }}
                            className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-[#F2B705] text-[#071B4A]"
                          >
                            {badge}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* Bottom Academic Term & Collapse Button */}
      <div className="relative z-10 p-3 border-t border-white/10 space-y-2">
        {(!isCollapsed || isMobileDrawer) && (
          <div className="p-3 bg-white/8 rounded-2xl border border-white/10 space-y-1 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-white">
                1st Trimester 2026/27
              </span>
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            </div>
            <p className="text-[10px] text-blue-100/55">
              Week 8 of 14 • Study Period
            </p>
          </div>
        )}

        {!isMobileDrawer && (
          <button
            onClick={() => {
              const nextCollapsed = !isCollapsed;
              setInternalCollapsed(nextCollapsed);
              onCollapsedChange?.(nextCollapsed);
            }}
            className="w-full py-2 px-2 rounded-xl text-blue-100/60 hover:text-white hover:bg-white/10 flex items-center justify-center transition text-xs font-semibold"
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
