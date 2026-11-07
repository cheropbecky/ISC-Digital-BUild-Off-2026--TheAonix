/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Unified Global Search Service
 * Grouped results across Venues, Houses, Events, Units, Documents, Clubs, People (Alumni), and Lost Items.
 */

import { VENUES } from '../data/venues';
import { HOUSES } from '../data/houses';
import { CAMPUS_EVENTS, STUDENT_CLUBS, ALUMNI } from '../data/community';
import { TIMETABLE_ENTRIES } from '../data/timetable';
import { SHARE_DOCUMENTS } from '../data/share';
import { LOST_FOUND_ITEMS } from '../data/lostFound';

export interface SearchResultItem {
  id: string;
  category: 'Venues' | 'Houses' | 'Events' | 'Units' | 'Documents' | 'Clubs' | 'People' | 'Lost items';
  title: string;
  subtitle: string;
  thumbnailUrl?: string;
  targetUrl: string;
  badge?: string;
}

export interface GroupedSearchResults {
  venues: SearchResultItem[];
  houses: SearchResultItem[];
  events: SearchResultItem[];
  units: SearchResultItem[];
  documents: SearchResultItem[];
  clubs: SearchResultItem[];
  people: SearchResultItem[];
  lostItems: SearchResultItem[];
  totalCount: number;
}

export const searchService = {
  searchAll(rawQuery: string): GroupedSearchResults {
    const q = rawQuery.toLowerCase().trim();
    if (!q) {
      return {
        venues: [],
        houses: [],
        events: [],
        units: [],
        documents: [],
        clubs: [],
        people: [],
        lostItems: [],
        totalCount: 0,
      };
    }

    // 1. Venues
    const venues: SearchResultItem[] = VENUES.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.code.toLowerCase().includes(q) ||
        v.building.toLowerCase().includes(q)
    ).map((v) => ({
      id: v.id,
      category: 'Venues',
      title: `${v.name} (${v.code})`,
      subtitle: `${v.building} • Floor ${v.floor}`,
      thumbnailUrl: v.photos.exterior,
      targetUrl: `/campus/map?venue=${v.id}`,
      badge: `${v.capacity} seats`,
    }));

    // 2. Houses
    const houses: SearchResultItem[] = HOUSES.filter(
      (h) =>
        h.title.toLowerCase().includes(q) ||
        h.area.toLowerCase().includes(q) ||
        h.type.toLowerCase().includes(q)
    ).map((h) => ({
      id: h.id,
      category: 'Houses',
      title: h.title,
      subtitle: `${h.area} • KES ${h.priceMonthlyKes.toLocaleString()}/mo • ${h.walkingMinutes} min walk`,
      thumbnailUrl: h.photos[0],
      targetUrl: `/housing/${h.id}`,
      badge: h.type.replace('_', ' '),
    }));

    // 3. Events
    const events: SearchResultItem[] = CAMPUS_EVENTS.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.venueName.toLowerCase().includes(q)
    ).map((e) => ({
      id: e.id,
      category: 'Events',
      title: e.title,
      subtitle: `${e.date} • ${e.venueName}`,
      thumbnailUrl: e.bannerPhoto,
      targetUrl: `/community/events`,
      badge: e.category,
    }));

    // 4. Units
    const unitMap = new Map<string, SearchResultItem>();
    TIMETABLE_ENTRIES.forEach((u) => {
      if (
        (u.unitCode.toLowerCase().includes(q) || u.unitName.toLowerCase().includes(q)) &&
        !unitMap.has(u.unitCode)
      ) {
        unitMap.set(u.unitCode, {
          id: u.unitCode,
          category: 'Units',
          title: `${u.unitCode}: ${u.unitName}`,
          subtitle: `Lecturer: ${u.lecturer} • ${u.venueCode}`,
          targetUrl: `/campus/timetable`,
          badge: u.type,
        });
      }
    });
    const units = Array.from(unitMap.values());

    // 5. Documents
    const documents: SearchResultItem[] = SHARE_DOCUMENTS.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.unitCode.toLowerCase().includes(q) ||
        d.unitName.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q))
    ).map((d) => ({
      id: d.id,
      category: 'Documents',
      title: d.title,
      subtitle: `${d.unitCode} • by ${d.uploaderName} • ${d.fileType} (${d.fileSizeMb} MB)`,
      targetUrl: `/share`,
      badge: `★ ${d.rating}`,
    }));

    // 6. Clubs
    const clubs: SearchResultItem[] = STUDENT_CLUBS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    ).map((c) => ({
      id: c.id,
      category: 'Clubs',
      title: c.name,
      subtitle: `${c.category} • ${c.membersCount} members • Meets ${c.meetingDay}`,
      targetUrl: `/community/clubs`,
      badge: c.category,
    }));

    // 7. People (Alumni)
    const people: SearchResultItem[] = ALUMNI.filter(
      (a) =>
        a.fullName.toLowerCase().includes(q) ||
        a.company.toLowerCase().includes(q) ||
        a.currentRole.toLowerCase().includes(q) ||
        a.skills.some((s) => s.toLowerCase().includes(q))
    ).map((a) => ({
      id: a.id,
      category: 'People',
      title: a.fullName,
      subtitle: `${a.currentRole} at ${a.company} (Class of '${a.gradYear.toString().slice(-2)})`,
      targetUrl: `/community/alumni`,
      badge: 'Alumnus',
    }));

    // 8. Lost items
    const lostItems: SearchResultItem[] = LOST_FOUND_ITEMS.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.locationFoundOrLost.toLowerCase().includes(q)
    ).map((i) => ({
      id: i.id,
      category: 'Lost items',
      title: i.title,
      subtitle: `${i.type.toUpperCase()} • ${i.locationFoundOrLost}`,
      thumbnailUrl: i.photoUrl,
      targetUrl: `/found`,
      badge: i.type,
    }));

    const totalCount =
      venues.length +
      houses.length +
      events.length +
      units.length +
      documents.length +
      clubs.length +
      people.length +
      lostItems.length;

    return {
      venues,
      houses,
      events,
      units,
      documents,
      clubs,
      people,
      lostItems,
      totalCount,
    };
  },
};
