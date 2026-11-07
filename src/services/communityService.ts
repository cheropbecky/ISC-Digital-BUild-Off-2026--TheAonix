/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Community Service: Events, Clubs, Alumni Network, and Career Opportunities
 */

import {
  CAMPUS_EVENTS,
  STUDENT_CLUBS,
  ALUMNI,
  OPPORTUNITIES,
  CampusEvent,
  StudentClub,
  AlumniProfile,
  CareerOpportunity,
} from '../data/community';

const LATENCY_MS = 80;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const communityService = {
  async getEvents(): Promise<CampusEvent[]> {
    await sleep(LATENCY_MS);
    return [...CAMPUS_EVENTS];
  },

  async getClubs(): Promise<StudentClub[]> {
    await sleep(LATENCY_MS);
    return [...STUDENT_CLUBS];
  },

  async getAlumni(): Promise<AlumniProfile[]> {
    await sleep(LATENCY_MS);
    return [...ALUMNI];
  },

  async getOpportunities(): Promise<CareerOpportunity[]> {
    await sleep(LATENCY_MS);
    return [...OPPORTUNITIES];
  },

  async submitReferralRequest(alumniId: string, pitch: string, resumeUrl: string): Promise<{ success: boolean; message: string }> {
    await sleep(400);
    const alum = ALUMNI.find((a) => a.id === alumniId);
    return {
      success: true,
      message: `Your referral request was dispatched to ${alum?.fullName || 'the alumnus'}. You will receive a notification once reviewed.`,
    };
  },
};
