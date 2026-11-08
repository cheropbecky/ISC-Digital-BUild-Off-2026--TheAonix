/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * UEAB Baraton Venues & Facilities Mock Data
 * Every venue includes building exterior AND entrance door photos, indoor hints,
 * opening hours, capacity, and current day classes.
 */

import { IMAGES } from './images';

export interface VenueData {
  id: string;
  name: string;
  code: string;
  building: string;
  floor: string;
  capacity: number;
  category: 'lecture_hall' | 'lab' | 'library' | 'auditorium' | 'sports' | 'service';
  hasProjector: boolean;
  hasPowerSockets: boolean;
  hasWifi: boolean;
  isAccessible: boolean;
  indoorHints: string;
  openingHours: string;
  latitude: number;
  longitude: number;
  photos: {
    exterior: string;
    entranceDoor: string;
    interior: string;
  };
  todayClasses: Array<{
    unitCode: string;
    unitName: string;
    lecturer: string;
    time: string;
  }>;
}

export const VENUES: VenueData[] = [
  {
    id: 'venue-sciaud',
    name: 'Science Complex Auditorium',
    code: 'SCA-101',
    building: 'Faculty of Science & Technology',
    floor: '1st Floor',
    capacity: 140,
    category: 'lecture_hall',
    hasProjector: true,
    hasPowerSockets: true,
    hasWifi: true,
    isAccessible: true,
    indoorHints: 'Ascend the central glass staircase to Floor 1; entrance door is immediately adjacent to the faculty dean’s office on the north corridor.',
    openingHours: '07:00 AM – 09:30 PM (Mon - Fri)',
    latitude: 0.2604343,
    longitude: 35.0879822,
    photos: {
      exterior: IMAGES.scienceComplexExterior.url,
      entranceDoor: IMAGES.venueDoorStandard.url,
      interior: IMAGES.campusHero.url,
    },
    todayClasses: [
      { unitCode: 'COSC 311', unitName: 'Compiler Design & Formal Automata', lecturer: 'Dr. Evans Kiprop', time: '08:00 AM - 10:00 AM' },
      { unitCode: 'MATH 201', unitName: 'Linear Algebra with Vector Computation', lecturer: 'Dr. Benson Wafula', time: '11:00 AM - 01:00 PM' },
    ],
  },
  {
    id: 'venue-amphi',
    name: 'Administration Amphitheatre',
    code: 'AMPHI-01',
    building: 'Main Administration Complex',
    floor: 'Ground Floor',
    capacity: 240,
    category: 'auditorium',
    hasProjector: true,
    hasPowerSockets: true,
    hasWifi: true,
    isAccessible: true,
    indoorHints: 'Enter through the main clock-tower archway; double mahogany doors on your left before the executive boardroom stairs.',
    openingHours: '07:30 AM – 08:00 PM (Daily)',
    latitude: 0.2589343,
    longitude: 35.0864822,
    photos: {
      exterior: IMAGES.campusHero.url,
      entranceDoor: IMAGES.venueDoorStandard.url,
      interior: IMAGES.libraryExterior.url,
    },
    todayClasses: [
      { unitCode: 'COSC 420', unitName: 'Software Architecture & Cloud Systems', lecturer: 'Eng. Dennis Cheruiyot', time: '10:00 AM - 12:00 PM' },
    ],
  },
  {
    id: 'venue-compmb',
    name: 'Main Computing Lab B',
    code: 'CLB-204',
    building: 'Library Learning Commons',
    floor: '2nd Floor East',
    capacity: 70,
    category: 'lab',
    hasProjector: true,
    hasPowerSockets: true,
    hasWifi: true,
    isAccessible: true,
    indoorHints: 'Take eastern library stairs, turn right at quiet study foyer. Lab is secured behind double glass doors with card scanner.',
    openingHours: '07:00 AM – 11:00 PM (Mon - Thu, Sun)',
    latitude: 0.2594343,
    longitude: 35.0856822,
    photos: {
      exterior: IMAGES.libraryExterior.url,
      entranceDoor: IMAGES.venueDoorStandard.url,
      interior: IMAGES.venueInteriorLab.url,
    },
    todayClasses: [
      { unitCode: 'COSC 330', unitName: 'Advanced Database Management Systems', lecturer: 'Prof. Mary Achieng', time: '11:00 AM - 01:00 PM' },
    ],
  },
  {
    id: 'venue-nurslab',
    name: 'Nursing Simulation Ward 1',
    code: 'NSL-01',
    building: 'Health Sciences Pavilion',
    floor: 'Ground Floor',
    capacity: 45,
    category: 'lab',
    hasProjector: true,
    hasPowerSockets: true,
    hasWifi: true,
    isAccessible: true,
    indoorHints: 'Enter Health Sciences wing from the south walkway. Follow yellow floor safety line to clinical ward simulator.',
    openingHours: '08:00 AM – 06:00 PM',
    latitude: 0.2614343,
    longitude: 35.0849822,
    photos: {
      exterior: IMAGES.scienceComplexExterior.url,
      entranceDoor: IMAGES.venueDoorStandard.url,
      interior: IMAGES.venueInteriorLab.url,
    },
    todayClasses: [
      { unitCode: 'NURS 215', unitName: 'Human Anatomy & Physiology II', lecturer: 'Dr. Grace Kemboi', time: '02:00 PM - 05:00 PM' },
    ],
  },
  {
    id: 'venue-biz204',
    name: 'Business Seminar Room 204',
    code: 'BUS-204',
    building: 'School of Business Block',
    floor: '2nd Floor',
    capacity: 55,
    category: 'lecture_hall',
    hasProjector: true,
    hasPowerSockets: true,
    hasWifi: true,
    isAccessible: false,
    indoorHints: 'Climb stairs behind cafeteria veranda, second room on north corridor.',
    openingHours: '07:30 AM – 07:00 PM',
    latitude: 0.2582343,
    longitude: 35.0874822,
    photos: {
      exterior: IMAGES.studentLifeQuad.url,
      entranceDoor: IMAGES.venueDoorStandard.url,
      interior: IMAGES.campusHero.url,
    },
    todayClasses: [
      { unitCode: 'BBA 302', unitName: 'Strategic Management & Leadership', lecturer: 'Prof. Samuel Njoroge', time: '08:00 AM - 10:00 AM' },
    ],
  },
  {
    id: 'venue-chapel',
    name: 'Baraton University Church Sanctuary',
    code: 'UCH-01',
    building: 'University Church Complex',
    floor: 'Ground Floor',
    capacity: 900,
    category: 'auditorium',
    hasProjector: true,
    hasPowerSockets: false,
    hasWifi: true,
    isAccessible: true,
    indoorHints: 'Main campus sanctuary; use west portico entrance near the prayer garden fountain.',
    openingHours: '06:00 AM – 09:00 PM (Daily)',
    latitude: 0.2599343,
    longitude: 35.0862822,
    photos: {
      exterior: IMAGES.campusHero.url,
      entranceDoor: IMAGES.venueDoorStandard.url,
      interior: IMAGES.studentLifeQuad.url,
    },
    todayClasses: [
      { unitCode: 'RELT 220', unitName: 'Christian Ethics & Social Responsibility', lecturer: 'Pastor Jonathan Bett', time: '07:30 AM - 09:00 AM' },
    ],
  },
  {
    id: 'venue-poly12',
    name: 'Polytechnic Engineering Workshop 12',
    code: 'PEW-12',
    building: 'Engineering & Polytechnic Annex',
    floor: 'Ground Floor',
    capacity: 55,
    category: 'lab',
    hasProjector: true,
    hasPowerSockets: true,
    hasWifi: true,
    isAccessible: true,
    indoorHints: 'Pass security gate 2; workshop door has blue mechanical safety signage and safety helmet rack.',
    openingHours: '08:00 AM – 05:00 PM',
    latitude: 0.2622343,
    longitude: 35.0889822,
    photos: {
      exterior: IMAGES.scienceComplexExterior.url,
      entranceDoor: IMAGES.venueDoorStandard.url,
      interior: IMAGES.venueInteriorLab.url,
    },
    todayClasses: [
      { unitCode: 'ENGR 210', unitName: 'Digital Logic & Microprocessors', lecturer: 'Dr. Paul Mutua', time: '08:00 AM - 11:00 AM' },
    ],
  },
  {
    id: 'venue-scmp',
    name: 'Student Centre Multipurpose Hall',
    code: 'SC-MPH',
    building: 'Student Life Centre',
    floor: 'Ground Floor',
    capacity: 180,
    category: 'service',
    hasProjector: true,
    hasPowerSockets: true,
    hasWifi: true,
    isAccessible: true,
    indoorHints: 'Directly opposite the Campus Guild offices and postal counter in the student plaza.',
    openingHours: '08:00 AM – 10:00 PM',
    latitude: 0.2574343,
    longitude: 35.0869822,
    photos: {
      exterior: IMAGES.studentLifeQuad.url,
      entranceDoor: IMAGES.venueDoorStandard.url,
      interior: IMAGES.libraryExterior.url,
    },
    todayClasses: [
      { unitCode: 'COMM 111', unitName: 'Scholarly Writing & Academic Oratory', lecturer: 'Dr. Sarah Rotich', time: '02:00 PM - 04:00 PM' },
    ],
  },
  {
    id: 'venue-sports',
    name: 'Baraton Gymnasium & Athletic Pavilion',
    code: 'GYM-01',
    building: 'Sports Complex',
    floor: 'Ground Floor',
    capacity: 350,
    category: 'sports',
    hasProjector: false,
    hasPowerSockets: false,
    hasWifi: true,
    isAccessible: true,
    indoorHints: 'Alongside the championship athletics track and outdoor basketball courts near Gate 3.',
    openingHours: '06:00 AM – 07:00 PM',
    latitude: 0.2564343,
    longitude: 35.0884822,
    photos: {
      exterior: IMAGES.campusHero.url,
      entranceDoor: IMAGES.venueDoorStandard.url,
      interior: IMAGES.studentLifeQuad.url,
    },
    todayClasses: [],
  },
  {
    id: 'venue-health',
    name: 'University Health & Medical Clinic',
    code: 'UHC-01',
    building: 'Medical Services Pavilion',
    floor: 'Ground Floor',
    capacity: 40,
    category: 'service',
    hasProjector: false,
    hasPowerSockets: true,
    hasWifi: true,
    isAccessible: true,
    indoorHints: 'Near staff residential quarter road; blue cross sign above main reception glass door.',
    openingHours: '24 Hours Emergency Clinic',
    latitude: 0.2609343,
    longitude: 35.0839822,
    photos: {
      exterior: IMAGES.scienceComplexExterior.url,
      entranceDoor: IMAGES.venueDoorStandard.url,
      interior: IMAGES.venueInteriorLab.url,
    },
    todayClasses: [],
  },
];
