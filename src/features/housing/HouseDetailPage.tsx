/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * House Detail Page - Multi-photo gallery, landlord contact modal with simulated response,
 * report listing modal, walking directions, and amenity specs.
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { HOUSES, HouseListing } from '../../data/houses';
import { useKampasStore } from '../../lib/store';
import { ImageWithFallback } from '../../components/ui/ImageWithFallback';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  ArrowLeft,
  Heart,
  Share2,
  ShieldCheck,
  MapPin,
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Wifi,
  Droplets,
  Zap,
  Lock,
  Flag,
  X,
  ExternalLink,
  Navigation,
} from 'lucide-react';

export const HouseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useKampasStore();

  const [house, setHouse] = useState<HouseListing | null>(null);
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);

  // Saved State
  const [isSaved, setIsSaved] = useState(false);

  // Landlord Contact Modal
  const [showContactModal, setShowContactModal] = useState(false);
  const [inquiryText, setInquiryText] = useState('Hello, I am interested in viewing this rental this week.');
  const [isSending, setIsSending] = useState(false);
  const [simulatedReply, setSimulatedReply] = useState<string | null>(null);

  // Report Modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Price Mismatch');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  useEffect(() => {
    const found = HOUSES.find((h) => h.id === id);
    if (found) {
      setHouse(found);
      const saved = localStorage.getItem('kampas_saved_houses');
      if (saved) {
        const list = JSON.parse(saved);
        setIsSaved(list.includes(found.id));
      }
    }
  }, [id]);

  if (!house) {
    return (
      <div className="p-8 text-center bg-white dark:bg-[#0C1D3D] rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-[#071B4A] dark:text-white">
          Rental Listing Not Found
        </h2>
        <p className="text-sm text-slate-500">
          The requested property may have been occupied or removed.
        </p>
        <Link to="/housing">
          <Button variant="primary">Back to House Find</Button>
        </Link>
      </div>
    );
  }

  const toggleSave = () => {
    try {
      const saved = localStorage.getItem('kampas_saved_houses');
      const list: string[] = saved ? JSON.parse(saved) : [];
      let updated: string[];
      if (list.includes(house.id)) {
        updated = list.filter((item) => item !== house.id);
        setIsSaved(false);
      } else {
        updated = [...list, house.id];
        setIsSaved(true);
      }
      localStorage.setItem('kampas_saved_houses', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSimulatedReply(
        `Habari ${user.fullName.split(' ')[0]}! This is ${house.landlord.name}. Thank you for reaching out regarding ${house.title}. The bedsitter is vacant for this trimester. Please call or WhatsApp me on ${house.landlord.phone} so I can arrange for the caretaker to let you inspect the room.`
      );
    }, 600);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => {
      setShowReportModal(false);
      setReportSubmitted(false);
      alert('Report received. Campus Guild Housing Committee will audit this property within 24 hours.');
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button & Action Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/housing')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2A6F] dark:text-[#F2B705] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to House Find Listings</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSave}
            className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
              isSaved
                ? 'bg-rose-50 border-rose-300 text-rose-600 dark:bg-rose-950/40'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={() => setShowReportModal(true)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-rose-600 transition text-xs font-medium"
            title="Report inaccurate listing"
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Visual Gallery (3 to 5 photos) */}
      <div className="bg-white dark:bg-[#0C1D3D] rounded-2xl border border-[#E3E8F0] dark:border-[#1E3158] overflow-hidden p-3 sm:p-4 space-y-3 shadow-xs">
        {/* Main Display Image */}
        <div className="relative aspect-16/9 w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
          <ImageWithFallback
            src={house.photos[selectedPhotoIdx] || house.photos[0]}
            alt={house.title}
            className="w-full h-full object-cover"
          />

          {/* Top Floating Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            {house.isVerified && (
              <span className="bg-[#0B2A6F]/90 backdrop-blur-md text-[#F2B705] px-3 py-1 rounded-md text-xs font-extrabold flex items-center gap-1.5 shadow-md">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Off-Campus Rental</span>
              </span>
            )}
            <span className="bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-xs font-semibold">
              {house.area}
            </span>
          </div>

          <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-md text-xs font-medium">
            Photo {selectedPhotoIdx + 1} of {house.photos.length}
          </div>
        </div>

        {/* Thumbnail Selector Strip */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {house.photos.map((photoUrl, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedPhotoIdx(idx)}
              className={`relative w-20 sm:w-28 aspect-16/10 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                selectedPhotoIdx === idx
                  ? 'border-[#0B2A6F] dark:border-[#F2B705] scale-105 shadow-md'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <ImageWithFallback
                src={photoUrl}
                alt={`${house.title} photo ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Details & Landlord Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Specs, Description, Amenities, Walking Route */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Title & Price Header */}
          <div className="bg-white dark:bg-[#0C1D3D] p-5 rounded-2xl border border-[#E3E8F0] dark:border-[#1E3158] shadow-xs space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="text-xs font-extrabold text-[#0B2A6F] dark:text-[#F2B705] uppercase tracking-wider">
                  {house.area} • {house.type.replace('_', ' ')}
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-[#071B4A] dark:text-white mt-0.5">
                  {house.title}
                </h1>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0B2A6F] dark:text-[#F2B705]" />
                  <span>{house.distanceKm} km from UEAB Main Gate ({house.walkingMinutes} min walk)</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-black text-[#0B2A6F] dark:text-[#F2B705]">
                  KES {house.priceMonthlyKes.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400">
                  Monthly Rent • Deposit KES {house.depositKes.toLocaleString()}
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800">
              {house.description}
            </p>
          </div>

          {/* Amenities & Utilities Matrix */}
          <div className="bg-white dark:bg-[#0C1D3D] p-5 rounded-2xl border border-[#E3E8F0] dark:border-[#1E3158] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#071B4A] dark:text-white">
              Amenities & Utilities
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5">
                <Droplets className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-white">Water Supply</div>
                  <div className="text-[11px] text-slate-500">
                    {house.amenities.water ? 'Borehole (24/7)' : 'Piped (Scheduled)'}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-white">Electricity</div>
                  <div className="text-[11px] text-slate-500">
                    {house.amenities.electricity ? 'Prepaid KPLC Token' : 'Shared Meter'}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5">
                <Wifi className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-white">Internet</div>
                  <div className="text-[11px] text-slate-500">
                    {house.amenities.wifi ? 'Fiber Wi-Fi Free' : 'Student Modem'}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-purple-500" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-white">Compound Security</div>
                  <div className="text-[11px] text-slate-500">
                    {house.amenities.securityGuard ? 'Day & Night Guard' : 'Perimeter Wall & Gate'}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-white">CCTV & Gate</div>
                  <div className="text-[11px] text-slate-500">
                    {house.amenities.cctv ? 'Active Surveillance' : 'Standard Padlock Gate'}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-sky-500" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-white">Furnishing</div>
                  <div className="text-[11px] text-slate-500">
                    {house.isFurnished ? 'Desk, Chair & Bed' : 'Unfurnished'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Walking Route & Neighborhood Notes */}
          <div className="bg-white dark:bg-[#0C1D3D] p-5 rounded-2xl border border-[#E3E8F0] dark:border-[#1E3158] shadow-xs space-y-3">
            <h2 className="text-base font-bold text-[#071B4A] dark:text-white flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#0B2A6F] dark:text-[#F2B705]" />
              <span>Route to Campus Main Gate</span>
            </h2>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              From this property, head along the paved tarmac road toward Baraton Centre commercial strip.
              Passing Baraton Pharmacy and Mama Brian grocery store, enter the university gate via the pedestrian scanner lane.
              Average walking pace: <strong>{house.walkingMinutes} minutes</strong>. Boda-boda fare: <strong>KES 50</strong>.
            </p>

            <div className="pt-2">
              <Link to={`/campus/map?venue=main-gate`}>
                <Button variant="secondary" size="sm">
                  View on Campus Map
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Landlord Card & Inquiry CTA */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0C1D3D] p-5 rounded-2xl border border-[#E3E8F0] dark:border-[#1E3158] shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-[#071B4A] dark:text-white">
              Landlord & Caretaker
            </h3>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#0B2A6F] text-[#F2B705] font-extrabold text-base flex items-center justify-center">
                {house.landlord.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#071B4A] dark:text-white">
                  {house.landlord.name}
                </h4>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="font-extrabold text-emerald-600">⭐ {house.landlord.rating} / 5.0</span>
                  <span className="text-slate-400">• Verified</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span>Phone:</span>
                <span className="font-mono font-bold text-[#071B4A] dark:text-white">
                  {house.landlord.phone}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Response Speed:</span>
                <span className="text-emerald-600 font-semibold">{house.landlord.responseTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Direct Inquiries:</span>
                <span className="text-slate-500">No broker fee</span>
              </div>
            </div>

            <Button
              variant="gold"
              className="w-full font-bold shadow-md"
              onClick={() => {
                setShowContactModal(true);
                setSimulatedReply(null);
              }}
            >
              <MessageSquare className="w-4 h-4 mr-1.5" />
              Message Landlord
            </Button>

            <a
              href={`tel:${house.landlord.phone}`}
              className="w-full block"
            >
              <Button variant="secondary" className="w-full text-xs">
                <Phone className="w-3.5 h-3.5 mr-1.5" />
                Call {house.landlord.phone}
              </Button>
            </a>
          </div>

          {/* Student Protection Notice */}
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Campus Security Notice</span>
            </div>
            <p className="text-amber-900/80 dark:text-amber-200/80 leading-relaxed text-[11px]">
              Never pay rental deposits via M-PESA before physically viewing the room and signing an agreement witnessed by the Baraton Student Guild housing liaison.
            </p>
          </div>
        </div>
      </div>

      {/* ================= LANDLORD MESSAGE MODAL ================= */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#071B4A] max-w-md w-full rounded-2xl shadow-2xl p-5 space-y-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-[#071B4A] dark:text-white">
                  Direct Landlord Message
                </h3>
                <p className="text-xs text-slate-500">{house.title}</p>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {simulatedReply ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2 animate-in fade-in">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Landlord Reply:</span>
                </div>
                <p className="text-xs text-emerald-900 dark:text-emerald-100 leading-relaxed italic">
                  "{simulatedReply}"
                </p>
                <Button
                  size="sm"
                  variant="primary"
                  className="w-full mt-3"
                  onClick={() => setShowContactModal(false)}
                >
                  Close & View Details
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Inquiry Message
                  </label>
                  <textarea
                    rows={4}
                    value={inquiryText}
                    onChange={(e) => setInquiryText(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[#0F172A] dark:text-white focus:outline-none"
                  />
                </div>

                <div className="text-[11px] text-slate-400">
                  Transmitted with your verified student profile: {user.fullName} ({user.studentId || 'SENG/2023/4921'}).
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowContactModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="gold"
                    size="sm"
                    disabled={isSending}
                  >
                    {isSending ? 'Sending Inquiry...' : 'Submit Inquiry'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= REPORT LISTING MODAL ================= */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#071B4A] max-w-md w-full rounded-2xl shadow-2xl p-5 space-y-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-[#071B4A] dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Report Rental Listing</span>
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Report
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                >
                  <option value="Price Mismatch">Price Mismatch (Landlord quotes higher rent)</option>
                  <option value="Already Occupied">No Vacancy (Room was already rented)</option>
                  <option value="Broker Scam">Unverified Third-Party Broker Fee Demanded</option>
                  <option value="Inaccurate Amenities">Amenities Not as Described (No water/Wi-Fi)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Additional Details
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide context for the Guild housing committee..."
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowReportModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={reportSubmitted}
                >
                  {reportSubmitted ? 'Submitting...' : 'Submit Report'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
