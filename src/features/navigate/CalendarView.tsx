/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Full Academic & Personal Calendar
 * Month, Week, Day, and Agenda views with overlay filters (classes, deadlines, exams, events, personal tasks),
 * interactive legend toggles, weekly workload meter, personal events modal CRUD with localStorage persistence,
 * and mobile-responsive dot-and-list collapse.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { getTimetableDayIndex, TimetableEntry } from '../../data/timetable';
import { AcademicDeadline, getDeadlineUrgency } from '../../data/deadlines';
import { CalendarEvent } from '../../data/events';
import { timetableService } from '../../services/timetableService';
import { formatTimeOnly } from '../../lib/utils';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Filter,
  Download,
  Trash2,
  Edit2,
  Check,
  MapPin,
  Flame,
  Activity,
  Layers,
} from 'lucide-react';

interface CalendarViewProps {
  timetableEntries: TimetableEntry[];
  deadlines: AcademicDeadline[];
  campusEvents: CalendarEvent[];
  onToggleDeadline: (id: string) => void;
  onNavigateVenue?: (venueId: string) => void;
}

export type CalendarViewType = 'month' | 'week' | 'day' | 'agenda';

export const CalendarView: React.FC<CalendarViewProps> = ({
  timetableEntries,
  deadlines,
  campusEvents,
  onToggleDeadline,
  onNavigateVenue,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewType, setViewType] = useState<CalendarViewType>('month');

  // Personal items from localStorage
  const [personalEvents, setPersonalEvents] = useState<CalendarEvent[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  // Form states for adding/editing personal event
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formStartTime, setFormStartTime] = useState('08:00');
  const [formEndTime, setFormEndTime] = useState('09:00');
  const [formCategory, setFormCategory] = useState<'personal' | 'academic' | 'exam'>('personal');
  const [formDescription, setFormDescription] = useState('');
  const [formRepeat, setFormRepeat] = useState<'none' | 'weekly' | 'daily'>('none');
  const [formReminder, setFormReminder] = useState<number>(30);

  // Filter Legend Toggles
  const [showClasses, setShowClasses] = useState(true);
  const [showDeadlines, setShowDeadlines] = useState(true);
  const [showExams, setShowExams] = useState(true);
  const [showEvents, setShowEvents] = useState(true);
  const [showPersonal, setShowPersonal] = useState(true);

  // Load personal events on mount
  useEffect(() => {
    timetableService.getPersonalEvents().then(setPersonalEvents);
  }, []);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if focus is in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowLeft') {
        navigatePrevious();
      } else if (e.key === 'ArrowRight') {
        navigateNext();
      } else if (e.key === 't' || e.key === 'T') {
        goToToday();
      } else if (e.key === 'm' || e.key === 'M') {
        setViewType('month');
      } else if (e.key === 'w' || e.key === 'W') {
        setViewType('week');
      } else if (e.key === 'd' || e.key === 'D') {
        setViewType('day');
      } else if (e.key === 'a' || e.key === 'A') {
        setViewType('agenda');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewType, currentDate]);

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const navigatePrevious = () => {
    const next = new Date(currentDate);
    if (viewType === 'month') {
      next.setMonth(next.getMonth() - 1);
    } else if (viewType === 'week') {
      next.setDate(next.getDate() - 7);
    } else {
      next.setDate(next.getDate() - 1);
    }
    setCurrentDate(next);
  };

  const navigateNext = () => {
    const next = new Date(currentDate);
    if (viewType === 'month') {
      next.setMonth(next.getMonth() + 1);
    } else if (viewType === 'week') {
      next.setDate(next.getDate() + 7);
    } else {
      next.setDate(next.getDate() + 1);
    }
    setCurrentDate(next);
  };

  // Compute Days for the Month Grid
  const monthData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Monday as start of week: 0 = Mon, ..., 6 = Sun
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const days: Array<{ date: Date; isCurrentMonth: boolean }> = [];

    // Preceding month filler days
    for (let i = startDayOfWeek; i > 0; i--) {
      const d = new Date(year, month, 1 - i);
      days.push({ date: d, isCurrentMonth: false });
    }

    // Days in current month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const d = new Date(year, month, i);
      days.push({ date: d, isCurrentMonth: true });
    }

    // Trailing month filler days to complete weeks (multiples of 7)
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({ date: d, isCurrentMonth: false });
    }

    return days;
  }, [currentDate]);

  // Format YYYY-MM-DD
  const formatDateKey = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Get items occurring on a specific date
  const getItemsForDate = useCallback(
    (d: Date) => {
      const dateKey = formatDateKey(d);
      const dayOfWeekIndex = d.getDay(); // 1 = Monday, 6 = Saturday, 0 = Sunday

      const items: Array<{
        id: string;
        type: 'class' | 'deadline' | 'exam' | 'event' | 'personal';
        title: string;
        subtitle?: string;
        time: string;
        color: string;
        accentColor?: string;
        isCompleted?: boolean;
        rawItem?: any;
      }> = [];

      // 1. Classes on this day of week
      if (showClasses && dayOfWeekIndex >= 1 && dayOfWeekIndex <= 6) {
        timetableEntries
          .filter((entry) => getTimetableDayIndex(entry.dayOfWeek) === dayOfWeekIndex)
          .forEach((entry) => {
            items.push({
              id: `cls-${entry.id}-${dateKey}`,
              type: 'class',
              title: `${entry.unitCode} - ${entry.unitName}`,
              subtitle: `${entry.venueName} • ${entry.lecturer}`,
              time: `${entry.startTime} – ${entry.endTime}`,
              color: entry.color,
              accentColor: entry.accentColor,
              rawItem: entry,
            });
          });
      }

      // 2. Deadlines due on this date
      if (showDeadlines) {
        deadlines
          .filter((dl) => dl.dueDate === dateKey)
          .forEach((dl) => {
            items.push({
              id: `dl-${dl.id}`,
              type: 'deadline',
              title: `${dl.unitCode}: ${dl.title}`,
              subtitle: `Due ${dl.dueTime} • ${dl.submissionType}`,
              time: dl.dueTime,
              color: dl.isCompleted ? '#16A34A' : '#D97706',
              isCompleted: dl.isCompleted,
              rawItem: dl,
            });
          });
      }

      // 3. Official Campus & Exam Events
      campusEvents.forEach((evt) => {
        if (evt.startDate === dateKey) {
          if (evt.category === 'exam' && showExams) {
            items.push({
              id: `exam-${evt.id}`,
              type: 'exam',
              title: evt.title,
              subtitle: `${evt.venueName} • ${evt.description}`,
              time: `${evt.startTime} – ${evt.endTime}`,
              color: '#DC2626',
              accentColor: '#FCA5A5',
              rawItem: evt,
            });
          } else if (evt.category !== 'exam' && showEvents) {
            items.push({
              id: `evt-${evt.id}`,
              type: 'event',
              title: evt.title,
              subtitle: `${evt.venueName} • ${evt.description}`,
              time: `${evt.startTime} – ${evt.endTime}`,
              color: evt.color || '#059669',
              accentColor: evt.accentColor,
              rawItem: evt,
            });
          }
        }
      });

      // 4. Personal Events
      if (showPersonal) {
        personalEvents
          .filter((pe) => pe.startDate === dateKey)
          .forEach((pe) => {
            items.push({
              id: pe.id,
              type: 'personal',
              title: pe.title,
              subtitle: pe.description || 'Personal Calendar Task',
              time: `${pe.startTime} – ${pe.endTime}`,
              color: '#6366F1',
              rawItem: pe,
            });
          });
      }

      // Sort chronologically by time
      return items.sort((a, b) => a.time.localeCompare(b.time));
    },
    [timetableEntries, deadlines, campusEvents, personalEvents, showClasses, showDeadlines, showExams, showEvents, showPersonal]
  );

  // Selected Day Items
  const selectedDayItems = useMemo(
    () => getItemsForDate(selectedDate),
    [selectedDate, getItemsForDate]
  );

  // Workload Statistics for Current Week
  const workloadStats = useMemo(() => {
    let lectureHours = 0;
    timetableEntries.forEach((e) => {
      const [sH, sM] = e.startTime.split(':').map(Number);
      const [eH, eM] = e.endTime.split(':').map(Number);
      lectureHours += (eH * 60 + eM - (sH * 60 + sM)) / 60;
    });

    const pendingDeadlines = deadlines.filter((d) => !d.isCompleted).length;
    const examsCount = campusEvents.filter((e) => e.category === 'exam').length;

    return {
      lectureHours: Math.round(lectureHours * 10) / 10,
      classesCount: timetableEntries.length,
      deadlinesCount: pendingDeadlines,
      examsCount,
      workloadLevel:
        lectureHours > 24 ? 'Intensive' : lectureHours > 16 ? 'Balanced' : 'Light',
    };
  }, [timetableEntries, deadlines, campusEvents]);

  // Handle Save Personal Event
  const handleSavePersonalEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDate) return;

    if (editingEvent) {
      await timetableService.deletePersonalEvent(editingEvent.id);
    }

    const saved = await timetableService.addPersonalEvent({
      title: formTitle,
      category: formCategory,
      startDate: formDate,
      startTime: formStartTime,
      endTime: formEndTime,
      venueName: 'Baraton Campus',
      description: formDescription,
      color: '#6366F1',
      repeat: formRepeat,
      reminderMinutes: Number(formReminder),
    });

    const updated = await timetableService.getPersonalEvents();
    setPersonalEvents(updated);
    setShowAddModal(false);
    setEditingEvent(null);
    setFormTitle('');
    setFormDescription('');
  };

  const handleDeletePersonalEvent = async (id: string) => {
    await timetableService.deletePersonalEvent(id);
    const updated = await timetableService.getPersonalEvents();
    setPersonalEvents(updated);
  };

  const handleOpenAddModal = (initialDate?: Date) => {
    setEditingEvent(null);
    setFormTitle('');
    setFormDate(formatDateKey(initialDate || selectedDate));
    setFormStartTime('10:00');
    setFormEndTime('11:00');
    setFormCategory('personal');
    setFormDescription('');
    setShowAddModal(true);
  };

  // Export Full Schedule as ICS
  const handleExportFullScheduleICS = () => {
    const text = timetableService.exportTimetableICS(timetableEntries);
    const blob = new Blob([text], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'UEAB_Full_Academic_Schedule.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isToday = (d: Date) => formatDateKey(d) === formatDateKey(new Date());
  const isSelected = (d: Date) => formatDateKey(d) === formatDateKey(selectedDate);

  const monthTitle = currentDate.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-5">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-[#0C1D3D] p-4 rounded-2xl border border-[#E3E8F0] dark:border-[#1E3158] shadow-xs">
        {/* Navigation & Month Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={navigatePrevious}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-[#071B4A] transition"
              title="Previous (Arrow Left)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToToday}
              className="px-2.5 py-1 text-xs font-bold text-[#0B2A6F] dark:text-[#F2B705] hover:bg-white dark:hover:bg-[#071B4A] rounded-lg transition"
              title="Jump to Today (Key T)"
            >
              Today
            </button>
            <button
              onClick={navigateNext}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-[#071B4A] transition"
              title="Next (Arrow Right)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-[#071B4A] dark:text-white tracking-tight">
            {monthTitle}
          </h2>
        </div>

        {/* View Type Switcher (Month / Week / Day / Agenda) */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {(['month', 'week', 'day', 'agenda'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewType(mode)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  viewType === mode
                    ? 'bg-white dark:bg-[#071B4A] text-[#0B2A6F] dark:text-[#F2B705] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {viewType === mode && (
                  <motion.div
                    layoutId="activeCalendarViewPill"
                    className="absolute inset-0 bg-white dark:bg-[#071B4A] rounded-lg shadow-xs -z-10"
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  />
                )}
                <span>{mode}</span>
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleExportFullScheduleICS}
              className="text-xs"
              title="Export Full Schedule (.ics)"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              Export .ICS
            </Button>

            <Button
              size="sm"
              variant="gold"
              onClick={() => handleOpenAddModal()}
              className="text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Event
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Filter Legend & Weekly Workload Indicator */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-center bg-white dark:bg-[#0C1D3D] p-3.5 rounded-2xl border border-[#E3E8F0] dark:border-[#1E3158] shadow-xs">
        {/* Category Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Filters:
          </span>

          <button
            onClick={() => setShowClasses(!showClasses)}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 border ${
              showClasses
                ? 'bg-blue-50 text-[#0B2A6F] border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                : 'opacity-40 bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#0B2A6F] dark:bg-blue-400" />
            <span>Classes ({timetableEntries.length})</span>
          </button>

          <button
            onClick={() => setShowDeadlines(!showDeadlines)}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 border ${
              showDeadlines
                ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                : 'opacity-40 bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#D97706]" />
            <span>Deadlines ({deadlines.length})</span>
          </button>

          <button
            onClick={() => setShowExams(!showExams)}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 border ${
              showExams
                ? 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                : 'opacity-40 bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
            <span>Exams &amp; CATs</span>
          </button>

          <button
            onClick={() => setShowEvents(!showEvents)}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 border ${
              showEvents
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                : 'opacity-40 bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#059669]" />
            <span>Vespers &amp; Campus</span>
          </button>

          <button
            onClick={() => setShowPersonal(!showPersonal)}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 border ${
              showPersonal
                ? 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800'
                : 'opacity-40 bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#6366F1]" />
            <span>Personal ({personalEvents.length})</span>
          </button>
        </div>

        {/* Weekly Workload Indicator */}
        <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-2 md:pt-0 md:pl-4">
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase text-slate-400">Weekly Load</div>
            <div className="text-xs font-black text-[#071B4A] dark:text-white">
              {workloadStats.lectureHours} hrs • {workloadStats.classesCount} classes
            </div>
          </div>
          <span
            className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
              workloadStats.workloadLevel === 'Intensive'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            {workloadStats.workloadLevel}
          </span>
        </div>
      </div>

      {/* 3. Main Calendar Views */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">
        {/* Left Side: Month Grid / Week Grid / Day View */}
        <div className="bg-white dark:bg-[#0C1D3D] rounded-2xl border border-[#E3E8F0] dark:border-[#1E3158] overflow-hidden shadow-xs">
          {/* ================= MONTH VIEW ================= */}
          {viewType === 'month' && (
            <div>
              {/* Day of Week Headers */}
              <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 text-center py-2 text-[11px] font-black uppercase text-slate-500">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span className="text-[#0B2A6F] dark:text-[#F2B705]">Sat (Sabbath)</span>
                <span>Sun</span>
              </div>

              {/* Grid Cells */}
              <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-800/80">
                {monthData.map(({ date, isCurrentMonth }, idx) => {
                  const dayItems = getItemsForDate(date);
                  const activeToday = isToday(date);
                  const activeSelected = isSelected(date);

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedDate(date)}
                      className={`min-h-[82px] sm:min-h-[105px] p-1.5 sm:p-2 cursor-pointer transition-all relative flex flex-col justify-between ${
                        !isCurrentMonth
                          ? 'bg-slate-50/40 dark:bg-slate-900/20 text-slate-300 dark:text-slate-600'
                          : activeSelected
                          ? 'bg-[#E8EEFF] dark:bg-[#102B62] ring-2 ring-inset ring-[#0B2A6F] dark:ring-[#F2B705]'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      {/* Cell Header with Date Number */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                            activeToday
                              ? 'bg-[#0B2A6F] text-[#F2B705] font-black shadow-xs'
                              : activeSelected
                              ? 'text-[#0B2A6F] dark:text-[#F2B705] font-black'
                              : 'text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          {date.getDate()}
                        </span>

                        {/* Sabbath badge on Saturdays */}
                        {date.getDay() === 6 && isCurrentMonth && (
                          <span className="hidden sm:inline-block text-[9px] font-black text-[#0B2A6F] dark:text-[#F2B705]">
                            UCH
                          </span>
                        )}
                      </div>

                      {/* Items Preview Chips (Desktop: Pills, Mobile: Colored Dots) */}
                      <div className="mt-1 space-y-1 overflow-hidden">
                        {/* Mobile Dot Indicator Row */}
                        <div className="flex sm:hidden items-center gap-1 flex-wrap pt-1">
                          {dayItems.slice(0, 4).map((it) => (
                            <span
                              key={it.id}
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: it.color }}
                            />
                          ))}
                          {dayItems.length > 4 && (
                            <span className="text-[9px] text-slate-400">+</span>
                          )}
                        </div>

                        {/* Desktop Chips */}
                        <div className="hidden sm:block space-y-0.5">
                          {dayItems.slice(0, 3).map((it) => (
                            <div
                              key={it.id}
                              style={{
                                borderLeft: `3px solid ${it.color}`,
                                backgroundColor: `${it.color}15`,
                              }}
                              className="px-1.5 py-0.5 rounded text-[10px] font-bold truncate text-[#071B4A] dark:text-slate-100"
                            >
                              <span className="font-mono text-[9px] text-slate-500 mr-1">
                                {it.time.split(' ')[0]}
                              </span>
                              <span>{it.title.split(' - ')[0]}</span>
                            </div>
                          ))}
                          {dayItems.length > 3 && (
                            <span className="text-[9px] font-bold text-slate-400 pl-1 block">
                              +{dayItems.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= AGENDA VIEW ================= */}
          {viewType === 'agenda' && (
            <div className="p-4 sm:p-6 space-y-5">
              <h3 className="text-sm font-black text-[#071B4A] dark:text-white uppercase tracking-wider">
                Upcoming Academic &amp; Personal Agenda
              </h3>

              <div className="space-y-4">
                {Array.from({ length: 7 }, (_, i) => {
                  const d = new Date(currentDate);
                  d.setDate(d.getDate() + i);
                  const items = getItemsForDate(d);
                  if (items.length === 0) return null;

                  return (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-1">
                        <span className="text-xs font-black text-[#0B2A6F] dark:text-[#F2B705]">
                          {d.toLocaleDateString('en-GB', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                        {isToday(d) && (
                          <Badge variant="academic">TODAY</Badge>
                        )}
                      </div>

                      <div className="space-y-2 pl-2">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            style={{ borderLeftColor: item.color }}
                            className="p-3 rounded-xl border border-l-4 border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between gap-3"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold text-slate-500">
                                  {item.time}
                                </span>
                                <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-white dark:bg-slate-900 border text-slate-600 dark:text-slate-300">
                                  {item.type}
                                </span>
                              </div>
                              <h4 className="text-xs sm:text-sm font-bold text-[#071B4A] dark:text-white mt-0.5">
                                {item.title}
                              </h4>
                              {item.subtitle && (
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                  {item.subtitle}
                                </p>
                              )}
                            </div>

                            {item.type === 'deadline' && (
                              <input
                                type="checkbox"
                                checked={item.isCompleted}
                                onChange={() => onToggleDeadline(item.rawItem.id)}
                                className="w-5 h-5 rounded text-[#0B2A6F] cursor-pointer"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= WEEK VIEW ================= */}
          {viewType === 'week' && (
            <div className="p-4 overflow-x-auto">
              <div className="min-w-[620px] grid grid-cols-6 divide-x divide-slate-100 dark:divide-slate-800">
                {Array.from({ length: 6 }, (_, idx) => {
                  const d = new Date(currentDate);
                  const day = d.getDay() || 7;
                  d.setDate(d.getDate() - day + 1 + idx); // Mon to Sat
                  const items = getItemsForDate(d);

                  return (
                    <div key={idx} className="p-2 space-y-2">
                      <div
                        onClick={() => setSelectedDate(d)}
                        className={`text-center p-2 rounded-xl cursor-pointer ${
                          isToday(d)
                            ? 'bg-[#0B2A6F] text-[#F2B705]'
                            : isSelected(d)
                            ? 'bg-[#E8EEFF] text-[#071B4A]'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="text-[10px] font-bold uppercase">
                          {d.toLocaleDateString('en-GB', { weekday: 'short' })}
                        </div>
                        <div className="text-base font-black">{d.getDate()}</div>
                      </div>

                      <div className="space-y-1.5">
                        {items.map((it) => (
                          <div
                            key={it.id}
                            style={{ borderLeftColor: it.color }}
                            className="p-2 rounded-lg border border-l-4 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] space-y-1"
                          >
                            <span className="font-mono text-[10px] text-slate-400 block">
                              {it.time}
                            </span>
                            <span className="font-bold text-[#071B4A] dark:text-white line-clamp-2">
                              {it.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= DAY VIEW ================= */}
          {viewType === 'day' && (
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-[#071B4A] dark:text-white">
                    {selectedDate.toLocaleDateString('en-GB', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Day Schedule • {selectedDayItems.length} agenda items
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="gold"
                  onClick={() => handleOpenAddModal(selectedDate)}
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Task
                </Button>
              </div>

              <div className="space-y-3">
                {selectedDayItems.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    No items scheduled for this day. Click &ldquo;Add Event&rdquo; to schedule study time or tasks.
                  </div>
                ) : (
                  selectedDayItems.map((item) => (
                    <div
                      key={item.id}
                      style={{ borderLeftColor: item.color }}
                      className="p-3.5 rounded-xl border border-l-4 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#0B2A6F] dark:text-[#F2B705]">
                            {item.time}
                          </span>
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-white dark:bg-slate-900 border text-slate-600 dark:text-slate-300">
                            {item.type}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-[#071B4A] dark:text-white">
                          {item.title}
                        </h4>
                        {item.subtitle && (
                          <p className="text-xs text-slate-500">{item.subtitle}</p>
                        )}
                      </div>

                      {item.type === 'personal' && (
                        <button
                          onClick={() => handleDeletePersonalEvent(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Selected Day Detailed Agenda & Workload Inspector */}
        <div className="space-y-4">
          <Card padding="md" className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Day Agenda
                </span>
                <h3 className="text-sm font-black text-[#071B4A] dark:text-white">
                  {selectedDate.toLocaleDateString('en-GB', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  })}
                </h3>
              </div>
              <Button
                size="sm"
                variant="gold"
                onClick={() => handleOpenAddModal(selectedDate)}
                className="text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Task
              </Button>
            </div>

            {/* List of items on selected date */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {selectedDayItems.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                  <span>No scheduled classes or deadlines on this date.</span>
                </div>
              ) : (
                selectedDayItems.map((item) => (
                  <div
                    key={item.id}
                    style={{ borderLeftColor: item.color }}
                    className="p-2.5 rounded-xl border border-l-4 border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono text-[10px] font-bold text-slate-500">
                        {item.time}
                      </span>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-white dark:bg-slate-900 border text-slate-500">
                        {item.type}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-[#071B4A] dark:text-white line-clamp-2">
                      {item.title}
                    </h4>

                    {item.subtitle && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {item.subtitle}
                      </p>
                    )}

                    {item.type === 'deadline' && (
                      <div className="pt-1 flex items-center justify-between">
                        <label className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.isCompleted}
                            onChange={() => onToggleDeadline(item.rawItem.id)}
                            className="rounded text-[#0B2A6F]"
                          />
                          <span>{item.isCompleted ? 'Marked Done' : 'Mark Completed'}</span>
                        </label>
                      </div>
                    )}

                    {item.type === 'class' && onNavigateVenue && (
                      <div className="pt-1 flex justify-end">
                        <button
                          onClick={() => onNavigateVenue(item.rawItem.venueId)}
                          className="text-[10px] font-bold text-[#0B2A6F] dark:text-[#F2B705] hover:underline flex items-center gap-1"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>Locate Hall</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Exam Countdown Card */}
          {campusEvents.some((e) => e.category === 'exam') && (
            <Card padding="md" className="space-y-3 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-red-200 dark:border-red-900/60">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-300 font-bold text-xs uppercase tracking-wider">
                <Flame className="w-4 h-4 text-red-600" />
                <span>Continuous Assessment &amp; CATs Countdown</span>
              </div>
              <div className="space-y-2">
                {campusEvents
                  .filter((e) => e.category === 'exam')
                  .slice(0, 2)
                  .map((exam) => {
                    const days = Math.ceil(
                      (new Date(exam.startDate).getTime() - new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                    return (
                      <div
                        key={exam.id}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-800 flex items-center justify-between"
                      >
                        <div className="min-w-0 pr-2">
                          <h5 className="font-bold text-xs text-[#071B4A] dark:text-white truncate">
                            {exam.title}
                          </h5>
                          <span className="text-[10px] text-slate-500">
                            {exam.startDate} • {exam.startTime}
                          </span>
                        </div>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-200 shrink-0">
                          {days <= 0 ? 'Today' : `${days}d left`}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* 4. Add / Edit Personal Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#071B4A] rounded-2xl max-w-md w-full p-6 text-slate-900 dark:text-white shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[#071B4A] dark:text-white">
                {editingEvent ? 'Edit Personal Event' : 'Add Personal Calendar Item'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePersonalEvent} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold mb-1">Title / Activity</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Compiler Lab Revision with Brian"
                  required
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Date</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    required
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <option value="personal">Personal Study</option>
                    <option value="academic">Academic Task</option>
                    <option value="exam">Self-Test / Quiz</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">End Time</label>
                  <input
                    type="time"
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Repeat</label>
                  <select
                    value={formRepeat}
                    onChange={(e) => setFormRepeat(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <option value="none">Does not repeat</option>
                    <option value="weekly">Weekly</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Reminder</label>
                  <select
                    value={formReminder}
                    onChange={(e) => setFormReminder(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <option value={15}>15 minutes before</option>
                    <option value={30}>30 minutes before</option>
                    <option value={60}>1 hour before</option>
                    <option value={1440}>1 day before</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Notes / Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="e.g. Focus on Chapter 4 LL(1) parsing tables."
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save Personal Item
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
