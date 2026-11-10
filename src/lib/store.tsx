/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Central Reactive State Store & Demo Flow Orchestrator
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Venue,
  Unit,
  TimetableEntry,
  Deadline,
  DocumentItem,
  StudyGroup,
  Club,
  CampusEvent,
  AlumniProfile,
  ReferralRequest,
  LostFoundItem,
  Notice,
  NotificationItem,
  AuditLogItem,
} from './types';
import { KampasRole } from '../styles/tokens';
import type { TimetableEntry as ScannedTimetableEntry } from '../data/timetable';
import { getTimetableDayIndex } from '../data/timetable';
import {
  INITIAL_USER_PROFILE,
  INITIAL_VENUES,
  INITIAL_UNITS,
  INITIAL_DEADLINES,
  INITIAL_DOCUMENTS,
  INITIAL_STUDY_GROUPS,
  INITIAL_CLUBS,
  INITIAL_EVENTS,
  INITIAL_ALUMNI,
  INITIAL_REFERRALS,
  INITIAL_LOST_ITEMS,
  INITIAL_NOTICES,
  INITIAL_NOTIFICATIONS,
} from './mockData';
import { notify, registerNotificationListener } from './notify';

interface ToastMessage {
  id: string;
  type?: NotificationItem['type'];
  title: string;
  body: string;
  priority: 'normal' | 'important' | 'urgent';
  timestamp: number;
}

interface DemoAccount {
  studentId: string;
  password: string;
  profile: UserProfile;
}

const DEMO_ACCOUNTS_KEY = 'kampas_demo_accounts';
const DEMO_SESSION_KEY = 'kampas_session_student_id';
const PRESENTATION_DEMO_STUDENT_ID = 'S21/04589';
const scannedTimetableStorageKey = (profile: UserProfile) =>
  `kampas_scanned_timetable_v1_${encodeURIComponent(normalizeStudentId(profile.studentId || profile.id))}`;
const normalizeStudentId = (studentId: string) => studentId.trim().toUpperCase();
const removePresentationDemoData = () => {
  const studentId = normalizeStudentId(PRESENTATION_DEMO_STUDENT_ID);
  const storageId = encodeURIComponent(studentId);
  localStorage.removeItem(`kampas_scanned_timetable_v1_${storageId}`);
  localStorage.removeItem(`kampas_timetable_upload_v2_${storageId}`);
  if (normalizeStudentId(localStorage.getItem(DEMO_SESSION_KEY) || '') === studentId) {
    localStorage.removeItem(DEMO_SESSION_KEY);
  }
};

const readScannedTimetable = (profile: UserProfile): ScannedTimetableEntry[] => {
  try {
    const saved = localStorage.getItem(scannedTimetableStorageKey(profile));
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const toStoreTimetable = (entries: ScannedTimetableEntry[]): TimetableEntry[] => entries.map((entry) => ({
  id: entry.id,
  unitCode: entry.unitCode,
  unitName: entry.unitName,
  lecturerName: entry.lecturer,
  venueId: entry.venueId,
  venueName: entry.venueName,
  dayOfWeek: getTimetableDayIndex(entry.dayOfWeek),
  startTime: entry.startTime,
  endTime: entry.endTime,
  recurrence: 'weekly',
  isVenueChanged: entry.isRelocated ?? false,
  venueChangeNote: entry.relocationNote,
}));

const getDemoAccounts = (): DemoAccount[] => {
  try {
    removePresentationDemoData();
    const saved = localStorage.getItem(DEMO_ACCOUNTS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as DemoAccount[];
      if (Array.isArray(parsed)) {
        const accounts = parsed.filter(
          (account) => normalizeStudentId(account.studentId) !== normalizeStudentId(PRESENTATION_DEMO_STUDENT_ID)
        );
        if (accounts.length !== parsed.length) saveDemoAccounts(accounts);
        return accounts;
      }
    }
  } catch {
    // Invalid account data should not restore a presentation-only account.
  }

  return [];
};

const saveDemoAccounts = (accounts: DemoAccount[]) => {
  localStorage.setItem(DEMO_ACCOUNTS_KEY, JSON.stringify(accounts));
};

interface KampasContextType {
  // Current user & role
  user: UserProfile;
  isAuthenticated: boolean;
  signIn: (studentId: string, password: string) => { ok: boolean; error?: string };
  signUp: (studentId: string, password: string, firstName: string, lastName: string) => { ok: boolean; error?: string };
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  setRole: (role: KampasRole) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;

  // Preferences & modes
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  toggleDarkMode: () => void;
  lowDataMode: boolean;
  setLowDataMode: (val: boolean) => void;

  // Data states
  venues: Venue[];
  units: Unit[];
  timetable: TimetableEntry[];
  scannedTimetable: ScannedTimetableEntry[];
  saveScannedTimetable: (entries: ScannedTimetableEntry[]) => boolean;
  showTimetableSuccess: () => void;
  timetableLoading: boolean;
  timetableError: string | null;
  deadlines: Deadline[];
  documents: DocumentItem[];
  studyGroups: StudyGroup[];
  clubs: Club[];
  events: CampusEvent[];
  alumni: AlumniProfile[];
  referrals: ReferralRequest[];
  lostItems: LostFoundItem[];
  notices: Notice[];
  notifications: NotificationItem[];
  auditLogs: AuditLogItem[];

  // Realtime actions
  changeVenue: (timetableEntryId: string, newVenueId: string, reason: string) => void;
  toggleDeadlineCompleted: (id: string) => void;
  addDeadline: (deadline: Omit<Deadline, 'id' | 'isCompleted'>) => void;
  uploadDocument: (doc: Omit<DocumentItem, 'id' | 'createdAt' | 'status' | 'downloadCount' | 'averageRating' | 'ratingCount'>) => void;
  approveDocument: (id: string, notes?: string) => void;
  incrementDocumentDownload: (id: string) => void;
  toggleBookmark: (id: string) => void;
  createStudyGroup: (group: Omit<StudyGroup, 'id' | 'memberCount' | 'members' | 'sessions' | 'createdAt'>) => void;
  bookGroupSession: (groupId: string, session: { title: string; venueName: string; date: string; startTime: string; endTime: string }) => void;
  toggleEventRSVP: (eventId: string) => void;
  checkInEvent: (eventId: string) => void;
  toggleClubMembership: (clubId: string) => void;
  sendReferralRequest: (alumnusId: string, company: string, roleTitle: string, pitch: string) => void;
  updateReferralStatus: (referralId: string, status: 'accepted' | 'declined', notes?: string) => void;
  reportLostFoundItem: (item: Omit<LostFoundItem, 'id' | 'createdAt' | 'status'>) => void;
  submitClaim: (itemId: string, claimantAnswer: string) => void;
  acknowledgeNotice: (noticeId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotice: (notice: Omit<Notice, 'id' | 'createdAt' | 'isAcknowledged'>) => void;

  // Toasts
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;

  // Demo Flow Helpers
  runDemoFlow: (flowNumber: number) => void;
}

const KampasContext = createContext<KampasContextType | null>(null);

export const KampasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const sessionId = localStorage.getItem(DEMO_SESSION_KEY);
    return Boolean(sessionId && getDemoAccounts().some((account) => account.studentId === normalizeStudentId(sessionId)));
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const sessionId = localStorage.getItem(DEMO_SESSION_KEY);
    const account = sessionId
      ? getDemoAccounts().find((item) => item.studentId === normalizeStudentId(sessionId))
      : undefined;
    return account?.profile || INITIAL_USER_PROFILE;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('kampas_dark') === 'true';
  });

  const [lowDataMode, setLowDataMode] = useState<boolean>(() => {
    return localStorage.getItem('kampas_lowdata') === 'true';
  });

  // Data states
  const [venues, setVenues] = useState<Venue[]>(INITIAL_VENUES);
  const [units] = useState<Unit[]>(INITIAL_UNITS);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [scannedTimetable, setScannedTimetable] = useState<ScannedTimetableEntry[]>([]);
  const [timetableLoading, setTimetableLoading] = useState(false);
  const [timetableError, setTimetableError] = useState<string | null>(null);
  const [deadlines, setDeadlines] = useState<Deadline[]>(INITIAL_DEADLINES);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>(INITIAL_STUDY_GROUPS);
  const [clubs, setClubs] = useState<Club[]>(INITIAL_CLUBS);
  const [events, setEvents] = useState<CampusEvent[]>(INITIAL_EVENTS);
  const [alumni, setAlumni] = useState<AlumniProfile[]>(INITIAL_ALUMNI);
  const [referrals, setReferrals] = useState<ReferralRequest[]>(INITIAL_REFERRALS);
  const [lostItems, setLostItems] = useState<LostFoundItem[]>(INITIAL_LOST_ITEMS);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply dark mode & low data mode to document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('kampas_dark', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    if (lowDataMode) {
      document.documentElement.classList.add('low-data');
    } else {
      document.documentElement.classList.remove('low-data');
    }
    localStorage.setItem('kampas_lowdata', String(lowDataMode));
  }, [lowDataMode]);

  // Persist user changes
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('kampas_user', JSON.stringify(user));
      const sessionId = normalizeStudentId(user.studentId || '');
      const accounts = getDemoAccounts();
      const updatedAccounts = accounts.map((account) => (
        account.studentId === sessionId ? { ...account, profile: user } : account
      ));
      saveDemoAccounts(updatedAccounts);
    } else {
      localStorage.removeItem('kampas_user');
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    const entries = isAuthenticated ? readScannedTimetable(user) : [];
    setScannedTimetable(entries);
    setTimetable(toStoreTimetable(entries));
    setTimetableLoading(false);
  }, [isAuthenticated, user.id, user.studentId]);

  const saveScannedTimetable = (entries: ScannedTimetableEntry[]) => {
    if (!isAuthenticated) return false;
    try {
      localStorage.setItem(scannedTimetableStorageKey(user), JSON.stringify(entries));
    } catch {
      return false;
    }
    setScannedTimetable(entries);
    setTimetable(toStoreTimetable(entries));
    return true;
  };

  // Register notification listener for in-app toasts
  useEffect(() => {
    const unregister = registerNotificationListener((item) => {
      setNotifications((prev) => [item, ...prev]);
      const toastId = `t-${Date.now()}`;
      setToasts((prev) => [
        {
          id: toastId,
          type: item.type,
          title: item.title,
          body: item.body,
          priority: item.priority,
          timestamp: Date.now(),
        },
        ...prev.slice(0, 4),
      ]);
      // Auto-dismiss after 6s
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toastId));
      }, 6000);
    });
    return unregister;
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showTimetableSuccess = () => {
    const toastId = `t-${Date.now()}`;
    setToasts((prev) => [{
      id: toastId,
      type: 'timetable_scanned',
      title: 'Classes Synched',
      body: 'Schedule Available',
      priority: 'normal',
      timestamp: Date.now(),
    }, ...prev.slice(0, 4)]);
    window.setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== toastId)), 5000);
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const signIn = (studentId: string, password: string) => {
    const normalizedId = normalizeStudentId(studentId);
    const account = getDemoAccounts().find((item) => item.studentId === normalizedId);

    if (!account || account.password !== password) {
      return { ok: false, error: 'That Student ID or password is incorrect. Please try again.' };
    }

    localStorage.setItem(DEMO_SESSION_KEY, normalizedId);
    const entries = readScannedTimetable(account.profile);
    setScannedTimetable(entries);
    setTimetable(toStoreTimetable(entries));
    setUser(account.profile);
    setIsAuthenticated(true);
    return { ok: true };
  };

  const signUp = (studentId: string, password: string, firstName: string, lastName: string) => {
    const normalizedId = normalizeStudentId(studentId);
    if (!normalizedId) return { ok: false, error: 'Enter your Student ID to continue.' };
    if (password.length < 6) return { ok: false, error: 'Your password must be at least 6 characters.' };
    if (!firstName.trim() || !lastName.trim()) return { ok: false, error: 'Enter your first and last name to create your profile.' };

    const accounts = getDemoAccounts();
    if (accounts.some((account) => account.studentId === normalizedId)) {
      return { ok: false, error: 'An account with that Student ID already exists. Sign in instead.' };
    }

    const profile: UserProfile = {
      ...INITIAL_USER_PROFILE,
      id: `usr-${normalizedId.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      studentId: normalizedId,
      fullName: `${firstName.trim()} ${lastName.trim()}`,
      email: `${normalizedId.toLowerCase().replace(/[^a-z0-9]+/g, '.')}@student.ueab.ac.ke`,
      phone: undefined,
      avatarUrl: '',
      interests: [],
      skills: [],
      isOnboarded: true,
      createdAt: new Date().toISOString(),
    };

    saveDemoAccounts([...accounts, { studentId: normalizedId, password, profile }]);
    localStorage.setItem(DEMO_SESSION_KEY, normalizedId);
    setScannedTimetable([]);
    setTimetable([]);
    setUser(profile);
    setIsAuthenticated(true);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem(DEMO_SESSION_KEY);
    localStorage.removeItem('kampas_user');
    setIsAuthenticated(false);
    setScannedTimetable([]);
    setTimetable([]);
    setUser(INITIAL_USER_PROFILE);
  };

  const setRole = (newRole: KampasRole) => {
    setUser((prev) => ({
      ...prev,
      role: newRole,
      status: newRole === 'alumnus' || newRole === 'employer' ? 'active' : prev.status,
    }));
    notify(
      {
        type: 'notice_published',
        title: `Switched Demo Role to: ${newRole.toUpperCase()}`,
        body: `Permissions, views, and navigation adapted for ${newRole}.`,
        priority: 'normal',
      },
      user
    );
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const addAudit = (action: string, targetType: string, details: string) => {
    const log: AuditLogItem = {
      id: `audit-${Date.now()}`,
      actorUserId: user.id,
      actorName: user.fullName,
      actorRole: user.role,
      action,
      targetType,
      details,
      createdAt: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // 1. Change venue (Lecturer / Staff action - Demo Flow 2)
  const changeVenue = (timetableEntryId: string, newVenueId: string, reason: string) => {
    const newVenue = venues.find((v) => v.id === newVenueId);
    if (!newVenue) return;

    let affectedUnit = '';
    setTimetable((prev) =>
      prev.map((entry) => {
        if (entry.id === timetableEntryId) {
          affectedUnit = entry.unitCode;
          return {
            ...entry,
            originalVenueId: entry.originalVenueId || entry.venueId,
            venueId: newVenue.id,
            venueName: newVenue.name,
            isVenueChanged: true,
            venueChangeNote: reason,
          };
        }
        return entry;
      })
    );

    addAudit('VENUE_CHANGE', 'timetable_entry', `Changed ${affectedUnit} to ${newVenue.name}. Reason: ${reason}`);

    notify({
      type: 'venue_change',
      title: `Venue Alert: ${affectedUnit} Moved!`,
      body: `Class has been relocated to ${newVenue.name} (${newVenue.building}, ${newVenue.floor}). Reason: ${reason}`,
      link: '/campus/timetable',
      priority: 'urgent',
    });
  };

  const toggleDeadlineCompleted = (id: string) => {
    setDeadlines((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isCompleted: !d.isCompleted } : d))
    );
  };

  const addDeadline = (deadline: Omit<Deadline, 'id' | 'isCompleted'>) => {
    const newDl: Deadline = {
      ...deadline,
      id: `dl-${Date.now()}`,
      isCompleted: false,
    };
    setDeadlines((prev) => [newDl, ...prev]);
    addAudit('CREATE_DEADLINE', 'deadline', `Added deadline: ${deadline.title}`);
    notify({
      type: 'deadline_approaching',
      title: `New Academic Deadline Added: ${deadline.title}`,
      body: `Due on ${new Date(deadline.dueDate).toLocaleDateString()}`,
      link: '/campus/deadlines',
      priority: deadline.priority,
    });
  };

  // 2. Upload Document (Demo Flow 4)
  const uploadDocument = (doc: Omit<DocumentItem, 'id' | 'createdAt' | 'status' | 'downloadCount' | 'averageRating' | 'ratingCount'>) => {
    const newDoc: DocumentItem = {
      ...doc,
      id: `doc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      downloadCount: 0,
      averageRating: 0,
      ratingCount: 0,
      isBookmarked: false,
    };
    setDocuments((prev) => [newDoc, ...prev]);
    addAudit('UPLOAD_DOCUMENT', 'document', `Uploaded ${doc.title} (${doc.unitCode})`);

    notify({
      type: 'document_uploaded',
      title: `Document Uploaded: ${doc.title}`,
      body: `Submitted for peer verification by Class Rep / Lecturer.`,
      link: '/share',
      priority: 'normal',
    });
  };

  // 3. Approve Document (Class Rep / Lecturer - Demo Flow 4)
  const approveDocument = (id: string, notes?: string) => {
    let approvedTitle = '';
    let unitCode = '';
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          approvedTitle = d.title;
          unitCode = d.unitCode;
          return {
            ...d,
            status: 'approved',
            approvedByUserId: user.id,
          };
        }
        return d;
      })
    );
    addAudit('APPROVE_DOCUMENT', 'document', `Approved ${approvedTitle}. Notes: ${notes || 'None'}`);

    notify({
      type: 'document_approved',
      title: `Verified Material Available: ${approvedTitle}`,
      body: `Class Rep verified study notes for ${unitCode}. Ready for download.`,
      link: '/share',
      priority: 'important',
    });
  };

  const toggleBookmark = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isBookmarked: !d.isBookmarked } : d))
    );
  };

  const incrementDocumentDownload = (id: string) => {
    setDocuments((prev) =>
      prev.map((doc) => doc.id === id ? { ...doc, downloadCount: doc.downloadCount + 1 } : doc)
    );
  };

  // 4. Study Group & Session Booking (Demo Flow 3)
  const createStudyGroup = (group: Omit<StudyGroup, 'id' | 'memberCount' | 'members' | 'sessions' | 'createdAt'>) => {
    const newGroup: StudyGroup = {
      ...group,
      id: `group-${Date.now()}`,
      memberCount: 1,
      members: [{ id: user.id, name: user.fullName, role: 'leader' }],
      sessions: [],
      createdAt: new Date().toISOString(),
    };
    setStudyGroups((prev) => [newGroup, ...prev]);
    notify({
      type: 'notice_published',
      title: `Study Group Created: ${group.name}`,
      body: `Organized for ${group.unitCode}. Open for classmates to join.`,
      link: `/share/groups`,
      priority: 'normal',
    });
  };

  const bookGroupSession = (groupId: string, session: { title: string; venueName: string; date: string; startTime: string; endTime: string }) => {
    setStudyGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const newSession = {
            id: `sess-${Date.now()}`,
            ...session,
          };
          return {
            ...g,
            sessions: [...g.sessions, newSession],
          };
        }
        return g;
      })
    );

    notify({
      type: 'study_group_session',
      title: `Group Study Session Booked!`,
      body: `${session.title} confirmed at ${session.venueName} on ${session.date} from ${session.startTime} to ${session.endTime}.`,
      link: `/share/groups`,
      priority: 'important',
    });
  };

  const toggleEventRSVP = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          const nextRsvpd = !e.isRsvpd;
          return {
            ...e,
            isRsvpd: nextRsvpd,
            currentRsvps: nextRsvpd ? e.currentRsvps + 1 : Math.max(0, e.currentRsvps - 1),
          };
        }
        return e;
      })
    );
  };

  const checkInEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, isCheckedIn: true, isRsvpd: true } : e))
    );
    notify({
      type: 'notice_published',
      title: `Event Check-in Verified!`,
      body: `Your QR code check-in was confirmed at the entrance desk. Enjoy the event!`,
      priority: 'normal',
    });
  };

  const toggleClubMembership = (clubId: string) => {
    setClubs((prev) =>
      prev.map((c) => {
        if (c.id === clubId) {
          const isJ = !c.isJoined;
          return {
            ...c,
            isJoined: isJ,
            memberCount: isJ ? c.memberCount + 1 : Math.max(1, c.memberCount - 1),
          };
        }
        return c;
      })
    );
  };

  // 5. Alumni Referrals (Demo Flow 5)
  const sendReferralRequest = (alumnusId: string, company: string, roleTitle: string, pitch: string) => {
    const targetAlumnus = alumni.find((a) => a.id === alumnusId);
    const newRef: ReferralRequest = {
      id: `ref-${Date.now()}`,
      alumnusId,
      alumnusName: targetAlumnus?.name || 'Alumnus',
      studentUserId: user.id,
      studentName: user.fullName,
      studentCourse: user.course || 'BSc Software Engineering',
      targetCompany: company,
      targetRole: roleTitle,
      pitchStatement: pitch,
      resumeUrl: '/resumes/becky_cherop_cv.pdf',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setReferrals((prev) => [newRef, ...prev]);

    notify({
      type: 'referral_requested',
      title: `Pitch Sent to Alumnus: ${newRef.alumnusName}`,
      body: `Target: ${roleTitle} at ${company}. You will receive a live notification once reviewed.`,
      link: `/community/alumni`,
      priority: 'important',
    });
  };

  const updateReferralStatus = (referralId: string, status: 'accepted' | 'declined', notes?: string) => {
    let companyName = '';
    let student = '';
    setReferrals((prev) =>
      prev.map((r) => {
        if (r.id === referralId) {
          companyName = r.targetCompany;
          student = r.studentName;
          return {
            ...r,
            status,
            alumnusNotes: notes || (status === 'accepted' ? 'Warm referral submitted to hiring partner.' : 'Position filled.'),
            updatedAt: new Date().toISOString(),
          };
        }
        return r;
      })
    );

    addAudit('REFERRAL_UPDATE', 'referral', `Referral for ${student} marked as ${status}`);

    if (status === 'accepted') {
      notify({
        type: 'referral_accepted',
        title: `Congratulations! Alumni Referral Accepted 🎉`,
        body: `Your referral application for ${companyName} has been approved by the alumnus! Check details.`,
        link: `/community/alumni`,
        priority: 'urgent',
      });
    }
  };

  // 6. Lost & Found (Demo Flow 6)
  const reportLostFoundItem = (item: Omit<LostFoundItem, 'id' | 'createdAt' | 'status'>) => {
    const newItem: LostFoundItem = {
      ...item,
      id: `lf-${Date.now()}`,
      status: 'open',
      createdAt: new Date().toISOString(),
      matchSuggestions: [
        {
          id: 'lf-match-demo',
          title: item.type === 'found' ? `Lost ${item.title}` : `Found ${item.title}`,
          confidence: 0.94,
          matchType: item.type === 'found' ? 'lost' : 'found',
        },
      ],
    };
    setLostItems((prev) => [newItem, ...prev]);
    addAudit('REPORT_LOST_FOUND', 'lost_item', `Reported ${item.type} item: ${item.title}`);

    notify({
      type: 'lost_item_matched',
      title: `Match Suggestion Detected! 🔍`,
      body: `We found a 94% match for "${item.title}". Verify details to claim at ${item.handoverPoint}.`,
      link: '/found',
      priority: 'urgent',
    });
  };

  const submitClaim = (itemId: string, claimantAnswer: string) => {
    let claimedItemTitle = '';
    setLostItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          claimedItemTitle = item.title;
          return {
            ...item,
            status: 'claimed',
          };
        }
        return item;
      })
    );
    addAudit('CLAIM_ITEM', 'lost_item', `Claim submitted for ${claimedItemTitle}. Answer provided.`);

    notify({
      type: 'notice_published',
      title: `Item Claim Confirmed!`,
      body: `Your verification answer for "${claimedItemTitle}" was validated. Pick it up with your student ID at the Security Desk.`,
      link: '/found',
      priority: 'important',
    });
  };

  const acknowledgeNotice = (noticeId: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === noticeId ? { ...n, isAcknowledged: true } : n))
    );
    notify({
      type: 'notice_published',
      title: 'Notice Acknowledged',
      body: 'Your confirmation has been recorded in the Dean’s register.',
      priority: 'normal',
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const addNotice = (notice: Omit<Notice, 'id' | 'createdAt' | 'isAcknowledged'>) => {
    const newNotice: Notice = {
      ...notice,
      id: `not-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isAcknowledged: false,
    };
    setNotices((prev) => [newNotice, ...prev]);
    addAudit('POST_NOTICE', 'notice', `Published official notice: ${notice.title}`);
    notify({
      type: 'notice_published',
      title: `Official Bulletin: ${notice.title}`,
      body: notice.content.substring(0, 100) + '...',
      link: '/notifications',
      priority: notice.priority,
    });
  };

  // Helper to trigger the 6 required demo flows seamlessly
  const runDemoFlow = (flowNumber: number) => {
    switch (flowNumber) {
      case 1:
        // First login & onboarding
        setUser((prev) => ({ ...prev, isOnboarded: false }));
        window.location.hash = '#/onboarding';
        break;
      case 2:
        // Venue change
        changeVenue('tt-1', 'venue-compmb', 'Air conditioning maintenance in Science Complex 101.');
        window.location.hash = '#/campus/timetable';
        break;
      case 3:
        // Free room & study group
        bookGroupSession('group-1', {
          title: 'Compiler Lexer Sprint',
          venueName: 'Science Complex Auditorium (Free Slot)',
          date: new Date().toISOString().split('T')[0],
          startTime: '15:00',
          endTime: '17:00',
        });
        window.location.hash = '#/share/groups';
        break;
      case 4:
        // Share notes & approval
        approveDocument('doc-5', 'Verified quality formulas by Class Rep Brian.');
        window.location.hash = '#/share';
        break;
      case 5:
        // Alumni referral accept
        updateReferralStatus('ref-1', 'accepted', 'Recommended directly to Safaricom cloud talent lead.');
        window.location.hash = '#/community/alumni';
        break;
      case 6:
        // Lost and found report & match
        reportLostFoundItem({
          type: 'found',
          title: 'Graphing Calculator Casio fx-991EX',
          category: 'electronics',
          description: 'Found on table 4 in the Science Complex Auditorium.',
          locationFound: 'Science Complex Auditorium Floor 1',
          venueId: 'venue-sciaud',
          venueName: 'Science Complex Auditorium',
          verificationQuestion: 'What initials are written on the inside cover?',
          handoverPoint: 'Security Post B (Science Block)',
          reportedByUserId: user.id,
          reporterName: user.fullName,
        });
        window.location.hash = '#/found';
        break;
    }
  };

  return (
    <KampasContext.Provider
      value={{
        user,
        isAuthenticated,
        signIn,
        signUp,
        logout,
        setUser,
        setRole,
        updateProfile,
        darkMode,
        setDarkMode,
        toggleDarkMode,
        lowDataMode,
        setLowDataMode,
        venues,
        units,
        timetable,
        scannedTimetable,
        saveScannedTimetable,
        showTimetableSuccess,
        timetableLoading,
        timetableError,
        deadlines,
        documents,
        studyGroups,
        clubs,
        events,
        alumni,
        referrals,
        lostItems,
        notices,
        notifications,
        auditLogs,
        changeVenue,
        toggleDeadlineCompleted,
        addDeadline,
        uploadDocument,
        approveDocument,
        incrementDocumentDownload,
        toggleBookmark,
        createStudyGroup,
        bookGroupSession,
        toggleEventRSVP,
        checkInEvent,
        toggleClubMembership,
        sendReferralRequest,
        updateReferralStatus,
        reportLostFoundItem,
        submitClaim,
        acknowledgeNotice,
        markNotificationRead,
        markAllNotificationsRead,
        addNotice,
        toasts,
        dismissToast,
        runDemoFlow,
      }}
    >
      {children}
    </KampasContext.Provider>
  );
};

export const useKampasStore = () => {
  const context = useContext(KampasContext);
  if (!context) {
    throw new Error('useKampasStore must be used within a KampasProvider');
  }
  return context;
};
