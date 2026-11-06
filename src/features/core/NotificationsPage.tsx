/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Notifications & Official Notices Inbox (/notifications)
 * Features: Priority chips (normal, important, urgent), read/unread states,
 * and notice acknowledgment
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useKampasStore } from '../../lib/store';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Clock,
  CheckCheck,
  Megaphone,
} from 'lucide-react';
import { formatDateTime } from '../../lib/utils';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    notices,
    markNotificationRead,
    markAllNotificationsRead,
    acknowledgeNotice,
  } = useKampasStore();

  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'notices'>('all');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.isRead;
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#071B4A] dark:text-white">
              Notifications & Notices
            </h1>
            {unreadCount > 0 && (
              <Badge variant="urgent">{unreadCount} Unread</Badge>
            )}
          </div>
          <p className="text-xs text-[#5B6475] dark:text-slate-400 mt-1">
            Real-time campus logistics, academic deadlines, venue alerts, and official university bulletins.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={markAllNotificationsRead}
            className="text-xs"
          >
            <CheckCheck className="w-4 h-4 mr-1 text-[#0B2A6F]" />
            Mark all read
          </Button>
        )}
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
          All Activity ({notifications.length})
        </button>
        <button
          onClick={() => setActiveTab('unread')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeTab === 'unread'
              ? 'bg-[#0B2A6F] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setActiveTab('notices')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeTab === 'notices'
              ? 'bg-[#0B2A6F] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          Official Bulletins ({notices.length})
        </button>
      </div>

      {/* Official Bulletins Section */}
      {(activeTab === 'all' || activeTab === 'notices') && (
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-[#0B2A6F] dark:text-[#F2B705]" />
            <span className="text-xs font-bold text-[#071B4A] dark:text-white uppercase tracking-wider">
              Official University Notices
            </span>
          </div>

          {notices.map((notice) => (
            <Card
              key={notice.id}
              padding="md"
              className={`border-l-4 ${
                notice.priority === 'urgent'
                  ? 'border-l-[#DC2626] bg-red-50/20'
                  : 'border-l-[#0B2A6F]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#071B4A] dark:text-white">
                      {notice.title}
                    </span>
                    <Badge
                      variant={
                        notice.priority === 'urgent'
                          ? 'urgent'
                          : notice.priority === 'important'
                          ? 'soon'
                          : 'academic'
                      }
                    >
                      {notice.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {notice.content}
                  </p>
                  <div className="text-[10px] text-slate-400">
                    Posted by {notice.posterName} • {formatDateTime(notice.createdAt)}
                  </div>
                </div>

                {notice.requiresAcknowledgement && (
                  <div className="shrink-0">
                    {notice.isAcknowledged ? (
                      <Badge variant="done">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 inline" />
                        Signed & Acknowledged
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => acknowledgeNotice(notice.id)}
                        className="text-xs"
                      >
                        Acknowledge Notice
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Notifications Feed */}
      {activeTab !== 'notices' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#0B2A6F] dark:text-[#F2B705]" />
            <span className="text-xs font-bold text-[#071B4A] dark:text-white uppercase tracking-wider">
              Personal Alerts & Updates
            </span>
          </div>

          {filteredNotifications.length === 0 ? (
            <Card className="text-center py-10">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                All caught up!
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                No unread notifications at the moment.
              </p>
            </Card>
          ) : (
            filteredNotifications.map((ntf) => (
              <Card
                key={ntf.id}
                padding="md"
                onClick={() => markNotificationRead(ntf.id)}
                className={`transition flex items-start gap-3.5 cursor-pointer ${
                  !ntf.isRead ? 'bg-[#F0F3FF]/70 dark:bg-slate-800/80 border-[#0B2A6F]/30' : ''
                }`}
              >
                {/* Priority Icon */}
                {ntf.priority === 'urgent' ? (
                  <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
                ) : ntf.priority === 'important' ? (
                  <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-[#071B4A] dark:text-white truncate">
                      {ntf.title}
                    </span>
                    <Badge
                      variant={
                        ntf.priority === 'urgent'
                          ? 'urgent'
                          : ntf.priority === 'important'
                          ? 'soon'
                          : 'done'
                      }
                    >
                      {ntf.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#5B6475] dark:text-slate-300 leading-relaxed mb-2">
                    {ntf.body}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{formatDateTime(ntf.createdAt)}</span>
                    {ntf.link && (
                      <Link
                        to={ntf.link}
                        className="font-bold text-[#0B2A6F] dark:text-[#F2B705] hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Open Resource →
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};
