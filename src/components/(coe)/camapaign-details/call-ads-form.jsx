'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber } from '@/lib/utils';
import {
  CoeFormAdName,
  CoeFormBiddingStrategy,
  CoeFormDescriptions,
  CoeFormHeadlines,
  CoeFormLandingPageKerwords,
  CoeFormMatchType,
  CoeFormNetworkType,
  CoeFormSubIndustryKerwords,
  CoeMaxCPCBidLimit,
  CoeReadOnlyField,
} from './common';
import { useCoeCampaignDetails } from './form';

export const CoeCampaignCallAdsForm = () => {
  const { formData, setFormData, data } = useCoeCampaignDetails();

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
          <div className='col-span-4 grid grid-cols-2 gap-4'>
            <CoeReadOnlyField label={'Path 1'} value={data?.path_1} />
            <CoeReadOnlyField label={'Path 2'} value={data?.path_2} />
          </div>
        </CardContent>
      </Card>
      <Card className={'rounded-xl bg-white'}>
        <CardHeader className={'px-6 py-5 border-b'}>
          <CardTitle className={'text-lg text-gray-900'}>
            Camapaign Details
          </CardTitle>
        </CardHeader>
        <CardContent className={'p-6 grid grid-cols-3 gap-4 overflow-x-hidden'}>
          <CoeFormAdName value={formData?.adName} setFormData={setFormData} />
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
          <div className='col-span-3 grid grid-cols-2 gap-4'>
            <CoeFormHeadlines
              headlines={formData?.headlines ?? []}
              selectedHeadlines={formData?.selectedHeadlines ?? []}
              setFormData={setFormData}
              maxHeadlines={2}
            />
            <CoeFormDescriptions
              descriptions={formData?.descriptions ?? []}
              selectedDescriptions={formData?.selectedDescriptions ?? []}
              setFormData={setFormData}
              maxHeadlines={2}
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
