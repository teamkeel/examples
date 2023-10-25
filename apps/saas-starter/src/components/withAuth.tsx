import React from 'react';
import { useUser } from '@/lib/userContext';
import { useRouter } from 'next/navigation';

function withAuth(WrappedComponent: any) {
  return function AuthComponent(props: React.JSX.IntrinsicAttributes) {
    const { token } = useUser();
    const router = useRouter();

    React.useEffect(() => {
      if (!token) {
        router.push('/login');
      }
    }, [router, token]);

    return <WrappedComponent {...props} />;
  };
}

export default withAuth;
