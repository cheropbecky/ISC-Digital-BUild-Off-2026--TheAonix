/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * UEAB Student Timetable & Class Schedule Mock Data
 * Becky Cherop - BSc Software Engineering (Year 3, Trimester 1)
 * Units with colors, lecturer details, venues, clash warnings, and ICS export.
 * NOTE: Strictly no free-room finder features or layers.
 */

export interface TimetableEntry {
  id: string;
  unitCode: string;
  unitName: string;
  lecturer: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  timeFormatted: string;
  venueId: string;
  venueName: string;
  venueCode: string;
  building: string;
  color: string; // Hex color for timetable block
  accentColor: string;
  isRelocated?: boolean;
  relocationNote?: string;
  hasClash?: boolean;
  clashWith?: string;
  group?: string;
  type: 'Lecture' | 'Lab' | 'Tutorial';
}

export const TIMETABLE_ENTRIES: TimetableEntry[] = [
  // Monday
  {
    id: 'tt-mon-1',
    unitCode: 'COSC 311',
    unitName: 'Compiler Design & Formal Automata',
    lecturer: 'Dr. Evans Kiprop',
    dayOfWeek: 'Monday',
    startTime: '08:00',
    endTime: '10:00',
    timeFormatted: '08:00 AM - 10:00 AM',
    venueId: 'venue-sciaud',
    venueName: 'Science Complex Auditorium',
    venueCode: 'SCA-101',
    building: 'Faculty of Science & Technology',
    color: '#0B2A6F',
    accentColor: '#F2B705',
    isRelocated: false,
    type: 'Lecture',
  },
  {
    id: 'tt-mon-2',
    unitCode: 'MATH 201',
    unitName: 'Linear Algebra with Vector Computation',
    lecturer: 'Dr. Benson Wafula',
    dayOfWeek: 'Monday',
    startTime: '11:00',
    endTime: '13:00',
    timeFormatted: '11:00 AM - 01:00 PM',
    venueId: 'venue-sciaud',
    venueName: 'Science Complex Auditorium',
    venueCode: 'SCA-101',
    building: 'Faculty of Science & Technology',
    color: '#16A34A',
    accentColor: '#86EFAC',
    isRelocated: true,
    relocationNote: 'Relocated from SCA-101 to Tech Block Lab 3 for linear solver simulation exercises.',
    type: 'Lecture',
  },
  {
    id: 'tt-mon-3',
    unitCode: 'COSC 330',
    unitName: 'Advanced Database Management Systems',
    lecturer: 'Prof. Mary Achieng',
    dayOfWeek: 'Monday',
    startTime: '14:00',
    endTime: '17:00',
    timeFormatted: '02:00 PM - 05:00 PM',
    venueId: 'venue-compmb',
    venueName: 'Main Computing Lab B',
    venueCode: 'CLB-204',
    building: 'Library Learning Commons',
    color: '#D97706',
    accentColor: '#FDE68A',
    type: 'Lab',
  },

  // Tuesday
  {
    id: 'tt-tue-1',
    unitCode: 'RELT 220',
    unitName: 'Christian Ethics & Social Responsibility',
    lecturer: 'Pastor Jonathan Bett',
    dayOfWeek: 'Tuesday',
    startTime: '07:30',
    endTime: '09:00',
    timeFormatted: '07:30 AM - 09:00 AM',
    venueId: 'venue-chapel',
    venueName: 'Baraton University Church Sanctuary',
    venueCode: 'UCH-01',
    building: 'University Church Complex',
    color: '#6366F1',
    accentColor: '#C7D2FE',
    type: 'Lecture',
  },
  {
    id: 'tt-tue-2',
    unitCode: 'COSC 420',
    unitName: 'Software Architecture & Cloud Systems',
    lecturer: 'Eng. Dennis Cheruiyot',
    dayOfWeek: 'Tuesday',
    startTime: '10:00',
    endTime: '12:00',
    timeFormatted: '10:00 AM - 12:00 PM',
    venueId: 'venue-amphi',
    venueName: 'Administration Amphitheatre',
    venueCode: 'AMPHI-01',
    building: 'Main Administration Complex',
    color: '#0284C7',
    accentColor: '#BAE6FD',
    type: 'Lecture',
  },
  {
    id: 'tt-tue-3',
    unitCode: 'ENGR 210',
    unitName: 'Digital Logic & Microprocessors',
    lecturer: 'Dr. Paul Mutua',
    dayOfWeek: 'Tuesday',
    startTime: '14:00',
    endTime: '16:00',
    timeFormatted: '02:00 PM - 04:00 PM',
    venueId: 'venue-poly12',
    venueName: 'Polytechnic Engineering Workshop 12',
    venueCode: 'PEW-12',
    building: 'Engineering & Polytechnic Annex',
    color: '#8B5CF6',
    accentColor: '#DDD6FE',
    type: 'Lab',
  },

  // Wednesday
  {
    id: 'tt-wed-1',
    unitCode: 'COSC 311',
    unitName: 'Compiler Design & Formal Automata',
    lecturer: 'Dr. Evans Kiprop',
    dayOfWeek: 'Wednesday',
    startTime: '09:00',
    endTime: '11:00',
    timeFormatted: '09:00 AM - 11:00 AM',
    venueId: 'venue-compmb',
    venueName: 'Main Computing Lab B',
    venueCode: 'CLB-204',
    building: 'Library Learning Commons',
    color: '#0B2A6F',
    accentColor: '#F2B705',
    type: 'Lab',
  },
  {
    id: 'tt-wed-2',
    unitCode: 'COMM 111',
    unitName: 'Scholarly Writing & Academic Oratory',
    lecturer: 'Dr. Sarah Rotich',
    dayOfWeek: 'Wednesday',
    startTime: '14:00',
    endTime: '16:00',
    timeFormatted: '02:00 PM - 04:00 PM',
    venueId: 'venue-scmp',
    venueName: 'Student Centre Multipurpose Hall',
    venueCode: 'SC-MPH',
    building: 'Student Life Centre',
    color: '#EC4899',
    accentColor: '#FBCFE8',
    type: 'Lecture',
  },

  // Thursday
  {
    id: 'tt-thu-1',
    unitCode: 'COSC 420',
    unitName: 'Software Architecture & Cloud Systems',
    lecturer: 'Eng. Dennis Cheruiyot',
    dayOfWeek: 'Thursday',
    startTime: '08:00',
    endTime: '10:00',
    timeFormatted: '08:00 AM - 10:00 AM',
    venueId: 'venue-sciaud',
    venueName: 'Science Complex Auditorium',
    venueCode: 'SCA-101',
    building: 'Faculty of Science & Technology',
    color: '#0284C7',
    accentColor: '#BAE6FD',
    type: 'Lecture',
  },
  {
    id: 'tt-thu-2',
    unitCode: 'MATH 201',
    unitName: 'Linear Algebra with Vector Computation',
    lecturer: 'Dr. Benson Wafula',
    dayOfWeek: 'Thursday',
    startTime: '11:00',
    endTime: '13:00',
    timeFormatted: '11:00 AM - 01:00 PM',
    venueId: 'venue-sciaud',
    venueName: 'Science Complex Auditorium',
    venueCode: 'SCA-101',
    building: 'Faculty of Science & Technology',
    color: '#16A34A',
    accentColor: '#86EFAC',
    type: 'Lecture',
  },

  // Friday
  {
    id: 'tt-fri-1',
    unitCode: 'COSC 330',
    unitName: 'Advanced Database Management Systems',
    lecturer: 'Prof. Mary Achieng',
    dayOfWeek: 'Friday',
    startTime: '09:00',
    endTime: '11:00',
    timeFormatted: '09:00 AM - 11:00 AM',
    venueId: 'venue-amphi',
    venueName: 'Administration Amphitheatre',
    venueCode: 'AMPHI-01',
    building: 'Main Administration Complex',
    color: '#D97706',
    accentColor: '#FDE68A',
    type: 'Lecture',
  },
  {
    id: 'tt-fri-2',
    unitCode: 'COMMUNITY',
    unitName: 'Friday Sunset Vespers & Choir Worship',
    lecturer: 'University Chaplaincy',
    dayOfWeek: 'Friday',
    startTime: '17:30',
    endTime: '19:00',
    timeFormatted: '05:30 PM - 07:00 PM',
    venueId: 'venue-chapel',
    venueName: 'Baraton University Church Sanctuary',
    venueCode: 'UCH-01',
    building: 'University Church Complex',
    color: '#071B4A',
    accentColor: '#F2B705',
    type: 'Lecture',
  },
];

/**
 * Generate standard iCalendar (.ics) string for export
 */
export function generateICS(entries: TimetableEntry[]): string {
  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kampas UEAB//Student Timetable//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:UEAB Timetable (Becky Cherop)',
  ];

  const dayOffsets: Record<string, number> = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
  };

  entries.forEach((e) => {
    ics.push(
      'BEGIN:VEVENT',
      `UID:${e.id}@kampas.ueab.ac.ke`,
      `SUMMARY:${e.unitCode} - ${e.unitName}`,
      `DESCRIPTION:Lecturer: ${e.lecturer}\\nType: ${e.type}`,
      `LOCATION:${e.venueName} (${e.venueCode}), ${e.building}`,
      `STATUS:CONFIRMED`,
      'END:VEVENT'
    );
  });

  ics.push('END:VCALENDAR');
  return ics.join('\r\n');
}
