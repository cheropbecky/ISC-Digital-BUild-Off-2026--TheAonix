/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Campus GIS Map
 * University of Eastern Africa, Baraton (Nandi County, Kenya)
 * Center: [0.1836, 35.1269], Zoom: 17, minZoom: 14, maxBounds: ~2 km
 * Base layers: OpenStreetMap & Esri World Imagery (Satellite)
 * Features:
 * - Custom UEAB blue & gold markers with category icons
 * - Layer chips: Academic, Services, Worship, Sports, Events, Lost items
 * - Coordinate picker (Dev tool when VITE_DEV_TOOLS=true) with draggable markers & copy button
 * - Detailed venue bottom sheet with exterior & entrance door photos (with alt text)
 * - Walking directions with OSRM (distance & walking time) and straight-line fallback
 * - Locate-me with friendly error message and offline state banner
 * - InvalidateSize on resize & panel toggle, min 44px touch targets
 */

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import L from 'leaflet';
import { VENUES, VenueData, VenueCategory } from '../../data/venues';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { Button } from '../ui/Button';
import {
  MapPin,
  Navigation,
  Compass,
  Layers,
  Clock,
  DoorOpen,
  Building,
  Sparkles,
  Search,
  X,
  Locate,
  Footprints,
  Copy,
  Check,
  AlertCircle,
  Crosshair,
  WifiOff,
  BookOpen,
  Briefcase,
  Church,
  Trophy,
  Star,
  HelpCircle,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

// Fix default Leaflet icon paths for Vite bundles
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Primary campus center at real University of Eastern Africa, Baraton (Academic Quadrangle)
export const UEAB_CENTER: [number, number] = [0.2622, 35.0848];
export const UEAB_MAIN_GATE: [number, number] = [0.25889, 35.08298];

// ~2 km bounding box around UEAB Baraton campus
const MAX_BOUNDS: L.LatLngBoundsExpression = [
  [0.2450, 35.0700],
  [0.2720, 35.1020],
];

// Official UEAB Baraton 339-acre campus perimeter polygon (OSM Way 218276680)
export const UEAB_CAMPUS_BOUNDARY: [number, number][] = [
  [0.2561622, 35.0798875],
  [0.2545864, 35.0814284],
  [0.2546481, 35.0815176],
  [0.2545783, 35.0815919],
  [0.2545046, 35.0816705],
  [0.2544147, 35.0816041],
  [0.2538971, 35.082095],
  [0.2509172, 35.0837633],
  [0.2498765, 35.0845036],
  [0.2493427, 35.0850481],
  [0.2542082, 35.0877249],
  [0.2554326, 35.08837],
  [0.2555667, 35.0885001],
  [0.2576307, 35.0916658],
  [0.2651032, 35.0910281],
  [0.2651609, 35.0909919],
  [0.2659669, 35.088653],
  [0.2636622, 35.0840275],
  [0.2635744, 35.0839229],
  [0.2602378, 35.0821258],
  [0.2561622, 35.0798875],
];

// Campus Quad Loop & Spine Road (OSM Way 218274606)
export const UEAB_RING_ROAD: [number, number][] = [
  [0.25889, 35.0829841],
  [0.2591233, 35.0827213],
  [0.2593097, 35.0824799],
  [0.2596772, 35.0820306],
  [0.2598059, 35.0820105],
  [0.2601101, 35.0821633],
  [0.2608627, 35.0825563],
  [0.2619289, 35.0831169],
  [0.2627094, 35.0835219],
  [0.2628086, 35.0836198],
  [0.2628824, 35.0837767],
  [0.2630433, 35.084399],
  [0.2630581, 35.0845666],
  [0.2630675, 35.0847101],
  [0.2630158, 35.0854243],
  [0.2629695, 35.0854705],
  [0.2626973, 35.0855054],
  [0.2626014, 35.0854699],
  [0.2624599, 35.0853834],
  [0.2623754, 35.0853753],
  [0.2621046, 35.0853941],
  [0.2620268, 35.0853834],
];

export type BaseMapType = 'satellite' | 'osm' | 'aerial';
export type MapLayerFilter = 'all' | VenueCategory | 'venues' | 'events' | 'houses' | 'lost_found' | 'my_route';
export type MapLayerType = MapLayerFilter;

export interface CampusMapProps {
  highlightVenueId?: string;
  showRouteToVenueId?: string;
  className?: string;
  initialLayer?: MapLayerFilter;
  onVenueSelect?: (venue: VenueData) => void;
}

export const CampusMap: React.FC<CampusMapProps> = ({
  highlightVenueId,
  showRouteToVenueId,
  className = 'h-[540px] sm:h-[620px] w-full',
  initialLayer = 'all',
  onVenueSelect,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const osmTileLayerRef = useRef<L.TileLayer | null>(null);
  const satelliteTileLayerRef = useRef<L.TileLayer | null>(null);
  const esriTileLayerRef = useRef<L.TileLayer | null>(null);
  const labelsTileLayerRef = useRef<L.TileLayer | null>(null);
  const userLocationMarkerRef = useRef<L.Marker | null>(null);

  // Tile layer mode: 'satellite' (2026 HD Hybrid) | 'osm' (Street Map) | 'aerial' (Esri Imagery)
  const [baseMapType, setBaseMapType] = useState<BaseMapType>('satellite');

  // Layer filter
  const [activeFilter, setActiveFilter] = useState<MapLayerFilter>(initialLayer);

  // Selected venue for inspector sheet
  const [selectedVenue, setSelectedVenue] = useState<VenueData | null>(null);

  // Route state
  const [activeRoute, setActiveRoute] = useState<{
    venue: VenueData;
    distanceMeters: number;
    durationMinutes: number;
    isFallback: boolean;
  } | null>(null);
  const [isRoutingLoading, setIsRoutingLoading] = useState(false);

  // User live location
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationStatusMessage, setLocationStatusMessage] = useState<string | null>(null);

  // Offline detection
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Search input
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Dev Coordinate Picker tool
  const isDevToolsAvailable = Boolean(
    import.meta.env.VITE_DEV_TOOLS === 'true' ||
    import.meta.env.DEV ||
    (typeof window !== 'undefined' && window.localStorage.getItem('kampas_dev_tools') === 'true')
  );
  const [isCoordPickerActive, setIsCoordPickerActive] = useState(false);
  const [pickedCoordinates, setPickedCoordinates] = useState<{
    lat: number;
    lng: number;
    label?: string;
  } | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Category Icon & Color Helper
  const getCategoryTheme = (category: VenueCategory) => {
    switch (category) {
      case 'academic':
        return { color: '#0B2A6F', textColor: '#FFFFFF', icon: '🏛', label: 'Academic' };
      case 'worship':
        return { color: '#071B4A', textColor: '#F2B705', icon: '⛪', label: 'Worship' };
      case 'services':
        return { color: '#D97706', textColor: '#FFFFFF', icon: '🏢', label: 'Services' };
      case 'sports':
        return { color: '#16A34A', textColor: '#FFFFFF', icon: '⚽', label: 'Sports' };
      case 'events':
        return { color: '#F2B705', textColor: '#071B4A', icon: '★', label: 'Events' };
      case 'lost_found':
        return { color: '#DC2626', textColor: '#FFFFFF', icon: '🔍', label: 'Lost Items' };
      default:
        return { color: '#0B2A6F', textColor: '#FFFFFF', icon: '📍', label: 'Venue' };
    }
  };

  // Create Custom Leaflet DivIcon with UEAB Blue & Gold Styling
  const createVenuePinIcon = (category: VenueCategory, isSelected = false) => {
    const theme = getCategoryTheme(category);
    const size = isSelected ? 40 : 34;
    const border = isSelected ? '3px solid #F2B705' : '2.5px solid #FFFFFF';

    return L.divIcon({
      className: 'custom-venue-pin',
      html: `
        <div style="
          background-color: ${theme.color};
          width: ${size}px;
          height: ${size}px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(7, 27, 74, 0.38);
          border: ${border};
          transition: transform 0.2s ease;
        ">
          <span style="
            transform: rotate(45deg);
            color: ${theme.textColor};
            font-size: ${isSelected ? 16 : 13}px;
            font-weight: 800;
            line-height: 1;
            user-select: none;
          ">${theme.icon}</span>
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size],
      popupAnchor: [0, -size],
    });
  };

  // Call invalidateSize on map instance
  const triggerInvalidateSize = useCallback(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 100);
    }
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: UEAB_CENTER,
      zoom: 17,
      minZoom: 14,
      maxZoom: 20,
      maxBounds: MAX_BOUNDS,
      maxBoundsViscosity: 0.8,
      zoomControl: false, // Custom touch-friendly 44px controls
    });

    // Layer 1: Modern 2026 High-Resolution Hybrid Satellite (Imagery + Roads + Landmarks)
    const hybridSatelliteLayer = L.tileLayer(
      'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
      {
        subdomains: ['0', '1', '2', '3'],
        attribution: 'Imagery &copy; 2026 Google, Maxar',
        maxZoom: 20,
      }
    );

    // Layer 2: OpenStreetMap Standard Vector Tiles
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    });

    // Layer 3: Esri World Imagery (Aerial Archive)
    const esriLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri',
        maxNativeZoom: 17,
        maxZoom: 19,
      }
    );

    // Reference Labels & Roads Overlay for Esri
    const labelsLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: '',
        maxNativeZoom: 17,
        maxZoom: 19,
        opacity: 0.9,
      }
    );

    // Start with 2026 Hybrid Satellite
    hybridSatelliteLayer.addTo(map);

    satelliteTileLayerRef.current = hybridSatelliteLayer;
    osmTileLayerRef.current = osmLayer;
    esriTileLayerRef.current = esriLayer;
    labelsTileLayerRef.current = labelsLayer;

    // Draw Official UEAB Baraton 339-Acre Campus Perimeter Boundary (OSM Way 218276680)
    L.polygon(UEAB_CAMPUS_BOUNDARY, {
      color: '#F2B705',
      weight: 2.5,
      dashArray: '6, 8',
      fillColor: '#0B2A6F',
      fillOpacity: 0.06,
    })
      .bindTooltip('University of Eastern Africa, Baraton (339-Acre Campus Perimeter)', {
        sticky: true,
        className: 'ueab-campus-label',
      })
      .addTo(map);

    // Draw Campus Spine & Quad Ring Road
    L.polyline(UEAB_RING_ROAD, {
      color: '#0B2A6F',
      weight: 3.5,
      opacity: 0.65,
      dashArray: '8, 6',
      lineCap: 'round',
      lineJoin: 'round',
    })
      .bindTooltip('Baraton Central Academic Spine & Ring Road', {
        sticky: true,
      })
      .addTo(map);

    // Marker LayerGroup
    const markersGroup = L.layerGroup().addTo(map);
    markersLayerGroupRef.current = markersGroup;

    // Scale Control
    L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);

    // Main Gate Marker
    L.marker(UEAB_MAIN_GATE, {
      icon: L.divIcon({
        className: 'gate-pin',
        html: `
          <div style="background-color: #16A34A; width: 34px; height: 34px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.35); border: 2.5px solid #FFFFFF;">
            <span style="transform: rotate(45deg); color: #FFFFFF; font-weight: 900; font-size: 13px;">GATE</span>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
      }),
      zIndexOffset: 300,
    })
      .bindTooltip('UEAB Main Campus Gate (Security & Primary Route Origin)', {
        direction: 'top',
        className: 'ueab-campus-label',
      })
      .addTo(map);

    mapInstanceRef.current = map;

    // Observe container size changes
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Switch Base Layer (Satellite 2026 vs OSM vs Esri Aerial)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const satLayer = satelliteTileLayerRef.current;
    const osmLayer = osmTileLayerRef.current;
    const esriLayer = esriTileLayerRef.current;
    const labelsLayer = labelsTileLayerRef.current;
    if (!map || !satLayer || !osmLayer || !esriLayer) return;

    // Remove all layers first
    [satLayer, osmLayer, esriLayer, labelsLayer].forEach((layer) => {
      if (layer && map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    });

    if (baseMapType === 'satellite') {
      satLayer.addTo(map);
    } else if (baseMapType === 'osm') {
      osmLayer.addTo(map);
    } else if (baseMapType === 'aerial') {
      esriLayer.addTo(map);
      if (labelsLayer) labelsLayer.addTo(map);
    }
  }, [baseMapType]);

  // Coordinate Picker Click Listener
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (!isCoordPickerActive) return;
      const { lat, lng } = e.latlng;
      setPickedCoordinates({
        lat: Number(lat.toFixed(5)),
        lng: Number(lng.toFixed(5)),
        label: 'Map Surface Point',
      });
      setCopiedSuccess(false);
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [isCoordPickerActive]);

  // Copy coordinates string helper
  const handleCopyCoordinates = (lat: number, lng: number) => {
    const textToCopy = `lat: ${lat.toFixed(5)}, lng: ${lng.toFixed(5)}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2200);
    });
  };

  // Fly to venue & select it
  const handleFocusVenue = useCallback(
    (venue: VenueData, animate = true) => {
      setSelectedVenue(venue);
      if (onVenueSelect) onVenueSelect(venue);

      if (mapInstanceRef.current) {
        if (animate) {
          mapInstanceRef.current.flyTo([venue.lat, venue.lng], 18, {
            duration: 1.1,
          });
        } else {
          mapInstanceRef.current.setView([venue.lat, venue.lng], 18);
        }
      }
      triggerInvalidateSize();
    },
    [onVenueSelect, triggerInvalidateSize]
  );

  // Calculate walking distance via haversine for fallback
  const calculateHaversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371e3; // meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  // Draw walking route with OSRM (or fallback)
  const handleDrawDirections = useCallback(
    async (targetVenue: VenueData) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      setIsRoutingLoading(true);

      const origin: [number, number] = userLocation || UEAB_MAIN_GATE;
      const destination: [number, number] = [targetVenue.lat, targetVenue.lng];

      let routeCoords: [number, number][] = [];
      let distanceMeters = 0;
      let durationMinutes = 0;
      let isFallback = false;

      try {
        const url = `https://router.project-osrm.org/route/v1/foot/${origin[1]},${origin[0]};${destination[1]},${destination[0]}?overview=full&geometries=geojson`;
        const res = await fetch(url, { signal: AbortSignal.timeout(3500) });

        if (!res.ok) throw new Error('OSRM routing failed');
        const json = await res.json();

        if (json.routes && json.routes[0]) {
          const route = json.routes[0];
          distanceMeters = Math.round(route.distance);
          durationMinutes = Math.max(1, Math.round(route.duration / 60));
          // GeoJSON is [lng, lat], Leaflet needs [lat, lng]
          routeCoords = route.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng]);
        } else {
          throw new Error('No route geometry');
        }
      } catch (err) {
        // Fallback: Straight dashed line with subtle intermediate bend
        isFallback = true;
        const straightDistance = calculateHaversineDistance(
          origin[0],
          origin[1],
          destination[0],
          destination[1]
        );
        distanceMeters = straightDistance;
        // Estimate walking pace ~80 meters per minute (4.8 km/h)
        durationMinutes = Math.max(1, Math.round(straightDistance / 80));

        const midPoint: [number, number] = [
          (origin[0] + destination[0]) / 2,
          (origin[1] + destination[1]) / 2 + 0.0003,
        ];
        routeCoords = [origin, midPoint, destination];
      } finally {
        setIsRoutingLoading(false);
      }

      // Remove existing route polyline
      if (routeLayerRef.current) {
        map.removeLayer(routeLayerRef.current);
        routeLayerRef.current = null;
      }

      // Add route polyline to map
      const polyline = L.polyline(routeCoords, {
        color: isFallback ? '#DC2626' : '#F2B705',
        weight: 6,
        dashArray: isFallback ? '6, 8' : '10, 8',
        opacity: 0.95,
      }).addTo(map);

      routeLayerRef.current = polyline;
      map.fitBounds(polyline.getBounds(), { padding: [60, 60] });

      setActiveRoute({
        venue: targetVenue,
        distanceMeters,
        durationMinutes,
        isFallback,
      });

      triggerInvalidateSize();
    },
    [userLocation, triggerInvalidateSize]
  );

  // Clear Active Route
  const handleClearRoute = () => {
    if (mapInstanceRef.current && routeLayerRef.current) {
      mapInstanceRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
    setActiveRoute(null);
  };

  // Re-render venue markers on filter, dev mode, or selected venue change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    const filtered = VENUES.filter((venue) => {
      if (activeFilter !== 'all' && venue.category !== activeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          venue.name.toLowerCase().includes(q) ||
          venue.building.toLowerCase().includes(q) ||
          venue.code.toLowerCase().includes(q)
        );
      }
      return true;
    });

    filtered.forEach((venue) => {
      const isSelected = selectedVenue?.id === venue.id;
      const marker = L.marker([venue.lat, venue.lng], {
        icon: createVenuePinIcon(venue.category, isSelected),
        draggable: isCoordPickerActive,
        zIndexOffset: isSelected ? 500 : 100,
      });

      // Click: focus & open bottom sheet
      marker.on('click', () => {
        handleFocusVenue(venue);
      });

      // Tooltip on hover
      marker.bindTooltip(
        `<div style="font-family: Inter, sans-serif; font-size: 11px; font-weight: bold; padding: 1px 3px;">
          ${venue.name} <span style="color: #F2B705; font-family: monospace;">(${venue.code})</span>
        </div>`,
        { direction: 'top', offset: [0, -32] }
      );

      // Drag listener for Dev Coordinate Picker
      if (isCoordPickerActive) {
        marker.on('dragend', (e: L.LeafletEvent) => {
          const target = e.target as L.Marker;
          const pos = target.getLatLng();
          setPickedCoordinates({
            lat: Number(pos.lat.toFixed(5)),
            lng: Number(pos.lng.toFixed(5)),
            label: `Dragged: ${venue.name}`,
          });
          setCopiedSuccess(false);
        });
      }

      markersGroup.addLayer(marker);
    });
  }, [activeFilter, searchQuery, selectedVenue, isCoordPickerActive, handleFocusVenue]);

  // Handle external highlightVenueId or showRouteToVenueId props
  useEffect(() => {
    if (!highlightVenueId && !showRouteToVenueId) return;

    const targetId = showRouteToVenueId || highlightVenueId;
    const found = VENUES.find(
      (v) => v.id === targetId || v.code.toLowerCase() === targetId?.toLowerCase()
    );

    if (found) {
      handleFocusVenue(found);
      if (showRouteToVenueId) {
        handleDrawDirections(found);
      }
    }
  }, [highlightVenueId, showRouteToVenueId, handleFocusVenue, handleDrawDirections]);

  // Locate Me Geolocation handler
  const handleLocateMe = () => {
    setLocationStatusMessage(null);

    if (!('geolocation' in navigator)) {
      setLocationStatusMessage('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
        setUserLocation(coords);

        const map = mapInstanceRef.current;
        if (map) {
          // Remove previous user marker
          if (userLocationMarkerRef.current) {
            map.removeLayer(userLocationMarkerRef.current);
          }

          const userMarker = L.marker(coords, {
            icon: L.divIcon({
              className: 'user-live-pin',
              html: `
                <div style="background-color: #2563EB; width: 22px; height: 22px; border-radius: 50%; border: 3px solid #FFFFFF; box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.35); animation: pulse 2s infinite;"></div>
              `,
              iconSize: [22, 22],
              iconAnchor: [11, 11],
            }),
            zIndexOffset: 1000,
          })
            .bindPopup('<strong>Your Location</strong>')
            .addTo(map);

          userLocationMarkerRef.current = userMarker;
          map.flyTo(coords, 18, { duration: 1.2 });
        }
      },
      (error) => {
        let msg = 'Unable to retrieve location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location access was denied. You can still explore campus buildings and plan routes from the Main Gate.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'GPS signal currently unavailable. Anchoring at UEAB Main Gate.';
        }
        setLocationStatusMessage(msg);
        setTimeout(() => setLocationStatusMessage(null), 6000);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border border-[#E3E8F0] dark:border-[#1E3158] bg-white dark:bg-[#0C1D3D] shadow-sm flex flex-col ${className} ${
        isCoordPickerActive ? 'cursor-crosshair' : ''
      }`}
    >
      {/* Offline Status Warning Banner */}
      {!isOnline && (
        <div className="z-30 bg-amber-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 shrink-0" />
            <span>Map unavailable offline — showing cached campus facilities and local compass.</span>
          </div>
          <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded">Offline Mode</span>
        </div>
      )}

      {/* Geolocation Notice Banner */}
      {locationStatusMessage && (
        <div className="z-30 bg-[#0B2A6F] text-white px-4 py-2 text-xs font-medium flex items-center justify-between shadow-md animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#F2B705] shrink-0" />
            <span>{locationStatusMessage}</span>
          </div>
          <button
            onClick={() => setLocationStatusMessage(null)}
            className="text-white/80 hover:text-white p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Map Toolbar: Layer Chips & Satellite Switcher */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Layer Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white/95 dark:bg-[#071B4A]/95 backdrop-blur-md p-1.5 rounded-xl border border-[#E3E8F0] dark:border-[#1E3158] shadow-md pointer-events-auto max-w-[80%] overflow-x-auto">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'academic', label: 'Academic' },
              { id: 'services', label: 'Services' },
              { id: 'worship', label: 'Worship' },
              { id: 'sports', label: 'Sports' },
              { id: 'events', label: 'Events' },
            ] as const
          ).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => {
                setActiveFilter(id);
                triggerInvalidateSize();
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors touch-target min-h-[36px] flex items-center gap-1 ${
                activeFilter === id
                  ? 'bg-[#0B2A6F] text-white shadow-xs'
                  : 'text-[#5B6475] dark:text-slate-300 hover:text-[#0B2A6F] dark:hover:text-white'
              }`}
            >
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Top-Right Control Actions: Map/Satellite Switcher, 2026 Badge, Dev Picker */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* 2026 Campus Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#0B2A6F]/90 text-white text-[11px] font-bold border border-[#F2B705]/40 shadow-md backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span>2026 Campus GIS</span>
          </div>

          {/* Base Layer Switcher: 2026 Satellite vs Map vs Aerial */}
          <div className="bg-white/95 dark:bg-[#071B4A]/95 backdrop-blur-md p-1 rounded-xl border border-[#E3E8F0] dark:border-[#1E3158] shadow-md flex items-center gap-0.5">
            <button
              onClick={() => setBaseMapType('satellite')}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all min-h-[38px] ${
                baseMapType === 'satellite'
                  ? 'bg-[#0B2A6F] text-[#F2B705] shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Modern 2026 High-Resolution Hybrid Satellite with campus walkways and landmark overlays"
            >
              2026 Satellite
            </button>
            <button
              onClick={() => setBaseMapType('osm')}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all min-h-[38px] ${
                baseMapType === 'osm'
                  ? 'bg-[#0B2A6F] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="OpenStreetMap Standard Vector Street Map"
            >
              Map
            </button>
            <button
              onClick={() => setBaseMapType('aerial')}
              className={`px-2 py-1.5 text-xs font-bold rounded-lg transition-all min-h-[38px] ${
                baseMapType === 'aerial'
                  ? 'bg-[#0B2A6F] text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Esri World Imagery Aerial Tiles"
            >
              Esri
            </button>
          </div>

          {/* Dev Coordinate Picker Toggle (visible when dev tools enabled) */}
          {isDevToolsAvailable && (
            <button
              onClick={() => {
                setIsCoordPickerActive(!isCoordPickerActive);
                if (isCoordPickerActive) setPickedCoordinates(null);
              }}
              className={`p-2 rounded-xl border shadow-md transition-all touch-target min-h-[44px] min-w-[44px] flex items-center justify-center ${
                isCoordPickerActive
                  ? 'bg-[#F2B705] text-[#071B4A] border-[#DDA704] font-black ring-2 ring-[#0B2A6F]'
                  : 'bg-white/95 dark:bg-[#071B4A]/95 border-[#E3E8F0] dark:border-[#1E3158] text-[#5B6475] dark:text-white hover:bg-slate-50'
              }`}
              title={
                isCoordPickerActive
                  ? 'Coordinate Picker Active (Click map or drag pins)'
                  : 'Enable Dev Coordinate Picker Tool'
              }
            >
              <Crosshair className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Floating Right Map Controls (Locate-Me, Re-center, Zoom In/Out) - 44px min touch targets */}
      <div className="absolute top-16 right-3 z-20 flex flex-col gap-2">
        {/* Locate-Me Button */}
        <button
          onClick={handleLocateMe}
          className="w-11 h-11 bg-white/95 dark:bg-[#071B4A]/95 backdrop-blur-md rounded-xl border border-[#E3E8F0] dark:border-[#1E3158] shadow-md flex items-center justify-center text-[#0B2A6F] dark:text-[#F2B705] hover:bg-slate-50 dark:hover:bg-slate-800 transition touch-target"
          title="Locate My Position on Campus"
          aria-label="Locate My Position on Campus"
        >
          <Locate className="w-5 h-5" />
        </button>

        {/* Re-center Baraton Map Button */}
        <button
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.flyTo(UEAB_CENTER, 17, { duration: 1 });
            }
          }}
          className="w-11 h-11 bg-white/95 dark:bg-[#071B4A]/95 backdrop-blur-md rounded-xl border border-[#E3E8F0] dark:border-[#1E3158] shadow-md flex items-center justify-center text-[#0B2A6F] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition touch-target"
          title="Re-center on UEAB Baraton"
          aria-label="Re-center on UEAB Baraton"
        >
          <Compass className="w-5 h-5" />
        </button>

        {/* Zoom In */}
        <button
          onClick={() => mapInstanceRef.current?.zoomIn()}
          className="w-11 h-11 bg-white/95 dark:bg-[#071B4A]/95 backdrop-blur-md rounded-xl border border-[#E3E8F0] dark:border-[#1E3158] shadow-md flex items-center justify-center text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition touch-target font-black text-lg"
          title="Zoom In"
          aria-label="Zoom In"
        >
          +
        </button>

        {/* Zoom Out */}
        <button
          onClick={() => mapInstanceRef.current?.zoomOut()}
          className="w-11 h-11 bg-white/95 dark:bg-[#071B4A]/95 backdrop-blur-md rounded-xl border border-[#E3E8F0] dark:border-[#1E3158] shadow-md flex items-center justify-center text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition touch-target font-black text-lg"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          &minus;
        </button>
      </div>

      {/* Floating Active Directions Banner */}
      {activeRoute && (
        <div className="absolute top-16 left-3 z-20 bg-white/98 dark:bg-[#071B4A]/98 backdrop-blur-md border border-[#E3E8F0] dark:border-[#1E3158] p-3 rounded-2xl shadow-xl flex items-center gap-3 max-w-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="w-10 h-10 rounded-xl bg-[#F2B705] text-[#071B4A] flex items-center justify-center shrink-0">
            <Footprints className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-[#071B4A] dark:text-white truncate">
                To {activeRoute.venue.name}
              </span>
              {activeRoute.isFallback && (
                <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold">
                  Direct Line
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-300">
              {activeRoute.distanceMeters} m • ~{activeRoute.durationMinutes} min walk from Gate
            </p>
          </div>
          <button
            onClick={handleClearRoute}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
            title="Clear Walking Route"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Dev Coordinate Picker Floating Output Box */}
      {isCoordPickerActive && pickedCoordinates && (
        <div className="absolute bottom-20 left-3 z-30 bg-[#071B4A] text-white p-3.5 rounded-2xl shadow-2xl border-2 border-[#F2B705] max-w-xs space-y-2 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#F2B705] flex items-center gap-1">
              <Crosshair className="w-3.5 h-3.5" /> Dev Coordinate Inspector
            </span>
            <button
              onClick={() => setPickedCoordinates(null)}
              className="text-white/60 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="bg-black/40 p-2 rounded-lg font-mono text-xs space-y-0.5 select-all">
            <div className="text-[#93C5FD]">lat: {pickedCoordinates.lat.toFixed(5)}</div>
            <div className="text-[#93C5FD]">lng: {pickedCoordinates.lng.toFixed(5)}</div>
            {pickedCoordinates.label && (
              <div className="text-[10px] text-slate-400 font-sans mt-1">
                {pickedCoordinates.label}
              </div>
            )}
          </div>

          <button
            onClick={() => handleCopyCoordinates(pickedCoordinates.lat, pickedCoordinates.lng)}
            className="w-full py-1.5 px-3 rounded-lg bg-[#F2B705] text-[#071B4A] text-xs font-black flex items-center justify-center gap-1.5 hover:bg-[#DDA704] transition active:scale-95"
          >
            {copiedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-800" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy for venues.ts</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Leaflet Map Canvas Container */}
      <div ref={mapContainerRef} className="flex-1 w-full relative min-h-[380px]" />

      {/* Bottom Sheet / Panel for Inspected Venue */}
      {selectedVenue && (
        <div className="z-30 bg-white/98 dark:bg-[#071B4A]/98 backdrop-blur-md border-t border-[#E3E8F0] dark:border-[#1E3158] p-4 sm:p-5 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Dual Photos: Exterior AND Entrance Door with Accessible Alt Text */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* Photo 1: Building Exterior */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 relative bg-slate-100 group">
                <ImageWithFallback
                  src={selectedVenue.photos.exterior}
                  alt={selectedVenue.photos.exteriorAlt || `${selectedVenue.name} Building Exterior`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <span className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur-xs text-[9px] text-white text-center font-bold py-0.5">
                  Exterior
                </span>
              </div>

              {/* Photo 2: Entrance Door */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 relative bg-slate-100 group">
                <ImageWithFallback
                  src={selectedVenue.photos.entranceDoor}
                  alt={selectedVenue.photos.entranceDoorAlt || `${selectedVenue.name} Entrance Door`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <span className="absolute bottom-0 inset-x-0 bg-[#0B2A6F]/90 backdrop-blur-xs text-[9px] text-[#F2B705] text-center font-black py-0.5 flex items-center justify-center gap-0.5">
                  <DoorOpen className="w-2.5 h-2.5" /> Door
                </span>
              </div>
            </div>

            {/* Venue Metadata */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-[#0B2A6F] text-white">
                  {selectedVenue.code}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {selectedVenue.category}
                </span>
                <h3 className="font-extrabold text-sm sm:text-base text-[#071B4A] dark:text-white truncate">
                  {selectedVenue.name}
                </h3>
              </div>

              <p className="text-xs text-[#5B6475] dark:text-slate-300">
                {selectedVenue.building} • Floor: <strong>{selectedVenue.floor}</strong>
              </p>

              {/* Indoor Guide & Opening Hours */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-[#071B4A] dark:text-slate-200 space-y-1">
                <div>
                  <strong className="text-[#0B2A6F] dark:text-[#F2B705]">Indoor Hint: </strong>
                  <span>{selectedVenue.indoorHint || selectedVenue.indoorHints}</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{selectedVenue.openingHours}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Directions & Dismiss */}
            <div className="flex sm:flex-col items-center gap-2 shrink-0 w-full sm:w-auto">
              <Button
                size="sm"
                variant="gold"
                onClick={() => handleDrawDirections(selectedVenue)}
                disabled={isRoutingLoading}
                className="w-full sm:w-auto font-black text-xs touch-target min-h-[44px]"
              >
                <Footprints className="w-4 h-4 mr-1.5" />
                <span>{isRoutingLoading ? 'Calculating...' : 'Directions'}</span>
              </Button>

              <button
                onClick={() => {
                  setSelectedVenue(null);
                  triggerInvalidateSize();
                }}
                className="px-3 py-2 text-slate-500 hover:text-slate-800 dark:hover:text-white text-xs font-bold touch-target min-h-[44px] flex items-center justify-center"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
