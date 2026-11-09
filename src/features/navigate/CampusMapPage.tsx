import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CampusMap, MapLayerFilter } from '../../components/map/CampusMap';
import { VENUES, VENUE_CATEGORY_LABELS, VenueCategory, VenueData } from '../../data/venues';
import { ImageWithFallback } from '../../components/ui/ImageWithFallback';
import { ArrowLeft, ArrowRight, Bed, Building2, Church, GraduationCap, Hospital, MapPin, Search, Trophy, Utensils, ChevronDown, Filter, Map } from 'lucide-react';
import campusHero from '../../assets/images/ueab_campus_hero_1793989895358.jpg';

const categoryIcon: Record<VenueCategory, React.ElementType> = {
  academic: GraduationCap, administration: Building2, worship: Church,
  student_services: Utensils, food_dining: Utensils, facilities: Building2, health_services: Hospital,
  sports: Trophy, accommodation: Bed, landmarks: MapPin,
};

const featuredVenueIds = ['ueab-library', 'ueab-admin', 'university-church', 'cafeteria', 'ueab-parking', 'ueab-auditorium', 'amphitheatre', 'ueab-gate'];
const quickCategories: Array<'all' | VenueCategory> = ['all', 'academic', 'administration', 'worship', 'student_services', 'accommodation', 'food_dining'];

const categoryDescription = (category: VenueCategory) => ({
  academic: 'Academic buildings and learning spaces.', administration: 'University administration offices.', worship: 'Spaces for worship and reflection.',
  student_services: 'Student support and services.', food_dining: 'Dining services and refreshments.', facilities: 'Campus facilities and amenities.',
  health_services: 'Health and wellness services.', sports: 'Sports and recreation spaces.', accommodation: 'Student accommodation and residences.', landmarks: 'Places and landmarks around campus.',
}[category]);

export const CampusMapPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedId = searchParams.get('venue');
  const isOverview = searchParams.get('view') === 'overview';
  const [selectedVenueId, setSelectedVenueId] = useState<string | undefined>(requestedId || undefined);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | VenueCategory>('all');
  const [overviewSearch, setOverviewSearch] = useState('');
  const [overviewFilter, setOverviewFilter] = useState<MapLayerFilter>('all');
  const [showMoreCategories, setShowMoreCategories] = useState(false);

  useEffect(() => setSelectedVenueId(requestedId || undefined), [requestedId]);

  const selectedVenue = isOverview ? undefined : VENUES.find((venue) => venue.id === selectedVenueId);
  const filteredVenues = useMemo(() => VENUES.filter((venue) => {
    const haystack = `${venue.name} ${venue.category} ${venue.building}`.toLowerCase();
    return (category === 'all' || venue.category === category) && haystack.includes(query.toLowerCase().trim());
  }), [category, query]);
  const displayVenues = useMemo(() => {
    if (query.trim() || category !== 'all') return filteredVenues;
    const featured = featuredVenueIds.map((id) => VENUES.find((venue) => venue.id === id)).filter(Boolean) as VenueData[];
    return [...featured, ...filteredVenues.filter((venue) => !featuredVenueIds.includes(venue.id))];
  }, [category, filteredVenues, query]);
  const mappedOverviewCount = useMemo(() => VENUES.filter((venue) => {
    if (venue.lat === undefined || venue.lng === undefined) return false;
    if (overviewFilter !== 'all' && venue.category !== overviewFilter) return false;
    return !overviewSearch.trim() || `${venue.name} ${venue.category}`.toLowerCase().includes(overviewSearch.toLowerCase().trim());
  }).length, [overviewFilter, overviewSearch]);

  const openVenue = (venue: VenueData) => {
    setSelectedVenueId(venue.id);
    setSearchParams({ venue: venue.id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToDirectory = () => {
    setSelectedVenueId(undefined);
    setSearchParams({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isOverview) {
    return (
      <div className="space-y-4">
        <button onClick={() => setSearchParams({})} className="inline-flex items-center gap-2 text-sm font-bold text-[#0B2A6F] hover:underline dark:text-[#F2B705]"><ArrowLeft className="h-4 w-4" /> Back to Locations</button>
        <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2B705]">UEAB Baraton wayfinding</p><h1 className="mt-1 text-2xl font-extrabold text-[#071B4A] dark:text-white">Campus Overview</h1><p className="mt-1 text-sm text-[#5B6475] dark:text-slate-300">Explore every location with verified coordinates.</p></div>
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-[#0C1D3D]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={overviewSearch} onChange={(event) => setOverviewSearch(event.target.value)} placeholder="Search mapped locations..." className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-[#0B2A6F] dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
            </label>
            <span className="text-xs font-bold text-[#5B6475] dark:text-slate-300">{mappedOverviewCount} mapped locations</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button onClick={() => setOverviewFilter('all')} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ${overviewFilter === 'all' ? 'bg-[#0B2A6F] text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>All</button>
            {(Object.keys(VENUE_CATEGORY_LABELS) as VenueCategory[]).map((item) => <button key={item} onClick={() => setOverviewFilter(item)} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ${overviewFilter === item ? 'bg-[#0B2A6F] text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{VENUE_CATEGORY_LABELS[item]}</button>)}
          </div>
        </div>
        <CampusMap fitAllMarkers activeFilter={overviewFilter} locationSearch={overviewSearch} className="h-[680px] w-full" />
      </div>
    );
  }

  if (selectedVenue) {
    return (
      <div className="space-y-4">
        <button onClick={backToDirectory} className="inline-flex items-center gap-2 text-sm font-bold text-[#0B2A6F] dark:text-[#F2B705] hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Locations
        </button>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2B705]">UEAB Baraton wayfinding</p>
          <h1 className="mt-1 text-2xl font-extrabold text-[#071B4A] dark:text-white">{selectedVenue.name}</h1>
          <p className="mt-1 text-sm text-[#5B6475] dark:text-slate-300">{VENUE_CATEGORY_LABELS[selectedVenue.category]} · {selectedVenue.needsVerification ? 'GPS verification pending' : 'Verified coordinates'}</p>
        </div>
        <CampusMap highlightVenueId={selectedVenue.id} className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.35rem] border border-[#DCE5F8] bg-[#F7F9FE] shadow-sm dark:border-slate-700 dark:bg-[#081733]">
      <header className="relative min-h-[190px] overflow-hidden px-6 py-8 text-white sm:px-10 sm:py-10">
        <img src={campusHero} alt="UEAB Baraton campus" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071B4A]/95 via-[#071B4A]/75 to-[#071B4A]/25" />
        <div className="relative flex items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <span className="mt-1 rounded-full bg-[#F2B705] p-3 text-[#071B4A] shadow-lg"><MapPin className="h-8 w-8 fill-current" /></span>
            <div>
              <p className="text-sm font-extrabold text-[#F2B705] sm:text-base">UEAB Baraton Campus</p>
              <h1 className="mt-0.5 text-3xl font-black tracking-tight sm:text-4xl">Campus Locations</h1>
              <p className="mt-2 text-sm text-blue-50 sm:text-base">Discover and navigate all key locations across our university campus.</p>
            </div>
          </div>
          <button onClick={() => setSearchParams({ view: 'overview' })} className="hidden min-h-11 shrink-0 items-center gap-2 rounded-full bg-[#F2B705] px-5 text-sm font-extrabold text-[#071B4A] shadow-md transition hover:bg-[#FFD34D] sm:inline-flex"><Map className="h-5 w-5" /> Campus Overview <ArrowRight className="h-4 w-4" /></button>
        </div>
      </header>

      <section className="space-y-4 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#173A88]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search locations..." className="h-12 w-full rounded-full border border-[#C9D8F7] bg-white pl-12 pr-5 text-sm text-[#14244A] outline-none transition placeholder:text-slate-400 focus:border-[#173A88] focus:ring-2 focus:ring-[#173A88]/10 dark:border-slate-600 dark:bg-[#0C1D3D] dark:text-white" />
          </label>
          <button onClick={() => setShowMoreCategories((value) => !value)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#C9D8F7] bg-white px-5 text-sm font-bold text-[#172D62] shadow-sm dark:border-slate-600 dark:bg-[#0C1D3D] dark:text-white"><Filter className="h-4 w-4" /> All Categories <ChevronDown className={`h-4 w-4 transition ${showMoreCategories ? 'rotate-180' : ''}`} /></button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {quickCategories.map((item) => (
            <button key={item} onClick={() => setCategory(item)} className={`inline-flex min-h-9 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition ${category === item ? 'bg-[#102D72] text-white shadow-md' : 'bg-white text-[#263968] ring-1 ring-[#D8E2F7] dark:bg-[#0C1D3D] dark:text-slate-300 dark:ring-slate-700'}`}>
              {item === 'all' ? <Map className="h-4 w-4" /> : React.createElement(categoryIcon[item], { className: 'h-4 w-4' })}{item === 'all' ? 'All Locations' : VENUE_CATEGORY_LABELS[item].replace(' Buildings', '')}
            </button>
          ))}
          <button onClick={() => setShowMoreCategories((value) => !value)} className="inline-flex min-h-9 items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-xs font-bold text-[#263968] ring-1 ring-[#D8E2F7] dark:bg-[#0C1D3D] dark:text-slate-300 dark:ring-slate-700">More <ChevronDown className="h-4 w-4" /></button>
        </div>
        {showMoreCategories && <div className="flex flex-wrap gap-2 rounded-2xl bg-[#EEF3FF] p-3 dark:bg-[#0C1D3D]">{(Object.keys(VENUE_CATEGORY_LABELS) as VenueCategory[]).filter((item) => !quickCategories.includes(item)).map((item) => <button key={item} onClick={() => { setCategory(item); setShowMoreCategories(false); }} className="rounded-full bg-white px-3 py-2 text-xs font-bold text-[#263968] ring-1 ring-[#D8E2F7] dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-600">{VENUE_CATEGORY_LABELS[item]}</button>)}</div>}
      </section>

      <section className="grid grid-cols-1 gap-3 px-5 pb-5 min-[520px]:grid-cols-2 lg:grid-cols-4 sm:px-6">
        {displayVenues.map((venue) => {
          const Icon = categoryIcon[venue.category];
          return (
            <article key={venue.id} className="group flex min-h-[132px] flex-col justify-between rounded-2xl border border-[#D8E2F7] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#173A88] hover:shadow-lg dark:border-slate-700 dark:bg-[#0C1D3D]">
              <div className="flex items-start gap-3"><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${venue.category === 'food_dining' ? 'bg-[#F8B900] text-[#172D62]' : 'bg-[#102D72] text-white'} shadow-sm`}><Icon className="h-5 w-5" /></div><div className="min-w-0"><h2 className="line-clamp-2 text-sm font-extrabold leading-tight text-[#14244A] dark:text-white">{venue.name}</h2><span className="mt-1 inline-flex rounded-full bg-[#E5ECFF] px-2 py-0.5 text-[10px] font-bold text-[#173A88] dark:bg-slate-700 dark:text-blue-200">{VENUE_CATEGORY_LABELS[venue.category]}</span></div></div>
              <p className="mt-3 line-clamp-1 text-xs text-[#263968] dark:text-slate-300">{categoryDescription(venue.category)}</p>
              <button onClick={() => openVenue(venue)} className="mt-3 flex min-h-8 items-center gap-1 text-xs font-extrabold text-[#173A88] transition hover:text-[#F2B705] dark:text-blue-200"> <MapPin className="h-4 w-4" /> View on Map <ArrowRight className="ml-1 h-4 w-4" /></button>
            </article>
          );
        })}
      </section>
      <button onClick={() => setSearchParams({ view: 'overview' })} className="mx-5 mb-5 flex w-[calc(100%-2.5rem)] items-center justify-between rounded-2xl border border-[#AFC6F7] bg-[#DCE8FF] px-4 py-3 text-left text-[#142D68] shadow-sm transition hover:bg-[#D0DFFF] dark:border-slate-600 dark:bg-[#102D72] dark:text-white sm:mx-6 sm:w-[calc(100%-3rem)]"><span className="flex items-center gap-3"><span className="rounded-full bg-[#C8D9FF] p-2"><Map className="h-7 w-7" /></span><span><strong className="block text-sm font-extrabold">Explore the Complete Campus</strong><span className="text-xs">View all {VENUES.length} locations on an interactive map with real-time navigation.</span></span></span><span className="hidden items-center gap-2 rounded-full bg-[#102D72] px-4 py-2 text-xs font-bold text-white sm:inline-flex">Open Campus Overview <ArrowRight className="h-4 w-4" /></span><ArrowRight className="h-5 w-5 sm:hidden" /></button>
    </div>
  );
};
