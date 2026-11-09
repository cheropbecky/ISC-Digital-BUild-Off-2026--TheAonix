/** UEAB Baraton campus locations supplied as the Kampas GIS source of truth. */

export const UEAB_CAMPUS_CENTER: [number, number] = [0.2572, 35.084];

export type VenueCategory = 'academic' | 'administration' | 'worship' | 'food_dining' | 'student_services' | 'health_services' | 'facilities' | 'sports' | 'accommodation' | 'landmarks';
export const VENUE_CATEGORY_LABELS: Record<VenueCategory, string> = {
  academic: 'Academic Buildings', administration: 'Administration', worship: 'Worship', food_dining: 'Food & Dining',
  student_services: 'Student Services', health_services: 'Health Services', facilities: 'Campus Facilities',
  sports: 'Sports & Recreation', accommodation: 'Accommodation', landmarks: 'Other Landmarks',
};

export interface VenuePhotos { exterior: string; exteriorAlt: string; entranceDoor: string; entranceDoorAlt: string; interior?: string; }
export interface VenueData {
  id: string; name: string; code: string; category: VenueCategory; building: string; floor: string;
  description?: string; googleMapsUrl?: string; needsVerification: boolean; coordinateStatus: 'verified' | 'pending';
  capacity?: number; hasProjector?: boolean; hasPowerSockets?: boolean; hasWifi?: boolean; isAccessible?: boolean;
  indoorHint: string; indoorHints: string; openingHours: string; lat?: number; lng?: number; latitude?: number; longitude?: number;
  photos: VenuePhotos; todayClasses?: Array<{ unitCode: string; unitName: string; lecturer: string; time: string }>;
}

const noPhoto = (name: string): VenuePhotos => ({ exterior: '', exteriorAlt: `No photograph supplied for ${name}`, entranceDoor: '', entranceDoorAlt: `No entrance photograph supplied for ${name}` });
const location = (id: string, name: string, category: VenueCategory, lat: number | null, lng: number | null, googleMapsUrl?: string): VenueData => ({
  id, name, code: id.toUpperCase().replace(/[^A-Z0-9]+/g, '-'), category, building: name, floor: 'Not supplied', lat: lat ?? undefined, lng: lng ?? undefined,
  latitude: lat ?? undefined, longitude: lng ?? undefined, googleMapsUrl, needsVerification: lat === null || lng === null,
  coordinateStatus: lat === null || lng === null ? 'pending' : 'verified', indoorHint: 'Additional location details have not been supplied yet.',
  indoorHints: 'Additional location details have not been supplied yet.', openingHours: 'Not supplied', photos: noPhoto(name),
});

export const VENUES: VenueData[] = [
  location('ueab-gate', 'UEAB Main Gate', 'facilities', 0.254552, 35.081636),
  location('church-fountain', 'UEAB Church Fountain', 'worship', 0.25486, 35.0816846, 'https://maps.app.goo.gl/7kcpwENfhCqFmnmS8'),
  location('university-church', 'Baraton University Church', 'worship', 0.255071, 35.0814546, 'https://maps.app.goo.gl/DNcumB6uUCHZWz7f6'),
  location('ueab-admin', 'UEAB Administration', 'administration', 0.2553484, 35.0826976, 'https://maps.app.goo.gl/XwwNqUfNnu2u1ruv8'),
  location('tupande-duka', 'Tupande Duka Baraton', 'food_dining', 0.2551325, 35.0829279, 'https://maps.app.goo.gl/mgeizfLhYLSQcfHQ8'),
  location('ueab-fountain', 'UEAB Fountain', 'landmarks', 0.2561943, 35.0829663, 'https://maps.app.goo.gl/UfqWHXgfRbJx4vUV9'),
  location('baptism-pool', 'UEAB Baptism Pool', 'worship', 0.2561193, 35.0832054, 'https://maps.app.goo.gl/FXdHm7VNB2R3XaeZ8'),
  location('ueab-parking', 'UEAB Parking', 'facilities', 0.2560571, 35.0835898, 'https://maps.app.goo.gl/PSfGg7LHpQzKJE366'),
  location('yearbook', 'Yearbook', 'academic', 0.2562717, 35.0836664, 'https://maps.app.goo.gl/hvUAF4R5XEgDgpGA9'),
  location('cafeteria', 'UEAB Cafeteria', 'food_dining', 0.2564392, 35.0837783, 'https://maps.app.goo.gl/VjWE9kU4vZ4HndUw7'),
  location('student-center', 'UEAB Student Center', 'student_services', null, null, 'https://maps.app.goo.gl/VjWE9kU4vZ4HndUw7'),
  location('jeremic-medical', 'Jeremic Medical Centre', 'health_services', 0.2560103, 35.0810901, 'https://maps.app.goo.gl/xooXAwvkDynXW5s56'),
  location('ueab-jerusalem', 'UEAB Jerusalem', 'landmarks', 0.257056, 35.0813108, 'https://maps.app.goo.gl/mwRkUhYhgQwAA45N7'),
  location('ueab-park', 'UEAB Park', 'landmarks', 0.2561917, 35.0818388, 'https://maps.app.goo.gl/bKnP8GeMKzcPC8ii6'),
  location('international-school', 'Baraton International School', 'academic', 0.2576698, 35.0816754, 'https://maps.app.goo.gl/6tygwdVHMoBrUCd79'),
  location('technology-building', 'UEAB Technology Building', 'academic', 0.2572578, 35.0822519, 'https://maps.app.goo.gl/PCk1paC3gndsVmF18'),
  location('communication-tower', 'UEAB Communication Tower', 'facilities', 0.2575017, 35.0823056, 'https://maps.app.goo.gl/bhFqtm1TZyf4M8S1A'),
  location('family-consumer-science', 'Family and Consumer Science Department', 'academic', 0.256494, 35.0829682, 'https://maps.app.goo.gl/bCQtdyiJBhRHUJwL8'),
  location('ueab-sacco', 'UEAB SACCO', 'student_services', 0.2564346, 35.0826913, 'https://maps.app.goo.gl/ZM2BhAi2ZcBmHgpM7'),
  location('ueab-library', 'UEAB Library', 'academic', 0.2571103, 35.0836962, 'https://maps.app.goo.gl/deAJ27eHXjD456A68'),
  location('amphitheatre', 'UEAB Amphitheatre', 'facilities', 0.2570949, 35.0839289, 'https://maps.app.goo.gl/disErGP5uVrchVeL6'),
  location('ueab-auditorium', 'UEAB Auditorium', 'academic', 0.2565337, 35.084458, 'https://maps.app.goo.gl/kLq8PX72HogWf1Gd8'),
  location('basketball-court', 'UEAB Basketball Court', 'sports', 0.2568347, 35.0847937, 'https://maps.app.goo.gl/7ReD7b3uPoyQq6Me8'),
  location('ladies-dorm', 'UEAB Ladies Dormitory', 'accommodation', 0.2564804, 35.0855567, 'https://maps.app.goo.gl/w4Lqc1X1L9Ud3ArK7'),
  location('cool-place', 'UEAB Cool Place (Gazebo)', 'landmarks', 0.2557468, 35.0841683, 'https://maps.app.goo.gl/KkBpEHwefPqfV3WU8'),
  location('graduation-square', 'UEAB Graduation Square', 'facilities', 0.2556016, 35.0850947, 'https://maps.app.goo.gl/fy66gybdFfxVPLVS8'),
  location('community-centre', 'UEAB Community Centre', 'student_services', 0.2557746, 35.0869364, 'https://maps.app.goo.gl/wzBTTH4xDgft2ikE6'),
  location('water-treatment', 'UEAB Water Treatment Plant', 'facilities', 0.2581825, 35.0862127, 'https://maps.app.goo.gl/x6Nr2UWvnoDCyVha6'),
  location('old-mens-dorm', "UEAB Old Men's Dormitory", 'accommodation', 0.2583399, 35.0840304, 'https://maps.app.goo.gl/XnvzkamhtCntJF5j6'),
  location('mens-dorm', "UEAB Men's Dormitory", 'accommodation', 0.258491, 35.0837188, 'https://maps.app.goo.gl/M9Eu6wwEZqsq3TpJ6'),
  location('senior-flats', 'UEAB Senior Flats', 'accommodation', 0.2593951, 35.0829448, 'https://maps.app.goo.gl/2eJbXPU45XR8RGnw5'),
  location('splendid-scrolls', 'Splendid Scrolls Media', 'landmarks', 0.26156, 35.084012, 'https://maps.app.goo.gl/LensopyjoCag2Xzv8'),
  location('ueab-farm', 'UEAB Farm', 'facilities', 0.261486, 35.0869866, 'https://maps.app.goo.gl/2JCnMjY5oi4UVAqh6'),
];
