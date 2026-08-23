'use client';

import { useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { EditUserMain } from '@/components/edit-user/main-container';
import { useAuth } from '@/context/auth.context';

const EditUserPage = () => {
  const { userDetails } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userDetails?.role === 'USER') {
      router.replace('/dashboard');
    }
  }, [userDetails, router]);

  if (userDetails?.role === 'USER') return null;

  return (
    <Suspense fallback={null}>
      <EditUserMain />
    </Suspense>
  );
};

export default EditUserPage;
