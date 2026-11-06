/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Design Tokens & Theme Constants
 * Matched to UEAB Collegiate Identity
 */

export const KAMPAS_THEME = {
  colors: {
    primary: '#0B2A6F', // Varsity Navy
    darkBlue: '#071B4A', // Deep Midnight
    gold: '#F2B705', // UEAB Institutional Gold
    goldHover: '#DDA704',
    background: '#F7F9FC', // Cool tinted off-white
    card: '#FFFFFF',
    border: '#E3E8F0',
    text: '#0F172A', // Slate 900
    muted: '#5B6475',
    // Status colors
    success: '#16A34A',
    successBg: '#DCFCE7',
    warning: '#F59E0B',
    warningBg: '#FEF3C7',
    urgent: '#DC2626',
    urgentBg: '#FEE2E2',
    // Dark mode
    darkBg: '#050E24',
    darkCard: '#0C1D3D',
    darkBorder: '#1E3158',
    darkText: '#F8FAFC',
    darkMuted: '#94A3B8',
  },
  radius: {
    card: '12px',
    control: '8px',
    pill: '9999px',
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
  },
} as const;

export type KampasRole =
  | 'student'
  | 'lecturer'
  | 'class_rep'
  | 'club_officer'
  | 'alumnus'
  | 'employer'
  | 'staff'
  | 'admin';
