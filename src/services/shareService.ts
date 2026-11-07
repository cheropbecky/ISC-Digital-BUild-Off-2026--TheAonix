/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Academic Share Hub Service: Documents & Study Groups
 */

import { SHARE_DOCUMENTS, STUDY_GROUPS, ShareDocument, StudyGroup } from '../data/share';

const LATENCY_MS = 80;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const shareService = {
  async getDocuments(): Promise<ShareDocument[]> {
    await sleep(LATENCY_MS);
    return [...SHARE_DOCUMENTS];
  },

  async getStudyGroups(): Promise<StudyGroup[]> {
    await sleep(LATENCY_MS);
    return [...STUDY_GROUPS];
  },

  async searchDocuments(query: string, faculty?: string): Promise<ShareDocument[]> {
    await sleep(LATENCY_MS);
    let results = [...SHARE_DOCUMENTS];
    if (faculty && faculty !== 'all') {
      results = results.filter((d) => d.faculty.toLowerCase().includes(faculty.toLowerCase()));
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.unitCode.toLowerCase().includes(q) ||
          d.unitName.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return results;
  },
};
