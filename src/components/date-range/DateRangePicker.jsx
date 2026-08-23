'use client';

import { Calendar, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

/**
 * Props
 * - value: { from: Date | null, to: Date | null }
 * - onChange: (range) => void   // called ONLY on Apply
 * - isLoading: boolean          // loader on Apply
 */
export default function DateRangePicker({
  value,
  onChange,
  isLoading = false,
  placeholder = 'Select Date Range',
  clearfilter = false,
  triggerClassName,
  clearDate = () => {},
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(value?.from ?? null);
  const [endDate, setEndDate] = useState(value?.to ?? null);
  const [selectedPreset, setSelectedPreset] = useState(null);

  const [currentMonth, setCurrentMonth] = useState(() => {
    const base = value?.from ?? new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  /** Sync from parent */
  useEffect(() => {
    setStartDate(value?.from ?? null);
    setEndDate(value?.to ?? null);
    setSelectedPreset(null);

    const base = value?.from ?? new Date();
    setCurrentMonth(new Date(base.getFullYear(), base.getMonth(), 1));
  }, [value]);

  /* -------------------- Config -------------------- */
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  const presets = [
    { label: 'Last 7 days', value: 'last_7_days' },
    { label: 'Last 30 days', value: 'last_30_days' },
    { label: 'Last year', value: 'last_year' },
  ];

  /* -------------------- Navigation -------------------- */
  const prevMonth = () =>
    setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () =>
    setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  const prevYear = () =>
    setCurrentMonth((d) => new Date(d.getFullYear() - 1, d.getMonth(), 1));
  const nextYear = () =>
    setCurrentMonth((d) => new Date(d.getFullYear() + 1, d.getMonth(), 1));

  /* -------------------- Helpers -------------------- */
  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDay = (date) => {
    const d = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return d === 0 ? 6 : d - 1;
  };

  const format = (d) =>
    d
      ? d.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : '';

  /* -------------------- Presets -------------------- */
  const getPresetRange = (preset) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (preset) {
      case 'last_7_days': {
        const start = new Date(today);
        start.setDate(today.getDate() - 6);
        return { from: start, to: today };
      }
      case 'last_30_days': {
        const start = new Date(today);
        start.setDate(today.getDate() - 29);
        return { from: start, to: today };
      }
      case 'last_year': {
        const start = new Date(today);
        start.setFullYear(today.getFullYear() - 1);
        return { from: start, to: today };
      }
      default:
        return { from: null, to: null };
    }
  };

  const handlePresetClick = (preset) => {
    const { from, to } = getPresetRange(preset);
    setStartDate(from);
    setEndDate(to);
    setCurrentMonth(new Date(from.getFullYear(), from.getMonth(), 1));
    setSelectedPreset(preset);
  };

  const handleClear = () => {
    onChange?.({ from: null, to: null });
    setStartDate(null);
    setEndDate(null);
    setSelectedPreset(null);
    clearDate?.();
  };

  /* -------------------- Calendar logic -------------------- */
  const handleDateClick = (day) => {
    const selected = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    setSelectedPreset(null);

    if (!startDate || (startDate && endDate)) {
      setStartDate(selected);
      setEndDate(null);
    } else if (selected >= startDate) {
      setEndDate(selected);
    } else {
      setEndDate(startDate);
      setStartDate(selected);
    }
  };

  const isInRange = (day) => {
    if (!startDate || !endDate) return false;
    const d = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return d >= startDate && d <= endDate;
  };

  const isEdge = (day) => {
    const d = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return (
      startDate?.toDateString() === d.toDateString() ||
      endDate?.toDateString() === d.toDateString()
    );
  };

  const renderCalendar = () => {
    const days = [];
    const total = getDaysInMonth(currentMonth);
    const firstDay = getFirstDay(currentMonth);

    for (let i = 0; i < firstDay; i++) days.push(<div key={`e-${i}`} />);

    for (let d = 1; d <= total; d++) {
      days.push(
        <button
          key={d}
          onClick={() => handleDateClick(d)}
          className={`text-sm py-2 rounded-full transition
            ${
              isEdge(d)
                ? 'bg-brand-600 text-white'
                : isInRange(d)
                  ? 'bg-gray-100'
                  : 'hover:bg-gray-100'
            }`}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  /* -------------------- Apply / Cancel -------------------- */
  const handleApply = () => {
    if (startDate && endDate) {
      onChange?.({ from: startDate, to: endDate });
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    if (!(value.from === startDate && value.to && endDate)) {
      setStartDate(null);
      setEndDate(null);
    }

    setIsOpen(false);
  };

  const handleClose = (popoverValue) => {
    if (popoverValue === false) {
      if (!(value.from === startDate && value.to && endDate)) {
        setStartDate(null);
        setEndDate(null);
      }
      setIsOpen(false);
    }
  };

  /* -------------------- Render -------------------- */
  return (
    <Popover open={isOpen} onOpenChange={handleClose}>
      <PopoverTrigger asChild>
        <Button
          variant='secondary'
          className={cn('w-64', triggerClassName)}
          onClick={() => setIsOpen(true)}
        >
          <Calendar className='w-4 h-4 mr-2' />
          {startDate && endDate
            ? `${format(startDate)} – ${format(endDate)}`
            : placeholder}
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-[380px] p-4'>
        {/* Header */}
        <div className='flex items-center justify-between mb-3'>
          <div className='flex gap-1'>
            <Button size='icon' variant='ghost' onClick={prevYear}>
              «
            </Button>
            <Button size='icon' variant='ghost' onClick={prevMonth}>
              <ChevronLeft className='w-4 h-4' />
            </Button>
          </div>

          <span className='font-semibold text-sm'>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>

          <div className='flex gap-1'>
            <Button size='icon' variant='ghost' onClick={nextMonth}>
              <ChevronRight className='w-4 h-4' />
            </Button>
            <Button size='icon' variant='ghost' onClick={nextYear}>
              »
            </Button>
          </div>
        </div>

        {/* Inputs */}
        <div className='flex gap-2 mb-3'>
          <Input readOnly value={format(startDate)} placeholder='Start date' />
          <Input readOnly value={format(endDate)} placeholder='End date' />
        </div>

        {/* Presets */}
        <div className='flex gap-3 mb-3 items-center justify-around'>
          {presets.map((p) => (
            <button
              key={p.value}
              onClick={() => handlePresetClick(p.value)}
              className={`text-sm font-semibold border-b-2 pb-1
                ${
                  selectedPreset === p.value
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-brand-700 hover:text-brand-800'
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Calendar */}
        <div className='grid grid-cols-7 text-center text-sm mb-2'>
          {dayNames.map((d) => (
            <div key={d} className='font-medium text-gray-600'>
              {d}
            </div>
          ))}
        </div>
        <div className='grid grid-cols-7 gap-1'>{renderCalendar()}</div>

        {/* Actions */}
        <div className='flex gap-2 mt-4'>
          <Button variant='secondary' className='w-full' onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant='primary'
            className='w-full'
            disabled={!startDate || !endDate || isLoading}
            onClick={handleApply}
          >
            {isLoading ? (
              <>
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                Applying
              </>
            ) : (
              'Apply'
            )}
          </Button>
        </div>
        <div className='flex mt-2 w-full'>
          <Button
            variant='destructive'
            className='w-full'
            onClick={handleClear}
          >
            Clear Filter
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
