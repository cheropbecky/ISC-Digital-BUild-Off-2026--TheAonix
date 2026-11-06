/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas - University of Eastern Africa, Baraton (UEAB) Student Platform
 * Tagline: "The campus, in one place."
 */

import React from 'react';
import { HashRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { KampasProvider } from './lib/store';
import { AppRouter } from './app/Router';
import { CLERK_PUBLISHABLE_KEY, IS_CLERK_CONFIGURED, KAMPAS_CLERK_APPEARANCE } from './lib/clerkHelpers';

export default function App() {
  const content = (
    <KampasProvider>
      <HashRouter>
        <AppRouter />
      </HashRouter>
    </KampasProvider>
  );

  if (IS_CLERK_CONFIGURED) {
    return (
      <ClerkProvider
        publishableKey={CLERK_PUBLISHABLE_KEY}
        appearance={KAMPAS_CLERK_APPEARANCE}
      >
        {content}
      </ClerkProvider>
    );
  }

  return content;
}
