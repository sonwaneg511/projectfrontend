'use client';

import { useAuth } from '@/context/auth.context';

export function HeaderActions() {
  const { userDetails } = useAuth();

  return <div className='flex items-center gap-1' />;
}
