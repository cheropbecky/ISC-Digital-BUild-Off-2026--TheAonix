/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Main Layout Shell
 */

import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/shared/Header';
import { Sidebar } from '../components/shared/Sidebar';
import { MobileTabBar } from '../components/shared/MobileTabBar';
import { ToastContainer } from '../components/ui/ToastContainer';
import { PWAInstallPrompt } from '../components/ui/PWAInstallPrompt';
import { WifiOff } from 'lucide-react';

export const Layout: React.FC = () => {
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
        <div className="bg-[#D97706] text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          <span>Offline mode active: Displaying locally cached timetable and student ID.</span>
        </div>
      )}

      {/* Top Header Bar */}
      <Header
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Persistent Desktop / Tablet Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Mobile Slide-Out Drawer */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div
              className="w-72 bg-white dark:bg-[#071B4A] h-full shadow-2xl p-4 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar />
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Fixed Bottom Tab Bar */}
      <MobileTabBar />

      {/* Global Realtime Toasts */}
      <ToastContainer />
    </div>
  );
};
