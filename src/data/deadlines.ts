/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * UEAB Academic Deadlines & Task Tracking Mock Data
 * Color tokens:
 * - Urgent (Red #DC2626): <= 2 days
 * - Soon (Amber #F59E0B): <= 5 days
 * - Done (Green #16A34A): completed
 * - Normal (Muted #5B6475 / Slate): > 5 days
 */

export interface AcademicDeadline {
  id: string;
  title: string;
  unitCode: string;
  unitName: string;
  dueDate: string; // ISO date string
  dueTime: string;
  submissionType: 'LMS Upload' | 'Physical Submission' | 'Class Presentation' | 'Exam Hall' | 'Finance Office';
  venueCode?: string;
  weightPercent: number;
  description: string;
  isCompleted: boolean;
  category: 'assignment' | 'cat' | 'project' | 'administrative';
}

export const DEADLINES: AcademicDeadline[] = [
  {
    id: 'dl-1',
    title: 'Lexical Analyzer & Syntax Tree Parser (Lab 2)',
    unitCode: 'COSC 311',
    unitName: 'Compiler Design',
    dueDate: new Date(Date.now() + 1.5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dueTime: '11:59 PM',
    submissionType: 'LMS Upload',
    weightPercent: 15,
    description: 'Implement a scanner in C++ or Python that accepts arithmetic tokens and reports lexical error line numbers.',
    isCompleted: false,
    category: 'assignment',
  },
  {
    id: 'dl-2',
    title: 'Continuous Assessment Test 1 (CAT 1)',
    unitCode: 'MATH 201',
    unitName: 'Linear Algebra',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dueTime: '11:00 AM',
    submissionType: 'Exam Hall',
    venueCode: 'SCA-101',
    weightPercent: 20,
    description: 'Closed-book test covering Gaussian elimination, matrix rank, determinants, and vector eigenvalues.',
    isCompleted: false,
    category: 'cat',
  },
  {
    id: 'dl-3',
    title: 'Trimester 1 Fee Clearance Instalment 2 (75% Minimum)',
    unitCode: 'FIN-UEAB',
    unitName: 'University Finance Directorate',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dueTime: '04:30 PM',
    submissionType: 'Finance Office',
    venueCode: 'AMPHI-01',
    weightPercent: 0,
    description: 'Mandatory finance clearance stamp required to sit continuous assessment exams next week.',
    isCompleted: false,
    category: 'administrative',
  },
  {
    id: 'dl-4',
    title: 'Microservices Architecture Diagram & Dockerfile',
    unitCode: 'COSC 420',
    unitName: 'Software Architecture',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dueTime: '11:59 PM',
    submissionType: 'LMS Upload',
    weightPercent: 25,
    description: 'Submit GitHub repository link with multi-container compose file and architectural trade-off document.',
    isCompleted: false,
    category: 'project',
  },
  {
    id: 'dl-5',
    title: 'Relational Schema Normalization & BCNF Proofs',
    unitCode: 'COSC 330',
    unitName: 'Advanced Databases',
    dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dueTime: '05:00 PM',
    submissionType: 'Physical Submission',
    venueCode: 'CLB-204',
    weightPercent: 10,
    description: 'Hand in bound assignment with functional dependency sets and proof of lossless decomposition.',
    isCompleted: false,
    category: 'assignment',
  },
  {
    id: 'dl-6',
    title: 'Ethics Term Essay: AI Autonomy and Moral Agency',
    unitCode: 'RELT 220',
    unitName: 'Christian Ethics',
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dueTime: '11:59 PM',
    submissionType: 'LMS Upload',
    weightPercent: 15,
    description: 'A 2,500-word scholarly essay examining autonomous weapon systems from a biblical ethics worldview.',
    isCompleted: true,
    category: 'assignment',
  },
];

export function getDeadlineUrgency(dueDate: string, isCompleted: boolean): {
  status: 'done' | 'urgent' | 'soon' | 'upcoming';
  label: string;
  colorClass: string;
  badgeBg: string;
} {
  if (isCompleted) {
    return {
      status: 'done',
      label: 'Completed',
      colorClass: 'text-[#16A34A]',
      badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    };
  }

  const due = new Date(dueDate).getTime();
  const now = new Date().getTime();
  const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

  if (diffDays <= 2) {
    return {
      status: 'urgent',
      label: diffDays <= 0 ? 'Due Today' : `${diffDays}d Left - Urgent`,
      colorClass: 'text-[#DC2626]',
      badgeBg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    };
  }

  if (diffDays <= 5) {
    return {
      status: 'soon',
      label: `${diffDays} days left`,
      colorClass: 'text-[#F59E0B]',
      badgeBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    };
  }

  return {
    status: 'upcoming',
    label: `${diffDays} days away`,
    colorClass: 'text-[#5B6475]',
    badgeBg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  };
}
