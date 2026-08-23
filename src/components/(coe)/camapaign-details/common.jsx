'use client';

import { CheckIcon, ChevronDownIcon, PlusIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/components/ui/error-message';
import { Input } from '@/components/ui/input';
import {
  Label,
  LabelInputContainer,
  labelVariants,
} from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useCoeCampaignDetails } from './form';

export const CoeReadOnlyField = ({
  label,
  value,
  className,
  labelClassName,
}) => {
  return (
    <LabelInputContainer>
      <p className={cn(labelVariants(), labelClassName)}>{label}</p>
      <p className={cn(className)}>{value}</p>
    </LabelInputContainer>
  );
};

export const CoeFormMatchType = ({ options, value = '', setFormData }) => {
  const { validationErrors, setValidationErrors } = useCoeCampaignDetails();

  return (
    <LabelInputContainer>
      <p className={cn(labelVariants())}>Match Type</p>
      <Select
        value={value}
        onValueChange={(value) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            matchType: value,
          }));
          setValidationErrors((prevValidationErrors) => ({
            ...prevValidationErrors,
            matchType: '',
          }));
        }}
      >
        <SelectTrigger className={'h-10 text-sm'}>
          <SelectValue placeholder={'Select match type'} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => {
            return (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {validationErrors?.matchType && (
        <ErrorMessage message={validationErrors?.matchType} />
      )}
    </LabelInputContainer>
  );
};

export const CoeFormNetworkType = ({ options, value, setFormData }) => {
  const { validationErrors, setValidationErrors } = useCoeCampaignDetails();

  const networkTypes = options.map((option) => ({
    label: option,
    value: option,
  }));

  const handleNetworkType = (newNetworkTypes) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      networkTypes: newNetworkTypes,
    }));
    setValidationErrors((prevValidationErrors) => ({
      ...prevValidationErrors,
      networkTypes: '',
    }));
  };

  return (
    <LabelInputContainer>
      <p className={cn(labelVariants())}>Network</p>
      {/* <div className='flex gap-3 flex-wrap'>
        {options.map((option) => {
          return (
            <Badge key={option} variant={'otuline'}>
              {option}
            </Badge>
          );
        })}
      </div> */}
      <MultiSelect
        options={networkTypes}
        value={value}
        onChange={handleNetworkType}
      />
      {validationErrors?.networkTypes && (
        <ErrorMessage message={validationErrors?.networkTypes} />
      )}
    </LabelInputContainer>
  );
};

export const CoeFormSubIndustryKerwords = ({ options, value, setFormData }) => {
  const { validationErrors, setValidationErrors } = useCoeCampaignDetails();

  const subIndustryKeywords = options.map((option) => ({
    label: option.keyword,
    value: option.keyword,
  }));

  const handleSubInddustrykeywords = (newSubIndustryKeywords) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      subIndustryKeywords: newSubIndustryKeywords,
    }));
    setValidationErrors((prevValidationErrors) => ({
      ...prevValidationErrors,
      subIndustryKeywords: '',
    }));
  };

  return (
    <LabelInputContainer>
      <p className={cn(labelVariants())}>Sub Industry Keywords</p>
      <MultiSelect
        options={subIndustryKeywords}
        value={value}
        onChange={handleSubInddustrykeywords}
      />
      {validationErrors?.subIndustryKeywords && (
        <ErrorMessage message={validationErrors?.subIndustryKeywords} />
      )}
    </LabelInputContainer>
  );
};

export const CoeFormLandingPageKerwords = ({ options, value, setFormData }) => {
  const { validationErrors, setValidationErrors } = useCoeCampaignDetails();

  const landingPgKeywords = options.map((option) => ({
    label: option.keyword,
    value: option.keyword,
  }));

  const handleLandingPgKeywords = (newLandingPgKeywords) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      landingPgKeywords: newLandingPgKeywords,
    }));
    setValidationErrors((prevValidationErrors) => ({
      ...prevValidationErrors,
      landingPgKeywords: '',
    }));
  };

  return (
    <LabelInputContainer>
      <p className={cn(labelVariants())}>Landing Page Keywords</p>
      <MultiSelect
        options={landingPgKeywords}
        value={value}
        onChange={handleLandingPgKeywords}
      />
      {validationErrors?.landingPgKeywords && (
        <ErrorMessage message={validationErrors?.landingPgKeywords} />
      )}
    </LabelInputContainer>
  );
};

export const CoeFormAdName = ({
  label = 'Ad Name',
  placeholder = 'Enter ad name',
  value,
  setFormData,
}) => {
  const { validationErrors, setValidationErrors } = useCoeCampaignDetails();

  return (
    <LabelInputContainer>
      <Label htmlFor={'ad-name'}>{label}</Label>
      <Input
        id={'ad-name'}
        placeholder={placeholder}
        className={'h-10'}
        value={value ?? ''}
        onChange={(e) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            adName: e.target.value,
          }));
          setValidationErrors((prevValidationErrors) => ({
            ...prevValidationErrors,
            adName: '',
          }));
        }}
      />
      {validationErrors?.adName && (
        <ErrorMessage message={validationErrors?.adName} />
      )}
    </LabelInputContainer>
  );
};

export const CoeFormBiddingStrategy = ({
  options,
  value = '',
  setFormData,
}) => {
  const { validationErrors, setValidationErrors } = useCoeCampaignDetails();

  return (
    <LabelInputContainer>
      <p className={cn(labelVariants())}>Bidding Strategy</p>
      <Select
        value={value}
        onValueChange={(newValue) => {
          const isStrategyMaxConversion = newValue === 'Maximize Conversions';

          setFormData((prevFormData) => ({
            ...prevFormData,
            biddingStrategy: newValue,
            maxCPCBid: isStrategyMaxConversion ? '' : prevFormData.maxCPCBid,
          }));

          setValidationErrors((prevValidationErrors) => ({
            ...prevValidationErrors,
            biddingStrategy: '',
            maxCPCBid: isStrategyMaxConversion
              ? ''
              : prevValidationErrors.maxCPCBid,
          }));
        }}
      >
        <SelectTrigger className={'text-sm font-normal h-10'}>
          <SelectValue placeholder={'Select bidding strategy'} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => {
            return (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {validationErrors?.biddingStrategy && (
        <ErrorMessage message={validationErrors?.biddingStrategy} />
      )}
    </LabelInputContainer>
  );
};

export const CoeFormHeadlines = ({
  headlines,
  selectedHeadlines,
  setFormData,
  maxHeadlines,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const { validationErrors, setValidationErrors } = useCoeCampaignDetails();

  const handleHeadlineAdd = () => {
    const headlineSchema = z.string().trim().min(1, "Headline can't be empty.");

    const result = headlineSchema.safeParse(value);

    if (result.success) {
      const newHeadline = { id: uuid(), value: result.data, isNew: true };

      setFormData((prevFormData) => ({
        ...prevFormData,
        headlines: [...prevFormData.headlines, newHeadline],
      }));
      setValue('');
    } else {
      const errorMsg = result.error.issues[0].message;
      setError(errorMsg);
    }
  };

  const handleClose = (value) => {
    if (!value) {
      setValue('');
      setError('');
    }
    setOpen(value);
  };

  const canAddNewHeadline = headlines.length >= maxHeadlines;

  return (
    <LabelInputContainer>
      <p className={cn(labelVariants())}>Headlines</p>
      <Popover open={open} onOpenChange={handleClose}>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={
              'shadow-xs px-3 justify-between overflow-hidden font-normal h-10'
            }
          >
            <span className='text-gray-500 truncate'>Select Headlines</span>
            <ChevronDownIcon
              size={16}
              className={cn(
                'transition-transform duration-300 text-gray-400 shrink-0',
                open ? `rotate-180` : 'rotate-0'
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side={'bottom'}
          matchTriggerWidth={true}
          className={'rounded-md p-0'}
        >
          <div className='border-b border-border p-2'>
            <LabelInputContainer>
              <div className='flex items-center gap-2'>
                <Input
                  value={value}
                  disabled={canAddNewHeadline}
                  maxLength={30}
                  placeholder={'Enter headling'}
                  className={'flex-1'}
                  onChange={(e) => {
                    setValue(e.target.value);
                    setError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); // prevents form submit
                      handleHeadlineAdd();
                    }
                  }}
                />
                <Button
                  disabled={canAddNewHeadline}
                  variant={'outline'}
                  size={'icon'}
                  className={'shrink-0'}
                  onClick={handleHeadlineAdd}
                >
                  <PlusIcon strokeWidth={1.5} />
                </Button>
              </div>
              {error && <ErrorMessage message={error} className={'ml-2'} />}
            </LabelInputContainer>
          </div>
          <div className='p-2 flex flex-col max-h-[200px] overflow-y-auto'>
            {headlines.map((headline) => {
              const isSelected = selectedHeadlines.find(
                (selectedHeadline) => selectedHeadline.id === headline.id
              );

              const handleSelect = () => {
                if (isSelected) {
                  const filteredHeadlines = selectedHeadlines.filter(
                    (selectedHeadline) => selectedHeadline.id !== headline.id
                  );

                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    selectedHeadlines: filteredHeadlines,
                  }));
                } else {
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    selectedHeadlines: [
                      ...prevFormData.selectedHeadlines,
                      headline,
                    ],
                  }));
                }
                setValidationErrors((prevValidationErrors) => ({
                  ...prevValidationErrors,
                  selectedHeadlines: '',
                }));
              };

              const handleRemove = (e) => {
                e.stopPropagation();

                const filteredHeadlines = headlines.filter(
                  (prevHeadline) => prevHeadline.id !== headline.id
                );

                if (isSelected) {
                  const filteredSelectedHeadlines = selectedHeadlines.filter(
                    (selectedHeadline) => selectedHeadline.id !== headline.id
                  );

                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    headlines: filteredHeadlines,
                    selectedHeadlines: filteredSelectedHeadlines,
                  }));
                } else {
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    headlines: filteredHeadlines,
                  }));
                }

                setValidationErrors((prevValidationErrors) => ({
                  ...prevValidationErrors,
                  selectedHeadlines: '',
                }));
              };

              return (
                <div
                  key={headline.id}
                  className='h-10 rounded-md flex items-center justify-between gap-3 px-3 cursor-pointer text-gray-900 hover:bg-gray-100 data-[selected=true]:bg-gray-100 shrink-0 relative'
                  onClick={handleSelect}
                >
                  <p className='text-sm flex-1 truncate'>{headline.value}</p>
                  {isSelected && (
                    <CheckIcon className='size-4 text-brand-500' />
                  )}
                  {headline.isNew && (
                    <Button
                      variant={'destructive'}
                      size={'icon'}
                      className={
                        'size-4 rounded-full bg-error-600 hover:bg-error-500 active:hover:bg-error-600 text-white absolute -top-2 -right-2'
                      }
                      onClick={handleRemove}
                    >
                      <XIcon className='size-3' />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
      {!!selectedHeadlines.length && (
        <div className='flex flex-wrap gap-3'>
          {selectedHeadlines.slice(0, 2).map((selectedHeadline) => {
            const handleRemove = () => {
              const filteredSelectedHeadlines = selectedHeadlines.filter(
                ({ id }) => selectedHeadline.id !== id
              );

              setFormData((prevFormData) => ({
                ...prevFormData,
                selectedHeadlines: filteredSelectedHeadlines,
              }));
            };
            return (
              <Badge
                key={selectedHeadline.id}
                variant={'outline'}
                className={'max-w-[156px]'}
              >
                <span className='flex-1 truncate'>
                  {selectedHeadline.value}
                </span>
                <Button
                  variant={'destructive'}
                  size={'icon'}
                  className={'size-4 shrink-0'}
                  onClick={handleRemove}
                >
                  <XIcon className='size-3' />
                </Button>
              </Badge>
            );
          })}
          {!!selectedHeadlines.slice(2).length && (
            <p className='text-sm font-medium'>
              {' '}
              and +{selectedHeadlines.slice(2).length} headlines
            </p>
          )}
        </div>
      )}
      {validationErrors?.selectedHeadlines && (
        <ErrorMessage message={validationErrors?.selectedHeadlines} />
      )}
    </LabelInputContainer>
  );
};

export const CoeFormDescriptions = ({
  descriptions,
  selectedDescriptions,
  setFormData,
  maxDescriptions,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const { validationErrors, setValidationErrors } = useCoeCampaignDetails();

  const handleDescriptionAdd = () => {
    const descriptionSchema = z
      .string()
      .trim()
      .min(1, "Description can't be empty.");

    const result = descriptionSchema.safeParse(value);

    if (result.success) {
      const newDescription = { id: uuid(), value: result.data, isNew: true };

      setFormData((prevFormData) => ({
        ...prevFormData,
        descriptions: [...prevFormData.descriptions, newDescription],
      }));
      setValue('');
    } else {
      const errorMsg = result.error.issues[0].message;
      setError(errorMsg);
    }
  };

  const handleClose = (value) => {
    if (!value) {
      setValue('');
      setError('');
    }
    setOpen(value);
  };

  const canAddNewDescription = descriptions.length >= maxDescriptions;

  return (
    <LabelInputContainer>
      <p className={cn(labelVariants())}>Descriptions</p>
      <Popover open={open} onOpenChange={handleClose}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className='shadow-xs justify-between overflow-hidden font-normal h-10 px-3'
          >
            <span className='text-gray-500 truncate'>Select Descriptions</span>
            <ChevronDownIcon
              size={16}
              className={cn(
                'transition-transform duration-300 text-gray-400 shrink-0',
                open ? 'rotate-180' : 'rotate-0'
              )}
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          side='bottom'
          matchTriggerWidth={true}
          className='rounded-md p-0'
        >
          <div className='border-b border-border p-2'>
            <LabelInputContainer>
              <div className='flex items-center gap-2'>
                <Input
                  value={value}
                  disabled={canAddNewDescription}
                  maxLength={90}
                  placeholder='Enter description'
                  className='flex-1'
                  onChange={(e) => {
                    setValue(e.target.value);
                    setError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleDescriptionAdd();
                    }
                  }}
                />

                <Button
                  disabled={canAddNewDescription}
                  variant='outline'
                  size='icon'
                  className='shrink-0'
                  onClick={handleDescriptionAdd}
                >
                  <PlusIcon strokeWidth={1.5} />
                </Button>
              </div>

              {error && <ErrorMessage message={error} className='ml-2' />}
            </LabelInputContainer>
          </div>

          <div className='p-2 flex flex-col max-h-[200px] overflow-y-auto'>
            {descriptions.map((description) => {
              const isSelected = selectedDescriptions.find(
                (selectedDescription) =>
                  selectedDescription.id === description.id
              );

              const handleSelect = () => {
                if (isSelected) {
                  const filteredDescriptions = selectedDescriptions.filter(
                    (selectedDescription) =>
                      selectedDescription.id !== description.id
                  );

                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    selectedDescriptions: filteredDescriptions,
                  }));
                } else {
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    selectedDescriptions: [
                      ...prevFormData.selectedDescriptions,
                      description,
                    ],
                  }));
                }

                setValidationErrors((prevValidationErrors) => ({
                  ...prevValidationErrors,
                  selectedDescriptions: '',
                }));
              };

              const handleRemove = (e) => {
                e.stopPropagation();

                const filteredDescriptions = descriptions.filter(
                  (prevDescription) => prevDescription.id !== description.id
                );

                if (isSelected) {
                  const filteredSelectedDescriptions =
                    selectedDescriptions.filter(
                      (selectedDescription) =>
                        selectedDescription.id !== description.id
                    );

                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    descriptions: filteredDescriptions,
                    selectedDescriptions: filteredSelectedDescriptions,
                  }));
                } else {
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    descriptions: filteredDescriptions,
                  }));
                }

                setValidationErrors((prevValidationErrors) => ({
                  ...prevValidationErrors,
                  selectedDescriptions: '',
                }));
              };

              return (
                <div
                  key={description.id}
                  className='h-10 rounded-md flex items-center justify-between gap-3 px-3 cursor-pointer text-gray-900 hover:bg-gray-100 data-[selected=true]:bg-gray-100 shrink-0 relative'
                  onClick={handleSelect}
                >
                  <p className='text-sm flex-1 truncate'>{description.value}</p>

                  {isSelected && (
                    <CheckIcon className='size-4 text-brand-500' />
                  )}

                  {description.isNew && (
                    <Button
                      variant='destructive'
                      size='icon'
                      className='size-4 rounded-full bg-error-600 hover:bg-error-500 active:hover:bg-error-600 text-white absolute -top-2 -right-2'
                      onClick={handleRemove}
                    >
                      <XIcon className='size-3' />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
      {!!selectedDescriptions.length && (
        <div className='flex flex-wrap gap-3'>
          {selectedDescriptions.slice(0, 2).map((selectedDescription) => {
            const handleRemove = () => {
              const filteredSelectedDescriptions = selectedDescriptions.filter(
                ({ id }) => selectedDescription.id !== id
              );

              setFormData((prevFormData) => ({
                ...prevFormData,
                selectedDescriptions: filteredSelectedDescriptions,
              }));
            };

            return (
              <Badge
                key={selectedDescription.id}
                variant='outline'
                className={'max-w-[156px]'}
              >
                <span className='flex-1 truncate'>
                  {selectedDescription.value}
                </span>
                <Button
                  variant='destructive'
                  size='icon'
                  className='size-4 shrink-0'
                  onClick={handleRemove}
                >
                  <XIcon className='size-3' />
                </Button>
              </Badge>
            );
          })}

          {!!selectedDescriptions.slice(2).length && (
            <p className='text-sm font-medium'>
              and +{selectedDescriptions.slice(2).length} descriptions
            </p>
          )}
        </div>
      )}
      {validationErrors?.selectedDescriptions && (
        <ErrorMessage message={validationErrors?.selectedDescriptions} />
      )}
    </LabelInputContainer>
  );
};

export const CoeFormLongHeadlines = ({
  longHeadlines,
  selectedLongHeadlines,
  setFormData,
  maxHeadlines,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const { validationErrors, setValidationErrors } = useCoeCampaignDetails();

  const handleHeadlineAdd = () => {
    const headlineSchema = z
      .string()
      .trim()
      .min(1, "Long headline can't be empty.");

    const result = headlineSchema.safeParse(value);

    if (result.success) {
      const newHeadline = { id: uuid(), value: result.data, isNew: true };

      setFormData((prevFormData) => ({
        ...prevFormData,
        longHeadlines: [...prevFormData.longHeadlines, newHeadline],
      }));

      setValue('');
    } else {
      const errorMsg = result.error.issues[0].message;
      setError(errorMsg);
    }
  };

  const handleClose = (value) => {
    if (!value) {
      setValue('');
      setError('');
    }
    setOpen(value);
  };

  const canAddNewHeadline = longHeadlines.length >= maxHeadlines;

  return (
    <LabelInputContainer>
      <p className={cn(labelVariants())}>Long Headlines</p>

      <Popover open={open} onOpenChange={handleClose}>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className='shadow-xs px-3 justify-between overflow-hidden font-normal h-10'
          >
            <span className='text-gray-500 truncate'>
              Select Long Headlines
            </span>

            <ChevronDownIcon
              size={16}
              className={cn(
                'transition-transform duration-300 text-gray-400 shrink-0',
                open ? 'rotate-180' : 'rotate-0'
              )}
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          side={'bottom'}
          matchTriggerWidth
          className='rounded-md p-0'
        >
          <div className='border-b border-border p-2'>
            <LabelInputContainer>
              <div className='flex items-center gap-2'>
                <Input
                  value={value}
                  disabled={canAddNewHeadline}
                  maxLength={90}
                  placeholder={'Enter long headline'}
                  className='flex-1'
                  onChange={(e) => {
                    setValue(e.target.value);
                    setError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleHeadlineAdd();
                    }
                  }}
                />

                <Button
                  disabled={canAddNewHeadline}
                  variant='outline'
                  size='icon'
                  className='shrink-0'
                  onClick={handleHeadlineAdd}
                >
                  <PlusIcon strokeWidth={1.5} />
                </Button>
              </div>

              {error && <ErrorMessage message={error} className='ml-2' />}
            </LabelInputContainer>
          </div>

          <div className='p-2 flex flex-col max-h-[200px] overflow-y-auto'>
            {longHeadlines.map((headline) => {
              const isSelected = selectedLongHeadlines.find(
                (selected) => selected.id === headline.id
              );

              const handleSelect = () => {
                if (isSelected) {
                  const filtered = selectedLongHeadlines.filter(
                    (item) => item.id !== headline.id
                  );

                  setFormData((prev) => ({
                    ...prev,
                    selectedLongHeadlines: filtered,
                  }));
                } else {
                  setFormData((prev) => ({
                    ...prev,
                    selectedLongHeadlines: [
                      ...prev.selectedLongHeadlines,
                      headline,
                    ],
                  }));
                }

                setValidationErrors((prev) => ({
                  ...prev,
                  selectedLongHeadlines: '',
                }));
              };

              const handleRemove = (e) => {
                e.stopPropagation();

                const filteredHeadlines = longHeadlines.filter(
                  (item) => item.id !== headline.id
                );

                const filteredSelected = selectedLongHeadlines.filter(
                  (item) => item.id !== headline.id
                );

                setFormData((prev) => ({
                  ...prev,
                  longHeadlines: filteredHeadlines,
                  selectedLongHeadlines: filteredSelected,
                }));

                setValidationErrors((prev) => ({
                  ...prev,
                  selectedLongHeadlines: '',
                }));
              };

              return (
                <div
                  key={headline.id}
                  onClick={handleSelect}
                  className='h-10 rounded-md flex items-center justify-between gap-3 px-3 cursor-pointer hover:bg-gray-100 relative'
                >
                  <p className='text-sm flex-1 truncate'>{headline.value}</p>

                  {isSelected && (
                    <CheckIcon className='size-4 text-brand-500' />
                  )}

                  {headline.isNew && (
                    <Button
                      variant='destructive'
                      size='icon'
                      className='size-4 rounded-full absolute -top-2 -right-2'
                      onClick={handleRemove}
                    >
                      <XIcon className='size-3' />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>

      {!!selectedLongHeadlines.length && (
        <div className='flex flex-wrap gap-3'>
          {selectedLongHeadlines.slice(0, 2).map((headline) => (
            <Badge
              key={headline.id}
              variant='outline'
              className={'max-w-[156px]'}
            >
              <span className='flex-1 truncate'>{headline.value}</span>
              <Button
                variant='destructive'
                size='icon'
                className='size-4 shrink-0'
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    selectedLongHeadlines: prev.selectedLongHeadlines.filter(
                      (item) => item.id !== headline.id
                    ),
                  }))
                }
              >
                <XIcon className='size-3' />
              </Button>
            </Badge>
          ))}

          {!!selectedLongHeadlines.slice(2).length && (
            <p className='text-sm font-medium'>
              and +{selectedLongHeadlines.slice(2).length} long headlines
            </p>
          )}
        </div>
      )}

      {validationErrors?.selectedLongHeadlines && (
        <ErrorMessage message={validationErrors.selectedLongHeadlines} />
      )}
    </LabelInputContainer>
  );
};

export const CoeMaxCPCBidLimit = ({ value, setFormData }) => {
  const { validationErrors, setValidationErrors } = useCoeCampaignDetails();

  const handleMaxBid = (e) => {
    const { value } = e.target;

    // NOTE: Allow numbers with optional decimal
    const regex = /^\d*\.?\d*$/;

    if (!regex.test(value)) return;

    setFormData((prevFormData) => ({
      ...prevFormData,
      maxCPCBid: value,
    }));
    setValidationErrors((prevValidationErrors) => ({
      ...prevValidationErrors,
      maxCPCBid: '',
    }));
  };

  return (
    <LabelInputContainer>
      <Label htmlFor={'max-bid'}>Max CPC Bid Limit</Label>
      <Input
        value={value}
        placeholder={'Enter max cpc bid'}
        onChange={handleMaxBid}
      />
      {validationErrors?.maxCPCBid && (
        <ErrorMessage message={validationErrors?.maxCPCBid} />
      )}
    </LabelInputContainer>
  );
};
