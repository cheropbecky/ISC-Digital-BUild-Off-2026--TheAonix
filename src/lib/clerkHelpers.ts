/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Clerk Authentication Config & Appearance Helpers
 */

export const KAMPAS_CLERK_APPEARANCE = {
  layout: {
    socialButtonsVariant: 'iconButton' as const,
    logoPlacement: 'inside' as const,
  },
  variables: {
    colorPrimary: '#0B2A6F',
    colorText: '#0F172A',
    colorBackground: '#FFFFFF',
    colorInputBackground: '#FFFFFF',
    colorInputText: '#0F172A',
    borderRadius: '8px',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  elements: {
    card: 'shadow-lg border border-[#E3E8F0] rounded-xl bg-white p-6',
    headerTitle: 'text-xl font-bold text-[#071B4A]',
    headerSubtitle: 'text-sm text-[#5B6475]',
    formButtonPrimary:
      'bg-[#0B2A6F] hover:bg-[#F2B705] hover:text-[#071B4A] transition-colors font-semibold text-white min-h-[44px] rounded-lg shadow-sm',
    formFieldInput:
      'border-[#E3E8F0] focus:border-[#0B2A6F] focus:ring-2 focus:ring-[#F2B705] min-h-[44px] rounded-lg text-sm',
    footerActionLink: 'text-[#0B2A6F] hover:text-[#F2B705] font-semibold',
  },
};

export const CLERK_PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

export const IS_CLERK_CONFIGURED =
  Boolean(CLERK_PUBLISHABLE_KEY) &&
  !CLERK_PUBLISHABLE_KEY.includes('sample_clerk_key') &&
  !CLERK_PUBLISHABLE_KEY.includes('your-clerk');
