import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { COMMUNITY_EVENTS, COMMUNITY_ITEMS, CommunityCategory, EventCategory, getEventStatus, UEAB_SCHOOLS } from '../../data/communityModule';
import { IMAGES } from '../../data/images';
import { CommunityCard, CommunitySubNav, EmptyState, EventCard } from './components/CommunityPrimitives';

type MainTab = 'community' | 'events';
const eventCategories: Array<'all' | EventCategory> = ['all', 'academic', 'chapel', 'sports', 'social', 'career'];
const communityCategories: Array<'all' | CommunityCategory> = ['all', 'Clubs', 'Opportunities'];

export const CommunityEventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [selectedEvent, setSelectedEvent] = useState<typeof COMMUNITY_EVENTS[number] | null>(null);
  const [pastExpanded, setPastExpanded] = useState(false);
  const [rsvpedIds, setRsvpedIds] = useState<string[]>([]);
  const [waitlistedIds, setWaitlistedIds] = useState<string[]>([]);

  const activeTab = (params.get('tab') as MainTab | null) === 'events' ? 'events' : 'community';
  const school = params.get('school') ?? 'all';
  const search = params.get('q') ?? '';
  const eventCategory = (params.get('eventCategory') as 'all' | EventCategory | null) ?? 'all';
  const communityCategory = (params.get('communityCategory') as 'all' | CommunityCategory | null) ?? 'all';

  const updateFilters = (updates: Record<string, string>) => {
    const next = new URLSearchParams(params);
    Object.entries(updates).forEach(([key, value]) => value === 'all' || value === '' ? next.delete(key) : next.set(key, value));
    setParams(next);
  };

  useEffect(() => {
    if (activeTab === 'community' && eventCategory !== 'all') updateFilters({ eventCategory: 'all' });
    if (activeTab === 'events' && communityCategory !== 'all') updateFilters({ communityCategory: 'all' });
  }, [activeTab]);

  const filteredEvents = useMemo(() => COMMUNITY_EVENTS.filter((event) => {
    const haystack = `${event.title} ${event.description} ${event.venue}`.toLowerCase();
    return (school === 'all' || event.school === school) &&
      (eventCategory === 'all' || event.category === eventCategory) &&
      haystack.includes(search.toLowerCase());
  }), [eventCategory, school, search]);

  const filteredCommunity = useMemo(() => COMMUNITY_ITEMS.filter((item) => {
    const haystack = `${item.title} ${item.description} ${item.meta}`.toLowerCase();
    return (school === 'all' || item.school === school) &&
      (communityCategory === 'all' || item.category === communityCategory) &&
      haystack.includes(search.toLowerCase());
  }), [communityCategory, school, search]);

  const groupedEvents = {
    upcoming: filteredEvents.filter((event) => getEventStatus(event) === 'upcoming'),
    ongoing: filteredEvents.filter((event) => getEventStatus(event) === 'ongoing'),
    past: filteredEvents.filter((event) => getEventStatus(event) === 'past'),
  };
  const nextEvent = groupedEvents.upcoming[0];
  const hasFilters = Boolean(search || school !== 'all' || eventCategory !== 'all' || communityCategory !== 'all');
  const clearFilters = () => setParams(activeTab === 'events' ? new URLSearchParams({ tab: 'events' }) : new URLSearchParams());

  const toggleRsvp = (id: string, full: boolean) => {
    if (full) {
      setWaitlistedIds((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
      return;
    }
    setRsvpedIds((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
  };

  return (
    <div className="space-y-4 pb-24">
      <header
        className="relative overflow-hidden rounded-2xl bg-[#071B4A] bg-cover bg-center p-5 text-white shadow-sm sm:p-6"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(7, 27, 74, 0.96) 0%, rgba(11, 42, 111, 0.88) 52%, rgba(7, 27, 74, 0.72) 100%), url("${IMAGES.studentLifeQuad.url}")`,
        }}
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <div>
              <Badge variant="academic" className="bg-white/15 text-[#F2B705]">UEAB Baraton community</Badge>
              <h1 className="mt-2 text-2xl font-black sm:text-3xl">Connect, grow, and take part.</h1>
          <p className="mt-1 max-w-xl text-sm text-blue-100">Discover clubs, opportunities, and campus events across every UEAB school.</p>
            </div>
            <div className="flex rounded-xl bg-white/10 p-1" role="tablist" aria-label="Community sections">
              {(['community', 'events'] as MainTab[]).map((tab) => (
                <button key={tab} type="button" role="tab" aria-selected={activeTab === tab} onClick={() => updateFilters({ tab })} className={`min-h-10 rounded-lg px-4 text-xs font-black capitalize transition ${activeTab === tab ? 'bg-[#F2B705] text-[#071B4A]' : 'text-white hover:bg-white/10'}`}>{tab}</button>
              ))}
            </div>
          </div>
          <label className="relative block max-w-xl">
            <Search className="absolute left-3 top-3 h-4 w-4 text-blue-200" />
            <input value={search} onChange={(event) => updateFilters({ q: event.target.value })} placeholder="Search events, clubs, people, or opportunities" className="h-10 w-full rounded-xl border border-white/20 bg-white/10 pl-10 pr-3 text-sm text-white outline-none placeholder:text-blue-200 focus:ring-2 focus:ring-[#F2B705]" />
          </label>
          <div className="grid max-w-xl grid-cols-3 gap-2">
            {[['Upcoming events', COMMUNITY_EVENTS.filter((event) => getEventStatus(event) === 'upcoming').length], ['Active clubs', COMMUNITY_ITEMS.filter((item) => item.category === 'Clubs').length], ['Opportunities', COMMUNITY_ITEMS.filter((item) => item.category === 'Opportunities').length]].map(([label, count]) => (
              <div key={label} className="rounded-xl bg-white/10 p-2.5"><p className="tabular-nums text-lg font-black">{count}</p><p className="text-[10px] text-blue-100">{label}</p></div>
            ))}
          </div>
        </div>
      </header>

      <CommunitySubNav />

      <div className="sticky top-2 z-20 rounded-xl border-b border-slate-200 bg-[#F7F9FC]/90 p-3 backdrop-blur dark:border-slate-700 dark:bg-[#050E24]/90">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <select value={school} onChange={(event) => updateFilters({ school: event.target.value })} aria-label="Filter by UEAB school" className="h-10 max-w-full rounded-lg border border-slate-200 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-900 lg:max-w-[260px]">
            <option value="all">All UEAB schools</option>
            {UEAB_SCHOOLS.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto pb-1">
            {(activeTab === 'events' ? eventCategories : communityCategories).map((category) => {
              const selected = activeTab === 'events' ? eventCategory === category : communityCategory === category;
              return <button key={category} type="button" onClick={() => updateFilters(activeTab === 'events' ? { eventCategory: category } : { communityCategory: category })} className={`min-h-9 shrink-0 rounded-lg px-3 text-xs font-bold capitalize transition ${selected ? 'bg-[#0B2A6F] text-white' : 'bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{category === 'all' ? `All ${activeTab}` : category}</button>;
            })}
          </div>
          <span className="shrink-0 text-xs font-semibold text-slate-500">{activeTab === 'events' ? filteredEvents.length : filteredCommunity.length} results</span>
          {hasFilters && <button type="button" onClick={clearFilters} className="shrink-0 text-xs font-bold text-[#0B2A6F] underline dark:text-[#F2B705]">Clear filters</button>}
        </div>
      </div>

      {activeTab === 'community' ? (
        filteredCommunity.length ? (
          <section className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCommunity.map((item) => <CommunityCard key={item.id} item={item} onAction={() => navigate(item.href ?? '/community/events')} />)}
          </section>
        ) : <EmptyState message="No community items match these filters." onClear={clearFilters} />
      ) : (
        <section className="space-y-6">
          {nextEvent && !hasFilters && (
            <button type="button" onClick={() => setSelectedEvent(nextEvent)} className="flex w-full flex-col overflow-hidden rounded-2xl border border-[#0B2A6F]/20 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-[#0C1D3D] lg:flex-row">
              <div className="relative aspect-[16/10] w-full overflow-hidden lg:aspect-auto lg:w-2/5"><img src={nextEvent.posterUrl} alt={nextEvent.imageAlt} className="h-full min-h-48 w-full object-cover" /><div className="absolute left-4 top-4"><Badge variant="gold">Next up</Badge></div></div>
              <div className="flex flex-1 flex-col justify-center gap-2 p-5"><p className="text-xs font-bold uppercase tracking-wider text-[#0B2A6F] dark:text-[#F2B705]">Featured event</p><h2 className="text-xl font-black text-[#071B4A] dark:text-white">{nextEvent.title}</h2><p className="line-clamp-2 text-sm text-slate-500">{nextEvent.description}</p><p className="text-xs font-semibold text-slate-500">{new Date(nextEvent.start).toLocaleString('en-GB')} · {nextEvent.venue}</p></div>
            </button>
          )}
          {(['ongoing', 'upcoming', 'past'] as const).map((status) => {
            const events = groupedEvents[status];
            if (status === 'past' && !pastExpanded) return <button key={status} type="button" onClick={() => setPastExpanded(true)} className="w-full rounded-xl border border-dashed p-3 text-left text-xs font-bold text-slate-500">Show past events ({events.length})</button>;
            return <section key={status} className="space-y-3"><div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${status === 'ongoing' ? 'animate-pulse bg-emerald-500' : status === 'upcoming' ? 'bg-[#0B2A6F]' : 'bg-slate-400'}`} /><h2 className="text-lg font-black capitalize text-[#071B4A] dark:text-white">{status}</h2><Badge variant={status === 'ongoing' ? 'done' : 'neutral'}>{events.length}</Badge>{status === 'past' && <button type="button" onClick={() => setPastExpanded(false)} className="ml-auto text-xs font-bold text-slate-500">Collapse</button>}</div>{events.length ? <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">{events.map((event) => <EventCard key={event.id} event={event} status={status} isRsvped={rsvpedIds.includes(event.id)} isWaitlisted={waitlistedIds.includes(event.id)} onSelect={() => setSelectedEvent(event)} onRsvp={() => toggleRsvp(event.id, event.rsvps >= event.capacity)} />)}</div> : <EmptyState message={`No ${status} events match these filters.`} onClear={clearFilters} />}</section>;
          })}
        </section>
      )}

      {selectedEvent && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="event-dialog-title" onClick={() => setSelectedEvent(null)}><div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#0C1D3D]" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><Badge variant="academic">{selectedEvent.category}</Badge><h2 id="event-dialog-title" className="mt-2 text-xl font-black text-[#071B4A] dark:text-white">{selectedEvent.title}</h2></div><button type="button" aria-label="Close event details" onClick={() => setSelectedEvent(null)} className="text-2xl text-slate-400">×</button></div><p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{selectedEvent.description} {selectedEvent.details}</p><p className="mt-4 text-xs font-semibold text-slate-500">{new Date(selectedEvent.start).toLocaleString('en-GB')} · {selectedEvent.venue}</p><Link to={`/campus/map?venue=${selectedEvent.venueId ?? ''}`} className="mt-4 inline-block text-xs font-bold text-[#0B2A6F] underline dark:text-[#F2B705]">View venue on campus map</Link></div></div>}
    </div>
  );
};
