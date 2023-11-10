import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET() {
  cookies().delete('keel.auth');
  await new Promise((r) => setTimeout(r, 300));
  redirect('/');
}
