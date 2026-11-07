/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * UEAB Student Profile, Notifications Inbox & Institutional Notices Mock Data
 */

export interface StudentProfile {
  id: string;
  studentIdNumber: string; // e.g. SENG/2023/4921
  fullName: string;
  email: string;
  phone: string;
  degreeProgramme: string;
  faculty: string;
  yearOfStudy: number;
  currentTrimester: string;
  hallOrResidence: string; // Off-campus: Baraton Centre / Highlands Studios
  campusBaratonEmail: string;
  nationalIdNumber: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  libraryCardNumber: string;
  examRegistrationStatus: 'Cleared' | 'Pending Finance' | 'Audit Required';
  totalCreditsCompleted: number;
  cumulativeGpa: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'venue_change' | 'academic' | 'referral' | 'housing' | 'lost_item' | 'notice';
  actionUrl?: string;
  actionText?: string;
}

export interface InstitutionalNotice {
  id: string;
  title: string;
  issuedBy: string;
  department: string;
  date: string;
  isUrgent: boolean;
  summary: string;
  fullBody: string;
}

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  id: 'usr-becky-4921',
  studentIdNumber: 'SENG/2023/4921',
  fullName: 'Becky Cherop',
  email: 'becky.cherop@student.ueab.ac.ke',
  phone: '+254 712 345 678',
  degreeProgramme: 'Bachelor of Science in Software Engineering',
  faculty: 'Faculty of Science & Technology',
  yearOfStudy: 3,
  currentTrimester: '1st Trimester 2026/2027',
  hallOrResidence: 'Highland Executive Studios, Baraton Centre (Off-Campus)',
  campusBaratonEmail: 'becky.cherop@student.ueab.ac.ke',
  nationalIdNumber: '39481023',
  emergencyContact: {
    name: 'Mrs. Mary Cherop',
    relationship: 'Mother',
    phone: '+254 722 987 654',
  },
  libraryCardNumber: 'LIB-UEAB-2023-882',
  examRegistrationStatus: 'Cleared',
  totalCreditsCompleted: 98,
  cumulativeGpa: 3.82,
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Venue Change: MATH 201 Relocated',
    message: 'Dr. Benson Wafula has relocated today’s Linear Algebra class to Tech Block Lab 3 for linear solver computational practice.',
    timestamp: '15 mins ago',
    isRead: false,
    type: 'venue_change',
    actionUrl: '/campus/timetable',
    actionText: 'View on Timetable',
  },
  {
    id: 'notif-2',
    title: 'Alumni Referral Update',
    message: 'Brian Kiprop (Senior Cloud Backend Engineer at Safaricom PLC) approved your attachment referral request and submitted your CV!',
    timestamp: '1 hour ago',
    isRead: false,
    type: 'referral',
    actionUrl: '/community/alumni',
    actionText: 'View Alumni Profile',
  },
  {
    id: 'notif-3',
    title: 'Potential Match for Lost Item!',
    message: 'A silver HP Scientific Calculator matching your lost item description was handed in at Main Campus Security Post (Gate 1).',
    timestamp: '3 hours ago',
    isRead: false,
    type: 'lost_item',
    actionUrl: '/found',
    actionText: 'Verify Ownership',
  },
  {
    id: 'notif-4',
    title: 'Landlord Inquiry Response',
    message: 'Mzee Kipkorir Rono from Highland Executive Studios sent a response regarding vacant bedsitters for next trimester.',
    timestamp: 'Yesterday',
    isRead: true,
    type: 'housing',
    actionUrl: '/housing/house-1',
    actionText: 'Open Listing',
  },
];

export const INSTITUTIONAL_NOTICES: InstitutionalNotice[] = [
  {
    id: 'notice-1',
    title: 'Trimester 1 Mid-Term Examination Timetable & Hall Regulations',
    issuedBy: 'Dr. J. K. Murgor',
    department: 'Office of the University Registrar',
    date: '2026-11-06',
    isUrgent: true,
    summary: 'All candidates must produce their validated Baraton Student ID and official fee clearance card before admission into exam venues.',
    fullBody: 'The Directorate of Academic Affairs announces that Mid-Term Continuous Assessment Examinations will commence on Monday. Candidates are strictly reminded that no electronic devices other than approved silent non-programmable scientific calculators are permitted in exam halls.',
  },
  {
    id: 'notice-2',
    title: 'University Week of Spiritual Emphasis: Evening Plenaries',
    issuedBy: 'Pastor Jonathan Bett',
    department: 'Directorate of Chaplaincy Services',
    date: '2026-11-04',
    isUrgent: false,
    summary: 'Join us every evening at 06:30 PM at the Baraton University Church Sanctuary for our annual spiritual revival series.',
    fullBody: 'Theme: "Empowered for Higher Service". Visiting evangelist Dr. David Mwangi will minister nightly. Faculty, staff, and students are warmly invited.',
  },
  {
    id: 'notice-3',
    title: 'Baraton Health Clinic Vaccination & Annual Medical Check-Up Notice',
    issuedBy: 'Dr. Grace Kemboi',
    department: 'University Health Services',
    date: '2026-11-02',
    isUrgent: false,
    summary: 'Free preventative screenings and booster immunizations available for registered students Monday through Thursday.',
    fullBody: 'Health Sciences and Nursing students undergoing clinical hospital placements are reminded that current hepatitis B immunizations and chest screening records must be validated before hospital rotations.',
  },
];
