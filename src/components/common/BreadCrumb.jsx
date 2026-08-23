'use client';

import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DashboardIcon } from '@/assets/icons/icons.jsx';
import { cn } from '@/lib/utils';

export default function AppBreadcrumb({ type, name }) {
  const router = useRouter();

  const config = {
    posts: {
      label: 'Posts',
      route: '/posts',
    },
    locations: {
      label: 'Locations',
      route: '/locations',
    },
  };

  const current = config[type];

  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        {/* Dashboard */}
        <DashboardIcon
          className={cn(
            'w-5 h-5',
            'text-gray-400 cursor-pointer hover:text-gray-600'
          )}
          onClick={() => router.push('/dashboard')}
        />

        <ChevronRight className='w-4 h-4 text-gray-400' />

        {/* Middle */}
        <span
          className='font-semibold text-sm text-gray-500 cursor-pointer hover:text-gray-700'
          onClick={() => router.push(current.route)}
        >
          {current.label}
        </span>

        <ChevronRight className='w-4 h-4 text-gray-400' />

        {/* Active */}
        <span className='font-semibold text-sm text-brand-700 truncate max-w-60'>
          {name}
        </span>
      </div>
    </div>
  );
}
