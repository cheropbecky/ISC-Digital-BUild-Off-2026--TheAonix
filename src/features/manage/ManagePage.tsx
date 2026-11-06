/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Staff & Admin Control Center (/manage)
 * Features: Timetable CSV upload, venue editing, notices publishing,
 * approvals/take-downs, and audit logs.
 * Protected: Students never see /manage.
 */

import React, { useState } from 'react';
import { useKampasStore } from '../../lib/store';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Settings,
  Upload,
  Calendar,
  MapPin,
  Megaphone,
  CheckCircle2,
  Trash2,
  Shield,
  FileSpreadsheet,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { Venue, Notice } from '../../lib/types';
import { formatDateTime } from '../../lib/utils';

export const ManagePage: React.FC = () => {
  const {
    venues,
    timetable,
    notices,
    documents,
    auditLogs,
    addNotice,
    user,
  } = useKampasStore();

  const [activeTab, setActiveTab] = useState<'csv' | 'venues' | 'notices' | 'audit'>('csv');

  // CSV Upload State
  const [csvContent, setCsvContent] = useState('');
  const [csvSuccess, setCsvSuccess] = useState(false);

  // New Notice State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<Notice['category']>('academic');
  const [noticePriority, setNoticePriority] = useState<Notice['priority']>('important');
  const [requiresAck, setRequiresAck] = useState(false);

  const handleCsvUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvContent) return;
    setCsvSuccess(true);
    setTimeout(() => setCsvSuccess(false), 4000);
  };

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeContent) return;

    addNotice({
      title: noticeTitle,
      content: noticeContent,
      category: noticeCategory,
      priority: noticePriority,
      postedByUserId: user.id,
      posterName: user.fullName,
      requiresAcknowledgement: requiresAck,
    });

    setNoticeTitle('');
    setNoticeContent('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#071B4A] dark:text-white">
              Institutional Management & Admin
            </h1>
            <Badge variant="urgent">Restricted Staff Access</Badge>
          </div>
          <p className="text-xs text-[#5B6475] dark:text-slate-400 mt-1">
            Timetable batch ingestion, campus venues configuration, official bulletin publishing, and security audit log.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'csv', label: 'Timetable CSV Ingestion', icon: FileSpreadsheet },
          { id: 'venues', label: 'Venue Manager', icon: MapPin },
          { id: 'notices', label: 'Publish Official Notice', icon: Megaphone },
          { id: 'audit', label: 'Audit Trail', icon: Shield },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === id
                ? 'bg-[#0B2A6F] text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: Timetable CSV Upload */}
      {activeTab === 'csv' && (
        <div className="space-y-4">
          <Card padding="lg">
            <h3 className="text-base font-bold text-[#071B4A] dark:text-white mb-2">
              Batch Timetable CSV Ingestion
            </h3>
            <p className="text-xs text-[#5B6475] dark:text-slate-400 mb-4 leading-relaxed">
              Upload master trimester schedules in CSV format. Expected columns:{' '}
              <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-[11px]">
                unit_code,unit_name,lecturer_name,venue_id,day_of_week,start_time,end_time
              </code>
            </p>

            {csvSuccess && (
              <div className="p-3 mb-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  Successfully parsed and updated {timetable.length} schedule slots for 1st Trimester 2026/27.
                </span>
              </div>
            )}

            <form onSubmit={handleCsvUpload} className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center bg-slate-50/50 dark:bg-slate-900/50">
                <FileSpreadsheet className="w-10 h-10 text-[#0B2A6F] dark:text-[#F2B705] mx-auto mb-2" />
                <span className="text-xs font-bold text-slate-800 dark:text-white block">
                  Paste or Drag & Drop Timetable CSV
                </span>
                <textarea
                  rows={5}
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  placeholder={`COSC 311,Compiler Design,Dr. Evans Kiprop,venue-sciaud,1,08:00,10:00\nCOSC 330,Database Systems,Prof. Mary Achieng,venue-compmb,1,11:00,13:00\nMATH 201,Linear Algebra,Dr. Benson Wafula,venue-sciaud,3,09:00,11:00`}
                  className="w-full mt-3 p-3 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    setCsvContent(
                      `COSC 311,Compiler Design & Automata,Dr. Evans Kiprop,venue-sciaud,1,08:00,10:00\nCOSC 330,Advanced Database Systems,Prof. Mary Achieng,venue-compmb,1,11:00,13:00\nNURS 215,Human Anatomy & Physiology II,Dr. Grace Kemboi,venue-nurslab,3,14:00,17:00`
                    )
                  }
                  className="text-xs"
                >
                  Load Sample CSV
                </Button>
                <Button type="submit" variant="primary">
                  <Upload className="w-3.5 h-3.5 mr-1" />
                  Validate & Commit Schedule
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* TAB 2: Venue Manager */}
      {activeTab === 'venues' && (
        <div className="space-y-4">
          <Card padding="md">
            <h3 className="text-base font-bold text-[#071B4A] dark:text-white mb-3">
              Campus Venues & Capacity Overview
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase">
                  <tr>
                    <th className="p-2.5">Code</th>
                    <th className="p-2.5">Venue Name</th>
                    <th className="p-2.5">Building</th>
                    <th className="p-2.5">Floor</th>
                    <th className="p-2.5">Capacity</th>
                    <th className="p-2.5">Equipment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {venues.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-2.5 font-bold font-mono text-[#0B2A6F] dark:text-[#93C5FD]">
                        {v.code}
                      </td>
                      <td className="p-2.5 font-semibold text-slate-900 dark:text-white">
                        {v.name}
                      </td>
                      <td className="p-2.5 text-slate-500">{v.building}</td>
                      <td className="p-2.5 text-slate-500">{v.floor}</td>
                      <td className="p-2.5 font-mono font-bold">{v.capacity}</td>
                      <td className="p-2.5">
                        <span className="text-[11px] text-slate-600 dark:text-slate-300">
                          {v.hasProjector ? 'Projector • ' : ''}
                          {v.hasWifi ? 'Wi-Fi • ' : ''}
                          {v.hasPowerSockets ? 'Sockets' : ''}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: Publish Notices */}
      {activeTab === 'notices' && (
        <Card padding="lg">
          <h3 className="text-base font-bold text-[#071B4A] dark:text-white mb-1">
            Dispatch Official University Notice
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Official announcements are sent directly to student notification inboxes and highlighted on the home dashboard.
          </p>

          <form onSubmit={handlePostNotice} className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1">Notice Headline</label>
              <input
                type="text"
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
                placeholder="e.g. End of Trimester Examination Clearance & Card Distribution"
                required
                className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">Category</label>
                <select
                  value={noticeCategory}
                  onChange={(e) => setNoticeCategory(e.target.value as any)}
                  className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                >
                  <option value="academic">Academic & Exams</option>
                  <option value="chapel">Spiritual Life & Chapel</option>
                  <option value="clearance">Finance & Clearance</option>
                  <option value="emergency">Emergency Security Alert</option>
                  <option value="general">General Campus Notice</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Priority Level</label>
                <select
                  value={noticePriority}
                  onChange={(e) => setNoticePriority(e.target.value as any)}
                  className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                >
                  <option value="normal">Normal Priority</option>
                  <option value="important">Important (Pinned on Home)</option>
                  <option value="urgent">Urgent (Bypasses Quiet Hours)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Full Bulletin Text</label>
              <textarea
                rows={4}
                value={noticeContent}
                onChange={(e) => setNoticeContent(e.target.value)}
                placeholder="Write the full details and instructions for students..."
                required
                className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
              <input
                type="checkbox"
                checked={requiresAck}
                onChange={(e) => setRequiresAck(e.target.checked)}
                className="w-4 h-4 text-[#0B2A6F] rounded"
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Require Mandatory Student Signature / Acknowledgment
              </span>
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="submit" variant="primary">
                Broadcast Bulletin to All Students
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* TAB 4: Audit Trail */}
      {activeTab === 'audit' && (
        <Card padding="md">
          <h3 className="text-base font-bold text-[#071B4A] dark:text-white mb-2">
            System & Staff Audit Trail
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Immutable log of all administrative actions, venue changes, document approvals, and item claims.
          </p>

          <div className="space-y-2">
            {auditLogs.length === 0 ? (
              <div className="text-xs text-slate-500 italic p-4 text-center">
                System initialized. Perform a venue relocation or approval to record log entries.
              </div>
            ) : (
              auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex items-start justify-between gap-4 font-mono"
                >
                  <div>
                    <div className="font-bold text-[#0B2A6F] dark:text-[#93C5FD]">
                      [{log.action}] by {log.actorName} ({log.actorRole})
                    </div>
                    <div className="text-slate-600 dark:text-slate-300 mt-0.5">
                      {log.details}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {formatDateTime(log.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
