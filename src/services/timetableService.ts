/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * UEAB Timetable, Calendar & Academic Navigation Service Layer
 * University of Eastern Africa, Baraton (Nandi County, Kenya)
 * Provides asynchronous data loading with simulated network latency,
 * persistent personal calendar events in localStorage, and OSRM walking route calculation.
 */

import { TIMETABLE_ENTRIES, TimetableEntry, generateICS, detectClashes } from '../data/timetable';
import { VENUES, VenueData } from '../data/venues';
import { DEADLINES, AcademicDeadline } from '../data/deadlines';
import { ACADEMIC_UNITS, AcademicUnit } from '../data/units';
import { CAMPUS_CALENDAR_EVENTS, CalendarEvent } from '../data/events';
import { TimetableEntry as StoreTimetableEntry } from '../lib/types';
import { IS_SUPABASE_CONFIGURED, supabase } from '../lib/supabase';

const LATENCY_MS = 75;

function sleep(ms = LATENCY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const PERSONAL_EVENTS_STORAGE_KEY = 'kampas_personal_calendar_events_v2';
const DAY_INDEX: Record<TimetableEntry['dayOfWeek'], number> = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export interface NextClassCountdown {
  entry: TimetableEntry;
  minutesUntilStart: number;
  isToday: boolean;
  isInSession: boolean;
  relativeLabel: string;
}

export const timetableService = {
  /**
   * Fetch all registered timetable entries
   */
  async getTimetable(): Promise<StoreTimetableEntry[]> {
    if (!IS_SUPABASE_CONFIGURED) {
      await sleep();
      return TIMETABLE_ENTRIES.map((entry) => ({
        id: entry.id,
        unitCode: entry.unitCode,
        unitName: entry.unitName,
        lecturerName: entry.lecturer,
        venueId: entry.venueId,
        venueName: entry.venueName,
        dayOfWeek: DAY_INDEX[entry.dayOfWeek],
        startTime: entry.startTime,
        endTime: entry.endTime,
        isVenueChanged: entry.isRelocated ?? false,
        venueChangeNote: entry.relocationNote,
        recurrence: 'weekly',
      }));
    }

    const { data, error } = await supabase
      .from('timetable_entries')
      .select('id, unit_code, unit_name, lecturer_name, venue_id, venue_name, day_of_week, start_time, end_time, recurrence, original_venue_id, is_venue_changed, venue_change_note')
      .order('day_of_week')
      .order('start_time');

    if (error) {
      throw new Error(`Unable to load timetable: ${error.message}`);
    }

    return (data ?? []).map((entry) => ({
      id: String(entry.id),
      unitCode: entry.unit_code,
      unitName: entry.unit_name,
      lecturerName: entry.lecturer_name,
      venueId: entry.venue_id,
      venueName: entry.venue_name,
      dayOfWeek: entry.day_of_week,
      startTime: entry.start_time.slice(0, 5),
      endTime: entry.end_time.slice(0, 5),
      recurrence: entry.recurrence ?? 'weekly',
      originalVenueId: entry.original_venue_id ?? undefined,
      isVenueChanged: entry.is_venue_changed ?? false,
      venueChangeNote: entry.venue_change_note ?? undefined,
    }));
  },

  /**
   * Get raw rich timetable entries
   */
  async getRawTimetable(): Promise<TimetableEntry[]> {
    await sleep();
    return [...TIMETABLE_ENTRIES];
  },

  /**
   * Get today's classes computed dynamically from the given date
   */
  async getTodayClasses(refDate: Date = new Date()): Promise<TimetableEntry[]> {
    await sleep();
    const day = refDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    // Map Sunday (0) to 1 (Monday) as academic default if on Sunday
    const targetDayIndex = day === 0 ? 1 : day;
    return TIMETABLE_ENTRIES.filter((e) => DAY_INDEX[e.dayOfWeek] === targetDayIndex).sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
  },

  /**
   * Compute the Next Class dynamically from current local time
   */
  async getNextClass(refDate: Date = new Date()): Promise<NextClassCountdown | null> {
    await sleep(25);
    const day = refDate.getDay();
    const currentMinutes = refDate.getHours() * 60 + refDate.getMinutes();

    // 1. Look for remaining classes today
    const todayEntries = TIMETABLE_ENTRIES.filter((e) => DAY_INDEX[e.dayOfWeek] === day).sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );

    for (const entry of todayEntries) {
      const [startH, startM] = entry.startTime.split(':').map(Number);
      const [endH, endM] = entry.endTime.split(':').map(Number);
      const startMin = startH * 60 + startM;
      const endMin = endH * 60 + endM;

      if (currentMinutes >= startMin && currentMinutes < endMin) {
        return {
          entry,
          minutesUntilStart: 0,
          isToday: true,
          isInSession: true,
          relativeLabel: `In session • ${endMin - currentMinutes}m remaining`,
        };
      }

      if (startMin > currentMinutes) {
        const diff = startMin - currentMinutes;
        return {
          entry,
          minutesUntilStart: diff,
          isToday: true,
          isInSession: false,
          relativeLabel: diff < 60 ? `Starts in ${diff}m` : `Starts in ${Math.floor(diff / 60)}h ${diff % 60}m`,
        };
      }
    }

    // 2. If no more classes today, find the earliest class on the next available days
    for (let offset = 1; offset <= 7; offset++) {
      const nextDayIndex = (day + offset) % 7;
      if (nextDayIndex === 0) continue; // Skip Sunday
      const upcoming = TIMETABLE_ENTRIES.filter((e) => DAY_INDEX[e.dayOfWeek] === nextDayIndex).sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      );
      if (upcoming.length > 0) {
        const next = upcoming[0];
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return {
          entry: next,
          minutesUntilStart: offset * 24 * 60,
          isToday: false,
          isInSession: false,
          relativeLabel: offset === 1 ? `Tomorrow at ${next.startTime}` : `${dayNames[nextDayIndex]} at ${next.startTime}`,
        };
      }
    }

    return null;
  },

  /**
   * Fetch master list of academic units
   */
  async getUnits(): Promise<AcademicUnit[]> {
    await sleep();
    return [...ACADEMIC_UNITS];
  },

  /**
   * Fetch all campus venues
   */
  async getVenues(): Promise<VenueData[]> {
    await sleep();
    return [...VENUES];
  },

  /**
   * Fetch single venue by ID or code
   */
  async getVenueById(id: string): Promise<VenueData | null> {
    await sleep(30);
    const found = VENUES.find(
      (v) => v.id === id || v.code.toLowerCase() === id.toLowerCase()
    );
    return found || null;
  },

  /**
   * Fetch academic deadlines
   */
  async getDeadlines(): Promise<AcademicDeadline[]> {
    await sleep();
    return [...DEADLINES];
  },

  /**
   * Fetch official campus calendar events
   */
  async getEvents(): Promise<CalendarEvent[]> {
    await sleep();
    return [...CAMPUS_CALENDAR_EVENTS];
  },

  /**
   * Get personal events persisted in localStorage
   */
  getPersonalEventsSync(): CalendarEvent[] {
    try {
      const saved = localStorage.getItem(PERSONAL_EVENTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  async getPersonalEvents(): Promise<CalendarEvent[]> {
    await sleep(30);
    return this.getPersonalEventsSync();
  },

  /**
   * Save a personal event
   */
  async addPersonalEvent(
    event: Omit<CalendarEvent, 'id' | 'isOfficial'>
  ): Promise<CalendarEvent> {
    await sleep(40);
    const newEvent: CalendarEvent = {
      ...event,
      id: `usr-evt-${Date.now()}`,
      isOfficial: false,
    };
    const current = this.getPersonalEventsSync();
    const updated = [newEvent, ...current];
    localStorage.setItem(PERSONAL_EVENTS_STORAGE_KEY, JSON.stringify(updated));
    return newEvent;
  },

  /**
   * Delete a personal event
   */
  async deletePersonalEvent(id: string): Promise<boolean> {
    await sleep(30);
    const current = this.getPersonalEventsSync();
    const updated = current.filter((e) => e.id !== id);
    localStorage.setItem(PERSONAL_EVENTS_STORAGE_KEY, JSON.stringify(updated));
    return true;
  },

  /**
   * Calculate weekly workload hours for a given week
   */
  async getWeeklyWorkload(date: Date = new Date()): Promise<{
    classHours: number;
    lectureCount: number;
    deadlineCount: number;
    examCount: number;
  }> {
    await sleep(20);
    let totalMinutes = 0;
    let lectureCount = 0;

    TIMETABLE_ENTRIES.forEach((e) => {
      const [startH, startM] = e.startTime.split(':').map(Number);
      const [endH, endM] = e.endTime.split(':').map(Number);
      totalMinutes += (endH * 60 + endM) - (startH * 60 + startM);
      lectureCount++;
    });

    const activeDeadlines = DEADLINES.filter((d) => !d.isCompleted).length;
    const exams = CAMPUS_CALENDAR_EVENTS.filter((e) => e.category === 'exam').length;

    return {
      classHours: Math.round((totalMinutes / 60) * 10) / 10,
      lectureCount,
      deadlineCount: activeDeadlines,
      examCount: exams,
    };
  },

  /**
   * Query real walking route from OpenStreetMap OSRM public routing API
   * with guaranteed straight-line fallback.
   */
  async fetchOSRMRoute(
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number
  ): Promise<[number, number][]> {
    try {
      const url = `https://router.project-osrm.org/route/v1/foot/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
      const response = await fetch(url, { signal: AbortSignal.timeout(3500) });
      if (!response.ok) throw new Error('OSRM service unavailable');
      const data = await response.json();
      if (data.routes && data.routes[0]?.geometry?.coordinates) {
        // GeoJSON coordinates are [lng, lat], Leaflet expects [lat, lng]
        return data.routes[0].geometry.coordinates.map(
          ([lng, lat]: [number, number]) => [lat, lng]
        );
      }
      throw new Error('No route geometry returned');
    } catch {
      // Straight-line fallback with gentle intermediate waypoint
      const midLat = (startLat + endLat) / 2;
      const midLng = (startLng + endLng) / 2 + 0.0003;
      return [
        [startLat, startLng],
        [midLat, midLng],
        [endLat, endLng],
      ];
    }
  },

  /**
   * Detect clashes across entries
   */
  detectClashes(entries = TIMETABLE_ENTRIES) {
    return detectClashes(entries);
  },

  /**
   * Export all timetable entries as an ICS file
   */
  exportTimetableICS(entries = TIMETABLE_ENTRIES): string {
    return generateICS(entries);
  },

  /**
   * Export a single calendar event as an RFC-compliant ICS
   */
  exportSingleEventICS(item: {
    title: string;
    description?: string;
    location?: string;
    date: string; // YYYY-MM-DD
    startTime?: string; // HH:mm
    endTime?: string;   // HH:mm
  }): string {
    const cleanDate = item.date.replace(/-/g, '');
    const startH = (item.startTime || '09:00').replace(':', '') + '00';
    const endH = (item.endTime || '10:00').replace(':', '') + '00';

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Kampas UEAB//Single Event//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@kampas.ueab.ac.ke`,
      `DTSTAMP:${cleanDate}T${startH}`,
      `DTSTART:${cleanDate}T${startH}`,
      `DTEND:${cleanDate}T${endH}`,
      `SUMMARY:${item.title}`,
      `DESCRIPTION:${item.description || 'Baraton Student Platform Event'}`,
      `LOCATION:${item.location || 'University of Eastern Africa, Baraton'}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
  },
};
