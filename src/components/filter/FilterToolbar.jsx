'use client';

import { ListFilter } from 'lucide-react';
import { useState } from 'react';
import DateRangePicker from '@/components/date-range/DateRangePicker';
import FilterModal from '@/components/filter/FilterModal';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ReviewsToolbar({
  onFilterChange,
  platform,
  onPlatformChange,
  filterPopup = true,
  dateRangeFilter = true,
  dateRange,
  onDateRangeChange,
  locationData,
  locationFilters,
  onLocationChange,
  clearfilter = false,
  showFacebookTab = true
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className='flex items-center justify-between gap-4'>
      <Tabs value={platform} onValueChange={onPlatformChange} variant='primary'>
        <TabsList variant='primary'>
          <TabsTrigger value='GMB' variant='primary'>
            Google
          </TabsTrigger>
          {showFacebookTab && (
            <TabsTrigger value='FACEBOOK' variant='primary'>
              Facebook
            </TabsTrigger>)}
        </TabsList>
      </Tabs>

      <div className='flex items-center gap-2'>
        {/* <Select>
          show for
          <SelectTrigger className="w-40">
            <span>Last Month</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lastMonth">Last Month</SelectItem>
            <SelectItem value="lastQuarter">Last Quarter</SelectItem>
            <SelectItem value="lastYear">Last Year</SelectItem>
          </SelectContent>
        </Select> */}
        {dateRangeFilter && (
          <DateRangePicker
            value={dateRange}
            onChange={onDateRangeChange}
            clearDate={() => {
              if (dateRangeFilter) {
                setRange({
                  from: null,
                  to: null,
                });
              }
            }}
          />
        )}
        {filterPopup && (
          <>
            <Button variant='secondary' onClick={() => setOpen(true)}>
              <ListFilter className='w-5 h-5 text-gray-400' /> Filters
            </Button>
            <FilterModal
              open={open}
              onOpenChange={setOpen}
              onApply={(filters) => {
                onFilterChange(filters);
                setOpen(false);
              }}
              locationData={locationData}
              locationFilters={locationFilters}
              onLocationChange={onLocationChange}
            />
          </>
        )}
      </div>
    </div>
  );
}
