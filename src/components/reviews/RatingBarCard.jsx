'use client';

import FractionStar from '@/components/stars/FractionStar';
import StarPattern from '@/components/stars/StarPattern';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

function RatingRow({ stars, percent }) {
  return (
    <div className='flex items-center gap-3 mb-2'>
      <div className='w-20 text-sm flex'>
        <StarPattern count={stars} secondaryColor='#F5F5F5' />
      </div>
      <div className='flex-1 bg-[#E9EAEB] rounded h-2 overflow-hidden'>
        <div style={{ width: `${percent}%` }} className='h-2 bg-brand-600' />
      </div>
      <div className='w-12 text-right text-sm text-[#414651] fw-medium'>
        {percent}%
      </div>
    </div>
  );
}

export default function RatingBarCard({ ratings = [], title = false }) {
  if (!ratings) return null;
  return (
    <Card>
      <CardContent className='space-y-3 p-5'>
        {title && (
          <CardTitle className='text-base font-semibold text-[#181D27]'>
            Review breakdown
          </CardTitle>
        )}
        {ratings.map((r) => (
          <RatingRow key={r.stars} stars={r.stars} percent={r.percentage} />
        ))}
        <div className='flex items-center gap-4 pt-5'>
          <b className='text-sm'>
            Average <span className='ml-4'> 4.5</span>
          </b>
          <FractionStar rating={3.9} size={16} />
        </div>
      </CardContent>
    </Card>
  );
}
