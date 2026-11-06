/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Unit Detail Page (/campus/units/:code)
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useKampasStore } from '../../lib/store';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  BookOpen,
  Calendar,
  FileText,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { formatTimeOnly } from '../../lib/utils';

export const UnitDetailPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const { units, timetable, documents, studyGroups } = useKampasStore();

  const unit = units.find((u) => u.code.toLowerCase() === decodeURIComponent(code || '').toLowerCase()) || units[0];

  const unitSchedule = timetable.filter((t) => t.unitCode === unit.code);
  const unitDocs = documents.filter((d) => d.unitCode === unit.code && d.status === 'approved');
  const unitGroups = studyGroups.filter((g) => g.unitCode === unit.code);

  return (
    <div className="space-y-6">
      {/* Unit Header Card */}
      <Card padding="lg" className="border-t-4 border-t-[#0B2A6F]">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-black text-[#0B2A6F] dark:text-[#93C5FD]">
                {unit.code}
              </span>
              <Badge variant="academic">{unit.credits} Credits</Badge>
              <span className="text-xs text-slate-500">• {unit.department}</span>
            </div>
            <h1 className="text-2xl font-black text-[#071B4A] dark:text-white">
              {unit.name}
            </h1>
            <p className="text-xs text-[#5B6475] dark:text-slate-300 mt-2 leading-relaxed max-w-2xl">
              {unit.description}
            </p>
            <div className="mt-3 text-xs font-semibold text-slate-700 dark:text-slate-200">
              Instructor: <span className="font-bold">{unit.lecturerName}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/share/upload">
              <Button size="sm" variant="primary" className="text-xs">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Upload Notes
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Grid: Schedule, Documents, and Groups */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-[#071B4A] dark:text-white flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#0B2A6F]" />
            Lecture Slots
          </h2>
          {unitSchedule.length === 0 ? (
            <Card padding="md" className="text-xs text-slate-500 text-center py-6">
              No weekly lecture slots configured.
            </Card>
          ) : (
            unitSchedule.map((entry) => (
              <Card key={entry.id} padding="md">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#071B4A] dark:text-white">
                    Day {entry.dayOfWeek === 1 ? 'Monday' : entry.dayOfWeek === 2 ? 'Tuesday' : entry.dayOfWeek === 3 ? 'Wednesday' : entry.dayOfWeek === 4 ? 'Thursday' : 'Friday'}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300">
                    {formatTimeOnly(entry.startTime)} - {formatTimeOnly(entry.endTime)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{entry.venueName}</span>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Notes & Revision Papers */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#071B4A] dark:text-white flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#0B2A6F]" />
              Verified Materials ({unitDocs.length})
            </h2>
            <Link to="/share" className="text-[11px] text-[#0B2A6F] font-semibold hover:underline">
              Library
            </Link>
          </div>
          {unitDocs.length === 0 ? (
            <Card padding="md" className="text-xs text-slate-500 text-center py-6">
              No verified materials yet. Be the first to upload lecture notes!
            </Card>
          ) : (
            unitDocs.map((doc) => (
              <Card key={doc.id} padding="md">
                <h4 className="text-xs font-bold text-[#071B4A] dark:text-white line-clamp-1">
                  {doc.title}
                </h4>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                  <span>By {doc.uploaderName}</span>
                  <span className="text-emerald-600 font-bold">★ {doc.averageRating}</span>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Study Groups */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#071B4A] dark:text-white flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#0B2A6F]" />
              Study Groups ({unitGroups.length})
            </h2>
            <Link to="/share/groups" className="text-[11px] text-[#0B2A6F] font-semibold hover:underline">
              All Groups
            </Link>
          </div>
          {unitGroups.length === 0 ? (
            <Card padding="md" className="text-xs text-slate-500 text-center py-6">
              No study groups yet for this unit.
            </Card>
          ) : (
            unitGroups.map((g) => (
              <Card key={g.id} padding="md">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-[#071B4A] dark:text-white truncate">
                    {g.name}
                  </h4>
                  <Badge variant="academic">{g.memberCount} members</Badge>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {g.description}
                </p>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
