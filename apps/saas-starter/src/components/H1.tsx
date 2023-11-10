import { PropsWithChildren } from 'react';

export const H1 = ({ children }: PropsWithChildren) => (
  <h1 className="text-4xl font-bold">{children}</h1>
);
