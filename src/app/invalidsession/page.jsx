'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Toaster, toast } from 'sonner';

const InvalidSessionPage = () => {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      toast('Your session expired. Logging out!', {
        action: {
          label: 'Close',
          onClick: () => toast.dismiss(),
        },
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.replace('/login');
    })();
  }, [router]);

  return (
    <div className='h-screen flex items-center justify-center'>
      <h1 className='text-4xl font-semibold'>Invalid session</h1>
      <Toaster />
    </div>
  );
};

export default InvalidSessionPage;
