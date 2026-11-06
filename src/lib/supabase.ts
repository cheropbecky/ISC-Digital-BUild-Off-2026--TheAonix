/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Supabase Client with Clerk JWT Session Integration
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const IS_SUPABASE_CONFIGURED =
  Boolean(SUPABASE_URL) &&
  Boolean(SUPABASE_ANON_KEY) &&
  !SUPABASE_URL.includes('your-supabase-project') &&
  !SUPABASE_ANON_KEY.includes('your-anon-key');

/**
 * Creates an authenticated Supabase client using Clerk's JWT session token
 */
export function createClerkSupabaseClient(getClerkToken?: () => Promise<string | null>): SupabaseClient {
  const url = IS_SUPABASE_CONFIGURED ? SUPABASE_URL : 'https://placeholder-ueab-baraton.supabase.co';
  const anonKey = IS_SUPABASE_CONFIGURED ? SUPABASE_ANON_KEY : 'placeholder-anon-key-ueab';

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: async (input, init = {}) => {
        let headers = new Headers(init.headers);
        if (getClerkToken) {
          try {
            const token = await getClerkToken();
            if (token) {
              headers.set('Authorization', `Bearer ${token}`);
            }
          } catch {
            // Token fetch failed, continue with default headers
          }
        }
        return fetch(input, { ...init, headers });
      },
    },
  });
}

// Default singleton client
export const supabase = createClerkSupabaseClient();
