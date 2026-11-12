/**
 * Bundled image assets used by the Kampas PWA.
 * Keeping these imports local prevents broken hotlinks in offline installs,
 * deployed PWAs, and environments that block third-party image hosts.
 */
import campusHero from '../assets/images/ueab_campus_hero_1794150142310.jpg';
import housing from '../assets/images/ueab_house_modern_1794079506521.jpg';
import library from '../assets/images/ueab_library_hall_1793989894699.jpg';
import studentLife from '../assets/images/ueab_student_life_1793989896360.jpg';
import signage from '../assets/images/ueab_baraton_new_signage.jpg';
import graduation from '../assets/images/ueab_baraton_graduation.jpg';
import research from '../assets/images/ueab_baraton_research_conference.jpg';
import roadRace from '../assets/images/ueab_baraton_road_race.jpg';
import auditorium from '../assets/images/ueab_baraton_auditorium.jpg';

export const HERO_IMAGE_URLS = {
  campusHero,
  housing,
  library,
  studentLife,
} as const;

export const UEAB_IMAGE_URLS = {
  signage,
  graduation,
  research,
  roadRace,
  auditorium,
} as const;
