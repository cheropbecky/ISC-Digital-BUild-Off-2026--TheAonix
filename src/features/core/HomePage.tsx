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

import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useKampasStore } from '../../lib/store';
import { getDeadlineUrgency } from '../../data/deadlines';
import { HOUSES } from '../../data/houses';
import { IMAGES } from '../../data/images';
import { ImageWithFallback } from '../../components/ui/ImageWithFallback';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatTimeOnly } from '../../lib/utils';
import {
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Sparkles,
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
  const {
    user,
    notifications,
    timetable,
    timetableLoading,
    deadlines,
    events,
  } = useKampasStore();

  // Select the next scheduled class from the same data source as the timetable page.
  const now = new Date();
  const currentDay = now.getDay() >= 1 && now.getDay() <= 5 ? now.getDay() : 1;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const nextClass = [...timetable]
    .filter((entry) => entry.dayOfWeek === currentDay && entry.endTime > `${String(Math.floor(currentMinutes / 60)).padStart(2, '0')}:${String(currentMinutes % 60).padStart(2, '0')}`)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))[0]
    ?? [...timetable]
      .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime))[0];

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

  const todayClasses = timetable.filter((entry) => entry.dayOfWeek === currentDay);
  const todayLabel = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(now);
  const unreadNotifications = notifications.filter((notification) => !notification.isRead).length;
  const dashboardStats = [
    { label: 'Classes today', value: todayClasses.length, icon: Calendar, href: '/campus/timetable', color: 'text-[#0B2A6F] dark:text-blue-300' },
    { label: 'Open tasks', value: urgentDeadlines.length, icon: AlertTriangle, href: '/campus/deadlines', color: 'text-amber-600 dark:text-amber-300' },
    { label: 'Unread updates', value: unreadNotifications, icon: Bell, href: '/notifications', color: 'text-rose-600 dark:text-rose-300' },
  ];

  const handleRouteToNextClass = () => {
    if (nextClass?.venueId) {
      navigate(`/campus/map?venue=${encodeURIComponent(nextClass.venueId)}`);
    }
  };

  return (
    <motion.div
      className="space-y-6"
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
        className="relative isolate overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-gradient-to-br from-[#071B4A] via-[#0B2A6F] to-[#16459E] text-white p-5 sm:p-7 rounded-3xl shadow-lg border border-[#F2B705]/30"
      >
        <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full border-[24px] border-[#F2B705]/10" />
        <div className="pointer-events-none absolute -bottom-24 right-24 h-44 w-44 rounded-full bg-[#F2B705]/10 blur-2xl" />
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-100 mb-2">
            <Sun className="w-3.5 h-3.5 text-[#F2B705]" />
            {todayLabel}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user.fullName.split(' ')[0]}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            {user.course || 'BSc Software Engineering'} • Year 3, 1st Trimester 2026/27
          </p>
        </div>

        {/* Quick Actions Strip */}
        <div className="relative flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="gold"
            onClick={handleRouteToNextClass}
            className="text-xs font-bold"
          >
            <Footprints className="w-3.5 h-3.5 mr-1" />
            Route to Next Class
          </Button>
          <Link to="/housing">
            <Button
              size="sm"
              variant="secondary"
              className="text-xs border-white/40 text-white hover:bg-white/10 dark:text-white"
            >
              <Home className="w-3.5 h-3.5 mr-1 text-[#F2B705]" />
              House Find
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div
        variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        {dashboardStats.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={label}
            to={href}
            className="group flex items-center justify-between rounded-2xl border border-[#E3E8F0] dark:border-[#1E3158] bg-white dark:bg-[#0C1D3D] px-4 py-3.5 transition-all hover:-translate-y-0.5 hover:border-[#F2B705] hover:shadow-md"
          >
            <span className="flex items-center gap-3">
              <span className={`rounded-lg bg-slate-100 dark:bg-slate-800 p-2 ${color}`}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-xs font-semibold text-[#5B6475] dark:text-slate-300">{label}</span>
            </span>
            <span className="flex items-center gap-2 text-lg font-black text-[#071B4A] dark:text-white">
              {value}
              <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </motion.div>

      <motion.section
        variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
        className="overflow-hidden rounded-2xl border border-[#E3E8F0] bg-white shadow-sm dark:border-[#1E3158] dark:bg-[#0C1D3D]"
      >
        <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-4 sm:px-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0B2A6F] dark:text-[#F2B705]">
              Around campus
            </p>
            <h2 className="text-base font-black text-[#071B4A] dark:text-white">Life at Baraton</h2>
          </div>
          <a
            href={UEAB_GALLERY_URL}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-[#0B2A6F] hover:underline dark:text-[#F2B705]"
          >
            Official gallery
          </a>
        </div>
        <div className="grid grid-cols-2 gap-2 px-4 pb-4 sm:px-5">
          <div className="relative min-h-44 overflow-hidden rounded-xl sm:min-h-56">
            <ImageWithFallback
              src={IMAGES.baratonNewSignage.url}
              alt={IMAGES.baratonNewSignage.alt}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071B4A]/90 to-transparent px-3 pb-3 pt-8 text-[11px] font-bold text-white">
              Research and learning
            </div>
          </div>
          <div className="relative min-h-44 overflow-hidden rounded-xl sm:min-h-56">
            <ImageWithFallback
              src={IMAGES.baratonGraduation.url}
              alt={IMAGES.baratonGraduation.alt}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071B4A]/90 to-transparent px-3 pb-3 pt-8 text-[11px] font-bold text-white">
              Graduation day at Baraton
            </div>
          </div>
        </div>
        <p className="px-4 pb-4 text-[10px] text-[#5B6475] dark:text-slate-400 sm:px-5">
          Images from the official University of Eastern Africa, Baraton website.
        </p>
      </motion.section>

      <motion.section
        variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
        className="rounded-2xl border border-[#E3E8F0] dark:border-[#1E3158] bg-white dark:bg-[#0C1D3D] p-4 sm:p-5 shadow-sm"
      >
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0B2A6F] dark:text-[#F2B705]">
              Daily overview
            </p>
            <h2 className="text-base font-black text-[#071B4A] dark:text-white">Today at Baraton</h2>
          </div>
          <Link
            to="/campus/timetable"
            className="flex items-center gap-1 text-xs font-bold text-[#0B2A6F] dark:text-[#F2B705] hover:underline"
          >
            View timetable
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {timetableLoading ? (
          <div className="h-16 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        ) : todayClasses.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {todayClasses
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map((entry, index) => (
                <Link
                  key={entry.id}
                  to={`/campus/map?venue=${encodeURIComponent(entry.venueId)}`}
                  className={`group min-w-[220px] flex-1 rounded-xl border p-3 transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    index === 0
                      ? 'border-[#F2B705]/60 bg-[#FFF9E6] dark:bg-[#3A2D04]/40'
                      : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[10px] font-black text-[#0B2A6F] dark:text-blue-300">
                      {entry.unitCode}
                    </span>
                    <span className="text-[10px] font-bold text-[#5B6475] dark:text-slate-400">
                      {formatTimeOnly(entry.startTime)}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#071B4A] dark:text-white line-clamp-1">{entry.unitName}</p>
                  <p className="mt-1 flex items-center gap-1 text-[10px] text-[#5B6475] dark:text-slate-400">
                    <MapPin className="w-3 h-3 text-[#0B2A6F] dark:text-[#F2B705]" />
                    {entry.venueName}
                  </p>
                </Link>
              ))}
          </div>
        ) : (
          <p className="rounded-xl bg-slate-50 p-4 text-xs text-[#5B6475] dark:bg-slate-800/60 dark:text-slate-300">
            No classes scheduled today. Use the extra time to catch up on your open tasks.
          </p>
        )}
      </motion.section>

      {/* 2. Top "Now & Next" Priority Action Card */}
      {nextClass && !timetableLoading && (
        <motion.div
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
          className="relative overflow-hidden bg-gradient-to-r from-white to-blue-50/60 dark:from-[#0C1D3D] dark:to-[#102955] rounded-2xl border-2 border-[#0B2A6F]/20 dark:border-[#F2B705]/30 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-[#0B2A6F] text-[#F2B705] flex flex-col items-center justify-center shrink-0 font-mono font-bold leading-none shadow-xs">
              <span className="text-xs">NEXT</span>
              <span className="text-[10px] text-slate-300 mt-0.5">CLASS</span>
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono font-extrabold text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300">
                  {nextClass.unitCode}
                </span>
                <span className="font-extrabold text-sm sm:text-base text-[#071B4A] dark:text-white truncate">
                  {nextClass.unitName}
                </span>
                {nextClass.isVenueChanged && (
                  <Badge variant="urgent" showDot>
                    Venue Relocated!
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#5B6475] dark:text-slate-300">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatTimeOnly(nextClass.startTime)} – {formatTimeOnly(nextClass.endTime)}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-[#071B4A] dark:text-slate-200">
                  <MapPin className="w-3.5 h-3.5 text-[#0B2A6F] dark:text-[#F2B705]" />
                  <span>{nextClass.venueName}</span>
                </span>
                <span>•</span>
                <span>Lecturer: {nextClass.lecturerName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
            <Button
              size="sm"
              variant="gold"
              onClick={handleRouteToNextClass}
              className="text-xs font-bold"
            >
              <Navigation className="w-3.5 h-3.5 mr-1" />
              One-Tap Route Guide
            </Button>
            <Link to="/campus/timetable">
              <Button size="sm" variant="secondary" className="text-xs">
                Full Timetable
              </Button>
            </Link>
          </div>
        </motion.div>
      )}

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
                <Calendar className="w-4 h-4 text-[#DC2626]" />
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
                <Home className="w-4 h-4 text-[#D97706]" />
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
                <Sparkles className="w-4 h-4 text-[#F2B705]" />
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
