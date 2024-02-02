'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { LoginButton } from './LoginButton';

export function LoginForm(className: any, ...props: any[]) {
  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Link
        href="http://localhost:8000/auth/authorize/google_client"
        className={cn(buttonVariants({ variant: 'outline' }))}
      >
        Login with Google
      </Link>
    </div>
  );
}
