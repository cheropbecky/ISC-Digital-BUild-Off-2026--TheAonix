/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Housing Service - Mock Data Access Layer for Off-Campus Student Rentals
 */

import { HOUSES, ROOMMATE_POSTS, HouseListing, RoommatePost } from '../data/houses';

const LATENCY_MS = 100;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface HousingFilterParams {
  area?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  maxDistanceKm?: number;
  furnishedOnly?: boolean;
  water24_7?: boolean;
  wifiOnly?: boolean;
  securityOnly?: boolean;
  searchQuery?: string;
}

export const housingService = {
  async getAllHouses(filters?: HousingFilterParams): Promise<HouseListing[]> {
    await sleep(LATENCY_MS);
    let results = [...HOUSES];

    if (!filters) return results;

    if (filters.area && filters.area !== 'all') {
      results = results.filter((h) => h.area === filters.area);
    }

    if (filters.type && filters.type !== 'all') {
      results = results.filter((h) => h.type === filters.type);
    }

    if (filters.minPrice !== undefined) {
      results = results.filter((h) => h.priceMonthlyKes >= (filters.minPrice ?? 0));
    }

    if (filters.maxPrice !== undefined) {
      results = results.filter((h) => h.priceMonthlyKes <= (filters.maxPrice ?? 999999));
    }

    if (filters.maxDistanceKm !== undefined && filters.maxDistanceKm > 0) {
      results = results.filter((h) => h.distanceKm <= (filters.maxDistanceKm ?? 99));
    }

    if (filters.furnishedOnly) {
      results = results.filter((h) => h.isFurnished);
    }

    if (filters.water24_7) {
      results = results.filter((h) => h.amenities.water);
    }

    if (filters.wifiOnly) {
      results = results.filter((h) => h.amenities.wifi);
    }

    if (filters.securityOnly) {
      results = results.filter((h) => h.amenities.securityGuard || h.amenities.cctv);
    }

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      results = results.filter(
        (h) =>
          h.title.toLowerCase().includes(q) ||
          h.area.toLowerCase().includes(q) ||
          h.description.toLowerCase().includes(q)
      );
    }

    return results;
  },

  async getHouseById(id: string): Promise<HouseListing | undefined> {
    await sleep(LATENCY_MS);
    return HOUSES.find((h) => h.id === id);
  },

  async getRoommatePosts(): Promise<RoommatePost[]> {
    await sleep(LATENCY_MS);
    return [...ROOMMATE_POSTS];
  },

  async contactLandlord(houseId: string, message: string, studentPhone: string): Promise<{ success: boolean; simulatedReply: string }> {
    await sleep(600);
    const house = HOUSES.find((h) => h.id === houseId);
    const landlordName = house ? house.landlord.name : 'The Landlord';
    return {
      success: true,
      simulatedReply: `Hello! This is ${landlordName}. I received your inquiry about ${house?.title || 'the rental'}. The room is available for immediate viewing. Call me on ${house?.landlord.phone || '+254 722 000 000'} when you are at Baraton gate!`,
    };
  },
};
