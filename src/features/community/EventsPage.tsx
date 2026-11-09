/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Campus Events & Chapel Fellowship (/community/events)
 * Features: RSVP, waiting list, interactive QR check-in
 */

import React, { useState } from 'react';
import { useKampasStore } from '../../lib/store';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Compass,
  Calendar,
  MapPin,
  Users,
  QrCode,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { formatDateTime } from '../../lib/utils';
import { CampusEvent } from '../../lib/types';

export const EventsPage: React.FC = () => {
  const { events, toggleEventRSVP, checkInEvent, user } = useKampasStore();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [qrModalEvent, setQrModalEvent] = useState<CampusEvent | null>(null);

  const filteredEvents = events.filter((e) => {
    if (activeCategory === 'all') return true;
    return e.category === activeCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#071B4A] dark:text-white">
              Campus Events & Chapel
            </h1>
            <Badge variant="academic">Baraton Life</Badge>
          </div>
          <p className="text-xs text-[#5B6475] dark:text-slate-400 mt-1">
            Academic hackathons, Sabbath vespers, inter-faculty athletics, and career fairs.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['all', 'academic', 'chapel', 'sports', 'career', 'social'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition ${
                activeCategory === cat
                  ? 'bg-[#0B2A6F] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} padding="none" hoverable className="overflow-hidden flex flex-col justify-between">
            {/* Event Poster Header */}
            <div className="relative h-44 bg-slate-900 overflow-hidden">
              {event.posterUrl ? (
                <img
                  src={event.posterUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#071B4A] to-[#0B2A6F] flex items-center justify-center p-6 text-center">
                  <Compass className="w-12 h-12 text-[#F2B705]/40" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute top-3 left-3">
                <Badge variant="academic" className="bg-white/90 text-[#071B4A] font-bold">
                  {event.category.toUpperCase()}
                </Badge>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="text-[11px] font-semibold text-[#F2B705] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatDateTime(event.startTime)}</span>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-[#071B4A] dark:text-white leading-snug mb-2">
                  {event.title}
                </h3>
                <p className="text-xs text-[#5B6475] dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
                  {event.description}
                </p>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 mb-4">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0B2A6F] dark:text-[#F2B705] shrink-0" />
                    <span className="font-semibold truncate">{event.venueName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Users className="w-3.5 h-3.5 shrink-0" />
                    <span>Organized by {event.organizerName}</span>
                  </div>
                </div>
              </div>

              {/* Attendance & Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="text-[11px] font-semibold text-slate-500">
                  <span className="font-bold text-[#16A34A]">{event.currentRsvps}</span> attending
                  {event.maxCapacity && <span> / {event.maxCapacity} cap</span>}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={event.isRsvpd ? 'secondary' : 'primary'}
                    onClick={() => toggleEventRSVP(event.id)}
                    className="text-xs"
                  >
                    {event.isRsvpd ? 'Attending ✓' : 'RSVP Now'}
                  </Button>

                  {event.isRsvpd && (
                    <button
                      onClick={() => setQrModalEvent(event)}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#071B4A] dark:text-white hover:bg-slate-200 transition"
                      title="Show Check-in QR Code"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* QR Check-in Dialog Modal */}
      {qrModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#0C1D3D] rounded-2xl max-w-sm w-full p-6 text-slate-900 dark:text-white shadow-2xl text-center">
            <h3 className="text-lg font-bold mb-1">Event Entry Pass</h3>
            <p className="text-xs text-slate-500 mb-4">{qrModalEvent.title}</p>

            {/* Generated QR Mock Box */}
            <div className="w-48 h-48 bg-white p-3 rounded-xl border-2 border-[#0B2A6F] mx-auto mb-4 flex flex-col items-center justify-center shadow-md">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect x="10" y="10" width="25" height="25" fill="#071B4A" />
                <rect x="65" y="10" width="25" height="25" fill="#071B4A" />
                <rect x="10" y="65" width="25" height="25" fill="#071B4A" />
                <rect x="15" y="15" width="15" height="15" fill="#FFFFFF" />
                <rect x="70" y="15" width="15" height="15" fill="#FFFFFF" />
                <rect x="15" y="70" width="15" height="15" fill="#FFFFFF" />
                <rect x="42" y="20" width="8" height="20" fill="#0B2A6F" />
                <rect x="42" y="50" width="16" height="8" fill="#F2B705" />
                <rect x="42" y="65" width="8" height="15" fill="#0B2A6F" />
                <rect x="70" y="45" width="15" height="15" fill="#0B2A6F" />
              </svg>
              <div className="text-[10px] font-mono text-slate-600 mt-1 font-bold">
                {qrModalEvent.qrCodeSecret}
              </div>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 mb-4">
              Hold this screen to the scanner at the venue entrance desk for instantaneous check-in.
            </div>

            <div className="space-y-2">
              <Button
                variant="gold"
                className="w-full font-bold"
                onClick={() => {
                  checkInEvent(qrModalEvent.id);
                  setQrModalEvent(null);
                }}
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Simulate Entrance Scan
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setQrModalEvent(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
