/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Timetable Page (/campus/timetable)
 * Views: Day, Week, List
 * Features: ICS export, clash detection warning, red "Venue changed" badge, route preview
 * Demo Flow 2: Lecturer venue change trigger
 */

import React, { useState } from 'react';
import { useKampasStore } from '../../lib/store';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { PERMISSIONS } from '../../lib/permissions';
import {
  Calendar,
  Download,
  AlertTriangle,
  MapPin,
  Clock,
  ArrowRight,
  Edit3,
  Navigation,
  Sparkles,
  Info,
} from 'lucide-react';
import { formatTimeOnly, generateICS, downloadICSFile } from '../../lib/utils';
import { TimetableEntry } from '../../lib/types';

const DAYS = [
  { id: 1, name: 'Monday', short: 'Mon' },
  { id: 2, name: 'Tuesday', short: 'Tue' },
  { id: 3, name: 'Wednesday', short: 'Wed' },
  { id: 4, name: 'Thursday', short: 'Thu' },
  { id: 5, name: 'Friday', short: 'Fri' },
];

export const TimetablePage: React.FC = () => {
  const { timetable, venues, user, changeVenue } = useKampasStore();

  const [viewMode, setViewMode] = useState<'day' | 'week' | 'list'>('day');
  const [selectedDay, setSelectedDay] = useState<number>(1); // Monday default
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [newVenueId, setNewVenueId] = useState('');
  const [venueChangeReason, setVenueChangeReason] = useState('Air conditioning maintenance and practical SQL lab requirement.');

  const canEdit = PERMISSIONS.canChangeVenue(user.role);

  // Filter entries
  const dayEntries = timetable
    .filter((e) => e.dayOfWeek === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Detect time clashes
  const clashes: Array<[TimetableEntry, TimetableEntry]> = [];
  timetable.forEach((a, i) => {
    timetable.forEach((b, j) => {
      if (i < j && a.dayOfWeek === b.dayOfWeek) {
        if (a.startTime < b.endTime && a.endTime > b.startTime) {
          clashes.push([a, b]);
        }
      }
    });
  });

  // Handle ICS Export
  const handleExportICS = () => {
    const fullCalendarText = timetable
      .map((entry) =>
        generateICS({
          title: `${entry.unitCode} - ${entry.unitName}`,
          description: `Lecturer: ${entry.lecturerName}. Trimester 1, UEAB Baraton.`,
          location: entry.venueName,
          startTime: entry.startTime,
          endTime: entry.endTime,
          dayOfWeek: entry.dayOfWeek,
        })
      )
      .join('\r\n');

    downloadICSFile('UEAB_Baraton_Timetable.ics', fullCalendarText);
  };

  const handleVenueChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry || !newVenueId) return;
    changeVenue(editingEntry.id, newVenueId, venueChangeReason);
    setEditingEntry(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#071B4A] dark:text-white">
              Academic Timetable
            </h1>
            <Badge variant="academic">Trimester 1</Badge>
          </div>
          <p className="text-xs text-[#5B6475] dark:text-slate-400 mt-1">
            Official class schedule for BSc Software Engineering • Synchronized with Academic Registrar
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* ICS Export Button */}
          <Button
            size="sm"
            variant="secondary"
            onClick={handleExportICS}
            className="text-xs"
            title="Export calendar to Google Calendar or Apple Calendar (.ics)"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export to Calendar (ICS)
          </Button>

          {/* Lecturer Simulation Quick Button */}
          {canEdit && (
            <Button
              size="sm"
              variant="gold"
              onClick={() => {
                const sampleEntry = timetable.find((t) => t.unitCode === 'COSC 311') || timetable[0];
                setEditingEntry(sampleEntry);
                setNewVenueId(venues[2]?.id || 'venue-compmb');
              }}
              className="text-xs"
            >
              <Edit3 className="w-3.5 h-3.5 mr-1" />
              Lecturer: Relocate Room
            </Button>
          )}
        </div>
      </div>

      {/* Clash Warning (if detected) */}
      {clashes.length > 0 && (
        <div className="p-3 bg-[#FEF3C7] dark:bg-[#78350F]/20 border border-[#F59E0B]/40 rounded-xl flex items-center gap-3 text-xs text-[#92400E] dark:text-[#FCD34D]">
          <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0" />
          <div className="flex-1">
            <span className="font-bold">Schedule Notice: </span>
            A potential course timing overlap is registered between {clashes[0][0].unitCode} and {clashes[0][1].unitCode}. Contact the department coordinator.
          </div>
        </div>
      )}

      {/* View Switcher Tabs (Day / Week / List) */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        {/* Day Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {DAYS.map((day) => (
            <button
              key={day.id}
              onClick={() => {
                setSelectedDay(day.id);
                setViewMode('day');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                selectedDay === day.id && viewMode === 'day'
                  ? 'bg-[#0B2A6F] text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {day.name}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => setViewMode('day')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
              viewMode === 'day'
                ? 'bg-white dark:bg-[#071B4A] text-[#0B2A6F] dark:text-[#F2B705] shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Day View
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
              viewMode === 'week'
                ? 'bg-white dark:bg-[#071B4A] text-[#0B2A6F] dark:text-[#F2B705] shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Full Week
          </button>
        </div>
      </div>

      {/* Day View Content */}
      {viewMode === 'day' && (
        <div className="space-y-4">
          {dayEntries.length === 0 ? (
            <Card className="text-center py-12">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">
                No Lectures on {DAYS.find((d) => d.id === selectedDay)?.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Use this day for library study or student club activities.
              </p>
            </Card>
          ) : (
            dayEntries.map((entry) => (
              <Card
                key={entry.id}
                padding="lg"
                className={`transition-all ${
                  entry.isVenueChanged
                    ? 'border-l-4 border-l-[#DC2626] bg-red-50/20 dark:bg-red-950/10'
                    : 'hover:border-[#0B2A6F]/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-extrabold text-[#0B2A6F] dark:text-[#93C5FD]">
                        {entry.unitCode}
                      </span>
                      {entry.isVenueChanged && (
                        <Badge variant="urgent" showDot>
                          VENUE CHANGED
                        </Badge>
                      )}
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs text-slate-600 dark:text-slate-300">
                        {entry.lecturerName}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#071B4A] dark:text-white mb-2">
                      {entry.unitName}
                    </h3>

                    {/* Venue & Location Details */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5 font-semibold text-[#071B4A] dark:text-white">
                        <MapPin className="w-4 h-4 text-[#0B2A6F] dark:text-[#F2B705]" />
                        <span>{entry.venueName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>
                          {formatTimeOnly(entry.startTime)} – {formatTimeOnly(entry.endTime)}
                        </span>
                      </div>
                    </div>

                    {/* Venue Change Alert Note */}
                    {entry.isVenueChanged && (
                      <div className="mt-3 p-2.5 rounded-lg bg-[#FEE2E2] dark:bg-[#7F1D1D]/30 border border-[#DC2626]/20 text-xs text-[#DC2626] dark:text-[#FCA5A5]">
                        <span className="font-bold">Relocation Notice: </span>
                        {entry.venueChangeNote}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => (window.location.hash = `#/home`)}
                      className="text-xs"
                    >
                      <Navigation className="w-3.5 h-3.5 mr-1" />
                      Map Route
                    </Button>

                    {canEdit && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingEntry(entry);
                          setNewVenueId(venues[0]?.id || '');
                        }}
                        className="text-xs text-slate-600 dark:text-slate-300"
                      >
                        <Edit3 className="w-3.5 h-3.5 mr-1" />
                        Relocate
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Week Grid View */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {DAYS.map((day) => {
            const entries = timetable
              .filter((e) => e.dayOfWeek === day.id)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));

            return (
              <div key={day.id} className="space-y-2">
                <div className="p-2 bg-[#0B2A6F] text-white text-center rounded-lg text-xs font-bold shadow-xs">
                  {day.name}
                </div>
                <div className="space-y-2">
                  {entries.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-xs bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                      Free
                    </div>
                  ) : (
                    entries.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 bg-white dark:bg-[#0C1D3D] rounded-lg border text-xs shadow-xs ${
                          item.isVenueChanged
                            ? 'border-red-500 bg-red-50/40 dark:bg-red-950/20'
                            : 'border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="font-extrabold text-[#0B2A6F] dark:text-[#93C5FD]">
                          {item.unitCode}
                        </div>
                        <div className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-1 mt-0.5">
                          {item.unitName}
                        </div>
                        <div className="text-slate-500 text-[11px] mt-1 font-mono">
                          {formatTimeOnly(item.startTime)}
                        </div>
                        <div className="text-[11px] text-[#071B4A] dark:text-slate-300 font-semibold truncate mt-0.5">
                          📍 {item.venueName}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lecturer Venue Change Modal */}
      {editingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#0C1D3D] rounded-2xl max-w-md w-full p-6 text-slate-900 dark:text-white shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Relocate Lecture Hall</h3>
              <Badge variant="academic">Lecturer Mode</Badge>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
              Changing the venue for <strong>{editingEntry.unitCode}: {editingEntry.unitName}</strong> will immediately dispatch a live urgent alert to all enrolled students and update the campus map.
            </p>

            <form onSubmit={handleVenueChangeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">Select New Venue</label>
                <select
                  value={newVenueId}
                  onChange={(e) => setNewVenueId(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                  required
                >
                  {venues.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.building}, {v.floor} - Cap: {v.capacity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Reason for Change</label>
                <input
                  type="text"
                  value={venueChangeReason}
                  onChange={(e) => setVenueChangeReason(e.target.value)}
                  placeholder="e.g. Projector failure, practical session in computing lab"
                  className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditingEntry(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Broadcast Venue Shift
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
