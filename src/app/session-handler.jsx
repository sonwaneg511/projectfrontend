'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const SessionHandler = () => {
  const router = useRouter();

  useEffect(() => {
    const handleSessionExpired = () => {
      router.replace('/invalidsession');
    };

    window.addEventListener('session-expired', handleSessionExpired);

    return () => {
      window.removeEventListener('session-expired', handleSessionExpired);
    };
  }, [router]);

  return null;
};
