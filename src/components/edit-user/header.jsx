'use client';

import { XIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '../ui/button';
import { TempLogo } from '@/assets/icons/templogo'

export const EditUserHeader = () => {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  return (
    <div className='py-8 px-10 bg-white border-b flex items-center gap-5 shrink-0'>
      <Link prefetch={false} href={'/dashboard'} className='shrink-0'>
        {/* <Image src='/Logo.png' alt='Logo' width={160} height={32} priority /> */}
        <TempLogo width={130} height={28} />
      </Link>
      <div className='flex-1 flex items-center justify-center'>
        <h1 className='text-2xl font-semibold font-body text-gray-900'>
          Edit User
        </h1>
      </div>
      <div className='w-40 flex items-center justify-end shrink-0'>
        <Button variant={'ghost'} size={'icon'} className={'shrink-0'}>
          <Link
            prefetch={false}
            href={from === 'settings' ? '/settings' : '/users'}
          >
            <XIcon className='size-5 text-[rgba(164,167,174,1)]' />
          </Link>
        </Button>
      </div>
    </div>
  );
};
