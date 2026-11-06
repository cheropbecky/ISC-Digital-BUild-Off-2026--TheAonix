/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Landing Page with Full Hero Carousel
 * University of Eastern Africa, Baraton (UEAB), Kenya
 * Features: Auto-rotating campus images, dark blue overlay, headline & CTA per slide,
 * keyboard/arrows, gold dots, touch swipe, pause on hover
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  FileText,
  Users,
  SearchCheck,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface Slide {
  id: number;
  image: string;
  tag: string;
  headline: string;
  subtext: string;
  ctaText: string;
  ctaLink: string;
  secondaryText: string;
  secondaryLink: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    image: '/src/assets/images/ueab_campus_hero_1793989895358.jpg',
    tag: 'THE OFFICIAL UEAB STUDENT PLATFORM',
    headline: 'The campus, in one place.',
    subtext:
      'Seamlessly navigate your timetable, discover free lecture halls, collaborate in study groups, and connect with Baraton alumni.',
    ctaText: 'Enter Student Portal',
    ctaLink: '/login',
    secondaryText: 'Explore Campus Map',
    secondaryLink: '/home',
  },
  {
    id: 2,
    image: '/src/assets/images/ueab_library_hall_1793989894699.jpg',
    tag: 'ACADEMIC SHARE HUB',
    headline: 'Verified notes & past papers from top peers.',
    subtext:
      'Access peer-reviewed lecture notes, exam revisions, and group study sessions. Uploaded by students, verified by class reps.',
    ctaText: 'Open Share Hub',
    ctaLink: '/share',
    secondaryText: 'Find Free Study Rooms',
    secondaryLink: '/campus/free-rooms',
  },
  {
    id: 3,
    image: '/src/assets/images/ueab_science_complex_1793989896519.jpg',
    tag: 'REAL-TIME CAMPUS LOGISTICS',
    headline: 'Instant alerts when your venue shifts.',
    subtext:
      'Never walk to an empty room again. Receive real-time push notifications when lecturers relocate classes with walking directions.',
    ctaText: 'View Today’s Timetable',
    ctaLink: '/campus/timetable',
    secondaryText: 'Track Deadlines',
    secondaryLink: '/campus/deadlines',
  },
  {
    id: 4,
    image: '/src/assets/images/ueab_student_life_1793989896360.jpg',
    tag: 'BARATON COMMUNITY & ALUMNI',
    headline: 'Bridge student ambition with alumni referrals.',
    subtext:
      'Pitch directly to Baraton graduates working at Safaricom, Microsoft ADC, and Equity Bank for verified job referrals and mentorship.',
    ctaText: 'Connect with Alumni',
    ctaLink: '/community/alumni',
    secondaryText: 'Upcoming Events & Chapel',
    secondaryLink: '/community/events',
  },
];

export const LandingPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  const activeSlide = SLIDES[currentSlide];

  return (
    <div className="-m-4 sm:-m-6 lg:-m-8">
      {/* Hero Carousel Section */}
      <section
        className="relative w-full h-[520px] sm:h-[620px] overflow-hidden select-none bg-[#071B4A]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Carousel Background Images */}
        {SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt="University of Eastern Africa Baraton Campus"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Deep Varsity Navy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#071B4A] via-[#071B4A]/70 to-[#071B4A]/40" />
          </div>
        ))}

        {/* Carousel Content Overlay */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-10 flex flex-col justify-center">
          <div className="max-w-2xl text-white animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Gold Kicker Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2B705]/20 border border-[#F2B705]/50 text-[#F2B705] text-xs font-bold tracking-wide uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{activeSlide.tag}</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.15] mb-4 text-balance">
              {activeSlide.headline}
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-lg text-slate-200 mb-8 font-normal leading-relaxed text-balance">
              {activeSlide.subtext}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <Link to={activeSlide.ctaLink}>
                <Button variant="gold" size="lg" className="font-bold shadow-lg">
                  {activeSlide.ctaText}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link to={activeSlide.secondaryLink}>
                <Button variant="secondary" size="lg" className="border-white/50 text-white hover:bg-white/10 dark:text-white">
                  {activeSlide.secondaryText}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-[#0B2A6F] text-white flex items-center justify-center transition border border-white/20 backdrop-blur-xs"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-[#0B2A6F] text-white flex items-center justify-center transition border border-white/20 backdrop-blur-xs"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Gold Indicator Dots */}
        <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentSlide
                  ? 'w-8 bg-[#F2B705] shadow-[0_0_10px_#F2B705]'
                  : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 4 Core Pillars Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#0B2A6F] dark:text-[#F2B705] uppercase tracking-wider">
            Engineered for Baraton Students
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071B4A] dark:text-white mt-1">
            Four Connected Modules
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Navigate */}
          <Link
            to="/campus/timetable"
            className="group p-5 bg-white dark:bg-[#0C1D3D] rounded-xl border border-[#E3E8F0] dark:border-[#1E3158] hover:border-[#0B2A6F] hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-lg bg-[#0B2A6F] text-[#F2B705] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#071B4A] dark:text-white mb-1.5 flex items-center justify-between">
              <span>Navigate</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#F2B705] transition-colors" />
            </h3>
            <p className="text-xs text-[#5B6475] dark:text-slate-300 leading-relaxed">
              Timetable schedules, live venue changes, free room detector, and GPS indoor walking guides.
            </p>
          </Link>

          {/* 2. Share Hub */}
          <Link
            to="/share"
            className="group p-5 bg-white dark:bg-[#0C1D3D] rounded-xl border border-[#E3E8F0] dark:border-[#1E3158] hover:border-[#0B2A6F] hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-lg bg-[#0B2A6F] text-[#F2B705] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#071B4A] dark:text-white mb-1.5 flex items-center justify-between">
              <span>Share Hub</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#F2B705] transition-colors" />
            </h3>
            <p className="text-xs text-[#5B6475] dark:text-slate-300 leading-relaxed">
              Course notes, solutions, past papers with class rep verification, and collaborative study groups.
            </p>
          </Link>

          {/* 3. Community */}
          <Link
            to="/community/events"
            className="group p-5 bg-white dark:bg-[#0C1D3D] rounded-xl border border-[#E3E8F0] dark:border-[#1E3158] hover:border-[#0B2A6F] hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-lg bg-[#0B2A6F] text-[#F2B705] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#071B4A] dark:text-white mb-1.5 flex items-center justify-between">
              <span>Community</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#F2B705] transition-colors" />
            </h3>
            <p className="text-xs text-[#5B6475] dark:text-slate-300 leading-relaxed">
              Clubs, chapel vespers, sports derbies, and verified job referrals from Baraton alumni leaders.
            </p>
          </Link>

          {/* 4. Lost & Found */}
          <Link
            to="/found"
            className="group p-5 bg-white dark:bg-[#0C1D3D] rounded-xl border border-[#E3E8F0] dark:border-[#1E3158] hover:border-[#0B2A6F] hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-lg bg-[#0B2A6F] text-[#F2B705] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <SearchCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#071B4A] dark:text-white mb-1.5 flex items-center justify-between">
              <span>Lost & Found</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#F2B705] transition-colors" />
            </h3>
            <p className="text-xs text-[#5B6475] dark:text-slate-300 leading-relaxed">
              Camera-first item logging, auto-matching suggestions, verification quiz, and security desk pick-up.
            </p>
          </Link>
        </div>
      </section>

      {/* Institutional Trust Banner */}
      <section className="bg-white dark:bg-[#071B4A] border-t border-[#E3E8F0] dark:border-[#1E3158] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[#5B6475] dark:text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#16A34A]" />
            <span className="font-semibold text-[#071B4A] dark:text-white">
              University of Eastern Africa, Baraton • Official Campus Portal
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span>P.O. Box 2500 - 30100 Eldoret, Kenya</span>
            <span>Seventh-day Adventist Higher Education</span>
          </div>
        </div>
      </section>
    </div>
  );
};
