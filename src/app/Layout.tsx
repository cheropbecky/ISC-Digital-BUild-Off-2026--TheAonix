/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Main Layout Shell
 * Desktop: FIXED left sidebar that never scrolls, main content offset beside it
 * Mobile: Slide-in drawer + fixed 60px bottom tab bar
 * Includes floating Demo Controls panel
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/shared/Header';
import { Sidebar } from '../components/shared/Sidebar';
import { MobileTabBar } from '../components/shared/MobileTabBar';
import { DemoControls } from '../components/shared/DemoControls';
import { ToastContainer } from '../components/ui/ToastContainer';
import { PWAInstallPrompt } from '../components/ui/PWAInstallPrompt';
import { WifiOff } from 'lucide-react';

export const Layout: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC] dark:bg-[#050E24] text-[#0F172A] dark:text-[#F8FAFC] antialiased">
      {/* PWA Install Banner */}
      <PWAInstallPrompt />

      {/* Offline Connectivity Alert */}
      {!isOnline && (
        <div className="bg-[#D97706] text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-center gap-2 sticky top-0 z-50">
          <WifiOff className="w-4 h-4" />
          <span>Offline mode active: Cached timetable and digital student ID available.</span>
        </div>
      )}

      {/* Top Header Bar */}
      <Header
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className="flex-1 flex w-full relative pt-14 sm:pt-[68px]">
        {/* Persistent FIXED Left Sidebar on Desktop (1024px+): does NOT scroll with page */}
        <div className={`hidden lg:block fixed left-0 top-14 sm:top-[68px] bottom-0 z-30 transition-[width] duration-300 ease-out ${isSidebarCollapsed ? 'w-20' : 'w-56'}`}>
          <Sidebar isCollapsed={isSidebarCollapsed} onCollapsedChange={setIsSidebarCollapsed} />
        </div>

        {/* Mobile Slide-Out Drawer */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-[#02091D]/70 backdrop-blur-sm flex animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
            role="presentation"
          >
            <div
              className="w-[min(18rem,84vw)] bg-[#06163E] h-full shadow-2xl p-0 overflow-y-auto animate-in slide-in-from-left duration-300"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-label="Campus navigation"
            >
              <Sidebar
                isMobileDrawer
                onCloseDrawer={() => setIsMobileMenuOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Main Content Viewport: Offset beside fixed sidebar on desktop */}
        <main
          className={`flex-1 min-w-0 w-full max-w-none mx-0 px-3 sm:px-5 pt-5 sm:pt-5 lg:pt-6 pb-24 md:pb-10 transition-[padding-left] duration-300 ease-out ${
            isSidebarCollapsed ? 'lg:pl-[calc(5rem+1.5rem)]' : 'lg:pl-[calc(14rem+1.5rem)]'
          } ${
            location.hash.includes('/campus/timetable') ? 'lg:pr-0' : ''
          }`}
        >
          <Outlet />
        </main>
      </div>

      {/* Mobile Fixed Bottom Tab Bar (5 main sections) */}
      <MobileTabBar />

      {/* Floating Demo Interactive Controls (bottom right) */}
      {!location.pathname.includes('/campus/timetable') && <DemoControls />}

      {/* Global Realtime Toasts */}
      <ToastContainer />
    </div>
  );
};
