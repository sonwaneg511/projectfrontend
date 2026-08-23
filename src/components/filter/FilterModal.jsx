'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DEFAULT_FILTERS, FILTER_STORAGE_KEY } from '@/constants/constants';
import { mapDealersToOptions } from '@/lib/utils';
import DateRangePicker from '../date-range/DateRangePicker';
import { RatingStars } from '../stars/Rating-stars';
import { MultiSelect } from '../ui/multi-select';

export default function FilterModal({
  open,
  onOpenChange,
  onApply,
  locationData,
  locationFilters,
  onLocationChange,
}) {
  const [filters, setFilters] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_FILTERS;

    try {
      const stored = localStorage.getItem(FILTER_STORAGE_KEY);
      return stored ? hydrateFilters(JSON.parse(stored)) : DEFAULT_FILTERS;
    } catch {
      return DEFAULT_FILTERS;
    }
  });

  const hydrateFilters = (raw) => {
    if (!raw) return DEFAULT_FILTERS;

    return {
      ...raw,
      dateRange: raw.dateRange
        ? {
            startDate: raw.dateRange.startDate
              ? new Date(raw.dateRange.startDate)
              : null,
            endDate: raw.dateRange.endDate
              ? new Date(raw.dateRange.endDate)
              : null,
          }
        : null,
    };
  };

  const dealerOptions = mapDealersToOptions(locationData?.dealer_list);

  const update = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    localStorage.removeItem(FILTER_STORAGE_KEY);

    onLocationChange('country', '');
    onLocationChange('state', '');
    onLocationChange('city', '');
    onLocationChange('dealer_id', []);
    setFilters((prev) => ({ ...prev, dateRange: null }));
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!open) return;

    const stored = localStorage.getItem(FILTER_STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = hydrateFilters(JSON.parse(stored));

      setFilters(parsed);

      onLocationChange('country', parsed.country || '');
      onLocationChange('state', parsed.state || '');
      onLocationChange('city', parsed.city || '');
      onLocationChange('dealer_id', parsed.dealer_id || []);
    } catch {}
  }, [open]);

  const handleApply = () => {
    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));

    onApply({
      ...filters,
      repliedFilter: {
        replied: filters.replied,
        notReplied: filters.notReplied,
      },
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className='max-w-[1032px] p-0 rounded-2xl gap-0'
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold font-body px-6 py-5 border-b'>
            Filter by
          </DialogTitle>
        </DialogHeader>

        <div className='px-3 py-3'>
          {/* Country / State / City */}
          <div className='grid grid-cols-3 gap-4 my-4'>
            <div>
              <Label htmlFor='country'>Country</Label>
              <Select
                value={locationFilters?.country}
                onValueChange={(v) => {
                  onLocationChange('country', v);
                  update('country', v);
                }}
              >
                <SelectTrigger className='mt-1'>
                  <SelectValue placeholder='Select Country' />
                </SelectTrigger>
                <SelectContent>
                  {locationData?.country?.map((country) => (
                    <SelectItem value={country} key={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor='state'>State</Label>
              <Select
                value={locationFilters?.state}
                onValueChange={(v) => {
                  onLocationChange('state', v);
                  update('state', v);
                }}
              >
                <SelectTrigger className='mt-1'>
                  <SelectValue placeholder='Select State' />
                </SelectTrigger>
                <SelectContent>
                  {locationData?.state?.map((state) => (
                    <SelectItem value={state} key={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor='city'>City</Label>
              <Select
                value={locationFilters?.city}
                onValueChange={(v) => {
                  onLocationChange('city', v);
                  update('city', v);
                }}
              >
                <SelectTrigger className='mt-1'>
                  <SelectValue placeholder='Select City' />
                </SelectTrigger>
                <SelectContent>
                  {locationData?.city?.map((city) => (
                    <SelectItem value={city} key={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Location ID Search */}
          <div className='mb-4'>
            <Label htmlFor='locationId'>Location Id</Label>
            <MultiSelect
              options={dealerOptions}
              value={filters.dealer_id}
              onChange={(v) => update('dealer_id', v)}
              className='mt-1 shadow-xs'
            />
          </div>

          {/* GRID SECTION */}
          <div className='grid grid-cols-3 gap-4 mt-4'>
            {/* Rating */}
            <div className='border rounded-lg p-2'>
              <p className='text-sm font-medium text-gray-700 py-2'>Rating</p>
              <div className='mt-2 border-t py-5'>
                <RatingStars
                  value={filters.rating}
                  onChange={(val) => update('rating', val)}
                />
              </div>
            </div>

            {/* Reply Status */}
            <div className='border rounded-lg p-2'>
              <p className='text-sm font-medium text-gray-700'>Reply Status</p>
              <div className='mt-2 border-t flex flex-col gap-3'>
                <div className='flex items-center gap-2 mt-1.5'>
                  <Switch
                    checked={filters.replied}
                    onCheckedChange={(v) => update('replied', v)}
                  />
                  <span>Replied</span>
                </div>

                <div className='flex items-center gap-2'>
                  <Switch
                    checked={filters.notReplied}
                    onCheckedChange={(v) => update('notReplied', v)}
                  />
                  <span>Not Replied</span>
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className='border rounded-lg p-2'>
              <p className='text-sm font-medium text-gray-700'>Date Range</p>

              <div className='mt-2 border-t pt-3'>
                <DateRangePicker
                  value={
                    filters.dateRange
                      ? {
                          from: filters.dateRange.startDate,
                          to: filters.dateRange.endDate,
                        }
                      : null
                  }
                  onChange={({ from, to }) => {
                    setFilters((prev) => ({
                      ...prev,
                      dateRange: { startDate: from, endDate: to },
                    }));
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Footer Buttons */}
        <div className='flex justify-between mt-6 p-4 border-t'>
          <Button variant='destructive' onClick={clearFilters}>
            Clear Filters
          </Button>

          <div className='flex gap-3'>
            <Button variant='secondary' onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant='primary' onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
