import { IMAGES } from './images';

export const UEAB_SCHOOLS = [
  'School of Business, Economics and Development Studies',
  'School of Education and Social Sciences',
  'School of Nursing, Health and Allied Sciences',
  'School of Science and Technology',
  'School of Theology and Pastoral Studies',
] as const;

export type UeabSchool = (typeof UEAB_SCHOOLS)[number];
export type EventCategory = 'academic' | 'chapel' | 'sports' | 'social' | 'career';
export type CommunityCategory = 'Clubs' | 'Opportunities';
export type EventStatus = 'upcoming' | 'ongoing' | 'past';

export interface CommunityEvent {
  id: string;
  title: string;
  category: EventCategory;
  school: UeabSchool;
  description: string;
  details: string;
  start: string;
  end: string;
  venue: string;
  venueId?: string;
  posterUrl: string;
  imageAlt: string;
  capacity: number;
  rsvps: number;
}

export interface CommunityItem {
  id: string;
  title: string;
  category: CommunityCategory;
  school: UeabSchool;
  description: string;
  details: string;
  meta: string;
  actionLabel: string;
  imageUrl: string;
  imageAlt: string;
  href?: string;
}

const imageFor = {
  academic: [IMAGES.baratonResearchConference.url, IMAGES.baratonAuditorium.url],
  chapel: [IMAGES.baratonAuditorium.url, IMAGES.studentLifeQuad.url],
  sports: [IMAGES.baratonRoadRace.url, IMAGES.studentLifeQuad.url],
  social: [IMAGES.studentLifeQuad.url, IMAGES.baratonAuditorium.url],
  career: [IMAGES.baratonAuditorium.url, IMAGES.baratonResearchConference.url],
} as const;

const imageAltFor: Record<EventCategory, string> = {
  academic: 'Official UEAB Baraton research and academic gathering',
  chapel: 'Official UEAB Baraton graduation and campus gathering',
  sports: 'Official Baraton Road Race and campus sports event',
  social: 'Official UEAB Baraton student community gathering',
  career: 'Official UEAB Baraton professional and university event',
};

const eventDate = (offsetDays: number, ongoing = false) => {
  const start = new Date();
  start.setDate(start.getDate() + offsetDays);
  if (ongoing) {
    start.setHours(start.getHours() - 1);
  } else {
    start.setHours(10, 0, 0, 0);
  }
  const end = new Date(start);
  end.setHours(end.getHours() + (ongoing ? 3 : 2));
  return { start: start.toISOString(), end: end.toISOString() };
};

const eventSeeds: Array<[EventCategory, UeabSchool, string, string, string, string]> = [
  ['academic', UEAB_SCHOOLS[3], 'Baraton AgTech Innovation Hackathon', 'Build practical tools for farmers and communities in Nandi County.', 'Science Complex Auditorium', 'venue-auditorium'],
  ['academic', UEAB_SCHOOLS[1], 'Teaching Innovation Showcase', 'Share classroom research and practical approaches for inclusive education.', 'Administration Amphitheatre', 'venue-amphitheater'],
  ['academic', UEAB_SCHOOLS[2], 'Health Sciences Research Forum', 'Present student research on community health and rural care.', 'Research and Community Center', 'venue-research-community'],
  ['academic', UEAB_SCHOOLS[0], 'Business Case Competition', 'Teams solve a live enterprise challenge from a Nandi County business.', 'Student Center', 'venue-student-center'],
  ['chapel', UEAB_SCHOOLS[4], 'Friday Sunset Vespers', 'Weekly worship and fellowship with the Baraton University Choir.', 'Baraton University Church', 'venue-church'],
  ['chapel', UEAB_SCHOOLS[4], 'Sabbath Youth Fellowship', 'Small-group worship, music, and service planning for students.', 'Baraton University Church', 'venue-church'],
  ['chapel', UEAB_SCHOOLS[4], 'Faith and Service Convocation', 'A campus-wide reflection on service, leadership, and faith.', 'Auditorium', 'venue-auditorium'],
  ['chapel', UEAB_SCHOOLS[4], 'International Prayer Gathering', 'A multilingual evening of prayer and community fellowship.', 'University Church', 'venue-church'],
  ['sports', UEAB_SCHOOLS[3], 'Inter-Faculty Basketball Derby', 'Support the Baraton faculties in the trimester championship.', 'UEAB Sports Grounds', 'venue-soccer-field'],
  ['sports', UEAB_SCHOOLS[1], 'Baraton Road Race and Fun Run', 'Join students and staff for the annual campus road race.', 'Main Sports Field', 'venue-soccer-field'],
  ['sports', UEAB_SCHOOLS[0], 'Faculty Volleyball Tournament', 'A friendly inter-school tournament for students and staff.', 'Outdoor Sports Courts', 'venue-basketball'],
  ['sports', UEAB_SCHOOLS[2], 'Wellness Walk and Fitness Day', 'A guided campus walk promoting healthy student routines.', 'Main Sports Field', 'venue-soccer-field'],
  ['social', UEAB_SCHOOLS[1], 'Baraton Student Welcome Social', 'Meet new classmates and student leaders at the start of term.', 'Student Center', 'venue-student-center'],
  ['social', UEAB_SCHOOLS[3], 'Culture and Innovation Fair', 'Celebrate student creativity, food, music, and practical inventions.', 'Community Centre', 'venue-community-centre'],
  ['social', UEAB_SCHOOLS[0], 'Student Guild Open Mic', 'An evening of poetry, music, storytelling, and stand-up.', 'Auditorium', 'venue-auditorium'],
  ['social', UEAB_SCHOOLS[4], 'Baraton Community Service Day', 'Students volunteer with local community partners around campus.', 'Community Centre', 'venue-community-centre'],
  ['career', UEAB_SCHOOLS[2], 'Nandi Tech and Health Sciences Career Summit', 'Meet employers offering attachments, internships, and graduate roles.', 'Student Centre Multipurpose Hall', 'venue-student-center'],
  ['career', UEAB_SCHOOLS[3], 'Software Engineering Portfolio Clinic', 'Get practical feedback on GitHub portfolios and technical CVs.', 'Science Complex', 'venue-science'],
  ['career', UEAB_SCHOOLS[0], 'Entrepreneurship and Enterprise Forum', 'Learn how Baraton graduates turn ideas into sustainable ventures.', 'Administration Block', 'venue-admin'],
  ['career', UEAB_SCHOOLS[1], 'Education Careers and Placement Day', 'Connect with schools and organizations recruiting education graduates.', 'Research and Community Center', 'venue-research-community'],
];

export const COMMUNITY_EVENTS: CommunityEvent[] = eventSeeds.map(([category, school, title, description, venue, venueId], index) => {
  const dates = eventDate(index % 4 === 0 ? -3 : index % 4 === 1 ? 0 : index % 4 === 2 ? 3 : 8, index % 4 === 1);
  return {
    id: `community-event-${index + 1}`,
    title,
    category,
    school,
    description,
    details: `${description} This ${category} programme is hosted at ${venue} and is designed to help Baraton students connect, learn, and take part.`,
    ...dates,
    venue,
    venueId,
    posterUrl: imageFor[category][index % 2],
    imageAlt: imageAltFor[category],
    capacity: 150 + index * 35,
    rsvps: 45 + index * 12,
  };
});

const communitySeeds: Array<[CommunityCategory, UeabSchool, string, string, string, string, string]> = [
  ['Clubs', UEAB_SCHOOLS[3], 'Google Developer Student Club UEAB', 'Peer developers working on cloud, web, mobile, and open-source projects.', '240 members · Thursdays at 5:00 PM', 'Join club', '/community/clubs'],
  ['Clubs', UEAB_SCHOOLS[0], 'Baraton Innovators and Entrepreneurs Forum', 'Student founders preparing pitches and building sustainable ventures.', '115 members · Tuesdays at 4:30 PM', 'Join club', '/community/clubs'],
  ['Clubs', UEAB_SCHOOLS[4], 'Adventist Youth Society Baraton', 'Faith, outreach, music ministry, and student fellowship.', '410 members · Sabbath at 3:00 PM', 'Join club', '/community/clubs'],
  ['Clubs', UEAB_SCHOOLS[1], 'UEAB Creative Arts Society', 'A home for poetry, theatre, visual arts, and cultural expression.', '85 members · Mondays at 5:30 PM', 'Join club', '/community/clubs'],
  ['Opportunities', UEAB_SCHOOLS[3], 'Cloud Infrastructure and DevOps Internship', 'Attachment opportunity with hands-on Linux, Docker, and Kubernetes work.', 'Safaricom PLC · Apply by 30 Nov 2026', 'View opportunity', '/community/opportunities'],
  ['Opportunities', UEAB_SCHOOLS[2], 'Community Health Research Attachment', 'Support field research, data collection, and rural health reporting.', 'UEAB Health Centre · Apply by 5 Dec 2026', 'View opportunity', '/community/opportunities'],
  ['Opportunities', UEAB_SCHOOLS[0], 'Graduate Business Analyst Trainee', 'Join a structured graduate program in operations and product analysis.', 'Equity Group · Apply by 15 Dec 2026', 'View opportunity', '/community/opportunities'],
  ['Opportunities', UEAB_SCHOOLS[1], 'Education Technology Internship', 'Help schools improve digital learning and teacher support programs.', 'Nandi County · Apply by 20 Dec 2026', 'View opportunity', '/community/opportunities'],
];

export const COMMUNITY_ITEMS: CommunityItem[] = communitySeeds.map(([category, school, title, description, meta, actionLabel, href], index) => ({
  id: `community-item-${index + 1}`,
  title,
  category,
  school,
  description,
  details: `${description} Explore this ${category.toLowerCase()} opportunity through the UEAB Baraton community hub and connect with students and campus partners in the same field.`,
  meta,
  actionLabel,
  href,
  imageUrl: category === 'Clubs'
    ? [IMAGES.studentLifeQuad.url, IMAGES.baratonAuditorium.url, IMAGES.baratonResearchConference.url, IMAGES.studentLifeQuad.url][index % 4]
    : IMAGES.baratonAuditorium.url,
  imageAlt: `${category} at University of Eastern Africa, Baraton`,
}));

export function getEventStatus(event: CommunityEvent, now = new Date()): EventStatus {
  const start = new Date(event.start);
  const end = new Date(event.end);
  if (now < start) return 'upcoming';
  if (now <= end) return 'ongoing';
  return 'past';
}
