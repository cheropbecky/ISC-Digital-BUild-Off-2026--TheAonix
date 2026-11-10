/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Class Timetable & Academic Calendar Page
 * University of Eastern Africa, Baraton (Nandi County, Kenya)
 * Features:
 * - Tab switcher between Class Timetable and Academic Calendar
 * - Day, Week and List views with animated indicator
 * - Week view time grid with live "now" line, current class highlighted, color per unit
 * - Interactive tap opens ClassDetailDrawer with exterior & door photos
 * - Filters by unit, search box, previous/next week with "Today" button
 * - Schedule clash warnings and red "Venue Changed" relocation badges
 * - Export to RFC-compliant ICS and Share as Image (PNG canvas generator)
 */

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useKampasStore } from '../../lib/store';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { PERMISSIONS } from '../../lib/permissions';
import { getTimetableDayIndex, TIMETABLE_ENTRIES, TimetableEntry, detectClashes } from '../../data/timetable';
import { VENUES, VenueData } from '../../data/venues';
import { ACADEMIC_UNITS, AcademicUnit } from '../../data/units';
import { DEADLINES, AcademicDeadline } from '../../data/deadlines';
import { CAMPUS_CALENDAR_EVENTS } from '../../data/events';
import { timetableService } from '../../services/timetableService';
import { notify } from '../../lib/notify';
import { ClassDetailDrawer } from './ClassDetailDrawer';
import { CalendarView } from './CalendarView';
import { formatTimeOnly } from '../../lib/utils';
import {
  AlertTriangle,
  Calendar as CalendarIcon,
  Clock,
  Download,
  Share2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  Navigation,
  Sparkles,
  CheckCircle2,
  Flame,
  Layers,
  FileText,
  DoorOpen,
  UploadCloud,
  Image as ImageIcon,
  X,
  RotateCcw,
  Check,
  ScanLine,
  WandSparkles,
} from 'lucide-react';

const DAYS = [
  { id: 1, name: 'Monday', short: 'Mon' },
  { id: 2, name: 'Tuesday', short: 'Tue' },
  { id: 3, name: 'Wednesday', short: 'Wed' },
  { id: 4, name: 'Thursday', short: 'Thu' },
  { id: 5, name: 'Friday', short: 'Fri' },
  { id: 6, name: 'Saturday', short: 'Sat (Sabbath)' },
];

const START_HOUR = 7;
const END_HOUR = 19; // 07:00 to 19:00 covers evening vespers
const HOUR_HEIGHT = 68;

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const getWeekStart = (date: Date) => {
  const result = new Date(date);
  const day = result.getDay();
  // Monday as index 1
  const diff = day === 0 ? 6 : day - 1;
  result.setDate(result.getDate() - diff);
  result.setHours(0, 0, 0, 0);
  return result;
};

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

const TIMETABLE_UPLOAD_KEY = 'kampas_timetable_upload';
const SCAN_STAGES = [
  'Uploading timetable',
  'Scanning timetable image',
  'Identifying course information',
  'Organising class schedules',
  'Finalising timetable',
];

interface TimetableUploadState {
  image: string;
  fileName: string;
  scanned: boolean;
  scannedAt?: string;
}

const readSavedUpload = (): TimetableUploadState | null => {
  try {
    const saved = localStorage.getItem(TIMETABLE_UPLOAD_KEY);
    return saved ? JSON.parse(saved) as TimetableUploadState : null;
  } catch {
    return null;
  }
};

export const TimetablePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabParam = searchParams.get('tab');

  // Main Page Tabs: 'timetable' | 'calendar'
  const [mainTab, setMainTab] = useState<'timetable' | 'calendar'>(
    tabParam === 'calendar' ? 'calendar' : 'timetable'
  );

  // Timetable View Mode: 'week' | 'day' | 'list'
  const [viewMode, setViewMode] = useState<'week' | 'day' | 'list'>('week');

  const { user, changeVenue } = useKampasStore();
  const [rawEntries, setRawEntries] = useState<TimetableEntry[]>(TIMETABLE_ENTRIES);
  const [venuesList, setVenuesList] = useState<VenueData[]>(VENUES);
  const [unitsList, setUnitsList] = useState<AcademicUnit[]>(ACADEMIC_UNITS);
  const [deadlinesList, setDeadlinesList] = useState<AcademicDeadline[]>(DEADLINES);
  const [loading, setLoading] = useState(true);

  // Week navigation
  const [currentWeekOffset, setCurrentWeekOffset] = useState<number>(0);

  // Selected Date / Day
  const todayDay = new Date().getDay();
  const [selectedDay, setSelectedDay] = useState<number>(
    todayDay >= 1 && todayDay <= 6 ? todayDay : 1
  );

  // Interactive drawer inspection
  const [inspectedEntry, setInspectedEntry] = useState<TimetableEntry | null>(null);

  // Filters & Search
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Frontend-only timetable scanner state. The extracted schedule is always the
  // fixed TIMETABLE_ENTRIES sample; the image only drives the presentation flow.
  const [uploadState, setUploadState] = useState<TimetableUploadState | null>(readSavedUpload);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStage, setScanStage] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scanTimerRef = useRef<number | null>(null);

  // Live "now" line time state
  const [currentNowMinutes, setCurrentNowMinutes] = useState<number>(() => {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  });

  // Update live clock every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const d = new Date();
      setCurrentNowMinutes(d.getHours() * 60 + d.getMinutes());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => () => {
    if (scanTimerRef.current) window.clearInterval(scanTimerRef.current);
  }, []);

  const persistUpload = (next: TimetableUploadState | null) => {
    setUploadState(next);
    if (!next) {
      localStorage.removeItem(TIMETABLE_UPLOAD_KEY);
      return;
    }
    try {
      localStorage.setItem(TIMETABLE_UPLOAD_KEY, JSON.stringify(next));
    } catch {
      setUploadError('This image is too large to save locally. Please choose a smaller screenshot.');
    }
  };

  const handleTimetableFile = (file?: File) => {
    if (!file) return;
    const isSupported = ['image/png', 'image/jpeg'].includes(file.type) || /\.(png|jpe?g)$/i.test(file.name);
    if (!isSupported) {
      setUploadError('Please upload a PNG, JPG, or JPEG image.');
      return;
    }

    setUploadError('');
    const reader = new FileReader();
    reader.onload = () => {
      const image = typeof reader.result === 'string' ? reader.result : '';
      if (!image) {
        setUploadError('We could not read that image. Please try another file.');
        return;
      }
      persistUpload({ image, fileName: file.name, scanned: false });
      setScanProgress(0);
      setScanStage(0);
    };
    reader.onerror = () => setUploadError('We could not read that image. Please try another file.');
    reader.readAsDataURL(file);
  };

  const handleScanTimetable = () => {
    if (!uploadState?.image || isScanning) return;
    if (scanTimerRef.current) window.clearInterval(scanTimerRef.current);
    setIsScanning(true);
    setScanProgress(4);
    setScanStage(0);

    let step = 0;
    scanTimerRef.current = window.setInterval(() => {
      step += 1;
      const nextProgress = Math.min(step * 20, 100);
      setScanProgress(nextProgress);
      setScanStage(Math.min(Math.floor(step / 1.1), SCAN_STAGES.length - 1));

      if (nextProgress >= 100) {
        if (scanTimerRef.current) window.clearInterval(scanTimerRef.current);
        scanTimerRef.current = null;
        setIsScanning(false);
        persistUpload({ ...uploadState, scanned: true, scannedAt: new Date().toISOString() });
        sessionStorage.removeItem('kampas_timetable_home_notice_seen');
        notify({
          type: 'timetable_scanned',
          title: 'Timetable posted to your Home dashboard',
          body: 'Your lessons are now live on Home. Tap the new timetable update to view today’s schedule.',
          link: '/home',
          priority: 'important',
        }, user);
      }
    }, 700);
  };

  const handleRemoveUpload = () => {
    if (scanTimerRef.current) window.clearInterval(scanTimerRef.current);
    scanTimerRef.current = null;
    setIsScanning(false);
    setScanProgress(0);
    setScanStage(0);
    persistUpload(null);
  };

  const handleRescan = () => {
    if (!uploadState) return;
    setUploadError('');
    setScanProgress(0);
    setScanStage(0);
    persistUpload({ ...uploadState, scanned: false, scannedAt: undefined });
  };

  // Sync tab with URL
  useEffect(() => {
    if (tabParam === 'calendar' && mainTab !== 'calendar') {
      setMainTab('calendar');
    }
  }, [tabParam, mainTab]);

  // Load real data asynchronously through the service layer
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      timetableService.getRawTimetable(),
      timetableService.getVenues(),
      timetableService.getUnits(),
      timetableService.getDeadlines(),
    ])
      .then(([entries, venues, units, deadlines]) => {
        if (!isMounted) return;
        setRawEntries(entries);
        setVenuesList(venues);
        setUnitsList(units);
        setDeadlinesList(deadlines);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Compute Week Start based on offset
  const weekStart = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + currentWeekOffset * 7);
    return getWeekStart(d);
  }, [currentWeekOffset]);

  const weekLabel = useMemo(() => {
    const end = new Date(weekStart.getTime() + 5 * 86400000);
    return `${formatDate(weekStart)} – ${formatDate(end)}`;
  }, [weekStart]);

  // Detect Clashes dynamically
  const clashes = useMemo(() => {
    return detectClashes(rawEntries);
  }, [rawEntries]);

  // Unique Enrolled Units
  const enrolledUnits = useMemo(() => {
    const map = new Map<string, TimetableEntry>();
    rawEntries.forEach((e) => {
      if (!map.has(e.unitCode)) map.set(e.unitCode, e);
    });
    return Array.from(map.values());
  }, [rawEntries]);

  // Filtered Timetable Entries
  const filteredEntries = useMemo(() => {
    return rawEntries.filter((entry) => {
      // Unit filter
      if (selectedUnitFilter !== 'all' && entry.unitCode !== selectedUnitFilter) {
        return false;
      }
      // Search text query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          entry.unitCode.toLowerCase().includes(q) ||
          entry.unitName.toLowerCase().includes(q) ||
          entry.lecturer.toLowerCase().includes(q) ||
          entry.venueName.toLowerCase().includes(q) ||
          entry.venueCode.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [rawEntries, selectedUnitFilter, searchQuery]);

  // Determine which class is currently in session
  const activeClassNow = useMemo(() => {
    if (currentWeekOffset !== 0) return null;
    const nowDay = new Date().getDay();
    return rawEntries.find((entry) => {
      if (getTimetableDayIndex(entry.dayOfWeek) !== nowDay) return false;
      const start = toMinutes(entry.startTime);
      const end = toMinutes(entry.endTime);
      return currentNowMinutes >= start && currentNowMinutes < end;
    });
  }, [rawEntries, currentNowMinutes, currentWeekOffset]);

  // Next class
  const nextClass = useMemo(() => {
    const nowDay = new Date().getDay();
    const remainingToday = rawEntries
      .filter((e) => getTimetableDayIndex(e.dayOfWeek) === nowDay && toMinutes(e.startTime) > currentNowMinutes)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    if (remainingToday.length > 0) return remainingToday[0];
    return rawEntries.sort((a, b) => getTimetableDayIndex(a.dayOfWeek) - getTimetableDayIndex(b.dayOfWeek) || a.startTime.localeCompare(b.startTime))[0];
  }, [rawEntries, currentNowMinutes]);

  // Export ICS
  const handleExportICS = () => {
    const text = timetableService.exportTimetableICS(filteredEntries);
    const blob = new Blob([text], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'UEAB_Baraton_Class_Timetable.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Share as Image via HTML5 Canvas
  const handleShareAsImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 760;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background Gradient (UEAB Navy to Dark)
    const grad = ctx.createLinearGradient(0, 0, 1200, 760);
    grad.addColorStop(0, '#071B4A');
    grad.addColorStop(1, '#0B2A6F');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 760);

    // Header Branding
    ctx.fillStyle = '#F2B705';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillText('UNIVERSITY OF EASTERN AFRICA, BARATON • NANDI COUNTY', 40, 50);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 30px Inter, sans-serif';
    ctx.fillText('Student Class Timetable — 1st Trimester 2026/27', 40, 90);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(`Student: Becky Cherop • BSc Software Engineering (Year 3) • ${weekLabel}`, 40, 118);

    // Draw Timetable Cards on Grid
    const cardWidth = 175;
    const daysX = [40, 230, 420, 610, 800, 990];

    DAYS.forEach((d, idx) => {
      const x = daysX[idx];
      // Day header
      ctx.fillStyle = '#1E3158';
      ctx.beginPath();
      ctx.roundRect(x, 150, cardWidth, 34, 8);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.fillText(d.short.toUpperCase(), x + 12, 172);

      // Render day classes
      const dayClasses = rawEntries
        .filter((e) => getTimetableDayIndex(e.dayOfWeek) === d.id)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

      let curY = 195;
      dayClasses.forEach((cls) => {
        ctx.fillStyle = '#0F265C';
        ctx.strokeStyle = cls.color || '#3B82F6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x, curY, cardWidth, 90, 8);
        ctx.fill();
        ctx.stroke();

        // Accent top bar
        ctx.fillStyle = cls.color || '#3B82F6';
        ctx.fillRect(x + 2, curY + 2, cardWidth - 4, 4);

        // Unit code
        ctx.fillStyle = '#F2B705';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(cls.unitCode, x + 10, curY + 24);

        // Unit name
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px Inter, sans-serif';
        const truncatedName = cls.unitName.length > 22 ? cls.unitName.slice(0, 20) + '…' : cls.unitName;
        ctx.fillText(truncatedName, x + 10, curY + 42);

        // Time & Venue
        ctx.fillStyle = '#94A3B8';
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText(`${cls.startTime} - ${cls.endTime}`, x + 10, curY + 60);
        ctx.fillText(cls.venueCode || cls.venueName.slice(0, 20), x + 10, curY + 76);

        curY += 100;
      });
    });

    // Footer
    ctx.fillStyle = '#64748B';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText('Generated via Kampas Student Platform • Official Baraton Campus GIS Synced', 40, 725);

    // Download PNG
    const link = document.createElement('a');
    link.download = 'UEAB_Timetable_BeckyCherop.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleNavigateVenue = (venueId: string) => {
    navigate(`/campus/map?venue=${encodeURIComponent(venueId)}`);
  };

  // Toggle Deadline Completion
  const handleToggleDeadline = (id: string) => {
    setDeadlinesList((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isCompleted: !d.isCompleted } : d))
    );
  };

  // Calculate top & height for week time-grid item
  const getEventStyle = (entry: TimetableEntry) => {
    const startMin = toMinutes(entry.startTime);
    const endMin = toMinutes(entry.endTime);
    const top = ((startMin - START_HOUR * 60) / 60) * HOUR_HEIGHT;
    const height = Math.max(((endMin - startMin) / 60) * HOUR_HEIGHT, 56);
    return { top, height };
  };

  // Live "Now" line style in the week grid
  const liveNowStyle = useMemo(() => {
    if (currentNowMinutes < START_HOUR * 60 || currentNowMinutes > END_HOUR * 60) return null;
    const top = ((currentNowMinutes - START_HOUR * 60) / 60) * HOUR_HEIGHT;
    return { top };
  }, [currentNowMinutes]);

  const activeVenueForDrawer = useMemo(() => {
    if (!inspectedEntry) return null;
    return venuesList.find((v) => v.id === inspectedEntry.venueId) || null;
  }, [inspectedEntry, venuesList]);

  const activeUnitForDrawer = useMemo(() => {
    if (!inspectedEntry) return null;
    return unitsList.find((u) => u.code === inspectedEntry.unitCode) || null;
  }, [inspectedEntry, unitsList]);

  // Render a single class block
  const renderClassBlock = (entry: TimetableEntry, compact = false) => {
    const isNow = activeClassNow?.id === entry.id;
    const isSelected = inspectedEntry?.id === entry.id;

    return (
      <motion.button
        layout
        key={entry.id}
        type="button"
        onClick={() => setInspectedEntry(entry)}
        style={compact ? undefined : getEventStyle(entry)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className={`text-left rounded-xl border p-2.5 overflow-hidden transition-all duration-150 relative group ${
          compact ? 'relative min-h-[92px] w-full' : 'absolute inset-x-1.5'
        } ${
          entry.isRelocated
            ? 'border-red-400 bg-red-50 text-red-950 dark:bg-red-950/40 dark:text-red-100 shadow-xs'
            : isNow
            ? 'border-[#F2B705] bg-[#E8EEFF] text-[#071B4A] dark:bg-[#102B62] dark:text-white ring-2 ring-[#F2B705] shadow-md'
            : isSelected
            ? 'border-[#0B2A6F] bg-[#E8EEFF] text-[#071B4A] dark:bg-[#102B62] dark:text-white shadow-xs'
            : 'border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-[#0C1D3D] text-[#071B4A] hover:border-[#0B2A6F] dark:hover:border-[#F2B705] dark:text-white shadow-xs'
        }`}
      >
        {/* Left Color Accent Line */}
        <span
          className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl"
          style={{ backgroundColor: entry.color || '#0B2A6F' }}
        />

        <div className="pl-1">
          {/* Top Bar with Unit Code and Badges */}
          <div className="flex items-center justify-between gap-1">
            <span
              className="text-[11px] font-black font-mono tracking-wide px-1.5 py-0.2 rounded"
              style={{ backgroundColor: `${entry.color}20`, color: entry.color }}
            >
              {entry.unitCode}
            </span>

            {isNow && (
              <span className="flex items-center gap-1 text-[9px] font-black text-[#0B2A6F] dark:text-[#F2B705] bg-[#F2B705]/20 dark:bg-[#F2B705]/30 px-1.5 py-0.2 rounded-full animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                NOW
              </span>
            )}

            {entry.isRelocated && (
              <span className="text-[9px] font-black text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/60 px-1.5 py-0.2 rounded-full">
                RELOCATED
              </span>
            )}
          </div>

          {/* Unit Name */}
          <div className="mt-1 text-xs font-bold leading-tight line-clamp-1 group-hover:text-[#0B2A6F] dark:group-hover:text-[#F2B705]">
            {entry.unitName}
          </div>

          {/* Time & Venue */}
          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-300 font-mono">
            <span>{formatTimeOnly(entry.startTime)} – {formatTimeOnly(entry.endTime)}</span>
            <span className="truncate max-w-[90px] font-sans font-semibold text-slate-600 dark:text-slate-400">
              {entry.venueCode || entry.venueName.split(' ')[0]}
            </span>
          </div>
        </div>
      </motion.button>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header & Top Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E3E8F0] dark:border-[#1E3158]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#0B2A6F] text-[#F2B705]">
              <CalendarIcon className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#071B4A] dark:text-white tracking-tight">
              Class Timetable &amp; Schedule
            </h1>
            <Badge variant="academic">Trimester 1 • Week 8</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#5B6475] dark:text-slate-300 mt-1">
            Real-time schedule with live class tracking, venue door visual guides, and clash alerts.
          </p>
        </div>

        {/* Master Tab Switcher: [Class Timetable] vs [Academic Calendar] */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          <button
            onClick={() => {
              setMainTab('timetable');
              setSearchParams({});
            }}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all ${
              mainTab === 'timetable'
                ? 'bg-[#0B2A6F] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-[#0B2A6F]'
            }`}
          >
            Class Timetable
          </button>
          <button
            onClick={() => {
              setMainTab('calendar');
              setSearchParams({ tab: 'calendar' });
            }}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              mainTab === 'calendar'
                ? 'bg-[#0B2A6F] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-[#0B2A6F]'
            }`}
          >
            <span>Academic Calendar</span>
            <span className="w-2 h-2 rounded-full bg-[#F2B705]" />
          </button>
        </div>
      </div>

      {mainTab === 'timetable' && (
        uploadState?.scanned && !isScanning ? (
          <div className="flex items-center justify-end rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-[#1E3158] dark:bg-[#0C1D3D]">
            <Button size="sm" variant="gold" onClick={handleRescan} className="font-black"><RotateCcw className="mr-1.5 h-3.5 w-3.5" />Rescan</Button>
          </div>
        ) : (
        <section className="relative overflow-hidden rounded-3xl border border-[#CBD9F5] bg-gradient-to-br from-[#F5F8FF] via-white to-[#FFF9E6] p-4 shadow-sm dark:border-[#1E3158] dark:from-[#0C1D3D] dark:via-[#071B4A] dark:to-[#2A2508] sm:p-6">
          <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-[#1769FF]/10 blur-3xl" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#1769FF] dark:text-blue-300">
                <WandSparkles className="h-3.5 w-3.5" /> Smart timetable scanner
              </div>
              <h2 className="text-xl font-black tracking-tight text-[#071B4A] dark:text-white sm:text-2xl">
                Turn your timetable screenshot into a clear weekly plan
              </h2>
              <p className="mt-1.5 text-xs leading-relaxed text-[#5B6475] dark:text-slate-300 sm:text-sm">
                Upload a timetable image and watch Kampas organise your classes into the campus schedule view.
                This presentation demo uses the official sample timetable after scanning.
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(event) => {
                handleTimetableFile(event.target.files?.[0]);
                event.currentTarget.value = '';
              }}
            />

            {!uploadState ? (
              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') fileInputRef.current?.click();
                }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  handleTimetableFile(event.dataTransfer.files?.[0]);
                }}
                className="flex min-h-[150px] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#AFC3ED] bg-white/70 px-5 py-6 text-center transition hover:border-[#1769FF] hover:bg-white dark:border-[#2D4575] dark:bg-[#0C1D3D]/70 dark:hover:border-[#F2B705] lg:max-w-sm"
              >
                <span className="mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E8EEFF] text-[#0B2A6F] dark:bg-[#102B62] dark:text-[#F2B705]"><UploadCloud className="h-5 w-5" /></span>
                <span className="text-sm font-extrabold text-[#071B4A] dark:text-white">Drop your timetable here</span>
                <span className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">PNG, JPG or JPEG • or click to browse</span>
                <Button type="button" size="sm" variant="secondary" onClick={(event) => { event.stopPropagation(); fileInputRef.current?.click(); }} className="mt-3">Browse files</Button>
              </div>
            ) : (
              <div className="w-full lg:max-w-sm">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md dark:border-slate-700 dark:bg-[#0C1D3D]">
                  <div className="relative h-36 bg-slate-100 dark:bg-slate-900">
                    <img src={uploadState.image} alt="Uploaded timetable preview" className="h-full w-full object-contain" />
                    <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white shadow"><Check className="h-3 w-3" /> Image uploaded</div>
                    <button type="button" onClick={handleRemoveUpload} className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-red-600" aria-label="Remove timetable image"><X className="h-3.5 w-3.5" /></button>
                  </div>
                  <div className="flex items-center justify-between gap-2 p-3">
                    <div className="min-w-0"><div className="truncate text-xs font-bold text-[#071B4A] dark:text-white">{uploadState.fileName}</div><div className="text-[10px] text-slate-500">Ready for presentation scan</div></div>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="shrink-0 text-[11px] font-bold text-[#0B2A6F] hover:underline dark:text-blue-300">Replace</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {uploadError && <div className="relative mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">{uploadError}</div>}

          {uploadState && !uploadState.scanned && !isScanning && (
            <div className="relative mt-5 flex flex-col gap-3 rounded-2xl border border-[#BFD0F2] bg-white/80 p-3.5 sm:flex-row sm:items-center sm:justify-between dark:border-[#2D4575] dark:bg-[#0C1D3D]/80">
              <div className="flex items-center gap-2.5"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F2B705]/20 text-[#0B2A6F] dark:text-[#F2B705]"><ScanLine className="h-4 w-4" /></span><div><div className="text-xs font-black text-[#071B4A] dark:text-white">Ready to scan</div><div className="text-[11px] text-slate-500 dark:text-slate-400">Your image will be matched to the fixed UEAB sample schedule.</div></div></div>
              <Button size="sm" variant="gold" onClick={handleScanTimetable} className="font-black"><ScanLine className="mr-1.5 h-3.5 w-3.5" />Scan My Timetable</Button>
            </div>
          )}

          {isScanning && (
            <div className="relative mt-5 rounded-2xl border border-[#BFD0F2] bg-white/85 p-4 dark:border-[#2D4575] dark:bg-[#0C1D3D]/85">
              <div className="mb-3 flex items-center justify-between gap-3"><div><div className="text-xs font-black uppercase tracking-wider text-[#0B2A6F] dark:text-[#F2B705]">Kampas is arranging your timetable</div><div className="mt-1 text-sm font-bold text-[#071B4A] dark:text-white">{SCAN_STAGES[scanStage]}…</div></div><span className="font-mono text-sm font-black text-[#1769FF] dark:text-blue-300">{scanProgress}%</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"><motion.div className="h-full rounded-full bg-gradient-to-r from-[#1769FF] via-[#0B2A6F] to-[#F2B705]" initial={{ width: 0 }} animate={{ width: `${scanProgress}%` }} transition={{ duration: 0.35 }} /></div>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">{SCAN_STAGES.map((stage, index) => <div key={stage} className={`flex items-center gap-1.5 text-[10px] font-bold ${index <= scanStage ? 'text-[#0B2A6F] dark:text-blue-200' : 'text-slate-400'}`}><span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${index < scanStage ? 'bg-emerald-500 text-white' : index === scanStage ? 'bg-[#F2B705] text-[#071B4A]' : 'bg-slate-200 text-slate-500 dark:bg-slate-700'}`}>{index < scanStage ? <Check className="h-3 w-3" /> : index + 1}</span><span className="leading-tight">{stage}</span></div>)}</div>
            </div>
          )}

        </section>
        )
      )}

      {/* ================= TAB 1: CLASS TIMETABLE ================= */}
      {mainTab === 'timetable' && (
        <div className="space-y-5">
          {!uploadState?.scanned ? (
            <Card padding="lg" className="flex min-h-[260px] flex-col items-center justify-center text-center">
              <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8EEFF] text-[#0B2A6F] dark:bg-[#102B62] dark:text-[#F2B705]"><CalendarIcon className="h-7 w-7" /></span>
              <h3 className="text-lg font-black text-[#071B4A] dark:text-white">Your organised timetable will appear here</h3>
              <p className="mt-1 max-w-md text-xs text-slate-500 dark:text-slate-400">Upload your timetable image above, then start the scan to arrange the official sample schedule into this timetable view.</p>
            </Card>
          ) : <>
          {/* Controls Bar: View Switcher, Week Navigation, Filters, Export & Share */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-[#0C1D3D] p-4 rounded-2xl border border-[#E3E8F0] dark:border-[#1E3158] shadow-xs">
            {/* View Mode Switcher with animated pill */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              {(['week', 'day', 'list'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={`relative px-3.5 py-1.5 text-xs font-extrabold capitalize transition-all ${
                    viewMode === mode
                      ? 'text-[#071B4A] dark:text-[#F2B705]'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                  }`}
                >
                  {viewMode === mode && (
                    <motion.div
                      layoutId="activeTimetableViewTab"
                      className="absolute inset-0 bg-white dark:bg-[#071B4A] rounded-lg shadow-xs -z-10"
                      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    />
                  )}
                  <span>{mode === 'week' ? '▥ Week Grid' : mode === 'day' ? '▣ Day View' : '▤ List View'}</span>
                </button>
              ))}
            </div>

            {/* Previous / Next Week Navigation & Range */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setCurrentWeekOffset((prev) => prev - 1)}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-[#071B4A] transition"
                  title="Previous Week"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentWeekOffset(0)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                    currentWeekOffset === 0
                      ? 'bg-white dark:bg-[#071B4A] text-[#0B2A6F] dark:text-[#F2B705] shadow-xs'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Current Week
                </button>
                <button
                  onClick={() => setCurrentWeekOffset((prev) => prev + 1)}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-[#071B4A] transition"
                  title="Next Week"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <span className="text-xs font-extrabold text-[#071B4A] dark:text-white px-2 hidden sm:inline-block">
                {weekLabel}
              </span>
            </div>

            {/* Filter by Unit & Search Box */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <select
                  value={selectedUnitFilter}
                  onChange={(e) => setSelectedUnitFilter(e.target.value)}
                  className="h-9 pl-3 pr-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#071B4A] dark:text-white focus:outline-none focus:border-[#0B2A6F]"
                >
                  <option value="all">All Units ({enrolledUnits.length})</option>
                  {enrolledUnits.map((u) => (
                    <option key={u.unitCode} value={u.unitCode}>
                      {u.unitCode}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search lecturer, hall..."
                  className="h-9 pl-8 pr-3 w-36 sm:w-44 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-[#071B4A] dark:text-white focus:outline-none focus:border-[#0B2A6F]"
                />
              </div>

              {/* Action Buttons: ICS Export & Share Image */}
              <Button size="sm" variant="secondary" onClick={handleExportICS} className="text-xs">
                <Download className="w-3.5 h-3.5 mr-1" />
                ICS
              </Button>
              <Button size="sm" variant="gold" onClick={handleShareAsImage} className="text-xs font-bold">
                <Share2 className="w-3.5 h-3.5 mr-1" />
                Share Image
              </Button>
            </div>
          </div>

          {/* Clash Alert Warning Banner */}
          {clashes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-3.5 rounded-2xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 text-xs"
            >
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="flex-1">
                <strong>Schedule Conflict Detected: </strong>
                {clashes.map(([a, b], idx) => (
                  <span key={idx} className="mr-2">
                    {a.unitCode} ({a.startTime}-{a.endTime}) overlaps with {b.unitCode} on {a.dayOfWeek}.
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Main Content: Timetable Views & Enrolled Units Side Panel */}
          <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
            {/* Left: Time Grid or List */}
            <div className="min-w-0 overflow-hidden rounded-2xl border border-[#E3E8F0] dark:border-[#1E3158] bg-white shadow-sm dark:bg-[#0C1D3D]">
              {loading ? (
                <div className="p-16 text-center space-y-3">
                  <div className="w-8 h-8 rounded-full border-2 border-[#0B2A6F] border-t-transparent animate-spin mx-auto" />
                  <p className="text-xs text-slate-400">Loading your verified schedule...</p>
                </div>
              ) : (
                <>
                  {/* ================= 1. WEEK VIEW TIME GRID ================= */}
                  {viewMode === 'week' && (
                    <div className="overflow-x-auto">
                      <div className="min-w-[780px]">
                        {/* Day Column Headers */}
                        <div className="grid grid-cols-[64px_repeat(6,minmax(0,1fr))] border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40">
                          <div className="p-3 text-[10px] font-black uppercase text-slate-400 text-center">
                            Time
                          </div>
                          {DAYS.map((day) => {
                            const colDate = new Date(weekStart.getTime() + (day.id - 1) * 86400000);
                            const isColToday =
                              currentWeekOffset === 0 && new Date().getDay() === day.id;

                            return (
                              <button
                                key={day.id}
                                type="button"
                                onClick={() => {
                                  setSelectedDay(day.id);
                                  setViewMode('day');
                                }}
                                className={`border-l border-slate-100 dark:border-slate-800 p-2.5 text-center transition ${
                                  isColToday ? 'bg-[#E8EEFF]/70 dark:bg-[#102B62]/60' : 'hover:bg-slate-100/50'
                                }`}
                              >
                                <div className="text-[10px] font-black uppercase text-slate-500">
                                  {day.short}
                                </div>
                                <div className="text-xs font-black text-[#071B4A] dark:text-white flex items-center justify-center gap-1">
                                  <span>{formatDate(colDate)}</span>
                                  {isColToday && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Grid Body */}
                        <div className="grid grid-cols-[64px_repeat(6,minmax(0,1fr))] relative">
                          {/* Time Labels Column */}
                          <div className="relative select-none">
                            {Array.from({ length: END_HOUR - START_HOUR }, (_, index) => (
                              <div
                                key={index}
                                style={{ height: HOUR_HEIGHT }}
                                className="border-b border-slate-100 dark:border-slate-800/80 pr-2 pt-1.5 text-right text-[10px] font-mono text-slate-400"
                              >
                                {formatTimeOnly(`${String(START_HOUR + index).padStart(2, '0')}:00`)}
                              </div>
                            ))}
                          </div>

                          {/* 6 Day Columns */}
                          {DAYS.map((day) => {
                            const isColToday =
                              currentWeekOffset === 0 && new Date().getDay() === day.id;
                            const dayEntries = filteredEntries.filter((e) => getTimetableDayIndex(e.dayOfWeek) === day.id);

                            return (
                              <div
                                key={day.id}
                                className={`relative border-l border-slate-100 dark:border-slate-800/80 ${
                                  isColToday ? 'bg-blue-50/20 dark:bg-blue-950/10' : ''
                                }`}
                                style={{
                                  height: (END_HOUR - START_HOUR) * HOUR_HEIGHT,
                                  backgroundImage:
                                    'linear-gradient(to bottom, transparent 67px, #f1f5f9 68px)',
                                  backgroundSize: `100% ${HOUR_HEIGHT}px`,
                                }}
                              >
                                {/* Live "Now" Indicator Line on Today's Column */}
                                {isColToday && liveNowStyle && (
                                  <div
                                    style={{ top: liveNowStyle.top }}
                                    className="absolute inset-x-0 z-20 pointer-events-none flex items-center"
                                  >
                                    <span className="w-2.5 h-2.5 -ml-1 rounded-full bg-red-600 ring-2 ring-white shadow-xs" />
                                    <div className="h-[2px] w-full bg-red-500 shadow-xs" />
                                  </div>
                                )}

                                {/* Classes for this Day */}
                                {dayEntries.map((entry) => renderClassBlock(entry))}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ================= 2. DAY VIEW ================= */}
                  {viewMode === 'day' && (
                    <div className="p-4 sm:p-5 space-y-4">
                      {/* Day Pill Selector */}
                      <div className="flex gap-1.5 overflow-x-auto pb-1">
                        {DAYS.map((day) => (
                          <button
                            key={day.id}
                            type="button"
                            onClick={() => setSelectedDay(day.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                              selectedDay === day.id
                                ? 'bg-[#0B2A6F] text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            {day.name}
                          </button>
                        ))}
                      </div>

                      <div className="space-y-2.5 pt-2">
                        {filteredEntries.filter((e) => getTimetableDayIndex(e.dayOfWeek) === selectedDay).length === 0 ? (
                          <div className="text-center py-12 text-slate-400 text-xs">
                            No classes scheduled for {DAYS.find((d) => d.id === selectedDay)?.name}.
                          </div>
                        ) : (
                          filteredEntries
                            .filter((e) => getTimetableDayIndex(e.dayOfWeek) === selectedDay)
                            .sort((a, b) => a.startTime.localeCompare(b.startTime))
                            .map((entry) => renderClassBlock(entry, true))
                        )}
                      </div>
                    </div>
                  )}

                  {/* ================= 3. LIST VIEW ================= */}
                  {viewMode === 'list' && (
                    <div className="p-4 sm:p-5 space-y-3">
                      {filteredEntries
                        .sort((a, b) => getTimetableDayIndex(a.dayOfWeek) - getTimetableDayIndex(b.dayOfWeek) || a.startTime.localeCompare(b.startTime))
                        .map((entry) => renderClassBlock(entry, true))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Right: Enrolled Units Inspector & Active Class Summary */}
            <aside className="space-y-4 min-w-0">
              {/* Enrolled Units Card */}
              <Card padding="md" className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-black text-[#071B4A] dark:text-white">
                    Enrolled Courses
                  </h3>
                  <Badge variant="academic">{enrolledUnits.length} Units</Badge>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {enrolledUnits.map((u) => (
                    <button
                      key={u.unitCode}
                      onClick={() => setInspectedEntry(u)}
                      className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between gap-2 ${
                        inspectedEntry?.unitCode === u.unitCode
                          ? 'bg-[#E8EEFF] dark:bg-[#102B62] border-[#0B2A6F] dark:border-[#F2B705]'
                          : 'border-slate-200 dark:border-slate-700 hover:border-[#0B2A6F]'
                      }`}
                    >
                      <div className="min-w-0">
                        <span
                          className="font-mono text-[10px] font-black px-1.5 py-0.2 rounded"
                          style={{ backgroundColor: `${u.color}20`, color: u.color }}
                        >
                          {u.unitCode}
                        </span>
                        <div className="text-xs font-bold text-[#071B4A] dark:text-white truncate mt-1">
                          {u.unitName}
                        </div>
                        <div className="text-[10px] text-slate-400">{u.lecturer}</div>
                      </div>
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: u.color }}
                      />
                    </button>
                  ))}
                </div>
              </Card>

              {/* Next Upcoming Class Quick Spotlight */}
              {nextClass && (
                <Card padding="md" className="space-y-2.5 bg-gradient-to-br from-blue-50/70 to-slate-50 dark:from-blue-950/20 dark:to-slate-900">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#0B2A6F] dark:text-[#F2B705] flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Next Up
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 font-bold">
                      {nextClass.startTime}
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-[#071B4A] dark:text-white line-clamp-1">
                    {nextClass.unitCode}: {nextClass.unitName}
                  </h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#0B2A6F] dark:text-[#F2B705]" />
                    <span>{nextClass.venueName}</span>
                  </p>

                  <div className="pt-1 flex items-center justify-between">
                    <button
                      onClick={() => setInspectedEntry(nextClass)}
                      className="text-xs font-bold text-[#0B2A6F] dark:text-[#F2B705] hover:underline"
                    >
                      View Door &amp; Details →
                    </button>
                    <Button
                      size="sm"
                      variant="gold"
                      onClick={() => handleNavigateVenue(nextClass.venueId)}
                      className="text-[10px] font-bold"
                    >
                      <Navigation className="w-3 h-3 mr-1" />
                      Route
                    </Button>
                  </div>
                </Card>
              )}
            </aside>
          </div>
          </>}
        </div>
      )}

      {/* ================= TAB 2: ACADEMIC CALENDAR ================= */}
      {mainTab === 'calendar' && (
        <CalendarView
          timetableEntries={rawEntries}
          deadlines={deadlinesList}
          campusEvents={CAMPUS_CALENDAR_EVENTS}
          onToggleDeadline={handleToggleDeadline}
          onNavigateVenue={handleNavigateVenue}
        />
      )}

      {/* Slide-in Class Detail Drawer */}
      <ClassDetailDrawer
        entry={inspectedEntry}
        venue={activeVenueForDrawer}
        unit={activeUnitForDrawer}
        isOpen={Boolean(inspectedEntry)}
        onClose={() => setInspectedEntry(null)}
        onNavigateToMap={handleNavigateVenue}
        hasClash={clashes.some(([a, b]) => a.id === inspectedEntry?.id || b.id === inspectedEntry?.id)}
        clashEntry={
          clashes.find(([a, b]) => a.id === inspectedEntry?.id)?.[1] ||
          clashes.find(([a, b]) => b.id === inspectedEntry?.id)?.[0] ||
          null
        }
      />

    </div>
  );
};
