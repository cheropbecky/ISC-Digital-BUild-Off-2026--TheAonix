/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Unified Search Results Page (/search)
 * Grouped across Units, Venues, Documents, Events, Clubs, Alumni & Lost Items
 */

import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useKampasStore } from '../../lib/store';
import { performGlobalSearch } from '../../lib/search';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import {
  Search,
  BookOpen,
  MapPin,
  FileText,
  Calendar,
  Users,
  SearchCheck,
  UserCheck,
  ArrowRight,
} from 'lucide-react';

export const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { units, venues, documents, events, clubs, lostItems, alumni } = useKampasStore();

  const results = useMemo(() => {
    return performGlobalSearch(query, {
      units,
      venues,
      documents,
      events,
      clubs,
      lostItems,
      alumni,
    });
  }, [query, units, venues, documents, events, clubs, lostItems, alumni]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-[#0B2A6F] dark:text-[#F2B705]" />
          <h1 className="text-xl sm:text-2xl font-black text-[#071B4A] dark:text-white">
            Search Results for "{query}"
          </h1>
        </div>
        <p className="text-xs text-[#5B6475] dark:text-slate-400 mt-1">
          Found {results.totalMatches} matched entries across university academic and campus records.
        </p>
      </div>

      {results.totalMatches === 0 ? (
        <Card className="text-center py-12">
          <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">
            No Records Found
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Try searching for course codes (e.g., "COSC 311"), lecture halls ("Amphitheatre"), or topics.
          </p>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Units */}
          {results.units.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-[#071B4A] dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#0B2A6F]" />
                Academic Units ({results.units.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.units.map((u) => (
                  <Link key={u.code} to={`/campus/units/${u.code}`}>
                    <Card padding="md" hoverable>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#0B2A6F] dark:text-[#93C5FD]">
                          {u.code}
                        </span>
                        <Badge variant="academic">{u.credits} Cr</Badge>
                      </div>
                      <h4 className="text-sm font-bold text-[#071B4A] dark:text-white line-clamp-1">
                        {u.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {u.lecturerName} • {u.department}
                      </p>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Venues */}
          {results.venues.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-[#071B4A] dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0B2A6F]" />
                Campus Venues & Halls ({results.venues.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.venues.map((v) => (
                  <Link key={v.id} to="/campus/venues/all">
                    <Card padding="md" hoverable>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#071B4A] dark:text-white">
                          {v.name}
                        </span>
                        <Badge variant="academic">Cap {v.capacity}</Badge>
                      </div>
                      <p className="text-xs text-slate-500">
                        {v.building} • {v.floor}
                      </p>
                      <p className="text-[11px] text-[#0B2A6F] dark:text-[#F2B705] mt-1 line-clamp-1">
                        📍 {v.indoorHints}
                      </p>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {results.documents.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-[#071B4A] dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0B2A6F]" />
                Study Notes & Past Papers ({results.documents.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.documents.map((d) => (
                  <Link key={d.id} to="/share">
                    <Card padding="md" hoverable>
                      <span className="text-[10px] font-bold text-[#0B2A6F] dark:text-[#93C5FD]">
                        {d.unitCode}
                      </span>
                      <h4 className="text-sm font-bold text-[#071B4A] dark:text-white line-clamp-1 mt-0.5">
                        {d.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                        {d.description}
                      </p>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Alumni */}
          {results.alumni.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-[#071B4A] dark:text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#0B2A6F]" />
                Baraton Alumni ({results.alumni.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.alumni.map((a) => (
                  <Link key={a.id} to="/community/alumni">
                    <Card padding="md" hoverable>
                      <h4 className="text-sm font-bold text-[#071B4A] dark:text-white">
                        {a.name}
                      </h4>
                      <div className="text-xs text-[#0B2A6F] dark:text-[#93C5FD] font-semibold">
                        {a.currentRole} @ {a.currentCompany}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {a.degree} (Class of {a.graduationYear})
                      </p>
                    </Card>
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
