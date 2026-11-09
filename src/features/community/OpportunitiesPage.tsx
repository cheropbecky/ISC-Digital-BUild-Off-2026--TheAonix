import React, { useMemo, useState } from 'react';
import { ArrowRight, Briefcase, Building, Calendar, CheckCircle2, MapPin, Search } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ImageWithFallback } from '../../components/ui/ImageWithFallback';
import { IMAGES } from '../../data/images';
import { CommunityShell, CommunitySubNav, PageHeader } from './components/CommunityLayout';

interface Opportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'internship' | 'attachment' | 'graduate_trainee';
  deadline: string;
  description: string;
  skills: string[];
}

const SAMPLE_OPPORTUNITIES: Opportunity[] = [
  { id: 'opp-1', title: 'Cloud Infrastructure & DevOps Intern', company: 'Safaricom PLC', location: 'Nairobi HQ / Hybrid', type: 'internship', deadline: '2026-11-30', description: 'Work with the M-PESA cloud reliability engineering squad. Hands-on Docker, Kubernetes and Golang service telemetry.', skills: ['Docker', 'Linux', 'Go', 'Kubernetes'] },
  { id: 'opp-2', title: 'Cybersecurity SOC Analyst Attachment', company: 'Equity Group Holdings', location: 'Nairobi Operations Center', type: 'attachment', deadline: '2026-12-15', description: 'Mandatory 3-month industrial attachment for Computer Networks & SE students. Log analysis, SIEM probers, incident triage.', skills: ['Network Security', 'Wireshark', 'Python', 'SOC'] },
  { id: 'opp-3', title: 'Graduate Software Engineer 2027 Cohort', company: 'Microsoft Africa Development Center (ADC)', location: 'Dunhill Towers, Nairobi', type: 'graduate_trainee', deadline: '2026-12-31', description: 'Full-time graduate trainee program for graduating 4th years. Competitive compensation, health insurance and international relocation assistance.', skills: ['Algorithms', 'C# / Java', 'System Design', 'React'] },
];

export const OpportunitiesPage: React.FC = () => {
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState<'all' | Opportunity['type']>('all');
  const [sortDeadline, setSortDeadline] = useState(false);
  const handleApply = (id: string) => setAppliedIds((prev) => [...prev, id]);
  const opportunities = useMemo(() => SAMPLE_OPPORTUNITIES.filter((opp) => (type === 'all' || opp.type === type) && `${opp.title} ${opp.company} ${opp.location}`.toLowerCase().includes(search.toLowerCase())).sort((a, b) => sortDeadline ? a.deadline.localeCompare(b.deadline) : 0), [search, sortDeadline, type]);

  return (
    <CommunityShell>
      <PageHeader title="Career & internship opportunities" description="Vetted attachments, internships, and graduate programmes for UEAB Baraton students." />
      <CommunitySubNav />
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-[#0C1D3D]">
        <div className="flex flex-col gap-3 sm:flex-row"><label className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search opportunities or companies" className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-xs outline-none focus:ring-2 focus:ring-[#F2B705] dark:border-slate-700 dark:bg-slate-900 dark:text-white" /></label><button type="button" onClick={() => setSortDeadline((value) => !value)} className="rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-600 dark:border-slate-700 dark:text-slate-300">{sortDeadline ? 'Sorted by deadline' : 'Sort by deadline'}</button></div>
        <div className="flex gap-1.5 overflow-x-auto">{(['all', 'internship', 'attachment', 'graduate_trainee'] as const).map((item) => <button key={item} type="button" onClick={() => setType(item)} className={`min-h-10 shrink-0 rounded-lg px-3 text-xs font-bold capitalize ${type === item ? 'bg-[#0B2A6F] text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{item === 'all' ? 'All opportunities' : item.replace('_', ' ')}</button>)}</div>
      </div>
      <div className="grid items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
        {opportunities.map((opp, index) => {
          const isApplied = appliedIds.includes(opp.id);
          const image = [IMAGES.baratonAuditorium, IMAGES.baratonResearchConference, IMAGES.scienceComplexExterior][index % 3];
          return <Card key={opp.id} padding="none" className="group flex flex-col overflow-hidden rounded-2xl">
            <div className="relative aspect-[16/10] overflow-hidden"><ImageWithFallback src={image.url} alt={`${opp.company} opportunity`} fallbackTitle={opp.company} containerClassName="h-full w-full bg-slate-100 dark:bg-slate-800" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" decoding="async" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" /><div className="absolute left-3 top-3"><Badge variant="academic" className="bg-white/90 text-[#071B4A]">{opp.type.replace('_', ' ')}</Badge></div><div className="absolute bottom-3 left-3 text-xs font-bold text-white">{opp.company}</div></div>
            <div className="flex flex-1 flex-col gap-3 p-4"><div><div className="flex items-start justify-between gap-2"><h2 className="line-clamp-2 text-base font-bold text-[#071B4A] dark:text-white">{opp.title}</h2><Badge variant="soon"><Calendar className="h-3 w-3" />{opp.deadline}</Badge></div><p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{opp.description}</p></div><div className="space-y-1 text-xs text-slate-500"><p className="flex items-center gap-2"><Building className="h-3.5 w-3.5 text-[#0B2A6F] dark:text-[#F2B705]" />{opp.company}</p><p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{opp.location}</p></div><div className="flex flex-wrap gap-1.5">{opp.skills.map((skill) => <span key={skill} className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{skill}</span>)}</div><Button size="sm" variant={isApplied ? 'secondary' : 'primary'} onClick={() => handleApply(opp.id)} className="mt-auto w-full">{isApplied ? <><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />Application submitted</> : <>Apply now <ArrowRight className="h-3.5 w-3.5" /></>}</Button></div>
          </Card>;
        })}
      </div>
    </CommunityShell>
  );
};
