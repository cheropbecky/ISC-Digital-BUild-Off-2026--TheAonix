/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Feature Flags Configuration
 * Allows any module to be toggled independently without breaking the app
 */

export interface FeatureFlags {
  navigate: boolean; // Timetable, venues, free rooms, deadlines, units
  shareHub: boolean; // Documents, uploads, approvals, study groups
  community: boolean; // Events, clubs, alumni, referrals, mentorship, opportunities
  lostAndFound: boolean; // Lost & found reporting, matching, verification, claims
  manage: boolean; // Staff & admin control center, CSV uploads, approvals, audit logs
  pwaInstall: boolean; // In-app PWA installation prompt
  devRoleSwitcher: boolean; // Quick demo role switcher
  lowDataMode: boolean; // Ultra-compact bandwidth saver for low connectivity
}

export const FEATURES: FeatureFlags = {
  navigate: true,
  shareHub: true,
  community: true,
  lostAndFound: true,
  manage: true,
  pwaInstall: true,
  devRoleSwitcher: import.meta.env.VITE_DEV_ROLE_SWITCHER !== 'false',
  lowDataMode: true,
};
