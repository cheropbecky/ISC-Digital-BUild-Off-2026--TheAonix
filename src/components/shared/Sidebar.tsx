/**
- 
@license
- SPDX-License-Identifier: Apache-2.0
- Kampas Fixed Desktop Sidebar
- Fixed left sidebar (1024px and up) that never scrolls with the page
- Items: Home, Campus (Map, Timetable, Deadlines), House Find, Share Hub, Community, Lost & Found, Feedback
- Highlight active item in UEAB Gold (#F2B705)
- Collapsible to compact icons rail
 */

import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useKampasStore } from '../../lib/store';
import {
  Home,
  MapPin,
  Calendar,
  CheckSquare,
  Building,
  FileText,
  Users,
  GraduationCap,
  SearchCheck,
  MessageSquarePlus,
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
  const location = useLocation();
  const initialPathRef = useRef(location.pathname);
  const [hasUnreadDeadlines, setHasUnreadDeadlines] = useState(true);

  // This is intentionally session-only: a full refresh restores the dot.
  useEffect(() => {
    if (initialPathRef.current === location.pathname) return;
    initialPathRef.current = location.pathname;
    if (location.pathname.startsWith('/campus/deadlines')) {
      setHasUnreadDeadlines(false);
    }
  }, [location.pathname]);

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
      {/* Subtle campus-inspired dot pattern and ambient blue/gold light. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-45 [background-image:radial-gradient(rgba(242,183,5,0.28)_1px,transparent_1px)] [background-size:18px_18px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(23,105,255,0.2),transparent_58%),radial-gradient(ellipse_at_bottom_right,rgba(242,183,5,0.08),transparent_42%)]"
      />

      {/* Top Navigation Items */}
      <div className="relative z-10 flex-1 overflow-y-auto p-2.5 space-y-4 scrollbar-none">
        {navSections.map((sec, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 text-[10px] font-black uppercase tracking-[0.18em] text-blue-200/55">
                {sec.heading}
              </div>
            )}
            <nav className="space-y-0.5" aria-label={sec.heading}>
              {sec.items.map(({ to, label, icon: Icon, badge }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/community'}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 border border-transparent px-3 py-2 rounded-xl text-xs sm:text-[13px] font-bold transition-all duration-200 hover:-translate-y-px hover:border-[#F2B705]/20 ${
                      isActive
                        ? 'border-[#F2B705]/25 bg-gradient-to-r from-[#F2B705]/15 via-[#1769FF]/30 to-[#1769FF]/15 text-white shadow-[0_8px_22px_rgba(23,105,255,0.2)]'
                        : 'text-blue-100/70 hover:bg-white/10 hover:text-white'
                    } ${isCollapsed && !isMobileDrawer ? 'justify-center px-0' : ''}`
                  }
                  title={isCollapsed ? label : undefined}
                  aria-label={isCollapsed ? label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`absolute left-0.5 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-[#F2B705] shadow-[0_0_10px_rgba(242,183,5,0.7)] transition-all duration-200 ${
                          isActive
                            ? 'scale-y-100 opacity-100'
                            : 'scale-y-50 opacity-0 group-hover:scale-y-100 group-hover:opacity-100'
                        }`}
                      />
                      <motion.span
                        className="flex shrink-0"
                        animate={shouldReduceMotion ? undefined : { scale: isActive ? 1.04 : 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-blue-200/70 group-hover:text-[#F2B705]'}`} />
                      </motion.span>
                      {to === '/campus/deadlines' && hasUnreadDeadlines && (
                        <span
                          aria-label="Unread deadlines and CATs"
                          title="Unread deadlines and CATs"
                          className={`absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#06163E] ${isCollapsed && !isMobileDrawer ? 'right-2' : ''}`}
                        />
                      )}
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

        <NavLink
          to="/feedback"
          onClick={handleLinkClick}
          title={isCollapsed ? 'Feedback & Support' : undefined}
          aria-label={isCollapsed ? 'Feedback & Support' : undefined}
          className={({ isActive }) =>
            `group flex items-center gap-3 rounded-xl border px-3 py-2 text-xs font-bold transition-all duration-200 ${
              isActive
                ? 'border-white/25 bg-white/15 text-white'
                : 'border-white/10 bg-white/5 text-blue-100/75 hover:bg-white/10 hover:text-white'
            } ${isCollapsed && !isMobileDrawer ? 'justify-center px-0' : ''}`
          }
        >
          {({ isActive }) => (
            <>
              <MessageSquarePlus className={`h-5 w-5 shrink-0 ${isActive ? 'text-[#F2B705]' : 'text-blue-200/70'}`} />
              {(!isCollapsed || isMobileDrawer) && <span className="truncate">Feedback &amp; Support</span>}
            </>
          )}
        </NavLink>

        <NavLink
          to="/community/alumni"
          onClick={handleLinkClick}
          title={isCollapsed ? 'Alumni' : undefined}
          aria-label={isCollapsed ? 'Alumni' : undefined}
          className={({ isActive }) =>
            `group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-xs font-extrabold transition-all duration-200 ${
              isActive
                ? 'border-[#F2B705] bg-[#F2B705] text-[#071B4A] shadow-[0_8px_22px_rgba(242,183,5,0.2)]'
                : 'border-[#F2B705]/25 bg-[#F2B705]/10 text-[#F2B705] hover:bg-[#F2B705]/20'
            } ${isCollapsed && !isMobileDrawer ? 'justify-center px-0' : ''}`
          }
        >
          {({ isActive }) => (
            <>
              <GraduationCap className={`h-5 w-5 shrink-0 ${isActive ? 'text-[#071B4A]' : 'text-[#F2B705]'}`} />
              {(!isCollapsed || isMobileDrawer) && <span className="truncate">Alumni</span>}
            </>
          )}
        </NavLink>

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
