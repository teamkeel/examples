import { Providers } from '@/components/Providers';
import '../styles/globals.css';
import { cookies, headers } from 'next/headers';

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { keelClient } from '@/util/clients';

export const metadata: Metadata = {
  title: 'Keel SaaS Starter',
  description: 'The next big SaaS tool',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = headers().get('x-pathname'); // <- Added by middleware.ts because Next doesn't give us the current pathname
  try {
    const token = cookies().get('keel.auth')?.value ?? '';
    keelClient.client.setToken(token);
    const me = await keelClient.api.queries.me();
    if (!me.data) {
      throw new Error('Not logged in');
    }
  } catch {
    if (path !== '/') redirect('/');
  }

  return (
    <Providers>
      <html lang="en">
        <body>{children}</body>
      </html>
    </Providers>
  );
}
