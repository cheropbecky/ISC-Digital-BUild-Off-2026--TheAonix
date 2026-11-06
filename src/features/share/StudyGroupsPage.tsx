/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Study Groups & Collaborative Revision (/share/groups)
 * Features: Session scheduler that picks a free room, member management,
 * group creation (Demo Flow 3)
 */

import React, { useState } from 'react';
import { useKampasStore } from '../../lib/store';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Users,
  Calendar,
  Clock,
  Plus,
  MapPin,
  Sparkles,
  BookOpen,
  DoorOpen,
  CheckCircle2,
} from 'lucide-react';
import { StudyGroup } from '../../lib/types';

export const StudyGroupsPage: React.FC = () => {
  const { studyGroups, units, venues, user, createStudyGroup, bookGroupSession } = useKampasStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState<StudyGroup | null>(null);

  // Create Group Form
  const [groupName, setGroupName] = useState('');
  const [unitCode, setUnitCode] = useState('COSC 311');
  const [description, setDescription] = useState('');
  const [maxMembers, setMaxMembers] = useState(8);

  // Schedule Session Form
  const [sessionTitle, setSessionTitle] = useState('Midterm Practice & Problem Solving');
  const [sessionVenue, setSessionVenue] = useState('venue-compmb');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [sessionTime, setSessionTime] = useState('16:00');

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName) return;

    createStudyGroup({
      name: groupName,
      unitCode,
      description,
      createdByUserId: user.id,
      creatorName: user.fullName,
      maxMembers,
      isOpen: true,
    });

    setShowCreateModal(false);
    setGroupName('');
    setDescription('');
  };

  const handleScheduleSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showScheduleModal) return;

    const chosenVenue = venues.find((v) => v.id === sessionVenue);

    bookGroupSession(showScheduleModal.id, {
      title: sessionTitle,
      venueName: chosenVenue ? `${chosenVenue.name} (${chosenVenue.floor})` : 'Computing Lab B',
      date: sessionDate,
      startTime: sessionTime,
      endTime: `${Number(sessionTime.split(':')[0]) + 2}:00`,
    });

    setShowScheduleModal(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#071B4A] dark:text-white">
              Collaborative Study Groups
            </h1>
            <Badge variant="academic">Peer Learning</Badge>
          </div>
          <p className="text-xs text-[#5B6475] dark:text-slate-400 mt-1">
            Form small study circles, reserve free lecture halls, and prepare together for Baraton exams.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          className="text-xs"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Create Study Group
        </Button>
      </div>

      {/* Study Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {studyGroups.map((group) => {
          const isUserMember = group.members.some((m) => m.id === user.id);

          return (
            <Card key={group.id} padding="lg" className="flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-black text-[#0B2A6F] dark:text-[#93C5FD] tracking-wider uppercase">
                      {group.unitCode}
                    </span>
                    <h3 className="text-base font-bold text-[#071B4A] dark:text-white">
                      {group.name}
                    </h3>
                  </div>
                  <Badge variant={group.isOpen ? 'done' : 'neutral'}>
                    <Users className="w-3 h-3 mr-1 inline" />
                    {group.memberCount} / {group.maxMembers}
                  </Badge>
                </div>

                <p className="text-xs text-[#5B6475] dark:text-slate-300 leading-relaxed mb-4">
                  {group.description}
                </p>

                {/* Scheduled Upcoming Sessions */}
                <div className="space-y-2 mb-4">
                  <span className="text-[11px] font-bold text-[#071B4A] dark:text-white uppercase tracking-wider block">
                    Upcoming Booked Sessions ({group.sessions.length})
                  </span>
                  {group.sessions.length === 0 ? (
                    <div className="text-[11px] text-slate-500 italic p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      No active room booked yet. Use the scheduler below to reserve a free hall!
                    </div>
                  ) : (
                    group.sessions.map((sess) => (
                      <div
                        key={sess.id}
                        className="p-2.5 bg-[#F0F3FF] dark:bg-slate-800 rounded-lg border border-blue-100 dark:border-slate-700 text-xs flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-[#071B4A] dark:text-white">
                            {sess.title}
                          </div>
                          <div className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#0B2A6F]" />
                            <span>{sess.venueName}</span>
                          </div>
                        </div>
                        <div className="text-right font-mono text-[11px] font-bold text-[#0B2A6F] dark:text-[#93C5FD]">
                          <div>{sess.date}</div>
                          <div>{sess.startTime} - {sess.endTime}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Members list */}
                <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 font-semibold mr-1">Members:</span>
                  {group.members.slice(0, 4).map((m) => (
                    <span
                      key={m.id}
                      className="w-6 h-6 rounded-full bg-[#0B2A6F] text-[#F2B705] text-[10px] font-bold flex items-center justify-center"
                      title={m.name}
                    >
                      {m.name[0]}
                    </span>
                  ))}
                  {group.members.length > 4 && (
                    <span className="text-[10px] text-slate-400">
                      +{group.members.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  size="sm"
                  variant="gold"
                  onClick={() => setShowScheduleModal(group)}
                  className="flex-1 text-xs"
                >
                  <DoorOpen className="w-3.5 h-3.5 mr-1" />
                  Book Free Room Session
                </Button>
                {isUserMember ? (
                  <Badge variant="academic">Joined</Badge>
                ) : (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      group.members.push({ id: user.id, name: user.fullName, role: 'member' });
                      group.memberCount += 1;
                    }}
                    className="text-xs"
                  >
                    Join
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Study Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#0C1D3D] rounded-2xl max-w-md w-full p-6 text-slate-900 dark:text-white shadow-2xl">
            <h3 className="text-lg font-bold mb-3">Create New Study Group</h3>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">Group Name</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. Baraton Compiler Crafters"
                  required
                  className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Unit Code</label>
                  <select
                    value={unitCode}
                    onChange={(e) => setUnitCode(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                  >
                    {units.map((u) => (
                      <option key={u.code} value={u.code}>
                        {u.code}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Max Capacity</label>
                  <input
                    type="number"
                    min={3}
                    max={15}
                    value={maxMembers}
                    onChange={(e) => setMaxMembers(Number(e.target.value))}
                    className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Focus Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What topics will your group focus on?"
                  required
                  className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Create Group
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Room Session Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#0C1D3D] rounded-2xl max-w-md w-full p-6 text-slate-900 dark:text-white shadow-2xl">
            <h3 className="text-lg font-bold mb-1">
              Schedule Session for {showScheduleModal.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Select an available lecture hall. Group members will receive an in-app alert.
            </p>

            <form onSubmit={handleScheduleSession} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">Session Topic</label>
                <input
                  type="text"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  required
                  className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Select Campus Venue</label>
                <select
                  value={sessionVenue}
                  onChange={(e) => setSessionVenue(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                >
                  {venues.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.building}, {v.floor})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Date</label>
                  <input
                    type="date"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    required
                    className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Time</label>
                  <input
                    type="time"
                    value={sessionTime}
                    onChange={(e) => setSessionTime(e.target.value)}
                    required
                    className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowScheduleModal(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Confirm Booking & Dispatch Alert
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
