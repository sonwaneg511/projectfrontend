'use client';

import { ListFilterIcon } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/auth.context';
import { useGetFilteredLocations } from '@/hooks/queries/locations';
import { cn, mapDealersToOptions } from '@/lib/utils';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { LabelInputContainer, labelVariants } from '../ui/label';
import { MultiSelect } from '../ui/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export const CampaignsFilter = ({ value, onValueChange }) => {
  const [open, setOpen] = useState(false);
  const [internalFilter, setInternalFilter] = useState({
    city: '',
    country: '',
    state: '',
    locations: [],
  });

  const { userDetails } = useAuth();

  const body = {
    user_id: userDetails?.user_id,
    client_id: userDetails?.clientId,
    city: internalFilter.city,
    state: internalFilter.state,
    country: internalFilter.country,
  };

  const { isLoading, data } = useGetFilteredLocations(body);

  const locations = mapDealersToOptions(data?.dealer_list);

  function isFilterEqual(internal, external) {
    return (
      internal.city === external.city &&
      internal.country === external.country &&
      internal.state === external.state &&
      internal.locations.length === external.locations.length &&
      internal.locations.every(
        (value, index) => value === external.locations[index]
      )
    );
  }

  const handleClear = () => {
    setInternalFilter({
      city: '',
      country: '',
      state: '',
      locations: [],
    });
    onValueChange({
      city: '',
      country: '',
      state: '',
      locations: [],
    });
    setOpen(false);
  };

  const handleApplyFilter = () => {
    onValueChange(internalFilter);
    setOpen(false);
  };

  const handleClose = (dialogValue) => {
    if (isLoading) {
      return;
    }

    if (dialogValue === false) {
      if (!isFilterEqual(internalFilter, value)) {
        setInternalFilter(value);
      }
    }
    setOpen(dialogValue);
  };

  // TODO: Need to add virtualization
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        {isLoading ? (
          <div className='h-9 rounded-md bg-neutral-100 max-w-[120px] w-full animate-pulse'></div>
        ) : (
          <Button variant={'outline'}>
            <ListFilterIcon size={20} className='text-gray-400' />
            <span>Filters</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='max-w-[1032px] p-0 rounded-2xl gap-0'>
        <DialogHeader className={'px-6 py-5 border-b'}>
          <DialogTitle className={'text-lg font-semibold'}>
            Filter by
          </DialogTitle>
        </DialogHeader>

        <div data-slot={'content'} className='p-3 flex flex-col gap-4'>
          <div className='grid grid-cols-3 gap-4'>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>Country</p>
              <Select
                value={internalFilter.country}
                onValueChange={(value) => {
                  setInternalFilter((prevFilter) => ({
                    ...prevFilter,
                    country: value,
                    locations: [],
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={'Select country'} />
                </SelectTrigger>
                <SelectContent className={cn(!data?.country?.length && 'p-2')}>
                  {data?.country?.length ? (
                    data?.country?.map((country) => {
                      return (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      );
                    })
                  ) : (
                    <p className='text-sm text-gray-500 text-center'>
                      No data found.
                    </p>
                  )}
                </SelectContent>
              </Select>
            </LabelInputContainer>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>State</p>
              <Select
                value={internalFilter.state}
                onValueChange={(value) => {
                  setInternalFilter((prevFilter) => ({
                    ...prevFilter,
                    state: value,
                    locations: [],
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={'Select state'} />
                </SelectTrigger>
                <SelectContent className={cn(!data?.state?.length && 'p-2')}>
                  {data?.state?.length ? (
                    data?.state?.map((state) => {
                      return (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      );
                    })
                  ) : (
                    <p className='text-sm text-gray-500 text-center'>
                      No data found.
                    </p>
                  )}
                </SelectContent>
              </Select>
            </LabelInputContainer>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>City</p>
              <Select
                value={internalFilter.city}
                onValueChange={(value) => {
                  setInternalFilter((prevFilter) => ({
                    ...prevFilter,
                    city: value,
                    locations: [],
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={'Select city'} />
                </SelectTrigger>
                <SelectContent className={cn(!data?.city?.length && 'p-2')}>
                  {data?.city?.length ? (
                    data?.city?.map((city) => {
                      return (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      );
                    })
                  ) : (
                    <p className='text-sm text-gray-500 text-center'>
                      No data found.
                    </p>
                  )}
                </SelectContent>
              </Select>
            </LabelInputContainer>
          </div>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Locations</p>
            <MultiSelect
              options={locations}
              value={internalFilter.locations}
              onChange={(newLocations) =>
                setInternalFilter((prevFilter) => ({
                  ...prevFilter,
                  locations: newLocations,
                }))
              }
            />
          </LabelInputContainer>
        </div>

        <div
          data-slot={'footer'}
          className='flex items-center justify-between mt-3 p-4 border-t border-border'
        >
          <Button variant={'destructive'} onClick={handleClear}>
            Clear Filters
          </Button>
          <div className='flex items-center gap-3'>
            <Button
              variant={'outline'}
              onClick={() => {
                if (!isFilterEqual(internalFilter, value)) {
                  setInternalFilter(value);
                }

                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button variant={'primary'} onClick={handleApplyFilter}>
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
