'use client';

import { Check, ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export function MultiSelect({
  options = [],
  value = [],
  onChange,
  placeholder = 'Select locations',
  selectLabel = 'locations',
  isUpdating = false,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => {
    return options.filter(
      (o) =>
        o?.label?.toLowerCase()?.includes(search.toLowerCase()) ||
        o?.value?.toLowerCase()?.includes(search.toLowerCase()) ||
        o?.state?.toLowerCase()?.includes(search.toLowerCase()) ||
        o?.city?.toLowerCase()?.includes(search.toLowerCase())
    );
  }, [options, search]);

  const toggleValue = (val) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const selectAll = () => {
    if (filtered.every((f) => value.includes(f.value))) {
      onChange(
        value.filter(
          (v) =>
            !filtered
              .filter((f) => !f?.disabled)
              .map((f) => f.value)
              .includes(v)
        )
      );
    } else {
      const updated = [
        ...new Set([
          ...value,
          ...filtered.filter((f) => !f?.disabled).map((f) => f.value),
        ]),
      ];
      onChange(updated);
    }
  };

  const selectedLabel =
    value.length === 1
      ? options.find((o) => o.value === value[0])?.label
      : value.length > 1
        ? `${value.length} ${selectLabel} selected`
        : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          disabled={isUpdating}
          className={cn(
            'w-full h-10 border border-gray-300 rounded-md px-3 text-left text-sm flex items-center justify-between mb-0',
            value.length === 0 && 'text-gray-500'
          )}
        >
          {selectedLabel}
          <ChevronDown className='w-4 h-4 text-gray-400' />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className='w-[350px] p-0 shadow-md rounded-lg'
        dropdown
        matchTriggerWidth
        withArrow
      >
        {/* Search Input */}
        <div className='p-3 border-b'>
          <Input
            placeholder='Search locations'
            className='h-9'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Header Row */}
        <div className='flex items-center justify-between px-3 py-2 text-sm border-b bg-gray-50'>
          <span className='text-gray-700'>
            Showing results for{' '}
            <span className='font-semibold'>{search || 'All'}</span>
          </span>

          <Button
            variant='secondary'
            size='sm'
            onClick={selectAll}
            className='h-7 text-xs'
          >
            Select All
          </Button>
        </div>

        {/* Options */}
        {filtered.length ? (
          <div
            className='max-h-60 overflow-y-auto'
            onWheelCapture={(e) => e.stopPropagation()}
          >
            {filtered.map((opt, idx) => (
              <button
                disabled={opt?.disabled}
                key={`opt.value-${idx}`}
                onClick={() => {
                  if (opt?.disabled) {
                    return;
                  }

                  toggleValue(opt.value);
                }}
                className={cn(
                  `w-full px-3 py-2 my-0.5 text-left text-sm hover:bg-gray-50 flex items-center justify-between ${value.includes(opt.value) && 'bg-gray-50'}`,
                  opt?.disabled && 'opacity-80 cursor-not-allowed hover:bg-none'
                )}
              >
                <div className={`flex gap-2`}>
                  <p className='text-gray-800'>{opt.label}</p>
                  {opt.value && (
                    <span className='text-gray-500 text-xs'>@{opt.value}</span>
                  )}
                </div>

                {value.includes(opt.value) && (
                  <Check className='w-4 h-4 text-brand-600 shrink-0' />
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className='p-5 flex items-center justify-center'>
            <p className='text-sm text-gray-500'>No data found.</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
