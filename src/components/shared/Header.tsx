/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Main App Top Bar
 * - Kampas logo (single transparent PNG: symbol + wordmark)
 * - Debounced global search bar with grouped suggestions dropdown & thumbnails:
 *   Venues (building photo), Houses (house photo), Events, Units, Documents, Clubs, People, Lost items
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Recent searches stored in localStorage
 * - Notification bell with unread badge
 * - Profile avatar menu (Profile, Dark Mode, Low-Data Mode, Sign Out)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { useKampasStore } from '../../lib/store';
import { searchService, GroupedSearchResults, SearchResultItem } from '../../services/searchService';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import {
  Search,
  Bell,
  Menu,
  X,
  Moon,
  Sun,
  WifiOff,
  User,
  LogOut,
  MapPin,
  Home,
  FileText,
  Users,
  Compass,
  SearchCheck,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileMenu,
  isMobileMenuOpen = false,
}) => {
  const navigate = useNavigate();
  const {
    user,
    notifications,
    darkMode,
    toggleDarkMode,
    lowDataMode,
    setLowDataMode,
    logout,
  } = useKampasStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<GroupedSearchResults | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kampas_recent_searches');
      return saved ? JSON.parse(saved) : ['Science Complex', 'Bedsitter', 'COSC 311', 'Safaricom'];
    } catch {
      return ['Science Complex', 'Bedsitter', 'COSC 311'];
    }
  });

  // User Avatar Dropdown
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    let previousScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const keepHeaderVisible =
        window.innerWidth >= 768 ||
        currentScrollY <= 72 ||
        isMobileMenuOpen ||
        isUserMenuOpen;

      if (keepHeaderVisible) {
        setIsHeaderHidden(false);
      } else if (currentScrollY > previousScrollY + 4) {
        setIsSearchOpen(false);
        setIsHeaderHidden(true);
      } else if (currentScrollY < previousScrollY - 4) {
        setIsHeaderHidden(false);
      }

      previousScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isMobileMenuOpen, isSearchOpen, isUserMenuOpen]);

  // Debounce search query by 200ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Execute grouped search when debounced query updates
  useEffect(() => {
    if (!debouncedQuery) {
      setSearchResults(null);
      setSelectedIndex(-1);
      return;
    }
    const results = searchService.searchAll(debouncedQuery);
    setSearchResults(results);
    setSelectedIndex(-1);
  }, [debouncedQuery]);

  // Flat list of all current search results for keyboard navigation
  const flatResultItems = React.useMemo(() => {
    if (!searchResults) return [];
    return [
      ...searchResults.venues,
      ...searchResults.houses,
      ...searchResults.events,
      ...searchResults.units,
      ...searchResults.documents,
      ...searchResults.clubs,
      ...searchResults.people,
      ...searchResults.lostItems,
    ];
  }, [searchResults]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isSearchOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < flatResultItems.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && flatResultItems[selectedIndex]) {
        handleSelectItem(flatResultItems[selectedIndex]);
      } else if (searchQuery.trim()) {
        handleSubmitSearch(searchQuery.trim());
      }
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelectItem = (item: SearchResultItem) => {
    addToRecentSearches(item.title);
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(item.targetUrl);
  };

  const handleSubmitSearch = (q: string) => {
    if (!q) return;
    addToRecentSearches(q);
    setIsSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const addToRecentSearches = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    try {
      localStorage.setItem('kampas_recent_searches', JSON.stringify(updated));
    } catch {}
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global CMD+K shortcut
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  return (
    <header className={`fixed top-0 left-0 z-40 w-full h-14 sm:h-[68px] bg-[#06163E] text-white border-b border-white/10 transition-[transform,colors] duration-300 ease-in-out select-none shadow-[0_8px_24px_rgba(4,16,48,0.16)] ${isHeaderHidden ? '-translate-y-full md:translate-y-0' : 'translate-y-0'}`}>
      <div className="h-full max-w-[1440px] mx-auto min-w-0 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-5">
        {/* Left: Brand Identity & Mobile Hamburger */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 -ml-2 text-white hover:bg-white/10 rounded-xl touch-target flex items-center justify-center transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <a href="/" className="flex items-center group shrink-0" aria-label="Kampas home">
          <img
            src="/brand/kampas-logo.png"
            alt="Kampas"
            className="h-8 sm:h-9 w-auto max-w-none object-contain group-hover:scale-105 transition-transform"
          />
          </a>
        </div>

        {/* Center: Global Working Search Bar with Debounce & Grouped Suggestions */}
        <div ref={searchContainerRef} className="relative hidden min-w-0 max-w-2xl flex-1 sm:block">
          <div className="relative">
            <Search className="w-4 h-4 text-blue-100/70 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!isSearchOpen) setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search venues, houses, events, units, notes, people... (⌘K)"
              className="w-full h-10 sm:h-11 pl-11 pr-12 rounded-2xl bg-white/10 border border-white/15 text-xs sm:text-sm text-white placeholder-blue-100/55 focus:outline-none focus:bg-white/14 focus:border-[#F2B705]/70 focus:ring-2 focus:ring-[#F2B705]/20 focus:scale-[1.01] transition-all duration-200"
            />
            {searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults(null);
                  inputRef.current?.focus();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-100/60 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] font-mono text-blue-100/70 bg-white/10 border border-white/15 rounded-lg pointer-events-none">
                ⌘K
              </kbd>
            )}
          </div>

          {/* Grouped Suggestions Dropdown */}
          {isSearchOpen && (
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: -6, scale: 0.99 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#071B4A] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl max-h-[75vh] overflow-y-auto z-50 divide-y divide-slate-100 dark:divide-slate-800"
            >
              {/* If no query, show Recent Searches & Quick Links */}
              {!searchQuery.trim() && (
                <div className="p-4 space-y-3">
                  <div className="text-[11px] font-bold text-[#5B6475] dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#0B2A6F] dark:text-[#F2B705]" />
                      <span>Recent Searches</span>
                    </span>
                    <button
                      onClick={() => {
                        setRecentSearches([]);
                        localStorage.removeItem('kampas_recent_searches');
                      }}
                      className="text-[10px] text-slate-400 hover:text-rose-500"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSearchQuery(term);
                          handleSubmitSearch(term);
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 hover:text-[#0B2A6F] transition"
                      >
                        {term}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                    <span>Press ↵ to view all results</span>
                    <span>Use ↑ ↓ to navigate</span>
                  </div>
                </div>
              )}

              {/* If search query has results */}
              {searchResults && searchResults.totalCount > 0 && (
                <div className="p-2 space-y-4">
                  {/* Category: Venues (with building exterior photo thumbnail) */}
                  {searchResults.venues.length > 0 && (
                    <div>
                      <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#0B2A6F] dark:text-[#F2B705] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Venues ({searchResults.venues.length})</span>
                      </div>
                      <div className="space-y-1 mt-1">
                        {searchResults.venues.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleSelectItem(item)}
                            className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-3 group"
                          >
                            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                              <ImageWithFallback
                                src={item.thumbnailUrl || ''}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-xs text-[#071B4A] dark:text-white truncate group-hover:text-[#0B2A6F]">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-[#5B6475] dark:text-slate-300 truncate">
                                {item.subtitle}
                              </div>
                            </div>
                            {item.badge && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                                {item.badge}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category: Houses (with house thumbnail) */}
                  {searchResults.houses.length > 0 && (
                    <div>
                      <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#0B2A6F] dark:text-[#F2B705] flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5" />
                        <span>Student Housing ({searchResults.houses.length})</span>
                      </div>
                      <div className="space-y-1 mt-1">
                        {searchResults.houses.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleSelectItem(item)}
                            className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-3 group"
                          >
                            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                              <ImageWithFallback
                                src={item.thumbnailUrl || ''}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-xs text-[#071B4A] dark:text-white truncate group-hover:text-[#0B2A6F]">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-[#5B6475] dark:text-slate-300 truncate">
                                {item.subtitle}
                              </div>
                            </div>
                            {item.badge && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F2B705]/20 text-[#071B4A] dark:text-[#F2B705] shrink-0 capitalize">
                                {item.badge}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category: Units / Courses */}
                  {searchResults.units.length > 0 && (
                    <div>
                      <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#0B2A6F] dark:text-[#F2B705] flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5" />
                        <span>Units & Lectures ({searchResults.units.length})</span>
                      </div>
                      <div className="space-y-1 mt-1">
                        {searchResults.units.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleSelectItem(item)}
                            className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-3 group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#0B2A6F] text-[#F2B705] flex items-center justify-center font-mono font-bold text-xs shrink-0">
                              {item.id.split(' ')[0]}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-xs text-[#071B4A] dark:text-white truncate group-hover:text-[#0B2A6F]">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-[#5B6475] dark:text-slate-300 truncate">
                                {item.subtitle}
                              </div>
                            </div>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 shrink-0">
                              {item.badge}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category: Documents & Notes */}
                  {searchResults.documents.length > 0 && (
                    <div>
                      <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#0B2A6F] dark:text-[#F2B705] flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Documents & Notes ({searchResults.documents.length})</span>
                      </div>
                      <div className="space-y-1 mt-1">
                        {searchResults.documents.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleSelectItem(item)}
                            className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-3 group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-xs text-[#071B4A] dark:text-white truncate group-hover:text-[#0B2A6F]">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-[#5B6475] dark:text-slate-300 truncate">
                                {item.subtitle}
                              </div>
                            </div>
                            <span className="text-[10px] font-semibold text-amber-600 shrink-0">
                              {item.badge}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category: Events */}
                  {searchResults.events.length > 0 && (
                    <div>
                      <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#0B2A6F] dark:text-[#F2B705] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Events ({searchResults.events.length})</span>
                      </div>
                      <div className="space-y-1 mt-1">
                        {searchResults.events.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleSelectItem(item)}
                            className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-3 group"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-xs text-[#071B4A] dark:text-white truncate group-hover:text-[#0B2A6F]">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-[#5B6475] dark:text-slate-300 truncate">
                                {item.subtitle}
                              </div>
                            </div>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 shrink-0">
                              {item.badge}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category: People / Alumni */}
                  {searchResults.people.length > 0 && (
                    <div>
                      <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#0B2A6F] dark:text-[#F2B705] flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        <span>Alumni Mentors ({searchResults.people.length})</span>
                      </div>
                      <div className="space-y-1 mt-1">
                        {searchResults.people.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleSelectItem(item)}
                            className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-3 group"
                          >
                            <div className="w-8 h-8 rounded-full bg-[#0B2A6F] text-[#F2B705] font-bold text-xs flex items-center justify-center shrink-0">
                              {item.title.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-xs text-[#071B4A] dark:text-white truncate group-hover:text-[#0B2A6F]">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-[#5B6475] dark:text-slate-300 truncate">
                                {item.subtitle}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category: Lost & Found */}
                  {searchResults.lostItems.length > 0 && (
                    <div>
                      <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#0B2A6F] dark:text-[#F2B705] flex items-center gap-1.5">
                        <SearchCheck className="w-3.5 h-3.5" />
                        <span>Lost & Found ({searchResults.lostItems.length})</span>
                      </div>
                      <div className="space-y-1 mt-1">
                        {searchResults.lostItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleSelectItem(item)}
                            className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-3 group"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-xs text-[#071B4A] dark:text-white truncate group-hover:text-[#0B2A6F]">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-[#5B6475] dark:text-slate-300 truncate">
                                {item.subtitle}
                              </div>
                            </div>
                            <span className="text-[10px] font-bold uppercase text-rose-500">
                              {item.badge}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* View All Results Button */}
                  <div className="p-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleSubmitSearch(searchQuery)}
                      className="w-full py-2 px-3 rounded-xl bg-[#0B2A6F] text-white hover:bg-[#071B4A] transition text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <span>See all {searchResults.totalCount} results for "{searchQuery}"</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* No Results State */}
              {searchResults && searchResults.totalCount === 0 && (
                <div className="p-6 text-center space-y-2">
                  <Search className="w-8 h-8 text-slate-400 mx-auto" />
                  <div className="font-bold text-xs text-[#071B4A] dark:text-white">
                    No results found for "{searchQuery}"
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Try checking the spelling, or search for a building name like "Science Complex" or "Highland".
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Right: Quick Controls, Notification Bell, User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Low Data Mode Toggle */}
          <button
            onClick={() => setLowDataMode(!lowDataMode)}
            className={`p-2 rounded-xl text-xs font-semibold transition hidden lg:flex items-center gap-1.5 ${
              lowDataMode
                ? 'bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-300/20'
                : 'text-blue-100/65 hover:text-white hover:bg-white/10'
            }`}
            title="Toggle Low-Data Mode for Slow Network"
          >
            <WifiOff className="w-4 h-4" />
            <span className="text-[11px]">Low-Data</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-blue-100/70 hover:text-[#F2B705] hover:bg-white/10 rounded-xl transition"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notification Bell */}
          <Link
            to="/notifications"
            className="relative p-2 text-blue-100/80 hover:text-white hover:bg-white/10 rounded-xl transition"
            aria-label={`Notifications (${unreadCount} unread)`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#DC2626] text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          {/* User Profile Avatar with Dropdown */}
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700 hover:opacity-90 transition group"
            >
              <div className="w-8 h-8 rounded-full bg-[#1769FF] text-white font-extrabold text-xs flex items-center justify-center ring-2 ring-[#F2B705]/60 shadow-lg shadow-black/20">
                {user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="hidden xl:block text-left text-xs">
                <div className="font-bold text-white leading-tight">
                  {user.fullName}
                </div>
                <div className="text-[10px] text-blue-100/60 capitalize">
                  {user.course || 'BSc Software Eng'}
                </div>
              </div>
            </button>

            {/* Avatar Dropdown Menu */}
            {isUserMenuOpen && (
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: -6, scale: 0.98 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#071B4A] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-2 z-50 divide-y divide-slate-100 dark:divide-slate-800"
              >
                <div className="p-2.5">
                  <div className="font-extrabold text-xs text-[#071B4A] dark:text-white">
                    {user.fullName}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {user.email}
                  </div>
                  <div className="text-[10px] font-mono text-[#0B2A6F] dark:text-[#F2B705] font-bold mt-1">
                    ID: {user.studentId || user.id}
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>View Profile</span>
                  </Link>

                  <button
                    onClick={() => {
                      toggleDarkMode();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                  >
                    <span className="flex items-center gap-2.5">
                      {darkMode ? <Sun className="w-4 h-4 text-slate-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
                      <span>Dark Theme</span>
                    </span>
                    <span className="text-[10px] text-slate-400">{darkMode ? 'On' : 'Off'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setLowDataMode(!lowDataMode);
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                  >
                    <span className="flex items-center gap-2.5">
                      <WifiOff className="w-4 h-4 text-slate-400" />
                      <span>Low-Data Mode</span>
                    </span>
                    <span className="text-[10px] text-slate-400">{lowDataMode ? 'On' : 'Off'}</span>
                  </button>
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                      navigate('/login', { replace: true });
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                  >
                    <LogOut className="w-4 h-4 text-slate-400" />
                    <span>Log out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
