/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Lost & Found Service (/found)
 * Features: Camera-first report, automated match suggestions, verification questions,
 * hand-over points, 14-day escalation to campus security (Demo Flow 6)
 *
 * Interactive + responsive: live search with highlighting, category filters, hide-claimed toggle,
 * item preview pop-up (arrow keys on desktop, swipe on touch), real photo capture/upload,
 * form validation, name fields on report and claim, bottom-sheet pop-ups on phones.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useKampasStore } from '../../lib/store';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  SearchCheck,
  Camera,
  MapPin,
  Shield,
  Clock,
  Sparkles,
  CheckCircle2,
  Key,
  Laptop,
  CreditCard,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { LostFoundItem } from '../../lib/types';
import { HERO_IMAGE_URLS } from '../../data/imageUrls';

const libraryHallPhoto = HERO_IMAGE_URLS.library;

const HANDOVER_POINTS = [
  'Main Security Gate A Desk',
  'Library 1st Floor Circulation Desk',
  'Dean of Students Office',
  'Student Centre Guild Helpdesk',
  'Security Post B (Science Block)',
];

const CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: 'electronics', label: 'Electronics & Chargers' },
  { value: 'documents_id', label: 'Student ID / National ID' },
  { value: 'keys', label: 'Keys & Lanyards' },
  { value: 'bags', label: 'Bags & Backpacks' },
  { value: 'books', label: 'Calculators & Books' },
  { value: 'clothing', label: 'Clothing & Umbrellas' },
];

const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  CATEGORY_OPTIONS.map((c) => [c.value, c.label])
);

const CATEGORY_ICON: Record<string, LucideIcon> = {
  electronics: Laptop,
  documents_id: CreditCard,
  keys: Key,
};

// Set to false to open the report form empty instead of pre-filled with demo values.
const PREFILL_DEMO = true;
const MAX_PHOTO_BYTES = 3_000_000;
const SWIPE_THRESHOLD_PX = 50;

/* ---------- Small helpers ---------- */

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const Highlight: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  const terms = query.trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return <>{text}</>;
  const re = new RegExp(`(${terms.map(escapeRe).join('|')})`, 'gi');
  return (
    <>
      {text.split(re).map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="bg-[#F2B705]/60 text-inherit rounded px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

/**
 * Pop-up shell. Bottom sheet on phones, centered dialog from the sm breakpoint up.
 * Esc and backdrop click close it; focus moves in and returns on close.
 */
const Modal: React.FC<{
  label: string;
  onClose: () => void;
  maxWidth?: string;
  children: React.ReactNode;
}> = ({ label, onClose, maxWidth = 'sm:max-w-lg', children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const previousOverflowY = document.body.style.overflowY;
    document.body.style.overflowY = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflowY = previousOverflowY;
      previous?.focus?.();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={`bg-white dark:bg-[#0C1D3D] rounded-t-2xl sm:rounded-2xl w-full ${maxWidth} text-slate-900 dark:text-white shadow-2xl max-h-[92dvh] sm:max-h-[90dvh] overflow-y-auto overscroll-contain outline-none`}
      >
        {children}
      </div>
    </div>
  );
};

const ItemImage: React.FC<{ item: LostFoundItem; className?: string }> = ({ item, className = '' }) => {
  const [failedPhotoUrl, setFailedPhotoUrl] = useState<string | null>(null);
  const Icon = CATEGORY_ICON[item.category] ?? SearchCheck;
  return item.photoUrl && failedPhotoUrl !== item.photoUrl ? (
    <img
      src={item.photoUrl}
      alt={item.title}
      className={`w-full h-full object-cover ${className}`}
      referrerPolicy="no-referrer"
      onError={() => setFailedPhotoUrl(item.photoUrl ?? null)}
    />
  ) : (
    <div className="w-full h-full bg-gradient-to-br from-[#071B4A] to-[#0B2A6F] flex items-center justify-center">
      <Icon className="w-12 h-12 text-[#F2B705]/40" />
    </div>
  );
};

/* ---------- Page ---------- */

export const LostFoundPage: React.FC = () => {
  const { lostItems, venues, user, reportLostFoundItem, submitClaim } = useKampasStore();

  // Browse state
  const [activeTab, setActiveTab] = useState<'all' | 'found' | 'lost'>('all');
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [hideClaimed, setHideClaimed] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const touchStartX = useRef<number | null>(null);

  // Pop-ups
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [claimingItem, setClaimingItem] = useState<LostFoundItem | null>(null);
  const [claimAnswer, setClaimAnswer] = useState('');
  const [claimerName, setClaimerName] = useState('');
  const [toast, setToast] = useState('');

  // Report form state
  const [reportType, setReportType] = useState<'found' | 'lost'>('found');
  const [itemTitle, setItemTitle] = useState(PREFILL_DEMO ? 'Graphing Calculator (Casio fx-991EX)' : '');
  const [category, setCategory] = useState<LostFoundItem['category']>('electronics');
  const [locationFound, setLocationFound] = useState(PREFILL_DEMO ? 'Science Complex Auditorium Floor 1 Desk 4' : '');
  const [venueId, setVenueId] = useState('venue-sciaud');
  const [description, setDescription] = useState(
    PREFILL_DEMO ? 'Found on table 4 after Linear Algebra. Black sliding plastic cover.' : ''
  );
  const [verificationQuestion, setVerificationQuestion] = useState(
    PREFILL_DEMO ? 'What initials or formula are carved into the inside of the cover?' : ''
  );
  const [handoverPoint, setHandoverPoint] = useState(HANDOVER_POINTS[0]);
  const [reporterNameInput, setReporterNameInput] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Press "/" anywhere to jump to search (desktop keyboards)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  // Safety net: stop the whole page from panning sideways on phones, whatever the extra width comes from.
  // (clip does not create a scroll container, so sticky headers elsewhere keep working.)
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlX: html.style.overflowX,
      bodyX: body.style.overflowX,
      touch: html.style.touchAction,
      overscroll: html.style.overscrollBehaviorX,
    };
    html.style.overflowX = 'hidden';
    body.style.overflowX = 'clip';
    html.style.touchAction = 'pan-y pinch-zoom';
    html.style.overscrollBehaviorX = 'none';
    return () => {
      html.style.overflowX = prev.htmlX;
      body.style.overflowX = prev.bodyX;
      html.style.touchAction = prev.touch;
      html.style.overscrollBehaviorX = prev.overscroll;
    };
  }, []);

  // Dev only: lists elements that stick out past the screen edge, to find the real source of sideways scrolling.
  // Safe to delete once the layout is fixed.
  useEffect(() => {
    if (!(import.meta as any).env?.DEV) return;
    const check = () => {
      const vw = document.documentElement.clientWidth;
      const wide = Array.from(document.querySelectorAll<HTMLElement>('body *')).filter(
        (el) => getComputedStyle(el).position !== 'fixed' && el.getBoundingClientRect().right > vw + 1
      );
      if (wide.length) console.warn('[Lost & Found] elements wider than the screen:', wide.slice(0, 8));
    };
    const t = setTimeout(check, 800);
    window.addEventListener('resize', check);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', check);
    };
  }, []);

  // Items matching search, category and claimed filter (before the tab is applied, so tab counts stay accurate)
  const baseFiltered = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    return lostItems.filter((i) => {
      if (hideClaimed && i.status === 'claimed') return false;
      if (categoryFilter !== 'all' && i.category !== categoryFilter) return false;
      if (!terms.length) return true;
      const haystack = [
        i.title,
        i.description,
        i.locationFound,
        i.venueName,
        i.handoverPoint,
        CATEGORY_LABEL[i.category] ?? i.category,
      ]
        .join(' ')
        .toLowerCase();
      return terms.every((t) => haystack.includes(t));
    });
  }, [lostItems, query, categoryFilter, hideClaimed]);

  const filteredItems = useMemo(
    () => baseFiltered.filter((i) => activeTab === 'all' || i.type === activeTab),
    [baseFiltered, activeTab]
  );

  const counts = {
    all: baseFiltered.length,
    found: baseFiltered.filter((i) => i.type === 'found').length,
    lost: baseFiltered.filter((i) => i.type === 'lost').length,
  };

  const filtersActive = query.trim() !== '' || categoryFilter !== 'all' || hideClaimed || activeTab !== 'all';
  const clearFilters = () => {
    setQuery('');
    setCategoryFilter('all');
    setHideClaimed(false);
    setActiveTab('all');
  };

  // Preview navigation (cycles through the currently filtered list)
  const previewIndex = filteredItems.findIndex((i) => i.id === previewId);
  const previewItem = previewIndex >= 0 ? filteredItems[previewIndex] : null;

  const stepPreview = useCallback(
    (dir: -1 | 1) => {
      if (filteredItems.length < 2 || previewIndex < 0) return;
      setPreviewId(filteredItems[(previewIndex + dir + filteredItems.length) % filteredItems.length].id);
    },
    [filteredItems, previewIndex]
  );

  useEffect(() => {
    if (!previewItem) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') stepPreview(-1);
      if (e.key === 'ArrowRight') stepPreview(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [previewItem, stepPreview]);

  /* ---------- Handlers ---------- */

  const handlePhoto = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setPhotoError('Choose an image file.');
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError('Photo is larger than 3 MB. Choose a smaller one.');
      return;
    }
    setPhotoError('');
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (itemTitle.trim().length < 3) next.title = 'Enter what the item is (at least 3 characters).';
    if (!locationFound.trim()) next.location = 'Enter where it was lost or found.';
    if (reporterNameInput.trim().length < 2) next.name = 'Enter your full name.';
    if (!verificationQuestion.trim()) next.question = 'Add a question only the real owner can answer.';
    setErrors(next);
    if (Object.keys(next).length) return;

    const chosenVenue = venues.find((v) => v.id === venueId);

    reportLostFoundItem({
      type: reportType,
      title: itemTitle.trim(),
      category,
      description,
      locationFound: locationFound.trim(),
      venueId,
      venueName: chosenVenue?.name || 'Science Complex Auditorium',
      verificationQuestion: verificationQuestion.trim(),
      handoverPoint,
      reportedByUserId: user.id,
      reporterName: reporterNameInput.trim(),
      photoUrl: photoPreview || libraryHallPhoto,
    });

    setToast(`Report published: ${itemTitle.trim()}`);
    setReporterNameInput('');
    setErrors({});
    setPhotoPreview(null);
    setPhotoError('');
    setShowReportModal(false);
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimingItem || !claimAnswer.trim() || claimerName.trim().length < 2) return;

    // The store's submitClaim takes (id, answer), so the claimant's name travels with the answer.
    submitClaim(claimingItem.id, `Claimant: ${claimerName.trim()}\nAnswer: ${claimAnswer.trim()}`);
    setToast(`Claim sent to security for ${claimingItem.title}`);
    setClaimingItem(null);
    setClaimAnswer('');
    setClaimerName('');
  };

  const startClaim = (item: LostFoundItem) => {
    setClaimAnswer('');
    setClaimerName('');
    setPreviewId(null);
    setClaimingItem(item);
  };

  // Swipe left/right on the preview image to move between items on touch screens
  const onPreviewTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onPreviewTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > SWIPE_THRESHOLD_PX) stepPreview(dx < 0 ? 1 : -1);
  };

  // text-base on phones stops iOS Safari zooming into focused fields; smaller text from sm up
  const inputCls =
    'w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-base sm:text-sm';
  const textareaCls =
    'w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-base sm:text-sm';
  const tabCls = (on: boolean, activeBg: string) =>
    `px-1.5 py-2.5 sm:px-3 sm:py-1.5 text-center sm:whitespace-nowrap rounded-lg text-[11px] sm:text-xs font-bold transition ${
      on ? `${activeBg} text-white shadow-xs` : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
    }`;
  const stickyFooter =
    'sticky bottom-0 -mx-4 -mb-4 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:-mx-6 sm:-mb-6 sm:px-6 bg-white dark:bg-[#0C1D3D] border-t border-slate-100 dark:border-slate-800 flex gap-2 sm:justify-end';
  const footerBtn = 'flex-1 sm:flex-none min-h-11 sm:min-h-0';

  return (
    <div className="space-y-5 sm:space-y-6 w-full max-w-full min-w-0 overflow-x-clip">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#071B4A] dark:text-white">Campus Lost & Found</h1>
            <Badge variant="academic">Baraton Security Integrated</Badge>
          </div>
          <p className="text-xs text-[#5B6475] dark:text-slate-400 mt-1">
            Automated image matching, verification ownership questions, and secure campus hand-over points.
          </p>
        </div>

        <Button
          size="sm"
          variant="gold"
          onClick={() => setShowReportModal(true)}
          className="text-xs font-bold w-full sm:w-auto min-h-11 sm:min-h-0 justify-center shrink-0"
        >
          <Camera className="w-3.5 h-3.5 mr-1.5" />
          Report Lost or Found Item
        </Button>
      </div>

      {/* 14-Day Escalation Policy Strip */}
      <div className="p-3 bg-[#EEF2F6] dark:bg-slate-800 border border-[#E3E8F0] dark:border-slate-700 rounded-xl flex items-start sm:items-center gap-3 text-xs text-[#0B2A6F] dark:text-slate-200">
        <Clock className="w-4 h-4 text-[#0B2A6F] dark:text-[#F2B705] shrink-0 mt-0.5 sm:mt-0" />
        <div className="flex-1 min-w-0">
          <span className="font-bold">14-Day Institutional Custody Rule: </span>
          Unclaimed items logged past 14 days are officially transferred to the Head of Campus Security for vault
          storage and registrar cataloging.
        </div>
      </div>

      {/* Search + filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchRef}
            type="search"
            enterKeyHint="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search lost and found items"
            placeholder="Search items, places or desks"
            className={`${inputCls} pl-9 pr-11`}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                searchRef.current?.focus();
              }}
              aria-label="Clear search"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          {/* Three equal columns on phones (no sideways scrolling), inline row from sm up */}
          <div className="grid grid-cols-3 gap-2 w-full sm:w-auto sm:flex sm:flex-wrap">
            <button onClick={() => setActiveTab('all')} className={tabCls(activeTab === 'all', 'bg-[#0B2A6F]')}>
              <span className="sm:hidden">All</span>
              <span className="hidden sm:inline">All Items</span> ({counts.all})
            </button>
            <button onClick={() => setActiveTab('found')} className={tabCls(activeTab === 'found', 'bg-[#16A34A]')}>
              <span className="sm:hidden">Found</span>
              <span className="hidden sm:inline">Found Items</span> ({counts.found})
            </button>
            <button onClick={() => setActiveTab('lost')} className={tabCls(activeTab === 'lost', 'bg-[#DC2626]')}>
              <span className="sm:hidden">Lost</span>
              <span className="hidden sm:inline">Reported Lost</span> ({counts.lost})
            </button>
          </div>

          <div className="flex items-center gap-3 sm:contents">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
              className="h-10 sm:h-8 min-w-0 max-w-full flex-1 sm:flex-none px-2 rounded-lg text-base sm:text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 sm:ml-auto"
            >
              <option value="all">All categories</option>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-1.5 shrink-0 min-h-10 sm:min-h-0 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={hideClaimed}
                onChange={(e) => setHideClaimed(e.target.checked)}
                className="w-4 h-4 accent-[#0B2A6F]"
              />
              Hide claimed
            </label>
          </div>
        </div>

        <p className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1" aria-live="polite">
          {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
          {filtersActive && (
            <button onClick={clearFilters} className="py-1.5 font-bold text-[#0B2A6F] dark:text-[#F2B705] underline">
              Clear filters
            </button>
          )}
          <span className="hidden md:inline text-slate-400 ml-auto">Press / to search</span>
        </p>
      </div>

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 w-full min-w-0">
          {filteredItems.map((item) => (
            <Card key={item.id} padding="none" hoverable className="overflow-hidden flex flex-col justify-between min-w-0">
              {/* Image opens the preview pop-up */}
              <button
                type="button"
                onClick={() => setPreviewId(item.id)}
                aria-haspopup="dialog"
                aria-label={`Preview ${item.title}`}
                className="relative h-28 sm:h-40 bg-slate-900 overflow-hidden block w-full text-left focus-visible:outline-2 focus-visible:outline-[#F2B705]"
              >
                <ItemImage item={item} />
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-wrap items-center gap-1 sm:gap-2">
                  <Badge
                    variant={item.type === 'found' ? 'done' : 'urgent'}
                    className="font-bold uppercase tracking-wider text-[9px] sm:text-xs"
                  >
                    {item.type}
                  </Badge>
                  {item.status === 'claimed' && (
                    <Badge variant="academic" className="text-[9px] sm:text-xs">
                      Claimed ✓
                    </Badge>
                  )}
                </div>
              </button>

              {/* Content */}
              <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#071B4A] dark:text-white leading-snug mb-1 [overflow-wrap:anywhere] line-clamp-2">
                    <button type="button" onClick={() => setPreviewId(item.id)} className="text-left hover:underline">
                      <Highlight text={item.title} query={query} />
                    </button>
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#5B6475] dark:text-slate-300 line-clamp-2 leading-relaxed mb-2 sm:mb-3 [overflow-wrap:anywhere]">
                    <Highlight text={item.description} query={query} />
                  </p>

                  {/* Match Suggestion Chip (Demo Flow 6): shorter wording on phones */}
                  {item.matchSuggestions && item.matchSuggestions.length > 0 && (
                    <div className="p-2 sm:p-2.5 mb-2 sm:mb-3 bg-[#FEF3C7] dark:bg-[#78350F]/30 border border-[#F59E0B]/30 rounded-lg text-[10px] sm:text-xs text-[#92400E] dark:text-[#FCD34D] flex items-center gap-2">
                      <Sparkles className="hidden sm:block w-4 h-4 text-[#D97706] shrink-0" />
                      <div className="min-w-0 [overflow-wrap:anywhere] line-clamp-2">
                        <span className="font-bold">
                          Match<span className="hidden sm:inline"> Detected (94% confidence)</span>:{' '}
                        </span>
                        {item.matchSuggestions[0].title}
                      </div>
                    </div>
                  )}

                  <div className="space-y-1 sm:space-y-1.5 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-start gap-1 sm:gap-1.5">
                      <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-0.5 text-[#0B2A6F] dark:text-[#F2B705] shrink-0" />
                      <span className="min-w-0 [overflow-wrap:anywhere] line-clamp-2">
                        <Highlight text={item.locationFound} query={query} />
                      </span>
                    </div>
                    <div className="flex items-start gap-1 sm:gap-1.5 text-[#DC2626] font-semibold">
                      <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-0.5 shrink-0" />
                      <span className="min-w-0 [overflow-wrap:anywhere] line-clamp-2">Pick-up: {item.handoverPoint}</span>
                    </div>
                  </div>
                </div>

                {/* Actions: reporter on top, full-width button below, so it fits in a two-column grid */}
                <div className="pt-2 sm:pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2 mt-3 sm:mt-4">
                  <span className="text-[10px] sm:text-[11px] text-slate-500 truncate min-w-0">
                    Reported by {item.reporterName}
                  </span>

                  {item.status !== 'claimed' ? (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => startClaim(item)}
                      className="text-[11px] sm:text-xs w-full min-h-10 sm:min-h-0"
                    >
                      <span className="sm:hidden">Claim item</span>
                      <span className="hidden sm:inline">Answer Verification & Claim</span>
                    </Button>
                  ) : (
                    <span className="text-[11px] sm:text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 shrink-0" /> Returned to Owner
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-14 px-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
          <SearchCheck className="w-10 h-10 mx-auto text-slate-400 mb-3" />
          <h2 className="text-base font-bold text-[#071B4A] dark:text-white">
            {filtersActive ? 'No items match your search' : 'No items reported yet'}
          </h2>
          <p className="text-xs text-slate-500 mt-1 mb-4 max-w-sm mx-auto">
            {filtersActive
              ? 'Try fewer words or another category. If your item is not listed, report it so the finder can reach you.'
              : 'Be the first to report a lost or found item.'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-2 max-w-xs sm:max-w-none mx-auto">
            {filtersActive && (
              <Button size="sm" variant="ghost" onClick={clearFilters} className="text-xs min-h-11 sm:min-h-0">
                Clear filters
              </Button>
            )}
            <Button
              size="sm"
              variant="gold"
              onClick={() => setShowReportModal(true)}
              className="text-xs font-bold min-h-11 sm:min-h-0"
            >
              Report Lost or Found Item
            </Button>
          </div>
        </div>
      )}

      {/* Item Preview Pop-up */}
      {previewItem && (
        <Modal label={`Preview of ${previewItem.title}`} onClose={() => setPreviewId(null)} maxWidth="sm:max-w-xl">
          <div
            className="relative h-52 sm:h-64 bg-slate-900 overflow-hidden rounded-t-2xl"
            onTouchStart={onPreviewTouchStart}
            onTouchEnd={onPreviewTouchEnd}
          >
            <ItemImage item={previewItem} />
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <Badge variant={previewItem.type === 'found' ? 'done' : 'urgent'} className="font-bold uppercase tracking-wider">
                {previewItem.type}
              </Badge>
              {previewItem.status === 'claimed' && <Badge variant="academic">Claimed ✓</Badge>}
            </div>
            <button
              type="button"
              onClick={() => setPreviewId(null)}
              aria-label="Close preview"
              className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              <X className="w-4 h-4" />
            </button>
            {filteredItems.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => stepPreview(-1)}
                  aria-label="Previous item"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => stepPreview(1)}
                  aria-label="Next item"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          <div className="p-5 sm:p-6 space-y-4">
            <div>
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold text-[#071B4A] dark:text-white leading-snug [overflow-wrap:anywhere] min-w-0">
                  {previewItem.title}
                </h3>
                <span className="text-[11px] text-slate-500 shrink-0 mt-1">
                  {previewIndex + 1} of {filteredItems.length}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{CATEGORY_LABEL[previewItem.category] ?? previewItem.category}</p>
            </div>

            <p className="text-sm text-[#5B6475] dark:text-slate-300 leading-relaxed [overflow-wrap:anywhere]">
              {previewItem.description || 'No description added.'}
            </p>

            {previewItem.matchSuggestions && previewItem.matchSuggestions.length > 0 && (
              <div className="p-2.5 bg-[#FEF3C7] dark:bg-[#78350F]/30 border border-[#F59E0B]/30 rounded-lg text-xs text-[#92400E] dark:text-[#FCD34D] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D97706] shrink-0" />
                <div className="min-w-0 [overflow-wrap:anywhere]">
                  <span className="font-bold">Match Detected (94% confidence): </span>
                  {previewItem.matchSuggestions[0].title}
                </div>
              </div>
            )}

            <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 text-xs [&>dd]:min-w-0 [&>dd]:[overflow-wrap:anywhere]">
              <dt className="text-slate-500">Venue</dt>
              <dd className="font-semibold">{previewItem.venueName}</dd>
              <dt className="text-slate-500">{previewItem.type === 'found' ? 'Found at' : 'Last seen at'}</dt>
              <dd className="font-semibold">{previewItem.locationFound}</dd>
              <dt className="text-slate-500">Pick-up desk</dt>
              <dd className="font-semibold text-[#DC2626]">{previewItem.handoverPoint}</dd>
              <dt className="text-slate-500">Reported by</dt>
              <dd className="font-semibold">{previewItem.reporterName}</dd>
            </dl>

            {filteredItems.length > 1 && (
              <p className="text-[11px] text-slate-400 sm:hidden">Swipe the photo to see the next item.</p>
            )}

            {/* Sticky so the claim button stays reachable on long previews */}
            <div className="sticky bottom-0 -mx-5 sm:-mx-6 -mb-5 sm:-mb-6 px-5 sm:px-6 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-3 bg-white dark:bg-[#0C1D3D] border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400 hidden sm:block">Use ← → to browse, Esc to close</span>
              <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
                <Button type="button" variant="ghost" onClick={() => setPreviewId(null)} className={footerBtn}>
                  Close
                </Button>
                {previewItem.status !== 'claimed' ? (
                  <Button type="button" variant="primary" onClick={() => startClaim(previewItem)} className={footerBtn}>
                    {previewItem.type === 'found' ? 'This is mine: claim' : 'I found this: claim'}
                  </Button>
                ) : (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 px-2">
                    <CheckCircle2 className="w-4 h-4" /> Returned to Owner
                  </span>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Camera-First Report Modal */}
      {showReportModal && (
        <Modal label="Report lost or found item" onClose={() => setShowReportModal(false)}>
          <div className="p-4 sm:p-6">
            <div className="flex items-start justify-between gap-3 mb-1">
              <h3 className="text-lg font-bold">Report Lost or Found Item</h3>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                aria-label="Close form"
                className="-mt-1 -mr-2 w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Add a photograph and a secret verification question so the real owner can verify ownership.
            </p>

            <form onSubmit={handleReportSubmit} className="space-y-4" noValidate>
              {/* Type Switch */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <button
                  type="button"
                  onClick={() => setReportType('found')}
                  className={`py-2.5 sm:py-2 text-xs font-bold rounded-md transition ${
                    reportType === 'found' ? 'bg-[#16A34A] text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  I Found An Item
                </button>
                <button
                  type="button"
                  onClick={() => setReportType('lost')}
                  className={`py-2.5 sm:py-2 text-xs font-bold rounded-md transition ${
                    reportType === 'lost' ? 'bg-[#DC2626] text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  I Lost An Item
                </button>
              </div>

              {/* Camera-first photo capture */}
              <div>
                <label className="block text-xs font-bold mb-1">Photo</label>
                {photoPreview ? (
                  <div className="relative">
                    <img src={photoPreview} alt="Selected item" className="w-full h-40 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(null)}
                      aria-label="Remove photo"
                      className="absolute top-2 right-2 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-1 h-28 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 text-xs text-slate-500 cursor-pointer hover:border-[#0B2A6F] focus-within:border-[#0B2A6F]">
                    <Camera className="w-6 h-6" />
                    <span className="font-bold">Take a photo or choose one</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => handlePhoto(e.target.files?.[0])}
                      className="sr-only"
                    />
                  </label>
                )}
                {photoError && (
                  <p role="alert" className="text-[11px] text-[#DC2626] mt-1">
                    {photoError}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="lf-title" className="block text-xs font-bold mb-1">
                  Item Title
                </label>
                <input
                  id="lf-title"
                  type="text"
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  placeholder="e.g. Blue Lenovo 65W Laptop Charger"
                  aria-invalid={!!errors.title}
                  className={inputCls}
                />
                {errors.title && (
                  <p role="alert" className="text-[11px] text-[#DC2626] mt-1">
                    {errors.title}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as LostFoundItem['category'])}
                    className={inputCls}
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Campus Venue</label>
                  <select value={venueId} onChange={(e) => setVenueId(e.target.value)} className={inputCls}>
                    {venues.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="lf-location" className="block text-xs font-bold mb-1">
                  Precise Location Found / Lost
                </label>
                <input
                  id="lf-location"
                  type="text"
                  value={locationFound}
                  onChange={(e) => setLocationFound(e.target.value)}
                  placeholder="e.g. Science Complex 1st floor cubicle 4"
                  aria-invalid={!!errors.location}
                  className={inputCls}
                />
                {errors.location && (
                  <p role="alert" className="text-[11px] text-[#DC2626] mt-1">
                    {errors.location}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="lf-description" className="block text-xs font-bold mb-1">
                  Description
                </label>
                <textarea
                  id="lf-description"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Colour, brand, marks. Keep the secret detail for the question below."
                  className={textareaCls}
                />
              </div>

              {/* Reporter name */}
              <div>
                <label htmlFor="lf-name" className="block text-xs font-bold mb-1">
                  Your Full Name
                </label>
                <input
                  id="lf-name"
                  type="text"
                  value={reporterNameInput}
                  onChange={(e) => setReporterNameInput(e.target.value)}
                  placeholder="Write your full name"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  className={inputCls}
                />
                {errors.name && (
                  <p role="alert" className="text-[11px] text-[#DC2626] mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Secret Verification Question */}
              <div className="p-3 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl space-y-2">
                <label htmlFor="lf-question" className="block text-xs font-bold text-amber-900 dark:text-amber-200">
                  Secret Verification Question (Crucial Anti-Fraud Step)
                </label>
                <input
                  id="lf-question"
                  type="text"
                  value={verificationQuestion}
                  onChange={(e) => setVerificationQuestion(e.target.value)}
                  placeholder="e.g. What color is the lanyard? Or what sticker is on the lid?"
                  aria-invalid={!!errors.question}
                  className="w-full h-11 px-3 rounded-lg bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 text-base sm:text-xs text-slate-900 dark:text-white"
                />
                {errors.question && (
                  <p role="alert" className="text-[11px] text-[#DC2626]">
                    {errors.question}
                  </p>
                )}
                <p className="text-[10px] text-amber-700 dark:text-amber-400">
                  Only the genuine owner should know the exact answer to this question.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Designated Handover Desk</label>
                <select value={handoverPoint} onChange={(e) => setHandoverPoint(e.target.value)} className={inputCls}>
                  {HANDOVER_POINTS.map((hp) => (
                    <option key={hp} value={hp}>
                      {hp}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sticky so Publish is always in reach on small screens */}
              <div className={stickyFooter}>
                <Button type="button" variant="ghost" onClick={() => setShowReportModal(false)} className={footerBtn}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className={footerBtn}>
                  Publish Report<span className="hidden sm:inline"> & Run AI Matcher</span>
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* Claim & Answer Verification Modal (Demo Flow 6) */}
      {claimingItem && (
        <Modal label="Claim item verification" onClose={() => setClaimingItem(null)} maxWidth="sm:max-w-md">
          <div className="p-4 sm:p-6">
            <div className="flex items-start justify-between gap-3 mb-1">
              <h3 className="text-lg font-bold">Claim Item Verification</h3>
              <button
                type="button"
                onClick={() => setClaimingItem(null)}
                aria-label="Close form"
                className="-mt-1 -mr-2 w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4 [overflow-wrap:anywhere]">
              To reclaim <strong>{claimingItem.title}</strong>, answer the security question asked by the finder.
            </p>

            <form onSubmit={handleClaimSubmit} className="space-y-4">
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Verification Question:</span>
                <p className="text-xs font-bold text-[#071B4A] dark:text-white [overflow-wrap:anywhere]">
                  "{claimingItem.verificationQuestion}"
                </p>
              </div>

              <div>
                <label htmlFor="lf-answer" className="block text-xs font-bold mb-1">
                  Your Detailed Answer
                </label>
                <textarea
                  id="lf-answer"
                  rows={3}
                  value={claimAnswer}
                  onChange={(e) => setClaimAnswer(e.target.value)}
                  placeholder="Describe the exact color, unique marks, sticker or serial number..."
                  required
                  className={textareaCls}
                />
              </div>

              <div>
                <label htmlFor="lf-claimer" className="block text-xs font-bold mb-1">
                  Your Full Name
                </label>
                <input
                  id="lf-claimer"
                  type="text"
                  value={claimerName}
                  onChange={(e) => setClaimerName(e.target.value)}
                  placeholder="Write your full name"
                  autoComplete="name"
                  required
                  minLength={2}
                  className={inputCls}
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Security will ask for this name and a photo ID when you collect the item.
                </p>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                <MapPin className="w-4 h-4 mt-0.5 text-[#0B2A6F] dark:text-[#F2B705] shrink-0" />
                <span className="min-w-0 [overflow-wrap:anywhere]">
                  Collection location: <strong>{claimingItem.handoverPoint}</strong>
                </span>
              </div>

              <div className={stickyFooter}>
                <Button type="button" variant="ghost" onClick={() => setClaimingItem(null)} className={footerBtn}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className={footerBtn}>
                  Submit Claim<span className="hidden sm:inline"> to Security</span>
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* Toast */}
      <div
        role="status"
        aria-live="polite"
        className={`fixed left-1/2 -translate-x-1/2 bottom-[calc(5rem+env(safe-area-inset-bottom))] md:bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-[60] w-max max-w-[90vw] text-center px-4 py-2.5 rounded-lg bg-[#071B4A] text-white text-xs font-bold shadow-xl transition ${
          toast ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {toast}
      </div>
    </div>
  );
};
