'use client';

import { ErrorMessage } from '@/components/ui/error-message';
import { Label } from '@/components/ui/label';

export function RadioField({ spec, entries, onChange, error, disabled }) {
  const isDisabled = disabled || spec.optionsConfirmed === false;

  const select = (label) => {
    if (isDisabled) return;
    onChange(entries.map((e) => ({ ...e, selected: e.label === label })));
  };

  return (
    <div className='flex w-full flex-col gap-2.5'>
      <Label>{spec.label}</Label>
      <div className='grid grid-cols-2 gap-2'>
        {entries.map((entry) => (
          <label
            key={entry.label}
            className='flex items-center gap-2 text-sm text-gray-700'
          >
            <input
              type='radio'
              name={spec.label}
              checked={entry.selected}
              disabled={isDisabled}
              onChange={() => select(entry.label)}
              className='accent-brand-600'
            />
            {entry.label}
          </label>
        ))}
      </div>
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
