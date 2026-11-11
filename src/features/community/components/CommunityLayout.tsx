import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const PageHeader: React.FC<{
  title: string;
  description: string;
  eyebrow?: string;
  actions?: React.ReactNode;
}> = ({ title, description, eyebrow = 'UEAB Baraton community', actions }) => (
  <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <Link to="/community" className="mb-2 inline-flex items-center gap-1 text-xs font-bold text-[#0B2A6F] hover:underline dark:text-[#F2B705]">
        <ArrowLeft className="h-3.5 w-3.5" /> Community hub
      </Link>
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#0B2A6F] dark:text-[#F2B705]">{eyebrow}</p>
      <h1 className="mt-1 text-2xl font-black tracking-tight text-[#071B4A] dark:text-white sm:text-3xl">{title}</h1>
      <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
    {actions}
  </header>
);

export const CommunitySubNav: React.FC = () => {
  const location = useLocation();
  const links = [
    ['Hub', '/community'],
    ['Events', '/community/events'],
    ['Clubs', '/community/clubs'],
    ['Opportunities', '/community/opportunities'],
  ];
  return (
    <nav aria-label="Community navigation" className="flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white/80 p-1 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
      {links.map(([label, href]) => {
        const active = href === '/community' ? location.pathname === href : location.pathname.startsWith(href);
        return <Link key={href} to={href} className={`min-h-10 shrink-0 rounded-lg px-3 py-2 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2B705] ${active ? 'bg-[#0B2A6F] text-white' : 'text-slate-600 hover:bg-[#0B2A6F]/10 dark:text-slate-300'}`}>{label}</Link>;
      })}
    </nav>
  );
};

export const CommunityShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="space-y-5 pb-24">
    {children}
  </div>
);
