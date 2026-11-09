/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Main Layout Shell
 * Desktop: FIXED left sidebar that never scrolls, main content offset with lg:pl-64
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

      <div className="flex-1 flex w-full relative">
        {/* Persistent FIXED Left Sidebar on Desktop (1024px+): does NOT scroll with page */}
        <div className="hidden lg:block fixed left-0 top-14 sm:top-[68px] bottom-0 z-30 w-64">
          <Sidebar />
        </div>

        {/* Mobile Slide-Out Drawer */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex animate-in fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div
              className="w-72 bg-white dark:bg-[#071B4A] h-full shadow-2xl p-0 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
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
          className={`flex-1 min-w-0 lg:pl-64 p-4 sm:p-6 lg:p-8 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-10 w-full ${
            location.hash.includes('/campus/timetable') ? 'max-w-none' : 'max-w-7xl mx-auto'
          } ${location.hash.includes('/campus/timetable') ? 'lg:pr-0' : ''}`}
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
