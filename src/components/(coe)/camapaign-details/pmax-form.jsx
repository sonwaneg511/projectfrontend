'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LabelInputContainer, labelVariants } from '@/components/ui/label';
import { cn, formatNumber } from '@/lib/utils';
import {
  CoeFormBiddingStrategy,
  CoeFormDescriptions,
  CoeFormHeadlines,
  CoeFormLandingPageKerwords,
  CoeFormLongHeadlines,
  CoeFormMatchType,
  CoeFormNetworkType,
  CoeFormSubIndustryKerwords,
  CoeMaxCPCBidLimit,
  CoeReadOnlyField,
} from './common';
import { useCoeCampaignDetails } from './form';

export const CoeCampaignPMaxForm = () => {
  const { formData, setFormData, data } = useCoeCampaignDetails();

  // TODO: add business name in preview field

  return (
    <div className='flex flex-col gap-4'>
      <Card className={'rounded-xl bg-white'}>
        <CardHeader className={'px-6 py-5 border-b'}>
          <CardTitle className={'text-lg text-gray-900'}>
            Campaign Details
          </CardTitle>
        </CardHeader>
        <CardContent className={'p-6 grid grid-cols-4 gap-4 overflow-x-hidden'}>
          <div className='col-span-4 grid grid-cols-2 gap-4'>
            <CoeReadOnlyField
              label={'Client Name'}
              value={data?.clientData?.client_names}
            />
            <CoeReadOnlyField
              label={'Client Comment'}
              value={data?.client_comment}
            />
          </div>
          <div className='col-span-4 grid grid-cols-2 gap-4'>
            <CoeReadOnlyField
              label={'Campaign Name'}
              value={data?.campaign_name}
            />
            <CoeReadOnlyField label={'Platform'} value={data?.platform} />
          </div>

          <CoeReadOnlyField label={'Start Date'} value={data?.star_date} />
          <CoeReadOnlyField label={'End Date'} value={data?.end_date} />

          <CoeReadOnlyField
            label={'Total Budget'}
            value={`${formatNumber(data?.totalBudget)}`}
          />
          <CoeReadOnlyField
            label={'Daily Budget'}
            value={`${formatNumber(data?.dailyBudget)}`}
          />

          <CoeReadOnlyField label={'Industry'} value={data?.industry} />
          <CoeReadOnlyField label={'Sub Industry'} value={data?.sub_industry} />
          <CoeReadOnlyField
            label={'Call Ads Phone number'}
            value={data?.client_location_setup?.adPhoneNumber}
          />
          <CoeReadOnlyField
            label={'Ad Location'}
            value={`${data?.client_location_setup?.latitude}, ${data?.client_location_setup?.longitude}`}
          />
          <div className='col-span-4'>
            <CoeReadOnlyField label={'Final Url'} value={data?.final_url} />
          </div>
          <div className='col-span-4'>
            <CoeImagePreview label={'Logos'} images={data?.logo} />
          </div>
          <div className='col-span-4'>
            <CoeImagePreview
              label={'Landscape Logos'}
              images={data?.landscape_logo}
              className={'object-contain'}
            />
          </div>
          <div className='col-span-4'>
            <CoeImagePreview
              label={'Marketing Images'}
              images={data?.marketing_images}
              className={'object-contain'}
            />
          </div>
          <div className='col-span-4'>
            <CoeImagePreview
              label={'Portrait Marketing Images'}
              images={data?.portrait_marketing_images}
              className={'object-contain'}
            />
          </div>
          <div className='col-span-4'>
            <CoeImagePreview
              label={'Square Marketing Images'}
              images={data?.square_marketing_images}
            />
          </div>
        </CardContent>
      </Card>
      <Card className={'rounded-xl bg-white'}>
        <CardHeader className={'px-6 py-5 border-b'}>
          <CardTitle className={'text-lg text-gray-900'}>
            Camapaign Details
          </CardTitle>
        </CardHeader>
        <CardContent className={'p-6 grid grid-cols-2 gap-4 overflow-x-hidden'}>
          <CoeFormMatchType
            options={data?.match_type ?? []}
            value={formData?.matchType}
            setFormData={setFormData}
          />
          <CoeFormNetworkType
            options={data?.network ?? []}
            value={formData?.networkTypes}
            setFormData={setFormData}
          />
          <div className='col-span-3 grid grid-cols-2 gap-4'>
            <CoeFormSubIndustryKerwords
              options={data?.subIndustryKeywords ?? []}
              value={formData?.subIndustryKeywords}
              setFormData={setFormData}
            />
            <CoeFormLandingPageKerwords
              options={data?.urlKeywords ?? []}
              value={formData?.landingPgKeywords}
              setFormData={setFormData}
            />
          </div>
          <div className='col-span-3 grid grid-cols-3 gap-4'>
            <CoeFormHeadlines
              headlines={formData?.headlines ?? []}
              selectedHeadlines={formData?.selectedHeadlines ?? []}
              setFormData={setFormData}
              maxHeadlines={15}
            />
            <CoeFormDescriptions
              descriptions={formData?.descriptions ?? []}
              selectedDescriptions={formData?.selectedDescriptions ?? []}
              setFormData={setFormData}
              maxHeadlines={5}
            />
            <CoeFormLongHeadlines
              longHeadlines={formData?.longHeadlines ?? []}
              selectedLongHeadlines={formData?.selectedLongHeadlines ?? []}
              setFormData={setFormData}
              maxHeadlines={5}
            />
          </div>
          <div className='col-span-3 grid grid-cols-2 gap-4'>
            <CoeFormBiddingStrategy
              options={data?.bidding_strategy ?? []}
              value={formData?.biddingStrategy}
              setFormData={setFormData}
            />
            {formData?.biddingStrategy === 'Maximize Clicks' && (
              <CoeMaxCPCBidLimit
                value={formData?.maxCPCBid}
                setFormData={setFormData}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const CoeImagePreview = ({ label, images, className, labelClassName }) => {
  return (
    <LabelInputContainer>
      <p className={cn(labelVariants(), labelClassName)}>{label}</p>
      <div className='grid grid-cols-5 gap-4'>
        {images.map((imageUrl, idx) => {
          return (
            <Image
              key={`${imageUrl}+${idx}`}
              src={imageUrl}
              alt={`${label}-image`}
              width={50}
              height={50}
              quality={100}
              priority
              className={cn(
                'h-40 w-full object-cover rounded-md border border-border',
                className
              )}
            />
          );
        })}
      </div>
    </LabelInputContainer>
  );
};
