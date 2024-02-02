import { cookies } from 'next/headers';
import { APIClient } from '../lib/keelClient';
import dotenv from 'dotenv';

dotenv.config();

type Options = {
  setToken?: (token: string | null) => void;
};

export const createClient = async ({ setToken }: Options = {}) => {
  const baseUrl = process.env.KEEL_API_URL;

  if (!baseUrl) {
    throw new Error('Missing KEEL_API_URL');
  }

  const keelClient = new APIClient(
    { baseUrl },
    {
      get: () => {
        const c = cookies().get('keel.auth')?.value ?? null;
        console.log('[createClient] new APIClient.get called, got cookie: ', c);
        return c;
      },
      set: (token) => {
        if (!token) {
          return;
        }
        if (setToken) {
          console.log(
            '[createClient] new APIClient.set called, setting cookie: ',
            token
          );
        }
        setToken?.(token);
      },
    }
  );

  // This prints `false` even if the token is correctly
  // retrieved from cookies.
  console.log(
    '[createClient] Calling .refresh(), returned: ',
    await keelClient.auth.refresh()
  );
  console.log(
    '[createClient] Calling .isAuthenticated(), returned: ',
    await keelClient.auth.isAuthenticated()
  );

  return keelClient;
};
