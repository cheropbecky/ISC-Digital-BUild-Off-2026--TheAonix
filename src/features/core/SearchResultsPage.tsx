/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Full Search Results Page (/search?q=...)
 * Displays grouped search results across:
 * Venues, Houses, Events, Units, Documents, Clubs, People, and Lost Items.
 */

import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchService } from '../../services/searchService';
import { ImageWithFallback } from '../../components/ui/ImageWithFallback';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Search,
  MapPin,
  Home,
  FileText,
  Calendar,
  Users,
  SearchCheck,
  UserCheck,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const results = useMemo(() => {
    return searchService.searchAll(query);
  }, [query]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Search Header */}
      <div className="pb-2 border-b border-[#E3E8F0] dark:border-[#1E3158]">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-[#0B2A6F] dark:text-[#F2B705]" />
          <h1 className="text-xl sm:text-2xl font-black text-[#071B4A] dark:text-white">
            Search Results for "{query}"
          </h1>
        </div>
        <p className="text-xs text-[#5B6475] dark:text-slate-300 mt-1">
          Found {results.totalCount} matches across campus venues, housing, academic documents, events, and people.
        </p>
      </div>

      {results.totalCount === 0 ? (
        <div className="text-center p-12 bg-white dark:bg-[#0C1D3D] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Search className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-[#071B4A] dark:text-white">
            No Records Found for "{query}"
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try searching for a course code (e.g. "COSC 311"), building name ("Science Complex"), housing ("Bedsitter", "Highland"), or an alumnus ("Safaricom").
          </p>
          <Link to="/home">
            <Button variant="primary" size="sm">
              Return to Campus Home
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* 1. Venues */}
          {results.venues.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-black text-[#071B4A] dark:text-white uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0B2A6F] dark:text-[#F2B705]" />
                <span>Venues &amp; Lecture Halls ({results.venues.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.venues.map((v) => (
                  <Link
                    key={v.id}
                    to={v.targetUrl}
                    className="p-3 bg-white dark:bg-[#0C1D3D] rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0B2A6F] transition flex items-center gap-3 group"
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                      <ImageWithFallback
                        src={v.thumbnailUrl || ''}
                        alt={v.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-[#071B4A] dark:text-white group-hover:text-[#0B2A6F] truncate">
                        {v.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">{v.subtitle}</p>
                      <span className="text-[10px] font-semibold text-[#0B2A6F] dark:text-[#F2B705]">
                        Fly Map to Venue →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 2. Housing */}
          {results.houses.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-black text-[#071B4A] dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Home className="w-4 h-4 text-[#D97706]" />
                <span>Off-Campus Housing ({results.houses.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.houses.map((h) => (
                  <Link
                    key={h.id}
                    to={h.targetUrl}
                    className="p-3 bg-white dark:bg-[#0C1D3D] rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0B2A6F] transition flex items-center gap-3 group"
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                      <ImageWithFallback
                        src={h.thumbnailUrl || ''}
                        alt={h.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-[#071B4A] dark:text-white group-hover:text-[#0B2A6F] truncate">
                        {h.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">{h.subtitle}</p>
                      <span className="text-[10px] font-bold text-[#D97706]">
                        View Details &amp; Contact Landlord →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 3. Academic Units */}
          {results.units.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-black text-[#071B4A] dark:text-white uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#0B2A6F] dark:text-[#F2B705]" />
                <span>Academic Units ({results.units.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.units.map((u) => (
                  <Link
                    key={u.id}
                    to={u.targetUrl}
                    className="p-3 bg-white dark:bg-[#0C1D3D] rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0B2A6F] transition flex items-center justify-between"
                  >
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-[#071B4A] dark:text-white">
                        {u.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">{u.subtitle}</p>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      {u.badge}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 4. Documents & Notes */}
          {results.documents.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-black text-[#071B4A] dark:text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Documents &amp; Study Notes ({results.documents.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.documents.map((d) => (
                  <Link
                    key={d.id}
                    to={d.targetUrl}
                    className="p-3 bg-white dark:bg-[#0C1D3D] rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0B2A6F] transition flex items-center justify-between"
                  >
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-[#071B4A] dark:text-white truncate">
                        {d.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">{d.subtitle}</p>
                    </div>
                    <span className="text-[10px] font-bold text-amber-500">
                      {d.badge}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 5. Events */}
          {results.events.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-black text-[#071B4A] dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>Campus Events ({results.events.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.events.map((e) => (
                  <Link
                    key={e.id}
                    to={e.targetUrl}
                    className="p-3 bg-white dark:bg-[#0C1D3D] rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0B2A6F] transition flex items-center justify-between"
                  >
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-[#071B4A] dark:text-white truncate">
                        {e.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">{e.subtitle}</p>
                    </div>
                    <span className="text-[10px] font-bold text-purple-600">
                      {e.badge}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 6. People / Alumni */}
          {results.people.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-black text-[#071B4A] dark:text-white uppercase tracking-wider flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-sky-600" />
                <span>Alumni Mentors ({results.people.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.people.map((p) => (
                  <Link
                    key={p.id}
                    to={p.targetUrl}
                    className="p-3 bg-white dark:bg-[#0C1D3D] rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0B2A6F] transition flex items-center justify-between"
                  >
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-[#071B4A] dark:text-white">
                        {p.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">{p.subtitle}</p>
                    </div>
                    <span className="text-[10px] font-bold text-sky-600">
                      Request Referral →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 7. Lost & Found */}
          {results.lostItems.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-black text-[#071B4A] dark:text-white uppercase tracking-wider flex items-center gap-2">
                <SearchCheck className="w-4 h-4 text-rose-600" />
                <span>Lost &amp; Found Desk ({results.lostItems.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.lostItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.targetUrl}
                    className="p-3 bg-white dark:bg-[#0C1D3D] rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0B2A6F] transition flex items-center justify-between"
                  >
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-[#071B4A] dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">{item.subtitle}</p>
                    </div>
                    <span className="text-[10px] font-bold text-rose-600 uppercase">
                      {item.badge}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
