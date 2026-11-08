/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * UEAB Lost & Found Mock Data
 * Camera-first reporting, secret verification quiz, handover desk routing, and match algorithms.
 */

import studentIdPhoto from '../assets/images/pastedimage.png';
import calculatorPhoto from '../assets/images/calc.png';
import lenovoChargerPhoto from '../assets/images/Lenovocharger.png';
import scientificPhoto from '../assets/images/scientific.jpg';

export interface LostFoundItem {
  id: string;
  type: 'lost' | 'found';
  title: string;
  category: 'Electronics' | 'Documents & IDs' | 'Keys' | 'Clothing & Bags' | 'Books & Stationery' | 'Other';
  locationFoundOrLost: string;
  venueCode?: string;
  dateReported: string; // ISO date
  photoUrl: string;
  reporterName: string;
  reporterRole: string;
  status: 'unclaimed' | 'match_suggested' | 'handed_over' | 'resolved';
  handoverDesk: string;
  hasSecretQuiz: boolean;
  secretVerificationQuestion: string;
  secretVerificationAnswerSnippet?: string; // used for demo verification check
  matchSuggestion?: {
    matchedItemId: string;
    matchedTitle: string;
    similarityPercent: number; // e.g. 94%
    matchedReporter: string;
  };
  description: string;
}

export const LOST_FOUND_ITEMS: LostFoundItem[] = [
  {
    id: 'lf-1',
    type: 'found',
    title: 'Silver HP Scientific Calculator (HP 300s+)',
    category: 'Electronics',
    locationFoundOrLost: 'Science Complex Auditorium (SCA-101), Row 4 under seat 18',
    venueCode: 'SCA-101',
    dateReported: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    photoUrl: calculatorPhoto,
    reporterName: 'Emmanuel Kiprono',
    reporterRole: 'Student, Mathematics',
    status: 'match_suggested',
    handoverDesk: 'Main Campus Security Post (Gate 1)',
    hasSecretQuiz: true,
    secretVerificationQuestion: 'What initials or tape marker is placed on the slide-on plastic case?',
    secretVerificationAnswerSnippet: 'blue tape with initials BC',
    matchSuggestion: {
      matchedItemId: 'lf-lost-1',
      matchedTitle: 'Lost HP Calculator during Linear Algebra lecture',
      similarityPercent: 94,
      matchedReporter: 'Becky Cherop (You)',
    },
    description: 'Found right after Dr. Wafula’s MATH 201 class. Calculator is in working condition with protective cover.',
  },
  {
    id: 'lf-2',
    type: 'found',
    title: 'UEAB Official Student ID Card (School of Business)',
    category: 'Documents & IDs',
    locationFoundOrLost: 'Library Learning Commons East, 2nd Floor Study Carrel',
    venueCode: 'CLB-204',
    dateReported: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    photoUrl: studentIdPhoto,
    reporterName: 'Faith Chelagat',
    reporterRole: 'Library Student Assistant',
    status: 'unclaimed',
    handoverDesk: 'Library Circulation Issue Desk (Ground Floor)',
    hasSecretQuiz: true,
    secretVerificationQuestion: 'What is the full student admission number printed on the back barcode?',
    description: 'Left on the study desk beside the reference journals. Deposited at the circulation desk for safe custody.',
  },
  {
    id: 'lf-3',
    type: 'lost',
    title: 'Mans Search for Meaning by Viktor Frankl',
    category: 'Books & Stationery',
    locationFoundOrLost: 'Between Student Centre Cafeteria Veranda and University Church',
    venueCode: 'SC-MPH',
    dateReported: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    photoUrl: scientificPhoto,
    reporterName: 'Dennis Kimutai',
    reporterRole: 'Student, Technology',
    status: 'unclaimed',
    handoverDesk: 'Campus Guild Welfare Office',
    hasSecretQuiz: true,
    secretVerificationQuestion: 'How many brass keys are attached, and what miniature bottle opener or charm is on the ring?',
    description: 'Lost yesterday afternoon. Has 3 yale door keys and a small metallic Kenyan flag emblem tag.',
  },
  {
    id: 'lf-4',
    type: 'found',
    title: 'Black Lenovo 65W USB-C Laptop Charger Adapter',
    category: 'Electronics',
    locationFoundOrLost: 'Main Computing Lab B (CLB-204), Terminal 22',
    venueCode: 'CLB-204',
    dateReported: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    photoUrl: lenovoChargerPhoto,
    reporterName: 'Lab Attendant Wesley',
    reporterRole: 'ICT Staff',
    status: 'handed_over',
    handoverDesk: 'ICT Lab Helpdesk (Library 2nd Floor)',
    hasSecretQuiz: true,
    secretVerificationQuestion: 'Is there any colored sticker or label on the three-pin plug head?',
    description: 'Found plugged into wall socket under terminal 22 after evening practical session.',
  },
];
