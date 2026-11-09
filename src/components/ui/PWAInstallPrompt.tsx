/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas PWA Installation Banner & Button
 */

import React, { useEffect, useState } from 'react';
import { Download, Share2, PlusSquare, X } from 'lucide-react';
import { Button } from './Button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

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
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  if (isInstalled || dismissed) return null;

  // Show if either installable or on iOS
  if (!deferredPrompt && !isIOS) return null;

  return (
    <>
      <div className="flex items-center justify-between gap-2 border-b border-[#F2B705]/30 bg-[#071B4A] px-2.5 py-1.5 text-[10px] text-white sm:px-4 sm:py-2 sm:text-sm">
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2.5">
          <span className="shrink-0 rounded-md bg-[#F2B705] px-1.5 py-0.5 text-[9px] font-bold text-[#071B4A] sm:p-1.5 sm:text-xs">
            PWA
          </span>
          <span className="truncate font-medium">
            Install Kampas for instant offline access to your timetable, deadlines & student ID.
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Button
            size="sm"
            variant="gold"
            onClick={handleInstallClick}
            className="h-7 px-2 text-[10px] sm:h-8 sm:px-3 sm:text-xs"
          >
            <Download className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
            Install App
          </Button>
          <button
            onClick={() => setDismissed(true)}
            className="p-0.5 text-slate-400 hover:text-white sm:p-1"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#0C1D3D] rounded-2xl max-w-sm w-full p-6 text-slate-900 dark:text-white shadow-2xl">
            <h3 className="text-lg font-bold mb-2">Install Kampas on iPhone/iPad</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              To install Kampas on your home screen for offline timetable access:
            </p>
            <ol className="text-xs text-slate-700 dark:text-slate-200 space-y-3 mb-6">
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
            </ol>
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
