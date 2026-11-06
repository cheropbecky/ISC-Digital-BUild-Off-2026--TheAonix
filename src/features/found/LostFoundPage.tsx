/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Lost & Found Service (/found)
 * Features: Camera-first report, automated match suggestions, verification questions,
 * hand-over points, 14-day escalation to campus security (Demo Flow 6)
 */

import React, { useState } from 'react';
import { useKampasStore } from '../../lib/store';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  SearchCheck,
  Camera,
  MapPin,
  Shield,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Key,
  Laptop,
  CreditCard,
  X,
} from 'lucide-react';
import { LostFoundItem } from '../../lib/types';

const HANDOVER_POINTS = [
  'Main Security Gate A Desk',
  'Library 1st Floor Circulation Desk',
  'Dean of Students Office',
  'Student Centre Guild Helpdesk',
  'Security Post B (Science Block)',
];

export const LostFoundPage: React.FC = () => {
  const { lostItems, venues, user, reportLostFoundItem, submitClaim } = useKampasStore();

  const [activeTab, setActiveTab] = useState<'all' | 'found' | 'lost'>('all');
  const [showReportModal, setShowReportModal] = useState(false);
  const [claimingItem, setClaimingItem] = useState<LostFoundItem | null>(null);
  const [claimAnswer, setClaimAnswer] = useState('');

  // Report Form State
  const [reportType, setReportType] = useState<'found' | 'lost'>('found');
  const [itemTitle, setItemTitle] = useState('Graphing Calculator (Casio fx-991EX)');
  const [category, setCategory] = useState<LostFoundItem['category']>('electronics');
  const [locationFound, setLocationFound] = useState('Science Complex Auditorium Floor 1 Desk 4');
  const [venueId, setVenueId] = useState('venue-sciaud');
  const [description, setDescription] = useState('Found on table 4 after Linear Algebra. Black sliding plastic cover.');
  const [verificationQuestion, setVerificationQuestion] = useState('What initials or formula are carved into the inside of the cover?');
  const [handoverPoint, setHandoverPoint] = useState(HANDOVER_POINTS[0]);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const filteredItems = lostItems.filter((i) => {
    if (activeTab === 'all') return true;
    return i.type === activeTab;
  });

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemTitle || !verificationQuestion) return;

    const chosenVenue = venues.find((v) => v.id === venueId);

    reportLostFoundItem({
      type: reportType,
      title: itemTitle,
      category,
      description,
      locationFound,
      venueId,
      venueName: chosenVenue?.name || 'Science Complex Auditorium',
      verificationQuestion,
      handoverPoint,
      reportedByUserId: user.id,
      reporterName: user.fullName,
      photoUrl: photoPreview || '/src/assets/images/ueab_library_hall_1793989894699.jpg',
    });

    setShowReportModal(false);
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimingItem || !claimAnswer) return;

    submitClaim(claimingItem.id, claimAnswer);
    setClaimingItem(null);
    setClaimAnswer('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#071B4A] dark:text-white">
              Campus Lost & Found
            </h1>
            <Badge variant="academic">Baraton Security Integrated</Badge>
          </div>
          <p className="text-xs text-[#5B6475] dark:text-slate-400 mt-1">
            Automated image matching, verification ownership questions, and secure campus hand-over points.
          </p>
        </div>

        <Button
          size="sm"
          variant="gold"
          onClick={() => setShowReportModal(true)}
          className="text-xs font-bold"
        >
          <Camera className="w-3.5 h-3.5 mr-1.5" />
          Report Lost or Found Item
        </Button>
      </div>

      {/* 14-Day Escalation Policy Strip */}
      <div className="p-3 bg-[#EEF2F6] dark:bg-slate-800 border border-[#E3E8F0] dark:border-slate-700 rounded-xl flex items-center gap-3 text-xs text-[#0B2A6F] dark:text-slate-200">
        <Clock className="w-4 h-4 text-[#0B2A6F] dark:text-[#F2B705] shrink-0" />
        <div className="flex-1">
          <span className="font-bold">14-Day Institutional Custody Rule: </span>
          Unclaimed items logged past 14 days are officially transferred to the Head of Campus Security for vault storage and registrar cataloging.
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeTab === 'all'
              ? 'bg-[#0B2A6F] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          All Items ({lostItems.length})
        </button>
        <button
          onClick={() => setActiveTab('found')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeTab === 'found'
              ? 'bg-[#16A34A] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          Found Items ({lostItems.filter((i) => i.type === 'found').length})
        </button>
        <button
          onClick={() => setActiveTab('lost')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeTab === 'lost'
              ? 'bg-[#DC2626] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          Reported Lost ({lostItems.filter((i) => i.type === 'lost').length})
        </button>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} padding="none" hoverable className="overflow-hidden flex flex-col justify-between">
            {/* Item Image / Fallback */}
            <div className="relative h-40 bg-slate-900 overflow-hidden">
              {item.photoUrl ? (
                <img
                  src={item.photoUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#071B4A] to-[#0B2A6F] flex items-center justify-center">
                  <SearchCheck className="w-12 h-12 text-[#F2B705]/40" />
                </div>
              )}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <Badge
                  variant={item.type === 'found' ? 'done' : 'urgent'}
                  className="font-bold uppercase tracking-wider"
                >
                  {item.type}
                </Badge>
                {item.status === 'claimed' && (
                  <Badge variant="academic">Claimed ✓</Badge>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-[#071B4A] dark:text-white leading-snug mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-[#5B6475] dark:text-slate-300 line-clamp-2 leading-relaxed mb-3">
                  {item.description}
                </p>

                {/* Match Suggestion Chip (Demo Flow 6) */}
                {item.matchSuggestions && item.matchSuggestions.length > 0 && (
                  <div className="p-2.5 mb-3 bg-[#FEF3C7] dark:bg-[#78350F]/30 border border-[#F59E0B]/30 rounded-lg text-xs text-[#92400E] dark:text-[#FCD34D] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D97706] shrink-0" />
                    <div>
                      <span className="font-bold">Match Detected (94% confidence): </span>
                      {item.matchSuggestions[0].title}
                    </div>
                  </div>
                )}

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0B2A6F] dark:text-[#F2B705] shrink-0" />
                    <span className="truncate">{item.locationFound}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#DC2626] font-semibold">
                    <Shield className="w-3.5 h-3.5 shrink-0" />
                    <span>Pick-up: {item.handoverPoint}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 mt-4">
                <span className="text-[11px] text-slate-500">
                  Reported by {item.reporterName}
                </span>

                {item.status !== 'claimed' ? (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => setClaimingItem(item)}
                    className="text-xs"
                  >
                    Answer Verification & Claim
                  </Button>
                ) : (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Returned to Owner
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Camera-First Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#0C1D3D] rounded-2xl max-w-lg w-full p-6 text-slate-900 dark:text-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-1">Report Lost or Found Item</h3>
            <p className="text-xs text-slate-500 mb-4">
              Add photographs and a secret verification question so the real owner can verify ownership.
            </p>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              {/* Type Switch */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <button
                  type="button"
                  onClick={() => setReportType('found')}
                  className={`py-2 text-xs font-bold rounded-md transition ${
                    reportType === 'found' ? 'bg-[#16A34A] text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  I Found An Item
                </button>
                <button
                  type="button"
                  onClick={() => setReportType('lost')}
                  className={`py-2 text-xs font-bold rounded-md transition ${
                    reportType === 'lost' ? 'bg-[#DC2626] text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  I Lost An Item
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Item Title</label>
                <input
                  type="text"
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  placeholder="e.g. Blue Lenovo 65W Laptop Charger"
                  required
                  className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                  >
                    <option value="electronics">Electronics & Chargers</option>
                    <option value="documents_id">Student ID / National ID</option>
                    <option value="keys">Keys & Lanyards</option>
                    <option value="bags">Bags & Backpacks</option>
                    <option value="books">Calculators & Books</option>
                    <option value="clothing">Clothing & Umbrellas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Campus Venue</label>
                  <select
                    value={venueId}
                    onChange={(e) => setVenueId(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                  >
                    {venues.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Precise Location Found / Lost</label>
                <input
                  type="text"
                  value={locationFound}
                  onChange={(e) => setLocationFound(e.target.value)}
                  placeholder="e.g. Science Complex 1st floor cubicle 4"
                  required
                  className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>

              {/* Secret Verification Question */}
              <div className="p-3 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-amber-900 dark:text-amber-200">
                  Secret Verification Question (Crucial Anti-Fraud Step)
                </label>
                <input
                  type="text"
                  value={verificationQuestion}
                  onChange={(e) => setVerificationQuestion(e.target.value)}
                  placeholder="e.g. What color is the lanyard? Or what sticker is on the lid?"
                  required
                  className="w-full h-10 px-3 rounded-lg bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 text-xs text-slate-900 dark:text-white"
                />
                <p className="text-[10px] text-amber-700 dark:text-amber-400">
                  Only the genuine owner should know the exact answer to this question.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Designated Handover Desk</label>
                <select
                  value={handoverPoint}
                  onChange={(e) => setHandoverPoint(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                >
                  {HANDOVER_POINTS.map((hp) => (
                    <option key={hp} value={hp}>
                      {hp}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowReportModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Publish Report & Run AI Matcher
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Claim & Answer Verification Modal (Demo Flow 6) */}
      {claimingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#0C1D3D] rounded-2xl max-w-md w-full p-6 text-slate-900 dark:text-white shadow-2xl">
            <h3 className="text-lg font-bold mb-1">Claim Item Verification</h3>
            <p className="text-xs text-slate-500 mb-4">
              To reclaim <strong>{claimingItem.title}</strong>, answer the security question asked by the finder.
            </p>

            <form onSubmit={handleClaimSubmit} className="space-y-4">
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  Verification Question:
                </span>
                <p className="text-xs font-bold text-[#071B4A] dark:text-white">
                  "{claimingItem.verificationQuestion}"
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Your Detailed Answer</label>
                <textarea
                  rows={3}
                  value={claimAnswer}
                  onChange={(e) => setClaimAnswer(e.target.value)}
                  placeholder="Describe the exact color, unique marks, sticker or serial number..."
                  required
                  className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#0B2A6F] dark:text-[#F2B705] shrink-0" />
                <span>
                  Collection location: <strong>{claimingItem.handoverPoint}</strong>
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setClaimingItem(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Submit Claim to Security
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
