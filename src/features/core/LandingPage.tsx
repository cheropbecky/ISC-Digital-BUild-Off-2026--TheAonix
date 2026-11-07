/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Official Landing Page for University of Eastern Africa, Baraton (UEAB)
 * Tagline: "The campus, in one place."
 * Features:
 * - Two-row institutional header (Utility strip + main navigation + gold "Enter Kampas" button)
 * - Automatic ~80vh hero slideshow (5s fade, strictly NO next/prev buttons, non-interactive dots, pauses when tab is hidden)
 * - Stats strip (4,500+ students, 6 faculties, 1980 chartered, 40+ nationalities, 100% accredited)
 * - Detailed module cards for ALL 6 modules (Navigate, House Find, Share Hub, Community, Opportunities, Lost & Found)
 * - 3-step How it Works
 * - Interactive FAQ accordion
 * - Comprehensive institutional footer with working newsletter and modals
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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

export const LandingPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [infoModalData, setInfoModalData] = useState<{ title: string; content: string } | null>(null);

  // FAQ Accordion State
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Automatic slideshow: 5s fade, pauses when document/tab is hidden, NO next/prev buttons
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
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt="University of Eastern Africa, Baraton Campus"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Dark Blue Varsity Gradient Overlay (#071B4A) */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#071B4A] via-[#071B4A]/75 to-[#071B4A]/40" />
            <div className="absolute inset-0 bg-radial from-transparent via-[#071B4A]/50 to-[#071B4A]/90" />
          </div>
        ))}

        {/* Hero Overlay Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-10 flex flex-col justify-center">
          <div className="max-w-2xl text-white space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-500">
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
                  className="border-white/40 text-white hover:bg-white/10 dark:text-white text-sm"
                >
                  <Compass className="w-4 h-4 mr-1.5 text-[#F2B705]" />
                  <span>Explore Interactive Campus Map</span>
                </Button>
              </Link>
            </div>
          </div>
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

      {/* 3. Stats Strip */}
      <section className="bg-white dark:bg-[#071B4A] border-y border-[#E3E8F0] dark:border-[#1E3158] py-6 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-[#0B2A6F] dark:text-[#F2B705]">
                4,500+
              </div>
              <div className="text-xs font-semibold text-[#5B6475] dark:text-slate-300">
                Enrolled Students
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-[#0B2A6F] dark:text-[#F2B705]">
                6 Faculties
              </div>
              <div className="text-xs font-semibold text-[#5B6475] dark:text-slate-300">
                Science, Health, Business, Theology
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-[#0B2A6F] dark:text-[#F2B705]">
                1980
              </div>
              <div className="text-xs font-semibold text-[#5B6475] dark:text-slate-300">
                Chartered University
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-[#0B2A6F] dark:text-[#F2B705]">
                40+
              </div>
              <div className="text-xs font-semibold text-[#5B6475] dark:text-slate-300">
                Student Nationalities
              </div>
            </div>

            <div className="col-span-2 md:col-span-1 space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-[#16A34A] dark:text-emerald-400">
                100%
              </div>
              <div className="text-xs font-semibold text-[#5B6475] dark:text-slate-300">
                CUK / Accredited Institution
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Detailed Module Cards for ALL 6 Modules */}
      <section id="section-modules" className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-10">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Module 1: Navigate */}
          <Link
            to="/campus/timetable"
            className="group bg-white dark:bg-[#0C1D3D] rounded-2xl border border-[#E3E8F0] dark:border-[#1E3158] p-6 shadow-xs hover:border-[#0B2A6F] hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#0B2A6F] text-[#F2B705] flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-[#0B2A6F] dark:text-[#F2B705] uppercase tracking-wider">
                Module 01 • Navigation & Schedules
              </span>
              <h3 className="text-lg font-bold text-[#071B4A] dark:text-white flex items-center justify-between">
                <span>Navigate</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#F2B705] transition-colors" />
              </h3>
              <p className="text-xs text-[#5B6475] dark:text-slate-300 leading-relaxed">
                Full personal timetable with unit colors, clash warnings, instant push alerts when lecturers relocate classes, and GPS walking routes with building door photos.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-[#0B2A6F] dark:text-[#F2B705]">
              Explore Timetables & Venues →
            </div>
          </Link>

          {/* Module 2: House Find */}
          <Link
            to="/housing"
            className="group bg-white dark:bg-[#0C1D3D] rounded-2xl border border-[#E3E8F0] dark:border-[#1E3158] p-6 shadow-xs hover:border-[#0B2A6F] hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#0B2A6F] text-[#F2B705] flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                <HomeIcon className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-[#0B2A6F] dark:text-[#F2B705] uppercase tracking-wider">
                Module 02 • Off-Campus Rentals
              </span>
              <h3 className="text-lg font-bold text-[#071B4A] dark:text-white flex items-center justify-between">
                <span>House Find</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#F2B705] transition-colors" />
              </h3>
              <p className="text-xs text-[#5B6475] dark:text-slate-300 leading-relaxed">
                14+ vetted student apartments in Baraton Centre, Chemamul, and Kaimosi Road. Filter by KES rent, distance, 24/7 borehole water, compare 3 houses, and match roommates.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-[#0B2A6F] dark:text-[#F2B705]">
              Browse Student Rentals →
            </div>
          </Link>

          {/* Module 3: Share Hub */}
          <Link
            to="/share"
            className="group bg-white dark:bg-[#0C1D3D] rounded-2xl border border-[#E3E8F0] dark:border-[#1E3158] p-6 shadow-xs hover:border-[#0B2A6F] hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#0B2A6F] text-[#F2B705] flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-[#0B2A6F] dark:text-[#F2B705] uppercase tracking-wider">
                Module 03 • Peer Academic Exchange
              </span>
              <h3 className="text-lg font-bold text-[#071B4A] dark:text-white flex items-center justify-between">
                <span>Share Hub</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#F2B705] transition-colors" />
              </h3>
              <p className="text-xs text-[#5B6475] dark:text-slate-300 leading-relaxed">
                Verified lecture summaries, past examination papers, and collaborative study groups where room bookings select from available campus academic venues.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-[#0B2A6F] dark:text-[#F2B705]">
              Open Notes Repository →
            </div>
          </Link>

          {/* Module 4: Community */}
          <Link
            to="/community/events"
            className="group bg-white dark:bg-[#0C1D3D] rounded-2xl border border-[#E3E8F0] dark:border-[#1E3158] p-6 shadow-xs hover:border-[#0B2A6F] hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#0B2A6F] text-[#F2B705] flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-[#0B2A6F] dark:text-[#F2B705] uppercase tracking-wider">
                Module 04 • Student Life & Fellowship
              </span>
              <h3 className="text-lg font-bold text-[#071B4A] dark:text-white flex items-center justify-between">
                <span>Community & Events</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#F2B705] transition-colors" />
              </h3>
              <p className="text-xs text-[#5B6475] dark:text-slate-300 leading-relaxed">
                Campus events with QR ticketing, Sabbath sunset vespers, student guild elections, active clubs (GDSC, AYS, Innovators), and collegiate athletic derbies.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-[#0B2A6F] dark:text-[#F2B705]">
              Discover Campus Events →
            </div>
          </Link>

          {/* Module 5: Opportunities & Alumni Mentorship */}
          <Link
            to="/community/alumni"
            className="group bg-white dark:bg-[#0C1D3D] rounded-2xl border border-[#E3E8F0] dark:border-[#1E3158] p-6 shadow-xs hover:border-[#0B2A6F] hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#0B2A6F] text-[#F2B705] flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-[#0B2A6F] dark:text-[#F2B705] uppercase tracking-wider">
                Module 05 • Career Acceleration
              </span>
              <h3 className="text-lg font-bold text-[#071B4A] dark:text-white flex items-center justify-between">
                <span>Alumni & Opportunities</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#F2B705] transition-colors" />
              </h3>
              <p className="text-xs text-[#5B6475] dark:text-slate-300 leading-relaxed">
                Connect directly with Baraton graduates at Safaricom, Microsoft ADC, and Equity Bank. Submit structured 3-step pitches for industrial attachments and verified referrals.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-[#0B2A6F] dark:text-[#F2B705]">
              Pitch for Alumni Referrals →
            </div>
          </Link>

          {/* Module 6: Lost & Found */}
          <Link
            to="/found"
            className="group bg-white dark:bg-[#0C1D3D] rounded-2xl border border-[#E3E8F0] dark:border-[#1E3158] p-6 shadow-xs hover:border-[#0B2A6F] hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#0B2A6F] text-[#F2B705] flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                <SearchCheck className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-[#0B2A6F] dark:text-[#F2B705] uppercase tracking-wider">
                Module 06 • Digital Handover Desk
              </span>
              <h3 className="text-lg font-bold text-[#071B4A] dark:text-white flex items-center justify-between">
                <span>Lost & Found</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#F2B705] transition-colors" />
              </h3>
              <p className="text-xs text-[#5B6475] dark:text-slate-300 leading-relaxed">
                Log lost or found items with camera photos. Smart auto-match suggestions, secret ownership verification quiz, and secure handovers at Main Campus Security Post.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-[#0B2A6F] dark:text-[#F2B705]">
              Verify & Claim Items →
            </div>
          </Link>
        </div>
      </section>

      {/* 5. Three-Step How It Works Section */}
      <section id="section-how-it-works" className="bg-white dark:bg-[#071B4A] border-y border-[#E3E8F0] dark:border-[#1E3158] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-[#0B2A6F] dark:text-[#F2B705] uppercase tracking-wider">
              Zero Friction
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071B4A] dark:text-white">
              How Kampas Works in 3 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-[#F7F9FC] dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 relative">
              <div className="w-10 h-10 rounded-full bg-[#0B2A6F] text-[#F2B705] font-black text-sm flex items-center justify-center">
                1
              </div>
              <h3 className="text-base font-bold text-[#071B4A] dark:text-white">
                Launch with Student ID
              </h3>
              <p className="text-xs text-[#5B6475] dark:text-slate-300 leading-relaxed">
                Instant access preloaded with your degree programme (e.g. BSc Software Engineering), registered trimester units, and verified student profile.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#F7F9FC] dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 relative">
              <div className="w-10 h-10 rounded-full bg-[#0B2A6F] text-[#F2B705] font-black text-sm flex items-center justify-center">
                2
              </div>
              <h3 className="text-base font-bold text-[#071B4A] dark:text-white">
                Synchronize Daily Campus Life
              </h3>
              <p className="text-xs text-[#5B6475] dark:text-slate-300 leading-relaxed">
                Receive proactive notifications when lecture rooms shift, find vetted off-campus housing near the gate, and download peer notes for upcoming CATs.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#F7F9FC] dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 relative">
              <div className="w-10 h-10 rounded-full bg-[#0B2A6F] text-[#F2B705] font-black text-sm flex items-center justify-center">
                3
              </div>
              <h3 className="text-base font-bold text-[#071B4A] dark:text-white">
                Advance Career & Community
              </h3>
              <p className="text-xs text-[#5B6475] dark:text-slate-300 leading-relaxed">
                Leverage Baraton's high-trust alumni network for attachments and internships at Kenya's top technology, healthcare, and financial institutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ Accordion Section */}
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

      {/* 7. Institutional Call to Action Banner */}
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

      {/* 8. Functional Institutional Footer */}
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
