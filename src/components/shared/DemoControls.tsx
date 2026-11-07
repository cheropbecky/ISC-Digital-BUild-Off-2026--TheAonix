/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Floating Demo Controls Panel
 * Allows interactive testing of all simulated realtime campus events:
 * 1. Lecturer Venue Change Alert
 * 2. Alumnus Referral Accepted
 * 3. Lost-Item 94% Match Found
 * 4. Landlord Reply Received
 */

import React, { useState } from 'react';
import { useKampasStore } from '../../lib/store';
import {
  Sparkles,
  Zap,
  MapPin,
  UserCheck,
  SearchCheck,
  Home,
  X,
  ChevronUp,
  ChevronDown,
  Bell,
} from 'lucide-react';
import { Button } from '../ui/Button';

export const DemoControls: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    changeVenue,
    updateReferralStatus,
    reportLostFoundItem,
    venues,
    user,
  } = useKampasStore();

  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);

  const showConfirmation = (msg: string) => {
    setLastActionMessage(msg);
    setTimeout(() => setLastActionMessage(null), 3500);
  };

  // 1. Trigger Lecturer Venue Change Alert
  const handleTriggerVenueChange = () => {
    // Relocate MATH 201 to Main Computing Lab B
    changeVenue(
      'tt-mon-2',
      'venue-compmb',
      'Air-conditioning maintenance and network upgrade in Science Complex Auditorium.'
    );
    showConfirmation('Triggered: Venue change alert sent to all enrolled students!');
  };

  // 2. Trigger Alumnus Referral Accept
  const handleTriggerReferralAccept = () => {
    updateReferralStatus('ref-1', 'accepted', 'Recommended directly to Safaricom PLC Cloud talent lead.');
    showConfirmation('Triggered: Alumnus referral accepted notification dispatched!');
  };

  // 3. Trigger Lost-Item Match (94% confidence)
  const handleTriggerLostMatch = () => {
    reportLostFoundItem({
      type: 'found',
      title: 'HP 300s+ Scientific Calculator',
      category: 'electronics',
      description: 'Found on seat row 4 in Science Complex Auditorium.',
      locationFound: 'Science Complex Auditorium Floor 1',
      venueId: 'venue-sciaud',
      venueName: 'Science Complex Auditorium',
      verificationQuestion: 'What initials or colored tape is placed on the slide-on case?',
      handoverPoint: 'Main Campus Security Post (Gate 1)',
      reportedByUserId: user.id,
      reporterName: 'Emmanuel Kiprono',
    });
    showConfirmation('Triggered: 94% Lost & Found match notification detected!');
  };

  // 4. Trigger Landlord Reply
  const handleTriggerLandlordReply = () => {
    // Dispatches a housing inquiry confirmation toast & notification
    if ((window as any).kampasDispatchLandlordReply) {
      (window as any).kampasDispatchLandlordReply();
    }
    showConfirmation('Triggered: Landlord reply received for Highland Executive Studios!');
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 select-none">
      {/* Pop-up Panel */}
      {isOpen ? (
        <div className="bg-[#071B4A] text-white w-80 sm:w-96 rounded-2xl shadow-2xl border border-[#F2B705]/50 p-4 space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-[#F2B705] text-[#071B4A]">
                <Zap className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white">
                  Demo Interactive Triggers
                </h4>
                <p className="text-[10px] text-slate-300">
                  Simulate live realtime campus events
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {lastActionMessage && (
            <div className="p-2 rounded-lg bg-[#F2B705]/20 border border-[#F2B705]/40 text-[#F2B705] text-[11px] font-semibold animate-in fade-in">
              {lastActionMessage}
            </div>
          )}

          <div className="space-y-2">
            {/* Action 1: Venue Relocation */}
            <button
              onClick={handleTriggerVenueChange}
              className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#F2B705] transition flex items-center gap-2.5 group"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-600/30 text-[#F2B705] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white group-hover:text-[#F2B705] transition-colors">
                  1. Lecturer Venue Shift Alert
                </div>
                <div className="text-[10px] text-slate-300 truncate">
                  Relocates MATH 201 to Lab B with instant alert
                </div>
              </div>
            </button>

            {/* Action 2: Referral Acceptance */}
            <button
              onClick={handleTriggerReferralAccept}
              className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#F2B705] transition flex items-center gap-2.5 group"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                  2. Alumnus Referral Accepted
                </div>
                <div className="text-[10px] text-slate-300 truncate">
                  Safaricom lead accepts student CV pitch
                </div>
              </div>
            </button>

            {/* Action 3: Lost Item 94% Match */}
            <button
              onClick={handleTriggerLostMatch}
              className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#F2B705] transition flex items-center gap-2.5 group"
            >
              <div className="w-7 h-7 rounded-lg bg-purple-600/30 text-purple-400 flex items-center justify-center shrink-0">
                <SearchCheck className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">
                  3. Lost-Item 94% Match Found
                </div>
                <div className="text-[10px] text-slate-300 truncate">
                  Triggers match for HP Calculator with secret quiz
                </div>
              </div>
            </button>

            {/* Action 4: Landlord Reply */}
            <button
              onClick={handleTriggerLandlordReply}
              className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#F2B705] transition flex items-center gap-2.5 group"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-600/30 text-amber-400 flex items-center justify-center shrink-0">
                <Home className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                  4. Landlord Inquiry Reply
                </div>
                <div className="text-[10px] text-slate-300 truncate">
                  Simulates response from Baraton Centre landlord
                </div>
              </div>
            </button>
          </div>
        </div>
      ) : (
        /* Floating Pill Button */
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#071B4A] text-white hover:bg-[#0B2A6F] border-2 border-[#F2B705] px-3.5 py-2 rounded-full shadow-2xl flex items-center gap-2 transition-all hover:scale-105"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" />
          <Zap className="w-4 h-4 text-[#F2B705]" />
          <span className="text-xs font-black uppercase tracking-wider hidden sm:inline">
            Demo Controls
          </span>
        </button>
      )}
    </div>
  );
};
