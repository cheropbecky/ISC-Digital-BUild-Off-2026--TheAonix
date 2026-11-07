/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * UEAB Share Hub Mock Data: Peer Notes, Past Papers, and Collaborative Study Groups
 */

export interface ShareDocument {
  id: string;
  title: string;
  unitCode: string;
  unitName: string;
  faculty: string;
  fileType: 'PDF' | 'DOCX' | 'ZIP' | 'PPTX';
  fileSizeMb: number;
  uploaderName: string;
  uploaderRole: string;
  uploadDate: string;
  downloadsCount: number;
  upvotesCount: number;
  rating: number; // e.g. 4.9
  isVerifiedByRep: boolean;
  repName?: string;
  tags: string[];
  description: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  unitCode: string;
  unitName: string;
  facilitatorName: string;
  membersCount: number;
  maxMembers: number;
  meetingSchedule: string; // e.g., "Wednesdays 04:00 PM - 06:00 PM"
  preferredVenueName: string;
  preferredVenueCode: string;
  topicsCovered: string[];
  isJoined?: boolean;
}

export const SHARE_DOCUMENTS: ShareDocument[] = [
  {
    id: 'doc-1',
    title: 'Complete Compiler Design Lecture Summaries & LL(1) Parsing Tables',
    unitCode: 'COSC 311',
    unitName: 'Compiler Design',
    faculty: 'Science & Technology',
    fileType: 'PDF',
    fileSizeMb: 4.8,
    uploaderName: 'Kevin Kibet',
    uploaderRole: 'Class Rep, Year 3 SENG',
    uploadDate: '2 days ago',
    downloadsCount: 142,
    upvotesCount: 88,
    rating: 4.9,
    isVerifiedByRep: true,
    repName: 'Kevin Kibet (Verified Class Rep)',
    tags: ['Compilers', 'Automata', 'LL1 Parser', 'Past Exams'],
    description: 'Synthesized lecture notes from Dr. Kiprop with annotated diagrams, LR(0) state machines, and worked solutions for previous 3 trimester CATs.',
  },
  {
    id: 'doc-2',
    title: 'Linear Algebra Final Exam Past Papers (2022-2025) with Step-by-Step Proofs',
    unitCode: 'MATH 201',
    unitName: 'Linear Algebra',
    faculty: 'Science & Technology',
    fileType: 'PDF',
    fileSizeMb: 6.2,
    uploaderName: 'Mercy Jebet',
    uploaderRole: 'Student, Mathematics Dept',
    uploadDate: '1 week ago',
    downloadsCount: 310,
    upvotesCount: 174,
    rating: 5.0,
    isVerifiedByRep: true,
    repName: 'Dr. Benson Wafula Endorsed',
    tags: ['Past Papers', 'Eigenvalues', 'Diagonalization', 'Vector Spaces'],
    description: 'Comprehensive solutions verified by peer tutors. Includes typical mistakes in matrix inversion and determinants.',
  },
  {
    id: 'doc-3',
    title: 'Distributed Systems & Microservices Architecture Design Patterns',
    unitCode: 'COSC 420',
    unitName: 'Software Architecture',
    faculty: 'Science & Technology',
    fileType: 'PDF',
    fileSizeMb: 3.5,
    uploaderName: 'Brian Sang',
    uploaderRole: 'Student, Year 4 SE',
    uploadDate: '3 days ago',
    downloadsCount: 95,
    upvotesCount: 42,
    rating: 4.7,
    isVerifiedByRep: false,
    tags: ['Cloud', 'Docker', 'Event-Driven', 'Kubernetes'],
    description: 'Clean architectural summaries with diagrams of Saga pattern, CQRS, and service mesh deployment.',
  },
  {
    id: 'doc-4',
    title: 'Relational Database SQL Tuning & Query Optimization Cheat Sheet',
    unitCode: 'COSC 330',
    unitName: 'Advanced Databases',
    faculty: 'Science & Technology',
    fileType: 'PDF',
    fileSizeMb: 1.8,
    uploaderName: 'Faith Chelagat',
    uploaderRole: 'Student, Year 3',
    uploadDate: '2 weeks ago',
    downloadsCount: 220,
    upvotesCount: 119,
    rating: 4.8,
    isVerifiedByRep: true,
    repName: 'Verified by Class Rep',
    tags: ['SQL', 'Indexes', 'PostgreSQL', 'Query Plans'],
    description: 'Practical guide to reading EXPLAIN ANALYZE trees and avoiding full table scans in PostgreSQL.',
  },
  {
    id: 'doc-5',
    title: 'Digital Logic Gate Simplification & Karnaugh Maps Handbook',
    unitCode: 'ENGR 210',
    unitName: 'Digital Logic',
    faculty: 'Science & Technology',
    fileType: 'PDF',
    fileSizeMb: 5.1,
    uploaderName: 'Dan Kimutai',
    uploaderRole: 'Student, Electrical Eng',
    uploadDate: '5 days ago',
    downloadsCount: 165,
    upvotesCount: 78,
    rating: 4.6,
    isVerifiedByRep: true,
    repName: 'Dan Kimutai (Rep)',
    tags: ['K-Maps', 'Multiplexers', 'Flip-Flops'],
    description: 'High-resolution handwritten sheets showing 4-variable and 5-variable K-map groupings.',
  },
  {
    id: 'doc-6',
    title: 'Christian Ethics & Modern Bioethics Reader (Trimester 1 2026)',
    unitCode: 'RELT 220',
    unitName: 'Christian Ethics',
    faculty: 'Theology & Religious Studies',
    fileType: 'DOCX',
    fileSizeMb: 2.3,
    uploaderName: 'Pr. Nathan Koech',
    uploaderRole: 'Department Assistant',
    uploadDate: '3 weeks ago',
    downloadsCount: 480,
    upvotesCount: 245,
    rating: 4.9,
    isVerifiedByRep: true,
    repName: 'Departmental Official',
    tags: ['Theology', 'Ethics', 'Core Curriculum'],
    description: 'Official core readings for all 2nd and 3rd year students sitting the university common course examination.',
  },
];

export const STUDY_GROUPS: StudyGroup[] = [
  {
    id: 'grp-1',
    name: 'Baraton Compiler Crafters',
    unitCode: 'COSC 311',
    unitName: 'Compiler Design',
    facilitatorName: 'Becky Cherop',
    membersCount: 7,
    maxMembers: 10,
    meetingSchedule: 'Wednesdays 04:00 PM - 06:00 PM',
    preferredVenueName: 'Main Computing Lab B',
    preferredVenueCode: 'CLB-204',
    topicsCovered: ['AST Construction', 'Bottom-Up Parsing', 'Type Checking'],
    isJoined: true,
  },
  {
    id: 'grp-2',
    name: 'Vector & Matrix Masterclass',
    unitCode: 'MATH 201',
    unitName: 'Linear Algebra',
    facilitatorName: 'Geoffrey Lagat',
    membersCount: 12,
    maxMembers: 15,
    meetingSchedule: 'Mondays 02:00 PM - 04:00 PM',
    preferredVenueName: 'Science Complex Auditorium',
    preferredVenueCode: 'SCA-101',
    topicsCovered: ['Gram-Schmidt Process', 'Eigen-decomposition', 'Orthogonal Matrices'],
    isJoined: false,
  },
  {
    id: 'grp-3',
    name: 'Cloud Architects Guild',
    unitCode: 'COSC 420',
    unitName: 'Software Architecture',
    facilitatorName: 'Collins Bett',
    membersCount: 8,
    maxMembers: 12,
    meetingSchedule: 'Thursdays 05:00 PM - 07:00 PM',
    preferredVenueName: 'Library Learning Commons East',
    preferredVenueCode: 'CLB-204',
    topicsCovered: ['Docker Compose', 'Kubernetes Pods', 'gRPC Contracts'],
    isJoined: false,
  },
  {
    id: 'grp-4',
    name: 'Ethics Debate & Case Study Circle',
    unitCode: 'RELT 220',
    unitName: 'Christian Ethics',
    facilitatorName: 'Ruth Jepchirchir',
    membersCount: 9,
    maxMembers: 14,
    meetingSchedule: 'Tuesdays 04:30 PM - 06:00 PM',
    preferredVenueName: 'Student Centre Multipurpose Hall',
    preferredVenueCode: 'SC-MPH',
    topicsCovered: ['Bioethics', 'Corporate Whistleblowing', 'Term Paper Review'],
    isJoined: false,
  },
];
