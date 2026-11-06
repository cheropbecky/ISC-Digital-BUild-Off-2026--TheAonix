/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Centralized Role-Based Permissions Engine
 */

import { KampasRole } from '../styles/tokens';

export const PERMISSIONS = {
  canAccessManage: (role: KampasRole): boolean => {
    return ['admin', 'staff', 'lecturer'].includes(role);
  },

  canApproveDocuments: (role: KampasRole): boolean => {
    return ['admin', 'lecturer', 'class_rep', 'staff'].includes(role);
  },

  canChangeVenue: (role: KampasRole): boolean => {
    return ['admin', 'staff', 'lecturer'].includes(role);
  },

  canUploadTimetableCSV: (role: KampasRole): boolean => {
    return ['admin', 'staff'].includes(role);
  },

  canCreateEvents: (role: KampasRole): boolean => {
    return ['admin', 'staff', 'club_officer'].includes(role);
  },

  canPostNotices: (role: KampasRole): boolean => {
    return ['admin', 'staff', 'lecturer'].includes(role);
  },

  canReviewReferral: (role: KampasRole): boolean => {
    return ['alumnus', 'admin'].includes(role);
  },

  canVerifyLostClaim: (role: KampasRole): boolean => {
    return ['admin', 'staff', 'lecturer'].includes(role);
  },

  canApproveAlumniAndEmployer: (role: KampasRole): boolean => {
    return ['admin', 'staff'].includes(role);
  },

  canViewAuditLogs: (role: KampasRole): boolean => {
    return ['admin', 'staff'].includes(role);
  },
};
