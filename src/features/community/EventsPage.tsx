import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, CheckCircle2, Clock, MapPin, QrCode, Search, Users } from 'lucide-react';
import { useKampasStore } from '../../lib/store';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ImageWithFallback } from '../../components/ui/ImageWithFallback';
import { formatDateTime } from '../../lib/utils';
import { CampusEvent } from '../../lib/types';
import { CommunityShell, CommunitySubNav, PageHeader } from './components/CommunityLayout';

export const EventsPage: React.FC = () => {
  const { events, toggleEventRSVP, checkInEvent } = useKampasStore();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);
  const [qrModalEvent, setQrModalEvent] = useState<CampusEvent | null>(null);

  const filteredEvents = useMemo(() => events.filter((event) => {
    const matchesCategory = activeCategory === 'all' || event.category === activeCategory;
    const query = search.toLowerCase();
    return matchesCategory && `${event.title} ${event.venueName} ${event.organizerName}`.toLowerCase().includes(query);
  }), [activeCategory, events, search]);

  return (
    <CommunityShell>
      <PageHeader title="Campus events & chapel" description="Find academic, spiritual, sports, social, and career events around Baraton." />
      <CommunitySubNav />
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-[#0C1D3D] sm:flex-row">
        <label className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search events or venues" className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-xs outline-none focus:ring-2 focus:ring-[#F2B705] dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
        </label>
        <div className="flex gap-1.5 overflow-x-auto">
          {['all', 'academic', 'chapel', 'sports', 'career', 'social'].map((category) => <button key={category} type="button" onClick={() => setActiveCategory(category)} className={`min-h-10 shrink-0 rounded-lg px-3 text-xs font-bold capitalize ${activeCategory === category ? 'bg-[#0B2A6F] text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{category}</button>)}
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <div className="space-y-3">
          <div className="flex items-center justify-between"><h2 className="text-lg font-black text-[#071B4A] dark:text-white">Event list</h2><span className="text-xs text-slate-500">{filteredEvents.length} results</span></div>
          {filteredEvents.map((event) => (
            <button type="button" key={event.id} onClick={() => setSelectedEvent(event)} className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md ${selectedEvent?.id === event.id ? 'border-[#0B2A6F] bg-blue-50/50 dark:border-[#F2B705] dark:bg-blue-950/20' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-[#0C1D3D]'}`}>
              <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-[#0B2A6F] text-white"><CalendarDays className="h-4 w-4 text-[#F2B705]" /><span className="tabular-nums text-sm font-black">{new Date(event.startTime).getDate()}</span><span className="text-[9px] uppercase">{new Date(event.startTime).toLocaleDateString('en-GB', { month: 'short' })}</span></div>
              <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><Badge variant="academic">{event.category}</Badge>{event.isRsvpd && <Badge variant="done">Going</Badge>}</div><h3 className="mt-1 line-clamp-1 text-sm font-bold text-[#071B4A] dark:text-white">{event.title}</h3><p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" />{event.venueName}</p></div>
              <span className="hidden text-xs font-semibold text-slate-500 sm:block">{formatDateTime(event.startTime)}</span>
            </button>
          ))}
        </div>
        <div className="lg:sticky lg:top-4 lg:self-start">
          {selectedEvent ? (
            <Card padding="none" className="overflow-hidden">
              <div className="relative aspect-[16/10]"><ImageWithFallback src={selectedEvent.posterUrl} alt={selectedEvent.title} fallbackTitle={selectedEvent.title} containerClassName="h-full w-full bg-slate-100 dark:bg-slate-800" className="h-full w-full object-cover" loading="lazy" decoding="async" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" /><div className="absolute bottom-4 left-4 right-4 text-white"><Badge variant="academic" className="bg-white/90 text-[#071B4A]">{selectedEvent.category}</Badge><h2 className="mt-2 text-xl font-black">{selectedEvent.title}</h2></div></div>
              <div className="space-y-4 p-5"><p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{selectedEvent.description}</p><div className="space-y-2 text-xs text-slate-500"><p className="flex items-center gap-2"><Clock className="h-4 w-4 text-[#0B2A6F] dark:text-[#F2B705]" />{formatDateTime(selectedEvent.startTime)}</p><p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#0B2A6F] dark:text-[#F2B705]" />{selectedEvent.venueName}</p><p className="flex items-center gap-2"><Users className="h-4 w-4 text-[#0B2A6F] dark:text-[#F2B705]" />Organized by {selectedEvent.organizerName}</p></div><Link to={`/campus/map?venue=${selectedEvent.venueId ?? ''}`} className="inline-block text-xs font-bold text-[#0B2A6F] underline dark:text-[#F2B705]">Get directions</Link><div><div className="mb-1 flex justify-between text-[11px] font-semibold text-slate-500"><span>Capacity</span><span>{selectedEvent.currentRsvps}{selectedEvent.maxCapacity ? ` / ${selectedEvent.maxCapacity}` : ''}</span></div><div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${selectedEvent.maxCapacity ? Math.min(100, (selectedEvent.currentRsvps / selectedEvent.maxCapacity) * 100) : 40}%` }} /></div></div><div className="flex gap-2"><Button onClick={() => toggleEventRSVP(selectedEvent.id)} className="flex-1">{selectedEvent.isRsvpd ? <><CheckCircle2 className="h-4 w-4" />Going</> : 'RSVP now'}</Button>{selectedEvent.isRsvpd && <Button variant="secondary" aria-label="Show check-in QR code" onClick={() => setQrModalEvent(selectedEvent)}><QrCode className="h-4 w-4" /></Button>}</div></div>
            </Card>
          ) : <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700">Select an event to view details.</div>}
        </div>
      </div>
      {qrModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl dark:bg-[#0C1D3D]">
            <h2 className="text-lg font-black text-[#071B4A] dark:text-white">Event entry pass</h2>
            <p className="mt-1 text-xs text-slate-500">{qrModalEvent.title}</p>
            <div className="mx-auto my-5 flex h-48 w-48 items-center justify-center rounded-xl border-2 border-[#0B2A6F] bg-white p-3">
              <QrCode className="h-full w-full text-[#071B4A]" />
            </div>
            <p className="text-xs text-slate-500">Show this pass at the venue entrance desk.</p>
            <div className="mt-4 flex gap-2">
              <Button variant="ghost" className="flex-1" onClick={() => setQrModalEvent(null)}>Close</Button>
              <Button variant="gold" className="flex-1" onClick={() => { checkInEvent(qrModalEvent.id); setQrModalEvent(null); }}><CheckCircle2 className="h-4 w-4" />Check in</Button>
            </div>
          </div>
        </div>
      )}
    </CommunityShell>
  );
};
