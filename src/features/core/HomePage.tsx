/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Home Page
 * - Real functional campus map with layer chips: Venues, Events now, My route, Lost items, Houses (NO free rooms!)
 * - One-tap "Route to Next Class"
 * - Live "Now" feed ranked by time:
 *   - Next class in session with venue door preview
 *   - Urgent deadlines & CATs
 *   - Off-campus housing spotlight
 *   - Community event RSVP
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useKampasStore } from '../../lib/store';
import { CampusMap } from '../../components/map/CampusMap';
import { TIMETABLE_ENTRIES } from '../../data/timetable';
import { DEADLINES, getDeadlineUrgency } from '../../data/deadlines';
import { HOUSES } from '../../data/houses';
import { CAMPUS_EVENTS } from '../../data/community';
import { VENUES } from '../../data/venues';
import { ImageWithFallback } from '../../components/ui/ImageWithFallback';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  ArrowRight,
  FileUp,
  Sparkles,
  CheckCircle2,
  Navigation,
  Compass,
  Footprints,
  Home,
  ShieldCheck,
  Building,
  Bell,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, notifications } = useKampasStore();

  const [highlightVenueId, setHighlightVenueId] = useState<string | undefined>(undefined);
  const [showRouteVenueId, setShowRouteVenueId] = useState<string | undefined>(undefined);

  // Next class logic: Next class today for student
  const nextClass = TIMETABLE_ENTRIES[0]; // e.g. COSC 311 or relocated MATH 201
  const targetVenue = VENUES.find((v) => v.id === nextClass?.venueId || v.code === nextClass?.venueCode);

  // Urgent deadlines
  const urgentDeadlines = DEADLINES.filter((d) => !d.isCompleted).slice(0, 2);

  // Featured house listing
  const featuredHouse = HOUSES[0];

  // Featured upcoming event
  const featuredEvent = CAMPUS_EVENTS[0];

  const handleRouteToNextClass = () => {
    if (nextClass?.venueId) {
      setShowRouteVenueId(nextClass.venueId);
      // Smooth scroll down to map if on mobile
      const mapEl = document.getElementById('home-campus-map');
      if (mapEl) {
        mapEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Welcome Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#071B4A] to-[#0B2A6F] text-white p-5 sm:p-6 rounded-2xl shadow-md border border-[#F2B705]/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-[#F2B705] tracking-wide uppercase">
              University of Eastern Africa, Baraton
            </span>
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Welcome back, {user.fullName.split(' ')[0]}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            {user.course || 'BSc Software Engineering'} • Year 3, 1st Trimester 2026/27
          </p>
        </div>

        {/* Quick Actions Strip */}
        <div className="flex items-center gap-2 shrink-0">
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
      </div>

      {/* 2. Top "Now & Next" Priority Action Card */}
      {nextClass && (
        <div className="bg-white dark:bg-[#0C1D3D] rounded-2xl border-2 border-[#0B2A6F]/20 dark:border-[#F2B705]/30 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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
                {nextClass.isRelocated && (
                  <Badge variant="urgent" showDot>
                    Venue Relocated!
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#5B6475] dark:text-slate-300">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{nextClass.timeFormatted}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-[#071B4A] dark:text-slate-200">
                  <MapPin className="w-3.5 h-3.5 text-[#0B2A6F] dark:text-[#F2B705]" />
                  <span>{nextClass.venueName} ({nextClass.venueCode})</span>
                </span>
                <span>•</span>
                <span>Lecturer: {nextClass.lecturer}</span>
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
        </div>
      )}

      {/* 3. Real Interactive Campus Map */}
      <div id="home-campus-map" className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#071B4A] dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#0B2A6F] dark:text-[#F2B705]" />
              <span>Baraton Live Campus GIS Map</span>
            </h2>
            <p className="text-xs text-[#5B6475] dark:text-slate-300">
              Select venue pins for door entrance guide, or filter by off-campus rentals and campus events.
            </p>
          </div>

          <Link to="/campus/map" className="text-xs font-bold text-[#0B2A6F] dark:text-[#F2B705] hover:underline flex items-center gap-1">
            <span>Expanded Map View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <CampusMap
          highlightVenueId={highlightVenueId}
          showRouteToVenueId={showRouteVenueId}
          className="h-[440px] sm:h-[480px] w-full"
        />
      </div>

      {/* 4. Three-Column "Now" Activity Feed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* Col 1: Approaching Academic Deadlines */}
        <div className="bg-white dark:bg-[#0C1D3D] rounded-2xl border border-[#E3E8F0] dark:border-[#1E3158] p-5 shadow-xs space-y-4 flex flex-col justify-between">
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
                const urgency = getDeadlineUrgency(dl.dueDate, dl.isCompleted);
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
                      Due: {dl.dueDate} at {dl.dueTime} • {dl.submissionType}
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

        {/* Col 2: Off-Campus House Find Spotlight */}
        <div className="bg-white dark:bg-[#0C1D3D] rounded-2xl border border-[#E3E8F0] dark:border-[#1E3158] p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-[#D97706]" />
                <h3 className="font-bold text-sm text-[#071B4A] dark:text-white">
                  House Find Spotlight
                </h3>
              </div>
              <Link to="/housing" className="text-xs font-bold text-[#0B2A6F] dark:text-[#F2B705]">
                14 Rentals
              </Link>
            </div>

            {featuredHouse && (
              <div className="space-y-2">
                <div className="aspect-16/9 rounded-xl overflow-hidden relative">
                  <ImageWithFallback
                    src={featuredHouse.photos[0]}
                    alt={featuredHouse.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-[#0B2A6F]/90 backdrop-blur-xs text-[#F2B705] text-[10px] font-black px-2 py-0.5 rounded">
                    Verified
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded">
                    {featuredHouse.walkingMinutes} min walk to Gate
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#0B2A6F] dark:text-[#F2B705] uppercase">
                      {featuredHouse.area}
                    </span>
                    <span className="text-xs font-black text-[#0B2A6F] dark:text-[#F2B705]">
                      KES {featuredHouse.priceMonthlyKes.toLocaleString()}/mo
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-[#071B4A] dark:text-white line-clamp-1">
                    {featuredHouse.title}
                  </h4>
                  <p className="text-[11px] text-[#5B6475] dark:text-slate-400 line-clamp-1">
                    💧 Borehole 24/7 • 📶 Fast Wi-Fi • 🛡 Security Guard
                  </p>
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

        {/* Col 3: Community & Vespers Spotlight */}
        <div className="bg-white dark:bg-[#0C1D3D] rounded-2xl border border-[#E3E8F0] dark:border-[#1E3158] p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F2B705]" />
                <h3 className="font-bold text-sm text-[#071B4A] dark:text-white">
                  Featured Campus Event
                </h3>
              </div>
              <Link to="/community/events" className="text-xs font-bold text-[#0B2A6F] dark:text-[#F2B705]">
                Events
              </Link>
            </div>

            {featuredEvent && (
              <div className="space-y-2">
                <div className="aspect-16/9 rounded-xl overflow-hidden relative">
                  <ImageWithFallback
                    src={featuredEvent.bannerPhoto}
                    alt={featuredEvent.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-[#F2B705] text-[#071B4A] text-[10px] font-black px-2 py-0.5 rounded">
                    {featuredEvent.category}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-[#5B6475] dark:text-slate-400">
                    {featuredEvent.date} • {featuredEvent.timeFormatted}
                  </div>
                  <h4 className="font-bold text-xs text-[#071B4A] dark:text-white line-clamp-1">
                    {featuredEvent.title}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    📍 {featuredEvent.venueName} ({featuredEvent.venueCode})
                  </p>
                </div>
              </div>
            )}
          </div>

          <Link to="/community/events" className="pt-2">
            <Button size="sm" variant="primary" className="w-full text-xs font-semibold">
              Get Free QR Event Pass
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
