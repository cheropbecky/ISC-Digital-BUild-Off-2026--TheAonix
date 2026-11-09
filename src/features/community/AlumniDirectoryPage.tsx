/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Alumni Network & Referral Gateway (/community/alumni)
 * Features: 8 UEAB alumni profiles, mentorship indicators,
 * 3-Screen Alumni Referral Flow (Demo Flow 5)
 */

import React, { useState } from 'react';
import { useKampasStore } from '../../lib/store';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  UserCheck,
  Building,
  Briefcase,
  MapPin,
  ExternalLink,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  FileText,
  Search,
} from 'lucide-react';
import { AlumniProfile, ReferralRequest } from '../../lib/types';
import { CommunityShell, CommunitySubNav, PageHeader } from './components/CommunityLayout';

export const AlumniDirectoryPage: React.FC = () => {
  const { alumni, referrals, sendReferralRequest, updateReferralStatus, user, setRole } = useKampasStore();

  const [search, setSearch] = useState('');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('all');
  const [pitchingAlumnus, setPitchingAlumnus] = useState<AlumniProfile | null>(null);

  // Pitch Form State
  const [targetRole, setTargetRole] = useState('Graduate Cloud Platform Engineer');
  const [pitchText, setPitchText] = useState(
    'I have built distributed microservices in Go and Docker, and developed real-time campus mapping for Baraton. Would love an opportunity to contribute to Safaricom cloud infrastructure.'
  );

  const filteredAlumni = alumni.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.currentCompany.toLowerCase().includes(search.toLowerCase()) ||
      a.currentRole.toLowerCase().includes(search.toLowerCase()) ||
      a.degree.toLowerCase().includes(search.toLowerCase());

    const matchesCompany =
      selectedCompanyFilter === 'all' ||
      a.currentCompany.toLowerCase().includes(selectedCompanyFilter.toLowerCase());

    return matchesSearch && matchesCompany;
  });

  const handleSendPitch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitchingAlumnus) return;

    sendReferralRequest(pitchingAlumnus.id, pitchingAlumnus.currentCompany, targetRole, pitchText);
    setPitchingAlumnus(null);
  };

  return (
    <CommunityShell>
      <PageHeader title="Baraton alumni directory" description="Connect with verified UEAB graduates for mentoring, guidance, and internal referrals." actions={
        user.role === 'alumnus' ? (
          <Button size="sm" variant="secondary" onClick={() => setRole('student')}>Switch to student view</Button>
        ) : (
          <Button size="sm" variant="gold" onClick={() => setRole('alumnus')}>Simulate alumnus view</Button>
        )
      } />
      <CommunitySubNav />
      <div className="hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#071B4A] dark:text-white">
              Baraton Alumni Directory
            </h1>
            <Badge variant="academic">Verified Graduates</Badge>
          </div>
          </div>
          <p className="text-xs text-[#5B6475] dark:text-slate-400 mt-1">
            Connect with UEAB alumni at leading organizations. Request internal referrals and career mentorship.
          </p>
        </div>

        {/* Quick Simulator Switcher for Demo Flow 5 */}
        <div className="flex items-center gap-2">
          {user.role === 'alumnus' ? (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setRole('student')}
              className="text-xs"
            >
              Switch back to Student View
            </Button>
          ) : (
            <Button
              size="sm"
              variant="gold"
              onClick={() => setRole('alumnus')}
              className="text-xs"
            >
              Simulate Alumnus Inbox View
            </Button>
          )}
        </div>
      </div>

      {/* Screen 3: Live Referral Tracker Strip (Always visible if student has referrals) */}
      {referrals.length > 0 && (
        <Card className="border-l-4 border-l-[#0B2A6F] bg-blue-50/40 dark:bg-blue-950/20">
          <div className="flex items-center justify-between mb-3 border-b border-blue-100 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F2B705]" />
              <span className="text-xs font-bold text-[#071B4A] dark:text-white uppercase tracking-wider">
                Live Referral Request Tracker (3-Screen Progression)
              </span>
            </div>
            <span className="text-[11px] text-[#5B6475] dark:text-slate-400">
              Real-time WebSocket / Supabase sync
            </span>
          </div>

          <div className="space-y-3">
            {referrals.map((ref) => (
              <div
                key={ref.id}
                className="p-3 bg-white dark:bg-[#0C1D3D] rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#071B4A] dark:text-white">
                      Target: {ref.targetRole} @ {ref.targetCompany}
                    </span>
                    <Badge
                      variant={
                        ref.status === 'accepted'
                          ? 'done'
                          : ref.status === 'declined'
                          ? 'urgent'
                          : 'soon'
                      }
                      showDot
                    >
                      {ref.status === 'accepted'
                        ? 'Referral Accepted 🎉'
                        : ref.status === 'declined'
                        ? 'Declined'
                        : 'Pending Alumnus Review'}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#5B6475] dark:text-slate-300">
                    Candidate: {ref.studentName} ({ref.studentCourse}) • Alumnus: {ref.alumnusName}
                  </p>
                  {ref.alumnusNotes && (
                    <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-[11px] font-medium mt-1">
                      <strong>Alumnus Feedback: </strong> {ref.alumnusNotes}
                    </div>
                  )}
                </div>

                {/* Alumnus Accept / Reject Actions for Screen 2 */}
                {user.role === 'alumnus' && ref.status === 'pending' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() =>
                        updateReferralStatus(
                          ref.id,
                          'accepted',
                          'Super impressive portfolio! I have submitted a warm referral directly to the M-PESA cloud talent team.'
                        )
                      }
                      className="text-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Accept & Refer
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        updateReferralStatus(ref.id, 'declined', 'Position filled for this cohort.')
                      }
                      className="text-xs text-red-600"
                    >
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search alumni by name, company, role, or degree..."
            className="w-full h-10 pl-10 pr-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F2B705]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['all', 'Safaricom', 'Microsoft', 'Equity', 'KPMG'].map((co) => (
            <button
              key={co}
              onClick={() => setSelectedCompanyFilter(co)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCompanyFilter === co
                  ? 'bg-[#0B2A6F] text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {co}
            </button>
          ))}
        </div>
      </div>

      {/* Screen 1: Alumni Profiles Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {filteredAlumni.map((alum) => (
          <Card key={alum.id} padding="md" hoverable className="group flex flex-col justify-between rounded-2xl">
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex h-14 w-14 rounded-full bg-[#0B2A6F] text-sm font-black text-[#F2B705] items-center justify-center ring-2 ring-[#F2B705]/40 shadow-sm transition group-hover:scale-105">
                  {alum.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="academic">Class of {alum.graduationYear}</Badge>
                  {alum.isMentor && <Badge variant="gold">MENTOR</Badge>}
                </div>
              </div>

              <h3 className="text-base font-bold text-[#071B4A] dark:text-white leading-snug">
                {alum.name}
              </h3>
              <div className="text-xs font-semibold text-[#0B2A6F] dark:text-[#93C5FD] mt-0.5">
                {alum.currentRole}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1 mt-1">
                <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-bold">{alum.currentCompany}</span>
              </div>

              <p className="text-[11px] text-[#5B6475] dark:text-slate-400 line-clamp-3 leading-relaxed mt-2.5">
                {alum.bio}
              </p>

              <div className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{alum.location}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              {alum.isWillingToRefer ? (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    setPitchingAlumnus(alum);
                    setTargetRole(`Graduate Role @ ${alum.currentCompany}`);
                  }}
                  className="w-full text-xs"
                >
                  <Send className="w-3.5 h-3.5 mr-1" />
                  Pitch for Referral
                </Button>
              ) : (
                <a
                  href={alum.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full"
                >
                  <Button size="sm" variant="secondary" className="w-full text-xs">
                    LinkedIn Profile
                  </Button>
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Screen 1 Modal: Pitch for Internal Referral */}
      {pitchingAlumnus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#0C1D3D] rounded-2xl max-w-lg w-full p-6 text-slate-900 dark:text-white shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold">Pitch for Alumni Referral</h3>
              <Badge variant="gold">Direct Connection</Badge>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Send a targeted candidate pitch to <strong>{pitchingAlumnus.name}</strong> at{' '}
              <strong>{pitchingAlumnus.currentCompany}</strong>. Include your key achievements, skills, and why you’re a strong fit.
            </p>

            <form onSubmit={handleSendPitch} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">Target Position / Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Associate Software Engineer / Cyber Analyst"
                  required
                  className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Your 2-Minute Candidate Pitch</label>
                <textarea
                  rows={4}
                  value={pitchText}
                  onChange={(e) => setPitchText(e.target.value)}
                  placeholder="Summarize your hands-on university projects, code repos, and why you want to join..."
                  required
                  className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0B2A6F] dark:text-[#F2B705]" />
                  <span className="font-semibold">Attached: Becky_Cherop_CV.pdf (2.1 MB)</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold">Verified Student Profile</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setPitchingAlumnus(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Submit Candidate Pitch
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </CommunityShell>
  );
};
