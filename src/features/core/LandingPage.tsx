/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Official Landing Page for University of Eastern Africa, Baraton (UEAB) - Kampas Platform
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Home as HomeIcon,
  FileText,
  Users,
  Briefcase,
  SearchCheck,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Layers,
  Phone,
  Mail,
  Moon,
  Sun,
  Menu,
  X,
  Search,
  MapPin,
  Sparkles,
  Building,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';
import { useKampasStore } from '../../lib/store';
import { searchService, SearchResultItem } from '../../services/searchService';
import campusHeroImage from '../../assets/images/ueab_campus_hero_1794150142310.jpg';
import housingImage from '../../assets/images/ueab_student_housing_1794150143766.jpg';
import libraryImage from '../../assets/images/ueab_library_students_1794150143182.jpg';
import studentLifeImage from '../../assets/images/ueab_student_life_1794150144449.jpg';
import scienceComplexImage from '../../assets/images/ueab_science_complex_1793989896519.jpg';
import venueEntranceImage from '../../assets/images/ueab_venue_entrance_1794079506481.jpg';

interface HeroSlide {
  id: number;
  image: string;
  tagline: string;
  headline: string;
  subtext: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: '/src/assets/images/ueab_campus_hero_1794150142310.jpg',
    tagline: 'OFFICIAL STUDENT PORTAL & LOGISTICS PLATFORM',
    headline: 'The campus, in one place.',
    subtext:
      'The comprehensive digital operating system for the University of Eastern Africa, Baraton. Live timetables, verified off-campus rentals, peer study notes, and alumni career referrals.',
  },
  {
    id: 2,
    image: '/src/assets/images/ueab_student_housing_1794150143766.jpg',
    tagline: 'HOUSE FIND • OFF-CAMPUS STUDENT HOUSING',
    headline: 'Find verified rentals with zero broker scams.',
    subtext:
      'Discover and compare audited rentals in Baraton Centre, Chemamul, and Kaimosi Road with 24/7 borehole water, Wi-Fi, and direct landlord contact.',
  },
  {
    id: 3,
    image: '/src/assets/images/ueab_library_students_1794150143182.jpg',
    tagline: 'ACADEMIC SHARE HUB & STUDY GROUPS',
    headline: 'Top lecture notes & past papers at your fingertips.',
    subtext:
      'Access peer-reviewed study guides, past continuous assessment exams, and collaborate in booked campus study circles.',
  },
  {
    id: 4,
    image: '/src/assets/images/ueab_student_life_1794150144449.jpg',
    tagline: 'ALUMNI MENTORSHIP & INDUSTRY REFERRALS',
    headline: 'From Baraton classrooms to Kenya’s tech leaders.',
    subtext:
      'Connect directly with Baraton alumni leaders at Safaricom, Microsoft ADC, and Equity Bank for warm job referrals and industrial attachments.',
  },
];

const PARTNER_LOGOS = [
  {
    name: 'Google',
    svg: (
      <svg className="w-10 h-10 sm:w-12 sm:h-12 shrink-0" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
      </svg>
    ),
  },
  {
    name: 'OpenAI',
    svg: (
      <svg className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 fill-current text-slate-900 dark:text-white" viewBox="0 0 24 24">
        <path d="M22.28 9.37a5.98 5.98 0 0 0-.52-4.78 6.08 6.08 0 0 0-4.04-3.04 6.07 6.07 0 0 0-5.32 1.13A6.01 6.01 0 0 0 8.08.83a6.08 6.08 0 0 0-4.38 2.53 6.06 6.06 0 0 0-.96 5.25 6.02 6.02 0 0 0-2.2 4.09 6.08 6.08 0 0 0 1.28 5.3 6.06 6.06 0 0 0 4.32 2.63 6.05 6.05 0 0 0 4.32 1.85 6.08 6.08 0 0 0 5.3-2.6 6.04 6.04 0 0 0 4.34-.34 6.08 6.08 0 0 0 3.32-3.8 6.06 6.06 0 0 0-.1-5.37zm-9.15 12.3c-1.34 0-2.6-.4-3.66-1.14l.19-.11 4.72-2.73a.85.85 0 0 0 .43-.74v-6.38l1.92 1.11v6.24a4.34 4.34 0 0 1-3.6 3.75zm-8.4-3.6a4.3 4.3 0 0 1-.5-3.8 4.36 4.36 0 0 1 1.95-2.58l.19.11 4.72 2.72c.26.15.58.15.84 0l5.52-3.19v2.22l-5.4 3.12a4.35 4.35 0 0 1-7.32 1.4zm-1.84-9.33a4.34 4.34 0 0 1 2.37-3.04 4.34 4.34 0 0 1 3.86.32l-.19.11-4.72 2.73a.85.85 0 0 0-.43.74v6.38l-1.92-1.11V8.74h.03zm14.65 3.02l-5.52-3.19v-2.22l5.4-3.12a4.35 4.35 0 0 1 7.32 1.4 4.3 4.3 0 0 1 .5 3.8 4.36 4.36 0 0 1-1.95 2.58l-.19-.11-4.72-2.72a.86.86 0 0 0-.84 0zm3.33-4.13v6.38l-1.92-1.11V6.26a4.34 4.34 0 0 1 3.6-3.75 4.34 4.34 0 0 1 3.66 1.14l-.19.11-4.72 2.73a.85.85 0 0 0-.43.74zm-9.39 5.09l2.76-1.6 2.76 1.6v3.19l-2.76 1.6-2.76-1.6v-3.19z"/>
      </svg>
    ),
  },
  {
    name: 'Microsoft',
    svg: (
      <svg className="w-10 h-10 sm:w-12 sm:h-12 shrink-0" viewBox="0 0 23 23">
        <path fill="#f35325" d="M1 1h10v10H1z"/>
        <path fill="#81bc06" d="M12 1h10v10H12z"/>
        <path fill="#05a6f0" d="M1 12h10v10H1z"/>
        <path fill="#ffba08" d="M12 12h10v10H12z"/>
      </svg>
    ),
  },
  {
    name: 'GitHub',
    svg: (
      <svg className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 fill-current text-slate-900 dark:text-white" viewBox="0 0 24 24">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
  },
  {
    name: 'React',
    svg: (
      <svg className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 fill-none" viewBox="-11.5 -10.23174 23 20.46348">
        <circle cx="0" cy="0" r="2.05" fill="#61dafb"/>
        <g stroke="#61dafb" strokeWidth="1">
          <ellipse rx="11" ry="4.2"/>
          <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
          <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
        </g>
      </svg>
    ),
  },
  {
    name: 'Next.js',
    svg: (
      <svg className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 fill-current text-slate-900 dark:text-white" viewBox="0 0 180 180">
        <mask height="180" id="mask-next" maskUnits="userSpaceOnUse" width="180" x="0" y="0" style={{ maskType: 'alpha' }}>
          <circle cx="90" cy="90" fill="black" r="90"/>
        </mask>
        <g mask="url(#mask-next)">
          <circle cx="90" cy="90" fill="currentColor" r="90"/>
          <path d="M149.508 157.086L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 159.99 149.508 157.086Z" fill="white"/>
          <path d="M115 54H127V126H115V54Z" fill="white"/>
        </g>
      </svg>
    ),
  },
  {
    name: 'Supabase',
    svg: (
      <svg className="w-10 h-10 sm:w-12 sm:h-12 shrink-0" viewBox="0 0 24 24">
        <path fill="#3ECF8E" d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L.416 13.916a.396.396 0 0 0 .313.638H12v8.958a.396.396 0 0 0 .716.233l10.868-13.753a.396.396 0 0 0-.222-.638z"/>
      </svg>
    ),
  },
  {
    name: 'AWS',
    svg: (
      <svg className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 fill-current text-slate-900 dark:text-white" viewBox="0 0 24 24">
        <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.064.177-.184.289l-1.344 1.04c-.08.064-.16.096-.24.096-.08 0-.16-.032-.24-.097-.4-.367-.712-.838-.936-1.407-.224-.568-.336-1.208-.336-1.92 0-.783.144-1.503.44-2.158.288-.665.712-1.216 1.272-1.656.552-.44 1.232-.767 2.032-.975.808-.208 1.696-.312 2.664-.312 1.472 0 2.696.272 3.672.816.984.544 1.472 1.344 1.472 2.4 0 .528-.096 1.08-.288 1.656-.192.576-.432 1.184-.72 1.824l-.848 1.872c-.176.384-.264.736-.264 1.056 0 .288.08.512.24.672.16.16.376.24.648.24.464 0 .936-.224 1.416-.672.48-.448.88-1.024 1.2-1.728.048-.096.112-.144.192-.144.096 0 .16.048.192.144l1.104 1.392c.064.08.08.16.048.24-.032.08-.096.144-.192.208-.496.864-1.128 1.544-1.896 2.04-.768.496-1.616.744-2.544.744-.928 0-1.688-.24-2.28-.72-.592-.48-.888-1.136-.888-1.968 0-.32.048-.68.144-1.08.096-.4.232-.84.408-1.32l.744-1.872c.16-.4.28-.76.36-1.08.08-.32.12-.616.12-.888 0-.48-.16-.84-.48-1.08-.32-.24-.8-.36-1.44-.36-.672 0-1.248.112-1.728.336-.48.224-.864.536-1.152.936-.288.4-.48.88-.576 1.44z"/>
        <path d="M12.008 21.656c-4.832 0-9.088-2.256-11.832-5.744-.144-.192-.12-.44.064-.592.192-.152.448-.12.592.064 2.568 3.256 6.544 5.36 11.176 5.36 3.664 0 6.944-1.328 9.504-3.528.168-.144.424-.12.568.048.144.168.12.424-.048.568-2.744 2.352-6.248 3.824-10.024 3.824z"/>
      </svg>
    ),
  },
  {
    name: 'Figma',
    svg: (
      <svg className="w-10 h-10 sm:w-12 sm:h-12 shrink-0" viewBox="0 0 38 57">
        <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"/>
        <path fill="#0acf83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"/>
        <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z"/>
        <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"/>
        <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"/>
      </svg>
    ),
  },
  {
    name: 'Vercel',
    svg: (
      <svg className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 fill-current text-slate-900 dark:text-white" viewBox="0 0 1155 1000">
        <path d="m577.3 0 577.4 1000H0z"/>
      </svg>
    ),
  },
];

const MODULE_DATA = [
  {
    id: '01',
    name: 'Navigate',
    category: 'Navigation & Schedules',
    icon: Compass,
    color: 'from-[#071B4A] to-[#0B2A6F]',
    description:
      'Full personal timetable with unit colors, clash warnings, instant push alerts when lecturers relocate classes, and GPS walking routes with building door photos.',
    highlights: ['Live Timetable Sync', 'Relocation Alerts', 'Door-to-Door GPS'],
    link: '/campus/timetable',
    image: campusHeroImage,
    span: 'lg:col-span-7',
    stagger: 'lg:translate-y-0',
    meta: 'GPS Walkways & Live Schedule',
  },
  {
    id: '02',
    name: 'House Find',
    category: 'Off-Campus Housing',
    icon: HomeIcon,
    color: 'from-[#0B2A6F] to-[#071B4A]',
    description:
      'Audited off-campus student accommodation across Baraton Centre, Chemamul, and Kaimosi Road. Filter rentals by exact monthly KES budget, distance from lecture halls, verified 24/7 borehole water, perimeter security fencing, and connect directly with verified property owners—eliminating predatory broker fees.',
    highlights: ['Audited Borehole Water', 'Direct Landlord Contacts', 'KES Budget Filter', 'Zero Broker Fees'],
    link: '/housing',
    image: housingImage,
    span: 'lg:col-span-5',
    stagger: 'lg:translate-y-4',
    meta: 'Zero Broker Fees • Audited Water',
  },
  {
    id: '03',
    name: 'Share Hub',
    category: 'Peer Academic Exchange',
    icon: FileText,
    color: 'from-[#071B4A] to-[#0B2A6F]',
    description:
      'Verified lecture summaries, past examination papers, and collaborative study groups where room bookings select from available campus academic venues.',
    highlights: ['Verified Past Papers', 'Continuous Assessment', 'Study Circles'],
    link: '/share',
    image: libraryImage,
    span: 'lg:col-span-5',
    stagger: 'lg:-translate-y-3',
    meta: 'Past Exams & Class Notes',
  },
  {
    id: '04',
    name: 'Community & Events',
    category: 'Student Life & Fellowship',
    icon: Users,
    color: 'from-[#071B4A] to-[#0B2A6F]',
    description:
      'Campus events with QR ticketing, Sabbath sunset vespers, student guild elections, active clubs (GDSC, AYS, Innovators), and collegiate athletic derbies.',
    highlights: ['QR Event Passes', 'Sabbath Vespers', 'Student Guild Voting'],
    link: '/community/events',
    image: studentLifeImage,
    span: 'lg:col-span-7',
    stagger: 'lg:translate-y-1',
    meta: 'Sunset Vespers & Campus Clubs',
  },
  {
    id: '05',
    name: 'Alumni & Opportunities',
    category: 'Career Acceleration',
    icon: Briefcase,
    color: 'from-[#071B4A] to-[#0B2A6F]',
    description:
      'Connect directly with Baraton graduates at Safaricom, Microsoft ADC, and Equity Bank. Submit structured 3-step pitches for industrial attachments and verified referrals.',
    highlights: ['Warm Industry Referrals', 'Alumni Mentorship', 'Direct Attachments'],
    link: '/community/alumni',
    image: scienceComplexImage,
    span: 'lg:col-span-6',
    stagger: 'lg:-translate-y-2',
    meta: 'Safaricom • Microsoft ADC • Equity',
  },
  {
    id: '06',
    name: 'Lost & Found',
    category: 'Digital Handover Desk',
    icon: SearchCheck,
    color: 'from-[#071B4A] to-[#0B2A6F]',
    description:
      'A unified digital custody and verification desk for personal belongings misplaced across UEAB lecture halls, laboratories, the cafeteria, and sports grounds. Log lost items with camera photos, answer confidential ownership security quizzes, and safely retrieve items at Main Campus Security Post.',
    highlights: ['Photo Verification', 'Secret Ownership Quiz', 'Security Desk Sync', 'Instant Student Alerts'],
    link: '/found',
    image: venueEntranceImage,
    span: 'lg:col-span-6',
    stagger: 'lg:translate-y-2',
    meta: 'Campus Security Post Sync',
  },
];

export const LandingPage: React.FC = () => {
  const { darkMode, toggleDarkMode } = useKampasStore();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modulesDropdownOpen, setModulesDropdownOpen] = useState(false);
  const [infoModalData, setInfoModalData] = useState<{ title: string; content: string } | null>(null);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Global search modal state
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchCategory, setSelectedSearchCategory] = useState<string>('All');

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus input when search modal opens
  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [searchModalOpen]);

  // Global shortcut Ctrl+K or Cmd+K to open search, Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setSearchModalOpen(false);
        setModulesDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const grouped = searchService.searchAll(searchQuery);
    const allItems: SearchResultItem[] = [
      ...grouped.venues,
      ...grouped.houses,
      ...grouped.documents,
      ...grouped.lostItems,
      ...grouped.events,
      ...grouped.units,
      ...grouped.people,
      ...grouped.clubs,
    ];
    if (selectedSearchCategory === 'All') return allItems;
    return allItems.filter((item) => item.category === selectedSearchCategory);
  }, [searchQuery, selectedSearchCategory]);

  // Automatic slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
      }
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const activeSlide = HERO_SLIDES[currentSlide];

  const faqs = [
    {
      q: 'What is Kampas, and how does it relate to the official UEAB portal?',
      a: 'Kampas is the unified, day-to-day student lifestyle and academic companion for the University of Eastern Africa, Baraton. While the official Registrar portal handles semester grade entry and fee receipts, Kampas powers real-time class timetables, GPS venue directions, vetted off-campus housing, peer notes, alumni job referrals, and the lost & found desk.',
    },
    {
      q: 'How does the House Find module protect students from rental scams?',
      a: 'Every house listed on Kampas is physically audited by the Student Guild Housing Committee to verify 24/7 borehole water, perimeter security, and accurate KES pricing. Students communicate directly with vetted property owners without middleman broker fees.',
    },
    {
      q: 'How are peer study notes verified in the Share Hub?',
      a: 'Notes and past examination solutions uploaded by students undergo peer review and verification by designated departmental Class Representatives and student tutors before receiving the Gold Verified badge.',
    },
    {
      q: 'Can I access Kampas when mobile internet is slow or offline?',
      a: 'Yes! Kampas is engineered as an offline-first Progressive Web App (PWA). Your personal timetable, campus map venues, and offline student ID card remain accessible even when internet connectivity drops.',
    },
    {
      q: 'How do Alumni Referrals work for student internships?',
      a: 'Students in their 3rd or 4th year can browse verified Baraton graduates working at leading enterprises (Safaricom, Microsoft ADC, Equity Bank, AMPATH) and submit a 3-step structured pitch for industrial attachment or graduate trainee referrals.',
    },
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-[#F7F9FC] dark:bg-[#050E24] text-[#0F172A] dark:text-[#F8FAFC] font-sans transition-colors duration-300">
      {/* 1. INSTITUTIONAL TOP BAR & CREATIVE NAVIGATION */}
      <header className="sticky top-0 z-50 bg-[#071B4A] text-white shadow-lg border-b border-[#F2B705]/20">
        {/* Top utility strip */}
        <div className="hidden sm:flex items-center justify-between px-6 sm:px-8 lg:px-12 py-1.5 text-[11px] font-medium border-b border-white/10 bg-[#051336] text-slate-300">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Registrar Portal Sync: Live</span>
            </span>
            <span>·</span>
            <span>Trimester II • 2026/2027</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                setInfoModalData({
                  title: 'UEAB Main Campus',
                  content: 'Baraton, P.O. Box 2500 - 30100 Eldoret, Kenya. Main Gate Open 24/7 with Student ID.',
                })
              }
              className="hover:text-[#F2B705] transition-colors"
            >
              Campus Location
            </button>
            <span>·</span>
            <button
              onClick={() =>
                setInfoModalData({
                  title: 'Campus Security & Support',
                  content: 'Emergency Hotline: +254 722 000 000 | Security Post: Administration Gate B.',
                })
              }
              className="hover:text-[#F2B705] transition-colors"
            >
              Emergency Helpline
            </button>
          </div>
        </div>

        {/* Main Nav Bar */}
        <div className="w-full px-4 sm:px-8 lg:px-12 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            {/* Official Logo matching favicon */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/icon.svg"
                alt="Kampas UEAB Logo"
                className="w-10 h-10 object-contain rounded-xl shadow-md group-hover:scale-105 transition-transform"
              />
              <div>
                <div className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                  <span>KAMPAS</span>
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-[#F2B705] text-[#071B4A]">UEAB</span>
                </div>
                <p className="text-[10px] text-slate-300 font-semibold tracking-wide hidden sm:block">
                  Univ. of Eastern Africa, Baraton
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Creative Navigation with Creative Modules Dropdown */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-semibold text-slate-200">
            {/* Creative Modules Popover */}
            <div
              className="relative"
              onMouseEnter={() => setModulesDropdownOpen(true)}
              onMouseLeave={() => setModulesDropdownOpen(false)}
            >
              <button
                onClick={() => setModulesDropdownOpen(!modulesDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white bg-white/10 hover:bg-white/20 transition-all font-bold border border-white/15 shadow-xs"
              >
                <Layers className="w-4 h-4 text-[#F2B705]" />
                <span>Modules</span>
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-[#F2B705] text-[#071B4A]">6</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${modulesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Flyout Mega Dropdown */}
              {modulesDropdownOpen && (
                <div className="absolute left-0 top-full pt-2 w-[540px] z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="p-4 rounded-2xl bg-[#071B4A]/98 backdrop-blur-xl border border-white/20 shadow-2xl grid grid-cols-2 gap-2.5">
                    {MODULE_DATA.map((mod) => (
                      <Link
                        key={mod.id}
                        to={mod.link}
                        onClick={() => setModulesDropdownOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/10 transition-all group/item border border-transparent hover:border-white/10"
                      >
                        <div className="w-9 h-9 rounded-lg bg-[#0B2A6F] border border-[#F2B705]/40 text-[#F2B705] flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform">
                          <mod.icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-black text-white group-hover/item:text-[#F2B705] transition-colors block">
                            {mod.name}
                          </span>
                          <p className="text-[11px] text-slate-300 line-clamp-1 leading-snug">
                            {mod.category}
                          </p>
                        </div>
                      </Link>
                    ))}
                    <div className="col-span-2 pt-2.5 border-t border-white/10 px-1 flex items-center justify-between text-xs">
                      <span className="text-slate-400">All 6 modules integrated with UEAB Student ID</span>
                      <Link to="/home" className="text-[#F2B705] font-extrabold hover:underline inline-flex items-center gap-1">
                        Go to Platform <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Quick Module Links */}
            <Link to="/housing" className="hover:text-[#F2B705] transition-colors flex items-center gap-1">
              <span>Housing</span>
            </Link>
            <Link to="/campus/timetable" className="hover:text-[#F2B705] transition-colors flex items-center gap-1">
              <span>Timetable</span>
            </Link>
            <Link to="/share" className="hover:text-[#F2B705] transition-colors flex items-center gap-1">
              <span>Share Hub</span>
            </Link>
            <Link to="/found" className="hover:text-[#F2B705] transition-colors flex items-center gap-1">
              <span>Lost & Found</span>
            </Link>
            <a href="#section-about" className="hover:text-[#F2B705] transition-colors">About</a>
            <a href="#section-faq" className="hover:text-[#F2B705] transition-colors">FAQ</a>
          </nav>

          {/* Right CTAs: Creative Search Button + Theme Toggle + Enter Kampas */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Creative Universal Search Button */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 hover:text-white transition-all text-xs font-semibold shadow-xs group"
              title="Search campus (Ctrl+K or ⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-[#F2B705] group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline text-slate-300 group-hover:text-white">Search campus...</span>
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-slate-300 border border-white/20">
                ⌘K
              </kbd>
            </button>

            {/* Dark/Light mode toggle */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle theme"
              className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4 text-[#F2B705]" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Enter Kampas Button */}
            <Link
              to="/home"
              className="hidden sm:inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#F2B705] hover:bg-[#ffc61a] text-[#071B4A] font-extrabold text-xs sm:text-sm shadow-md transition-all hover:shadow-lg hover:scale-[1.02]"
            >
              <span>Enter Kampas</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/10 text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu with Search and Modules */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#051336] px-5 py-4 space-y-4 animate-in fade-in">
            {/* Search in mobile drawer */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchModalOpen(true);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-slate-200 text-xs font-semibold"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#F2B705]" />
                <span>Search campus, units, housing...</span>
              </div>
              <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded font-mono">⌘K</span>
            </button>

            {/* Mobile Modules List */}
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#F2B705] px-1 block mb-1">
                Campus Modules
              </span>
              <div className="grid grid-cols-2 gap-2">
                {MODULE_DATA.map((mod) => (
                  <Link
                    key={mod.id}
                    to={mod.link}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-white hover:text-[#F2B705]"
                  >
                    <mod.icon className="w-4 h-4 text-[#F2B705] shrink-0" />
                    <span className="truncate">{mod.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-3 space-y-2 text-sm font-bold text-slate-200">
              <a
                href="#quick-actions"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-[#F2B705]"
              >
                Campus Actions
              </a>
              <a
                href="#section-about"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-[#F2B705]"
              >
                About Kampas
              </a>
              <a
                href="#section-process"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-[#F2B705]"
              >
                Student Journey
              </a>
              <a
                href="#section-faq"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-[#F2B705]"
              >
                FAQ
              </a>
            </div>

            <div className="pt-2">
              <Link
                to="/home"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F2B705] text-[#071B4A] font-black text-sm shadow-md"
              >
                <span>Enter Kampas Student Platform</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. INSTITUTIONAL CANVAS HERO */}
      <section className="relative w-full h-[76vh] min-h-[540px] max-h-[720px] overflow-hidden select-none bg-[#071B4A]">
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              idx === currentSlide ? 'opacity-100 z-[1]' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt="University of Eastern Africa, Baraton Campus"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071B4A]/90 via-[#071B4A]/60 to-[#071B4A]/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071B4A]/80 via-transparent to-[#071B4A]/20" />
          </div>
        ))}

        {/* Hero Overlay Content */}
        <div className="relative z-10 h-full w-full px-6 sm:px-10 lg:px-16 flex flex-col justify-center">
          <div className="max-w-2xl text-white space-y-4">
            <span className="text-xs sm:text-sm font-extrabold tracking-widest uppercase text-[#F2B705] block">
              University of Eastern Africa, Baraton
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.14] text-balance">
              {activeSlide.headline}
            </h1>
            <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed text-balance">
              {activeSlide.subtext}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link
                to="/home"
                className="px-6 py-3 rounded-lg bg-[#F2B705] hover:bg-[#ffc61a] text-[#071B4A] font-extrabold shadow-xl text-sm inline-flex items-center gap-2 transition-transform hover:scale-105"
              >
                <span>Enter Student Platform</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/campus/map"
                className="px-5 py-3 rounded-lg border border-white/60 bg-white/10 hover:bg-white/20 text-white font-bold text-sm inline-flex items-center gap-2 backdrop-blur-xs transition-colors"
              >
                <Compass className="w-4 h-4 text-[#F2B705]" />
                <span>Explore Campus Map</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Slideshow Progress Dots */}
        <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center gap-2.5 pointer-events-none">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-500 pointer-events-auto ${
                idx === currentSlide
                  ? 'w-8 bg-[#F2B705] shadow-[0_0_12px_#F2B705]'
                  : 'w-2 bg-white/50'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 3. QUICK CAMPUS ACTIONS (NO RAINBOW COLORS, DETAILED DESCRIPTIVE TEXT) */}
      <section id="quick-actions" className="relative z-20 mx-auto -mt-14 w-full px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              id: 'lost',
              title: 'Lost & Found Desk',
              badge: 'Security Custody',
              description:
                'Centralized campus digital custody desk. Log misplaced items with photos, verify ownership with security quizzes, and safely retrieve items at Main Gate B Security Post.',
              icon: SearchCheck,
              iconBg: 'bg-[#0B2A6F]/10 dark:bg-blue-950/50 text-[#0B2A6F] dark:text-[#93C5FD] border border-[#0B2A6F]/20 dark:border-blue-700/40',
              to: '/found',
            },
            {
              id: 'housing',
              title: 'House Find',
              badge: 'Audited Rentals',
              description:
                'Audited off-campus student accommodation in Baraton Centre, Chemamul & Kaimosi Rd with verified 24/7 borehole water, perimeter security, and direct landlord contact without broker fees.',
              icon: HomeIcon,
              iconBg: 'bg-[#F2B705]/15 dark:bg-[#F2B705]/20 text-[#071B4A] dark:text-[#F2B705] border border-[#F2B705]/40',
              to: '/housing',
            },
            {
              id: 'timetable',
              title: 'Class Timetable',
              badge: 'Live Schedules',
              description:
                'Real-time lecture schedules with walking directions, building door photos, unit clash warnings, and instant push alerts when lecturers relocate classes.',
              icon: Calendar,
              iconBg: 'bg-[#071B4A]/10 dark:bg-slate-800 text-[#071B4A] dark:text-blue-300 border border-[#071B4A]/20',
              to: '/campus/timetable',
            },
            {
              id: 'share',
              title: 'Academic Share Hub',
              badge: 'Peer Verified',
              description:
                'Gold-verified lecture summaries, trimester continuous assessment past papers, and collaborative study groups with bookable campus venues.',
              icon: FileText,
              iconBg: 'bg-[#F2B705]/15 dark:bg-[#F2B705]/20 text-[#071B4A] dark:text-[#F2B705] border border-[#F2B705]/40',
              to: '/share',
            },
            {
              id: 'events',
              title: 'Campus Life & Events',
              badge: 'Fellowship & Clubs',
              description:
                'Sabbath sunset vespers, student guild elections, active clubs (GDSC, AYS, Innovators), athletic derbies, and QR event entry passes.',
              icon: Users,
              iconBg: 'bg-[#0B2A6F]/10 dark:bg-blue-950/50 text-[#0B2A6F] dark:text-[#93C5FD] border border-[#0B2A6F]/20',
              to: '/community/events',
            },
          ].map((item) => (
            <Link
              key={item.id}
              to={item.to}
              className="group min-h-[220px] bg-white dark:bg-[#0C1D3D] rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xl hover:shadow-2xl border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#F2B705]"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${item.iconBg}`}>
                    <item.icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-[#5B6475] dark:text-slate-300 leading-relaxed mt-2.5">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-black text-[#0B2A6F] dark:text-[#F2B705] group-hover:underline inline-flex items-center gap-1">
                  Open Service <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. CURVED SECTION SEPARATOR */}
      <div className="relative h-28 sm:h-40 mt-14 overflow-hidden bg-[#071B4A]" aria-hidden="true">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_18%_20%,rgba(96,165,250,0.32),transparent_28%),radial-gradient(circle_at_82%_0%,rgba(242,183,5,0.22),transparent_24%)]" />
        <svg
          className="absolute bottom-[-1px] left-0 h-full w-full"
          viewBox="0 0 1440 180"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 86C180 34 322 52 500 98C718 154 850 178 1050 118C1222 66 1325 28 1440 62"
            fill="none"
            stroke="rgba(96,165,250,0.42)"
            strokeWidth="3"
          />
          <path
            d="M0 106C174 58 316 72 486 116C700 170 846 190 1054 136C1228 90 1326 52 1440 82"
            fill="none"
            stroke="rgba(242,183,5,0.35)"
            strokeWidth="2"
          />
          <path
            d="M0 94C180 38 322 58 500 106C718 166 850 188 1050 126C1222 74 1325 36 1440 72V180H0V94Z"
            fill="currentColor"
            className="text-[#F7F9FC] dark:text-[#050E24]"
          />
        </svg>
      </div>

      {/* 5. ABOUT SECTION */}
      <section id="section-about" className="w-full px-4 sm:px-8 lg:px-12 py-20 sm:py-28 overflow-hidden">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          {/* Left Column: Typography, Story & CTA */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-[#0B2A6F] dark:text-[#60A5FA] font-black text-sm">/</span>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#0B2A6F] dark:text-[#60A5FA]">
                About Kampas
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black leading-[1.12] tracking-tight text-[#071B4A] dark:text-white">
              One digital home for a <span className="text-[#0B2A6F] dark:text-[#60A5FA]">better campus life.</span>
            </h2>

            <p className="text-sm sm:text-base leading-relaxed text-[#5B6475] dark:text-slate-300">
              Kampas brings the everyday University of Eastern Africa, Baraton experience into one calm, connected space. From the first lecture in the Science Complex to your next off-campus rental or alumni career opportunity, everything operates under one verified student account.
            </p>

            <p className="text-xs sm:text-sm leading-relaxed text-[#5B6475] dark:text-slate-400">
              Audited by the Student Guild and tailored to Baraton’s unique rhythms—Sabbath sunset vespers, Chemamul rentals, and trimester continuous assessments are always at your fingertips.
            </p>

            <div className="pt-2">
              <Link
                to="/home"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#0B2A6F] hover:bg-[#071B4A] dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-900/20 hover:shadow-xl transition-all"
              >
                <span>Explore the Platform</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Angled Cutout Image + Experience Badge + Dot Matrix + 3 Stacked Floating Feature Cards */}
          <div className="relative pt-6 sm:pt-8">
            {/* Background Dot Matrix Pattern */}
            <div className="absolute -top-4 -left-4 z-0 grid grid-cols-6 gap-2 text-blue-200 dark:text-blue-900/40 select-none opacity-80">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-current" />
              ))}
            </div>

            <div className="relative z-10 grid sm:grid-cols-[1.1fr_0.9fr] gap-6 items-center">
              {/* Main Angled Cutout Campus Image */}
              <div className="relative">
                <div className="overflow-hidden rounded-3xl shadow-2xl border-4 border-white dark:border-[#0C1D3D] [clip-path:polygon(0_10%,100%_0,100%_90%,0_100%)]">
                  <img
                    src="/src/assets/images/ueab_campus_hero_1794150142310.jpg"
                    alt="UEAB Campus Administration Tower"
                    className="w-full h-[360px] sm:h-[420px] object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Overlapping Charter Badge */}
                <div className="absolute -bottom-4 left-4 z-20 rounded-2xl bg-[#0B2A6F] dark:bg-[#071B4A] border border-blue-400/30 text-white p-4 sm:p-5 shadow-2xl max-w-[150px]">
                  <div className="text-3xl font-black leading-none text-white">1980</div>
                  <div className="text-[11px] font-bold mt-1 text-blue-100 uppercase tracking-wide">
                    Chartered in Kenya
                  </div>
                </div>
              </div>

              {/* Stacked Floating Feature Cards */}
              <div className="space-y-3.5">
                {[
                  {
                    title: '6 Connected Modules',
                    desc: 'Timetables, housing, past papers, lost & found in one place.',
                    icon: Layers,
                  },
                  {
                    title: 'Verified Off-Campus Housing',
                    desc: 'Audited rentals with borehole water in Chemamul & Baraton.',
                    icon: HomeIcon,
                  },
                  {
                    title: '24/7 Real-Time Access',
                    desc: 'Offline-first PWA for campus routes and venue changes.',
                    icon: Clock,
                  },
                ].map((card, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-[#0C1D3D] p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 flex items-start gap-3.5 hover:shadow-xl transition-shadow"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#0B2A6F] dark:text-[#60A5FA] shrink-0 flex items-center justify-center font-bold border border-blue-100 dark:border-blue-900/40">
                      <card.icon className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                        {card.title}
                      </h4>
                      <p className="text-[11px] text-[#5B6475] dark:text-slate-400 leading-snug mt-0.5">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SIX INTEGRATED CAMPUS MODULES - UNEVEN HONEYCOMB CLUSTERS */}
      <section id="section-modules" className="relative bg-[#05112F] text-white py-14 sm:py-20 overflow-hidden w-full border-t border-b border-white/10">
        {/* Tech-inspired circuit/grid texture across the full module section */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.16]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="section-tech-grid" width="120" height="120" patternUnits="userSpaceOnUse">
                <path
                  d="M0 24H28V8H54V24H88V48H120 M28 24V62H12V96H42V120 M54 24V0 M88 48V76H70V106H120 M42 120V88H62V76H88"
                  fill="none"
                  stroke="#60A5FA"
                  strokeWidth="1"
                />
                <path d="M0 60H18 M102 0V18 M96 88H120" stroke="#F2B705" strokeWidth="1" />
                <circle cx="28" cy="24" r="2" fill="#F2B705" />
                <circle cx="88" cy="48" r="2" fill="#60A5FA" />
                <circle cx="42" cy="120" r="2" fill="#F2B705" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#section-tech-grid)" />
          </svg>
        </div>
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_10%,rgba(96,165,250,0.13),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(242,183,5,0.10),transparent_28%)]" />

        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#0B2A6F]/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[#F2B705]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-10 pb-4 border-b border-white/10">
            <div className="max-w-2xl space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Six Integrated Campus Modules
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                From classroom logistics to off-campus housing and career mentorship, everything operates under one unified student account.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-start lg:self-end">
              <div className="px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3">
                <div className="flex -space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#F2B705] inline-block shadow-[0_0_8px_#F2B705]" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_#34d399]" />
                  <span className="w-3 h-3 rounded-full bg-blue-400 inline-block shadow-[0_0_8px_#60a5fa]" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-bold text-white font-mono uppercase tracking-wide">6 Core Nodes</p>
                  <p className="text-[10px] text-slate-400">Synchronized Realtime</p>
                </div>
              </div>
            </div>
          </div>

          {/* Uneven Honeycomb Bento Grid of Divs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-7 items-stretch">
            {MODULE_DATA.map((mod) => (
              <div
                key={mod.id}
                className={`group relative rounded-3xl overflow-hidden border border-white/10 hover:border-[#F2B705]/60 bg-[#071B4A]/90 p-6 sm:p-8 flex flex-col justify-between shadow-xl hover:shadow-[0_14px_45px_rgba(242,183,5,0.18)] transition-all duration-500 ${mod.span} ${mod.stagger}`}
              >
                {/* Dimmed Background Campus Image with smooth zoom on hover */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-105 opacity-45 group-hover:opacity-60 filter brightness-110 saturate-125 contrast-105 pointer-events-none"
                  style={{ backgroundImage: `url(${mod.image})` }}
                />

                {/* Layered dark atmospheric gradient overlays to ensure razor-sharp text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#040e29]/95 via-[#071b4a]/75 to-[#071b4a]/35 group-hover:via-[#071b4a]/65 group-hover:to-[#071b4a]/25 transition-colors duration-500 pointer-events-none" />

                {/* Subtle honeycomb micro-grid dot watermark */}
                <div className="absolute inset-0 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500 bg-[radial-gradient(#F2B705_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                {/* Ambient glow highlight */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#F2B705]/5 group-hover:bg-[#F2B705]/15 rounded-full blur-2xl transition-all duration-500 pointer-events-none" />

                {/* Top Card Elements */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-3 mb-6">
                    {/* Hexagon Honeycomb Icon Badge */}
                    <div className="relative flex items-center justify-center">
                      <div
                        className="w-12 h-12 shrink-0 bg-gradient-to-br from-[#F2B705] to-amber-600 flex items-center justify-center text-[#071B4A] shadow-md"
                        style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                      >
                        <mod.icon className="w-5 h-5 stroke-[2.4]" />
                      </div>
                    </div>

                    {/* ID and Category Tag */}
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-300 bg-white/10 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                        {mod.category}
                      </span>
                      <span className="text-2xl sm:text-3xl font-black font-mono text-[#F2B705]/70 group-hover:text-[#F2B705] transition-colors">
                        {mod.id}
                      </span>
                    </div>
                  </div>

                  {/* Title & Metadata note */}
                  <div className="space-y-1.5 mb-3">
                    <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#F2B705] transition-colors tracking-tight">
                      {mod.name}
                    </h3>
                    <p className="text-[11px] font-mono text-[#F2B705]/90 tracking-wide uppercase">
                      {mod.meta}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {mod.description}
                  </p>
                </div>

                {/* Bottom Tags & Action */}
                <div className="relative z-10 mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {mod.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-bold text-slate-200 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/10 group-hover:border-[#F2B705]/30 group-hover:text-[#F2B705] transition-colors"
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={mod.link}
                    className="inline-flex items-center gap-2 text-xs font-black text-[#F2B705] hover:text-amber-300 transition-colors group/link ml-auto sm:ml-0"
                  >
                    <span>Explore Module</span>
                    <ArrowRight className="w-4 h-4 transform group-hover/link:translate-x-1.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FOUR-STAGE STUDENT JOURNEY */}
      <section id="section-process" className="bg-white dark:bg-[#071B4A] py-20 sm:py-28 border-b border-[#E3E8F0] dark:border-[#1E3158] w-full">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <div className="max-w-5xl mx-auto mb-12 sm:mb-16 space-y-3">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#0B2A6F] dark:text-[#F2B705]">
              The Student Journey
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#071B4A] dark:text-white">
              From first login to your next opportunity.
            </h2>
            <p className="text-sm text-[#5B6475] dark:text-slate-300">
              A simple flow designed around how students actually learn, move, connect, and grow at Baraton.
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-12 sm:space-y-16">
            {/* Step 01: Text on Left, Giant Masked Number 01 on Right */}
            <div className="group grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center border-b border-slate-200 dark:border-slate-700/70 pb-12 sm:pb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 hover:-translate-y-1 transition-transform">
              <div className="space-y-4">
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Research & Analyze
                </h3>
                <div className="w-12 h-1 bg-amber-400 rounded-full" />
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
                  Begin with trusted campus information, your personal timetable, and a clear view of the people, places, and resources that shape your day. Kampas helps you understand what matters before you make your next move.
                </p>
                <div className="pt-2 flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Real-time lecture hall relocations & directions</span>
                </div>
              </div>

              {/* Giant Cutout Masked Number 01 */}
              <div className="flex justify-center md:justify-start md:pl-2">
                <div
                  className="text-[8.5rem] sm:text-[10rem] md:text-[12rem] font-black leading-none tracking-tighter select-none bg-cover bg-center text-transparent bg-clip-text brightness-[0.78] drop-shadow-2xl"
                  style={{
                    backgroundImage: 'url(/src/assets/images/ueab_campus_hero_1794150142310.jpg)',
                    WebkitBackgroundClip: 'text',
                  }}
                >
                  01
                </div>
              </div>
            </div>

            {/* Step 02: Giant Masked Number 02 on Left, Text on Right */}
            <div className="group grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center border-b border-slate-200 dark:border-slate-700/70 pb-12 sm:pb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 hover:-translate-y-1 transition-transform [animation-delay:150ms]">
              {/* Giant Cutout Masked Number 02 */}
              <div className="flex justify-center md:justify-end md:pr-2 order-2 md:order-1">
                <div
                  className="text-[8.5rem] sm:text-[10rem] md:text-[12rem] font-black leading-none tracking-tighter select-none bg-cover bg-center text-transparent bg-clip-text brightness-[0.78] drop-shadow-2xl"
                  style={{
                    backgroundImage: 'url(/src/assets/images/ueab_student_housing_1794150143766.jpg)',
                    WebkitBackgroundClip: 'text',
                  }}
                >
                  02
                </div>
              </div>

              <div className="space-y-4 order-1 md:order-2">
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Connect & Plan
                </h3>
                <div className="w-12 h-1 bg-amber-400 rounded-full" />
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
                  Bring your academic and social life together in one place. Find study partners, verified housing in Chemamul or Baraton Centre, events, and the right campus destination without switching between disconnected apps.
                </p>
                <div className="pt-2 flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Audited student housing & roommate compatibility</span>
                </div>
              </div>
            </div>

            {/* Step 03: Text on Left, Giant Masked Number 03 on Right */}
            <div className="group grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center border-b border-slate-200 dark:border-slate-700/70 pb-12 sm:pb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 hover:-translate-y-1 transition-transform [animation-delay:300ms]">
              <div className="space-y-4">
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Learn & Grow
                </h3>
                <div className="w-12 h-1 bg-amber-400 rounded-full" />
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
                  Make every trimester count with peer-reviewed notes, collaborative groups, continuous assessment archives, and academic opportunities that turn everyday student experiences into measurable progress.
                </p>
                <div className="pt-2 flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Gold-verified lecture summaries & exam past papers</span>
                </div>
              </div>

              {/* Giant Cutout Masked Number 03 */}
              <div className="flex justify-center md:justify-start md:pl-2">
                <div
                  className="text-[8.5rem] sm:text-[10rem] md:text-[12rem] font-black leading-none tracking-tighter select-none bg-cover bg-center text-transparent bg-clip-text brightness-[0.78] drop-shadow-2xl"
                  style={{
                    backgroundImage: 'url(/src/assets/images/ueab_library_students_1794150143182.jpg)',
                    WebkitBackgroundClip: 'text',
                  }}
                >
                  03
                </div>
              </div>
            </div>

            {/* Step 04: Giant Masked Number 04 on Left, Text on Right */}
            <div className="group grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center animate-in fade-in slide-in-from-bottom-4 duration-700 hover:-translate-y-1 transition-transform [animation-delay:450ms]">
              {/* Giant Cutout Masked Number 04 */}
              <div className="flex justify-center md:justify-end md:pr-2 order-2 md:order-1">
                <div
                  className="text-[8.5rem] sm:text-[10rem] md:text-[12rem] font-black leading-none tracking-tighter select-none bg-cover bg-center text-transparent bg-clip-text brightness-[0.78] drop-shadow-2xl"
                  style={{
                    backgroundImage: 'url(/src/assets/images/ueab_student_life_1794150144449.jpg)',
                    WebkitBackgroundClip: 'text',
                  }}
                >
                  04
                </div>
              </div>

              <div className="space-y-4 order-1 md:order-2">
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Launch Forward
                </h3>
                <div className="w-12 h-1 bg-amber-400 rounded-full" />
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
                  Take the confidence and relationships you build at Baraton beyond campus. Meet alumni in Kenya’s top companies, start meaningful career conversations, and discover pathways into leading enterprises.
                </p>
                <div className="pt-2 flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Warm career referrals to Safaricom, Equity & Microsoft</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION SECTION */}
      <section id="section-faq" className="w-full px-4 sm:px-8 lg:px-12 py-20 space-y-8 bg-[#F7F9FC] dark:bg-[#050E24]">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#0B2A6F] dark:text-[#F2B705] uppercase tracking-wider">
            Student Inquiries
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071B4A] dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#0C1D3D] rounded-xl border border-[#E3E8F0] dark:border-[#1E3158] overflow-hidden shadow-xs transition-colors"
            >
              <button
                onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left font-bold text-sm text-[#071B4A] dark:text-white flex items-center justify-between gap-4"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#0B2A6F] dark:text-[#F2B705] shrink-0 transition-transform duration-200 ${
                    openFaqIdx === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openFaqIdx === idx && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-[#5B6475] dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. CALL TO ACTION BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#06102D] via-[#0B2A6F] to-[#071B4A] text-white py-16 sm:py-20 border-t border-[#F2B705]/30 w-full">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(242,183,5,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(242,183,5,0.18)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="absolute -top-32 -right-20 h-80 w-80 rounded-full bg-[#F2B705]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl text-center lg:text-left space-y-4">
            <span className="inline-flex items-center gap-2 text-[11px] font-black text-[#F2B705] uppercase tracking-[0.2em]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F2B705] shadow-[0_0_10px_#F2B705]" />
              Your Campus, In One Place
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ready to explore your campus?
            </h2>
            <p className="text-sm sm:text-base text-slate-200 max-w-xl leading-relaxed">
              Experience the unified student operating system for the University of Eastern Africa, Baraton.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              to="/home"
              className="px-7 py-4 rounded-xl bg-[#F2B705] hover:bg-[#ffc61a] text-[#071B4A] font-black text-sm sm:text-base shadow-[0_12px_30px_rgba(242,183,5,0.25)] transition-all inline-flex items-center gap-2 hover:-translate-y-1"
            >
              <span>Enter Kampas Student Portal</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 10. INSTITUTIONAL FOOTER */}
      <footer className="relative overflow-hidden bg-[#051336] text-white border-t border-white/10 pt-14 sm:pt-16 pb-8 w-full">
        <div className="absolute inset-x-0 bottom-[-1.5rem] z-0 text-center text-[clamp(7rem,24vw,23rem)] font-black leading-none tracking-[-0.08em] text-[#273248]/80 select-none whitespace-nowrap pointer-events-none">
          KAMPAS
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.9fr_1fr_1.25fr] gap-10 lg:gap-14 pb-12 border-b border-white/10">
          <div className="space-y-5">
            <div className="flex items-center gap-2.5">
              <img
                src="/icon.svg"
                alt="Kampas UEAB Logo"
                className="w-10 h-10 object-contain rounded-xl shadow-lg ring-1 ring-white/15"
              />
              <span className="text-xl font-black tracking-tight">KAMPAS</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              University of Eastern Africa, Baraton. The unified student companion for academics, verified housing, timetables, and career mentorship.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-[10px] text-[#F2B705] font-black uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              Chartered in Kenya · 1980
            </div>
          </div>

          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#F2B705] mb-4">
              Campus Modules
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><Link to="/campus/timetable" className="hover:text-[#F2B705] transition-colors">Navigate & GPS Timetable</Link></li>
              <li><Link to="/housing" className="hover:text-[#F2B705] transition-colors">House Find (Off-Campus)</Link></li>
              <li><Link to="/share" className="hover:text-[#F2B705] transition-colors">Academic Share Hub</Link></li>
              <li><Link to="/community/events" className="hover:text-[#F2B705] transition-colors">Community & Events</Link></li>
              <li><Link to="/community/alumni" className="hover:text-[#F2B705] transition-colors">Alumni Referrals</Link></li>
              <li><Link to="/found" className="hover:text-[#F2B705] transition-colors">Digital Lost & Found</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#F2B705] mb-4">
              Campus Support
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-3 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5">
                <MapPin className="w-4 h-4 text-[#F2B705] shrink-0 mt-0.5" />
                <span>Baraton, P.O. Box 2500, Eldoret</span>
              </li>
              <li className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5">
                <Phone className="w-4 h-4 text-[#F2B705] shrink-0" />
                <span>Security Desk: +254 722 000 000</span>
              </li>
              <li className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5">
                <Mail className="w-4 h-4 text-[#F2B705] shrink-0" />
                <span>support@ueab.ac.ke</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#F2B705] mb-4">
              Student Newsletter
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Subscribe to official Baraton Guild events, trimester schedules, and venue updates.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setInfoModalData({
                  title: 'Subscribed to Kampas Updates',
                  content: 'You will receive weekly Baraton Guild announcements and timetable notifications.',
                });
              }}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="email"
                required
                placeholder="student@ueab.ac.ke"
                className="w-full px-3.5 py-2.5 text-xs rounded-lg bg-[#02091D]/40 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-[#F2B705] focus:ring-1 focus:ring-[#F2B705]/50"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-lg bg-[#F2B705] text-[#071B4A] font-extrabold text-xs shrink-0 hover:bg-[#ffc61a] transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} University of Eastern Africa, Baraton. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                setInfoModalData({
                  title: 'Privacy Policy',
                  content: 'Kampas does not sell student personal data. All academic records are synced directly with authorized University Registrar services.',
                })
              }
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={() =>
                setInfoModalData({
                  title: 'Terms of Use',
                  content: 'Kampas is provided for active students, faculty, and verified alumni of the University of Eastern Africa, Baraton.',
                })
              }
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </footer>

      {/* 11. UNIVERSAL GLOBAL SEARCH MODAL */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 animate-in fade-in duration-200">
          <div
            className="bg-white dark:bg-[#071B4A] max-w-2xl w-full rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Box */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <Search className="w-5 h-5 text-[#F2B705] shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lecture venues, houses, units, past papers, lost items..."
                className="w-full bg-transparent text-sm sm:text-base font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800"
              >
                ESC
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-[#051336] flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
              {['All', 'Venues', 'Houses', 'Documents', 'Lost items', 'Events', 'Units'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedSearchCategory(cat)}
                  className={`px-3 py-1 rounded-lg font-bold whitespace-nowrap transition-colors ${
                    selectedSearchCategory === cat
                      ? 'bg-[#0B2A6F] text-[#F2B705] shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat === 'Documents' ? 'Past Papers & Notes' : cat}
                </button>
              ))}
            </div>

            {/* Results or Suggestions List */}
            <div className="p-3 sm:p-4 overflow-y-auto flex-1 space-y-2">
              {searchResults ? (
                searchResults.length > 0 ? (
                  searchResults.slice(0, 10).map((item) => (
                    <button
                      key={`${item.category}-${item.id}`}
                      onClick={() => {
                        setSearchModalOpen(false);
                        navigate(item.targetUrl);
                      }}
                      className="w-full text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0C1D3D] border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-[#0B2A6F]/10 dark:bg-[#0B2A6F] text-[#0B2A6F] dark:text-[#F2B705] flex items-center justify-center shrink-0">
                          {item.category === 'Venues' && <MapPin className="w-4 h-4" />}
                          {item.category === 'Houses' && <HomeIcon className="w-4 h-4" />}
                          {item.category === 'Documents' && <FileText className="w-4 h-4" />}
                          {item.category === 'Lost items' && <SearchCheck className="w-4 h-4" />}
                          {item.category === 'Events' && <Calendar className="w-4 h-4" />}
                          {item.category === 'Units' && <GraduationCap className="w-4 h-4" />}
                          {item.category === 'People' && <Users className="w-4 h-4" />}
                          {item.category === 'Clubs' && <Users className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate group-hover:text-[#0B2A6F] dark:group-hover:text-[#F2B705]">
                              {item.title}
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#F2B705] group-hover:translate-x-1 transition-all shrink-0" />
                    </button>
                  ))
                ) : (
                  <div className="py-12 text-center space-y-2">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      No results found for "{searchQuery}"
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Try searching for a hall like "Science Complex", a unit like "COSC 311", or "Chemamul rentals".
                    </p>
                  </div>
                )
              ) : (
                /* Quick Suggested Searches */
                <div className="py-4 px-2 space-y-4">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    Quick Campus Suggestions
                  </span>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {[
                      { query: 'Chemamul', label: 'Chemamul Rentals (Borehole water)', cat: 'Houses' },
                      { query: 'COSC 311', label: 'COSC 311 - Advanced Database', cat: 'Documents' },
                      { query: 'Science Complex', label: 'Science Complex Classrooms', cat: 'Venues' },
                      { query: 'Student ID', label: 'Lost Student ID Card Handover', cat: 'Lost items' },
                      { query: 'Kaimosi Road', label: 'Kaimosi Road Audited Rentals', cat: 'Houses' },
                      { query: 'Vesper', label: 'Sabbath Sunset Vespers', cat: 'Events' },
                    ].map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => setSearchQuery(sug.query)}
                        className="text-left p-3 rounded-xl bg-slate-50 dark:bg-[#0C1D3D] hover:bg-[#F2B705]/10 border border-slate-100 dark:border-slate-800 transition-all flex items-center justify-between group"
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-[#0B2A6F] dark:group-hover:text-[#F2B705] block">
                            {sug.label}
                          </span>
                          <span className="text-[10px] text-slate-400">{sug.cat}</span>
                        </div>
                        <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#F2B705]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Keyboard Shortcuts */}
            <div className="px-4 py-3 bg-slate-50 dark:bg-[#051336] border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Use <kbd className="font-mono font-bold bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">ESC</kbd> to close</span>
              <span>Direct navigation to student portal</span>
            </div>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {infoModalData && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#071B4A] max-w-md w-full rounded-2xl shadow-2xl p-6 space-y-4 border border-slate-200 dark:border-slate-700 animate-in fade-in">
            <h3 className="text-lg font-bold text-[#071B4A] dark:text-white">
              {infoModalData.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {infoModalData.content}
            </p>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                className="px-4 py-2 rounded-lg bg-[#071B4A] dark:bg-[#F2B705] text-white dark:text-[#071B4A] font-bold text-xs"
                onClick={() => setInfoModalData(null)}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
