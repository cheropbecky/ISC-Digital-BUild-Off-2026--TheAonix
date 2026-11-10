/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas - University of Eastern Africa, Baraton (UEAB) Student Platform
 * Tagline: "The campus, in one place."
 * Prototype: Fully interactive mock data with React Context and localStorage persistence.
 */

import React from 'react';
import { HashRouter } from 'react-router-dom';
import { KampasProvider } from './lib/store';
import { AppRouter } from './app/Router';
import { PWAInstallPrompt } from './components/ui/PWAInstallPrompt';

export default function App() {
  return (
    <KampasProvider>
      <HashRouter>
        <AppRouter />
        <PWAInstallPrompt />
      </HashRouter>
    </KampasProvider>
  );
}
