'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Header() {
  const router = useRouter();

  return (
    <>
      <div className='p-6 sticky top-0 z-10 bg-white border-b'>
        <div className='flex items-center gap-3'>
          <Button variant='secondary' onClick={() => router.back()}>
            <ArrowLeft color='var(--color-gray-400)' size={20} /> Back
          </Button>
          <div>
            <h1 className='text-2xl font-semibold font-body text-gray-900'>
              Create New Post
            </h1>
            <p className='text-sm text-gray-600'>
              Create and share posts for various channels
            </p>
          </div>
        </div>
      </div>
      <div className='bg-gray-50 h-full'></div>
    </>
  );
}
