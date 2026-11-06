/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Campus Venues & Facilities Directory (/campus/venues/:id)
 */

import React, { useState } from 'react';
import { useKampasStore } from '../../lib/store';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  MapPin,
  Users,
  Wifi,
  Zap,
  Tv,
  Accessibility,
  Navigation,
  Search,
  Filter,
} from 'lucide-react';
import { Venue } from '../../lib/types';

export const VenuesDirectoryPage: React.FC = () => {
  const { venues } = useKampasStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeVenue, setActiveVenue] = useState<Venue | null>(null);

  const filteredVenues = venues.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.building.toLowerCase().includes(search.toLowerCase()) ||
      v.code.toLowerCase().includes(search.toLowerCase());

    const matchesCat = categoryFilter === 'all' || v.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#071B4A] dark:text-white">
            Campus Venues & Facilities
          </h1>
          <p className="text-xs text-[#5B6475] dark:text-slate-400 mt-1">
            Directory of lecture halls, labs, simulation wards & auditoriums with indoor navigation hints.
          </p>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search hall or building..."
              className="h-10 pl-9 pr-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F2B705]"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'lecture_hall', 'lab', 'auditorium', 'sports', 'service'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition ${
              categoryFilter === cat
                ? 'bg-[#0B2A6F] text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVenues.map((v) => (
          <Card key={v.id} padding="md" hoverable className="flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-bold text-[#0B2A6F] dark:text-[#93C5FD] tracking-wider uppercase">
                    {v.code}
                  </span>
                  <h3 className="text-base font-bold text-[#071B4A] dark:text-white line-clamp-1">
                    {v.name}
                  </h3>
                </div>
                <Badge variant="academic">
                  <Users className="w-3 h-3 mr-1 inline" />
                  {v.capacity}
                </Badge>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 mb-3">
                <span className="font-semibold">{v.building}</span> • {v.floor}
              </div>

              {/* Equipment Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {v.hasProjector && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    <Tv className="w-3 h-3 text-[#0B2A6F]" /> Projector
                  </span>
                )}
                {v.hasPowerSockets && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    <Zap className="w-3 h-3 text-amber-600" /> Sockets
                  </span>
                )}
                {v.hasWifi && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    <Wifi className="w-3 h-3 text-emerald-600" /> Wi-Fi
                  </span>
                )}
                {v.isAccessible && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    <Accessibility className="w-3 h-3 text-blue-600" /> Ramp
                  </span>
                )}
              </div>

              {/* Indoor Navigation Hint */}
              <div className="p-2.5 rounded-lg bg-[#F7F9FC] dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                <span className="font-bold text-[#0B2A6F] dark:text-[#F2B705]">Indoor Guide: </span>
                {v.indoorHints}
              </div>
            </div>

            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                window.location.hash = `#/home`;
              }}
              className="w-full text-xs"
            >
              <Navigation className="w-3.5 h-3.5 mr-1" />
              View on Campus Map
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
