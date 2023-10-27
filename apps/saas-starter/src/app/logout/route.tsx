import { keelClient } from '@/util/clients';
import { RouteHandler } from 'next/dist/server/base-server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET() {
  cookies().delete('keel.auth');
  keelClient.client.clearToken();
  await new Promise((r) => setTimeout(r, 300));
  redirect('/');
}
