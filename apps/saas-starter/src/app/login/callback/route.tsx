import { createClient } from '@/util/createClient';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    Response.json({ error: 'Missing code' });
    return;
  }

  const client = await createClient({
    setToken: (token) => {
      cookies().set('keel.auth', token ?? '', {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
      });
    },
  });

  console.log(
    '[login/callback] Calling .authenticateWithSingleSignOn() with code: ',
    code
  );
  await client.auth.authenticateWithSingleSignOn(code);

  console.log(
    '[login/callback] Is authenticated? ',
    await client.auth.isAuthenticated()
  );
  console.log('[login/callback] Redirecting to http://localhost:3000');

  return Response.redirect('http://localhost:3000');
}
