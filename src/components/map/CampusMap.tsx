/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Interactive Campus GIS Map (Leaflet + OpenStreetMap)
 * Centered on the OpenStreetMap feature for University of Eastern Africa, Baraton,
 * Nandi County [0.2589343, 35.0864822].
 * Layers: Venues, Events Now, Houses (Off-Campus), Lost Items, My Route
 * NOTE: Strictly NO free rooms feature or layer anywhere.
 * Bottom sheet includes building exterior AND entrance door photos, indoor hints, and walking route.
 */

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import { useKampasStore } from '../../lib/store';
import { VENUES, VenueData } from '../../data/venues';
import { HOUSES, HouseListing } from '../../data/houses';
import { CAMPUS_EVENTS, CampusEvent } from '../../data/community';
import { LOST_FOUND_ITEMS, LostFoundItem } from '../../data/lostFound';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import {
  MapPin,
  Navigation,
  Compass,
  Layers,
  Info,
  Clock,
  DoorOpen,
  Building,
  Home,
  Sparkles,
  SearchCheck,
  X,
  ExternalLink,
  Locate,
  Footprints,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

// Fix Leaflet marker icons for Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// UEAB Baraton, Nandi County, Kenya. Coordinates sourced from OpenStreetMap.
const UEAB_CENTER: [number, number] = [0.2589343, 35.0864822];
const MAIN_GATE_COORDS: [number, number] = [0.2569, 35.0855];
const UEAB_CAMPUS_BOUNDARY: [number, number][] = [
  [0.2493427, 35.0798875],
  [0.2493427, 35.0916658],
  [0.2659669, 35.0916658],
  [0.2659669, 35.0798875],
];

const getStraightLineRouteInfo = (start: [number, number], end: [number, number]) => {
  const earthRadius = 6371000;
  const latitudeDelta = (end[0] - start[0]) * Math.PI / 180;
  const longitudeDelta = (end[1] - start[1]) * Math.PI / 180;
  const a = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(start[0] * Math.PI / 180)
    * Math.cos(end[0] * Math.PI / 180)
    * Math.sin(longitudeDelta / 2) ** 2;
  const distance = 2 * earthRadius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return { distance, duration: distance / 1.4 };
};

export type MapLayerType = 'all' | 'venues' | 'events' | 'houses' | 'lost_found' | 'my_route';

interface CampusMapProps {
  highlightVenueId?: string;
  showRouteToVenueId?: string;
  className?: string;
  initialLayer?: MapLayerType;
}

export const CampusMap: React.FC<CampusMapProps> = ({
  highlightVenueId,
  showRouteToVenueId,
  className = 'h-[460px] sm:h-[520px] w-full',
  initialLayer = 'all',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const campusBoundaryRef = useRef<L.Polygon | null>(null);

  const [activeLayer, setActiveLayer] = useState<MapLayerType>(initialLayer);
  const [selectedVenue, setSelectedVenue] = useState<VenueData | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<HouseListing | null>(null);
  const [activeRouteVenue, setActiveRouteVenue] = useState<VenueData | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number } | null>(null);

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
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).on('tileerror', () => setMapError('Map unavailable offline')).addTo(map);

    L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);

    campusBoundaryRef.current = L.polygon(UEAB_CAMPUS_BOUNDARY, {
      color: '#0B2A6F',
      weight: 2,
      opacity: 0.8,
      fillColor: '#0B2A6F',
      fillOpacity: 0.08,
      dashArray: '7, 7',
    })
      .bindTooltip('University of Eastern Africa, Baraton', {
        permanent: true,
        direction: 'center',
        className: 'ueab-campus-label',
      })
      .addTo(map);

    L.marker(MAIN_GATE_COORDS, {
      icon: createPinIcon('#16A34A', 'G'),
      zIndexOffset: 500,
    })
      .bindPopup(`
        <div style="font-family: Inter, sans-serif; font-size: 12px; line-height: 1.4; padding: 2px;">
          <strong style="color: #071B4A; font-size: 13px;">UEAB Main Gate</strong><br/>
          <span style="color: #5B6475;">Primary campus entrance and route starting point</span>
        </div>
      `)
      .addTo(map);

    const markerGroup = L.markerClusterGroup({ chunkedLoading: true, showCoverageOnHover: false }).addTo(map);
    markerGroupRef.current = markerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      campusBoundaryRef.current = null;
      tiles.off();
    };
  }, []);

  // Custom Colored SVG Marker Factory
  const createPinIcon = (color: string, emojiOrChar: string) => {
    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div style="background-color: ${color}; width: 34px; height: 34px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(7,27,74,0.35); border: 2.5px solid #ffffff;">
          <span style="transform: rotate(45deg); color: #ffffff; font-size: 13px; font-weight: bold; font-family: Inter;">${emojiOrChar}</span>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 34],
      popupAnchor: [0, -34],
    });
  };

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

    // 1. Campus Venues Layer
    if (activeLayer === 'all' || activeLayer === 'venues' || activeLayer === 'my_route') {
      VENUES.forEach((v) => {
        const marker = L.marker([v.latitude, v.longitude], {
          icon: createPinIcon('#0B2A6F', '🏛'),
        });

        marker.on('click', () => {
          setSelectedHouse(null);
          setSelectedVenue(v);
        });

        markerGroup.addLayer(marker);
      });
    }

    // 2. Events Today Layer
    if (activeLayer === 'all' || activeLayer === 'events') {
      CAMPUS_EVENTS.forEach((evt) => {
        const venue = VENUES.find((v) => v.code === evt.venueCode || v.name === evt.venueName);
        const [venueLat, venueLng] = venue ? [venue.latitude, venue.longitude] : UEAB_CENTER;
        const lat = venueLat + 0.00018;
        const lng = venueLng + 0.00018;

        const marker = L.marker([lat, lng], {
          icon: createPinIcon('#F2B705', '★'),
        });

        marker.bindPopup(`
          <div style="font-family: Inter, sans-serif; font-size: 12px; line-height: 1.4; padding: 2px;">
            <strong style="color: #071B4A; font-size: 13px;">${evt.title}</strong><br/>
            <span style="color: #5B6475;">${evt.venueName} • ${evt.timeFormatted}</span><br/>
            <span style="color: #0B2A6F; font-weight: 700;">RSVP: ${evt.attendeesCount} attending</span>
          </div>
        `);

        markerGroup.addLayer(marker);
      });
    }

    // 3. Off-Campus Housing Layer (Gold House Pins)
    if (activeLayer === 'all' || activeLayer === 'houses') {
      HOUSES.forEach((h) => {
        const marker = L.marker([h.latitude, h.longitude], {
          icon: createPinIcon('#D97706', '🏠'),
        });

        marker.on('click', () => {
          setSelectedVenue(null);
          setSelectedHouse(h);
        });

        markerGroup.addLayer(marker);
      });
    }

    // 4. Lost & Found Layer
    if (activeLayer === 'all' || activeLayer === 'lost_found') {
      LOST_FOUND_ITEMS.forEach((item) => {
        const targetVenue = VENUES.find((v) => v.code === item.venueCode);
        const [venueLat, venueLng] = targetVenue ? [targetVenue.latitude, targetVenue.longitude] : UEAB_CENTER;
        const lat = venueLat - 0.00018;
        const lng = venueLng - 0.00018;

        const marker = L.marker([lat, lng], {
          icon: createPinIcon('#DC2626', item.type === 'found' ? 'F' : 'L'),
        });

        marker.bindPopup(`
          <div style="font-family: Inter, sans-serif; font-size: 12px; line-height: 1.4; padding: 2px;">
            <strong style="color: #071B4A;">${item.type === 'found' ? 'Found' : 'Lost'}: ${item.title}</strong><br/>
            <span style="color: #5B6475;">${item.locationFoundOrLost}</span><br/>
            <span style="color: #DC2626; font-weight: bold;">Handover: ${item.handoverDesk}</span>
          </div>
        `);

        markerGroup.addLayer(marker);
      });
    }

    // 5. Walking Route Polyline if target venue is selected or passed
    const targetId = showRouteToVenueId || highlightVenueId || activeRouteVenue?.id;
    if (targetId) {
      const targetVenue = VENUES.find((v) => v.id === targetId || v.code.toLowerCase() === targetId.toLowerCase());
      if (targetVenue) {
        setSelectedVenue(targetVenue);
        const targetCoordinates: [number, number] = [targetVenue.latitude, targetVenue.longitude];
        map.flyTo(targetCoordinates, 17, { animate: true, duration: 0.7 });

        const startPoint = MAIN_GATE_COORDS;
        const controller = new AbortController();
        setRouteInfo(null);
        const drawFallback = () => {
          const polyline = L.polyline([startPoint, targetCoordinates], {
            color: '#F2B705',
            weight: 5,
            dashArray: '10, 8',
            opacity: 0.95,
          }).addTo(map);
          routeLayerRef.current = polyline;
          setRouteInfo(getStraightLineRouteInfo(startPoint, targetCoordinates));
          map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
        };
        void fetch(
          `https://router.project-osrm.org/route/v1/foot/${startPoint[1]},${startPoint[0]};${targetCoordinates[1]},${targetCoordinates[0]}?overview=full&geometries=geojson`,
          { signal: controller.signal }
        )
          .then(async (response) => {
            if (!response.ok) throw new Error(`OSRM returned ${response.status}`);
            return response.json() as Promise<{ routes?: Array<{ distance: number; duration: number; geometry: { coordinates: [number, number][] } }> }>;
          })
          .then((data) => {
            const route = data.routes?.[0];
            if (!route) throw new Error('No walking route found');
            const coordinates = route.geometry.coordinates.map(([lng, lat]) => [lat, lng] as [number, number]);
            const polyline = L.polyline(coordinates, { color: '#F2B705', weight: 6, opacity: 0.95 }).addTo(map);
            routeLayerRef.current = polyline;
            setRouteInfo({ distance: route.distance, duration: route.duration });
            map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
          })
          .catch((error: unknown) => {
            if (error instanceof DOMException && error.name === 'AbortError') return;
            drawFallback();
          });
        return () => controller.abort();
      }
    }
  }, [activeLayer, highlightVenueId, showRouteToVenueId, activeRouteVenue]);

  useEffect(() => {
    const container = mapContainerRef.current;
    const map = mapInstanceRef.current;
    if (!container || !map) return;
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(container);
    map.invalidateSize();
    return () => observer.disconnect();
  }, []);

  const handleStartWalkingRoute = (v: VenueData) => {
    setActiveRouteVenue(v);
    setActiveLayer('my_route');
  };

  const handleLocateMe = () => {
    setLocationMessage(null);
    if (!navigator.geolocation) {
      setLocationMessage('Location is not supported by this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        mapInstanceRef.current?.setView([coords.latitude, coords.longitude], 17, { animate: true });
        L.circleMarker([coords.latitude, coords.longitude], {
          radius: 8,
          color: '#0B2A6F',
          fillColor: '#F2B705',
          fillOpacity: 1,
        }).addTo(mapInstanceRef.current as L.Map);
      },
      () => setLocationMessage('Location permission was denied. Enable it in your browser settings to locate yourself.')
    );
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-[#E3E8F0] dark:border-[#1E3158] bg-white dark:bg-[#0C1D3D] shadow-sm ${className}`}>
      {/* Top Map Layer Selector Strip (Chips: Venues, Events now, Houses, Lost items, My route - NO free rooms!) */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5 bg-white/95 dark:bg-[#071B4A]/95 backdrop-blur-md p-1.5 rounded-xl border border-[#E3E8F0] dark:border-[#1E3158] shadow-md max-w-[85%]">
        <button
          onClick={() => setActiveLayer('all')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            activeLayer === 'all'
              ? 'bg-[#0B2A6F] text-white shadow-xs'
              : 'text-[#5B6475] dark:text-slate-300 hover:text-[#0B2A6F]'
          }`}
        >
          All Layers
        </button>
        <button
          onClick={() => setActiveLayer('venues')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeLayer === 'venues'
              ? 'bg-[#0B2A6F] text-white shadow-xs'
              : 'text-[#5B6475] dark:text-slate-300 hover:text-[#0B2A6F]'
          }`}
        >
          <span>Venues ({VENUES.length})</span>
        </button>
        <button
          onClick={() => setActiveLayer('houses')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeLayer === 'houses'
              ? 'bg-[#D97706] text-white shadow-xs'
              : 'text-[#5B6475] dark:text-slate-300 hover:text-[#D97706]'
          }`}
        >
          <span>Houses ({HOUSES.length})</span>
        </button>
        <button
          onClick={() => setActiveLayer('events')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeLayer === 'events'
              ? 'bg-[#F2B705] text-[#071B4A] shadow-xs'
              : 'text-[#5B6475] dark:text-slate-300 hover:text-[#F2B705]'
          }`}
        >
          <span>Events ({CAMPUS_EVENTS.length})</span>
        </button>
        <button
          onClick={() => setActiveLayer('lost_found')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeLayer === 'lost_found'
              ? 'bg-[#DC2626] text-white shadow-xs'
              : 'text-[#5B6475] dark:text-slate-300 hover:text-[#DC2626]'
          }`}
        >
          <span>Lost & Found</span>
        </button>
      </div>

      <div className="absolute bottom-3 right-3 z-20 hidden sm:flex items-center gap-3 rounded-xl border border-[#E3E8F0] dark:border-[#1E3158] bg-white/95 dark:bg-[#071B4A]/95 px-3 py-2 text-[10px] font-semibold text-[#5B6475] dark:text-slate-300 shadow-md backdrop-blur-md">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#0B2A6F]" />
          Campus venue
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#16A34A]" />
          Main gate
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm border border-[#0B2A6F] bg-[#0B2A6F]/10" />
          Campus boundary
        </span>
      </div>

      {/* Re-center & Locate Me Buttons */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
        <button
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setView(UEAB_CENTER, 16, { animate: true });
            }
          }}
          className="p-2.5 bg-white/95 dark:bg-[#071B4A]/95 backdrop-blur-md rounded-xl border border-[#E3E8F0] dark:border-[#1E3158] shadow-md text-[#0B2A6F] dark:text-white hover:bg-slate-50 transition"
          title="Re-center Campus Map"
        >
          <Compass className="w-5 h-5" />
        </button>
        <button
          onClick={handleLocateMe}
          className="p-2.5 bg-white/95 dark:bg-[#071B4A]/95 backdrop-blur-md rounded-xl border border-[#E3E8F0] dark:border-[#1E3158] shadow-md text-[#0B2A6F] dark:text-[#F2B705] hover:bg-slate-50 transition"
          title="Locate me"
        >
          <Locate className="w-5 h-5" />
        </button>
      </div>

      {mapError && (
        <div className="absolute left-3 right-3 top-20 z-20 rounded-xl border border-rose-200 bg-rose-50/95 px-3 py-2 text-xs font-semibold text-rose-800 shadow-md dark:border-rose-900 dark:bg-rose-950/90 dark:text-rose-200">
          {mapError}. Check your connection and try again.
        </div>
      )}
      {locationMessage && (
        <div className="absolute bottom-3 left-3 z-20 max-w-xs rounded-xl border border-amber-200 bg-amber-50/95 px-3 py-2 text-xs font-semibold text-amber-900 shadow-md dark:border-amber-900 dark:bg-amber-950/90 dark:text-amber-200">
          {locationMessage}
        </div>
      )}

      {/* Map Leaflet Container */}
      <div ref={mapContainerRef} className="h-full w-full" />

      {/* ================= VENUE BOTTOM SHEET ================= */}
      {/* Includes Exterior AND Entrance Door Photos, Indoor Hints, Walking Route */}
      {selectedVenue && (
        <div className="absolute bottom-3 left-3 right-3 z-30 bg-white/98 dark:bg-[#071B4A]/98 backdrop-blur-md border border-[#E3E8F0] dark:border-[#1E3158] p-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Visual Photos: Building Exterior AND Entrance Door */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Photo 1: Building Exterior */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 relative bg-slate-100">
                <ImageWithFallback
                  src={selectedVenue.photos.exterior}
                  alt={`${selectedVenue.name} Building Exterior`}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center font-bold py-0.5">
                  Exterior
                </span>
              </div>

              {/* Photo 2: Entrance Door */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 relative bg-slate-100">
                <ImageWithFallback
                  src={selectedVenue.photos.entranceDoor}
                  alt={`${selectedVenue.name} Entrance Door`}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-[#F2B705] text-center font-bold py-0.5">
                  Door Entry
                </span>
              </div>
            </div>

            {/* Venue Details */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-[#0B2A6F] text-white">
                  {selectedVenue.code}
                </span>
                <h3 className="font-extrabold text-sm sm:text-base text-[#071B4A] dark:text-white truncate">
                  {selectedVenue.name}
                </h3>
              </div>

              <p className="text-xs text-[#5B6475] dark:text-slate-300">
                {selectedVenue.building} • {selectedVenue.floor} • Capacity: {selectedVenue.capacity} seats
              </p>

              {/* Indoor Hints */}
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[11px] text-[#071B4A] dark:text-slate-200">
                <strong className="text-[#0B2A6F] dark:text-[#F2B705]">Indoor Guide: </strong>
                {selectedVenue.indoorHints}
              </div>

              {/* Today's Classes in this venue */}
              {selectedVenue.todayClasses.length > 0 && (
                <div className="text-[11px] text-slate-500">
                  <span className="font-semibold text-[#0B2A6F] dark:text-[#F2B705]">Scheduled: </span>
                  {selectedVenue.todayClasses.map((c) => `${c.unitCode} (${c.time})`).join(' • ')}
                </div>
              )}
            </div>

            {/* Actions: Start Route & Dismiss */}
            <div className="flex sm:flex-col items-center gap-2 shrink-0 w-full sm:w-auto">
              <Button
                size="sm"
                variant="gold"
                onClick={() => handleStartWalkingRoute(selectedVenue)}
                className="w-full sm:w-auto font-bold text-xs"
              >
                <Footprints className="w-3.5 h-3.5 mr-1.5" />
                <span>Directions</span>
              </Button>
              {routeInfo && (
                <span className="text-[10px] font-semibold text-[#5B6475] dark:text-slate-300">
                  {(routeInfo.distance / 1000).toFixed(2)} km · {Math.ceil(routeInfo.duration / 60)} min walk
                </span>
              )}
              <button
                onClick={() => setSelectedVenue(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= HOUSE DETAIL POPUP ================= */}
      {selectedHouse && (
        <div className="absolute bottom-3 left-3 right-3 z-30 bg-white/98 dark:bg-[#071B4A]/98 backdrop-blur-md border border-[#E3E8F0] dark:border-[#1E3158] p-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
              <ImageWithFallback
                src={selectedHouse.photos[0]}
                alt={selectedHouse.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D97706]">
                {selectedHouse.area} • {selectedHouse.type.replace('_', ' ')}
              </span>
              <h4 className="font-bold text-sm text-[#071B4A] dark:text-white truncate">
                {selectedHouse.title}
              </h4>
              <p className="text-xs font-black text-[#0B2A6F] dark:text-[#F2B705]">
                KES {selectedHouse.priceMonthlyKes.toLocaleString()}/mo • {selectedHouse.walkingMinutes} min walk to gate
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a href={`#/housing/${selectedHouse.id}`}>
              <Button size="sm" variant="primary">
                View Rental
              </Button>
            </a>
            <button
              onClick={() => setSelectedHouse(null)}
              className="p-2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
