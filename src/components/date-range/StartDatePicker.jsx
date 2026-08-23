'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export function StartDatePicker({ value, onChange, endDate, className }) {
  const [open, setOpen] = useState(false);
  const minDate = endDate ? endDate : new Date();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            ' justify-start text-left font-semibold text-gray-900',
            !value &&
              'text-gray-500 font-semibold hover:bg-gray-100 hover:text-gray-500',
            className
          )}
        >
          <CalendarIcon className='mr-2 h-5 w-5 text-gray-400' />
          {value ? format(value, 'PPP') : <span>Select date</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-70 p-0' align='center' side={'bottom'}>
        <Calendar
          mode='single'
          selected={value}
          // onSelect={(d) => d && onChange(d)}
          onSelect={(d) => {
            if (!d) return;
            onChange(d);
            setOpen(false); // ✅ CLOSE ON SELECT
          }}
          disabled={(date) =>
            date <
            new Date(
              minDate.getFullYear(),
              minDate.getMonth(),
              minDate.getDate()
            )
          }
          initialFocus
          className='w-full'
        />
      </PopoverContent>
    </Popover>
  );
}
