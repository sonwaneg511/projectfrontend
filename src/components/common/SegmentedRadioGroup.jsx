'use client';

import { cn } from '@/lib/utils';

export function SegmentedRadioGroup({
  value,
  onChange,
  options = [],
  className,
  btnClassName,
  ...props
}) {
  return (
    <div className={cn('flex w-full gap-2 mt-2', className)}>
      {options.map((opt, _index) => {
        const active = value === opt.value;

        return (
          <button
            key={opt.value}
            data-value={opt.value}
            type='button'
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex flex-1 items-center gap-1.5 p-4 rounded-xl border text-gray-700 font-medium transition-all',
              'bg-white hover:bg-gray-50',

              active && 'border-brand-500 border-2 text-brand-600',
              btnClassName
            )}
            {...props}
          >
            {/* Radio circle */}
            <span
              className={cn(
                'w-4 h-4 rounded-full border flex items-center justify-center transition-all shrink-0',
                active ? 'border-brand-600 bg-brand-600' : 'border-gray-400'
              )}
            >
              {active && (
                <span className='w-1.5 h-1.5 rounded-full bg-white'></span>
              )}
            </span>

            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
