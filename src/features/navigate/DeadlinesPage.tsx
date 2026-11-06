/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Academic Deadlines Page (/campus/deadlines)
 * Features: Days-left chips (grey, amber, red), reminders at 7, 3 and 1 day,
 * checkbox tracking, filter categories, create deadline modal
 */

import React, { useState } from 'react';
import { useKampasStore } from '../../lib/store';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  CheckSquare,
  Clock,
  Plus,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { getDaysRemaining } from '../../lib/utils';
import { Deadline } from '../../lib/types';

export const DeadlinesPage: React.FC = () => {
  const { deadlines, toggleDeadlineCompleted, addDeadline, user } = useKampasStore();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('pending');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New deadline form state
  const [newTitle, setNewTitle] = useState('');
  const [newUnitCode, setNewUnitCode] = useState('COSC 311');
  const [newDueDate, setNewDueDate] = useState('');
  const [newCategory, setNewCategory] = useState<Deadline['category']>('assignment');
  const [newPriority, setNewPriority] = useState<Deadline['priority']>('important');

  const filteredDeadlines = deadlines.filter((d) => {
    if (activeTab === 'pending' && d.isCompleted) return false;
    if (activeTab === 'completed' && !d.isCompleted) return false;
    if (categoryFilter !== 'all' && d.category !== categoryFilter) return false;
    return true;
  });

  const handleCreateDeadline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDueDate) return;

    addDeadline({
      title: newTitle,
      unitCode: newUnitCode || undefined,
      dueDate: new Date(newDueDate).toISOString(),
      category: newCategory,
      priority: newPriority,
      createdByUserId: user.id,
      isOfficial: false,
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewDueDate('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#071B4A] dark:text-white">
              Academic Deadlines & Clearance
            </h1>
            <Badge variant="academic">Trimester 1</Badge>
          </div>
          <p className="text-xs text-[#5B6475] dark:text-slate-400 mt-1">
            Automated alerts scheduled at 7 days, 3 days, and 24 hours prior to submission.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setShowAddModal(true)}
          className="text-xs"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Personal Deadline
        </Button>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
              activeTab === 'pending'
                ? 'bg-white dark:bg-[#071B4A] text-[#0B2A6F] dark:text-[#F2B705] shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Pending Tasks ({deadlines.filter((d) => !d.isCompleted).length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
              activeTab === 'completed'
                ? 'bg-white dark:bg-[#071B4A] text-[#0B2A6F] dark:text-[#F2B705] shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Completed ({deadlines.filter((d) => d.isCompleted).length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
              activeTab === 'all'
                ? 'bg-white dark:bg-[#071B4A] text-[#0B2A6F] dark:text-[#F2B705] shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            All
          </button>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'assignment', 'project', 'finance', 'registration'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize transition ${
                categoryFilter === cat
                  ? 'bg-[#0B2A6F] text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Deadlines List */}
      <div className="space-y-3">
        {filteredDeadlines.length === 0 ? (
          <Card className="text-center py-12">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">
              No Deadlines in this Category!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              You are all caught up with your academic deliverables.
            </p>
          </Card>
        ) : (
          filteredDeadlines.map((dl) => {
            const daysInfo = getDaysRemaining(dl.dueDate);
            return (
              <Card
                key={dl.id}
                padding="md"
                className={`flex items-center justify-between gap-4 transition-all ${
                  dl.isCompleted ? 'opacity-60 bg-slate-50 dark:bg-slate-900/40' : ''
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={dl.isCompleted}
                    onChange={() => toggleDeadlineCompleted(dl.id)}
                    className="mt-1 w-5 h-5 rounded text-[#0B2A6F] cursor-pointer"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      {dl.unitCode && (
                        <span className="text-xs font-bold text-[#0B2A6F] dark:text-[#93C5FD]">
                          {dl.unitCode}
                        </span>
                      )}
                      <span className="text-[11px] font-semibold text-slate-500 capitalize">
                        • {dl.category}
                      </span>
                      {dl.isOfficial && (
                        <Badge variant="academic">OFFICIAL</Badge>
                      )}
                    </div>
                    <h3
                      className={`text-sm font-bold text-[#071B4A] dark:text-white ${
                        dl.isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
                      }`}
                    >
                      {dl.title}
                    </h3>
                    {dl.description && (
                      <p className="text-xs text-[#5B6475] dark:text-slate-400 mt-0.5 line-clamp-1">
                        {dl.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right side: Days Left Chip */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {new Date(dl.dueDate).toLocaleDateString('en-KE', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="text-[10px] text-slate-400">Due Date</div>
                  </div>

                  <Badge
                    variant={
                      dl.isCompleted
                        ? 'neutral'
                        : daysInfo.status === 'urgent'
                        ? 'urgent'
                        : daysInfo.status === 'warning'
                        ? 'soon'
                        : 'neutral'
                    }
                    showDot={!dl.isCompleted}
                  >
                    {dl.isCompleted ? 'Completed' : daysInfo.label}
                  </Badge>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Add Deadline Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#0C1D3D] rounded-2xl max-w-md w-full p-6 text-slate-900 dark:text-white shadow-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold mb-4">Add Personal Deadline</h3>
            <form onSubmit={handleCreateDeadline} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Complete Chapter 3 Review Questions"
                  required
                  className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Course Code</label>
                  <input
                    type="text"
                    value={newUnitCode}
                    onChange={(e) => setNewUnitCode(e.target.value)}
                    placeholder="e.g. COSC 311"
                    className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    required
                    className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                  >
                    <option value="assignment">Assignment</option>
                    <option value="project">Project</option>
                    <option value="exam">Exam</option>
                    <option value="finance">Finance</option>
                    <option value="registration">Registration</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                  >
                    <option value="normal">Normal</option>
                    <option value="important">Important</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Deadline
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
