import { APIClient } from '../lib/keelClient';
import dotenv from 'dotenv';

dotenv.config();

const baseUrl = process.env.KEEL_API_URL;

if (!baseUrl) {
  throw new Error('Missing KEEL_API_URL');
}

export const keelClient = new APIClient({ baseUrl });
