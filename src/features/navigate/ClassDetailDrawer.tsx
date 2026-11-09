/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Class Detail Drawer & Modal
 * Displays unit, lecturer, building and entrance door photos, indoor guide,
 * relocation notes, navigate button, and export to calendar.
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TimetableEntry } from '../../data/timetable';
import { VenueData } from '../../data/venues';
import { AcademicUnit } from '../../data/units';
import { ImageWithFallback } from '../../components/ui/ImageWithFallback';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatTimeOnly } from '../../lib/utils';
import { timetableService } from '../../services/timetableService';
import {
  X,
  MapPin,
  Clock,
  User,
  Navigation,
  Calendar,
  AlertTriangle,
  DoorOpen,
  Building,
  Info,
  BookOpen,
  Mail,
  Compass,
} from 'lucide-react';

interface ClassDetailDrawerProps {
  entry: TimetableEntry | null;
  venue?: VenueData | null;
  unit?: AcademicUnit | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToMap: (venueId: string) => void;
  hasClash?: boolean;
  clashEntry?: TimetableEntry | null;
}

export const ClassDetailDrawer: React.FC<ClassDetailDrawerProps> = ({
  entry,
  venue,
  unit,
  isOpen,
  onClose,
  onNavigateToMap,
  hasClash,
  clashEntry,
}) => {
  if (!isOpen || !entry) return null;

  const handleDownloadSingleICS = () => {
    const today = new Date().toISOString().split('T')[0];
    const icsContent = timetableService.exportSingleEventICS({
      title: `${entry.unitCode} - ${entry.unitName}`,
      description: `Lecturer: ${entry.lecturer}. Venue: ${entry.venueName} (${entry.venueCode}). UEAB Baraton.`,
      location: `${entry.venueName}, ${entry.building}, UEAB Baraton`,
      date: today,
      startTime: entry.startTime,
      endTime: entry.endTime,
    });

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${entry.unitCode}_Class.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs"
        />

        {/* Drawer Content */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative z-10 w-full max-w-lg bg-white dark:bg-[#071B4A] shadow-2xl flex flex-col h-full overflow-hidden border-l border-[#E3E8F0] dark:border-[#1E3158]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E3E8F0] dark:border-[#1E3158] flex items-center justify-between bg-slate-50/80 dark:bg-[#0C1D3D]/80">
            <div className="flex items-center gap-2.5">
              <span
                className="w-3.5 h-3.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="font-mono text-xs font-black tracking-wide text-[#0B2A6F] dark:text-[#F2B705]">
                {entry.unitCode}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-bold text-slate-500 uppercase">
                {entry.type}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Title & Timing */}
            <div>
              <h2 className="text-xl font-black text-[#071B4A] dark:text-white leading-tight">
                {entry.unitName}
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#0B2A6F] dark:text-blue-300">
                  <Clock className="w-3.5 h-3.5 text-[#0B2A6F] dark:text-[#F2B705]" />
                  <span>
                    {entry.dayOfWeek} • {formatTimeOnly(entry.startTime)} – {formatTimeOnly(entry.endTime)}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Weekly Recurrence
                </span>
              </div>
            </div>

            {/* Relocated Alert Warning */}
            {entry.isRelocated && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 text-red-950 dark:text-red-200 space-y-1 text-xs"
              >
                <div className="flex items-center gap-2 font-bold text-red-700 dark:text-red-300">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>VENUE RELOCATED</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {entry.relocationNote || 'This lecture has been moved from its standard venue. Please proceed to the new hall indicated below.'}
                </p>
              </motion.div>
            )}

            {/* Clash Warning */}
            {hasClash && (
              <div className="p-3.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 space-y-1 text-xs">
                <div className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>TIMETABLE CLASH DETECTED</span>
                </div>
                <p className="text-[11px]">
                  This session overlaps in time with {clashEntry ? `${clashEntry.unitCode} (${clashEntry.unitName})` : 'another enrolled class'}. Contact the faculty registrar to adjust section assignments.
                </p>
              </div>
            )}

            {/* Venue & Photos Card */}
            <div className="p-4 rounded-xl border border-[#E3E8F0] dark:border-[#1E3158] bg-slate-50/60 dark:bg-[#0C1D3D]/60 space-y-3.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B6475] dark:text-slate-400">
                    Classroom Location
                  </span>
                  <h3 className="text-base font-bold text-[#071B4A] dark:text-white flex items-center gap-1.5 mt-0.5">
                    <Building className="w-4 h-4 text-[#0B2A6F] dark:text-[#F2B705]" />
                    <span>{entry.venueName}</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {entry.building} • Hall Code: <strong className="font-mono">{entry.venueCode}</strong>
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="gold"
                  onClick={() => onNavigateToMap(entry.venueId)}
                  className="text-xs font-bold shrink-0"
                >
                  <Navigation className="w-3.5 h-3.5 mr-1" />
                  Route
                </Button>
              </div>

              {/* Photos: Building Exterior AND Entrance Door */}
              {venue && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                    <span>Visual Door &amp; Building Guide</span>
                    <span className="text-[10px] text-slate-400">Capacity: {venue.capacity} seats</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Photo 1: Building Exterior */}
                    <div className="aspect-4/3 rounded-xl overflow-hidden relative border border-slate-200 dark:border-slate-700 bg-slate-100 group">
                      <ImageWithFallback
                        src={venue.photos.exterior}
                        alt={`${venue.name} Exterior`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-200"
                      />
                      <span className="absolute bottom-1.5 left-1.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        Building Front
                      </span>
                    </div>

                    {/* Photo 2: Entrance Door */}
                    <div className="aspect-4/3 rounded-xl overflow-hidden relative border border-slate-200 dark:border-slate-700 bg-slate-100 group">
                      <ImageWithFallback
                        src={venue.photos.entranceDoor}
                        alt={`${venue.name} Door Entry`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-200"
                      />
                      <span className="absolute bottom-1.5 left-1.5 bg-[#0B2A6F]/90 backdrop-blur-xs text-[#F2B705] text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1">
                        <DoorOpen className="w-3 h-3" />
                        Door Entry
                      </span>
                    </div>
                  </div>

                  {/* Indoor Guide / Hint */}
                  <div className="p-3 rounded-lg bg-white dark:bg-[#071B4A] border border-[#E3E8F0] dark:border-[#1E3158] text-xs text-[#071B4A] dark:text-slate-200">
                    <strong className="text-[#0B2A6F] dark:text-[#F2B705]">Indoor Navigation Hint: </strong>
                    <span className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                      {venue.indoorHint || venue.indoorHints}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Lecturer Information */}
            <div className="p-4 rounded-xl border border-[#E3E8F0] dark:border-[#1E3158] bg-slate-50/60 dark:bg-[#0C1D3D]/60 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B6475] dark:text-slate-400">
                Course Lecturer
              </span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0B2A6F] text-[#F2B705] font-bold flex items-center justify-center shrink-0 text-sm">
                  {entry.lecturer.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-[#071B4A] dark:text-white truncate">
                    {entry.lecturer}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {unit?.school || 'School of Science & Technology'}
                  </p>
                </div>
              </div>

              {unit && (
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{unit.lecturerEmail}</span>
                  </span>
                  <span>Office: {unit.lecturerOffice}</span>
                </div>
              )}
            </div>

            {/* Syllabus Description */}
            {unit && (
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Unit Curriculum Scope
                </span>
                <p className="text-[11px] leading-relaxed bg-white dark:bg-[#071B4A] p-3 rounded-lg border border-[#E3E8F0] dark:border-[#1E3158]">
                  {unit.description}
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-[#E3E8F0] dark:border-[#1E3158] bg-white dark:bg-[#071B4A] flex items-center justify-between gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownloadSingleICS}
              className="text-xs font-semibold"
            >
              <Calendar className="w-3.5 h-3.5 mr-1 text-[#0B2A6F] dark:text-[#F2B705]" />
              Add to Calendar (.ics)
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigateToMap(entry.venueId)}
              className="text-xs font-bold"
            >
              <Compass className="w-3.5 h-3.5 mr-1 text-[#F2B705]" />
              Navigate on Campus Map
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
