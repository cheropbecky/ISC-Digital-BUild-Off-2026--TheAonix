/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Venue Service - Mock Data Access Layer with Simulated Latency
 */

import { VENUES, VenueData } from '../data/venues';

const LATENCY_MS = 80;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const venueService = {
  async getAllVenues(): Promise<VenueData[]> {
    await sleep(LATENCY_MS);
    return [...VENUES];
  },

  async getVenueById(id: string): Promise<VenueData | undefined> {
    await sleep(LATENCY_MS);
    return VENUES.find((v) => v.id === id || v.code.toLowerCase() === id.toLowerCase());
  },

  async searchVenues(query: string): Promise<VenueData[]> {
    await sleep(LATENCY_MS);
    const q = query.toLowerCase().trim();
    if (!q) return [...VENUES];
    return VENUES.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.code.toLowerCase().includes(q) ||
        v.building.toLowerCase().includes(q)
    );
  },
};
