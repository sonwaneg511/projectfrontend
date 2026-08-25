'use client';

import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

export const LocationsHeader = () => {
  return (
    <div className='px-6 py-5 bg-white border-b border-border flex items-center justify-between shrink-0'>
      <div>
        <h1 className='text-2xl font-semibold text-gray-900'>Locations</h1>
        <p className='text-sm text-gray-600'>
          Manage all your locations in a central place.
        </p>
      </div>
      <Button variant={'primary'} asChild>
        <Link prefetch={false} href={'/location-create'}>
          <PlusIcon size={20} className='text-brand-300' />
          <span>Add Locations</span>
        </Link>
      </Button>
    </div>
  );
};
