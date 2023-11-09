'use client';

import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

export function BackButton() {
  const { push } = useRouter();
  return <Button onClick={() => push('/')}>&larr; Go back</Button>;
}
