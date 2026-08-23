'use client';

import { AutofillWithAiIcon } from '@/assets/icons/autofill-ai-icon';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { InfoIcon, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { ErrorMessage } from '../ui/error-message';
import { Input } from '../ui/input';
import { Label, LabelInputContainer, labelVariants } from '../ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import {
  CreateCampaignBudget,
  CreateCampaignCard,
  CreateCampaignCardHeader,
  CreateCampaignCardTitle,
  CreateCampaignClientComment,
  CreateCampaignContent,
  CreateCampaignDescriptions,
  CreateCampaignFormDate,
  CreateCampaignHeadlines,
  CreateCampaignLocations,
} from './common';
import { calculateDailyBudget } from './constants';
import { useCreateCampaign } from './form';
import { CreateCampaignPlatforms } from './plattforms';

export const CreateCampaignSearchForm = () => {
  const {
    formData,
    setFormData,
    validationErrors,
    setValidationErrors,
    handleAutofillWithAI,
    isAILoading,
  } = useCreateCampaign();

  const handleInputChange = (e) => {
    const { name, value, dataset } = e.target;

    // NOTE: Block space
    if (dataset.noSpace && /\s/.test(value)) return;

    // NOTE: Allow numbers with optional decimal
    if (dataset.numericOnly && !/^\d*\.?\d*$/.test(value)) return;

    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    setValidationErrors((prevValidationErrors) => ({
      ...prevValidationErrors,
      [name]: '',
    }));
  };

  const dailyBudget = calculateDailyBudget(
    formData.campaignBudget,
    formData.startDate,
    formData.endDate
  );

  return (
    <>
      <CreateCampaignCard>
        <CreateCampaignCardHeader>
          <CreateCampaignCardTitle>
            Fill The Campaign Details Below
          </CreateCampaignCardTitle>
        </CreateCampaignCardHeader>
        <CreateCampaignContent>
          <CreateCampaignPlatforms />
          <LabelInputContainer>
            <Label htmlFor={'campaign-name'}>
              Campaign Name <span className='text-brand-600'>*</span>
            </Label>
            <Input
              id={'campaign-name'}
              name={'campaignName'}
              placeholder={'Enter campaign name'}
              value={formData.campaignName}
              onChange={handleInputChange}
              maxLength={30}
            />
            {validationErrors.campaignName && (
              <ErrorMessage
                message={validationErrors.campaignName}
                className={'ml-2'}
              />
            )}
          </LabelInputContainer>
          <CreateCampaignFormDate />
          <CreateCampaignBudget
            label={
              <>
                Campaign Budget <span className='text-brand-600'>*</span>
              </>
            }
            htmlFor={'campaign-budget'}
            placeholder={'Specify total campaign budget'}
            name={'campaignBudget'}
            value={formData.campaignBudget}
            onChange={handleInputChange}
            error={validationErrors.campaignBudget}
          />
          <CreateCampaignBudget
            label={
              <div className='flex items-center gap-2'>
                <span>Daily Budget</span>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon size={14} className='text-warning-500' />
                  </TooltipTrigger>
                  <TooltipContent side={'bottom'} className={'max-w-xs w-full'}>
                    Daily budget is calculated based on your total campaign
                    budget and the number of days for which the campaign is run.
                  </TooltipContent>
                </Tooltip>
              </div>
            }
            htmlFor={'daily-budget'}
            placeholder={'Calculated daily budget'}
            value={dailyBudget}
            readOnly={true}
          />
          <CreateCampaignLocations
            value={formData.location}
            setFormData={setFormData}
            error={validationErrors.location}
            setValidationErrors={setValidationErrors}
          />
          <LabelInputContainer>
            <Label htmlFor={'landing-pg-url'}>
              Landing Page URL <span className='text-brand-600'>*</span>
            </Label>
            <Input
              id={'landing-pg-url'}
              name={'landingPgURL'}
              placeholder={'https://'}
              data-no-space
              value={formData.landingPgURL}
              onChange={handleInputChange}
            />
            {validationErrors.landingPgURL && (
              <ErrorMessage
                message={validationErrors.landingPgURL}
                className={'ml-2'}
              />
            )}
          </LabelInputContainer>
          <CreateCampaignClientComment
            value={formData.clientComment}
            onChange={handleInputChange}
            error={validationErrors.clientComment}
          />
        </CreateCampaignContent>
      </CreateCampaignCard>
      <CreateCampaignCard>
        <CreateCampaignCardHeader className={'flex-row justify-between'}>
          <CreateCampaignCardTitle>
            Enter Creative Details
          </CreateCampaignCardTitle>
          <Button
            variant={'outline'}
            onClick={handleAutofillWithAI}
            disabled={isAILoading}
            className={'pl-3'}
          >
            {isAILoading ? (
              <>
                <Loader2 className='animate-spin h-4 w-4 mr-2' />
                Generating...
              </>
            ) : (
              <>
                <AutofillWithAiIcon />
                Autofill with AI
              </>
            )}
          </Button>
        </CreateCampaignCardHeader>
        <CreateCampaignContent>
          <CreateCampaignHeadlines
            headlines={formData.headlines}
            setFormData={setFormData}
            minHeadlines={3}
            maxHeadlines={15}
            error={validationErrors.headlines}
            setValidationErrors={setValidationErrors}
          />
          <CreateCampaignDescriptions
            descriptions={formData.descriptions}
            setFormData={setFormData}
            minDescriptions={2}
            maxDescriptions={4}
            error={validationErrors.descriptions}
            setValidationErrors={setValidationErrors}
          />
        </CreateCampaignContent>
      </CreateCampaignCard>
    </>
  );
};

export const CreateCampaignSearchPreview = () => {
  const { formData, campaignType } = useCreateCampaign();

  const dailyBudget = calculateDailyBudget(
    formData.campaignBudget,
    formData.startDate,
    formData.endDate
  );

  return (
    <>
      <CreateCampaignCard>
        <CreateCampaignCardHeader>
          <CreateCampaignCardTitle>Campaign Details</CreateCampaignCardTitle>
        </CreateCampaignCardHeader>
        <CreateCampaignContent className={'p-6 flex flex-col gap-8'}>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6'>
            <InputPreview label='Campaign Name' value={formData.campaignName} />

            <InputPreview
              label='Start Date'
              value={format(formData.startDate, 'dd MMM yyyy')}
            />
            <InputPreview
              label='End Date'
              value={format(formData.endDate, 'dd MMM yyyy')}
            />

            <InputPreview
              label='Total Budget'
              value={`₹ ${formData.campaignBudget}`}
            />
            <InputPreview label='Daily Budget' value={`₹ ${dailyBudget}`} />
          </div>

          <InputPreview
            label='Landing Page URL'
            value={formData.landingPgURL}
          />

          <InputPreview label='Platform' value={campaignType} />

          <InputPreview label='Locations' value={formData.location} />

          <InputPreview label='Client Comment' value={formData.clientComment} />
        </CreateCampaignContent>
      </CreateCampaignCard>
      <CreateCampaignCard className={'max-w-160 w-full rounded-xl bg-white'}>
        <CreateCampaignCardHeader className={'px-6 py-5 border-b'}>
          <CreateCampaignCardTitle
            className={'text-lg text-gray-900 font-body'}
          >
            Creative Details
          </CreateCampaignCardTitle>
        </CreateCampaignCardHeader>
        <CreateCampaignContent className='p-6 flex flex-col gap-8'>
          {formData.headlines
            .filter((headline) => headline.value)
            .map((headline, idx) => {
              return (
                <InputPreview
                  key={idx}
                  label={`Heading ${idx + 1}`}
                  value={headline.value}
                />
              );
            })}

          {formData.descriptions
            .filter((description) => description.value)
            .map((description, idx) => {
              return (
                <InputPreview
                  key={idx}
                  label={`Description ${idx + 1}`}
                  value={description.value}
                />
              );
            })}
        </CreateCampaignContent>
      </CreateCampaignCard>
    </>
  );
};

const InputPreview = ({
  label,
  value,
  labelClassName,
  valueClassName,
  className,
}) => {
  return (
    <div className={cn('flex flex-col', className)}>
      <p className={cn(labelVariants(), 'font-semibold', labelClassName)}>
        {label}
      </p>
      <p className={cn('text-sm font-body text-gray-600', valueClassName)}>
        {value}
      </p>
    </div>
  );
};
