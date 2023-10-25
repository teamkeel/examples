import { Providers } from '@/components/Providers';
import '../styles/globals.css';

import type { Metadata } from 'next';

const metadata: Metadata = {
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
