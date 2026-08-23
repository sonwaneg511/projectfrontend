import { AutofillWithAiIcon } from '@/assets/icons/autofill-ai-icon';
import { BlobImage } from '@/components/common/BlobImage';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { InfoIcon, Loader2 } from 'lucide-react';
import {
  MulitImagesUpload,
  MultiImagesPreview,
  MultiImagesUploadInput,
} from '../common/multi-images-upload';
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
  CreateCampaignLongHeadlines,
} from './common';
import { calculateDailyBudget, PMAX_IMAGES_RULES } from './constants';
import { useCreateCampaign } from './form';
import { CreateCampaignPlatforms } from './plattforms';

export const CreateCampaignPMaxForm = () => {
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
          <LabelInputContainer>
            <Label htmlFor={'business-name'}>
              Business Name <span className='text-brand-600'>*</span>
            </Label>
            <Input
              id={'business-name'}
              name={'businessName'}
              placeholder={'Enter business name'}
              value={formData.businessName}
              onChange={handleInputChange}
              maxLength={25}
            />
            {validationErrors.businessName && (
              <ErrorMessage
                message={validationErrors.businessName}
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
          <LabelInputContainer>
            <Label htmlFor={'yt-video-url'}>YouTube Video URL</Label>
            <Input
              id={'yt-video-url'}
              name={'ytVideoURL'}
              placeholder={'https://'}
              data-no-space
              value={formData.ytVideoURL}
              onChange={handleInputChange}
            />
            {validationErrors.ytVideoURL && (
              <ErrorMessage
                message={validationErrors.ytVideoURL}
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
          <CreateCampaignLongHeadlines
            longHeadlines={formData.longHeadlines}
            setFormData={setFormData}
            minLongHeadlines={1}
            maxLongHeadlines={5}
            error={validationErrors.longHeadlines}
            setValidationErrors={setValidationErrors}
          />
          <LabelInputContainer>
            <p className={cn(labelVariants(), 'font-semibold text-gray-900')}>
              Logos <span className='text-brand-600 font-normal'>*</span>{' '}
              <span className='text-xs text-gray-600 font-normal'>
                (Max 5, Recommended 1200 x 1200)
              </span>
            </p>
            <MulitImagesUpload
              localImages={formData.logos}
              onChange={(images) => {
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  logos: images,
                }));
                setValidationErrors((prevValidationErrors) => ({
                  ...prevValidationErrors,
                  logos: '',
                }));
              }}
            >
              <MultiImagesPreview />
              <MultiImagesUploadInput
                height={1200}
                width={1200}
                rules={PMAX_IMAGES_RULES.logo}
              />
            </MulitImagesUpload>
            {validationErrors.logos && (
              <ErrorMessage message={validationErrors.logos} />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants(), 'font-semibold text-gray-900')}>
              Landscape Logos{' '}
              <span className='text-brand-600 font-normal'>*</span>{' '}
              <span className='text-xs text-gray-600 font-normal'>
                (Max 5, Recommended 1200 x 300)
              </span>
            </p>
            <MulitImagesUpload
              localImages={formData.landscapeLogos}
              onChange={(images) => {
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  landscapeLogos: images,
                }));
                setValidationErrors((prevValidationErrors) => ({
                  ...prevValidationErrors,
                  landscapeLogos: '',
                }));
              }}
            >
              <MultiImagesPreview />
              <MultiImagesUploadInput
                height={300}
                width={1200}
                rules={PMAX_IMAGES_RULES.landscapeLogo}
              />
            </MulitImagesUpload>
            {validationErrors.landscapeLogos && (
              <ErrorMessage message={validationErrors.landscapeLogos} />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants(), 'font-semibold text-gray-900')}>
              Marketing Images{' '}
              <span className='text-brand-600 font-normal'>*</span>{' '}
              <span className='text-xs text-gray-600 font-normal'>
                (Max 20, Recommended 1200 x 628)
              </span>
            </p>
            <MulitImagesUpload
              localImages={formData.marketingImages}
              maxImages={20}
              onChange={(images) => {
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  marketingImages: images,
                }));
                setValidationErrors((prevValidationErrors) => ({
                  ...prevValidationErrors,
                  marketingImages: '',
                }));
              }}
            >
              <MultiImagesPreview />
              <MultiImagesUploadInput
                height={628}
                width={1200}
                rules={PMAX_IMAGES_RULES.marketingImages}
              />
            </MulitImagesUpload>
            {validationErrors.marketingImages && (
              <ErrorMessage message={validationErrors.marketingImages} />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants(), 'font-semibold text-gray-900')}>
              Portrait Marketing Images{' '}
              <span className='text-brand-600 font-normal'>*</span>{' '}
              <span className='text-xs text-gray-600 font-normal'>
                (Max 20, Recommended 960 x 1200)
              </span>
            </p>
            <MulitImagesUpload
              localImages={formData.portraitMarketingImages}
              maxImages={20}
              onChange={(images) => {
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  portraitMarketingImages: images,
                }));
                setValidationErrors((prevValidationErrors) => ({
                  ...prevValidationErrors,
                  portraitMarketingImages: '',
                }));
              }}
            >
              <MultiImagesPreview />
              <MultiImagesUploadInput
                height={1200}
                width={960}
                rules={PMAX_IMAGES_RULES.portraitImages}
              />
            </MulitImagesUpload>
            {validationErrors.portraitMarketingImages && (
              <ErrorMessage
                message={validationErrors.portraitMarketingImages}
              />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants(), 'font-semibold text-gray-900')}>
              Square Marketing Images{' '}
              <span className='text-brand-600 font-normal'>*</span>{' '}
              <span className='text-xs text-gray-600 font-normal'>
                (Max 20, Recommended 1080 x 1080)
              </span>
            </p>
            <MulitImagesUpload
              localImages={formData.squareMarketingImages}
              maxImages={20}
              onChange={(images) => {
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  squareMarketingImages: images,
                }));
                setValidationErrors((prevValidationErrors) => ({
                  ...prevValidationErrors,
                  squareMarketingImages: '',
                }));
              }}
            >
              <MultiImagesPreview />
              <MultiImagesUploadInput
                height={1080}
                width={1080}
                rules={PMAX_IMAGES_RULES.squareImages}
              />
            </MulitImagesUpload>
            {validationErrors.squareMarketingImages && (
              <ErrorMessage message={validationErrors.squareMarketingImages} />
            )}
          </LabelInputContainer>
        </CreateCampaignContent>
      </CreateCampaignCard>
    </>
  );
};

export const CreateCampaignPMaxPreview = () => {
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
          <InputPreview
            label={'YouTube Video URL'}
            value={formData.ytVideoURL || '-'}
          />

          <InputPreview label='Platform' value={campaignType} />

          <InputPreview label='Location' value={formData.location} />

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
          {formData.longHeadlines
            .filter((longHeadline) => longHeadline.value)
            .map((longHeadline, idx) => {
              return (
                <InputPreview
                  key={idx}
                  label={`Long Headline ${idx + 1}`}
                  value={longHeadline.value}
                />
              );
            })}
          <ImagesPreview label={'Logos'} images={formData.logos} />
          <ImagesPreview
            label={'Landscape logos'}
            images={formData.landscapeLogos}
          />
          <ImagesPreview
            label={'Marketing Images'}
            images={formData.marketingImages}
          />
          <ImagesPreview
            label={'Portrait Marketing Images'}
            images={formData.portraitMarketingImages}
          />
          <ImagesPreview
            label={'Square Marketing Images'}
            images={formData.squareMarketingImages}
          />
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

const ImagesPreview = ({ images, label, className, labelClassName }) => {
  return (
    <div className={cn('flex flex-col', className)}>
      <p className={cn(labelVariants(), 'font-semibold', labelClassName)}>
        {label}
      </p>
      <div className='grid grid-cols-5 gap-2'>
        {images.map((image, idx) => {
          return (
            <div
              key={idx}
              className='h-32 rounded-md border border-border overflow-hidden'
            >
              <BlobImage
                file={image.file}
                alt={`${label}-img-${idx}`}
                height={50}
                width={50}
                className='object-cover size-full'
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
