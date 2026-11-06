/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Unified Search Engine
 * Groups results by Units, Venues, Documents, Events, Clubs, and Lost Items
 */

import { Unit, Venue, DocumentItem, CampusEvent, Club, LostFoundItem, AlumniProfile } from './types';

export interface SearchResultsGrouped {
  units: Unit[];
  venues: Venue[];
  documents: DocumentItem[];
  events: CampusEvent[];
  clubs: Club[];
  lostItems: LostFoundItem[];
  alumni: AlumniProfile[];
  totalMatches: number;
}

export function performGlobalSearch(
  query: string,
  data: {
    units: Unit[];
    venues: Venue[];
    documents: DocumentItem[];
    events: CampusEvent[];
    clubs: Club[];
    lostItems: LostFoundItem[];
    alumni: AlumniProfile[];
  }
): SearchResultsGrouped {
  const q = query.trim().toLowerCase();
  if (!q) {
    return {
      units: [],
      venues: [],
      documents: [],
      events: [],
      clubs: [],
      lostItems: [],
      alumni: [],
      totalMatches: 0,
    };
  }

  const units = data.units.filter(
    (u) =>
      u.code.toLowerCase().includes(q) ||
      u.name.toLowerCase().includes(q) ||
      u.lecturerName.toLowerCase().includes(q) ||
      u.department.toLowerCase().includes(q)
  );

  const venues = data.venues.filter(
    (v) =>
      v.name.toLowerCase().includes(q) ||
      v.code.toLowerCase().includes(q) ||
      v.building.toLowerCase().includes(q) ||
      v.indoorHints.toLowerCase().includes(q)
  );

  const documents = data.documents.filter(
    (d) =>
      d.title.toLowerCase().includes(q) ||
      d.unitCode.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.uploaderName.toLowerCase().includes(q)
  );

  const events = data.events.filter(
    (e) =>
      e.title.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.venueName.toLowerCase().includes(q) ||
      e.organizerName.toLowerCase().includes(q)
  );

  const clubs = data.clubs.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
  );

  const lostItems = data.lostItems.filter(
    (l) =>
      l.title.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q) ||
      l.locationFound.toLowerCase().includes(q) ||
      l.handoverPoint.toLowerCase().includes(q)
  );

  const alumni = data.alumni.filter(
    (a) =>
      a.name.toLowerCase().includes(q) ||
      a.currentCompany.toLowerCase().includes(q) ||
      a.currentRole.toLowerCase().includes(q) ||
      a.degree.toLowerCase().includes(q) ||
      a.industry.toLowerCase().includes(q)
  );

  const totalMatches =
    units.length +
    venues.length +
    documents.length +
    events.length +
    clubs.length +
    lostItems.length +
    alumni.length;

  return {
    units,
    venues,
    documents,
    events,
    clubs,
    lostItems,
    alumni,
    totalMatches,
  };
}
