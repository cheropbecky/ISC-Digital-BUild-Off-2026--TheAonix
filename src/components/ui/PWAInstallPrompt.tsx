/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas PWA Installation Banner & Button
 */

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Download, Share2, PlusSquare } from 'lucide-react';
import { Button } from './Button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const { pathname } = useLocation();
  const sitsAboveMobileNavigation = !['/', '/login', '/onboarding'].includes(pathname);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // Check if running in standalone PWA mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      setShowIOSModal(true);
    }
  };

  if (isInstalled) return null;

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        aria-label="Install Kampas app"
        title="Install Kampas app"
        className={`fixed right-4 z-[45] flex h-12 w-12 items-center justify-center rounded-full border border-[#F2B705]/70 bg-[#050505] text-[#F2B705] shadow-[0_8px_28px_rgba(0,0,0,0.35)] ring-4 ring-[#F2B705]/10 transition hover:scale-105 hover:bg-[#111111] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F2B705]/40 motion-safe:animate-bounce motion-reduce:animate-none ${sitsAboveMobileNavigation ? 'bottom-20 md:bottom-6' : 'bottom-6'}`}
      >
        <Download className="h-5 w-5" strokeWidth={2.5} />
        <span className="sr-only">Install App</span>
      </button>

      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#0C1D3D] rounded-2xl max-w-sm w-full p-6 text-slate-900 dark:text-white shadow-2xl">
            <h3 className="text-lg font-bold mb-2">{isIOS ? 'Install Kampas on iPhone/iPad' : 'Install Kampas from your browser'}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              {isIOS
                ? 'To install Kampas on your home screen for offline timetable access:'
                : 'Open your browser menu and choose Install app or Add to Home Screen. If that option is unavailable, this browser may not support installing web apps.'}
            </p>
            {isIOS && <ol className="text-xs text-slate-700 dark:text-slate-200 space-y-3 mb-6">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0B2A6F] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  1
                </span>
                <span>
                  Tap the <Share2 className="w-3.5 h-3.5 inline mx-1 text-blue-600" /> Share button in Safari.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0B2A6F] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  2
                </span>
                <span>
                  Scroll down and tap <PlusSquare className="w-3.5 h-3.5 inline mx-1" /> <strong>Add to Home Screen</strong>.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0B2A6F] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  3
                </span>
                <span>Launch Kampas from your home screen like any native app.</span>
              </li>
            </ol>}
            <Button
              className="w-full"
              variant="primary"
              onClick={() => setShowIOSModal(false)}
            >
              Got it
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
