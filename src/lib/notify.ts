/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Central Notification Engine
 * notify({ audience, type, title, body, link, priority })
 * Respects per-category preferences & quiet hours (urgent bypasses), suppresses duplicates
 */

import { NotificationItem, UserProfile } from './types';

export interface NotifyParams {
  audience?: 'all' | 'students' | 'lecturers' | string;
  type:
    | 'venue_change'
    | 'deadline_approaching'
    | 'document_approved'
    | 'document_uploaded'
    | 'referral_requested'
    | 'referral_accepted'
    | 'lost_item_matched'
    | 'event_reminder'
    | 'notice_published'
    | 'study_group_session'
    | 'timetable_scanned';
  title: string;
  body?: string;
  link?: string;
  priority?: 'normal' | 'important' | 'urgent';
}

// In-memory duplicate suppression cache (key -> timestamp)
const recentNotificationKeys = new Map<string, number>();

export function checkQuietHours(profile: UserProfile): boolean {
  if (!profile.notificationPreferences?.quietHoursEnabled) {
    return false;
  }
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [startH, startM] = (profile.notificationPreferences.quietStart || '22:00').split(':').map(Number);
  const [endH, endM] = (profile.notificationPreferences.quietEnd || '06:00').split(':').map(Number);

  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (startMinutes > endMinutes) {
    // Over midnight e.g. 22:00 to 06:00
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  } else {
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }
}

export function shouldDeliverNotification(
  params: NotifyParams,
  profile: UserProfile
): { deliver: boolean; reason?: string } {
  const priority = params.priority || 'normal';

  // 1. Urgent priority ALWAYS bypasses quiet hours and filters
  if (priority === 'urgent') {
    return { deliver: true };
  }

  // 2. Quiet Hours check
  if (checkQuietHours(profile)) {
    return { deliver: false, reason: 'Suppressed: Quiet hours active' };
  }

  // 3. Category preference check
  if (params.type === 'venue_change' && !profile.notificationPreferences.timetable) {
    return { deliver: false, reason: 'Suppressed: Timetable notifications disabled' };
  }
  if (params.type === 'deadline_approaching' && !profile.notificationPreferences.deadlines) {
    return { deliver: false, reason: 'Suppressed: Deadline notifications disabled' };
  }
  if (
    (params.type === 'event_reminder' || params.type === 'referral_requested') &&
    !profile.notificationPreferences.social
  ) {
    return { deliver: false, reason: 'Suppressed: Social notifications disabled' };
  }

  // 4. Duplicate suppression (within 60 seconds)
  const dedupeKey = `${params.type}:${params.title}:${params.link || ''}`;
  const lastSent = recentNotificationKeys.get(dedupeKey);
  const now = Date.now();
  if (lastSent && now - lastSent < 60_000) {
    return { deliver: false, reason: 'Suppressed: Duplicate notification' };
  }

  recentNotificationKeys.set(dedupeKey, now);
  return { deliver: true };
}

// Global dispatcher hook listener registered by KampasStore
type NotifyListener = (item: NotificationItem) => void;
let activeListener: NotifyListener | null = null;

export function registerNotificationListener(listener: NotifyListener) {
  activeListener = listener;
  return () => {
    activeListener = null;
  };
}

export function notify(params: NotifyParams, userProfile?: UserProfile): NotificationItem | null {
  const priority = params.priority || 'normal';
  
  if (userProfile) {
    const check = shouldDeliverNotification(params, userProfile);
    if (!check.deliver) {
      console.log(`[Kampas Notification] ${check.reason}:`, params.title);
      return null;
    }
  }

  const notification: NotificationItem = {
    id: `ntf-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId: userProfile?.id || 'current_user',
    type: params.type,
    title: params.title,
    body: params.body || '',
    link: params.link,
    priority,
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  if (activeListener) {
    activeListener(notification);
  }

  return notification;
}
