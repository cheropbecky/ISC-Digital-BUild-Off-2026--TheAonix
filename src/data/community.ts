/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * UEAB Community Mock Data: Events with QR passes, Student Clubs, Alumni Mentorship & Referral, and Opportunities
 */

export interface CampusEvent {
  id: string;
  title: string;
  category: 'Spiritual' | 'Academic' | 'Tech' | 'Sports' | 'Cultural';
  date: string;
  timeFormatted: string;
  venueName: string;
  venueCode: string;
  organizer: string;
  attendeesCount: number;
  maxCapacity?: number;
  isRsvp: boolean;
  ticketQrCode: string;
  bannerPhoto: string;
  description: string;
  speakers?: Array<{ name: string; title: string }>;
}

export interface StudentClub {
  id: string;
  name: string;
  category: 'Technology' | 'Professional' | 'Spiritual' | 'Arts' | 'Sports';
  description: string;
  membersCount: number;
  isMember: boolean;
  patron: string;
  president: string;
  meetingDay: string;
  meetingVenue: string;
  socialLink: string;
}

export interface AlumniProfile {
  id: string;
  fullName: string;
  gradYear: number;
  degree: string;
  currentRole: string;
  company: string;
  location: string;
  industry: string;
  avatarUrl: string;
  openToReferral: boolean;
  openToMentorship: boolean;
  bio: string;
  skills: string[];
  referralAcceptanceRate: number; // e.g. 92%
}

export interface CareerOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Industrial Attachment' | 'Paid Internship' | 'Graduate Trainee' | 'Part-time';
  deadline: string;
  stipendKes?: string;
  matchScorePercent: number;
  postedDate: string;
  requirements: string[];
  description: string;
  applicationLink: string;
}

export const CAMPUS_EVENTS: CampusEvent[] = [
  {
    id: 'evt-1',
    title: 'Friday Sunset Vespers: "Walking in Faith and Innovation"',
    category: 'Spiritual',
    date: '2026-11-13',
    timeFormatted: '05:30 PM - 07:30 PM',
    venueName: 'Baraton University Church Sanctuary',
    venueCode: 'UCH-01',
    organizer: 'University Chaplaincy & Baraton University Choir',
    attendeesCount: 420,
    maxCapacity: 900,
    isRsvp: true,
    ticketQrCode: 'UEAB-TICKET-VESPERS-2026-BC4921',
    bannerPhoto: '/src/assets/images/ueab_campus_hero_1793989895358.jpg',
    description: 'An uplifting university-wide Sabbath opening vespers service featuring inspirational testimony, student orchestral music, and guest sermon.',
    speakers: [{ name: 'Pr. Dr. Paul Lagat', title: 'Director of Chaplaincy Services' }],
  },
  {
    id: 'evt-2',
    title: 'GDSC Baraton Annual Hackathon 2026: AI for Rift Agriculture',
    category: 'Tech',
    date: '2026-11-20',
    timeFormatted: '08:00 AM - 06:00 PM',
    venueName: 'Science Complex Auditorium',
    venueCode: 'SCA-101',
    organizer: 'Google Developer Student Club (GDSC) UEAB',
    attendeesCount: 135,
    maxCapacity: 150,
    isRsvp: false,
    ticketQrCode: 'UEAB-TICKET-HACKATHON-2026-BC4921',
    bannerPhoto: '/src/assets/images/ueab_science_complex_1793989896519.jpg',
    description: 'Build predictive crop diagnostics, livestock health monitors, and farmer cooperative marketplaces using Google Gemini and modern web stacks. Cash prizes and mentor sponsorships.',
    speakers: [
      { name: 'Dr. Evans Kiprop', title: 'Head of Computing' },
      { name: 'Sylvia Chepkemoi', title: 'Senior Software Engineer, Safaricom' },
    ],
  },
  {
    id: 'evt-3',
    title: 'Baraton Inter-Faculty Football & Basketball Derby',
    category: 'Sports',
    date: '2026-11-15',
    timeFormatted: '02:00 PM - 06:00 PM',
    venueName: 'Baraton Gymnasium & Athletic Pavilion',
    venueCode: 'GYM-01',
    organizer: 'UEAB Sports Council',
    attendeesCount: 280,
    isRsvp: false,
    ticketQrCode: 'UEAB-TICKET-DERBY-2026-BC4921',
    bannerPhoto: '/src/assets/images/ueab_student_life_1793989896360.jpg',
    description: 'Cheer on Faculty of Science & Tech vs School of Business in the 2026 Trimester Finals. Free entry for all students with student ID.',
  },
  {
    id: 'evt-4',
    title: 'Health Sciences Symposium: Telemedicine in Western Kenya',
    category: 'Academic',
    date: '2026-11-25',
    timeFormatted: '10:00 AM - 01:00 PM',
    venueName: 'Administration Amphitheatre',
    venueCode: 'AMPHI-01',
    organizer: 'Baraton Nursing & Medical Sciences Guild',
    attendeesCount: 160,
    maxCapacity: 240,
    isRsvp: false,
    ticketQrCode: 'UEAB-TICKET-HEALTH-2026-BC4921',
    bannerPhoto: '/src/assets/images/ueab_library_hall_1793989894699.jpg',
    description: 'Exploring low-latency rural diagnostic tele-clinics across Nandi, Uasin Gishu, and Kakamega counties.',
  },
];

export const STUDENT_CLUBS: StudentClub[] = [
  {
    id: 'club-1',
    name: 'Google Developer Student Club (GDSC) UEAB',
    category: 'Technology',
    description: 'Community of peer developers passionate about cloud architecture, web platforms, open source, and mobile development.',
    membersCount: 240,
    isMember: true,
    patron: 'Dr. Evans Kiprop',
    president: 'Becky Cherop',
    meetingDay: 'Every Thursday 05:00 PM',
    meetingVenue: 'Main Computing Lab B (CLB-204)',
    socialLink: 'https://gdsc.community.dev/ueab',
  },
  {
    id: 'club-2',
    name: 'Adventist Youth Society (AYS) Baraton',
    category: 'Spiritual',
    description: 'Fostering Christian discipleship, community outreach in Baraton Village, and choral music ministry.',
    membersCount: 410,
    isMember: true,
    patron: 'Pastor Jonathan Bett',
    president: 'Emmanuel Kiprono',
    meetingDay: 'Every Sabbath 03:00 PM',
    meetingVenue: 'University Church Complex (UCH-01)',
    socialLink: 'https://facebook.com/aysueab',
  },
  {
    id: 'club-3',
    name: 'Baraton Innovators & Entrepreneurs Forum',
    category: 'Professional',
    description: 'Accelerating student-founded startups, seed pitch preparation, and commercialization of agricultural and healthcare tech.',
    membersCount: 115,
    isMember: false,
    patron: 'Prof. Samuel Njoroge',
    president: 'Victor Kiptoo',
    meetingDay: 'Alternate Tuesdays 04:30 PM',
    meetingVenue: 'Business Seminar Room 204 (BUS-204)',
    socialLink: 'https://linkedin.com/company/ueab-innovators',
  },
  {
    id: 'club-4',
    name: 'Baraton University Choir & Brass Ensemble',
    category: 'Arts',
    description: 'Award-winning university musical ensemble performing sacred classical anthems and traditional hymns.',
    membersCount: 85,
    isMember: false,
    patron: 'Dr. Sarah Rotich',
    president: 'Dorcas Chebet',
    meetingDay: 'Mon & Wed 05:30 PM',
    meetingVenue: 'Sanctuary Choir Loft (UCH-01)',
    socialLink: 'https://youtube.com/@ueabchoir',
  },
];

export const ALUMNI: AlumniProfile[] = [
  {
    id: 'alumni-1',
    fullName: 'Brian Kiprop',
    gradYear: 2022,
    degree: 'BSc Software Engineering',
    currentRole: 'Senior Cloud Backend Engineer',
    company: 'Safaricom PLC (M-PESA Africa)',
    location: 'Nairobi, Kenya',
    industry: 'Fintech & Cloud Systems',
    avatarUrl: '',
    openToReferral: true,
    openToMentorship: true,
    bio: 'Proud Baraton alumnus now architecting distributed payment pipelines handling 30k TPS across East Africa. Happy to review student resumes and refer strong SE juniors.',
    skills: ['Go', 'Kubernetes', 'Apache Kafka', 'Distributed Systems', 'AWS'],
    referralAcceptanceRate: 94,
  },
  {
    id: 'alumni-2',
    fullName: 'Sylvia Chepkemoi',
    gradYear: 2020,
    degree: 'BSc Computer Science',
    currentRole: 'Software Engineer II',
    company: 'Microsoft Africa Development Centre (ADC)',
    location: 'Nairobi, Kenya',
    industry: 'Developer Tools & Cloud',
    avatarUrl: '',
    openToReferral: true,
    openToMentorship: true,
    bio: 'Passionate about compilers and developer infrastructure. Baraton gave me the grit to compete globally. Actively mentoring Baraton female engineers in STEM.',
    skills: ['C#', 'TypeScript', 'Azure DevOps', 'System Design'],
    referralAcceptanceRate: 88,
  },
  {
    id: 'alumni-3',
    fullName: 'Edwin Koech',
    gradYear: 2021,
    degree: 'Bachelor of Business Administration',
    currentRole: 'Fintech Product Manager',
    company: 'Equity Group Holdings',
    location: 'Nairobi, Kenya',
    industry: 'Banking & Financial Inclusion',
    avatarUrl: '',
    openToReferral: true,
    openToMentorship: false,
    bio: 'Leading digital product squads scaling agency banking and merchant payment apps across Kenya and DRC.',
    skills: ['Agile Scrum', 'Product Strategy', 'Fintech Regulations', 'User Research'],
    referralAcceptanceRate: 90,
  },
  {
    id: 'alumni-4',
    fullName: 'Dr. Faith Jeruto',
    gradYear: 2019,
    degree: 'BSc Nursing Sciences',
    currentRole: 'Clinical Research Nurse & Epidemiologist',
    company: 'Johns Hopkins / AMPATH Kenya',
    location: 'Eldoret, Kenya',
    industry: 'Public Health & Clinical Research',
    avatarUrl: '',
    openToReferral: true,
    openToMentorship: true,
    bio: 'Coordinating multi-centre oncology trials across western Kenya hospitals. Happy to advise final-year nursing students on international licensing and research fellowships.',
    skills: ['Clinical Trials', 'GCP Compliance', 'Epidemiology', 'Healthcare Systems'],
    referralAcceptanceRate: 96,
  },
];

export const OPPORTUNITIES: CareerOpportunity[] = [
  {
    id: 'opp-1',
    title: 'Software Engineering Attachment (May - August 2026)',
    company: 'Safaricom PLC',
    location: 'Nairobi HQ / Hybrid',
    type: 'Industrial Attachment',
    deadline: '2026-12-05',
    stipendKes: 'KES 25,000 / month',
    matchScorePercent: 96,
    postedDate: 'Yesterday',
    requirements: [
      'Ongoing 3rd year degree in Software Engineering or Computer Science',
      'Familiarity with REST APIs, SQL, and Git version control',
      'Recommendation letter from Head of Department',
    ],
    description: 'Join the M-PESA engineering squads building next-generation digital financial solutions.',
    applicationLink: 'https://careers.safaricom.co.ke/internships',
  },
  {
    id: 'opp-2',
    title: 'Cloud & DevOps Intern',
    company: 'Microsoft ADC Kenya',
    location: 'Westlands, Nairobi',
    type: 'Paid Internship',
    deadline: '2026-11-30',
    stipendKes: 'Competitive Market Rate + Lunch',
    matchScorePercent: 91,
    postedDate: '3 days ago',
    requirements: [
      'Solid foundations in Data Structures and Algorithms',
      'Knowledge of Linux, containerization (Docker), or cloud fundamentals',
      'Strong collaborative problem-solving skills',
    ],
    description: 'Work directly alongside Microsoft engineers on foundational cloud platforms serving global enterprise users.',
    applicationLink: 'https://careers.microsoft.com',
  },
  {
    id: 'opp-3',
    title: 'Junior Database Administrator Trainee',
    company: 'KCB Bank Group',
    location: 'Eldoret Regional Hub',
    type: 'Industrial Attachment',
    deadline: '2026-12-15',
    stipendKes: 'KES 20,000 / month',
    matchScorePercent: 88,
    postedDate: '1 week ago',
    requirements: [
      'Experience in Oracle, PostgreSQL, or MS SQL Server',
      'Understanding of backup recovery and performance optimization',
      'Baraton student in good academic standing',
    ],
    description: 'Assist in database monitoring, failover drills, and branch reconciliation databases.',
    applicationLink: 'https://kcbgroup.com/careers',
  },
];
