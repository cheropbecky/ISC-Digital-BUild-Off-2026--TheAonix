/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Official Landing Page for University of Eastern Africa, Baraton (UEAB)
 * Tagline: "The campus, in one place."
 * Features:
 * - Two-row institutional header (Utility strip + main navigation + gold "Enter Kampas" button)
 * - Automatic ~80vh hero slideshow with motion transitions and a lighter image treatment
 * - Technology partners marquee
 * - Detailed module cards for ALL 6 modules (Navigate, House Find, Share Hub, Community, Opportunities, Lost & Found)
 * - 3-step How it Works
 * - Interactive FAQ accordion
 * - Comprehensive institutional footer with working newsletter and modals
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Compass,
  Home as HomeIcon,
  FileText,
  Users,
  Briefcase,
  SearchCheck,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Building,
  GraduationCap,
  Globe2,
  Award,
} from 'lucide-react';
import { InstitutionalHeader } from '../../components/shared/InstitutionalHeader';
import { Footer } from '../../components/shared/Footer';
import { Button } from '../../components/ui/Button';

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
    image: '/src/assets/images/ueab_campus_hero_1793989895358.jpg',
    tagline: 'OFFICIAL STUDENT PORTAL & LOGISTICS PLATFORM',
    headline: 'The campus, in one place.',
    subtext:
      'The comprehensive digital operating system for the University of Eastern Africa, Baraton. Live timetables, verified off-campus rentals, peer study notes, and alumni career referrals.',
  },
  {
    id: 2,
    image: '/src/assets/images/ueab_house_modern_1794079506521.jpg',
    tagline: 'HOUSE FIND • OFF-CAMPUS STUDENT HOUSING',
    headline: 'Find verified rentals with zero broker scams.',
    subtext:
      'Discover and compare 14+ audited rentals in Baraton Centre, Chemamul, and Kaimosi Road with 24/7 borehole water, Wi-Fi, and direct landlord contact.',
  },
  {
    id: 3,
    image: '/src/assets/images/ueab_library_hall_1793989894699.jpg',
    tagline: 'ACADEMIC SHARE HUB & STUDY GROUPS',
    headline: 'Top lecture notes & past papers at your fingertips.',
    subtext:
      'Access peer-reviewed study guides, past trimester continuous assessment exams, and collaborate in booked campus study circles.',
  },
  {
    id: 4,
    image: '/src/assets/images/ueab_science_complex_1793989896519.jpg',
    tagline: 'REAL-TIME CAMPUS LOGISTICS',
    headline: 'Instant alerts when your lecture venue moves.',
    subtext:
      'Never arrive at an empty hall again. Real-time push updates guide you with walking directions and entrance door photos directly to relocated classrooms.',
  },
  {
    id: 5,
    image: '/src/assets/images/ueab_student_life_1793989896360.jpg',
    tagline: 'ALUMNI MENTORSHIP & INDUSTRY REFERRALS',
    headline: 'From Baraton classrooms to Kenya’s tech giants.',
    subtext:
      'Pitch your resume directly to Baraton alumni leaders at Safaricom, Microsoft ADC, and Equity Bank for warm job referrals and industrial attachments.',
  },
];

const PARTNER_LOGOS = [
  { name: 'GitHub', src: 'https://cdn.simpleicons.org/github/0B2A6F' },
  { name: 'Google', src: 'https://cdn.simpleicons.org/google/0B2A6F' },
  { name: 'Microsoft', src: 'https://cdn.simpleicons.org/microsoft/0B2A6F' },
  { name: 'Anthropic', src: 'https://cdn.simpleicons.org/anthropic/0B2A6F' },
  { name: 'OpenAI', src: 'https://cdn.simpleicons.org/openai/0B2A6F' },
  { name: 'AWS', src: 'https://cdn.simpleicons.org/amazonaws/0B2A6F' },
  { name: 'Vercel', src: 'https://cdn.simpleicons.org/vercel/0B2A6F' },
  { name: 'Figma', src: 'https://cdn.simpleicons.org/figma/0B2A6F' },
];

const MODULE_IMAGES = {
  navigate: '/src/assets/images/ueab_campus_hero_1793989895358.jpg',
  housing: '/src/assets/images/ueab_house_modern_1794079506521.jpg',
  share: '/src/assets/images/ueab_library_hall_1793989894699.jpg',
  community: '/src/assets/images/ueab_student_life_1793989896360.jpg',
  opportunities: '/src/assets/images/ueab_science_complex_1793989896519.jpg',
  lostFound: '/src/assets/images/ueab_venue_entrance_1794079506481.jpg',
};

export const LandingPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [infoModalData, setInfoModalData] = useState<{ title: string; content: string } | null>(null);

  // FAQ Accordion State
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Automatic slideshow: pauses when document/tab is hidden.
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const startTimer = () => {
      timer = setInterval(() => {
        if (document.visibilityState === 'visible') {
          setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        }
      }, 5000);
    };

    startTimer();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        clearInterval(timer);
      } else {
        startTimer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const activeSlide = HERO_SLIDES[currentSlide];

  const faqs = [
    {
      q: 'What is Kampas, and how does it relate to the UEAB student portal?',
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
      a: 'Students in their 3rd or 4th year can browse verified Baraton graduates working at leading enterprises (Safaricom, Microsoft, Equity Bank, AMPATH) and submit a 3-step structured pitch for industrial attachment or graduate trainee referrals.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC] dark:bg-[#050E24] text-[#0F172A] dark:text-[#F8FAFC]">
      {/* 1. Two-Row Institutional Header */}
      <InstitutionalHeader
        onOpenInfoModal={(title, content) => setInfoModalData({ title, content })}
      />

      {/* 2. Institutional Canvas Hero (~80vh) */}
      <section className="relative w-full h-[76vh] min-h-[540px] max-h-[720px] overflow-hidden select-none bg-[#071B4A]">
        {/* Automatic Fading Slideshow */}
        {HERO_SLIDES.map((slide, idx) => (
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: idx === currentSlide ? 1 : 0, scale: idx === currentSlide ? 1 : 1.06 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute inset-0 ${idx === currentSlide ? 'z-[1]' : 'pointer-events-none'}`}
          >
            <img
              src={slide.image}
              alt="University of Eastern Africa, Baraton Campus"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071B4A]/80 via-[#071B4A]/35 to-[#071B4A]/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071B4A]/75 via-transparent to-[#071B4A]/10" />
          </motion.div>
        ))}

        {/* Hero Overlay Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-10 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45 }}
              className="max-w-2xl text-white space-y-4"
            >
            {/* UEAB Logo & Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F2B705]/20 border border-[#F2B705]/50 text-[#F2B705] text-xs font-black tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{activeSlide.tagline}</span>
            </div>

            {/* University Full Name & Headline */}
            <div className="space-y-1">
              <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-slate-300 block">
                University of Eastern Africa, Baraton
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.12] text-balance">
                {activeSlide.headline}
              </h1>
            </div>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed text-balance">
              {activeSlide.subtext}
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/home">
                <Button variant="gold" size="lg" className="font-extrabold shadow-xl text-sm">
                  <span>Enter Student Platform</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link to="/campus/map">
                <Button
                  variant="secondary"
                  size="lg"
                  className="!border-white/60 !bg-transparent !text-white hover:!bg-white/15 dark:!bg-transparent dark:!text-white text-sm"
                >
                  <Compass className="w-4 h-4 mr-1.5 text-[#F2B705]" />
                  <span>Explore Interactive Campus Map</span>
                </Button>
              </Link>
            </div>
            </motion.div>
          </AnimatePresence>
          </div>

        {/* Non-Interactive Progress Dots (Automatic Only - NO Buttons) */}
        <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center gap-2.5 pointer-events-none">
          {HERO_SLIDES.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-500 ${
                idx === currentSlide
                  ? 'w-8 bg-[#F2B705] shadow-[0_0_12px_#F2B705]'
                  : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 3. Quick campus actions */}
      <section className="relative z-20 mx-auto -mt-8 w-full max-w-7xl px-4 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              to: '/found',
              icon: SearchCheck,
              iconClass: 'bg-[#FDE2E2] text-[#DC2626]',
              eyebrow: 'Lost something?',
              title: 'Did you lose an item on or off campus?',
              action: 'Open Lost & Found',
            },
            {
              to: '/housing',
              icon: HomeIcon,
              iconClass: 'bg-[#FEF3C7] text-[#B7791F]',
              eyebrow: 'Find your space',
              title: 'Looking for a verified place to stay?',
              action: 'Browse House Find',
            },
            {
              to: '/campus/timetable',
              icon: Calendar,
              iconClass: 'bg-[#DBEAFE] text-[#2563EB]',
              eyebrow: 'Stay on track',
              title: 'Need your next class or venue?',
              action: 'View Timetable',
            },
            {
              to: '/community/events',
              icon: Sparkles,
              iconClass: 'bg-[#EDE9FE] text-[#7C3AED]',
              eyebrow: 'Get involved',
              title: 'What is happening around Baraton?',
              action: 'See Campus Events',
            },
          ].map(({ to, icon: Icon, iconClass, eyebrow, title, action }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-2xl border border-[#E3E8F0] bg-white p-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#F2B705] hover:shadow-xl dark:border-[#1E3158] dark:bg-[#0C1D3D]"
            >
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${iconClass} transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#5B6475] dark:text-slate-400">{eyebrow}</p>
              <h3 className="mt-1 min-h-12 text-sm font-black leading-5 text-[#071B4A] dark:text-white">{title}</h3>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-black text-[#0B2A6F] transition-all group-hover:gap-2 dark:text-[#F2B705]">
                {action} <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Technology Partners Marquee */}
      <section className="bg-white dark:bg-[#071B4A] border-y border-[#E3E8F0] dark:border-[#1E3158] py-7 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.24em] text-[#5B6475] dark:text-slate-400 mb-5">
            Built with tools trusted by modern teams
          </p>
          <div className="relative overflow-hidden" aria-label="Technology partners">
            <div className="flex w-max animate-[marquee_28s_linear_infinite] hover:[animation-play-state:paused]">
              {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((partner, index) => (
                <span key={`${partner.name}-${index}`} className="mx-5 sm:mx-8 flex items-center gap-3 text-lg sm:text-xl font-black tracking-tight text-[#0B2A6F]/70 dark:text-white/70 whitespace-nowrap">
                  <img src={partner.src} alt="" aria-hidden="true" className="h-6 w-6 object-contain opacity-75" />
                  {partner.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. About UEAB Feature */}
      <section id="section-about" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative">
            <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-[#F2B705]/20 blur-2xl" />
            <img
              src="/src/assets/images/ueab_library_hall_1793989894699.jpg"
              alt="Students walking through the UEAB library campus"
              className="relative h-[330px] w-full rounded-[2rem] object-cover shadow-xl sm:h-[430px]"
            />
            <div className="absolute -bottom-5 right-5 rounded-2xl bg-[#0B2A6F] px-5 py-4 text-white shadow-xl">
              <div className="text-2xl font-black text-[#F2B705]">1980</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/70">Chartered in Kenya</div>
            </div>
          </div>
          <div className="space-y-5">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#0B2A6F] dark:text-[#F2B705]">About Kampas</span>
            <h2 className="text-3xl font-black leading-tight tracking-tight text-[#071B4A] dark:text-white sm:text-5xl">
              One digital home for a <span className="text-[#0B2A6F] dark:text-[#F2B705]">better campus life.</span>
            </h2>
            <p className="max-w-xl text-sm leading-7 text-[#5B6475] dark:text-slate-300">
              Kampas brings the everyday UEAB experience into one calm, connected space. From the first lecture to your next opportunity, the right information is always close.
            </p>
            <div className="grid grid-cols-2 gap-4 border-y border-[#E3E8F0] py-5 dark:border-[#1E3158]">
              <div><strong className="block text-2xl font-black text-[#0B2A6F] dark:text-[#F2B705]">6</strong><span className="text-xs font-semibold text-[#5B6475] dark:text-slate-400">Connected modules</span></div>
              <div><strong className="block text-2xl font-black text-[#0B2A6F] dark:text-[#F2B705]">24/7</strong><span className="text-xs font-semibold text-[#5B6475] dark:text-slate-400">Student access</span></div>
            </div>
            <Link to="/home" className="inline-flex items-center gap-2 text-sm font-black text-[#0B2A6F] hover:gap-3 dark:text-[#F2B705] transition-all">
              Explore the student platform <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Detailed Module Cards for ALL 6 Modules */}
      <section id="section-modules" className="bg-[#F7F9FC] px-4 py-16 dark:bg-[#050E24] sm:py-24">
        <div className="mx-auto max-w-7xl space-y-10 sm:space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold text-[#0B2A6F] dark:text-[#F2B705] uppercase tracking-wider">
            Engineered for Baraton Students
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#071B4A] dark:text-white tracking-tight">
            Six Integrated Campus Modules
          </h2>
          <p className="text-sm text-[#5B6475] dark:text-slate-300">
            From classroom logistics to off-campus housing and career mentorship, everything operates under one unified student account.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* Module 1: Navigate */}
          <Link
            to="/campus/timetable"
            style={{ backgroundImage: `url(${MODULE_IMAGES.navigate})` }}
            className="group relative min-h-[330px] overflow-hidden rounded-2xl border border-[#E3E8F0] bg-cover bg-center p-6 shadow-xs transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-[#1E3158]"
          >
            <div className="absolute inset-0 bg-white/95 transition-opacity duration-500 group-hover:bg-[#071B4A]/80" />
            <div className="relative z-10 space-y-3 transition-colors duration-500 group-hover:text-white">
              <div className="w-12 h-12 rounded-xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-[#0B2A6F] dark:text-[#F2B705] uppercase tracking-wider">
                Navigation & Schedules
              </span>
              <h3 className="text-lg font-bold text-[#071B4A] transition-colors group-hover:text-white dark:text-white flex items-center justify-between">
                <span>Navigate</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#F2B705] transition-colors" />
              </h3>
              <p className="text-xs text-[#5B6475] transition-colors group-hover:text-white/80 dark:text-slate-300 leading-relaxed">
                Full personal timetable with unit colors, clash warnings, instant push alerts when lecturers relocate classes, and GPS walking routes with building door photos.
              </p>
            </div>
            <div className="relative z-10 mt-4 border-t border-slate-100 pt-4 text-[11px] font-semibold text-[#0B2A6F] transition-colors duration-500 group-hover:border-white/30 group-hover:text-[#F2B705] dark:border-slate-800">
              Explore Timetables & Venues →
            </div>
          </Link>

          {/* Module 2: House Find */}
          <Link
            to="/housing"
            style={{ backgroundImage: `url(${MODULE_IMAGES.housing})` }}
            className="group relative min-h-[330px] overflow-hidden rounded-2xl border border-[#E3E8F0] bg-cover bg-center p-6 shadow-xs transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-[#1E3158]"
          >
            <div className="absolute inset-0 bg-white/95 transition-opacity duration-500 group-hover:bg-[#071B4A]/80" />
            <div className="relative z-10 space-y-3 transition-colors duration-500 group-hover:text-white">
              <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] text-[#B7791F] flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                <HomeIcon className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-[#0B2A6F] dark:text-[#F2B705] uppercase tracking-wider">
                Off-Campus Rentals
              </span>
              <h3 className="text-lg font-bold text-[#071B4A] transition-colors group-hover:text-white dark:text-white flex items-center justify-between">
                <span>House Find</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#F2B705] transition-colors" />
              </h3>
              <p className="text-xs text-[#5B6475] transition-colors group-hover:text-white/80 dark:text-slate-300 leading-relaxed">
                14+ vetted student apartments in Baraton Centre, Chemamul, and Kaimosi Road. Filter by KES rent, distance, 24/7 borehole water, compare 3 houses, and match roommates.
              </p>
            </div>
            <div className="relative z-10 mt-4 border-t border-slate-100 pt-4 text-[11px] font-semibold text-[#0B2A6F] transition-colors duration-500 group-hover:border-white/30 group-hover:text-[#F2B705] dark:border-slate-800">
              Browse Student Rentals →
            </div>
          </Link>

          {/* Module 3: Share Hub */}
          <Link
            to="/share"
            style={{ backgroundImage: `url(${MODULE_IMAGES.share})` }}
            className="group relative min-h-[330px] overflow-hidden rounded-2xl border border-[#E3E8F0] bg-cover bg-center p-6 shadow-xs transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-[#1E3158]"
          >
            <div className="absolute inset-0 bg-white/95 transition-opacity duration-500 group-hover:bg-[#071B4A]/80" />
            <div className="relative z-10 space-y-3 transition-colors duration-500 group-hover:text-white">
              <div className="w-12 h-12 rounded-xl bg-[#D1FAE5] text-[#059669] flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-[#0B2A6F] dark:text-[#F2B705] uppercase tracking-wider">
                Peer Academic Exchange
              </span>
              <h3 className="text-lg font-bold text-[#071B4A] transition-colors group-hover:text-white dark:text-white flex items-center justify-between">
                <span>Share Hub</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#F2B705] transition-colors" />
              </h3>
              <p className="text-xs text-[#5B6475] transition-colors group-hover:text-white/80 dark:text-slate-300 leading-relaxed">
                Verified lecture summaries, past examination papers, and collaborative study groups where room bookings select from available campus academic venues.
              </p>
            </div>
            <div className="relative z-10 mt-4 border-t border-slate-100 pt-4 text-[11px] font-semibold text-[#0B2A6F] transition-colors duration-500 group-hover:border-white/30 group-hover:text-[#F2B705] dark:border-slate-800">
              Open Notes Repository →
            </div>
          </Link>

          {/* Module 4: Community */}
          <Link
            to="/community/events"
            style={{ backgroundImage: `url(${MODULE_IMAGES.community})` }}
            className="group relative min-h-[330px] overflow-hidden rounded-2xl border border-[#E3E8F0] bg-cover bg-center p-6 shadow-xs transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-[#1E3158]"
          >
            <div className="absolute inset-0 bg-white/95 transition-opacity duration-500 group-hover:bg-[#071B4A]/80" />
            <div className="relative z-10 space-y-3 transition-colors duration-500 group-hover:text-white">
              <div className="w-12 h-12 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-[#0B2A6F] dark:text-[#F2B705] uppercase tracking-wider">
                Student Life & Fellowship
              </span>
              <h3 className="text-lg font-bold text-[#071B4A] transition-colors group-hover:text-white dark:text-white flex items-center justify-between">
                <span>Community & Events</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#F2B705] transition-colors" />
              </h3>
              <p className="text-xs text-[#5B6475] transition-colors group-hover:text-white/80 dark:text-slate-300 leading-relaxed">
                Campus events with QR ticketing, Sabbath sunset vespers, student guild elections, active clubs (GDSC, AYS, Innovators), and collegiate athletic derbies.
              </p>
            </div>
            <div className="relative z-10 mt-4 border-t border-slate-100 pt-4 text-[11px] font-semibold text-[#0B2A6F] transition-colors duration-500 group-hover:border-white/30 group-hover:text-[#F2B705] dark:border-slate-800">
              Discover Campus Events →
            </div>
          </Link>

          {/* Module 5: Opportunities & Alumni Mentorship */}
          <Link
            to="/community/alumni"
            style={{ backgroundImage: `url(${MODULE_IMAGES.opportunities})` }}
            className="group relative min-h-[330px] overflow-hidden rounded-2xl border border-[#E3E8F0] bg-cover bg-center p-6 shadow-xs transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-[#1E3158]"
          >
            <div className="absolute inset-0 bg-white/95 transition-opacity duration-500 group-hover:bg-[#071B4A]/80" />
            <div className="relative z-10 space-y-3 transition-colors duration-500 group-hover:text-white">
              <div className="w-12 h-12 rounded-xl bg-[#FCE7F3] text-[#DB2777] flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-[#0B2A6F] dark:text-[#F2B705] uppercase tracking-wider">
                Career Acceleration
              </span>
              <h3 className="text-lg font-bold text-[#071B4A] transition-colors group-hover:text-white dark:text-white flex items-center justify-between">
                <span>Alumni & Opportunities</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#F2B705] transition-colors" />
              </h3>
              <p className="text-xs text-[#5B6475] transition-colors group-hover:text-white/80 dark:text-slate-300 leading-relaxed">
                Connect directly with Baraton graduates at Safaricom, Microsoft ADC, and Equity Bank. Submit structured 3-step pitches for industrial attachments and verified referrals.
              </p>
            </div>
            <div className="relative z-10 mt-4 border-t border-slate-100 pt-4 text-[11px] font-semibold text-[#0B2A6F] transition-colors duration-500 group-hover:border-white/30 group-hover:text-[#F2B705] dark:border-slate-800">
              Pitch for Alumni Referrals →
            </div>
          </Link>

          {/* Module 6: Lost & Found */}
          <Link
            to="/found"
            style={{ backgroundImage: `url(${MODULE_IMAGES.lostFound})` }}
            className="group relative min-h-[330px] overflow-hidden rounded-2xl border border-[#E3E8F0] bg-cover bg-center p-6 shadow-xs transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-[#1E3158]"
          >
            <div className="absolute inset-0 bg-white/95 transition-opacity duration-500 group-hover:bg-[#071B4A]/80" />
            <div className="relative z-10 space-y-3 transition-colors duration-500 group-hover:text-white">
              <div className="w-12 h-12 rounded-xl bg-[#FDE2E2] text-[#DC2626] flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                <SearchCheck className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-[#0B2A6F] dark:text-[#F2B705] uppercase tracking-wider">
                Digital Handover Desk
              </span>
              <h3 className="text-lg font-bold text-[#071B4A] transition-colors group-hover:text-white dark:text-white flex items-center justify-between">
                <span>Lost & Found</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#F2B705] transition-colors" />
              </h3>
              <p className="text-xs text-[#5B6475] transition-colors group-hover:text-white/80 dark:text-slate-300 leading-relaxed">
                Log lost or found items with camera photos. Smart auto-match suggestions, secret ownership verification quiz, and secure handovers at Main Campus Security Post.
              </p>
            </div>
            <div className="relative z-10 mt-4 border-t border-slate-100 pt-4 text-[11px] font-semibold text-[#0B2A6F] transition-colors duration-500 group-hover:border-white/30 group-hover:text-[#F2B705] dark:border-slate-800">
              Verify & Claim Items →
            </div>
          </Link>
        </div>
        </div>
      </section>

      {/* 7. Four-Stage Student Journey */}
      <section id="section-how-it-works" className="border-y border-[#E3E8F0] bg-white py-16 dark:border-[#1E3158] dark:bg-[#071B4A] sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="max-w-xl space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#0B2A6F] dark:text-[#F2B705]">The student journey</span>
              <h2 className="text-3xl font-black tracking-tight text-[#071B4A] dark:text-white sm:text-5xl">From first login to your next opportunity.</h2>
            </div>
            <p className="max-w-xs text-sm leading-6 text-[#5B6475] dark:text-slate-300">A simple flow designed around how students actually learn, move, connect, and grow.</p>
          </div>

          <div className="divide-y divide-[#E3E8F0] dark:divide-[#1E3158]">
            {[
              ['Research & analyse', 'Begin with trusted campus information, your personal timetable, and a clear view of the people, places, and resources that shape your day. Kampas helps you understand what matters before you make your next move.', '/src/assets/images/ueab_library_hall_1793989894699.jpg'],
              ['Connect & plan', 'Bring your academic and social life together in one place. Find study partners, verified housing, events, and the right campus destination without switching between disconnected tools.', '/src/assets/images/ueab_student_life_1793989896360.jpg'],
              ['Learn & grow', 'Make every trimester count with peer-reviewed notes, collaborative groups, live campus updates, and opportunities that turn everyday student experiences into measurable progress.', '/src/assets/images/ueab_science_complex_1793989896519.jpg'],
              ['Launch forward', 'Take the confidence and relationships you build at Baraton beyond campus. Meet alumni, start meaningful career conversations, and discover pathways into Kenya’s leading industries.', '/src/assets/images/ueab_campus_hero_1793989895358.jpg'],
            ].map(([title, copy, image], index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: index % 2 ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45 }}
                className={`grid items-center gap-5 py-8 sm:py-10 md:grid-cols-[minmax(180px,0.8fr)_1fr_1.1fr] md:gap-10 ${index % 2 ? 'md:[&>div:first-child]:order-3 md:[&>h3]:order-1 md:[&>p]:order-2' : ''}`}
              >
                <div className="group relative h-40 overflow-hidden rounded-2xl sm:h-52">
                  <img src={image} alt="" className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-[#071B4A]/35 transition-colors group-hover:bg-[#071B4A]/10" />
                </div>
                <h3 className="text-xl font-black text-[#071B4A] dark:text-white sm:text-2xl">{title}</h3>
                <p className="max-w-lg text-sm leading-6 text-[#5B6475] dark:text-slate-300">{copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ Accordion Section */}
      <section id="section-faq" className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#0B2A6F] dark:text-[#F2B705] uppercase tracking-wider">
            Student Inquiries
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071B4A] dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
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
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-[#5B6475] dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3 animate-in fade-in duration-150">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. Institutional Call to Action Banner */}
      <section className="bg-gradient-to-r from-[#071B4A] via-[#0B2A6F] to-[#071B4A] text-white py-14 border-t border-[#F2B705]/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to explore your campus?
          </h2>
          <p className="text-sm sm:text-base text-slate-200 max-w-xl mx-auto">
            Experience the unified student operating system for the University of Eastern Africa, Baraton.
          </p>
          <div className="pt-2">
            <Link to="/home">
              <Button variant="gold" size="lg" className="font-extrabold shadow-xl text-sm sm:text-base">
                Enter Kampas Student Portal
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Functional Institutional Footer */}
      <Footer />

      {/* Info Modal Triggered from Header Links */}
      {infoModalData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#071B4A] max-w-md w-full rounded-2xl shadow-2xl p-6 space-y-4 border border-slate-200 dark:border-slate-700 animate-in fade-in">
            <h3 className="text-lg font-bold text-[#071B4A] dark:text-white">
              {infoModalData.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {infoModalData.content}
            </p>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <Button variant="primary" size="sm" onClick={() => setInfoModalData(null)}>
                Got it
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
