/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Full Campus GIS Map Page (/campus/map)
 * Centered on the OpenStreetMap UEAB Baraton feature centroid, Nandi County [0.25766, 35.08578]
 * Interactive venue inspector with exterior & entrance door photos, walking route generator,
 * search by building/hall, and off-campus housing toggle.
 * NOTE: Strictly no free-room layers.
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CampusMap, MapLayerType } from '../../components/map/CampusMap';
import { VENUES, VenueData } from '../../data/venues';
import { ImageWithFallback } from '../../components/ui/ImageWithFallback';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  MapPin,
  Search,
  Compass,
  Footprints,
  Clock,
  Layers,
  Building,
  Home,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';

export const CampusMapPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const venueParam = searchParams.get('venue');

  const [selectedVenueId, setSelectedVenueId] = useState<string | undefined>(venueParam || undefined);
  const [routeToVenueId, setRouteToVenueId] = useState<string | undefined>(undefined);
  const [searchVenueTerm, setSearchVenueTerm] = useState('');
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('all');

  useEffect(() => {
    if (venueParam) {
      setSelectedVenueId(venueParam);
    }
  }, [venueParam]);

  const filteredVenues = VENUES.filter((v) => {
    if (!searchVenueTerm.trim()) return true;
    const q = searchVenueTerm.toLowerCase();
    return (
      v.name.toLowerCase().includes(q) ||
      v.code.toLowerCase().includes(q) ||
      v.building.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E3E8F0] dark:border-[#1E3158]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#0B2A6F] text-[#F2B705]">
              <MapPin className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071B4A] dark:text-white tracking-tight">
              Campus GIS Map
            </h1>
            <Badge variant="done">UEAB Baraton · Nandi County</Badge>
          </div>
          <p className="text-sm text-[#5B6475] dark:text-slate-300 mt-1">
            Building exterior &amp; entrance door guides, scheduled lectures, and walking route paths.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/campus/timetable">
            <Button variant="secondary" size="sm">
              View Timetable
            </Button>
          </Link>
          <Link to="/housing">
            <Button variant="gold" size="sm" className="font-bold">
              <Home className="w-4 h-4 mr-1" />
              House Find Map
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="space-y-4">
        <CampusMap
          highlightVenueId={selectedVenueId}
          showRouteToVenueId={routeToVenueId}
          initialLayer={activeLayer}
          className="h-[520px] sm:h-[600px] w-full"
        />
      </div>

      {/* Campus Venues Directory Strip */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-[#071B4A] dark:text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-[#0B2A6F] dark:text-[#F2B705]" />
            <span>Campus Venues Directory</span>
          </h2>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchVenueTerm}
              onChange={(e) => setSearchVenueTerm(e.target.value)}
              placeholder="Filter by name, hall code, or faculty..."
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#0B2A6F]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVenues.map((v) => (
            <div
              key={v.id}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedVenueId === v.id
                  ? 'bg-blue-50/50 dark:bg-blue-950/40 border-[#0B2A6F] dark:border-[#F2B705] ring-2 ring-[#0B2A6F]/20'
                  : 'bg-white dark:bg-[#0C1D3D] border-[#E3E8F0] dark:border-[#1E3158] hover:border-[#0B2A6F]'
              }`}
              onClick={() => {
                setSelectedVenueId(v.id);
                setRouteToVenueId(undefined);
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
            >
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                  <ImageWithFallback
                    src={v.photos.exterior}
                    alt={v.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-[#0B2A6F] dark:text-[#F2B705]">
                      {v.code}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-[11px] text-slate-500 capitalize">
                      {v.category.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="font-bold text-xs text-[#071B4A] dark:text-white truncate">
                    {v.name}
                  </h3>
                  <p className="text-[11px] text-[#5B6475] dark:text-slate-400 truncate">
                    {v.building} • {v.floor}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  Cap: {v.capacity} seats
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVenueId(v.id);
                    setRouteToVenueId(v.id);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className="text-[#0B2A6F] dark:text-[#F2B705] font-bold text-[11px] hover:underline flex items-center gap-1"
                >
                  <Footprints className="w-3 h-3" />
                  <span>Route on Map</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
