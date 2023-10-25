'use client';
import '../styles/globals.css';

import type { Metadata } from 'next';

import { UserProvider } from '../lib/userContext';

import { APIClient } from '../lib/keelClient';
import { keel } from '@teamkeel/client-react';
// import { keelQuery } from "@teamkeel/client-react-query";

export const { KeelProvider, useKeel } = keel(APIClient);
// export const { useKeelQuery, useKeelMutation } = keelQuery(useKeel);

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
    <UserProvider>
      <KeelProvider baseUrl="https://staging--keel-saas-NhPsdw.keelapps.xyz/api">
        <html lang="en">
          <body>{children}</body>
        </html>
      </KeelProvider>
    </UserProvider>
  );
}
