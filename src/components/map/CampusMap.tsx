/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Interactive Campus Map (Leaflet + OpenStreetMap)
 * Centered on University of Eastern Africa, Baraton (UEAB), Kenya
 * Layers: Venues, Free Rooms, Events Today, Lost & Found, Navigation Route
 */

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useKampasStore } from '../../lib/store';
import { Venue, CampusEvent, LostFoundItem } from '../../lib/types';
import { MapPin, Navigation, Compass, Layers, Info, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

// Fix Leaflet default marker icons for Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// UEAB Baraton Coordinates
const UEAB_CENTER: [number, number] = [0.2315, 35.0870];

interface CampusMapProps {
  highlightVenueId?: string;
  showRouteToVenueId?: string;
  className?: string;
}

export const CampusMap: React.FC<CampusMapProps> = ({
  highlightVenueId,
  showRouteToVenueId,
  className = 'h-[440px] w-full',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);

  const { venues, timetable, events, lostItems } = useKampasStore();

  const [selectedLayer, setSelectedLayer] = useState<'all' | 'free_rooms' | 'events' | 'lost_found'>('all');
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  // Compute free rooms right now
  const now = new Date();
  const currentDay = now.getDay() === 0 ? 7 : now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const busyVenueIds = new Set(
    timetable
      .filter((entry) => {
        if (entry.dayOfWeek !== currentDay) return false;
        const [startH, startM] = entry.startTime.split(':').map(Number);
        const [endH, endM] = entry.endTime.split(':').map(Number);
        const start = startH * 60 + startM;
        const end = endH * 60 + endM;
        return currentMinutes >= start && currentMinutes <= end;
      })
      .map((e) => e.venueId)
  );

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: UEAB_CENTER,
      zoom: 16,
      minZoom: 14,
      maxZoom: 19,
      zoomControl: true,
    });

    // OpenStreetMap standard tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors | Baraton Campus',
      maxZoom: 19,
    }).addTo(map);

    const markerGroup = L.layerGroup().addTo(map);
    markerGroupRef.current = markerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers & Layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markerGroup = markerGroupRef.current;
    if (!map || !markerGroup) return;

    markerGroup.clearLayers();
    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    // Helper for custom colored SVG pin
    const createCustomIcon = (color: string, label: string) => {
      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(7,27,74,0.3); border: 2px solid #ffffff;">
            <span style="transform: rotate(45deg); color: #ffffff; font-size: 11px; font-weight: bold; font-family: Inter;">${label}</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });
    };

    // 1. Venues & Free Rooms Layer
    if (selectedLayer === 'all' || selectedLayer === 'free_rooms') {
      venues.forEach((v) => {
        const isFree = !busyVenueIds.has(v.id);
        if (selectedLayer === 'free_rooms' && !isFree) return;

        const pinColor = isFree ? '#16A34A' : '#0B2A6F'; // Green for free, navy for occupied
        const pinLabel = isFree ? '✓' : '🏛';

        const marker = L.marker([v.latitude, v.longitude], {
          icon: createCustomIcon(pinColor, pinLabel),
        });

        marker.on('click', () => {
          setSelectedVenue(v);
        });

        marker.bindPopup(`
          <div style="font-family: Inter, sans-serif; font-size: 12px; line-height: 1.4; padding: 2px;">
            <strong style="color: #071B4A; font-size: 13px;">${v.name}</strong><br/>
            <span style="color: #5B6475;">${v.building} • ${v.floor}</span><br/>
            <span style="font-weight: 600; color: ${isFree ? '#16A34A' : '#DC2626'};">
              ${isFree ? '● Free Right Now' : '● Class In Session'} (Cap: ${v.capacity})
            </span><br/>
            <p style="margin-top: 4px; font-size: 11px; color: #334155;">${v.indoorHints}</p>
          </div>
        `);

        markerGroup.addLayer(marker);
      });
    }

    // 2. Events Layer
    if (selectedLayer === 'all' || selectedLayer === 'events') {
      events.forEach((evt) => {
        const targetVenue = venues.find((v) => v.id === evt.venueId);
        if (!targetVenue) return;

        const marker = L.marker([targetVenue.latitude + 0.00015, targetVenue.longitude + 0.00015], {
          icon: createCustomIcon('#F2B705', '★'),
        });

        marker.bindPopup(`
          <div style="font-family: Inter, sans-serif; font-size: 12px; line-height: 1.4;">
            <strong style="color: #071B4A;">${evt.title}</strong><br/>
            <span style="color: #5B6475;">${evt.venueName} • ${evt.organizerName}</span><br/>
            <span style="color: #16A34A; font-weight: 600;">RSVPs: ${evt.currentRsvps}</span>
          </div>
        `);

        markerGroup.addLayer(marker);
      });
    }

    // 3. Lost & Found Layer
    if (selectedLayer === 'all' || selectedLayer === 'lost_found') {
      lostItems.forEach((item) => {
        if (!item.venueId) return;
        const targetVenue = venues.find((v) => v.id === item.venueId);
        if (!targetVenue) return;

        const marker = L.marker([targetVenue.latitude - 0.00015, targetVenue.longitude - 0.00015], {
          icon: createCustomIcon('#DC2626', item.type === 'found' ? 'F' : 'L'),
        });

        marker.bindPopup(`
          <div style="font-family: Inter, sans-serif; font-size: 12px; line-height: 1.4;">
            <strong style="color: #071B4A;">${item.type === 'found' ? 'Found' : 'Lost'}: ${item.title}</strong><br/>
            <span style="color: #5B6475;">Location: ${item.locationFound}</span><br/>
            <span style="color: #DC2626; font-weight: 600;">Handover: ${item.handoverPoint}</span>
          </div>
        `);

        markerGroup.addLayer(marker);
      });
    }

    // 4. Highlight or Route to Venue if requested
    const targetId = showRouteToVenueId || highlightVenueId;
    if (targetId) {
      const targetVenue = venues.find((v) => v.id === targetId);
      if (targetVenue) {
        setSelectedVenue(targetVenue);
        map.setView([targetVenue.latitude, targetVenue.longitude], 17, { animate: true });

        if (showRouteToVenueId) {
          // Simulated walking path from Baraton Main Gate [0.2285, 35.0860] to target venue
          const startPoint: [number, number] = [0.2285, 35.0860];
          const midPoint: [number, number] = [
            (startPoint[0] + targetVenue.latitude) / 2,
            (startPoint[1] + targetVenue.longitude) / 2 + 0.0003,
          ];
          const routeCoords: [number, number][] = [startPoint, midPoint, [targetVenue.latitude, targetVenue.longitude]];

          const polyline = L.polyline(routeCoords, {
            color: '#F2B705',
            weight: 5,
            dashArray: '8, 8',
            opacity: 0.9,
          }).addTo(map);

          routeLayerRef.current = polyline;
          map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
        }
      }
    }
  }, [venues, timetable, events, lostItems, selectedLayer, highlightVenueId, showRouteToVenueId]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-[#E3E8F0] dark:border-[#1E3158] bg-white dark:bg-[#0C1D3D] shadow-sm">
      {/* Top Map Layer Selector Strip */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5 bg-white/95 dark:bg-[#071B4A]/95 backdrop-blur-md p-1.5 rounded-lg border border-[#E3E8F0] dark:border-[#1E3158] shadow-md">
        <button
          onClick={() => setSelectedLayer('all')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
            selectedLayer === 'all'
              ? 'bg-[#0B2A6F] text-white shadow-sm'
              : 'text-[#5B6475] dark:text-slate-300 hover:text-[#0B2A6F]'
          }`}
        >
          All Layers
        </button>
        <button
          onClick={() => setSelectedLayer('free_rooms')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
            selectedLayer === 'free_rooms'
              ? 'bg-[#16A34A] text-white shadow-sm'
              : 'text-[#5B6475] dark:text-slate-300 hover:text-[#16A34A]'
          }`}
        >
          Free Rooms Now ({venues.length - busyVenueIds.size})
        </button>
        <button
          onClick={() => setSelectedLayer('events')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
            selectedLayer === 'events'
              ? 'bg-[#F2B705] text-[#071B4A] shadow-sm'
              : 'text-[#5B6475] dark:text-slate-300 hover:text-[#B58500]'
          }`}
        >
          Events ({events.length})
        </button>
        <button
          onClick={() => setSelectedLayer('lost_found')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
            selectedLayer === 'lost_found'
              ? 'bg-[#DC2626] text-white shadow-sm'
              : 'text-[#5B6475] dark:text-slate-300 hover:text-[#DC2626]'
          }`}
        >
          Lost & Found
        </button>
      </div>

      {/* Re-center Button */}
      <button
        onClick={() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView(UEAB_CENTER, 16, { animate: true });
          }
        }}
        className="absolute top-3 right-3 z-20 p-2 bg-white/95 dark:bg-[#071B4A]/95 backdrop-blur-md rounded-lg border border-[#E3E8F0] dark:border-[#1E3158] shadow-md text-[#0B2A6F] dark:text-white hover:bg-slate-50 transition-colors"
        title="Re-center on UEAB Baraton"
      >
        <Compass className="w-5 h-5" />
      </button>

      {/* Map Leaflet Container */}
      <div ref={mapContainerRef} className={className} />

      {/* Bottom Sheet / Venue Detail Inspector */}
      {selectedVenue && (
        <div className="absolute bottom-3 left-3 right-3 z-20 bg-white/95 dark:bg-[#071B4A]/95 backdrop-blur-md border border-[#E3E8F0] dark:border-[#1E3158] p-3.5 rounded-xl shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold text-sm text-[#071B4A] dark:text-white truncate">
                {selectedVenue.name}
              </span>
              <Badge variant={busyVenueIds.has(selectedVenue.id) ? 'urgent' : 'done'} showDot>
                {busyVenueIds.has(selectedVenue.id) ? 'Busy' : 'Free Now'}
              </Badge>
            </div>
            <p className="text-xs text-[#5B6475] dark:text-slate-300 truncate">
              {selectedVenue.building} • {selectedVenue.floor} • Cap: {selectedVenue.capacity}
            </p>
            <p className="text-[11px] text-[#0B2A6F] dark:text-[#F2B705] font-medium mt-0.5 line-clamp-1">
              📍 {selectedVenue.indoorHints}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.setView(
                    [selectedVenue.latitude, selectedVenue.longitude],
                    18,
                    { animate: true }
                  );
                }
              }}
            >
              <Navigation className="w-3.5 h-3.5 mr-1" />
              Focus Pin
            </Button>
            <button
              onClick={() => setSelectedVenue(null)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
