/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Timetable & Academic Deadlines Service
 */

import { TIMETABLE_ENTRIES, TimetableEntry, generateICS } from '../data/timetable';
import { DEADLINES, AcademicDeadline } from '../data/deadlines';

const LATENCY_MS = 60;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const timetableService = {
  async getTimetable(): Promise<TimetableEntry[]> {
    await sleep(LATENCY_MS);
    return [...TIMETABLE_ENTRIES];
  },

  async getTodayClasses(): Promise<TimetableEntry[]> {
    await sleep(LATENCY_MS);
    // For demo purposes, map current real-world day or default to Monday/Tuesday
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sabbath'];
    const currentDayName = days[new Date().getDay()];
    const validDay = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(currentDayName)
      ? currentDayName
      : 'Monday';
    
    return TIMETABLE_ENTRIES.filter((e) => e.dayOfWeek === validDay);
  },

  async getDeadlines(): Promise<AcademicDeadline[]> {
    await sleep(LATENCY_MS);
    return [...DEADLINES];
  },

  exportCalendarICS(entries: TimetableEntry[]): string {
    return generateICS(entries);
  },
};
