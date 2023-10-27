'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signup } from '@/app/actions/signup';
import { useFormState } from 'react-dom';
import { redirect } from 'next/navigation';

export function CreateAccount({ className, ...props }: { className?: string }) {
  const [state, formAction] = useFormState(signup, {
    type: 'initial',
  });

  if (state.type === 'success') {
    redirect(`/${state.firstTeamId}`);
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form action={formAction}>
        <div className="grid gap-4">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              name="email"
            />
            <Input
              placeholder="*****"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
              name="password"
            />
          </div>
          <Button type="submit">Create Account</Button>
        </div>
      </form>
      {state.type === 'error' && (
        <span className="text-xs text-red-400">
          <strong>Signup failed: </strong>
          {state.message}
        </span>
      )}
    </div>
  );
}
