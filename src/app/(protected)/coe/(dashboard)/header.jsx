'use client';

import { usePathname } from 'next/navigation';
import { CoeCampaignsHeader } from '@/components/(coe)/campaigns/header';

export const CoeDashboardHeader = () => {
  const pathname = usePathname();

  let header;

  if (pathname.includes('/coe/campaigns')) {
    header = <CoeCampaignsHeader />;
  }

  return <div className='shrink-0'>{header}</div>;
};
