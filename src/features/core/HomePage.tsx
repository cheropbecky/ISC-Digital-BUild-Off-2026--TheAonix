/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Home Page
 * - One-tap navigation to the next class on the dedicated Campus GIS Map
 * - Live "Now" feed ranked by time:
 *   - Next class in session with venue door preview
 *   - Urgent deadlines & CATs
 *   - Off-campus housing spotlight
 *   - Community event RSVP
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useKampasStore } from '../../lib/store';
import { getDeadlineUrgency } from '../../data/deadlines';
import { HOUSES } from '../../data/houses';
import { IMAGES } from '../../data/images';
import { ImageWithFallback } from '../../components/ui/ImageWithFallback';
import { Button } from '../../components/ui/Button';
import { formatTimeOnly } from '../../lib/utils';
import { getTimetableDayIndex } from '../../data/timetable';
import {
  MapPin,
  Calendar,
  CalendarDays,
  AlertTriangle,
  ArrowRight,
  Navigation,
  Footprints,
  Home,
  Bell,
  ChevronRight,
  Sun,
  ExternalLink,
} from 'lucide-react';

const UEAB_LOGO_URL = 'https://ueab.ac.ke/wp-content/uploads/2023/04/bara-logo-a-400x54.png';
const UEAB_GALLERY_URL = 'https://ueab.ac.ke/gallery/';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [now, setNow] = useState(() => new Date());
  const {
    user,
    notifications,
    scannedTimetable,
    timetableLoading,
    deadlines,
    events,
    notices,
  } = useKampasStore();

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  // Select the next scheduled class from the same data source as the timetable page.
  const firstName = user.fullName.trim().split(/\s+/)[0] || 'Student';
  const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 18 ? 'Good Afternoon' : 'Good Evening';
  const currentDay = now.getDay() || 7;
  const hasScannedTimetable = scannedTimetable.length > 0;
  const getClassDateTime = (entry: (typeof scannedTimetable)[number], end = false) => {
    const entryDay = getTimetableDayIndex(entry.dayOfWeek);
    const offset = (entryDay - now.getDay() + 7) % 7;
    const at = new Date(now);
    at.setDate(now.getDate() + offset);
    const [hours, minutes] = (end ? entry.endTime : entry.startTime).split(':').map(Number);
    at.setHours(hours, minutes, 0, 0);
    return at;
  };
  const currentClass = scannedTimetable.find((entry) =>
    now >= getClassDateTime(entry) && now < getClassDateTime(entry, true)
  );
  const upcomingClass = currentClass ? undefined : scannedTimetable
    .map((entry) => {
      const startsAt = getClassDateTime(entry);
      if (startsAt <= now) startsAt.setDate(startsAt.getDate() + 7);
      return { entry, startsAt };
    })
    .filter(({ startsAt }) => startsAt > now)
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())[0];
  const nextClassToday = Boolean(upcomingClass && upcomingClass.startsAt.toDateString() === now.toDateString());
  const nextClass = currentClass ?? upcomingClass?.entry;
  const nextClassStartsAt = currentClass ? getClassDateTime(currentClass) : upcomingClass?.startsAt;
  const remainingMinutes = nextClassStartsAt
    ? Math.max(0, Math.ceil((nextClassStartsAt.getTime() - now.getTime()) / 60000))
    : 0;
  const countdownLabel = currentClass
    ? `In progress · ends in ${Math.max(1, Math.ceil((getClassDateTime(currentClass, true).getTime() - now.getTime()) / 60000))} min`
    : upcomingClass
      ? `${upcomingClass.startsAt.toDateString() === now.toDateString() ? 'Starts in' : `Next ${upcomingClass.entry.dayOfWeek}`} ${remainingMinutes < 60 ? `${remainingMinutes} min` : `${Math.floor(remainingMinutes / 60)}h ${remainingMinutes % 60}m`}`
      : 'No upcoming classes';

  const urgentDeadlines = useMemo(
    () => deadlines
      .filter((deadline) => !deadline.isCompleted)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 2),
    [deadlines]
  );

  // Featured house listing
  const featuredHouse = HOUSES[0];

  // Featured upcoming event
  const featuredEvent = useMemo(
    () => [...events]
      .filter((event) => event.isPublished && new Date(event.startTime).getTime() >= Date.now())
      .sort((a, b) => a.startTime.localeCompare(b.startTime))[0],
    [events]
  );

  const upcomingEvents = useMemo(
    () => [...events]
      .filter((event) => event.isPublished && new Date(event.startTime).getTime() >= Date.now())
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
      .slice(0, 3),
    [events]
  );

  const latestNotices = notices.slice(0, 2);

  const todayClasses = scannedTimetable
    .filter((entry) => getTimetableDayIndex(entry.dayOfWeek) === currentDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  const todayLabel = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(now);
  const unreadNotifications = notifications.filter((notification) => !notification.isRead).length;
  const dashboardStats = [
    { label: 'Classes today', value: hasScannedTimetable ? todayClasses.length : 0, icon: Calendar, href: '/campus/timetable' },
    { label: 'Open tasks', value: urgentDeadlines.length, icon: AlertTriangle, href: '/campus/deadlines' },
    { label: 'Unread updates', value: unreadNotifications, icon: Bell, href: '/notifications' },
    { label: 'Campus events', value: events.filter((event) => event.isPublished).length, icon: CalendarDays, href: '/community/events' },
  ];

  const handleRouteToNextClass = () => {
    if (nextClass?.venueId) {
      navigate(`/campus/map?venue=${encodeURIComponent(nextClass.venueId)}`);
    }
  };

  return (
    <motion.div
      className="space-y-4 sm:space-y-5"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06 } },
      }}
    >
      {/* 1. Welcome Header Banner */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.35 }}
        className="relative isolate min-h-[190px] sm:min-h-[220px] overflow-hidden flex flex-col justify-center bg-[#071B4A] text-white p-5 sm:p-7 rounded-3xl shadow-lg border border-[#F2B705]/30"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center brightness-[0.72] saturate-[1.08]"
          style={{ backgroundImage: `url(${IMAGES.scienceComplexExterior.url})` }}
        />
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-[#04133F]/95 via-[#071B4A]/75 to-[#071B4A]/25" />
        <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full border-[24px] border-[#F2B705]/10" />
        <div className="pointer-events-none absolute -bottom-24 right-24 h-44 w-44 rounded-full bg-[#F2B705]/10 blur-2xl" />
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-100 mb-3">
            <Sun className="w-3.5 h-3.5 text-[#F2B705]" />
            {todayLabel}
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight drop-shadow-sm">
            {greeting}, {firstName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-2">
            {user.course || 'BSc Software Engineering'} • Year 3, 1st Trimester 2026/27
          </p>
          <div className="relative flex items-center gap-2 mt-5">
            {hasScannedTimetable && nextClass && (
              <Button
                size="sm"
                variant="gold"
                onClick={handleRouteToNextClass}
                className="text-xs font-bold shadow-lg shadow-black/20"
              >
                <Footprints className="w-3.5 h-3.5 mr-1" />
                Go to Next Class
              </Button>
            )}
            <Link to="/campus/timetable">
              <Button
                size="sm"
                variant="secondary"
                className="border-white bg-white text-xs text-[#071B4A] hover:border-[#F2B705] hover:bg-[#F2B705] hover:text-[#071B4A]"
              >
                <CalendarDays className="mr-1 h-3.5 w-3.5 text-[#1769FF]" />
                View Timetable
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative z-10 mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-3 py-2.5 shadow-xl shadow-black/10 backdrop-blur-md sm:px-4">
          <div className="flex items-center gap-2 pr-2 text-white">
            <CalendarDays className="h-3.5 w-3.5 text-[#F2B705]" />
            <span className="whitespace-nowrap text-[10px] font-bold sm:text-xs">{todayLabel}</span>
            <span className="hidden text-[10px] text-blue-100/70 sm:inline">•</span>
            <span className="hidden whitespace-nowrap text-[10px] text-blue-100/75 sm:inline">1st Trimester 2026/27 • Week 8</span>
          </div>
          <div className="ml-auto flex max-w-full flex-wrap items-center justify-end gap-x-4 gap-y-1.5">
            {dashboardStats.map(({ label, value, icon: Icon, href }) => (
              <Link key={label} to={href} className="group flex items-center gap-1.5 text-white/80 transition-colors hover:text-white" aria-label={`${label}: ${value}`}>
                <Icon className="h-3.5 w-3.5 text-[#F2B705]" />
                <span className="text-[10px] font-semibold uppercase tracking-wide">{label.replace(' today', '').replace(' updates', '')}</span>
                <span className="text-sm font-black text-white">{value}</span>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Compact next-class alert */}
      {!hasScannedTimetable && (
        <div className="rounded-xl border border-dashed border-[#CBD9F5] bg-white p-4 shadow-sm dark:border-[#2D4575] dark:bg-[#0C1D3D]">
          <p className="text-xs font-black text-[#071B4A] dark:text-white">Next Class · No timetable available</p>
          <p className="mt-1 text-[11px] text-[#5B6475] dark:text-slate-300">Upload and scan your timetable to see your next class.</p>
          <Link to="/campus/timetable" className="mt-2 inline-flex text-[11px] font-bold text-[#1769FF] hover:underline dark:text-[#F2B705]">Go to Timetable <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
        </div>
      )}
      {hasScannedTimetable && !timetableLoading && (
        <motion.div
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
          role="status"
          aria-label={nextClass ? `Next class: ${nextClass.unitName}` : 'No upcoming classes'}
          className="relative flex items-center gap-3 overflow-hidden rounded-xl border border-amber-200 border-l-4 border-l-[#F2B705] bg-gradient-to-r from-[#FFF9E6] via-white to-blue-50/70 px-3 py-2.5 shadow-sm ring-1 ring-amber-100 dark:border-amber-900/60 dark:border-l-[#F2B705] dark:from-[#3A2D04]/50 dark:via-[#0C1D3D] dark:to-[#102955] dark:ring-amber-900/30"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F2B705]/20 text-amber-700 dark:text-[#F2B705]">
            <AlertTriangle className="h-4 w-4" />
          </div>
          {nextClass ? <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-[0.16em] text-amber-700 dark:text-[#F2B705]">{currentClass ? 'Class in progress' : 'Next class'}</span>
              <span className="font-mono text-[10px] font-extrabold text-blue-700 dark:text-blue-300">{nextClass.unitCode}</span>
              <span className="truncate text-xs font-black text-[#071B4A] dark:text-white">{nextClass.unitName || 'Course name not identified'}</span>
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-[#5B6475] dark:text-slate-300">
              <span>{formatTimeOnly(nextClass.startTime)} – {formatTimeOnly(nextClass.endTime)}</span>
              <span className="text-slate-300">•</span>
              <span className="truncate">{nextClass.venueName || 'Venue not identified'}</span>
              {nextClass.lecturer && <><span className="text-slate-300">•</span><span>{nextClass.lecturer}</span></>}
              <span className="font-semibold text-[#0B2A6F] dark:text-blue-300">{countdownLabel}</span>
            </div>
          </div> : <div className="min-w-0 flex-1"><div className="text-xs font-black text-[#071B4A] dark:text-white">No upcoming classes</div><div className="mt-0.5 text-[10px] text-[#5B6475] dark:text-slate-300">Your scanned timetable has no future classes.</div></div>}
          {nextClass?.venueId && <Button size="sm" variant="gold" onClick={handleRouteToNextClass} className="hidden shrink-0 px-3 py-1.5 text-[10px] font-bold sm:inline-flex">
            <Navigation className="mr-1 h-3 w-3" /> Route
          </Button>}
        </motion.div>
      )}

      <motion.section
        variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
        className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.75fr)]"
      >
        <div className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-[#1769FF]" />
              <h2 className="text-lg font-black text-[#071B4A] dark:text-white">Latest Updates</h2>
            </div>
            <a href={UEAB_GALLERY_URL} target="_blank" rel="noreferrer" className="text-[11px] font-bold text-[#1769FF] hover:underline dark:text-[#F2B705]">
              View All <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
            </a>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1.55fr_0.85fr]">
            <a href={UEAB_GALLERY_URL} target="_blank" rel="noreferrer" className="group relative hidden min-h-[220px] overflow-hidden rounded-2xl shadow-sm sm:block sm:min-h-[280px]">
              <ImageWithFallback src={IMAGES.baratonNewSignage.url} alt={IMAGES.baratonNewSignage.alt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06163E]/90 via-[#06163E]/15 to-transparent" />
              <span className="absolute left-3 top-3 rounded-full bg-[#1769FF] px-3 py-1 text-[10px] font-black text-white shadow-lg">Campus Life</span>
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <h3 className="text-xl font-black sm:text-2xl">Life at Baraton</h3>
                <p className="mt-1 text-xs text-blue-100">Explore student life, facilities and more at UEAB.</p>
                <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[10px] font-black text-[#071B4A]">Learn More <ArrowRight className="h-3 w-3" /></span>
              </div>
            </a>
            <Link to="/community/events" className="group relative min-h-[220px] overflow-hidden rounded-2xl bg-[#071B4A] shadow-sm sm:min-h-[280px]">
              <ImageWithFallback src={IMAGES.baratonGraduation.url} alt={IMAGES.baratonGraduation.alt} className="h-full w-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06163E] via-[#06163E]/25 to-transparent" />
              <span className="absolute left-3 top-3 rounded-full bg-violet-500 px-3 py-1 text-[10px] font-black text-white">Events</span>
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <h3 className="text-base font-black">Graduation Day at Baraton</h3>
                <p className="mt-1 text-[10px] text-blue-100">Campus moments and upcoming gatherings.</p>
                <span className="mt-4 inline-flex items-center gap-1 text-[10px] font-bold text-[#60A5FA]">View Details <ArrowRight className="h-3 w-3" /></span>
              </div>
            </Link>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-[#E3E8F0] bg-white p-4 shadow-sm dark:border-[#1E3158] dark:bg-[#0C1D3D]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-sm font-black text-[#071B4A] dark:text-white"><CalendarDays className="h-4 w-4 text-[#1769FF]" /> Upcoming Events</h3>
              <Link to="/community/events" className="text-[10px] font-bold text-[#1769FF] dark:text-[#F2B705]">View Calendar <ArrowRight className="ml-1 inline h-3 w-3" /></Link>
            </div>
            <div className="space-y-3">
              {upcomingEvents.length > 0 ? upcomingEvents.map((event) => {
                const date = new Date(event.startTime);
                return (
                  <Link key={event.id} to="/community/events" className="group flex items-center gap-3">
                    <div className="w-10 shrink-0 text-center"><div className="text-sm font-black text-[#1769FF]">{date.toLocaleDateString(undefined, { month: 'short' })}</div><div className="text-lg font-black leading-none text-[#071B4A] dark:text-white">{date.getDate()}</div></div>
                    <div className="min-w-0 border-l border-slate-200 pl-3 dark:border-slate-700"><p className="truncate text-xs font-bold text-[#071B4A] group-hover:text-[#1769FF] dark:text-white dark:group-hover:text-[#F2B705]">{event.title}</p><p className="mt-0.5 truncate text-[10px] text-slate-500 dark:text-slate-400">{event.venueName}</p></div>
                  </Link>
                );
              }) : <p className="text-xs text-slate-500">No upcoming events yet.</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-[#E3E8F0] bg-white p-4 shadow-sm dark:border-[#1E3158] dark:bg-[#0C1D3D]">
            <div className="mb-3 flex items-center justify-between"><h3 className="flex items-center gap-2 text-sm font-black text-[#071B4A] dark:text-white"><Bell className="h-4 w-4 text-[#1769FF]" /> Announcements</h3><Link to="/notifications" className="text-[10px] font-bold text-[#1769FF] dark:text-[#F2B705]">View All <ArrowRight className="ml-1 inline h-3 w-3" /></Link></div>
            <div className="space-y-3">
              {latestNotices.length > 0 ? latestNotices.map((notice) => <Link key={notice.id} to="/notifications" className="block border-b border-slate-100 pb-2 last:border-0 last:pb-0 dark:border-slate-800"><div className="flex items-center justify-between gap-2"><span className={`rounded-full px-2 py-0.5 text-[9px] font-black ${notice.priority === 'urgent' ? 'bg-rose-100 text-rose-700' : notice.priority === 'important' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{notice.priority === 'normal' ? 'New' : notice.priority}</span><span className="text-[9px] text-slate-400">{new Date(notice.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span></div><p className="mt-1 truncate text-xs font-bold text-[#071B4A] dark:text-white">{notice.title}</p><p className="truncate text-[10px] text-slate-500 dark:text-slate-400">{notice.content}</p></Link>) : <p className="text-xs text-slate-500">No announcements yet.</p>}
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
        className="rounded-3xl border border-[#E3E8F0] dark:border-[#1E3158] bg-white dark:bg-[#0C1D3D] p-4 sm:p-6 shadow-sm"
      >
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#1769FF] dark:text-[#60A5FA]">
              Daily overview
            </p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-[#071B4A] dark:text-white">Today's Schedule</h2>
          </div>
          <Link
            to="/campus/timetable"
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-[#1769FF] hover:bg-blue-50 dark:text-[#F2B705] dark:hover:bg-blue-950/40"
          >
            View timetable
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {timetableLoading ? (
          <div className="h-16 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        ) : !hasScannedTimetable ? (
          <div className="rounded-xl border border-dashed border-[#CBD9F5] bg-slate-50 p-4 text-xs text-[#5B6475] dark:border-[#2D4575] dark:bg-slate-800/40 dark:text-slate-300">
            <p>Your schedule will appear here once your timetable has been scanned.</p>
            <Link to="/campus/timetable" className="mt-2 inline-flex font-bold text-[#1769FF] hover:underline dark:text-[#F2B705]">Upload timetable <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
          </div>
        ) : todayClasses.length > 0 ? (
          <div className="relative space-y-3">
            <div className="absolute bottom-5 left-[19px] top-5 w-px bg-blue-100 dark:bg-blue-900/60" aria-hidden="true" />
            {todayClasses
              .map((entry, index) => (
                <Link
                  key={entry.id}
                  to={entry.venueId ? `/campus/map?venue=${encodeURIComponent(entry.venueId)}` : '/campus/timetable'}
                  className={`group relative flex items-center gap-4 rounded-2xl border p-3.5 pl-3 transition-all hover:border-[#8EB4FF] hover:shadow-md ${
                    entry.id === (currentClass?.id ?? (nextClassToday ? upcomingClass?.entry.id : undefined))
                      ? 'border-blue-200 bg-blue-50/60 dark:border-blue-900/70 dark:bg-blue-950/25'
                      : 'border-slate-200 bg-slate-50/70 dark:border-slate-700 dark:bg-slate-800/60'
                  }`}
                >
                  <div className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-4 border-white text-[10px] font-black shadow-sm dark:border-[#0C1D3D] ${entry.id === (currentClass?.id ?? (nextClassToday ? upcomingClass?.entry.id : undefined)) ? 'bg-[#1769FF] text-white' : 'bg-blue-100 text-[#1769FF] dark:bg-blue-900 dark:text-blue-200'}`}>
                    {entry.id === currentClass?.id ? 'Now' : index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] font-black text-[#1769FF] dark:text-blue-300">{entry.unitCode}</span>
                      <span className="text-[10px] font-bold text-[#5B6475] dark:text-slate-400">{formatTimeOnly(entry.startTime)}</span>
                    </div>
                    <p className="mt-1 truncate text-sm font-black text-[#071B4A] dark:text-white">{entry.unitName || 'Course name not identified'}</p>
                    <p className="mt-1 flex items-center gap-1 truncate text-[10px] text-[#5B6475] dark:text-slate-400"><MapPin className="h-3 w-3 shrink-0 text-[#1769FF]" />{entry.venueName || 'Venue not identified'} <span>· {formatTimeOnly(entry.startTime)}–{formatTimeOnly(entry.endTime)}</span></p>
                    {entry.lecturer && <p className="mt-1 truncate text-[10px] text-[#5B6475] dark:text-slate-400">{entry.lecturer}</p>}
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-[#1769FF]" />
                </Link>
              ))}
          </div>
        ) : (
          <p className="rounded-xl bg-slate-50 p-4 text-xs text-[#5B6475] dark:bg-slate-800/60 dark:text-slate-300">
            No classes scheduled today.
          </p>
        )}
      </motion.section>

      {/* 3. Three-Column "Now" Activity Feed */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2"
      >
        {/* Col 1: Approaching Academic Deadlines */}
        <div className="bg-white dark:bg-[#0C1D3D] rounded-2xl border border-[#E3E8F0] dark:border-[#1E3158] p-5 shadow-sm space-y-4 flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1769FF]" />
                <h3 className="font-bold text-sm text-[#071B4A] dark:text-white">
                  Approaching Deadlines
                </h3>
              </div>
              <Link to="/campus/deadlines" className="text-xs font-bold text-[#0B2A6F] dark:text-[#F2B705]">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {urgentDeadlines.map((dl) => {
                const urgency = getDeadlineUrgency(dl.dueDate, dl.isCompleted ?? false);
                return (
                  <div
                    key={dl.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[#071B4A] dark:text-white">
                        {dl.unitCode}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${urgency.badgeBg}`}>
                        {urgency.label}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-[#071B4A] dark:text-white line-clamp-1">
                      {dl.title}
                    </h4>
                    <p className="text-[11px] text-[#5B6475] dark:text-slate-400">
                      Due: {new Date(dl.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {dl.priority} priority
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <Link to="/campus/deadlines" className="pt-2">
            <Button size="sm" variant="secondary" className="w-full text-xs">
              Manage Academic Tasks
            </Button>
          </Link>
        </div>

        {/* Col 2: Off-Campus House Find */}
        <div className="bg-white dark:bg-[#0C1D3D] rounded-2xl border border-[#E3E8F0] dark:border-[#1E3158] p-5 shadow-sm space-y-4 flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-[#1769FF]" />
                <h3 className="font-bold text-sm text-[#071B4A] dark:text-white">
                  Nearby rental
                </h3>
              </div>
              <Link to="/housing" className="text-xs font-bold text-[#0B2A6F] dark:text-[#F2B705]">
                14 Rentals
              </Link>
            </div>

            {featuredHouse && (
              <div className="space-y-2">
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/60 dark:bg-amber-950/20">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase text-[#0B2A6F] dark:text-[#F2B705]">
                      {featuredHouse.area}
                    </span>
                    <span className="text-[10px] font-bold text-[#5B6475] dark:text-slate-400">
                      {featuredHouse.walkingMinutes} min walk to gate
                    </span>
                  </div>
                  <h4 className="mt-2 font-bold text-sm text-[#071B4A] dark:text-white">
                    {featuredHouse.title}
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#0B2A6F] dark:text-[#F2B705]">
                      KES {featuredHouse.priceMonthlyKes.toLocaleString()}/mo
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link to={`/housing/${featuredHouse?.id}`} className="pt-2">
            <Button size="sm" variant="gold" className="w-full text-xs font-bold">
              View Rental Details
            </Button>
          </Link>
        </div>

        {/* Col 3: Upcoming campus event */}
        <div className="bg-white dark:bg-[#0C1D3D] rounded-2xl border border-[#E3E8F0] dark:border-[#1E3158] p-5 shadow-sm space-y-4 flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#1769FF]" />
                <h3 className="font-bold text-sm text-[#071B4A] dark:text-white">
                  Upcoming campus event
                </h3>
              </div>
              <Link to="/community/events" className="text-xs font-bold text-[#0B2A6F] dark:text-[#F2B705]">
                Events
              </Link>
            </div>

            {featuredEvent && (
              <div className="space-y-2">
                <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 dark:border-blue-900/60 dark:bg-blue-950/20">
                  <div className="text-[10px] font-bold uppercase text-[#0B2A6F] dark:text-blue-300">
                    {featuredEvent.category}
                  </div>
                  <h4 className="mt-2 font-bold text-sm text-[#071B4A] dark:text-white line-clamp-2">
                    {featuredEvent.title}
                  </h4>
                  <div className="text-[10px] font-bold text-[#5B6475] dark:text-slate-400">
                    {new Date(featuredEvent.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {new Date(featuredEvent.startTime).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {featuredEvent.venueName}
                  </p>
                </div>
              </div>
            )}
          </div>

          <Link to="/community/events" className="pt-2">
            <Button size="sm" variant="primary" className="w-full text-xs font-semibold">
              View event details
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div
        variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-dashed border-[#0B2A6F]/30 bg-blue-50/50 px-4 py-3 dark:border-blue-400/30 dark:bg-blue-950/20"
      >
        <p className="text-xs text-[#5B6475] dark:text-slate-300">
          Campus photos and official university updates are available from UEAB.
        </p>
        <a
          href={UEAB_GALLERY_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2A6F] hover:underline dark:text-[#F2B705]"
        >
          Open official gallery
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </motion.div>
    </motion.div>
  );
};
