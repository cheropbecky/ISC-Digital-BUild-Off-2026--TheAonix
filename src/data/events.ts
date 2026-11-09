/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * UEAB Baraton Campus Calendar & Academic Events
 * University of Eastern Africa, Baraton (Nandi County, Kenya)
 */

export interface CalendarEvent {
  id: string;
  title: string;
  category: 'academic' | 'exam' | 'spiritual' | 'sports' | 'community' | 'personal';
  startDate: string; // ISO string or YYYY-MM-DD
  endDate?: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  venueId?: string;
  venueName: string;
  description: string;
  isOfficial: boolean;
  color: string;
  accentColor?: string;
  repeat?: 'none' | 'weekly' | 'daily';
  reminderMinutes?: number;
}

// Generate realistic dynamic dates based on the current day
const getRelativeDate = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const CAMPUS_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-vespers-today',
    title: 'Friday Sunset Vespers & Sanctuary Chorale',
    category: 'spiritual',
    startDate: getRelativeDate(0),
    startTime: '17:30',
    endTime: '19:00',
    venueId: 'venue-chapel',
    venueName: 'Baraton University Church Sanctuary',
    description: 'Weekly Friday sunset opening of the Sabbath featuring the Baraton University Sanctuary Chorale and devotional meditation.',
    isOfficial: true,
    color: '#0B2A6F',
    accentColor: '#F2B705',
    repeat: 'weekly',
    reminderMinutes: 30,
  },
  {
    id: 'evt-sabbath-worship',
    title: 'Sabbath Divine Worship & Youth Fellowship',
    category: 'spiritual',
    startDate: getRelativeDate(1),
    startTime: '09:00',
    endTime: '12:30',
    venueId: 'venue-chapel',
    venueName: 'Baraton University Church Sanctuary',
    description: 'Sabbath School lesson study discussion groups followed by the Main University Divine Worship Service.',
    isOfficial: true,
    color: '#071B4A',
    accentColor: '#F2B705',
    repeat: 'weekly',
  },
  {
    id: 'evt-cat-cosc311',
    title: 'Continuous Assessment Test 1: COSC 311 Compilers',
    category: 'exam',
    startDate: getRelativeDate(2),
    startTime: '08:00',
    endTime: '10:00',
    venueId: 'venue-sciaud',
    venueName: 'Science Complex Auditorium',
    description: 'Closed-book examination covering regular expressions, non-deterministic automata conversion, and top-down recursive descent parsing.',
    isOfficial: true,
    color: '#DC2626',
    accentColor: '#FCA5A5',
    reminderMinutes: 1440,
  },
  {
    id: 'evt-hackathon',
    title: 'Baraton Developer Guild: 24h AgTech Innovation Hackathon',
    category: 'community',
    startDate: getRelativeDate(4),
    startTime: '09:00',
    endTime: '18:00',
    venueId: 'venue-compmb',
    venueName: 'Main Computing Lab B',
    description: 'Annual software hackathon solving tea farm supply chain tracking and soil nutrient IoT sensors in Nandi County.',
    isOfficial: true,
    color: '#059669',
    accentColor: '#A7F3D0',
    reminderMinutes: 60,
  },
  {
    id: 'evt-cat-math201',
    title: 'Mid-Trimester Examination: MATH 201 Linear Algebra',
    category: 'exam',
    startDate: getRelativeDate(6),
    startTime: '11:00',
    endTime: '13:00',
    venueId: 'venue-amphi',
    venueName: 'Administration Amphitheatre',
    description: 'Comprehensive mid-term test evaluating Gaussian-Jordan elimination, matrix inversions, and vector subspace dimensions.',
    isOfficial: true,
    color: '#DC2626',
    accentColor: '#FCA5A5',
    reminderMinutes: 1440,
  },
  {
    id: 'evt-sports-derby',
    title: 'Inter-Faculty Volleyball & Basketball Tournament',
    category: 'sports',
    startDate: getRelativeDate(7),
    startTime: '14:00',
    endTime: '17:30',
    venueId: 'venue-sports',
    venueName: 'Baraton Gymnasium & Athletic Pavilion',
    description: 'Science & Technology Titans vs School of Business Royals in the championship playoffs.',
    isOfficial: true,
    color: '#D97706',
    accentColor: '#FDE68A',
  },
  {
    id: 'evt-career-fair',
    title: 'Nandi Tech & Health Sciences Career Summit 2026',
    category: 'academic',
    startDate: getRelativeDate(11),
    startTime: '10:00',
    endTime: '16:00',
    venueId: 'venue-scmp',
    venueName: 'Student Centre Multipurpose Hall',
    description: 'Annual corporate recruitment fair featuring tech hubs, hospital networks, and financial institutions from Eldoret, Kisumu, and Nairobi.',
    isOfficial: true,
    color: '#0284C7',
    accentColor: '#BAE6FD',
    reminderMinutes: 120,
  },
];
