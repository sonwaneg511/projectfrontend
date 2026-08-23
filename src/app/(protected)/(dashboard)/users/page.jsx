'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UsersMain } from '@/components/users/main-container';
import { useAuth } from '@/context/auth.context';

const UsersPage = () => {
  const { userDetails } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userDetails.role === 'USER') {
      router.replace('/dashboard');
    }
  }, [router, userDetails]);

  if (userDetails?.role === 'USER') return null;

  return <UsersMain />;
};

export default UsersPage;
