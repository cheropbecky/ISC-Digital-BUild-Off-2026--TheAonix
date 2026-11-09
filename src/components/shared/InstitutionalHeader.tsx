/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Institutional Top Bar for UEAB Kampas Landing Page
 * Two rows:
 * 1. Utility strip: Phone, Email, "Student Portal", "Webmail"
 * 2. Main navigation: About UEAB, Academics, Admissions, Research, Student Life, Library, News & Events, Contact, and gold "Enter Kampas" button.
 * Sticky with mobile hamburger menu; links scroll to sections or trigger informative modals (no dead links).
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  ExternalLink,
  Menu,
  X,
  Compass,
  ArrowRight,
  Sparkles,
  BookOpen,
  GraduationCap,
  ChevronDown,
  Search,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface InstitutionalHeaderProps {
  onOpenInfoModal?: (title: string, content: string) => void;
}

export const InstitutionalHeader: React.FC<InstitutionalHeaderProps> = ({ onOpenInfoModal }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavClick = (title: string, content: string, sectionId?: string) => {
    setIsMobileMenuOpen(false);
    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    if (onOpenInfoModal) {
      onOpenInfoModal(title, content);
    }
  };

  const navItems = [
    { label: 'About UEAB', sectionId: 'section-about', description: 'Our story, values, and chartered university journey.' },
    { label: 'Academics', sectionId: 'section-modules', description: 'Explore faculties, programmes, and student resources.' },
    { label: 'Admissions', sectionId: 'section-faq', description: 'Find intake dates, requirements, and application guidance.' },
    { label: 'Research', description: 'Discover research and innovation at Baraton.' },
    { label: 'Student Life', sectionId: 'section-how-it-works', description: 'Connect with clubs, events, and campus life.' },
    { label: 'Library', description: 'Access the Learning Commons and digital resources.' },
    { label: 'News & Events', sectionId: 'section-modules', description: 'Keep up with campus updates and events.' },
    { label: 'Contact', description: 'Reach the UEAB team in Baraton, Kenya.' },
  ];

  const filteredItems = navItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-50 w-full shadow-md">
      {/* Row 1: Institutional Utility Strip (Varsity Dark Navy #071B4A) */}
      <div className="bg-[#071B4A] text-slate-300 text-[11px] sm:text-xs font-medium py-1.5 px-4 sm:px-8 lg:px-16 border-b border-blue-950/60">
        <div className="w-full flex items-center justify-between gap-4">
          {/* Left: Contact Info */}
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href="tel:+254722000000"
              className="flex items-center gap-1.5 hover:text-[#F2B705] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#F2B705]" />
              <span className="hidden xs:inline">+254 722 000 000</span>
              <span className="xs:hidden">Call UEAB</span>
            </a>
            <a
              href="mailto:info@ueab.ac.ke"
              className="flex items-center gap-1.5 hover:text-[#F2B705] transition-colors"
            >
              <Mail className="w-3 h-3 text-[#F2B705]" />
              <span>info@ueab.ac.ke</span>
            </a>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-400">
              P.O. Box 2500 - 30100 Eldoret, Kenya
            </span>
          </div>

          {/* Right: Quick Portals */}
          <div className="flex items-center gap-3 sm:gap-4 font-semibold text-slate-200">
            <button
              onClick={() =>
                handleNavClick(
                  'UEAB Student Portal',
                  'The legacy registration and fee portal operates alongside Kampas for official senate transcripts and fee receipts.'
                )
              }
              className="hover:text-[#F2B705] transition-colors flex items-center gap-1"
            >
              <span>Student Portal</span>
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() =>
                handleNavClick(
                  'UEAB Student Webmail',
                  'Access your @student.ueab.ac.ke Microsoft 365 student inbox for official faculty notices and admissions communications.'
                )
              }
              className="hover:text-[#F2B705] transition-colors flex items-center gap-1"
            >
              <span>Webmail</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Main Institutional Navigation Bar (#0B2A6F) */}
      <div className="bg-[#0B2A6F] text-white py-2.5 sm:py-3 px-4 sm:px-8 lg:px-16">
        <div className="w-full flex items-center justify-between gap-4">
          {/* UEAB Crest Emblem & University Name */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-white/10 border border-[#F2B705]/60 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 100 100" className="w-7 h-7 sm:w-8 sm:h-8" fill="none">
                <path d="M50 12 L82 30 L82 70 L50 88 L18 70 L18 30 Z" fill="#F2B705" />
                <path d="M50 22 L72 34 L72 66 L50 78 L28 66 L28 34 Z" fill="#071B4A" />
                <text x="50" y="59" textAnchor="middle" fill="#FFFFFF" fontSize="24" fontWeight="900" fontFamily="Inter">
                  U
                </text>
              </svg>
            </div>
            <div>
              <div className="text-sm sm:text-base font-black tracking-tight leading-tight text-white flex items-center gap-2">
                <span>University of Eastern Africa, Baraton</span>
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-[#F2B705] tracking-wider uppercase">
                Chartered 1980 • Eldoret, Kenya
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-3 text-xs font-bold text-slate-200">
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                <button
                  onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                  className="flex items-center gap-1 px-2 py-2 hover:text-[#F2B705] transition-colors"
                  aria-expanded={openMenu === item.label}
                >
                  {item.label}
                  <ChevronDown className={`w-3 h-3 transition-transform ${openMenu === item.label ? 'rotate-180' : ''}`} />
                </button>
                {openMenu === item.label && (
                  <div className="absolute top-full left-0 mt-2 w-60 rounded-xl bg-white p-2 text-[#071B4A] shadow-2xl ring-1 ring-black/5">
                    <p className="px-3 py-2 text-[11px] font-medium leading-relaxed text-[#5B6475]">{item.description}</p>
                    <button
                      onClick={() => {
                        setOpenMenu(null);
                        handleNavClick(item.label, item.description, item.sectionId);
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-extrabold hover:bg-[#F7F9FC] hover:text-[#0B2A6F]"
                    >
                      Explore {item.label}
                      <ArrowRight className="h-3.5 w-3.5 text-[#F2B705]" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Action: Gold "Enter Kampas" Button & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/60" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && filteredItems[0]) {
                    handleNavClick(filteredItems[0].label, filteredItems[0].description, filteredItems[0].sectionId);
                    setSearchQuery('');
                  }
                }}
                placeholder="Search"
                aria-label="Search navigation"
                className="w-28 rounded-full border border-white/25 bg-white/10 py-2 pl-9 pr-3 text-xs text-white outline-none placeholder:text-white/60 focus:w-40 focus:border-[#F2B705] transition-all"
              />
              {searchQuery && filteredItems.length > 0 && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-white p-1 shadow-xl">
                  {filteredItems.slice(0, 4).map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        handleNavClick(item.label, item.description, item.sectionId);
                        setSearchQuery('');
                      }}
                      className="w-full rounded-lg px-3 py-2 text-left text-xs font-bold text-[#071B4A] hover:bg-[#F7F9FC]"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Link to="/home">
              <Button
                variant="gold"
                size="md"
                className="font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-transform"
              >
                <span>Enter Kampas</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 text-white hover:bg-white/10 rounded-lg touch-target flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-[#071B4A] border-b border-white/10 px-6 py-4 space-y-3 text-sm animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-2.5 font-bold text-slate-200">
            <button
              onClick={() =>
                handleNavClick('About UEAB', 'Baraton is a chartered SDA university in Nandi Hills, Kenya.', 'section-about')
              }
              className="text-left py-1 hover:text-[#F2B705]"
            >
              About UEAB
            </button>
            <button
              onClick={() =>
                handleNavClick('Academics', 'Six faculties offering degrees in science, medicine, business.', 'section-modules')
              }
              className="text-left py-1 hover:text-[#F2B705]"
            >
              Academics
            </button>
            <button
              onClick={() =>
                handleNavClick('Admissions', 'Intakes in January, May, and September.', 'section-faq')
              }
              className="text-left py-1 hover:text-[#F2B705]"
            >
              Admissions
            </button>
            <button
              onClick={() =>
                handleNavClick('Research', 'Pioneering agricultural and health research.')
              }
              className="text-left py-1 hover:text-[#F2B705]"
            >
              Research
            </button>
            <button
              onClick={() =>
                handleNavClick('Student Life', 'Spiritual fellowship, sports, and campus clubs.', 'section-how-it-works')
              }
              className="text-left py-1 hover:text-[#F2B705]"
            >
              Student Life
            </button>
            <button
              onClick={() =>
                handleNavClick('Library', '120,000+ volumes and digital databases.')
              }
              className="text-left py-1 hover:text-[#F2B705]"
            >
              Library
            </button>
            <button
              onClick={() =>
                handleNavClick('Contact', 'P.O. Box 2500 - 30100 Eldoret. Phone: +254 722 000 000')
              }
              className="text-left py-1 hover:text-[#F2B705]"
            >
              Contact
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
