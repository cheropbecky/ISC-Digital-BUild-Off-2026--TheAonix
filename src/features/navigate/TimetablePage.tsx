/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Timetable Page
 */

import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { useKampasStore } from '../../lib/store';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { PERMISSIONS } from '../../lib/permissions';
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock3,
  Download,
  Edit3,
  ExternalLink,
  MapPin,
  Navigation,
  Share2,
  Sparkles,
  Users,
  X,
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

const START_HOUR = 7;
const END_HOUR = 18;
const HOUR_HEIGHT = 64;

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const getWeekStart = (date: Date) => {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() - (day === 0 ? 6 : day - 1));
  result.setHours(0, 0, 0, 0);
  return result;
};

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

const getEventStyle = (entry: TimetableEntry) => {
  const top = ((toMinutes(entry.startTime) - START_HOUR * 60) / 60) * HOUR_HEIGHT;
  const height = Math.max(((toMinutes(entry.endTime) - toMinutes(entry.startTime)) / 60) * HOUR_HEIGHT, 58);
  return { top, height };
};

export const TimetablePage: React.FC = () => {
  const { timetable, timetableLoading, timetableError, venues, user, changeVenue } = useKampasStore();
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'list'>('week');
  const today = new Date().getDay();
  const [selectedDay, setSelectedDay] = useState(today >= 1 && today <= 5 ? today : 1);
  const [selectedEntry, setSelectedEntry] = useState<TimetableEntry | null>(null);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [newVenueId, setNewVenueId] = useState('');
  const [venueChangeReason, setVenueChangeReason] = useState('Air conditioning maintenance and practical SQL lab requirement.');
  const canEdit = PERMISSIONS.canChangeVenue(user.role);

  const weekStart = useMemo(() => getWeekStart(new Date()), []);
  const weekLabel = `${formatDate(weekStart)} – ${formatDate(new Date(weekStart.getTime() + 4 * 86400000))}`;
  const clashes = useMemo(() => {
    const result: Array<[TimetableEntry, TimetableEntry]> = [];
    timetable.forEach((a, index) => timetable.slice(index + 1).forEach((b) => {
      if (a.dayOfWeek === b.dayOfWeek && a.startTime < b.endTime && a.endTime > b.startTime) result.push([a, b]);
    }));
    return result;
  }, [timetable]);

  const nextClass = useMemo(() => {
    const now = new Date();
    const day = now.getDay() >= 1 && now.getDay() <= 5 ? now.getDay() : 1;
    const current = now.getHours() * 60 + now.getMinutes();
    return timetable
      .filter((entry) => entry.dayOfWeek === day && toMinutes(entry.endTime) >= current)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))[0];
  }, [timetable]);

  const activeEntry = selectedEntry || nextClass || timetable[0];
  const enrolledUnits = Array.from(new Map(timetable.map((entry) => [entry.unitCode, entry])).values());

  const handleExportICS = () => {
    const text = timetable.map((entry) => generateICS({
      title: `${entry.unitCode} - ${entry.unitName}`,
      description: `Lecturer: ${entry.lecturerName}. Trimester 1, UEAB Baraton.`,
      location: entry.venueName,
      startTime: entry.startTime,
      endTime: entry.endTime,
      dayOfWeek: entry.dayOfWeek,
    })).join('\r\n');
    downloadICSFile('UEAB_Baraton_Timetable.ics', text);
  };

  const handleVenueChangeSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingEntry || !newVenueId) return;
    changeVenue(editingEntry.id, newVenueId, venueChangeReason);
    setEditingEntry(null);
  };

  const handleLocateVenue = (entry: TimetableEntry) => {
    const query = encodeURIComponent(`${entry.venueName}, University of Eastern Africa, Baraton, Kenya`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener,noreferrer');
  };

  const renderEvent = (entry: TimetableEntry, compact = false) => {
    const eventStyle = getEventStyle(entry);
    const isSelected = activeEntry?.id === entry.id;
    return (
      <motion.button
        layout
        key={entry.id}
        type="button"
        onClick={() => setSelectedEntry(entry)}
        style={compact ? undefined : eventStyle}
        className={`text-left rounded-lg border p-2 overflow-hidden transition-shadow ${
          compact ? 'relative min-h-[92px] w-full' : 'absolute inset-x-1'
        } ${
          entry.isVenueChanged
            ? 'border-red-300 bg-red-50 text-red-950 dark:bg-red-950/30 dark:text-red-100'
            : isSelected
              ? 'border-[#0B2A6F] bg-[#E8EEFF] text-[#071B4A] shadow-md dark:bg-[#102B62] dark:text-white'
              : 'border-[#C9D5F5] bg-[#E9EEFF] text-[#071B4A] hover:border-[#0B2A6F] dark:bg-[#102B62] dark:text-white'
        }`}
      >
        <div className="text-[10px] font-black uppercase tracking-wide">{entry.unitCode}</div>
        <div className="mt-1 text-[11px] font-bold leading-tight line-clamp-2">{entry.unitName}</div>
        <div className="mt-2 text-[10px] font-mono">{formatTimeOnly(entry.startTime)} – {formatTimeOnly(entry.endTime)}</div>
        <div className="mt-1 truncate text-[10px] text-slate-600 dark:text-slate-300">{entry.venueName}</div>
        {entry.isVenueChanged && <span className="mt-1 inline-flex items-center gap-1 text-[9px] font-bold text-red-600"><AlertTriangle className="h-3 w-3" /> Relocated</span>}
      </motion.button>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-[#E8EEFF] p-1 dark:bg-[#102B62]">
            {(['day', 'week', 'list'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition ${
                  viewMode === mode ? 'bg-white text-[#071B4A] shadow-sm dark:bg-[#071B4A] dark:text-white' : 'text-[#42527A] dark:text-slate-300'
                }`}
              >
                {mode === 'week' ? '▥  Week' : mode === 'day' ? '▣  Day' : '▤  List'}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="secondary" onClick={handleExportICS}><Calendar className="h-3.5 w-3.5" /> Add to calendar (ICS)</Button>
            <Button size="sm" variant="primary"><Share2 className="h-3.5 w-3.5" /> Share as image</Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF3] px-2.5 py-1 font-semibold text-[#15803D]"><CheckCircle2 className="h-3 w-3" /> Synced · Offline: showing saved timetable</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">Week 8 · {weekLabel}</span>
        </div>
      </div>

      {timetableError && <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">{timetableError} Showing the saved schedule.</div>}

      {clashes.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-[#FFFAEB] p-3 text-xs text-amber-950 dark:bg-amber-950/20 dark:text-amber-100">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
          <div className="flex-1"><strong>Schedule conflict detected.</strong> {clashes[0][0].unitCode} overlaps with {clashes[0][1].unitCode}.</div>
          <X className="h-4 w-4 text-slate-400" />
        </div>
      )}

      {timetableLoading ? (
        <Card className="py-16 text-center text-xs text-slate-500">Loading your timetable…</Card>
      ) : (
        <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0 overflow-hidden rounded-2xl border border-[#E3E8F0] bg-white shadow-sm dark:border-[#1E3158] dark:bg-[#0C1D3D]">
            {viewMode === 'list' && <div className="space-y-2 p-4">{timetable.sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime)).map((entry) => renderEvent(entry, true))}</div>}
            {viewMode === 'day' && (
              <div className="p-4">
                <div className="mb-3 flex gap-1 overflow-x-auto">{DAYS.map((day) => <button key={day.id} type="button" onClick={() => setSelectedDay(day.id)} className={`rounded-lg px-3 py-2 text-xs font-bold ${selectedDay === day.id ? 'bg-[#0B2A6F] text-white' : 'bg-slate-100 text-slate-600'}`}>{day.name}</button>)}</div>
                <div className="space-y-2">{timetable.filter((entry) => entry.dayOfWeek === selectedDay).sort((a, b) => a.startTime.localeCompare(b.startTime)).map((entry) => renderEvent(entry, true))}</div>
              </div>
            )}
            {viewMode === 'week' && (
              <div className="overflow-x-auto">
                <div className="min-w-[680px]">
                <div className="grid grid-cols-[58px_repeat(5,minmax(0,1fr))] border-b border-slate-200 dark:border-slate-700">
                  <div className="p-3 text-[9px] font-bold uppercase text-slate-400">Time / day</div>
                  {DAYS.map((day) => <button key={day.id} type="button" onClick={() => setSelectedDay(day.id)} className={`border-l border-slate-100 p-2 text-center dark:border-slate-700 ${selectedDay === day.id ? 'bg-[#F4F7FF] dark:bg-[#102B62]' : ''}`}><div className="text-[10px] font-bold uppercase text-slate-500">{day.short}</div><div className="text-xs font-black text-[#071B4A] dark:text-white">{formatDate(new Date(weekStart.getTime() + (day.id - 1) * 86400000))}</div></button>)}
                </div>
                <div className="grid grid-cols-[58px_repeat(5,minmax(0,1fr))]">
                  <div className="relative">{Array.from({ length: END_HOUR - START_HOUR }, (_, index) => <div key={index} style={{ height: HOUR_HEIGHT }} className="border-b border-slate-100 pr-2 pt-1 text-right text-[9px] font-mono text-slate-400 dark:border-slate-800">{formatTimeOnly(`${String(START_HOUR + index).padStart(2, '0')}:00`)}</div>)}</div>
                  {DAYS.map((day) => <div key={day.id} className="relative border-l border-slate-100 dark:border-slate-800" style={{ height: (END_HOUR - START_HOUR) * HOUR_HEIGHT, backgroundImage: 'linear-gradient(to bottom, transparent 63px, #eef2f8 64px)', backgroundSize: `100% ${HOUR_HEIGHT}px` }}>{timetable.filter((entry) => entry.dayOfWeek === day.id).map((entry) => renderEvent(entry))}</div>)}
                </div>
                </div>
              </div>
            )}
          </div>

          <aside className="min-w-0 space-y-4 lg:sticky lg:top-24 lg:self-start">
            <Card padding="sm">
              <div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-black text-[#071B4A] dark:text-white">My enrolled units</h2><Badge variant="academic">{enrolledUnits.length} registered</Badge></div>
              <div className="space-y-2">{enrolledUnits.map((entry) => <button key={entry.unitCode} type="button" onClick={() => setSelectedEntry(entry)} className={`w-full rounded-xl border p-3 text-left transition ${activeEntry?.unitCode === entry.unitCode ? 'border-[#0B2A6F] bg-[#F4F7FF] dark:bg-[#102B62]' : 'border-slate-200 dark:border-slate-700'}`}><div className="flex items-center gap-2"><span className="rounded-md bg-[#0B2A6F] px-2 py-1 text-[10px] font-black text-white">{entry.unitCode.split(' ')[0]}</span><span className="text-[10px] font-bold text-slate-500">{entry.unitCode.split(' ')[1]}</span></div><p className="mt-2 text-xs font-bold text-[#071B4A] dark:text-white line-clamp-2">{entry.unitName}</p><div className="mt-2 h-1 rounded-full bg-[#C7D2FE]" /></button>)}</div>
            </Card>
            {activeEntry && <Card padding="sm"><div className="mb-3 flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase text-slate-500">Active selection</p><h2 className="mt-1 text-sm font-black text-[#071B4A] dark:text-white">{activeEntry.unitCode}: {activeEntry.unitName}</h2></div><Sparkles className="h-4 w-4 text-[#F2B705]" /></div><div className="space-y-2 text-xs text-slate-600 dark:text-slate-300"><span className="flex items-center gap-2"><Clock3 className="h-3.5 w-3.5" />{DAYS.find((day) => day.id === activeEntry.dayOfWeek)?.name} · {formatTimeOnly(activeEntry.startTime)} – {formatTimeOnly(activeEntry.endTime)}</span><span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{activeEntry.venueName}</span><span className="flex items-center gap-2"><Users className="h-3.5 w-3.5" />{activeEntry.lecturerName}</span></div>{activeEntry.isVenueChanged && <div className="mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-800 dark:bg-red-950/30 dark:text-red-100"><strong>Relocation notice</strong><br />{activeEntry.venueChangeNote}</div>}<div className="mt-3 flex flex-wrap gap-2"><Button size="sm" variant="primary" onClick={() => handleLocateVenue(activeEntry)}><Navigation className="h-3.5 w-3.5" /> Locate venue</Button>{canEdit && <Button size="sm" variant="ghost" onClick={() => { setEditingEntry(activeEntry); setNewVenueId(venues[0]?.id || ''); }}><Edit3 className="h-3.5 w-3.5" /> Relocate</Button>}</div></Card>}
          </aside>
        </div>
      )}

      {editingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#0C1D3D]">
            <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-bold dark:text-white">Relocate Lecture Hall</h3><Badge variant="academic">Lecturer mode</Badge></div>
            <form onSubmit={handleVenueChangeSubmit} className="space-y-4"><select value={newVenueId} onChange={(event) => setNewVenueId(event.target.value)} className="h-11 w-full rounded-lg border bg-slate-50 px-3 text-sm dark:bg-slate-900">{venues.map((venue) => <option key={venue.id} value={venue.id}>{venue.name}</option>)}</select><input value={venueChangeReason} onChange={(event) => setVenueChangeReason(event.target.value)} className="h-11 w-full rounded-lg border bg-slate-50 px-3 text-sm dark:bg-slate-900" /><div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setEditingEntry(null)}>Cancel</Button><Button type="submit">Broadcast Venue Shift</Button></div></form>
          </div>
        </div>
      )}
    </div>
  );
};
