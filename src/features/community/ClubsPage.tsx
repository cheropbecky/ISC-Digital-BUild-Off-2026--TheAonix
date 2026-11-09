import React, { useMemo, useState } from 'react';
import { Clock, Search, Users, Check } from 'lucide-react';
import { useKampasStore } from '../../lib/store';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ImageWithFallback } from '../../components/ui/ImageWithFallback';
import { IMAGES } from '../../data/images';
import { CommunityShell, CommunitySubNav, PageHeader } from './components/CommunityLayout';

export const ClubsPage: React.FC = () => {
  const { clubs, toggleClubMembership } = useKampasStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const categories = ['all', ...Array.from(new Set(clubs.map((club) => club.category)))];
  const filteredClubs = useMemo(() => clubs.filter((club) => (category === 'all' || club.category === category) && `${club.name} ${club.description} ${club.code}`.toLowerCase().includes(search.toLowerCase())), [category, clubs, search]);

  return (
    <CommunityShell>
      <PageHeader title="Clubs & societies" description="Find student-led groups for learning, faith, creativity, sport, and service." />
      <CommunitySubNav />
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-[#0C1D3D] sm:flex-row">
        <label className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search clubs and societies" className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-xs outline-none focus:ring-2 focus:ring-[#F2B705] dark:border-slate-700 dark:bg-slate-900 dark:text-white" /></label>
        <div className="flex gap-1.5 overflow-x-auto">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`min-h-10 shrink-0 rounded-lg px-3 text-xs font-bold capitalize ${category === item ? 'bg-[#0B2A6F] text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{item}</button>)}</div>
      </div>
      <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredClubs.map((club, index) => {
          const image = [IMAGES.studentLifeQuad, IMAGES.baratonAuditorium, IMAGES.baratonResearchConference][index % 3];
          return <Card key={club.id} padding="none" className="group flex flex-col overflow-hidden rounded-2xl">
            <div className="relative aspect-[16/10] overflow-hidden"><ImageWithFallback src={image.url} alt={`${club.name} at UEAB Baraton`} fallbackTitle={club.name} containerClassName="h-full w-full bg-slate-100 dark:bg-slate-800" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" decoding="async" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" /><div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white"><span className="text-sm font-black">{club.code}</span><Badge variant="academic" className="bg-white/90 text-[#071B4A]">{club.category}</Badge></div></div>
            <div className="flex flex-1 flex-col gap-3 p-4"><div><h2 className="line-clamp-2 text-base font-bold text-[#071B4A] dark:text-white">{club.name}</h2><p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{club.description}</p></div><div className="space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800"><p className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-[#0B2A6F] dark:text-[#F2B705]" />{club.meetingSchedule}</p><p className="flex items-center gap-2"><Users className="h-3.5 w-3.5" />Led by {club.leaderName} · {club.memberCount} members</p></div><Button size="sm" variant={club.isJoined ? 'secondary' : 'primary'} onClick={() => toggleClubMembership(club.id)} className="mt-auto w-full">{club.isJoined ? <><Check className="h-3.5 w-3.5 text-emerald-600" />Member · Leave</> : 'Join club'}</Button></div>
          </Card>;
        })}
      </div>
    </CommunityShell>
  );
};
