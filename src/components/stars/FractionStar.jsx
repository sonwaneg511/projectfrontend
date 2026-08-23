import { Star as FullStar, HalfStar } from '@/assets/icons/icons.jsx';

export default function FractionStar({ rating }) {
  const full = Math.floor(rating); // 4 from 4.9
  const decimal = rating % 1;

  // YOUR LOGIC → anything above .25 becomes half star (even 0.99)
  const hasHalf = decimal > 0.25;

  // If hasHalf, remove 1 full star because half replaces the missing one
  const showFull = hasHalf ? full : full;
  const empty = 5 - showFull - (hasHalf ? 1 : 0);
  return (
    <div className='flex gap-1 items-center'>
      {Array(full)
        .fill(0)
        .map((_, i) => (
          <FullStar className='w-4 h-4' key={`f-${i}`} />
        ))}

      {hasHalf && <HalfStar size={120} className='w-4 h-4' />}

      {Array(empty)
        .fill(0)
        .map((_, i) => (
          <FullStar
            fill='#F5F5F5'
            className='w-4 h-4'
            key={`e-${i}`}
            size={16}
          />
        ))}
    </div>
  );
}
