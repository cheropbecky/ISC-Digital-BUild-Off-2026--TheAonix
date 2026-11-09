/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * UEAB Baraton Venues & Facilities Master Data
 * University of Eastern Africa, Baraton, Nandi County, Kenya
 * Verified Real Campus Center: [0.25766, 35.08578] (OSM Way 218276680)
 * The directory is limited to UEAB Baraton facilities. Photos use locally bundled
 * official UEAB imagery; an image is not presented as a building-specific photo
 * unless the source identifies that facility.
 */

import { IMAGES } from './images';

// OSM way 218276680 centroid: the single campus reference point used by the map.
// Keep these editable here so map, routing, and venue tooling share one source of truth.
export const UEAB_CAMPUS_CENTER: [number, number] = [0.25766, 35.08578];

// Existing main-gate pin used by the campus road geometry and routing fallback origin.
// Confirm this entrance pin with UEAB Security/OSM before using it for production turn-by-turn navigation.
export const UEAB_MAIN_GATE: [number, number] = [0.25889, 35.08298];

export type VenueCategory = 'academic' | 'services' | 'worship' | 'sports' | 'events' | 'lost_found';

export interface VenuePhotos {
  exterior: string;
  exteriorAlt: string;
  entranceDoor: string;
  entranceDoorAlt: string;
  interior?: string;
}

export interface VenueData {
  id: string;
  name: string;
  code: string;
  category: VenueCategory;
  building: string;
  floor: string;
  capacity?: number;
  hasProjector?: boolean;
  hasPowerSockets?: boolean;
  hasWifi?: boolean;
  isAccessible?: boolean;
  indoorHint: string;
  indoorHints: string; // backwards compatibility
  openingHours: string;
  lat: number;
  lng: number;
  latitude: number;  // backwards compatibility
  longitude: number; // backwards compatibility
  photos: VenuePhotos;
  todayClasses?: Array<{
    unitCode: string;
    unitName: string;
    lecturer: string;
    time: string;
  }>;
}

export const VENUES: VenueData[] = [
  // 1. University Library
  {
    id: 'venue-library',
    name: 'University Library',
    code: 'LIB-01',
    category: 'academic',
    building: 'Library & Learning Commons Block',
    floor: 'Ground & 1st Floor',
    capacity: 350,
    hasProjector: true,
    hasPowerSockets: true,
    hasWifi: true,
    isAccessible: true,
    indoorHint: 'Main foyer through turnstiles; reserve collection on ground floor, reference & quiet research suites on 1st floor.',
    indoorHints: 'Main foyer through turnstiles; reserve collection on ground floor, reference & quiet research suites on 1st floor.',
    openingHours: '07:30 AM – 10:00 PM (Mon - Thu, Sun), 07:30 AM – 03:00 PM (Fri)',
    // TODO: verify coordinates
    lat: 0.26320,
    // TODO: verify coordinates
    lng: 35.08547,
    latitude: 0.26320,
    longitude: 35.08547,
    photos: {
      exterior: IMAGES.baratonResearchConference.url,
      exteriorAlt: 'Official UEAB Baraton research and learning event on campus',
      entranceDoor: IMAGES.venueDoorStandard.url,
      entranceDoorAlt: 'Library main entrance double doors with electronic card access and reception desk',
      interior: IMAGES.baratonResearchConference.url,
    },
    todayClasses: [
      { unitCode: 'COSC 330', unitName: 'Advanced Database Systems', lecturer: 'Prof. Mary Achieng', time: '11:00 AM - 01:00 PM' },
    ],
  },

  // 2. Administration Block
  {
    id: 'venue-admin',
    name: 'Administration Block',
    code: 'ADM-01',
    category: 'services',
    building: 'Main Administration & Clock Tower Building',
    floor: 'Ground & 1st Floor',
    capacity: 120,
    hasProjector: true,
    hasPowerSockets: true,
    hasWifi: true,
    isAccessible: true,
    indoorHint: 'Main administrative offices: Vice-Chancellor, Registrar, Admissions, and Student Finance along the central rotunda hallway.',
    indoorHints: 'Main administrative offices: Vice-Chancellor, Registrar, Admissions, and Student Finance along the central rotunda hallway.',
    openingHours: '08:00 AM – 05:00 PM (Mon - Thu), 08:00 AM – 01:00 PM (Fri)',
    // TODO: verify coordinates
    lat: 0.26172,
    // TODO: verify coordinates
    lng: 35.08573,
    latitude: 0.26172,
    longitude: 35.08573,
    photos: {
      exterior: IMAGES.baratonNewSignage.url,
      exteriorAlt: 'UEAB Baraton campus signage in front of the administration building',
      entranceDoor: IMAGES.venueDoorStandard.url,
      entranceDoorAlt: 'Administration central double glass doors under the clock tower arch',
      interior: IMAGES.baratonNewSignage.url,
    },
    todayClasses: [],
  },

  // 3. Main Church
  {
    id: 'venue-church',
    name: 'Main Church',
    code: 'UCH-01',
    category: 'worship',
    building: 'University Seventh-day Adventist Church',
    floor: 'Ground Floor & Balcony',
    capacity: 1500,
    hasProjector: true,
    hasPowerSockets: false,
    hasWifi: true,
    isAccessible: true,
    indoorHint: 'Main sanctuary entrance through west portico gates; balcony access via dual north and south stairwells.',
    indoorHints: 'Main sanctuary entrance through west portico gates; balcony access via dual north and south stairwells.',
    openingHours: '06:00 AM – 09:00 PM (Daily, Sabbath worship Friday sunset to Saturday sunset)',
    // TODO: verify coordinates
    lat: 0.26223,
    // TODO: verify coordinates
    lng: 35.08608,
    latitude: 0.26223,
    longitude: 35.08608,
    photos: {
      exterior: IMAGES.baratonGraduation.url,
      exteriorAlt: 'Official UEAB Baraton graduation day gathering on campus',
      entranceDoor: IMAGES.venueDoorStandard.url,
      entranceDoorAlt: 'Main Church portico wooden double doors with brass handles',
      interior: IMAGES.baratonGraduation.url,
    },
    todayClasses: [
      { unitCode: 'RELT 220', unitName: 'Christian Ethics & Social Responsibility', lecturer: 'Pastor Jonathan Bett', time: '08:00 AM - 09:30 AM' },
    ],
  },

  // 4. Auditorium
  {
    id: 'venue-auditorium',
    name: 'Auditorium',
    code: 'AUD-01',
    category: 'events',
    building: 'Central Assembly Complex',
    floor: 'Ground Floor',
    capacity: 600,
    hasProjector: true,
    hasPowerSockets: true,
    hasWifi: true,
    isAccessible: true,
    indoorHint: 'Ground floor tiered theater with stage lighting, acoustics control booth at rear center.',
    indoorHints: 'Ground floor tiered theater with stage lighting, acoustics control booth at rear center.',
    openingHours: '07:30 AM – 09:00 PM (Event & scheduled lecture basis)',
    // TODO: verify coordinates
    lat: 0.26334,
    // TODO: verify coordinates
    lng: 35.08588,
    latitude: 0.26334,
    longitude: 35.08588,
    photos: {
      exterior: IMAGES.baratonAuditorium.url,
      exteriorAlt: 'Official UEAB Baraton auditorium event',
      entranceDoor: IMAGES.venueDoorStandard.url,
      entranceDoorAlt: 'Acoustic-sealed double doors to main auditorium hall',
      interior: IMAGES.baratonAuditorium.url,
    },
    todayClasses: [
      { unitCode: 'COSC 311', unitName: 'Compiler Design & Formal Automata', lecturer: 'Dr. Evans Kiprop', time: '08:00 AM - 10:00 AM' },
    ],
  },

  // 5. Student Center
  {
    id: 'venue-student-center',
    name: 'Student Center',
    code: 'SC-01',
    category: 'services',
    building: 'Student Life & Guild Pavilion',
    floor: 'Ground & 1st Floor',
    capacity: 250,
    hasProjector: false,
    hasPowerSockets: true,
    hasWifi: true,
    isAccessible: true,
    indoorHint: 'Houses Student Association offices, bookstore, student postal lockers, and indoor recreational lounge.',
    indoorHints: 'Houses Student Association offices, bookstore, student postal lockers, and indoor recreational lounge.',
    openingHours: '07:00 AM – 10:30 PM (Daily)',
    // TODO: verify coordinates
    lat: 0.26229,
    // TODO: verify coordinates
    lng: 35.08358,
    latitude: 0.26229,
    longitude: 35.08358,
    photos: {
      exterior: IMAGES.baratonGraduation.url,
      exteriorAlt: 'Official UEAB Baraton student community gathering',
      entranceDoor: IMAGES.venueDoorStandard.url,
      entranceDoorAlt: 'Student Center main glass sliding doors into student guild lounge',
      interior: IMAGES.baratonGraduation.url,
    },
    todayClasses: [
      { unitCode: 'COMM 111', unitName: 'Scholarly Writing & Academic Oratory', lecturer: 'Dr. Sarah Rotich', time: '02:00 PM - 04:00 PM' },
    ],
  },

  // 6. Dining Hall
  {
    id: 'venue-dining-hall',
    name: 'Dining Hall',
    code: 'DH-01',
    category: 'services',
    building: 'University Food Services Complex',
    floor: 'Ground Floor',
    capacity: 800,
    hasProjector: false,
    hasPowerSockets: false,
    hasWifi: true,
    isAccessible: true,
    indoorHint: 'Dual cafeteria service lines for hot vegetarian meals; ticket scanning counter at main entrance.',
    indoorHints: 'Dual cafeteria service lines for hot vegetarian meals; ticket scanning counter at main entrance.',
    openingHours: 'Breakfast: 06:30 – 08:30 AM, Lunch: 12:00 – 02:00 PM, Supper: 05:30 – 07:30 PM',
    // TODO: verify coordinates
    lat: 0.26245,
    // TODO: verify coordinates
    lng: 35.08369,
    latitude: 0.26245,
    longitude: 35.08369,
    photos: {
      exterior: IMAGES.baratonAuditorium.url,
      exteriorAlt: 'Official UEAB Baraton community event',
      entranceDoor: IMAGES.venueDoorStandard.url,
      entranceDoorAlt: 'Dining Hall entrance turnstiles with meal registration card readers',
      interior: IMAGES.baratonAuditorium.url,
    },
    todayClasses: [],
  },

  // 7. Science Building
  {
    id: 'venue-science',
    name: 'Science Building',
    code: 'SCI-01',
    category: 'academic',
    building: 'Faculty of Science & Technology Block',
    floor: 'Ground, 1st & 2nd Floors',
    capacity: 400,
    hasProjector: true,
    hasPowerSockets: true,
    hasWifi: true,
    isAccessible: true,
    indoorHint: 'Ground floor chemistry & biology wet labs; 1st floor computer science labs & faculty offices; 2nd floor physics labs.',
    indoorHints: 'Ground floor chemistry & biology wet labs; 1st floor computer science labs & faculty offices; 2nd floor physics labs.',
    openingHours: '07:00 AM – 09:30 PM (Mon - Fri)',
    // TODO: verify coordinates
    lat: 0.26080,
    // TODO: verify coordinates
    lng: 35.08388,
    latitude: 0.26080,
    longitude: 35.08388,
    photos: {
      exterior: IMAGES.baratonResearchConference.url,
      exteriorAlt: 'Official UEAB Baraton academic research event',
      entranceDoor: IMAGES.venueDoorStandard.url,
      entranceDoorAlt: 'Science Complex glass double doors with laboratory safety guidelines signage',
      interior: IMAGES.baratonResearchConference.url,
    },
    todayClasses: [
      { unitCode: 'MATH 201', unitName: 'Linear Algebra with Vector Computation', lecturer: 'Dr. Benson Wafula', time: '11:00 AM - 01:00 PM' },
      { unitCode: 'COSC 420', unitName: 'Software Architecture & Cloud Systems', lecturer: 'Eng. Dennis Cheruiyot', time: '10:00 AM - 12:00 PM' },
    ],
  },

  // 8. Amphitheater
  {
    id: 'venue-amphitheater',
    name: 'Amphitheater',
    code: 'AMPHI-01',
    category: 'events',
    building: 'Open Air Academic Amphitheater',
    floor: 'Outdoor Tiered Bowl',
    capacity: 700,
    hasProjector: false,
    hasPowerSockets: true,
    hasWifi: true,
    isAccessible: true,
    indoorHint: 'Tiered semi-circular stone seating bowl adjacent to the main administration gardens for outdoor lectures and student presentations.',
    indoorHints: 'Tiered semi-circular stone seating bowl adjacent to the main administration gardens for outdoor lectures and student presentations.',
    openingHours: '06:00 AM – 07:00 PM (Daylight hours)',
    // TODO: verify coordinates
    lat: 0.26381,
    // TODO: verify coordinates
    lng: 35.08679,
    latitude: 0.26381,
    longitude: 35.08679,
    photos: {
      exterior: IMAGES.baratonRoadRace.url,
      exteriorAlt: 'Official Baraton Road Race and Fun Run campus event',
      entranceDoor: IMAGES.venueDoorStandard.url,
      entranceDoorAlt: 'Entrance ramp leading into the lower amphitheater stage area',
      interior: IMAGES.baratonRoadRace.url,
    },
    todayClasses: [],
  },

  // 9. Research and Community Center
  {
    id: 'venue-research-community',
    name: 'Research and Community Center',
    code: 'RCC-01',
    category: 'academic',
    building: 'Interdisciplinary Research & Outreach Facility',
    floor: 'Ground & 1st Floor',
    capacity: 180,
    hasProjector: true,
    hasPowerSockets: true,
    hasWifi: true,
    isAccessible: true,
    indoorHint: 'Ground floor research data collection suites; 1st floor community engagement seminar hall and conference room.',
    indoorHints: 'Ground floor research data collection suites; 1st floor community engagement seminar hall and conference room.',
    openingHours: '08:00 AM – 06:00 PM (Mon - Fri)',
    // TODO: verify coordinates
    lat: 0.26099,
    // TODO: verify coordinates
    lng: 35.08516,
    latitude: 0.26099,
    longitude: 35.08516,
    photos: {
      exterior: IMAGES.baratonResearchConference.url,
      exteriorAlt: 'Official UEAB Baraton research conference campus event',
      entranceDoor: IMAGES.venueDoorStandard.url,
      entranceDoorAlt: 'Glass security door with badge scanner for research staff and scholars',
      interior: IMAGES.baratonResearchConference.url,
    },
    todayClasses: [],
  },

  // 10. Ellen G. White Research Centre
  {
    id: 'venue-egw-centre',
    name: 'Ellen G. White Research Centre',
    code: 'EGW-01',
    category: 'worship',
    building: 'Heritage & Theological Archive Pavilion',
    floor: '1st Floor Library Wing',
    capacity: 60,
    hasProjector: true,
    hasPowerSockets: true,
    hasWifi: true,
    isAccessible: true,
    indoorHint: 'Located within the library east wing; specialized research archives, rare books room, and microfilm study carrels.',
    indoorHints: 'Located within the library east wing; specialized research archives, rare books room, and microfilm study carrels.',
    openingHours: '08:30 AM – 05:00 PM (Mon - Thu), 08:30 AM – 01:00 PM (Fri)',
    // TODO: verify coordinates
    lat: 0.26325,
    // TODO: verify coordinates
    lng: 35.08562,
    latitude: 0.26325,
    longitude: 35.08562,
    photos: {
      exterior: IMAGES.baratonResearchConference.url,
      exteriorAlt: 'Official UEAB Baraton research and learning event',
      entranceDoor: IMAGES.venueDoorStandard.url,
      entranceDoorAlt: 'Archival climate-controlled wooden glass door with EGW research plaque',
      interior: IMAGES.baratonResearchConference.url,
    },
    todayClasses: [],
  },

  // 11. Health Centre (institutional hospital)
  {
    id: 'venue-health-centre',
    name: 'Health Centre',
    code: 'HC-01',
    category: 'services',
    building: 'Baraton University Health Services & Hospital',
    floor: 'Ground Floor',
    capacity: 50,
    hasProjector: false,
    hasPowerSockets: true,
    hasWifi: true,
    isAccessible: true,
    indoorHint: '24/7 outpatient clinic, pharmacy, triage desk, inpatient observation ward, and clinical simulation rooms.',
    indoorHints: '24/7 outpatient clinic, pharmacy, triage desk, inpatient observation ward, and clinical simulation rooms.',
    openingHours: '24 Hours Emergency & Outpatient Services',
    // TODO: verify coordinates
    lat: 0.25916,
    // TODO: verify coordinates
    lng: 35.08328,
    latitude: 0.25916,
    longitude: 35.08328,
    photos: {
      exterior: IMAGES.baratonAuditorium.url,
      exteriorAlt: 'Official UEAB Baraton university event',
      entranceDoor: IMAGES.venueDoorStandard.url,
      entranceDoorAlt: 'Emergency clinic glass entrance with international red cross sign and triage desk',
      interior: IMAGES.baratonAuditorium.url,
    },
    todayClasses: [
      { unitCode: 'NURS 215', unitName: 'Human Anatomy & Physiology II Clinical', lecturer: 'Dr. Grace Kemboi', time: '02:00 PM - 05:00 PM' },
    ],
  },

  // 12. Community Centre
  {
    id: 'venue-community-centre',
    name: 'Community Centre',
    code: 'CC-01',
    category: 'services',
    building: 'University Community Outreach Hall',
    floor: 'Ground Floor',
    capacity: 220,
    hasProjector: true,
    hasPowerSockets: true,
    hasWifi: true,
    isAccessible: true,
    indoorHint: 'Multi-use hall for campus agricultural outreach, youth programs, and staff-student community gatherings.',
    indoorHints: 'Multi-use hall for campus agricultural outreach, youth programs, and staff-student community gatherings.',
    openingHours: '08:00 AM – 08:00 PM',
    // TODO: verify coordinates
    lat: 0.26114,
    // TODO: verify coordinates
    lng: 35.08545,
    latitude: 0.26114,
    longitude: 35.08545,
    photos: {
      exterior: IMAGES.baratonGraduation.url,
      exteriorAlt: 'Official UEAB Baraton community gathering',
      entranceDoor: IMAGES.venueDoorStandard.url,
      entranceDoorAlt: 'Double wide entrance doors for community functions and exhibitions',
      interior: IMAGES.baratonGraduation.url,
    },
    todayClasses: [],
  },

  // 13. Basketball Court
  {
    id: 'venue-basketball',
    name: 'Basketball Court',
    code: 'BKC-01',
    category: 'sports',
    building: 'Outdoor Sports Courts Facility',
    floor: 'Outdoor Ground Level',
    capacity: 250,
    hasProjector: false,
    hasPowerSockets: false,
    hasWifi: true,
    isAccessible: true,
    indoorHint: 'Regulation paved basketball courts with floodlights for evening games and spectator bleachers.',
    indoorHints: 'Regulation paved basketball courts with floodlights for evening games and spectator bleachers.',
    openingHours: '06:00 AM – 07:00 PM (Daily)',
    // TODO: verify coordinates
    lat: 0.26383,
    // TODO: verify coordinates
    lng: 35.08365,
    latitude: 0.26383,
    longitude: 35.08365,
    photos: {
      exterior: IMAGES.baratonRoadRace.url,
      exteriorAlt: 'Official Baraton Road Race and Fun Run campus event',
      entranceDoor: IMAGES.venueDoorStandard.url,
      entranceDoorAlt: 'Spectator gate access into the enclosed basketball court facility',
      interior: IMAGES.baratonRoadRace.url,
    },
    todayClasses: [],
  },

  // 14. Soccer Field
  {
    id: 'venue-soccer-field',
    name: 'Soccer Field',
    code: 'SOC-01',
    category: 'sports',
    building: 'Athletic Track & Main Sports Field',
    floor: 'Outdoor Ground Level',
    capacity: 1200,
    hasProjector: false,
    hasPowerSockets: false,
    hasWifi: false,
    isAccessible: true,
    indoorHint: 'Championship standard natural grass soccer pitch enclosed by a 400m running athletics track and grandstand.',
    indoorHints: 'Championship standard natural grass soccer pitch enclosed by a 400m running athletics track and grandstand.',
    openingHours: '06:00 AM – 07:00 PM',
    // TODO: verify coordinates
    lat: 0.26402,
    // TODO: verify coordinates
    lng: 35.08650,
    latitude: 0.26402,
    longitude: 35.08650,
    photos: {
      exterior: IMAGES.baratonRoadRace.url,
      exteriorAlt: 'Official Baraton Road Race and Fun Run campus event',
      entranceDoor: IMAGES.venueDoorStandard.url,
      entranceDoorAlt: 'Athletic grandstand gate entrance and team locker room passage',
      interior: IMAGES.baratonRoadRace.url,
    },
    todayClasses: [],
  },
];
