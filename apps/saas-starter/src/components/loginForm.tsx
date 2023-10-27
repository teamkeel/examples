'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { UpdateIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function LoginForm(className: any, ...props: any[]) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    error: '',
  });

  const clearError = () => {
    setFormData((prevState: any) => ({ ...prevState, error: '' }));
  };

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      {/* @ts-ignore */}
      <form onSubmit={handleLogin}>
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
              disabled={isLoading}
              onChange={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  email: e.target.value,
                }))
              }
              onFocus={clearError}
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
              disabled={isLoading}
              onChange={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  password: e.target.value,
                }))
              }
              onFocus={clearError}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading ? (
              <UpdateIcon className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              'Login'
            )}
          </Button>
        </div>
      </form>
      {formData.error && <p color="red">{formData.error}</p>}
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
