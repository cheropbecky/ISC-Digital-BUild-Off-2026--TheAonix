/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * UEAB Off-Campus Student Housing & Rentals Mock Data
 * 14 realistic listings around Baraton, Chemamul, Kaimosi Road, Koitalel, Cheterit.
 * No on-campus hostels.
 */

import { IMAGES } from './images';

export interface HouseListing {
  id: string;
  title: string;
  area: string; // Baraton Centre, Chemamul, Kaimosi Road, Koitalel, Cheterit
  type: 'bedsitter' | 'single' | 'one_bedroom' | 'shared';
  priceMonthlyKes: number;
  depositKes: number;
  distanceKm: number;
  walkingMinutes: number;
  matatuMinutes?: number;
  isVerified: boolean;
  isFurnished: boolean;
  amenities: {
    water: boolean;
    electricity: boolean;
    securityGuard: boolean;
    cctv: boolean;
    wifi: boolean;
    parking: boolean;
    balcony: boolean;
    tiledFloor: boolean;
  };
  photos: string[];
  description: string;
  landlord: {
    name: string;
    phone: string;
    rating: number;
    responseTime: string;
  };
  latitude: number;
  longitude: number;
}

export interface RoommatePost {
  id: string;
  studentName: string;
  course: string;
  year: number;
  lookingFor: string;
  budgetKes: number;
  area: string;
  moveInDate: string;
  description: string;
  lifestyle: string[];
  contactEmail: string;
}

export const HOUSES: HouseListing[] = [
  {
    id: 'house-1',
    title: 'Highland Executive Studios & Bedsitters',
    area: 'Baraton Centre',
    type: 'bedsitter',
    priceMonthlyKes: 5500,
    depositKes: 5500,
    distanceKm: 0.6,
    walkingMinutes: 8,
    isVerified: true,
    isFurnished: true,
    amenities: {
      water: true,
      electricity: true,
      securityGuard: true,
      cctv: true,
      wifi: true,
      parking: true,
      balcony: true,
      tiledFloor: true,
    },
    photos: [
      IMAGES.housingApartmentsModern.url,
      IMAGES.housingRoomBedsitter.url,
      IMAGES.housingRoomShared.url,
    ],
    description: 'Spacious self-contained bedsitter with ceramic tiles, instant shower, private balcony, and fast student Wi-Fi. 24/7 borehole water and perimeter electric fence. Just 8 minutes walk from the university main gate.',
    landlord: {
      name: 'Mzee Kipkorir Rono',
      phone: '+254 722 418 902',
      rating: 4.9,
      responseTime: 'Within 15 minutes',
    },
    latitude: 0.2545,
    longitude: 35.0835,
  },
  {
    id: 'house-2',
    title: 'Green Valley One-Bedroom Apartments',
    area: 'Chemamul',
    type: 'one_bedroom',
    priceMonthlyKes: 9500,
    depositKes: 9500,
    distanceKm: 1.4,
    walkingMinutes: 18,
    matatuMinutes: 5,
    isVerified: true,
    isFurnished: false,
    amenities: {
      water: true,
      electricity: true,
      securityGuard: true,
      cctv: true,
      wifi: true,
      parking: true,
      balcony: true,
      tiledFloor: true,
    },
    photos: [
      IMAGES.housingApartmentsModern.url,
      IMAGES.housingRoomBedsitter.url,
      IMAGES.libraryExterior.url,
    ],
    description: 'Modern 1-bedroom suite featuring a separate living room, fitted kitchen cabinets, modern bathroom, and dedicated laundry drying area. Quiet neighborhood ideal for serious study.',
    landlord: {
      name: 'Mama Brenda Chebet',
      phone: '+254 713 892 401',
      rating: 4.8,
      responseTime: 'Within 30 minutes',
    },
    latitude: 0.2570,
    longitude: 35.0870,
  },
  {
    id: 'house-3',
    title: 'Acacia View Single Rooms (Budget Friendly)',
    area: 'Baraton Centre',
    type: 'single',
    priceMonthlyKes: 3200,
    depositKes: 3200,
    distanceKm: 0.4,
    walkingMinutes: 5,
    isVerified: true,
    isFurnished: false,
    amenities: {
      water: true,
      electricity: true,
      securityGuard: true,
      cctv: false,
      wifi: false,
      parking: false,
      balcony: false,
      tiledFloor: true,
    },
    photos: [
      IMAGES.housingRoomBedsitter.url,
      IMAGES.housingApartmentsModern.url,
      IMAGES.housingRoomShared.url,
    ],
    description: 'Neat single room with shared clean washrooms (2 rooms per washroom) and constant county tap water. Very safe compound populated exclusively by Baraton undergraduate students.',
    landlord: {
      name: 'David Tanui',
      phone: '+254 721 550 312',
      rating: 4.7,
      responseTime: 'Within 1 hour',
    },
    latitude: 0.2512,
    longitude: 35.0845,
  },
  {
    id: 'house-4',
    title: 'Koitalel Scholar Residences (Furnished Shared)',
    area: 'Koitalel',
    type: 'shared',
    priceMonthlyKes: 4000,
    depositKes: 4000,
    distanceKm: 1.1,
    walkingMinutes: 14,
    isVerified: true,
    isFurnished: true,
    amenities: {
      water: true,
      electricity: true,
      securityGuard: true,
      cctv: true,
      wifi: true,
      parking: true,
      balcony: true,
      tiledFloor: true,
    },
    photos: [
      IMAGES.housingRoomShared.url,
      IMAGES.housingApartmentsModern.url,
      IMAGES.housingRoomBedsitter.url,
    ],
    description: 'Two students per room, fully furnished with wooden bunk beds, ergonomic study chairs, study lamps, and high-speed internet included in the rent. Water bills covered.',
    landlord: {
      name: 'Pastor Wilson Koech',
      phone: '+254 705 332 119',
      rating: 4.9,
      responseTime: 'Within 10 minutes',
    },
    latitude: 0.2460,
    longitude: 35.0860,
  },
  {
    id: 'house-5',
    title: 'Sunrise Heights Modern Bedsitter',
    area: 'Kaimosi Road',
    type: 'bedsitter',
    priceMonthlyKes: 6000,
    depositKes: 6000,
    distanceKm: 0.9,
    walkingMinutes: 12,
    isVerified: true,
    isFurnished: false,
    amenities: {
      water: true,
      electricity: true,
      securityGuard: true,
      cctv: true,
      wifi: true,
      parking: true,
      balcony: true,
      tiledFloor: true,
    },
    photos: [
      IMAGES.housingApartmentsModern.url,
      IMAGES.housingRoomBedsitter.url,
      IMAGES.housingRoomShared.url,
    ],
    description: 'Newly constructed studio apartments on Kaimosi road junction. Large glass windows, ample natural lighting, prepaid tokens, security guard at the gate.',
    landlord: {
      name: 'Grace Mutai',
      phone: '+254 728 119 402',
      rating: 4.8,
      responseTime: 'Within 20 minutes',
    },
    latitude: 0.2440,
    longitude: 35.0760,
  },
  {
    id: 'house-6',
    title: 'Cheterit Palms Student Villas (One-Bedroom)',
    area: 'Cheterit',
    type: 'one_bedroom',
    priceMonthlyKes: 8500,
    depositKes: 8500,
    distanceKm: 2.1,
    walkingMinutes: 25,
    matatuMinutes: 6,
    isVerified: true,
    isFurnished: false,
    amenities: {
      water: true,
      electricity: true,
      securityGuard: true,
      cctv: true,
      wifi: true,
      parking: true,
      balcony: true,
      tiledFloor: true,
    },
    photos: [
      IMAGES.housingApartmentsModern.url,
      IMAGES.housingRoomBedsitter.url,
      IMAGES.scienceComplexExterior.url,
    ],
    description: 'Spacious private compound with lush flower gardens, perimeter stone wall, and backup water tank. Ideal for nursing and postgraduate students who desire peaceful surroundings.',
    landlord: {
      name: 'Dr. Julius Bett',
      phone: '+254 710 445 889',
      rating: 4.9,
      responseTime: 'Within 1 hour',
    },
    latitude: 0.2620,
    longitude: 35.0890,
  },
  {
    id: 'house-7',
    title: 'Elgon View Bedsitters',
    area: 'Chemamul',
    type: 'bedsitter',
    priceMonthlyKes: 4800,
    depositKes: 4800,
    distanceKm: 1.2,
    walkingMinutes: 15,
    isVerified: false,
    isFurnished: false,
    amenities: {
      water: true,
      electricity: true,
      securityGuard: true,
      cctv: false,
      wifi: true,
      parking: false,
      balcony: false,
      tiledFloor: true,
    },
    photos: [
      IMAGES.housingRoomBedsitter.url,
      IMAGES.housingApartmentsModern.url,
      IMAGES.housingRoomShared.url,
    ],
    description: 'Clean tiled bedsitters near Chemamul shopping centre with reliable solar lighting backup during blackout periods. Very close to local fresh vegetable markets.',
    landlord: {
      name: 'Kennedy Kibet',
      phone: '+254 724 670 128',
      rating: 4.5,
      responseTime: 'Within 2 hours',
    },
    latitude: 0.2585,
    longitude: 35.0840,
  },
  {
    id: 'house-8',
    title: 'Baraton Central Quad Rooms (Shared)',
    area: 'Baraton Centre',
    type: 'shared',
    priceMonthlyKes: 2800,
    depositKes: 2800,
    distanceKm: 0.3,
    walkingMinutes: 4,
    isVerified: true,
    isFurnished: true,
    amenities: {
      water: true,
      electricity: true,
      securityGuard: true,
      cctv: false,
      wifi: false,
      parking: false,
      balcony: false,
      tiledFloor: false,
    },
    photos: [
      IMAGES.housingRoomShared.url,
      IMAGES.housingRoomBedsitter.url,
      IMAGES.housingApartmentsModern.url,
    ],
    description: 'Super close to campus gate 1. Shared double rooms with metal beds and lockers. Lowest budget option for undergraduates wanting zero commute time.',
    landlord: {
      name: 'Sarah Jerono',
      phone: '+254 712 901 843',
      rating: 4.6,
      responseTime: 'Within 45 minutes',
    },
    latitude: 0.2500,
    longitude: 35.0825,
  },
  {
    id: 'house-9',
    title: 'The Haven Executive One-Bedroom',
    area: 'Baraton Centre',
    type: 'one_bedroom',
    priceMonthlyKes: 12000,
    depositKes: 12000,
    distanceKm: 0.7,
    walkingMinutes: 9,
    isVerified: true,
    isFurnished: true,
    amenities: {
      water: true,
      electricity: true,
      securityGuard: true,
      cctv: true,
      wifi: true,
      parking: true,
      balcony: true,
      tiledFloor: true,
    },
    photos: [
      IMAGES.housingApartmentsModern.url,
      IMAGES.housingRoomBedsitter.url,
      IMAGES.housingRoomShared.url,
    ],
    description: 'Luxury executive suite with full sofa set, study desk, 43-inch smart screen, modern kitchen with gas cooker, and solar water heater. Gated with 24/7 uniformed guards.',
    landlord: {
      name: 'Eng. Patrick Kiptoo',
      phone: '+254 720 889 123',
      rating: 5.0,
      responseTime: 'Within 5 minutes',
    },
    latitude: 0.2530,
    longitude: 35.0855,
  },
  {
    id: 'house-10',
    title: 'Peaceful Haven Single Rooms',
    area: 'Kaimosi Road',
    type: 'single',
    priceMonthlyKes: 3500,
    depositKes: 3500,
    distanceKm: 0.8,
    walkingMinutes: 10,
    isVerified: true,
    isFurnished: false,
    amenities: {
      water: true,
      electricity: true,
      securityGuard: true,
      cctv: false,
      wifi: true,
      parking: false,
      balcony: false,
      tiledFloor: true,
    },
    photos: [
      IMAGES.housingRoomBedsitter.url,
      IMAGES.housingApartmentsModern.url,
      IMAGES.housingRoomShared.url,
    ],
    description: 'Quiet compound with 8 single rooms, shared tiled washrooms, free high-speed Safaricom Home Fibre Wi-Fi, and water tank.',
    landlord: {
      name: 'Mary Kemboi',
      phone: '+254 711 778 902',
      rating: 4.8,
      responseTime: 'Within 20 minutes',
    },
    latitude: 0.2455,
    longitude: 35.0780,
  },
  {
    id: 'house-11',
    title: 'Valley View Studio Bedsitters',
    area: 'Koitalel',
    type: 'bedsitter',
    priceMonthlyKes: 5200,
    depositKes: 5200,
    distanceKm: 1.0,
    walkingMinutes: 13,
    isVerified: true,
    isFurnished: false,
    amenities: {
      water: true,
      electricity: true,
      securityGuard: true,
      cctv: true,
      wifi: true,
      parking: true,
      balcony: true,
      tiledFloor: true,
    },
    photos: [
      IMAGES.housingApartmentsModern.url,
      IMAGES.housingRoomBedsitter.url,
      IMAGES.housingRoomShared.url,
    ],
    description: 'Overlooking the tea estate hills. Private balcony, modern kitchen sink with tiled backsplash, clean prepaid electricity, and perimeter fence.',
    landlord: {
      name: 'Joshua Sang',
      phone: '+254 725 334 118',
      rating: 4.7,
      responseTime: 'Within 30 minutes',
    },
    latitude: 0.2475,
    longitude: 35.0850,
  },
  {
    id: 'house-12',
    title: 'Baraton Hillside Single Room Suites',
    area: 'Baraton Centre',
    type: 'single',
    priceMonthlyKes: 3800,
    depositKes: 3800,
    distanceKm: 0.5,
    walkingMinutes: 6,
    isVerified: true,
    isFurnished: false,
    amenities: {
      water: true,
      electricity: true,
      securityGuard: true,
      cctv: true,
      wifi: true,
      parking: false,
      balcony: false,
      tiledFloor: true,
    },
    photos: [
      IMAGES.housingRoomBedsitter.url,
      IMAGES.housingApartmentsModern.url,
      IMAGES.housingRoomShared.url,
    ],
    description: 'Single rooms with built-in wardrobe, study table shelf, and clean water. Walk to library in 6 minutes.',
    landlord: {
      name: 'Eunice Chepkemoi',
      phone: '+254 703 112 459',
      rating: 4.9,
      responseTime: 'Within 15 minutes',
    },
    latitude: 0.2520,
    longitude: 35.0830,
  },
  {
    id: 'house-13',
    title: 'University Gate 2 Modern Bedsitters',
    area: 'Baraton Centre',
    type: 'bedsitter',
    priceMonthlyKes: 5800,
    depositKes: 5800,
    distanceKm: 0.35,
    walkingMinutes: 4,
    isVerified: true,
    isFurnished: false,
    amenities: {
      water: true,
      electricity: true,
      securityGuard: true,
      cctv: true,
      wifi: true,
      parking: true,
      balcony: true,
      tiledFloor: true,
    },
    photos: [
      IMAGES.housingApartmentsModern.url,
      IMAGES.housingRoomBedsitter.url,
      IMAGES.housingRoomShared.url,
    ],
    description: 'Premium location directly opposite Baraton Gate 2 entrance. Concrete perimeter wall with night guard, high water pressure, and individual token meters.',
    landlord: {
      name: 'Kipchumba Lagat',
      phone: '+254 722 990 014',
      rating: 4.9,
      responseTime: 'Within 10 minutes',
    },
    latitude: 0.2535,
    longitude: 35.0810,
  },
];

export const ROOMMATES: RoommatePost[] = [
  {
    id: 'roommate-1',
    studentName: 'Dennis Kiprotich',
    course: 'BSc Software Engineering',
    year: 3,
    lookingFor: '1 Male Roommate',
    budgetKes: 3000,
    area: 'Baraton Centre',
    moveInDate: 'Next Trimester / Immediately',
    description: 'Looking to share a spacious 2-bed modern bedsitter at Highland Studios. I code late at night (with headphones) and keep the space clean. Non-smoker preferred.',
    lifestyle: ['Non-smoker', 'Quiet study hours', 'Software developer', 'Clean'],
    contactEmail: 'dennis.kiprotich@student.ueab.ac.ke',
  },
  {
    id: 'roommate-2',
    studentName: 'Mercy Chebet',
    course: 'Bachelor of Science in Nursing',
    year: 2,
    lookingFor: '1 Female Roommate',
    budgetKes: 4000,
    area: 'Chemamul',
    moveInDate: 'End of Month',
    description: 'Looking to split rent for a secure 1-bedroom at Green Valley Apartments. Friendly, studious, and attends campus Sabbath choir.',
    lifestyle: ['Sabbath choir', 'Early riser', 'Quiet', 'Organized'],
    contactEmail: 'mercy.chebet@student.ueab.ac.ke',
  },
  {
    id: 'roommate-3',
    studentName: 'Kevin Langat',
    course: 'BBA Finance',
    year: 3,
    lookingFor: '1 Male Roommate',
    budgetKes: 2800,
    area: 'Kaimosi Road',
    moveInDate: 'Immediate',
    description: 'Economics student looking to share a clean room. Loves football and chess. Respectful of personal boundaries.',
    lifestyle: ['Sports enthusiast', 'Respectful', 'Organized'],
    contactEmail: 'kevin.langat@student.ueab.ac.ke',
  },
];

export const ROOMMATE_POSTS = ROOMMATES;
