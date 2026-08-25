import { Star } from '@/assets/icons/icons.jsx';

export default function StarPattern({ count, secondaryColor }) {
  const totalStars = 5;

  return (
    <div className='flex items-center gap-0.5'>
      {Array.from({ length: totalStars }).map((_, i) => (
        <Star
          key={i}
          className='w-4 h-4'
          fill={i < count ? 'var(--color-warning-400)' : secondaryColor}
        />
      ))}
    </div>
  );
}
