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
} from 'lucide-react';
import { Button } from '../ui/Button';

interface InstitutionalHeaderProps {
  onOpenInfoModal?: (title: string, content: string) => void;
}

export const InstitutionalHeader: React.FC<InstitutionalHeaderProps> = ({ onOpenInfoModal }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  return (
    <header className="sticky top-0 z-50 w-full shadow-md">
      {/* Row 1: Institutional Utility Strip (Varsity Dark Navy #071B4A) */}
      <div className="bg-[#071B4A] text-slate-300 text-[11px] sm:text-xs font-medium py-1.5 px-4 sm:px-6 border-b border-blue-950/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
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
      <div className="bg-[#0B2A6F] text-white py-2.5 sm:py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
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
          <nav className="hidden xl:flex items-center gap-5 text-xs font-bold text-slate-200">
            <button
              onClick={() =>
                handleNavClick(
                  'About UEAB',
                  'The University of Eastern Africa, Baraton is a premier Seventh-day Adventist institution of higher learning chartered in 1980, recognized for moral excellence and professional innovation.',
                  'section-about'
                )
              }
              className="hover:text-[#F2B705] transition-colors"
            >
              About UEAB
            </button>
            <button
              onClick={() =>
                handleNavClick(
                  'Academics',
                  'Six faculties offering world-class degree programmes: Science & Technology, Health Sciences, Business, Theology, Education, and Humanities.',
                  'section-modules'
                )
              }
              className="hover:text-[#F2B705] transition-colors"
            >
              Academics
            </button>
            <button
              onClick={() =>
                handleNavClick(
                  'Admissions',
                  'Admissions open for Trimester 1, 2, and 3. Direct government placement via KUCCPS as well as private international applicants welcomed.',
                  'section-faq'
                )
              }
              className="hover:text-[#F2B705] transition-colors"
            >
              Admissions
            </button>
            <button
              onClick={() =>
                handleNavClick(
                  'Research & Innovation',
                  'Baraton research centres pioneer research in tropical bio-agriculture, renewable solar integration, and public health nursing epidemiology.'
                )
              }
              className="hover:text-[#F2B705] transition-colors"
            >
              Research
            </button>
            <button
              onClick={() =>
                handleNavClick(
                  'Student Life',
                  'Vibrant spiritual fellowship, inter-collegiate athletic derbies, student clubs, and peaceful residential campus life in the scenic Nandi Hills.',
                  'section-how-it-works'
                )
              }
              className="hover:text-[#F2B705] transition-colors"
            >
              Student Life
            </button>
            <button
              onClick={() =>
                handleNavClick(
                  'University Library',
                  'The UEAB Learning Commons houses over 120,000 physical volumes, digital JSTOR archives, and fast fiber computing workstations.'
                )
              }
              className="hover:text-[#F2B705] transition-colors"
            >
              Library
            </button>
            <button
              onClick={() =>
                handleNavClick(
                  'News & Events',
                  'Stay updated with upcoming Sabbath vespers, faculty seminars, sports leagues, and graduation ceremonies.',
                  'section-modules'
                )
              }
              className="hover:text-[#F2B705] transition-colors"
            >
              News & Events
            </button>
            <button
              onClick={() =>
                handleNavClick(
                  'Contact Us',
                  'Main Campus: Baraton, Nandi County, Kenya. Phone: +254 722 000 000. Email: info@ueab.ac.ke.'
                )
              }
              className="hover:text-[#F2B705] transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* Right Action: Gold "Enter Kampas" Button & Mobile Toggle */}
          <div className="flex items-center gap-3">
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
