/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Central Image Asset Registry for Kampas
 * All images are referenced from this single data file with descriptive alt text
 * and graceful fallback containers so real UEAB photos can be swapped in seamlessly.
 */

import { HERO_IMAGE_URLS, UEAB_IMAGE_URLS } from './imageUrls';
import bedsitterRoom from '../assets/images/ueab_bedsitter_room_1794079508675.jpg';

const campusHero = HERO_IMAGE_URLS.campusHero;
const libraryHall = HERO_IMAGE_URLS.library;
const scienceComplex = HERO_IMAGE_URLS.library;
const studentLife = HERO_IMAGE_URLS.studentLife;
const modernHousingImage = HERO_IMAGE_URLS.housing;
const UEAB_SIGNAGE_IMAGE = UEAB_IMAGE_URLS.signage;
const UEAB_GRADUATION_IMAGE = UEAB_IMAGE_URLS.graduation;
const UEAB_RESEARCH_IMAGE = UEAB_IMAGE_URLS.research;
const UEAB_ROAD_RACE_IMAGE = UEAB_IMAGE_URLS.roadRace;
const UEAB_AUDITORIUM_IMAGE = UEAB_IMAGE_URLS.auditorium;

export interface RegisteredImage {
  id: string;
  url: string;
  alt: string;
  category: 'campus' | 'venue_exterior' | 'venue_door' | 'venue_interior' | 'housing' | 'event' | 'club' | 'avatar' | 'lost_item';
  fallbackText?: string;
}

export const IMAGES = {
  // Campus Hero & Banners
  campusHero: {
    id: 'campus-hero',
    url: campusHero,
    alt: 'University of Eastern Africa, Baraton administration complex and clock tower amidst lush green lawns in Nandi Hills',
    category: 'campus',
  },
  libraryExterior: {
    id: 'library-ext',
    url: libraryHall,
    alt: 'UEAB University Library and Learning Commons with sunlit paved student walkway and landscaped gardens',
    category: 'campus',
  },
  scienceComplexExterior: {
    id: 'science-ext',
    url: scienceComplex,
    alt: 'Faculty of Science and Technology modern academic building with brick facade and glass laboratories',
    category: 'campus',
  },
  studentLifeQuad: {
    id: 'student-quad',
    url: studentLife,
    alt: 'Vibrant student centre courtyard and collegiate plaza under flowering pergola at Baraton',
    category: 'campus',
  },
  baratonResearchConference: {
    id: 'baraton-research-conference',
    url: UEAB_RESEARCH_IMAGE,
    alt: 'University of Eastern Africa, Baraton research conference gathering outside a campus building',
    category: 'campus',
    fallbackText: 'UEAB Baraton research conference',
  },
  baratonNewSignage: {
    id: 'baraton-new-signage',
    url: UEAB_SIGNAGE_IMAGE,
    alt: 'New University of Eastern Africa, Baraton campus signage unveiled in front of the administration building',
    category: 'campus',
    fallbackText: 'New UEAB Baraton campus signage',
  },
  baratonGraduation: {
    id: 'baraton-graduation',
    url: UEAB_GRADUATION_IMAGE,
    alt: 'University of Eastern Africa, Baraton graduation day gathering on campus',
    category: 'event',
    fallbackText: 'UEAB Baraton graduation day',
  },
  baratonRoadRace: {
    id: 'baraton-road-race',
    url: UEAB_ROAD_RACE_IMAGE,
    alt: 'Baraton Road Race and Fun Run taking place near the UEAB Baraton campus',
    category: 'campus',
    fallbackText: 'Baraton Road Race and Fun Run',
  },
  baratonAuditorium: {
    id: 'baraton-auditorium',
    url: UEAB_AUDITORIUM_IMAGE,
    alt: 'University of Eastern Africa, Baraton auditorium event with attendees',
    category: 'campus',
    fallbackText: 'UEAB Baraton auditorium',
  },
  officialCampusPhoto: {
    id: 'official-campus-photo',
    url: UEAB_SIGNAGE_IMAGE,
    alt: 'University of Eastern Africa, Baraton campus facility photographed during an official university event',
    category: 'campus',
    fallbackText: 'Official UEAB Baraton campus photograph',
  },

  // Venue Entrance Doors & Interior
  venueDoorStandard: {
    id: 'venue-door-std',
    url: UEAB_SIGNAGE_IMAGE,
    alt: 'Official University of Eastern Africa, Baraton campus signage photo',
    category: 'venue_door',
  },
  venueInteriorLab: {
    id: 'venue-int-lab',
    url: libraryHall,
    alt: 'Computing laboratory workstations with high-speed internet and presentation displays',
    category: 'venue_interior',
  },

  // Housing Rentals & Student Rooms
  housingApartmentsModern: {
    id: 'house-modern-ext',
    url: modernHousingImage,
    alt: 'Modern two-story student rental apartments with private balconies, gated security wall, and paved parking in Baraton Centre',
    category: 'housing',
  },
  housingRoomBedsitter: {
    id: 'house-room-interior',
    url: bedsitterRoom,
    alt: 'Cozy student bedsitter room interior with wooden study desk, laptop, single bed, bookshelf, and bright window',
    category: 'housing',
  },
  housingRoomShared: {
    id: 'house-room-shared',
    url: bedsitterRoom,
    alt: 'Spacious shared student bedroom with twin beds and dedicated study stations',
    category: 'housing',
  },

  // Module Icons / Badges
  defaultAvatar: {
    id: 'avatar-default',
    url: '',
    alt: 'Student Profile Avatar',
    category: 'avatar',
  },
} as const;
