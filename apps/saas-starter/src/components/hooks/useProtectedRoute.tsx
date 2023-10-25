'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '../../lib/userContext';

export const useProtectedRoute = () => {
  const { isAuthenticated, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push('/login'); // Redirect to your login page
    }
  }, [isAuthenticated, loading, router]);
};
