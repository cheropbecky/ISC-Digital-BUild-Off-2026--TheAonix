/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Utility Functions
 */

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function getDaysRemaining(dueDateStr: string): {
  days: number;
  label: string;
  status: 'urgent' | 'warning' | 'normal';
} {
  const now = new Date().getTime();
  const due = new Date(dueDateStr).getTime();
  const diffMs = due - now;
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (days <= 0) {
    return { days: 0, label: 'Due today / overdue', status: 'urgent' };
  } else if (days <= 2) {
    return { days, label: `${days}d left`, status: 'urgent' };
  } else if (days <= 5) {
    return { days, label: `${days}d left`, status: 'warning' };
  } else {
    return { days, label: `${days}d left`, status: 'normal' };
  }
}

export function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-KE', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function formatTimeOnly(timeStr: string): string {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  const hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes} ${ampm}`;
}

export function generateICS(entry: {
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number;
}): string {
  // Generates an iCalendar standard .ics file text for import into Google Calendar / Apple Calendar
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kampas UEAB//Timetable ICS//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${entry.title}`,
    `DESCRIPTION:${entry.description}`,
    `LOCATION:${entry.location}`,
    `RRULE:FREQ=WEEKLY;COUNT=14`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return icsLines.join('\r\n');
}

export function downloadICSFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
