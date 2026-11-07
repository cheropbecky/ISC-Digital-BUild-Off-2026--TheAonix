/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Lost & Found Service
 */

import { LOST_FOUND_ITEMS, LostFoundItem } from '../data/lostFound';

const LATENCY_MS = 80;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const lostFoundService = {
  async getItems(): Promise<LostFoundItem[]> {
    await sleep(LATENCY_MS);
    return [...LOST_FOUND_ITEMS];
  },

  async verifyItemAnswer(itemId: string, studentAnswer: string): Promise<{ success: boolean; message: string; claimPassCode?: string }> {
    await sleep(400);
    const item = LOST_FOUND_ITEMS.find((i) => i.id === itemId);
    if (!item) {
      return { success: false, message: 'Item not found in repository.' };
    }

    // In hackathon prototype, if student provides an answer with 3+ chars, accept as verified
    if (studentAnswer.trim().length >= 3) {
      const claimCode = `CLAIM-PASS-${Math.floor(1000 + Math.random() * 9000)}`;
      return {
        success: true,
        claimPassCode: claimCode,
        message: `Verification successful! Present Claim Code ${claimCode} and your Baraton Student ID at ${item.handoverDesk}.`,
      };
    }

    return {
      success: false,
      message: 'Verification answer did not match the item owner record. Please try again.',
    };
  },
};
