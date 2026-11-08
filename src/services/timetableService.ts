/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Timetable & Academic Deadlines Service
 */

import { TIMETABLE_ENTRIES, generateICS } from '../data/timetable';
import { DEADLINES, AcademicDeadline } from '../data/deadlines';
import { TimetableEntry } from '../lib/types';
import { IS_SUPABASE_CONFIGURED, supabase } from '../lib/supabase';

const LATENCY_MS = 60;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const timetableService = {
  async getTimetable(): Promise<TimetableEntry[]> {
    if (!IS_SUPABASE_CONFIGURED) {
      await sleep(LATENCY_MS);
      return [...TIMETABLE_ENTRIES.map((entry) => ({
        id: entry.id,
        unitCode: entry.unitCode,
        unitName: entry.unitName,
        lecturerName: entry.lecturer,
        venueId: entry.venueId,
        venueName: entry.venueName,
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].indexOf(entry.dayOfWeek) + 1,
        startTime: entry.startTime,
        endTime: entry.endTime,
        isVenueChanged: entry.isRelocated,
        venueChangeNote: entry.relocationNote,
        recurrence: 'weekly',
      } satisfies TimetableEntry))];
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

  async getTodayClasses(): Promise<TimetableEntry[]> {
    const timetable = await this.getTimetable();
    const currentDay = new Date().getDay();
    const validDay = currentDay >= 1 && currentDay <= 5 ? currentDay : 1;
    return timetable.filter((entry) => entry.dayOfWeek === validDay);
  },

  async getDeadlines(): Promise<AcademicDeadline[]> {
    await sleep(LATENCY_MS);
    return [...DEADLINES];
  },

  exportCalendarICS(entries: TimetableEntry[]): string {
    return generateICS(entries.map((entry) => ({
      id: entry.id,
      unitCode: entry.unitCode,
      unitName: entry.unitName,
      lecturer: entry.lecturerName,
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][entry.dayOfWeek - 1] as 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday',
      startTime: entry.startTime,
      endTime: entry.endTime,
      timeFormatted: `${entry.startTime} - ${entry.endTime}`,
      venueId: entry.venueId,
      venueName: entry.venueName,
      venueCode: '',
      building: '',
      color: '#0B2A6F',
      accentColor: '#F2B705',
      type: 'Lecture',
    })));
  },
};
