'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { ErrorMessage } from '@/components/ui/error-message';
import { Label } from '@/components/ui/label';

export function CheckboxField({ spec, entries, onChange, error, disabled }) {
  const isDisabled = disabled || spec.optionsConfirmed === false;

  const toggle = (label) => {
    if (isDisabled) return;
    onChange(
      entries.map((e) =>
        e.label === label ? { ...e, selected: !e.selected } : e
      )
    );
  };

  return (
    <div className='flex w-full flex-col gap-2.5'>
      <Label>{spec.label}</Label>
      <div className='grid grid-cols-2 gap-2'>
        {entries.map((entry) => {
          const inputId = `${spec.label}-${entry.label}`;
          return (
            <label
              key={entry.label}
              htmlFor={inputId}
              className='flex items-center gap-2 text-sm text-gray-700'
            >
              <Checkbox
                id={inputId}
                checked={entry.selected}
                disabled={isDisabled}
                onChange={() => toggle(entry.label)}
              />
              {entry.label}
            </label>
          );
        })}
      </div>
      {spec.optionsConfirmed === false && (
        <p className='text-xs text-amber-600'>
          Option labels pending confirmation from backend - temporarily
          read-only.
        </p>
      )}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
