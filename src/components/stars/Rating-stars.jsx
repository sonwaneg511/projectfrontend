// components/ui/rating-stars.jsx
'use client';
import { useState } from 'react';
import { Star } from '@/assets/icons/icons.jsx';
export function RatingStars({ value, onChange }) {
  const [hover, setHover] = useState(null);

  return (
    <div className='flex gap-1 cursor-pointer'>
      {[1, 2, 3, 4, 5].map((num) => {
        const active = hover ? num <= hover : num <= value;
        return (
          <span
            key={num}
            onMouseEnter={() => setHover(num)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onChange(num)}
          >
            <Star
              className='w-5 h-5'
              fill={active ? 'var(--color-warning-400)' : 'text-gray-900'}
            />
          </span>
        );
      })}
    </div>
  );
}
