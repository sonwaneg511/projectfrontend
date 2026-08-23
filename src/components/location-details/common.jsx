'use client';

import { PlusIcon } from 'lucide-react';
import { useId } from 'react';
import { useAuth } from '@/context/auth.context';
import { useDealersLoaction } from '@/hooks/queries/locations';
import { cn } from '@/lib/utils';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label, LabelInputContainer, labelVariants } from '../ui/label';
import { MultiSelect } from '../ui/multi-select';

export const ImageUploader = ({ className, children }) => {
  return <Card className={cn('px-4 py-6', className)}>{children}</Card>;
};

export const ImageUploaderHeader = ({ className, children }) => {
  return <div className={cn('flex items-center', className)}>{children}</div>;
};

export const ImageUploaderLabel = ({ className, children }) => {
  return <p className={cn(labelVariants(), className)}>{children}</p>;
};

export const ImageUploaderInput = ({
  className,
  isMultiple = false,
  handleInputChange,
}) => {
  const inputId = useId();

  return (
    <div
      className={cn(
        'relative border overflow-hidden border-[rgba(213,215,218,1)] rounded-md h-32',
        className
      )}
    >
      <Label htmlFor={inputId}>
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='flex flex-col items-center'>
            <div className='size-10 rounded-md border border-[rgba(213,215,218,1)] flex items-center justify-center'>
              <PlusIcon className='text-gray-700' />
            </div>
            <p className='font-semibold text-brand-700 text-sm mt-2 mb-1'>
              Add Image
            </p>
            <p className='text-sm text-gray-600 text-center'>
              or drag and drop
            </p>
          </div>
        </div>
      </Label>
      <Input
        id={inputId}
        type={'file'}
        accept='image/png, image/jpg'
        multiple={isMultiple}
        className={'opacity-0 disabled:opacity-0'}
        onChange={(e) => {
          handleInputChange(e);
          e.target.value = null; // Clear the input's value to allow re-selection of the same file
        }}
        // disabled={images.length >= maxImages}
      />
    </div>
  );
};

export const ImageUploaderLocations = ({
  value,
  onValueChange,
  platform,
  dealerId,
  isUploading,
}) => {
  const { userDetails } = useAuth();

  const { data, isLoading } = useDealersLoaction({
    client_id: userDetails?.clientId,
    user_id: userDetails?.user_id,
  });

  const gmbDealerOptions =
    data?.gmb_dealer_list?.map((dealer) => ({
      city: dealer.city,
      contry: dealer.contry,
      state: dealer.state,
      label: dealer.dealer_name,
      value: dealer.dealer_id,
      disabled: dealer.dealer_id === dealerId, // NOTE: it will disbaled and preselect this location by default
    })) ?? [];

  const facebookDealerOptions =
    data?.facebook_dealer_list?.map((dealer) => ({
      city: dealer.city,
      contry: dealer.contry,
      state: dealer.state,
      label: dealer.dealer_name,
      value: dealer.dealer_id,
    })) ?? [];

  const dealerIdOptions =
    platform === 'gmb' ? gmbDealerOptions : facebookDealerOptions;

  return (
    <LabelInputContainer>
      <p className={cn(labelVariants(), 'uppercase')}>Upload to</p>
      {isLoading ? (
        <div className='h-10 border border-gray-300 bg-muted animate-pulse rounded-md' />
      ) : (
        <MultiSelect
          isUpdating={isUploading}
          options={dealerIdOptions}
          value={value}
          onChange={(newLocations) => {
            onValueChange?.(newLocations);
          }}
        />
      )}
    </LabelInputContainer>
  );
};
