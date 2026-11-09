/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * House Find - Off-Campus Student Housing & Roommate Matching
 * Baraton Centre, Chemamul, Kaimosi Road, Koitalel, Cheterit
 * List/Map toggle, KES filters, 3-house comparison, landlord contact, roommate board
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { HOUSES, ROOMMATE_POSTS, HouseListing, RoommatePost } from '../../data/houses';
import { useKampasStore } from '../../lib/store';
import { ImageWithFallback } from '../../components/ui/ImageWithFallback';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Home,
  MapPin,
  Search,
  Filter,
  SlidersHorizontal,
  Heart,
  Share2,
  CheckCircle2,
  Wifi,
  Droplets,
  Zap,
  Users,
  Eye,
  ArrowRight,
  X,
  Phone,
  MessageSquare,
  Sparkles,
  Scale,
  PlusCircle,
  Map as MapIcon,
  List as ListIcon,
} from 'lucide-react';

export const HouseFindPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useKampasStore();

  // Active Tab: 'listings' | 'roommates' | 'saved'
  const [activeTab, setActiveTab] = useState<'listings' | 'roommates' | 'saved'>('listings');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [maxPriceKes, setMaxPriceKes] = useState<number>(12000);
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(3.0);
  const [furnishedOnly, setFurnishedOnly] = useState<boolean>(false);
  const [water24_7Only, setWater24_7Only] = useState<boolean>(false);
  const [wifiOnly, setWifiOnly] = useState<boolean>(false);
  const [showFiltersModal, setShowFiltersModal] = useState<boolean>(false);

  // LocalStorage Persisted Saved Houses
  const [savedHouseIds, setSavedHouseIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kampas_saved_houses');
      return saved ? JSON.parse(saved) : ['house-1'];
    } catch {
      return ['house-1'];
    }
  });

  // Compare Houses (up to 3)
  const [compareHouseIds, setCompareHouseIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  // Quick Landlord Contact Modal
  const [contactingHouse, setContactingHouse] = useState<HouseListing | null>(null);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquiryStatus, setInquiryStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [landlordSimulatedReply, setLandlordSimulatedReply] = useState<string | null>(null);

  // New Roommate Post Modal
  const [showRoommatePostModal, setShowRoommatePostModal] = useState(false);
  const [roommatePostsList, setRoommatePostsList] = useState<RoommatePost[]>(ROOMMATE_POSTS);
  const [newRoommateForm, setNewRoommateForm] = useState({
    area: 'Baraton Centre',
    budgetKes: 4500,
    lookingFor: '1 Female Roommate for Bedsitter',
    lifestyle: 'Non-smoker, quiet study hours, SDA friendly',
    description: 'Looking to split rent for a spacious studio with ceramic tiles and fast Wi-Fi.',
  });

  useEffect(() => {
    localStorage.setItem('kampas_saved_houses', JSON.stringify(savedHouseIds));
  }, [savedHouseIds]);

  const toggleSaveHouse = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedHouseIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleCompareHouse = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCompareHouseIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 houses side-by-side.');
        return prev;
      }
      return [...prev, id];
    });
  };

  // Filtered Listings
  const filteredHouses = useMemo(() => {
    return HOUSES.filter((house) => {
      if (activeTab === 'saved' && !savedHouseIds.includes(house.id)) {
        return false;
      }

      if (selectedArea !== 'all' && house.area !== selectedArea) {
        return false;
      }

      if (selectedType !== 'all' && house.type !== selectedType) {
        return false;
      }

      if (house.priceMonthlyKes > maxPriceKes) {
        return false;
      }

      if (house.distanceKm > maxDistanceKm) {
        return false;
      }

      if (furnishedOnly && !house.isFurnished) {
        return false;
      }

      if (water24_7Only && !house.amenities.water) {
        return false;
      }

      if (wifiOnly && !house.amenities.wifi) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = house.title.toLowerCase().includes(q);
        const matchesArea = house.area.toLowerCase().includes(q);
        const matchesDesc = house.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesArea && !matchesDesc) return false;
      }

      return true;
    });
  }, [
    activeTab,
    savedHouseIds,
    selectedArea,
    selectedType,
    maxPriceKes,
    maxDistanceKm,
    furnishedOnly,
    water24_7Only,
    wifiOnly,
    searchQuery,
  ]);

  const handleSendLandlordInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactingHouse) return;
    setInquiryStatus('sending');
    setTimeout(() => {
      setInquiryStatus('sent');
      setLandlordSimulatedReply(
        `Habari ${user.fullName.split(' ')[0]}! This is ${contactingHouse.landlord.name}. Yes, the room at ${contactingHouse.title} is available for this trimester! Rent is KES ${contactingHouse.priceMonthlyKes.toLocaleString()}/mo with borehole water and tokens. You can call or WhatsApp me on ${contactingHouse.landlord.phone} to come see it today.`
      );
    }, 700);
  };

  const handleCreateRoommatePost = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: RoommatePost = {
      id: `rm-${Date.now()}`,
      studentName: user.fullName,
      course: user.course || 'BSc Software Engineering',
      year: user.yearOfStudy || 3,
      lookingFor: newRoommateForm.lookingFor,
      budgetKes: Number(newRoommateForm.budgetKes),
      area: newRoommateForm.area,
      moveInDate: 'Next Trimester (January 2027)',
      description: newRoommateForm.description,
      lifestyle: newRoommateForm.lifestyle.split(',').map((s) => s.trim()),
      contactEmail: user.email,
    };
    setRoommatePostsList([newPost, ...roommatePostsList]);
    setShowRoommatePostModal(false);
  };

  const comparedHousesList = useMemo(() => {
    return HOUSES.filter((h) => compareHouseIds.includes(h.id));
  }, [compareHouseIds]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E3E8F0] dark:border-[#1E3158]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#0B2A6F] text-[#F2B705]">
              <Home className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071B4A] dark:text-white tracking-tight">
              House Find
            </h1>
            <Badge variant="gold">Off-Campus Only</Badge>
          </div>
          <p className="text-sm text-[#5B6475] dark:text-slate-300 mt-1">
            Verified student rentals in Baraton Centre, Chemamul, Kaimosi Rd & Cheterit. No broker fees.
          </p>
        </div>

        {/* Tab Switcher & View Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-200/80 dark:bg-slate-800 rounded-lg text-xs font-bold">
            <button
              onClick={() => setActiveTab('listings')}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTab === 'listings'
                  ? 'bg-white dark:bg-[#0B2A6F] text-[#071B4A] dark:text-[#F2B705] shadow-xs'
                  : 'text-[#5B6475] dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Listings ({HOUSES.length})
            </button>
            <button
              onClick={() => setActiveTab('roommates')}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTab === 'roommates'
                  ? 'bg-white dark:bg-[#0B2A6F] text-[#071B4A] dark:text-[#F2B705] shadow-xs'
                  : 'text-[#5B6475] dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Roommates ({roommatePostsList.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-3 py-1.5 rounded-md transition flex items-center gap-1 ${
                activeTab === 'saved'
                  ? 'bg-white dark:bg-[#0B2A6F] text-[#071B4A] dark:text-[#F2B705] shadow-xs'
                  : 'text-[#5B6475] dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Saved ({savedHouseIds.length})</span>
            </button>
          </div>

          {activeTab !== 'roommates' && (
            <div className="hidden sm:flex items-center p-1 bg-slate-200/80 dark:bg-slate-800 rounded-lg">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-[#0B2A6F] text-[#0B2A6F] dark:text-[#F2B705] shadow-xs'
                    : 'text-slate-500'
                }`}
                title="List View"
              >
                <ListIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-1.5 rounded-md ${
                  viewMode === 'map'
                    ? 'bg-white dark:bg-[#0B2A6F] text-[#0B2A6F] dark:text-[#F2B705] shadow-xs'
                    : 'text-slate-500'
                }`}
                title="Map View"
              >
                <MapIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {activeTab === 'roommates' ? (
        /* ================= ROOMMATES BOARD ================= */
        <div className="space-y-6">
          <div className="p-4 bg-white dark:bg-[#0C1D3D] rounded-xl border border-[#E3E8F0] dark:border-[#1E3158] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#071B4A] dark:text-white">
                Baraton Roommate Matching Board
              </h2>
              <p className="text-xs text-[#5B6475] dark:text-slate-300">
                Split rent, share utilities, and find compatible lifestyle study partners near campus.
              </p>
            </div>
            <Button
              variant="gold"
              onClick={() => setShowRoommatePostModal(true)}
              className="shrink-0"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Post Roommate Request
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {roommatePostsList.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-[#0C1D3D] rounded-xl border border-[#E3E8F0] dark:border-[#1E3158] p-5 shadow-xs hover:border-[#0B2A6F] transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-extrabold text-[#0B2A6F] dark:text-[#F2B705] uppercase tracking-wider">
                        {post.area}
                      </span>
                      <h3 className="text-base font-bold text-[#071B4A] dark:text-white leading-snug">
                        {post.lookingFor}
                      </h3>
                    </div>
                    <Badge variant="done">
                      KES {post.budgetKes.toLocaleString()}/mo
                    </Badge>
                  </div>

                  <p className="text-xs text-[#5B6475] dark:text-slate-300 leading-relaxed">
                    {post.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <Users className="w-3.5 h-3.5 text-[#0B2A6F] dark:text-[#F2B705]" />
                      <span className="font-semibold">{post.studentName}</span>
                      <span className="text-slate-400">({post.course}, Yr {post.year})</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Move in: {post.moveInDate}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {post.lifestyle.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        ✓ {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    size="sm"
                    variant="primary"
                    className="w-full text-xs"
                    onClick={() => {
                      alert(`Message drafted to ${post.studentName} (${post.contactEmail}). Check your student webmail.`);
                    }}
                  >
                    <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                    Connect with {post.studentName.split(' ')[0]}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ================= LISTINGS & FILTERS ================= */
        <div className="space-y-5">
          {/* Search & Filter Bar */}
          <div className="bg-white dark:bg-[#0C1D3D] p-4 rounded-xl border border-[#E3E8F0] dark:border-[#1E3158] shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Keyword Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by neighborhood, apartment name, features..."
                  className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#F7F9FC] dark:bg-slate-900 border border-[#E3E8F0] dark:border-slate-700 text-xs sm:text-sm text-[#0F172A] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0B2A6F]"
                />
              </div>

              {/* Area Quick Dropdown */}
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="h-10 px-3 rounded-lg bg-[#F7F9FC] dark:bg-slate-900 border border-[#E3E8F0] dark:border-slate-700 text-xs sm:text-sm text-[#0F172A] dark:text-white font-medium focus:outline-none"
              >
                <option value="all">All Neighborhoods</option>
                <option value="Baraton Centre">Baraton Centre (Near Gate)</option>
                <option value="Chemamul">Chemamul</option>
                <option value="Kaimosi Road">Kaimosi Road</option>
                <option value="Koitalel">Koitalel</option>
                <option value="Cheterit">Cheterit</option>
              </select>

              {/* House Type Quick Dropdown */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="h-10 px-3 rounded-lg bg-[#F7F9FC] dark:bg-slate-900 border border-[#E3E8F0] dark:border-slate-700 text-xs sm:text-sm text-[#0F172A] dark:text-white font-medium focus:outline-none"
              >
                <option value="all">All Room Types</option>
                <option value="bedsitter">Self-Contained Bedsitter</option>
                <option value="single">Single Room</option>
                <option value="one_bedroom">1-Bedroom Apartment</option>
                <option value="shared">Shared Room</option>
              </select>

              {/* Filters Drawer Toggle */}
              <Button
                variant="secondary"
                size="md"
                onClick={() => setShowFiltersModal(true)}
                className="shrink-0 flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#0B2A6F] dark:text-[#F2B705]" />
                <span>Filters</span>
                {(furnishedOnly || water24_7Only || wifiOnly || maxPriceKes < 12000) && (
                  <span className="w-2 h-2 rounded-full bg-[#F2B705]" />
                )}
              </Button>
            </div>

            {/* Quick Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-[#5B6475] font-semibold">Quick:</span>
              <button
                onClick={() => setWater24_7Only(!water24_7Only)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition ${
                  water24_7Only
                    ? 'bg-[#0B2A6F] text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Droplets className="w-3.5 h-3.5 text-blue-400" />
                <span>24/7 Water Borehole</span>
              </button>

              <button
                onClick={() => setWifiOnly(!wifiOnly)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition ${
                  wifiOnly
                    ? 'bg-[#0B2A6F] text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span>Wi-Fi Included</span>
              </button>

              <button
                onClick={() => setFurnishedOnly(!furnishedOnly)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition ${
                  furnishedOnly
                    ? 'bg-[#0B2A6F] text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Furnished / Study Desk</span>
              </button>

              <span className="ml-auto text-slate-400 text-xs">
                Showing {filteredHouses.length} of {HOUSES.length} rentals
              </span>
            </div>
          </div>

          {/* Listings Grid or Map View */}
          {viewMode === 'map' ? (
            /* Interactive Visual Mini Map for Housing */
            <div className="p-4 bg-white dark:bg-[#0C1D3D] rounded-xl border border-[#E3E8F0] dark:border-[#1E3158] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#071B4A] dark:text-white">
                    Off-Campus Housing Geographical Map
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pins indicate verified rental clusters surrounding Baraton Campus Main Gate
                  </p>
                </div>
                <Link to="/campus/map">
                  <Button variant="secondary" size="sm">
                    Open Full Campus GIS Map
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredHouses.slice(0, 6).map((house) => (
                  <div
                    key={house.id}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                      <ImageWithFallback
                        src={house.photos[0]}
                        alt={house.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-[#071B4A] dark:text-white truncate">
                        {house.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {house.area} • {house.walkingMinutes} min walk
                      </p>
                      <p className="text-xs font-bold text-[#0B2A6F] dark:text-[#F2B705]">
                        KES {house.priceMonthlyKes.toLocaleString()}/mo
                      </p>
                    </div>
                    <Link to={`/housing/${house.id}`}>
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4 text-slate-500" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Listings Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredHouses.map((house) => {
                const isSaved = savedHouseIds.includes(house.id);
                const isCompared = compareHouseIds.includes(house.id);

                return (
                  <div
                    key={house.id}
                    className="group bg-white dark:bg-[#0C1D3D] rounded-xl border border-[#E3E8F0] dark:border-[#1E3158] overflow-hidden shadow-xs hover:border-[#0B2A6F] hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Photo Thumbnail with Action Overlays */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <Link to={`/housing/${house.id}`}>
                          <ImageWithFallback
                            src={house.photos[0]}
                            alt={house.title}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>

                        {/* Top-Right Heart Save Button */}
                        <button
                          onClick={(e) => toggleSaveHouse(house.id, e)}
                          aria-label={isSaved ? 'Unsave listing' : 'Save listing'}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs flex items-center justify-center text-slate-700 dark:text-white hover:scale-110 transition shadow-md"
                        >
                          <Heart
                            className={`w-4 h-4 transition ${
                              isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
                            }`}
                          />
                        </button>

                        {/* Bottom-left Distance Overlay */}
                        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#F2B705]" />
                          <span>{house.walkingMinutes} mins walk ({house.distanceKm} km)</span>
                        </div>

                        {/* Photo Count Pill */}
                        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white px-1.5 py-0.5 rounded text-[10px] font-medium">
                          📷 {house.photos.length}
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[11px] font-bold text-[#0B2A6F] dark:text-[#F2B705] uppercase tracking-wider">
                              {house.area}
                            </span>
                            <Link to={`/housing/${house.id}`}>
                              <h3 className="font-bold text-base text-[#071B4A] dark:text-white line-clamp-1 group-hover:text-[#0B2A6F] transition-colors">
                                {house.title}
                              </h3>
                            </Link>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-base font-extrabold text-[#0B2A6F] dark:text-[#F2B705]">
                              KES {house.priceMonthlyKes.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-slate-400 block leading-tight">
                              / month
                            </span>
                          </div>
                        </div>

                        {/* Room Type & Key Features */}
                        <p className="text-xs text-[#5B6475] dark:text-slate-300 line-clamp-2">
                          {house.description}
                        </p>

                        {/* Amenity Badges */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {house.amenities.water && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                              💧 Water 24/7
                            </span>
                          )}
                          {house.amenities.wifi && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                              📶 Wi-Fi
                            </span>
                          )}
                          {house.isFurnished && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                              🛏 Furnished
                            </span>
                          )}
                          {house.amenities.securityGuard && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                              🛡 Guard
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer: Compare Checkbox & Action Button */}
                    <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <label
                        className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none"
                        onClick={(e) => toggleCompareHouse(house.id, e)}
                      >
                        <input
                          type="checkbox"
                          checked={isCompared}
                          onChange={() => {}}
                          className="rounded text-[#0B2A6F] focus:ring-[#F2B705] cursor-pointer"
                        />
                        <span>Compare</span>
                      </label>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setContactingHouse(house);
                            setInquiryStatus('idle');
                            setLandlordSimulatedReply(null);
                            setInquiryMessage(`Hello, is ${house.title} available for this trimester?`);
                          }}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white hover:bg-slate-200 transition text-xs font-semibold flex items-center gap-1"
                          title="Contact Landlord"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                        <Link to={`/housing/${house.id}`}>
                          <Button size="sm" variant="primary" className="text-xs">
                            Details
                            <ArrowRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredHouses.length === 0 && (
            <div className="p-12 text-center bg-white dark:bg-[#0C1D3D] rounded-xl border border-[#E3E8F0] dark:border-[#1E3158] space-y-3">
              <Home className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-[#071B4A] dark:text-white">
                No rentals match your current criteria
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your price range, increasing distance, or clearing amenity filters.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedArea('all');
                  setSelectedType('all');
                  setMaxPriceKes(12000);
                  setMaxDistanceKm(3.0);
                  setFurnishedOnly(false);
                  setWater24_7Only(false);
                  setWifiOnly(false);
                  setSearchQuery('');
                }}
              >
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ================= STICKY COMPARE BAR ================= */}
      {compareHouseIds.length > 0 && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#071B4A] text-white px-5 py-3 rounded-full shadow-2xl border border-[#F2B705]/40 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#F2B705]" />
            <span className="text-xs font-bold">
              Comparing {compareHouseIds.length} of 3 rentals
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="gold"
              size="sm"
              onClick={() => setShowCompareModal(true)}
              className="text-xs font-bold"
            >
              Compare Side-by-Side
            </Button>
            <button
              onClick={() => setCompareHouseIds([])}
              className="text-slate-400 hover:text-white p-1 text-xs"
              title="Clear Comparison"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= COMPARE MODAL ================= */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#071B4A] max-w-4xl w-full rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#F2B705]" />
                <h3 className="text-lg font-bold text-[#071B4A] dark:text-white">
                  Side-by-Side House Comparison
                </h3>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="p-2 text-slate-400 font-bold uppercase w-32">Metric</th>
                    {comparedHousesList.map((h) => (
                      <th key={h.id} className="p-2 min-w-48">
                        <div className="font-extrabold text-sm text-[#071B4A] dark:text-white">
                          {h.title}
                        </div>
                        <div className="text-[11px] text-[#0B2A6F] dark:text-[#F2B705]">
                          {h.area}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="p-2 font-semibold text-slate-500">Monthly Rent</td>
                    {comparedHousesList.map((h) => (
                      <td key={h.id} className="p-2 font-bold text-sm text-[#0B2A6F] dark:text-[#F2B705]">
                        KES {h.priceMonthlyKes.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-slate-500">Deposit</td>
                    {comparedHousesList.map((h) => (
                      <td key={h.id} className="p-2">
                        KES {h.depositKes.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-slate-500">Walk to Main Gate</td>
                    {comparedHousesList.map((h) => (
                      <td key={h.id} className="p-2">
                        {h.walkingMinutes} mins ({h.distanceKm} km)
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-slate-500">Room Type</td>
                    {comparedHousesList.map((h) => (
                      <td key={h.id} className="p-2 capitalize">
                        {h.type.replace('_', ' ')}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-slate-500">Water 24/7</td>
                    {comparedHousesList.map((h) => (
                      <td key={h.id} className="p-2">
                        {h.amenities.water ? '✅ Borehole' : '❌ Rationed'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-slate-500">Wi-Fi</td>
                    {comparedHousesList.map((h) => (
                      <td key={h.id} className="p-2">
                        {h.amenities.wifi ? '✅ Fast Fiber' : '❌ None'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-slate-500">Security</td>
                    {comparedHousesList.map((h) => (
                      <td key={h.id} className="p-2">
                        {h.amenities.securityGuard ? '✅ 24hr Guard' : 'Perimeter Wall'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-slate-500">Landlord Rating</td>
                    {comparedHousesList.map((h) => (
                      <td key={h.id} className="p-2">
                        ⭐ {h.landlord.rating} ({h.landlord.name})
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <Button variant="primary" onClick={() => setShowCompareModal(false)}>
                Close Comparison
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ================= FILTERS MODAL ================= */}
      {showFiltersModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#071B4A] max-w-md w-full rounded-2xl shadow-2xl p-5 space-y-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-[#071B4A] dark:text-white">
                Detailed Housing Filters
              </h3>
              <button
                onClick={() => setShowFiltersModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Max Rent Slider */}
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Max Monthly Rent</span>
                  <span className="text-[#0B2A6F] dark:text-[#F2B705] font-bold">
                    KES {maxPriceKes.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={3500}
                  max={15000}
                  step={500}
                  value={maxPriceKes}
                  onChange={(e) => setMaxPriceKes(Number(e.target.value))}
                  className="w-full accent-[#0B2A6F]"
                />
              </div>

              {/* Max Distance Slider */}
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Max Walking Distance</span>
                  <span className="text-[#0B2A6F] dark:text-[#F2B705] font-bold">
                    {maxDistanceKm} km
                  </span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={4.0}
                  step={0.2}
                  value={maxDistanceKm}
                  onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
                  className="w-full accent-[#0B2A6F]"
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={water24_7Only}
                    onChange={(e) => setWater24_7Only(e.target.checked)}
                    className="rounded text-[#0B2A6F]"
                  />
                  <span>24/7 Borehole Water Guaranteed</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={wifiOnly}
                    onChange={(e) => setWifiOnly(e.target.checked)}
                    className="rounded text-[#0B2A6F]"
                  />
                  <span>High-Speed Wi-Fi Included in Rent</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={furnishedOnly}
                    onChange={(e) => setFurnishedOnly(e.target.checked)}
                    className="rounded text-[#0B2A6F]"
                  />
                  <span>Furnished (Bed & Study Station)</span>
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setMaxPriceKes(12000);
                  setMaxDistanceKm(3.0);
                  setFurnishedOnly(false);
                  setWater24_7Only(false);
                  setWifiOnly(false);
                }}
              >
                Reset
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowFiltersModal(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ================= LANDLORD CONTACT MODAL ================= */}
      {contactingHouse && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#071B4A] max-w-md w-full rounded-2xl shadow-2xl p-5 space-y-4 border border-slate-200 dark:border-slate-700 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-[#071B4A] dark:text-white">
                  Contact Landlord
                </h3>
                <p className="text-xs text-slate-500">{contactingHouse.title}</p>
              </div>
              <button
                onClick={() => setContactingHouse(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#071B4A] dark:text-white">
                  {contactingHouse.landlord.name}
                </span>
                <span className="text-emerald-600 font-bold">⭐ {contactingHouse.landlord.rating}</span>
              </div>
              <div className="text-slate-500">Phone: {contactingHouse.landlord.phone}</div>
              <div className="text-[11px] text-[#0B2A6F] dark:text-[#F2B705]">
                Typical response: {contactingHouse.landlord.responseTime}
              </div>
            </div>

            {landlordSimulatedReply ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2 animate-in fade-in">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Simulated Landlord Reply Received!</span>
                </div>
                <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed italic">
                  "{landlordSimulatedReply}"
                </p>
                <Button
                  size="sm"
                  variant="primary"
                  className="w-full mt-2"
                  onClick={() => setContactingHouse(null)}
                >
                  Done
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSendLandlordInquiry} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Your Message / Move-In Inquiries
                  </label>
                  <textarea
                    rows={3}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white focus:outline-none"
                  />
                </div>

                <div className="text-[11px] text-slate-400">
                  Your student name ({user.fullName}) and phone will be sent with this message.
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setContactingHouse(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="gold"
                    size="sm"
                    disabled={inquiryStatus === 'sending'}
                  >
                    {inquiryStatus === 'sending' ? 'Sending...' : 'Send Inquiry'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= CREATE ROOMMATE POST MODAL ================= */}
      {showRoommatePostModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#071B4A] max-w-md w-full rounded-2xl shadow-2xl p-5 space-y-4 border border-slate-200 dark:border-slate-700 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-[#071B4A] dark:text-white">
                Post Roommate Wanted
              </h3>
              <button
                onClick={() => setShowRoommatePostModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoommatePost} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Neighborhood
                </label>
                <select
                  value={newRoommateForm.area}
                  onChange={(e) => setNewRoommateForm({ ...newRoommateForm, area: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                >
                  <option value="Baraton Centre">Baraton Centre</option>
                  <option value="Chemamul">Chemamul</option>
                  <option value="Kaimosi Road">Kaimosi Road</option>
                  <option value="Cheterit">Cheterit</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Budget per Person (KES / month)
                </label>
                <input
                  type="number"
                  value={newRoommateForm.budgetKes}
                  onChange={(e) => setNewRoommateForm({ ...newRoommateForm, budgetKes: Number(e.target.value) })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Short Title / Looking For
                </label>
                <input
                  type="text"
                  value={newRoommateForm.lookingFor}
                  onChange={(e) => setNewRoommateForm({ ...newRoommateForm, lookingFor: e.target.value })}
                  required
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lifestyle Preferences (comma separated)
                </label>
                <input
                  type="text"
                  value={newRoommateForm.lifestyle}
                  onChange={(e) => setNewRoommateForm({ ...newRoommateForm, lifestyle: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newRoommateForm.description}
                  onChange={(e) => setNewRoommateForm({ ...newRoommateForm, description: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowRoommatePostModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="gold" size="sm">
                  Publish Post
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
