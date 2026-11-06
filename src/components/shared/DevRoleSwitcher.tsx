/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Dev Role Switcher & 6 Demo Flows Trigger
 * Enabled via VITE_DEV_ROLE_SWITCHER=true
 */

import React, { useState } from 'react';
import { useKampasStore } from '../../lib/store';
import { KampasRole } from '../../styles/tokens';
import { Shield, Sparkles, ChevronDown, Check } from 'lucide-react';
import { Badge } from '../ui/Badge';

const ROLES: { role: KampasRole; label: string; desc: string }[] = [
  { role: 'student', label: 'Student', desc: 'Standard student view (COSC SE)' },
  { role: 'lecturer', label: 'Lecturer', desc: 'Can edit venues & manage courses' },
  { role: 'class_rep', label: 'Class Rep', desc: 'Approves notes & class updates' },
  { role: 'club_officer', label: 'Club Officer', desc: 'Organizes club events & chats' },
  { role: 'alumnus', label: 'Alumnus', desc: 'Reviews pitches & mentors' },
  { role: 'employer', label: 'Employer', desc: 'Posts internships & attachments' },
  { role: 'staff', label: 'Staff Member', desc: 'Campus clearance & facilities' },
  { role: 'admin', label: 'Super Admin', desc: 'Full institutional control center' },
];

const DEMO_FLOWS = [
  { id: 1, title: '1. First Login & Onboarding', desc: 'Student ID, course, interests, notification wizard' },
  { id: 2, title: '2. Live Venue Change', desc: 'Lecturer shifts venue -> instant alert & route pin' },
  { id: 3, title: '3. Free Room & Study Group', desc: 'Find free slot, create group, book session' },
  { id: 4, title: '4. Share Notes & Rep Approval', desc: 'Student uploads -> Rep approves -> Class alerted' },
  { id: 5, title: '5. Alumni Referral Pitch', desc: 'Student sends pitch -> Alumnus accepts live' },
  { id: 6, title: '6. Lost & Found Matching', desc: 'Report found item -> match alert & claim' },
];

export const DevRoleSwitcher: React.FC = () => {
  const { user, setRole, runDemoFlow } = useKampasStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showFlows, setShowFlows] = useState(false);

  return (
    <div className="relative">
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => {
            setIsOpen((prev) => !prev);
            setShowFlows(false);
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#F2B705]/15 border border-[#F2B705]/40 text-[#071B4A] dark:text-[#F2B705] hover:bg-[#F2B705]/25 transition text-xs font-bold"
          title="Switch role for testing"
        >
          <Shield className="w-3.5 h-3.5 text-[#D97706] dark:text-[#F2B705]" />
          <span className="capitalize">{user.role.replace('_', ' ')}</span>
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>

        <button
          onClick={() => {
            setShowFlows((prev) => !prev);
            setIsOpen(false);
          }}
          className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0B2A6F] text-white hover:bg-[#F2B705] hover:text-[#071B4A] transition text-xs font-semibold shadow-sm"
          title="Run 6 End-to-End Demo Flows"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F2B705]" />
          <span>Demo Flows</span>
        </button>
      </div>

      {/* Role Switcher Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#0C1D3D] border border-[#E3E8F0] dark:border-[#1E3158] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1.5 mb-1 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#071B4A] dark:text-white uppercase tracking-wider">
              Switch User Persona
            </span>
            <Badge variant="gold">DEV</Badge>
          </div>
          <div className="space-y-0.5">
            {ROLES.map(({ role, label, desc }) => (
              <button
                key={role}
                onClick={() => {
                  setRole(role);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                  user.role === role
                    ? 'bg-[#0B2A6F] text-white font-bold'
                    : 'text-[#0F172A] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div>
                  <div className="font-semibold">{label}</div>
                  <div className={`text-[10px] ${user.role === role ? 'text-blue-200' : 'text-[#5B6475] dark:text-slate-400'}`}>
                    {desc}
                  </div>
                </div>
                {user.role === role && <Check className="w-4 h-4 text-[#F2B705]" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Demo Flows Menu */}
      {showFlows && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#0C1D3D] border border-[#E3E8F0] dark:border-[#1E3158] rounded-xl shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2 py-1.5 mb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#071B4A] dark:text-white">
                Interactive Demo Flows
              </span>
              <p className="text-[10px] text-[#5B6475] dark:text-slate-400">
                Click any flow to execute it live with real state
              </p>
            </div>
            <Sparkles className="w-4 h-4 text-[#F2B705]" />
          </div>
          <div className="space-y-1">
            {DEMO_FLOWS.map((flow) => (
              <button
                key={flow.id}
                onClick={() => {
                  runDemoFlow(flow.id);
                  setShowFlows(false);
                }}
                className="w-full text-left p-2 rounded-lg text-xs border border-transparent hover:border-[#0B2A6F]/20 hover:bg-[#F0F3FF] dark:hover:bg-slate-800 transition"
              >
                <div className="font-bold text-[#0B2A6F] dark:text-[#93C5FD]">
                  {flow.title}
                </div>
                <div className="text-[11px] text-[#5B6475] dark:text-slate-400 leading-tight">
                  {flow.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
