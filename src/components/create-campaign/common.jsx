import { useAuth } from '@/context/auth.context';
import { useGetClientLocations } from '@/hooks/queries/locations';
import { cn } from '@/lib/utils';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  CheckIcon,
  ChevronDown,
  IndianRupeeIcon,
  PlusIcon,
  SearchIcon,
  TriangleAlertIcon,
  XIcon,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuid } from 'uuid';
import { EndDatePicker } from '../date-range/EndDatePicker';
import { StartDatePicker } from '../date-range/StartDatePicker';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ErrorMessage } from '../ui/error-message';
import { Input } from '../ui/input';
import { Label, LabelInputContainer, labelVariants } from '../ui/label';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import { Textarea } from '../ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { useCreateCampaign } from './form';

export const CreateCampaignCard = ({ className, children }) => {
  return (
    <Card className={cn('max-w-160 w-full rounded-xl bg-white', className)}>
      {children}
    </Card>
  );
};

export const CreateCampaignCardHeader = ({ className, children }) => {
  return (
    <CardHeader className={cn('px-6 py-5 border-b', className)}>
      {children}
    </CardHeader>
  );
};

export const CreateCampaignCardTitle = ({ className, children }) => {
  return (
    <CardTitle className={cn('text-lg text-gray-900', className)}>
      {children}
    </CardTitle>
  );
};

export const CreateCampaignContent = ({ className, children }) => {
  return (
    <CardContent className={cn('p-6 flex flex-col gap-6', className)}>
      {children}
    </CardContent>
  );
};

export const CreateCampaignFormDate = () => {
  const { formData, setFormData, validationErrors, setValidationErrors } =
    useCreateCampaign();

  let dateErrorMessage = '';

  if (validationErrors.startDate && validationErrors.endDate) {
    dateErrorMessage = 'Select start date and end date.';
  } else if (validationErrors.startDate) {
    dateErrorMessage = validationErrors.startDate;
  } else if (validationErrors.endDate) {
    dateErrorMessage = validationErrors.endDate;
  } else {
    dateErrorMessage = '';
  }

  return (
    <LabelInputContainer>
      <div className='flex items-center gap-6'>
        <LabelInputContainer>
          <p className={cn(labelVariants())}>
            Start Date <span className='text-brand-600'>*</span>
          </p>
          <StartDatePicker
            value={formData.startDate}
            endDate={formData.endDate}
            onChange={(d) => {
              setFormData((prevFormData) => {
                const newStartDate = d;

                const newEnd =
                  prevFormData.endDate && prevFormData.endDate < newStartDate
                    ? newStartDate
                    : prevFormData.endDate;

                return {
                  ...prevFormData,
                  startDate: newStartDate,
                  endDate: newEnd,
                };
              });

              setValidationErrors((prevValidationErrors) => ({
                ...prevValidationErrors,
                startDate: '',
              }));
            }}
            className={'justify-center'}
          />
        </LabelInputContainer>
        <LabelInputContainer>
          <p className={cn(labelVariants())}>
            End Date <span className='text-brand-600'>*</span>
          </p>
          <EndDatePicker
            value={formData.endDate}
            startDate={formData.startDate}
            disabled={!formData.startDate}
            onChange={(d) => {
              setFormData((prevFormData) => {
                const newEndDate = d;

                const newStart =
                  prevFormData.startDate && prevFormData.startDate > newEndDate
                    ? newEndDate
                    : prevFormData.startDate;

                return {
                  ...prevFormData,
                  endDate: newEndDate,
                  startDate: newStart,
                };
              });
              setValidationErrors((prevValidationErrors) => ({
                ...prevValidationErrors,
                endDate: '',
              }));
            }}
            className={'justify-center'}
          />
        </LabelInputContainer>
      </div>
      {dateErrorMessage && <ErrorMessage message={dateErrorMessage} />}
    </LabelInputContainer>
  );
};

export const CreateCampaignBudget = ({
  label,
  htmlFor,
  placeholder,
  value,
  onChange,
  error,
  ...props
}) => {
  return (
    <LabelInputContainer>
      <Label htmlFor={htmlFor}>{label}</Label>
      <div
        className={cn(
          'border border-gray-300 h-10 flex rounded-md overflow-hidden',
          !props?.readOnly &&
            'focus-within:ring-1 focus-within:ring-brand-500 focus-within:border-brand-500',
          props?.readOnly && 'bg-[rgba(250,250,250,1)]'
        )}
      >
        <div className='border-r h-full w-10 flex items-center justify-center'>
          <IndianRupeeIcon className='size-4 text-[rgba(83,88,98,1)]' />
        </div>
        <Input
          id={htmlFor}
          placeholder={placeholder}
          data-numeric-only
          value={value}
          onChange={onChange}
          className={
            'h-full border-none focus-visible:ring-0 focus-visible:border-0 shadow-none read-only:focus-visible:ring-0 read-only:focus:border-gray-300'
          }
          {...props}
        />
      </div>
      {error && <ErrorMessage message={error} className={'ml-2'} />}
    </LabelInputContainer>
  );
};

const ITEM_HEIGHT = 36;
const VIEWPORT_HEIGHT = 280;

export const CreateCampaignLocations = ({
  value,
  setFormData,
  error,
  setValidationErrors,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const parentRef = useRef(null);
  const { userDetails } = useAuth();

  const params = {
    userId: userDetails?.user_id,
  };
  const { data } = useGetClientLocations({
    clientId: userDetails?.clientId,
    params,
  });

  const locations = data?.campaign_location_details ?? [];
  const filteredLocations = locations.filter(
    (location) =>
      location?.state?.toLowerCase()?.includes(search.trim().toLowerCase()) ||
      location?.city?.toLowerCase()?.includes(search.trim().toLowerCase()) ||
      location.dealer_id.includes(search.trim().toLowerCase()) ||
      location?.dealer_name
        ?.toLowerCase()
        ?.includes(search.trim().toLowerCase())
  );

  const rowVirtualizer = useVirtualizer({
    count: open ? filteredLocations.length : 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 6,
  });

  const selectedDealerName = locations.find(
    (location) => location.dealer_id === value
  )?.dealer_name;

  return (
    <LabelInputContainer>
      <p className={cn(labelVariants())}>
        Select Location <span className='text-brand-600'>*</span>
      </p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={'shadow-xs justify-between overflow-hidden'}
          >
            <span className={'flex-1 truncate text-left text-gray-600'}>
              {selectedDealerName || 'Select location'}
            </span>
            <ChevronDown
              size={16}
              className={cn(
                'transition-transform duration-300',
                open ? `rotate-180` : 'rotate-0'
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side={'bottom'}
          matchTriggerWidth={true}
          className={'rounded-md p-0'}
          onOpenAutoFocus={() => {
            rowVirtualizer.measure();
          }}
        >
          <div className='border-b border-border px-2 py-1 flex items-center'>
            <SearchIcon size={18} className='text-gray-500' />
            <Input
              placeholder={'Search location'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={'border-none focus-visible:ring-0 shadow-none'}
            />
          </div>
          <div
            ref={parentRef}
            style={{
              height: filteredLocations.length ? VIEWPORT_HEIGHT : 100,
              overflow: 'auto',
            }}
            className={cn(
              'p-2',
              !filteredLocations.length && 'flex items-center justify-center'
            )}
          >
            {filteredLocations.length ? (
              <div
                style={{
                  height: rowVirtualizer.getTotalSize(),
                  position: 'relative',
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const location = filteredLocations[virtualRow.index];
                  const isSelected = location.dealer_id === value;

                  return (
                    <div
                      key={location.dealer_id}
                      data-selected={isSelected}
                      onClick={() => {
                        if (!location.has_data) {
                          toast.error('Incomplete Location Details', {
                            description:
                              'This location is missing required information. Please complete the details before proceeding',
                          });
                          return;
                        }

                        const landingPageUrl = location.landing_page_url;

                        setFormData((prev) => ({
                          ...prev,
                          location: location.dealer_id,
                          ...('landingPgURL' in prev && {
                            landingPgURL: landingPageUrl || prev.landingPgURL,
                          }),
                        }));

                        setValidationErrors((prev) => ({
                          ...prev,
                          location: '',
                          ...(landingPageUrl && { landingPgURL: '' }),
                        }));

                        setOpen(false);
                      }}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: ITEM_HEIGHT,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                      className='px-3 flex items-center cursor-pointer text-gray-900 justify-between gap-2 hover:bg-gray-100 data-[selected=true]:bg-gray-100 text-sm rounded-md'
                    >
                      <div className='flex-1 overflow-hidden flex items-center gap-2'>
                        <span className='truncate'>
                          {location?.dealer_name}
                        </span>
                        <span className='truncate'>@{location.dealer_id}</span>
                      </div>
                      {!location.has_data && (
                        <Tooltip>
                          <TooltipTrigger>
                            <TriangleAlertIcon className='text-warning-500 size-4 shrink-0' />
                          </TooltipTrigger>
                          <TooltipContent side={'bottom'} align={'center'}>
                            Incomplete Location Details.
                          </TooltipContent>
                        </Tooltip>
                      )}
                      {isSelected && (
                        <CheckIcon size={18} className='size-5 text-gray-500' />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className='text-center text-sm text-gray-500'>
                No location found.
              </p>
            )}
          </div>
        </PopoverContent>
      </Popover>
      {error && <ErrorMessage message={error} className={'ml-2'} />}
    </LabelInputContainer>
  );
};

export const CreateCampaignClientComment = ({ value, onChange, error }) => {
  return (
    <LabelInputContainer>
      <Label htmlFor={'client-comment'}>Client Comment</Label>
      <Textarea
        id={'client-comment'}
        name={'clientComment'}
        placeholder={'Write here...'}
        value={value}
        onChange={onChange}
        className={'min-h-38.5'}
      />
      {error && <ErrorMessage message={error} className={'ml-2'} />}
    </LabelInputContainer>
  );
};

export const CreateCampaignHeadlines = ({
  headlines,
  setFormData,
  error,
  setValidationErrors,
  maxHeadlines,
  minHeadlines,
}) => {
  const {
    aiSuggestions: { headlines: aiSuggestions },
  } = useCreateCampaign();
  return (
    <LabelInputContainer className={'flex flex-col gap-4'}>
      <p className={cn(labelVariants(), 'text-gray-900 font-semibold')}>
        <span>
          Headlines <span className='text-brand-600'>*</span>
        </span>

        <span className='ml-2 text-sm font-normal text-gray-500'>
          (Minimum {minHeadlines})
        </span>
      </p>
      {headlines.map((headline, idx) => {
        const value = headline.value;
        const lastItemIdx = headlines.length - 1;
        const isLastItem = lastItemIdx === idx;

        const showAddBtn = isLastItem && headlines.length < maxHeadlines;

        const showCancelBtn = idx >= minHeadlines;

        const handleAddNewHeadline = () => {
          let value = '';

          if (aiSuggestions.length) {
            const filteredSuggestions = aiSuggestions.filter(
              (suggestion) =>
                !headlines.some((headline) => headline.value === suggestion)
            );
            value = filteredSuggestions[0];
          }

          const newHeadline = { id: uuid(), value };

          setFormData((prevFormData) => ({
            ...prevFormData,
            headlines: [...headlines, newHeadline],
          }));
        };

        const handleDeleteHeadline = () => {
          const filteredHeadlines = headlines.filter(
            ({ id }) => headline.id !== id
          );
          setFormData((prevFormData) => ({
            ...prevFormData,
            headlines: filteredHeadlines,
          }));
        };

        const handleHeadlineChange = (e) => {
          const { value } = e.target;
          const updatedHeadlines = headlines.map((prevHeadline) =>
            prevHeadline.id === headline.id
              ? { ...prevHeadline, value }
              : prevHeadline
          );

          setFormData((prevFormData) => ({
            ...prevFormData,
            headlines: updatedHeadlines,
          }));
          setValidationErrors((prevValidationErrors) => ({
            ...prevValidationErrors,
            headlines: '',
          }));
        };

        return (
          <LabelInputContainer key={headline.id}>
            <Popover>
              <div className='grid grid-cols-[1fr_40px] items-center gap-3'>
                <PopoverAnchor asChild>
                  <div className='relative'>
                    <Input
                      placeholder={`Enter headline ${idx + 1}`}
                      value={value}
                      maxLength={30}
                      onChange={handleHeadlineChange}
                      className={aiSuggestions.length > 0 ? 'pr-8' : ''}
                    />
                    {aiSuggestions.length > 0 && (
                      <PopoverTrigger asChild>
                        <button
                          type='button'
                          className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none group'
                        >
                          <ChevronDown className='h-4 w-4 group-data-[state=open]:rotate-180 transition-transform duration-300' />
                        </button>
                      </PopoverTrigger>
                    )}
                    {showCancelBtn && (
                      <Button
                        variant={'destructive'}
                        size={'icon'}
                        className={
                          'size-4 rounded-full bg-error-600 hover:bg-error-500 active:hover:bg-error-600 text-white absolute -top-2 -right-2'
                        }
                        onClick={handleDeleteHeadline}
                      >
                        <XIcon className='size-3' />
                      </Button>
                    )}
                  </div>
                </PopoverAnchor>

                {showAddBtn && (
                  <Button
                    variant={'outline'}
                    size={'icon'}
                    className={'size-10'}
                    onClick={handleAddNewHeadline}
                  >
                    <PlusIcon className='size-4 text-[rgba(164,167,174,1)]' />
                  </Button>
                )}
              </div>
              {aiSuggestions.length > 0 && (
                <PopoverContent
                  dropdown
                  withArrow={false}
                  matchTriggerWidth
                  className='max-h-60 overflow-y-auto'
                >
                  {aiSuggestions.map((suggestion) => {
                    const isUsed = headlines.some(
                      (h) => h.value === suggestion
                    );
                    return (
                      <button
                        key={suggestion}
                        type='button'
                        disabled={isUsed}
                        className={cn(
                          'w-full text-left px-3 py-2 text-sm rounded-sm',
                          isUsed
                            ? 'opacity-40 cursor-not-allowed text-gray-400'
                            : 'hover:bg-gray-50 cursor-pointer text-gray-900'
                        )}
                        onClick={() => {
                          if (isUsed) return;
                          const updatedHeadlines = headlines.map((h) =>
                            h.id === headline.id
                              ? { ...h, value: suggestion }
                              : h
                          );
                          setFormData((prev) => ({
                            ...prev,
                            headlines: updatedHeadlines,
                          }));
                          setValidationErrors((prev) => ({
                            ...prev,
                            headlines: '',
                          }));
                        }}
                      >
                        {suggestion}
                      </button>
                    );
                  })}
                </PopoverContent>
              )}
            </Popover>
            <div className='grid grid-cols-[1fr_40px] gap-3'>
              <div className='flex items-center justify-between text-xs font-body text-gray-600 pl-2'>
                <p>Max 30 characters</p>
                <p>{`${headline.value.length}/30`}</p>
              </div>
            </div>
          </LabelInputContainer>
        );
      })}
      {error && <ErrorMessage message={error} />}
    </LabelInputContainer>
  );
};

export const CreateCampaignDescriptions = ({
  descriptions,
  setFormData,
  error,
  setValidationErrors,
  maxDescriptions,
  minDescriptions,
}) => {
  const {
    aiSuggestions: { descriptions: aiSuggestions },
  } = useCreateCampaign();
  return (
    <LabelInputContainer className={'flex flex-col gap-4'}>
      <p className={cn(labelVariants(), 'text-gray-900 font-semibold')}>
        <span>
          Descriptions <span className='text-brand-600'>*</span>
        </span>

        <span className='ml-2 text-sm font-normal text-gray-500'>
          (Minimum {minDescriptions})
        </span>
      </p>
      {descriptions.map((description, idx) => {
        const lastItemIdx = descriptions.length - 1;
        const isLastItem = lastItemIdx === idx;

        const showAddBtn = isLastItem && descriptions.length < maxDescriptions;

        const showCancelBtn = idx >= minDescriptions;

        const handleAddNewDescription = () => {
          let value = '';

          if (aiSuggestions.length) {
            const filteredSuggestions = aiSuggestions.filter(
              (suggestion) =>
                !descriptions.some(
                  (description) => description.value === suggestion
                )
            );
            value = filteredSuggestions[0];
          }

          const newDescription = {
            id: uuid(),
            value,
          };

          setFormData((prevFormData) => ({
            ...prevFormData,
            descriptions: [...descriptions, newDescription],
          }));
        };

        const handleDeleteDescription = () => {
          const filtertedDescription = descriptions.filter(
            ({ id }) => description.id !== id
          );
          setFormData((prevFormData) => ({
            ...prevFormData,
            descriptions: filtertedDescription,
          }));
        };

        const handleHeadlineChange = (e) => {
          const { value } = e.target;
          const updatedDescriptions = descriptions.map((prevDescription) =>
            prevDescription.id === description.id
              ? { ...prevDescription, value }
              : prevDescription
          );

          setFormData((prevFormData) => ({
            ...prevFormData,
            descriptions: updatedDescriptions,
          }));
          setValidationErrors((prevValidationErrors) => ({
            ...prevValidationErrors,
            descriptions: '',
          }));
        };

        return (
          <LabelInputContainer key={description.id}>
            <Popover>
              <div className='grid grid-cols-[1fr_40px] items-start gap-3'>
                <PopoverAnchor asChild>
                  <div className='relative'>
                    <Textarea
                      placeholder={`Enter description ${idx + 1}`}
                      value={description.value}
                      maxLength={90}
                      onChange={handleHeadlineChange}
                      className={cn(
                        'min-h-[94px]',
                        aiSuggestions.length > 0 && 'pr-8'
                      )}
                    />
                    {aiSuggestions.length > 0 && (
                      <PopoverTrigger asChild>
                        <button
                          type='button'
                          className='absolute right-2 top-3 text-gray-400 hover:text-gray-600 focus:outline-none group'
                        >
                          <ChevronDown className='h-4 w-4 group-data-[state=open]:rotate-180 transition-transform duration-300' />
                        </button>
                      </PopoverTrigger>
                    )}
                    {showCancelBtn && (
                      <Button
                        variant={'destructive'}
                        size={'icon'}
                        className={
                          'size-4 rounded-full bg-error-600 hover:bg-error-500 active:hover:bg-error-600 text-white absolute -top-2 -right-2'
                        }
                        onClick={handleDeleteDescription}
                      >
                        <XIcon className='size-3' />
                      </Button>
                    )}
                  </div>
                </PopoverAnchor>
                {showAddBtn && (
                  <Button
                    variant={'outline'}
                    size={'icon'}
                    className={'size-10'}
                    onClick={handleAddNewDescription}
                  >
                    <PlusIcon className='size-4 text-[rgba(164,167,174,1)]' />
                  </Button>
                )}
              </div>
              {aiSuggestions.length > 0 && (
                <PopoverContent
                  dropdown
                  withArrow={false}
                  matchTriggerWidth
                  className='max-h-60 overflow-y-auto'
                >
                  {aiSuggestions.map((suggestion) => {
                    const isUsed = descriptions.some(
                      (d) => d.value === suggestion
                    );
                    return (
                      <button
                        key={suggestion}
                        type='button'
                        disabled={isUsed}
                        className={cn(
                          'w-full text-left px-3 py-2 text-sm rounded-sm',
                          isUsed
                            ? 'opacity-40 cursor-not-allowed text-gray-400'
                            : 'hover:bg-gray-50 cursor-pointer text-gray-900'
                        )}
                        onClick={() => {
                          if (isUsed) return;
                          const updatedDescriptions = descriptions.map((d) =>
                            d.id === description.id
                              ? { ...d, value: suggestion }
                              : d
                          );
                          setFormData((prev) => ({
                            ...prev,
                            descriptions: updatedDescriptions,
                          }));
                          setValidationErrors((prev) => ({
                            ...prev,
                            descriptions: '',
                          }));
                        }}
                      >
                        {suggestion}
                      </button>
                    );
                  })}
                </PopoverContent>
              )}
            </Popover>
            <div className='grid grid-cols-[1fr_40px] gap-3'>
              <div className='flex items-center justify-between text-xs font-body text-gray-600 pl-2'>
                <p>Max 90 characters</p>
                <p>{`${description.value.length}/90`}</p>
              </div>
            </div>
          </LabelInputContainer>
        );
      })}
      {error && <ErrorMessage message={error} />}
    </LabelInputContainer>
  );
};

export const CreateCampaignLongHeadlines = ({
  longHeadlines,
  setFormData,
  error,
  setValidationErrors,
  maxLongHeadlines,
  minLongHeadlines,
}) => {
  const {
    aiSuggestions: { longHeadlines: aiSuggestions },
  } = useCreateCampaign();
  return (
    <LabelInputContainer className='flex flex-col gap-4'>
      <p className={cn(labelVariants(), 'text-gray-900 font-semibold')}>
        <span>
          Long Headlines <span className='text-brand-600'>*</span>
        </span>

        <span className='ml-2 text-sm font-normal text-gray-500'>
          (Minimum {minLongHeadlines})
        </span>
      </p>

      {longHeadlines.map((longHeadline, idx) => {
        const lastItemIdx = longHeadlines.length - 1;
        const isLastItem = lastItemIdx === idx;

        const showAddBtn =
          isLastItem && longHeadlines.length < maxLongHeadlines;

        const showCancelBtn = idx >= minLongHeadlines;

        const handleAddNewLongHeadline = () => {
          let value = '';

          if (aiSuggestions.length) {
            const filteredSuggestions = aiSuggestions.filter(
              (suggestion) =>
                !longHeadlines.some(
                  (longHeadline) => longHeadline.value === suggestion
                )
            );
            value = filteredSuggestions[0];
          }

          const newLongHeadline = {
            id: uuid(),
            value,
          };

          setFormData((prevFormData) => ({
            ...prevFormData,
            longHeadlines: [...longHeadlines, newLongHeadline],
          }));
        };

        const handleDeleteLongHeadline = () => {
          const filteredLongHeadlines = longHeadlines.filter(
            ({ id }) => id !== longHeadline.id
          );

          setFormData((prevFormData) => ({
            ...prevFormData,
            longHeadlines: filteredLongHeadlines,
          }));
        };

        const handleHeadlineChange = (e) => {
          const { value } = e.target;

          const updatedLongHeadlines = longHeadlines.map((prevLongHeadline) =>
            prevLongHeadline.id === longHeadline.id
              ? { ...prevLongHeadline, value }
              : prevLongHeadline
          );

          setFormData((prevFormData) => ({
            ...prevFormData,
            longHeadlines: updatedLongHeadlines,
          }));

          setValidationErrors((prevValidationErrors) => ({
            ...prevValidationErrors,
            longHeadlines: '',
          }));
        };

        return (
          <LabelInputContainer key={longHeadline.id}>
            <Popover>
              <div className='grid grid-cols-[1fr_40px] items-start gap-3'>
                <PopoverAnchor asChild>
                  <div className='relative'>
                    <Textarea
                      placeholder={`Enter long headline ${idx + 1}`}
                      value={longHeadline.value}
                      maxLength={90}
                      onChange={handleHeadlineChange}
                      className={cn(
                        'min-h-[94px]',
                        aiSuggestions.length > 0 && 'pr-8'
                      )}
                    />
                    {aiSuggestions.length > 0 && (
                      <PopoverTrigger asChild>
                        <button
                          type='button'
                          className='absolute right-2 top-3 text-gray-400 hover:text-gray-600 focus:outline-none group'
                        >
                          <ChevronDown className='h-4 w-4 group-data-[state=open]:rotate-180 transition-transform duration-300' />
                        </button>
                      </PopoverTrigger>
                    )}
                    {showCancelBtn && (
                      <Button
                        variant='destructive'
                        size='icon'
                        className='size-4 rounded-full bg-error-600 hover:bg-error-500 active:hover:bg-error-600 text-white absolute -top-2 -right-2'
                        onClick={handleDeleteLongHeadline}
                      >
                        <XIcon className='size-3' />
                      </Button>
                    )}
                  </div>
                </PopoverAnchor>

                {showAddBtn && (
                  <Button
                    variant='outline'
                    size='icon'
                    className='size-10'
                    onClick={handleAddNewLongHeadline}
                  >
                    <PlusIcon className='size-4 text-[rgba(164,167,174,1)]' />
                  </Button>
                )}
              </div>
              {aiSuggestions.length > 0 && (
                <PopoverContent
                  dropdown
                  withArrow={false}
                  matchTriggerWidth
                  className='max-h-60 overflow-y-auto'
                >
                  {aiSuggestions.map((suggestion) => {
                    const isUsed = longHeadlines.some(
                      (lh) => lh.value === suggestion
                    );
                    return (
                      <button
                        key={suggestion}
                        type='button'
                        disabled={isUsed}
                        className={cn(
                          'w-full text-left px-3 py-2 text-sm rounded-sm',
                          isUsed
                            ? 'opacity-40 cursor-not-allowed text-gray-400'
                            : 'hover:bg-gray-50 cursor-pointer text-gray-900'
                        )}
                        onClick={() => {
                          if (isUsed) return;
                          const updatedLongHeadlines = longHeadlines.map(
                            (lh) =>
                              lh.id === longHeadline.id
                                ? { ...lh, value: suggestion }
                                : lh
                          );
                          setFormData((prev) => ({
                            ...prev,
                            longHeadlines: updatedLongHeadlines,
                          }));
                          setValidationErrors((prev) => ({
                            ...prev,
                            longHeadlines: '',
                          }));
                        }}
                      >
                        {suggestion}
                      </button>
                    );
                  })}
                </PopoverContent>
              )}
            </Popover>
            <div className='grid grid-cols-[1fr_40px] gap-3'>
              <div className='flex items-center justify-between text-xs font-body text-gray-600 pl-2'>
                <p>Max 90 characters</p>
                <p>{`${longHeadline.value.length}/90`}</p>
              </div>
            </div>
          </LabelInputContainer>
        );
      })}

      {error && <ErrorMessage message={error} />}
    </LabelInputContainer>
  );
};
