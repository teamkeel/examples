import { Providers } from '@/components/Providers';
import '../styles/globals.css';
import { cookies } from 'next/headers';

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Keel SaaS Starter',
  description: 'The next big SaaS tool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <html lang="en">
        <body>{children}</body>
      </html>
    </Providers>
  );
}
