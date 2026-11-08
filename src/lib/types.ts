/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Data Models & Type Definitions
 */

import { KampasRole } from '../styles/tokens';

export interface UserProfile {
  id: string; // Clerk user ID or demo ID
  studentId?: string; // e.g. S21/04589
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: KampasRole;
  course?: string;
  department?: string;
  yearOfStudy?: number;
  semester?: number;
  interests: string[];
  skills: string[];
  status: 'active' | 'pending_approval' | 'suspended';
  isOnboarded: boolean;
  visibilitySettings: {
    email: boolean;
    phone: boolean;
    course: boolean;
    interests: boolean;
  };
  notificationPreferences: {
    timetable: boolean;
    deadlines: boolean;
    social: boolean;
    quietHoursEnabled: boolean;
    quietStart: string;
    quietEnd: string;
  };
  createdAt: string;
}

export interface Venue {
  id: string;
  name: string;
  code: string;
  building: string;
  floor: string;
  capacity: number;
  hasProjector: boolean;
  hasPowerSockets: boolean;
  hasWifi: boolean;
  isAccessible: boolean;
  indoorHints: string;
  latitude: number;
  longitude: number;
  category: 'lecture_hall' | 'lab' | 'library' | 'auditorium' | 'sports' | 'admin' | 'service';
}

export interface Unit {
  code: string;
  name: string;
  lecturerName: string;
  lecturerId?: string;
  department: string;
  credits: number;
  description: string;
  semester: string;
  colorTag: string;
}

export interface TimetableEntry {
  id: string;
  unitCode: string;
  unitName: string;
  lecturerName: string;
  venueId: string;
  venueName: string;
  dayOfWeek: number; // 1 = Monday ... 7 = Sunday
  startTime: string; // "08:00"
  endTime: string; // "10:00"
  recurrence?: string;
  originalVenueId?: string;
  isVenueChanged?: boolean;
  venueChangeNote?: string;
}

export interface VenueChange {
  id: string;
  timetableEntryId: string;
  oldVenueId: string;
  oldVenueName: string;
  newVenueId: string;
  newVenueName: string;
  reason: string;
  changedByUserId: string;
  changedByName: string;
  effectiveDate: string;
  createdAt: string;
}

export interface Deadline {
  id: string;
  unitCode?: string;
  title: string;
  description?: string;
  dueDate: string; // ISO string
  category: 'assignment' | 'project' | 'exam' | 'clearance' | 'finance' | 'registration';
  priority: 'normal' | 'important' | 'urgent';
  createdByUserId: string;
  isOfficial: boolean;
  isCompleted?: boolean;
}

export interface DocumentItem {
  id: string;
  title: string;
  unitCode: string;
  description: string;
  fileUrl: string;
  fileName?: string;
  fileType: 'pdf' | 'docx' | 'pptx' | 'zip' | 'html';
  fileSizeBytes: number;
  uploadedByUserId: string;
  uploaderName: string;
  category: 'lecture_notes' | 'past_paper' | 'assignment_solution' | 'summary' | 'lab_manual';
  status: 'pending' | 'approved' | 'rejected';
  approvedByUserId?: string;
  downloadCount: number;
  averageRating: number;
  ratingCount: number;
  isExamPaper?: boolean;
  isRestricted?: boolean;
  createdAt: string;
  isBookmarked?: boolean;
}

export interface StudyGroup {
  id: string;
  name: string;
  unitCode: string;
  description: string;
  createdByUserId: string;
  creatorName: string;
  maxMembers: number;
  preferredVenueId?: string;
  preferredVenueName?: string;
  isOpen: boolean;
  memberCount: number;
  members: Array<{ id: string; name: string; role: 'leader' | 'member' }>;
  sessions: Array<{
    id: string;
    title: string;
    venueName: string;
    date: string;
    startTime: string;
    endTime: string;
  }>;
  createdAt: string;
}

export interface Club {
  id: string;
  name: string;
  code: string;
  category: 'academic' | 'spiritual' | 'recreational' | 'service' | 'cultural';
  description: string;
  leaderName: string;
  meetingSchedule: string;
  memberCount: number;
  avatarUrl?: string;
  isJoined?: boolean;
}

export interface CampusEvent {
  id: string;
  title: string;
  clubId?: string;
  organizerName: string;
  venueId: string;
  venueName: string;
  startTime: string; // ISO
  endTime: string; // ISO
  category: 'academic' | 'chapel' | 'sports' | 'social' | 'career';
  description: string;
  posterUrl?: string;
  maxCapacity?: number;
  currentRsvps: number;
  isPublished: boolean;
  isRsvpd?: boolean;
  isCheckedIn?: boolean;
  qrCodeSecret: string;
}

export interface AlumniProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  graduationYear: number;
  degree: string;
  currentCompany: string;
  currentRole: string;
  industry: string;
  location: string;
  bio: string;
  linkedinUrl: string;
  isWillingToRefer: boolean;
  isMentor: boolean;
  isApproved: boolean;
  avatarUrl?: string;
}

export interface ReferralRequest {
  id: string;
  alumnusId: string;
  alumnusName: string;
  studentUserId: string;
  studentName: string;
  studentCourse: string;
  targetCompany: string;
  targetRole: string;
  pitchStatement: string;
  resumeUrl?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'declined';
  alumnusNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LostFoundItem {
  id: string;
  type: 'lost' | 'found';
  title: string;
  category: 'electronics' | 'documents_id' | 'keys' | 'bags' | 'clothing' | 'books' | 'other';
  description: string;
  photoUrl?: string;
  locationFound: string;
  venueId?: string;
  venueName?: string;
  verificationQuestion: string;
  handoverPoint: string;
  reportedByUserId: string;
  reporterName: string;
  status: 'open' | 'matched' | 'claimed' | 'escalated_security';
  escalatedAt?: string;
  createdAt: string;
  matchSuggestions?: Array<{
    id: string;
    title: string;
    confidence: number;
    matchType: 'lost' | 'found';
  }>;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'academic' | 'chapel' | 'clearance' | 'general' | 'emergency';
  priority: 'normal' | 'important' | 'urgent';
  postedByUserId: string;
  posterName: string;
  requiresAcknowledgement: boolean;
  isAcknowledged?: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  link?: string;
  priority: 'normal' | 'important' | 'urgent';
  isRead: boolean;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  actorUserId: string;
  actorName: string;
  actorRole: string;
  action: string;
  targetType: string;
  targetId?: string;
  details: string;
  createdAt: string;
}
