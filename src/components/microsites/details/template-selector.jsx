'use client';

import { cn } from '@/lib/utils';

const TEMPLATE_OPTIONS = [
  { value: 1, label: 'Template 1', preview: null },
  { value: 2, label: 'Template 2', preview: null },
  { value: 3, label: 'Template 3', preview: null },
  { value: 4, label: 'Template 4', preview: null },
];

export function TemplateSelector({ value, onChange, disabled }) {
  return (
    <div className='grid grid-cols-4 gap-4'>
      {TEMPLATE_OPTIONS.map((opt) => {
        const active = value === opt.value;

        return (
          <button
            key={opt.value}
            type='button'
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className='flex flex-col items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <div
              className={cn(
                'w-full aspect-square rounded-xl border-2 bg-gray-50 flex items-center justify-center text-sm font-medium text-gray-500 transition-transform duration-200 origin-center',
                active
                  ? 'scale-110 border-brand-500 ring-2 ring-brand-500 text-brand-600 bg-white'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              {opt.preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={opt.preview}
                  alt={opt.label}
                  className='w-full h-full object-cover rounded-[10px]'
                />
              ) : (
                opt.label
              )}
            </div>
            <span
              className={cn(
                'text-sm font-medium',
                active ? 'text-brand-600' : 'text-gray-700'
              )}
            >
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
