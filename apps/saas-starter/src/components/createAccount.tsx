'use client';

import * as React from 'react';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UpdateIcon } from '@radix-ui/react-icons';

import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/userContext';
import { useKeel } from './Providers';

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

      if (!response.data) {
        setFormData((prevState: any) => ({
          ...prevState,
          error: `${response.error}`,
        }));
        throw new Error('No response');
      }

      setToken(response.data.token);
      keel.client.setToken(response.data.token);

      const [username] = formData.email.split('@');

      await keel.api.mutations.createUser({
        name: username,
        email: formData.email,
      });

      const teamName = `${
        username.charAt(0).toUpperCase() + username.slice(1)
      }'s Team`;

      const userId = await keel.api.queries.me();
      await keel.api.mutations.createTeam({
        team: {
          name: teamName,
          description: `Default team for ${username}`,
        },
        user: {
          id: userId.data?.id as string,
        },
      });

      // Navigate to the app page after successful signup
      router.push('/app');
      console.log('Account created successfully');
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
              <UpdateIcon className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              'Create Account'
            )}
          </Button>
        </div>
      </form>
      {formData.error && <p color="red">{formData.error}</p>}
    </div>
  );
}
