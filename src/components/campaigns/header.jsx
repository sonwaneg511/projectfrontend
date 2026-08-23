'use client';

import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

export const CampaignsHeader = () => {
  return (
    <div className='px-6 py-5 bg-white border-b border-border flex items-center justify-between shrink-0'>
      <div>
        <h1 className='text-2xl font-semibold font-body text-gray-900'>
          Campaigns
        </h1>
        <p className='text-sm text-gray-600'>
          Analyze customer feedback and engage with your audience
        </p>
      </div>
      <div className='flex items-center gap-3'>
        {/* commented for demo purpose */}
        {/* <Button variant={'secondary'} asChild>
          <Link href={'/campaign-report'}>Campaign Reports</Link>
        </Button> */}
        <Button variant={'primary'} asChild>
          <Link href={'/create-campaign'}>
            <PlusIcon className='text-[#97CDF9]' size={20} />
            <span>Create Campaign</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};
