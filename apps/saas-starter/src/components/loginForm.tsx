'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { handleLogin } from '@/app/actions/login';
import { LoginButton } from './LoginButton';

export function LoginForm(className: any, ...props: any[]) {
  const [formState, action] = useFormState(handleLogin, { type: 'initial' });

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form action={action}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label className="" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
            />
          </div>
          <div className="grid gap-2">
            <Label className="" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
            />
          </div>
          <LoginButton />
        </div>
      </form>
      {formState.type === 'error' && (
        <span className="text-xs text-red-400">
          <strong>Signup failed: </strong>
          {formState.message}
        </span>
      )}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2 bg-background text-muted-foreground">Or</span>
        </div>
      </div>
      <Link href="/" className={cn(buttonVariants({ variant: 'outline' }))}>
        Sign up now
      </Link>
    </div>
  );
}
