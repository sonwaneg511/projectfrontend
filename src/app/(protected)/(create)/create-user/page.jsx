'use client';

import { useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { CreateUserMain } from '@/components/create-user/main-container';
import { useAuth } from '@/context/auth.context';

const CreateUserPage = () => {
  const { userDetails } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userDetails.role === 'USER') {
      router.replace('/dashboard');
    }
  }, [router, userDetails]);

  if (userDetails?.role === 'USER') return null;

  return (
    <Suspense fallback={null}>
      <CreateUserMain />
    </Suspense>
  );
};

export default CreateUserPage;
