'use client';
import * as React from 'react';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { UpdateIcon } from '@radix-ui/react-icons';

import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/userContext';
import { useKeel } from '@/app/layout';

export function CreateAccount({ className, ...props }: { className?: string }) {
  const { setToken } = useUser();
  const keel = useKeel();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    error: '',
  });

  const handleSignUp = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await keel.api.mutations.authenticate({
        emailPassword: {
          email: formData.email,
          password: formData.password,
        },
        createIfNotExists: true,
      });

      setToken(response.data?.token as string);
      keel.client.setToken((response as any).data.token);

      if (response && (response as any).data.token) {
        const userName = formData.email.split('@')[0];
        await keel.api.mutations.createUser({
          name: userName,
          email: formData.email,
        });
        const teamName = `${
          userName.charAt(0).toUpperCase() + userName.slice(1)
        }'s Team`;
        const userId = await keel.api.queries.me();
        await keel.api.mutations.createTeam({
          team: {
            name: teamName,
            description: `Default team for ${userName}`,
          },
          user: {
            id: userId.data?.id as string,
          },
        });

        // Navigate to the app page after successful signup
        router.push('/app');
        console.log('Account created successfully');
      } else {
        setFormData((prevState: any) => ({
          ...prevState,
          error: `${response.error}`,
        }));
      }
    } catch (error) {
      setFormData((prevState: any) => ({
        ...prevState,
        error: 'An error occurred. Please try again.',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setFormData((prevState: any) => ({ ...prevState, error: '' }));
  };

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={handleSignUp}>
        <div className="grid gap-4">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
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
            <Input
              id="password"
              placeholder="*****"
              type="password"
              autoCapitalize="none"
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
              <UpdateIcon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Create account'
            )}
          </Button>
        </div>
      </form>
      {formData.error && <p color="red">{formData.error}</p>}
    </div>
  );
}
