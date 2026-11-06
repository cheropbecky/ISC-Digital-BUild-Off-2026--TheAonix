/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Home Page
 * Live campus map with layers (events now, free rooms, my route, lost items)
 * plus the "Now" feed ranked by time
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useKampasStore } from '../../lib/store';
import { CampusMap } from '../../components/map/CampusMap';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  ArrowRight,
  DoorOpen,
  FileUp,
  Sparkles,
  CheckCircle2,
  Navigation,
  Compass,
} from 'lucide-react';
import { formatTimeOnly, getDaysRemaining } from '../../lib/utils';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    timetable,
    deadlines,
    venues,
    events,
    notices,
    acknowledgeNotice,
  } = useKampasStore();

  const [highlightVenueId, setHighlightVenueId] = useState<string | undefined>(undefined);
  const [showRouteVenueId, setShowRouteVenueId] = useState<string | undefined>(undefined);

  // Compute "Now" events & classes
  const now = new Date();
  const currentDay = now.getDay() === 0 ? 7 : now.getDay();
  const todayClasses = timetable
    .filter((e) => e.dayOfWeek === currentDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Urgent notice requiring acknowledgment
  const pendingNotice = notices.find((n) => n.requiresAcknowledgement && !n.isAcknowledged);

  // Upcoming deadlines
  const urgentDeadlines = deadlines.filter((d) => !d.isCompleted).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#071B4A] to-[#0B2A6F] text-white p-5 sm:p-6 rounded-2xl shadow-md border border-[#F2B705]/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-[#F2B705] tracking-wide uppercase">
              University of Eastern Africa, Baraton
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Welcome back, {user.fullName.split(' ')[0]}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            {user.course || 'BSc Software Engineering'} • Year {user.yearOfStudy || 3}, Trimester {user.semester || 1}
          </p>
        </div>

        {/* Quick Actions Strip */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="gold"
            onClick={() => navigate('/campus/free-rooms')}
            className="text-xs"
          >
            <DoorOpen className="w-3.5 h-3.5 mr-1" />
            Find Free Room
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate('/share/upload')}
            className="text-xs border-white/40 text-white hover:bg-white/10 dark:text-white"
          >
            <FileUp className="w-3.5 h-3.5 mr-1" />
            Upload Notes
          </Button>
        </div>
      </div>

      {/* Official Notice Acknowledgment Card (if pending) */}
      {pendingNotice && (
        <Card className="border-l-4 border-l-[#DC2626] bg-[#FEF2F2] dark:bg-[#7F1D1D]/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#071B4A] dark:text-white">
                    {pendingNotice.title}
                  </span>
                  <Badge variant="urgent">MANDATORY NOTICE</Badge>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                  {pendingNotice.content}
                </p>
                <div className="text-[10px] text-slate-500 mt-1">
                  Posted by {pendingNotice.posterName}
                </div>
              </div>
            </div>
            <Button
              size="sm"
              variant="primary"
              onClick={() => acknowledgeNotice(pendingNotice.id)}
              className="shrink-0 text-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Acknowledge & Sign
            </Button>
          </div>
        </Card>
      )}

      {/* Grid: Live Campus Map (Left 7 cols) & "Now" Feed (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Live Campus Map with Interactive Layers */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#071B4A] dark:text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#0B2A6F] dark:text-[#F2B705]" />
                Live Baraton Campus Map
              </h2>
              <p className="text-xs text-[#5B6475] dark:text-slate-400">
                Interactive Leaflet satellite with free rooms, indoor directions & pins
              </p>
            </div>
            <Link
              to="/campus/venues/all"
              className="text-xs text-[#0B2A6F] dark:text-[#93C5FD] font-semibold hover:underline flex items-center"
            >
              All Venues <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <CampusMap
            highlightVenueId={highlightVenueId}
            showRouteToVenueId={showRouteVenueId}
            className="h-[460px] w-full"
          />
        </div>

        {/* The "Now" Feed: Ranked Chronologically */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#071B4A] dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#0B2A6F] dark:text-[#F2B705]" />
              The "Now" Feed
            </h2>
            <Link
              to="/campus/timetable"
              className="text-xs text-[#0B2A6F] dark:text-[#93C5FD] font-semibold hover:underline flex items-center"
            >
              Full Timetable <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {/* Today's Schedule Card */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold text-[#071B4A] dark:text-white">
                TODAY'S LECTURES
              </span>
              <span className="text-[11px] font-semibold text-[#5B6475] dark:text-slate-400">
                {todayClasses.length} Scheduled
              </span>
            </div>

            {todayClasses.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">
                No lectures scheduled for today. Enjoy your private study time!
              </div>
            ) : (
              <div className="space-y-3">
                {todayClasses.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-lg border transition-all ${
                      item.isVenueChanged
                        ? 'border-[#DC2626]/40 bg-red-50/50 dark:bg-red-950/20'
                        : 'border-[#E3E8F0] dark:border-slate-800 hover:border-blue-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#0B2A6F] dark:text-[#93C5FD]">
                            {item.unitCode}
                          </span>
                          {item.isVenueChanged && (
                            <Badge variant="urgent">VENUE CHANGED</Badge>
                          )}
                        </div>
                        <h4 className="text-xs font-semibold text-[#071B4A] dark:text-white mt-0.5 line-clamp-1">
                          {item.unitName}
                        </h4>
                      </div>
                      <span className="text-xs font-bold font-mono text-[#071B4A] dark:text-slate-200 shrink-0">
                        {formatTimeOnly(item.startTime)} - {formatTimeOnly(item.endTime)}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{item.venueName}</span>
                      </div>
                      <button
                        onClick={() => {
                          setHighlightVenueId(item.venueId);
                          setShowRouteVenueId(item.venueId);
                        }}
                        className="text-[11px] font-semibold text-[#0B2A6F] dark:text-[#F2B705] hover:underline flex items-center shrink-0"
                      >
                        <Navigation className="w-3 h-3 mr-1" />
                        Directions
                      </button>
                    </div>

                    {item.isVenueChanged && item.venueChangeNote && (
                      <p className="mt-2 text-[11px] text-[#DC2626] bg-red-100/60 dark:bg-red-900/30 p-2 rounded leading-tight">
                        Note: {item.venueChangeNote}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Upcoming Academic Deadlines */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold text-[#071B4A] dark:text-white">
                CRITICAL DEADLINES
              </span>
              <Link
                to="/campus/deadlines"
                className="text-[11px] font-semibold text-[#0B2A6F] dark:text-[#93C5FD] hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="space-y-2.5">
              {urgentDeadlines.map((dl) => {
                const daysInfo = getDaysRemaining(dl.dueDate);
                return (
                  <div
                    key={dl.id}
                    className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[#071B4A] dark:text-white truncate">
                        {dl.title}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {dl.unitCode ? `${dl.unitCode} • ` : ''}Due {new Date(dl.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge
                      variant={
                        daysInfo.status === 'urgent'
                          ? 'urgent'
                          : daysInfo.status === 'warning'
                          ? 'soon'
                          : 'neutral'
                      }
                      showDot
                    >
                      {daysInfo.label}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
