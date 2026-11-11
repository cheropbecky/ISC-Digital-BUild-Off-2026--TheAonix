import React from 'react';
import { CalendarDays, Check, Clock3, MapPin, Users } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { ImageWithFallback } from '../../../components/ui/ImageWithFallback';
import { CommunityEvent, CommunityItem, EventStatus } from '../../../data/communityModule';

export const CommunitySubNav: React.FC = () => (
  <nav aria-label="Community navigation" className="flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white/80 p-1 dark:border-slate-700 dark:bg-slate-900/80">
    {[
      ['Hub', '/community'],
      ['Events', '/community/events'],
      ['Clubs', '/community/clubs'],
      ['Opportunities', '/community/opportunities'],
    ].map(([label, href]) => (
      <a key={href} href={href} className={`min-h-10 shrink-0 rounded-lg px-3 py-2 text-xs font-bold transition hover:bg-[#0B2A6F]/10 ${href === '/community' ? 'bg-[#0B2A6F] text-white' : 'text-slate-600 dark:text-slate-300'}`}>
        {label}
      </a>
    ))}
  </nav>
);

export const CapacityBar: React.FC<{ current: number; capacity: number }> = ({ current, capacity }) => {
  const percentage = Math.min(100, Math.round((current / capacity) * 100));
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[11px] font-semibold text-slate-500">
        <span>Capacity</span>
        <span className="tabular-nums">{current} of {capacity} spots</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className={`h-full rounded-full ${percentage >= 100 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

export const DateChip: React.FC<{ value: string }> = ({ value }) => {
  const date = new Date(value);
  return (
    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-[#0B2A6F] text-white">
      <span className="text-[10px] font-bold uppercase text-blue-200">{date.toLocaleDateString('en-GB', { month: 'short' })}</span>
      <span className="tabular-nums text-lg font-black leading-none">{date.getDate()}</span>
    </div>
  );
};

const categoryVariant = (status: EventStatus): 'done' | 'neutral' | 'academic' => status === 'ongoing' ? 'done' : status === 'past' ? 'neutral' : 'academic';

export const EventCard: React.FC<{
  event: CommunityEvent;
  status: EventStatus;
  isRsvped: boolean;
  isWaitlisted: boolean;
  onSelect: () => void;
  onRsvp: () => void;
}> = ({ event, status, isRsvped, isWaitlisted, onSelect, onRsvp }) => {
  const full = event.rsvps >= event.capacity;
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-within:ring-2 focus-within:ring-[#F2B705] dark:border-slate-700 dark:bg-[#0C1D3D]">
      <button type="button" onClick={onSelect} className="relative aspect-[16/10] w-full overflow-hidden text-left focus:outline-none">
        <ImageWithFallback src={event.posterUrl} alt={event.imageAlt} fallbackTitle={event.title} containerClassName="h-full w-full bg-slate-100 dark:bg-slate-800" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute left-3 top-3"><Badge variant="academic" className="bg-white/90 text-[#071B4A]">{event.category}</Badge></div>
        <div className="absolute right-3 top-3"><Badge variant={categoryVariant(status)} showDot={status === 'ongoing'}>{status === 'ongoing' ? 'Live now' : status}</Badge></div>
        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
          <DateChip value={event.start} />
          <span className="text-xs font-semibold">{new Date(event.start).toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit' })}</span>
        </div>
      </button>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <button type="button" onClick={onSelect} className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2B705]">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[#071B4A] dark:text-white">{event.title}</h3>
        </button>
        <div className="space-y-1.5 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-[#0B2A6F] dark:text-[#F2B705]" />{new Date(event.start).toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit' })}</span>
          <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[#0B2A6F] dark:text-[#F2B705]" />{event.venue}</span>
        </div>
        <CapacityBar current={event.rsvps} capacity={event.capacity} />
        {status !== 'past' && <Button size="sm" variant={isRsvped ? 'secondary' : isWaitlisted || full ? 'gold' : 'primary'} onClick={onRsvp} className="mt-auto w-full">{isRsvped ? <><Check className="h-3.5 w-3.5" />Going</> : isWaitlisted || full ? 'Join waitlist' : 'RSVP now'}</Button>}
      </div>
    </article>
  );
};

export const CommunityCard: React.FC<{ item: CommunityItem; onAction: () => void }> = ({ item, onAction }) => (
  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-[#0C1D3D]">
    <div className="relative aspect-[16/10] overflow-hidden">
      <ImageWithFallback src={item.imageUrl} alt={item.imageAlt} fallbackTitle={item.title} containerClassName="h-full w-full bg-slate-100 dark:bg-slate-800" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-3 left-3"><Badge variant="academic" className="bg-white/90 text-[#071B4A]">{item.category}</Badge></div>
    </div>
    <div className="flex flex-1 flex-col gap-3 p-4">
      <div>
        <h3 className="line-clamp-2 text-sm font-bold text-[#071B4A] dark:text-white">{item.title}</h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{item.description}</p>
      </div>
      <p className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500"><Users className="h-3.5 w-3.5" />{item.meta}</p>
      <Button size="sm" variant="secondary" onClick={onAction} className="mt-auto w-full">{item.actionLabel}</Button>
    </div>
  </article>
);

export const EmptyState: React.FC<{ message: string; onClear: () => void }> = ({ message, onClear }) => (
  <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
    <CalendarDays className="mx-auto h-8 w-8 text-slate-400" />
    <p className="mt-3 text-sm text-slate-500">{message}</p>
    <Button size="sm" variant="ghost" onClick={onClear} className="mt-3">Clear filters</Button>
  </div>
);
