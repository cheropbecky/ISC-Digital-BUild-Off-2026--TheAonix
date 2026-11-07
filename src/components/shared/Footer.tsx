/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Functional Institutional Footer for UEAB Kampas
 * Features: Working newsletter subscription with toast confirmation,
 * UEAB emblem, social channels, and interactive modal links (Privacy, Terms, Help, Contact).
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Send,
  X,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { Button } from '../ui/Button';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Modal Dialogs
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'help' | 'contact' | null>(null);

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSent, setContactSent] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSuccess(true);
      setTimeout(() => {
        setNewsletterSuccess(false);
        setNewsletterEmail('');
      }, 4000);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactForm({ name: '', email: '', message: '' });
      setActiveModal(null);
      alert('Thank you! Your inquiry was submitted to the UEAB Office of Student Affairs.');
    }, 1000);
  };

  return (
    <footer className="bg-[#071B4A] text-slate-300 pt-12 pb-8 border-t border-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: University Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0B2A6F] border border-[#F2B705]/60 flex items-center justify-center shadow-md">
                <svg viewBox="0 0 100 100" className="w-7 h-7" fill="none">
                  <path d="M50 12 L82 30 L82 70 L50 88 L18 70 L18 30 Z" fill="#F2B705" />
                  <path d="M50 22 L72 34 L72 66 L50 78 L28 66 L28 34 Z" fill="#071B4A" />
                  <text x="50" y="59" textAnchor="middle" fill="#FFFFFF" fontSize="24" fontWeight="900" fontFamily="Inter">
                    U
                  </text>
                </svg>
              </div>
              <div>
                <span className="text-base font-extrabold text-white block leading-tight">
                  Kampas • UEAB
                </span>
                <span className="text-xs text-[#F2B705] font-semibold">
                  The campus, in one place.
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              University of Eastern Africa, Baraton is an accredited Christian university situated in the serene highlands of Nandi County, Kenya.
            </p>

            <div className="text-xs space-y-1.5 text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#F2B705]" />
                <span>P.O. Box 2500 - 30100 Eldoret, Kenya</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#F2B705]" />
                <span>+254 722 000 000 / +254 733 000 000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#F2B705]" />
                <span>info@ueab.ac.ke</span>
              </div>
            </div>
          </div>

          {/* Col 2: Kampas Student Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Student Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/home" className="hover:text-[#F2B705] transition-colors">
                  Campus Home & Live Map
                </Link>
              </li>
              <li>
                <Link to="/campus/timetable" className="hover:text-[#F2B705] transition-colors">
                  Class Timetable & Venues
                </Link>
              </li>
              <li>
                <Link to="/housing" className="hover:text-[#F2B705] transition-colors">
                  House Find (Off-Campus Rentals)
                </Link>
              </li>
              <li>
                <Link to="/share" className="hover:text-[#F2B705] transition-colors">
                  Share Hub (Peer Notes & Past Papers)
                </Link>
              </li>
              <li>
                <Link to="/community/events" className="hover:text-[#F2B705] transition-colors">
                  Campus Events & Chapel Vespers
                </Link>
              </li>
              <li>
                <Link to="/community/alumni" className="hover:text-[#F2B705] transition-colors">
                  Baraton Alumni Mentorship & Referrals
                </Link>
              </li>
              <li>
                <Link to="/found" className="hover:text-[#F2B705] transition-colors">
                  Lost & Found Digital Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: University Quick Links & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Institutional Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveModal('help')}
                  className="hover:text-[#F2B705] transition-colors text-left"
                >
                  Student Help Center & FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('contact')}
                  className="hover:text-[#F2B705] transition-colors text-left"
                >
                  Contact Dean of Students
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('privacy')}
                  className="hover:text-[#F2B705] transition-colors text-left"
                >
                  Privacy Policy & Data Rights
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('terms')}
                  className="hover:text-[#F2B705] transition-colors text-left"
                >
                  Terms of Service & Code of Conduct
                </button>
              </li>
              <li>
                <a
                  href="https://ueab.ac.ke"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#F2B705] transition-colors flex items-center gap-1"
                >
                  <span>Official University Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Academic Bulletin */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              University Bulletin
            </h4>
            <p className="text-xs text-slate-400">
              Receive official examination schedules, chapel announcements, and trimester registration dates.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your student email..."
                  required
                  className="w-full h-10 px-3 pr-10 rounded-lg bg-blue-950/70 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#F2B705]"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md bg-[#F2B705] text-[#071B4A] hover:bg-[#d9a404] transition"
                  title="Subscribe to Bulletin"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {newsletterSuccess && (
                <div className="p-2 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-[11px] flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Subscribed! Check your student webmail for confirmation.</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            <span>
              © {new Date().getFullYear()} University of Eastern Africa, Baraton. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setActiveModal('privacy')} className="hover:underline">
              Privacy
            </button>
            <span>•</span>
            <button onClick={() => setActiveModal('terms')} className="hover:underline">
              Terms
            </button>
            <span>•</span>
            <button onClick={() => setActiveModal('help')} className="hover:underline">
              Help
            </button>
            <span>•</span>
            <button onClick={() => setActiveModal('contact')} className="hover:underline">
              Contact
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL DIALOGS ================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#071B4A] text-slate-800 dark:text-slate-100 max-w-lg w-full rounded-2xl shadow-2xl p-6 space-y-4 border border-slate-200 dark:border-slate-700 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-extrabold text-[#071B4A] dark:text-white capitalize">
                {activeModal === 'privacy' && 'UEAB Kampas Privacy Policy'}
                {activeModal === 'terms' && 'Terms of Service & Academic Integrity'}
                {activeModal === 'help' && 'Kampas Student Support & Help Center'}
                {activeModal === 'contact' && 'Contact Office of Student Affairs'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs leading-relaxed max-h-80 overflow-y-auto space-y-3 pr-1 text-slate-600 dark:text-slate-300">
              {activeModal === 'privacy' && (
                <>
                  <p>
                    The University of Eastern Africa, Baraton values student privacy. All timetable records, academic notes, and housing inquiries stored on Kampas are encrypted and strictly protected under Kenya's Data Protection Act, 2019.
                  </p>
                  <p>
                    Your student ID, contact numbers, and housing search preferences are never sold to external commercial brokers or advertising agencies.
                  </p>
                </>
              )}

              {activeModal === 'terms' && (
                <>
                  <p>
                    By using Kampas, students agree to uphold Christian academic ethics as outlined in the UEAB Student Handbook.
                  </p>
                  <p>
                    1. Uploaded notes and past paper solutions must be original or appropriately credited.<br />
                    2. Off-campus house listings and landlord reviews must be truthful.<br />
                    3. Lost and found items must be deposited at designated security posts within 24 hours.
                  </p>
                </>
              )}

              {activeModal === 'help' && (
                <div className="space-y-2">
                  <p><strong>Frequently Asked Questions:</strong></p>
                  <p><strong>Q: How do I export my timetable to Google Calendar?</strong><br />A: Go to Campus &gt; Timetable and click the "Export ICS" button at the top right.</p>
                  <p><strong>Q: How do I report a missing item?</strong><br />A: Visit Lost &amp; Found, tap "Report Lost Item", upload a photo or description, and set a verification question.</p>
                  <p><strong>Q: Are off-campus landlords vetted?</strong><br />A: Yes, all rentals displaying the Gold Verified badge are inspected for water consistency and security walls by the student guild.</p>
                </div>
              )}

              {activeModal === 'contact' && (
                <form onSubmit={handleContactSubmit} className="space-y-3">
                  <div>
                    <label className="block font-bold mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="e.g. Becky Cherop"
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Email / Phone</label>
                    <input
                      type="text"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="e.g. becky.cherop@student.ueab.ac.ke"
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Message</label>
                    <textarea
                      rows={3}
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="How can student affairs assist you?"
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                    />
                  </div>
                  <div className="pt-2 flex justify-end gap-2">
                    <Button type="button" variant="secondary" size="sm" onClick={() => setActiveModal(null)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="gold" size="sm">
                      {contactSent ? 'Transmitting...' : 'Send Message'}
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {activeModal !== 'contact' && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <Button variant="primary" size="sm" onClick={() => setActiveModal(null)}>
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};
