'use client';

import { keel } from '@teamkeel/client-react';

import { UserProvider } from '../lib/userContext';
import { APIClient } from '../lib/keelClient';
import { FC, PropsWithChildren } from 'react';

export const { KeelProvider, useKeel } = keel(APIClient);

export const Providers: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <UserProvider>
      <KeelProvider baseUrl="https://staging--keel-saas-NhPsdw.keelapps.xyz/api">
        <html lang="en">
          <body>{children}</body>
        </html>
      </KeelProvider>
    </UserProvider>
  );
};
