/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Free Room Finder (/campus/free-rooms)
 * Computed in real-time from timetable entries
 * Filter by capacity, building, and facilities
 * Ties directly into Demo Flow 3 (Study Session Booking)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKampasStore } from '../../lib/store';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  DoorOpen,
  Users,
  CheckCircle2,
  Clock,
  Filter,
  Zap,
  Tv,
  Wifi,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { Venue } from '../../lib/types';

export const FreeRoomsPage: React.FC = () => {
  const navigate = useNavigate();
  const { venues, timetable, units, studyGroups, bookGroupSession } = useKampasStore();

  const [capacityFilter, setCapacityFilter] = useState<number>(0);
  const [requireSockets, setRequireSockets] = useState(false);
  const [requireProjector, setRequireProjector] = useState(false);
  const [bookingVenue, setBookingVenue] = useState<Venue | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState(studyGroups[0]?.id || '');
  const [sessionTitle, setSessionTitle] = useState('Compiler AST & Parser Sprint');
  const [sessionTime, setSessionTime] = useState('16:00');

  // Compute busy rooms right now
  const now = new Date();
  const currentDay = now.getDay() === 0 ? 7 : now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const busyVenueMap = new Map<string, string>(); // venueId -> unitCode
  timetable.forEach((entry) => {
    if (entry.dayOfWeek === currentDay) {
      const [startH, startM] = entry.startTime.split(':').map(Number);
      const [endH, endM] = entry.endTime.split(':').map(Number);
      const start = startH * 60 + startM;
      const end = endH * 60 + endM;
      if (currentMinutes >= start && currentMinutes <= end) {
        busyVenueMap.set(entry.venueId, `${entry.unitCode} (${entry.unitName})`);
      }
    }
  });

  const freeVenues = venues.filter((v) => {
    const isBusy = busyVenueMap.has(v.id);
    if (isBusy) return false;
    if (capacityFilter > 0 && v.capacity < capacityFilter) return false;
    if (requireSockets && !v.hasPowerSockets) return false;
    if (requireProjector && !v.hasProjector) return false;
    return true;
  });

  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingVenue || !selectedGroupId) return;

    bookGroupSession(selectedGroupId, {
      title: sessionTitle,
      venueName: `${bookingVenue.name} (${bookingVenue.floor})`,
      date: new Date().toISOString().split('T')[0],
      startTime: sessionTime,
      endTime: `${Number(sessionTime.split(':')[0]) + 2}:00`,
    });

    setBookingVenue(null);
    navigate('/share/groups');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#071B4A] dark:text-white">
              Free Room Detector
            </h1>
            <Badge variant="done" showDot>
              {freeVenues.length} Rooms Available Right Now
            </Badge>
          </div>
          <p className="text-xs text-[#5B6475] dark:text-slate-400 mt-1">
            Computed in real-time from active timetable schedules across Baraton campus lecture blocks.
          </p>
        </div>

        <Button
          size="sm"
          variant="secondary"
          onClick={() => navigate('/share/groups')}
          className="text-xs"
        >
          View My Study Groups
        </Button>
      </div>

      {/* Filter Controls Bar */}
      <Card padding="sm" className="flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="font-bold text-slate-700 dark:text-slate-200">Min Capacity:</span>
          <select
            value={capacityFilter}
            onChange={(e) => setCapacityFilter(Number(e.target.value))}
            className="h-8 px-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
          >
            <option value={0}>Any Size</option>
            <option value={40}>40+ Seats</option>
            <option value={80}>80+ Seats</option>
            <option value={150}>150+ Seats</option>
          </select>
        </div>

        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={requireSockets}
            onChange={(e) => setRequireSockets(e.target.checked)}
            className="rounded text-[#0B2A6F]"
          />
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Power Sockets</span>
        </label>

        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={requireProjector}
            onChange={(e) => setRequireProjector(e.target.checked)}
            className="rounded text-[#0B2A6F]"
          />
          <Tv className="w-3.5 h-3.5 text-blue-500" />
          <span>Projector Ready</span>
        </label>
      </Card>

      {/* Free Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {freeVenues.map((v) => (
          <Card key={v.id} padding="md" className="flex flex-col justify-between hover:border-[#16A34A]/50 transition">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <Badge variant="done" showDot className="mb-1">
                    Free until 18:00
                  </Badge>
                  <h3 className="text-base font-bold text-[#071B4A] dark:text-white line-clamp-1">
                    {v.name}
                  </h3>
                </div>
                <Badge variant="academic">
                  <Users className="w-3 h-3 mr-1 inline" />
                  {v.capacity}
                </Badge>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                {v.building} • {v.floor}
              </div>

              <div className="p-2.5 rounded-lg bg-[#DCFCE7]/30 dark:bg-emerald-950/20 border border-[#16A34A]/20 text-[11px] text-emerald-800 dark:text-emerald-300 mb-4">
                <strong>Recommended for: </strong> Peer discussions, group revisions, laptop presentations.
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={() => setBookingVenue(v)}
                className="flex-1 text-xs"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1 text-[#F2B705]" />
                Book Study Session
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Book Study Session Modal (Demo Flow 3) */}
      {bookingVenue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#0C1D3D] rounded-2xl max-w-md w-full p-6 text-slate-900 dark:text-white shadow-2xl">
            <h3 className="text-lg font-bold mb-1">Book Free Room for Study Session</h3>
            <p className="text-xs text-slate-500 mb-4">
              Booking <strong>{bookingVenue.name}</strong> will reserve this space and automatically notify all members of your study group.
            </p>

            <form onSubmit={handleBookSession} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">Study Group</label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                  required
                >
                  {studyGroups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.unitCode}) - {g.memberCount} members
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Session Topic / Title</label>
                <input
                  type="text"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  placeholder="e.g. Midterm revision on Compiler Grammar"
                  required
                  className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Start Time</label>
                  <input
                    type="time"
                    value={sessionTime}
                    onChange={(e) => setSessionTime(e.target.value)}
                    required
                    className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Duration</label>
                  <div className="h-11 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                    2 Hours Slot
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setBookingVenue(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Confirm & Notify Members
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
