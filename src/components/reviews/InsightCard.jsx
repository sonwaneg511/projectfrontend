'use client';

import { MoreVertical } from 'lucide-react';
import { TrendUpIcon } from '@/assets/icons/icons.jsx';
import { Card, CardContent } from '@/components/ui/card';

export default function InsightCard({
  title,
  value,
  growth,
  variation = 'sm',
}) {
  return (
    <Card className='rounded-xl border p-5'>
      <CardContent
        className={`p-0 flex flex-col justify-between ${
          variation === 'lg' ? 'gap-10.5' : 'gap-0'
        }`}
      >
        <div className='flex items-start justify-between mb-5'>
          <div className='w-12 h-12 rounded-full bg-[#DCFAE6] flex items-center justify-center'>
            <TrendUpIcon className='text-[#079455] w-6 h-6' />
          </div>
          {variation === 'lg' && (
            <div className='flex items-center gap-2'>
              <MoreVertical color='#A4A7AE' />
            </div>
          )}
        </div>
        <div>
          <p className='text-sm text-[#535862] mb-2 fw-medium'>{title}</p>
          {/* Value */}
          <div className='flex justify-between'>
            <h4 className='text-3xl font-semibold mt-1 text-[#181D27]'>
              {value}
            </h4>

            {/* Growth Badge */}
            {/* <div className='mt-2 inline-flex items-center gap-1 px-2 py-1 border rounded-md text-xs font-medium bg-white'>
              <ArrowUpRight color='#17B26A' />
              <span className='text-[#414651]'>{growth}</span>
            </div> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
