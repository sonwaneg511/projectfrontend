'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/auth.context';
import {
  useCreateCallAdsCampaign,
  useCreatePMaxCampaign,
  useCreateSearchCampaign,
} from '@/hooks/mutations/campaigns';
import { uploadMultipleImagesToS3 } from '@/lib/utils';
import { Button } from '../ui/button';
import {
  campaignCallAdsSchema,
  campaignDemandGenMultiAssetSchema,
  campaignPmaxSchema,
  campaignSearchSchema,
} from './campaign.schema';
import { generateCampaignBody } from './constants';
import { useCreateCampaign } from './form';
import { CreateCampaignPaymentSummary } from './payment-summary';

export const CreateCampaignFooter = () => {
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [campaignId, setCampaignId] = useState(null);
  const { userDetails } = useAuth();
  const {
    view,
    setView,
    formData,
    setFormData,
    campaignType,
    setValidationErrors,
  } = useCreateCampaign();

  const {
    isPending: isSearchCampaignCreating,
    mutateAsync: createSearchCampaign,
  } = useCreateSearchCampaign();
  const {
    isPending: isCallAdsCampaignCreating,
    mutateAsync: createCallAdsCampaign,
  } = useCreateCallAdsCampaign();
  const { isPending: isPMaxCampaignCreating, mutateAsync: createPMaxCampaign } =
    useCreatePMaxCampaign();

  const handleBack = () => {
    if (view === 'form') return;

    setView('form');
  };

  function validateForm() {
    let result;

    switch (campaignType) {
      case 'search': {
        result = campaignSearchSchema.safeParse(formData);
        break;
      }

      case 'pMax': {
        result = campaignPmaxSchema.safeParse(formData);
        break;
      }

      case 'callAds': {
        result = campaignCallAdsSchema.safeParse(formData);
        break;
      }

      case 'demandGenMultiAsset': {
        result = campaignDemandGenMultiAssetSchema.safeParse(formData);
        break;
      }
    }

    return result;
  }

  const handleSubmit = async () => {
    const result = validateForm();

    if (view === 'form') {
      if (result.success) {
        const filteredHeadlines = formData.headlines.filter(
          (headline) => headline.value
        );
        const filteredDescriptions = formData.descriptions.filter(
          (description) => description.value
        );

        setFormData((prevFormData) => ({
          ...prevFormData,
          headlines: filteredHeadlines,
          descriptions: filteredDescriptions,
        }));
        setView('preview');
      } else {
        const errors = result.error.issues.reduce((acc, curr) => {
          const key = curr.path[0];

          if (!acc?.[key]) {
            acc[key] = curr.message;
          }

          return acc;
        }, {});

        setValidationErrors((prevErrors) => ({ ...prevErrors, ...errors }));
        toast.error('Invalid form details.');
      }
    } else {
      const body = generateCampaignBody(result.data, campaignType);
      body.client_id = userDetails?.clientId;

      try {
        switch (campaignType) {
          case 'search': {
            const data = await createSearchCampaign(body);
            setIsSummaryOpen(true);
            setCampaignId(data.campaign_id);
            break;
          }

          case 'callAds': {
            const data = await createCallAdsCampaign(body);
            setIsSummaryOpen(true);
            setCampaignId(data.campaign_id);
            break;
          }

          case 'pMax': {
            const logoFiles = body.logo.map((logo) => logo.file);
            const landscapeLogoFiles = body.landscape_logo.map(
              (logo) => logo.file
            );
            const marketingImagesFiles = body.marketing_images.map(
              (marketingImage) => marketingImage.file
            );
            const portraitMarketingImagesFiles =
              body.portrait_marketing_images.map(
                (portraitMarketingImage) => portraitMarketingImage.file
              );
            const squareMarketingImagesFiles = body.square_marketing_images.map(
              (squareMarketingImage) => squareMarketingImage.file
            );

            const logos = await uploadMultipleImagesToS3(
              logoFiles,
              'pmax-logos'
            );
            const landscapeLogos = await uploadMultipleImagesToS3(
              landscapeLogoFiles,
              'pmax-landscape-logos'
            );
            const marketingImages = await uploadMultipleImagesToS3(
              marketingImagesFiles,
              'pmax-marketing-images'
            );
            const portraitMarketingImages = await uploadMultipleImagesToS3(
              portraitMarketingImagesFiles,
              'pmax-portrait-marketing-images'
            );
            const squareMarketingImages = await uploadMultipleImagesToS3(
              squareMarketingImagesFiles,
              'pmax-square-marketing-images'
            );

            body.logo = logos;
            body.landscape_logo = landscapeLogos;
            body.marketing_images = marketingImages;
            body.portrait_marketing_images = portraitMarketingImages;
            body.square_marketing_images = squareMarketingImages;

            const data = await createPMaxCampaign(body);
            setIsSummaryOpen(true);
            setCampaignId(data.campaign_id);
            break;
          }

          case 'demandGenMultiAsset': {
            const logoFiles = body.logo.map((logo) => logo.file);
            const marketingImagesFiles = body.marketing_images.map(
              (marketingImage) => marketingImage.file
            );
            const portraitMarketingImagesFiles =
              body.portrait_marketing_images.map(
                (portraitMarketingImage) => portraitMarketingImage.file
              );
            const squareMarketingImagesFiles = body.square_marketing_images.map(
              (squareMarketingImage) => squareMarketingImage.file
            );

            const logos = await uploadMultipleImagesToS3(
              logoFiles,
              'demand-gen-logos'
            );
            const marketingImages = await uploadMultipleImagesToS3(
              marketingImagesFiles,
              'demand-gen-marketing-images'
            );
            const portraitMarketingImages = await uploadMultipleImagesToS3(
              portraitMarketingImagesFiles,
              'demand-gen-portrait-marketing-images'
            );
            const squareMarketingImages = await uploadMultipleImagesToS3(
              squareMarketingImagesFiles,
              'demand-square-marketing-images'
            );

            body.logo = logos;
            body.marketing_images = marketingImages;
            body.portrait_marketing_images = portraitMarketingImages;
            body.square_marketing_images = squareMarketingImages;

            // const data = await createPMaxCampaign(body);
            // setIsSummaryOpen(true);
            // setCampaignId(data.campaign_id);
            break;
          }
        }
      } catch (error) {
        console.error(error);
        toast.error(
          error?.data?.message ?? error?.message ?? 'Something went wrong.'
        );
      }
    }
  };

  return (
    <>
      <div className='py-4 flex items-center justify-center bg-white border-t shrink-0'>
        <div className='max-w-160 w-full flex items-center justify-end gap-3 px-6'>
          <Button
            variant={'outline'}
            asChild={view === 'form'}
            onClick={handleBack}
          >
            {view === 'form' ? <Link href={'/campaigns'}>Cancel</Link> : 'Back'}
          </Button>
          <Button
            variant={'primary'}
            className={'min-w-30'}
            onClick={handleSubmit}
            disabled={
              isSearchCampaignCreating ||
              isCallAdsCampaignCreating ||
              isPMaxCampaignCreating
            }
          >
            {view === 'form' ? 'Next' : 'Proceed to Pay'}
          </Button>
        </div>
      </div>
      {isSummaryOpen && (
        <CreateCampaignPaymentSummary
          open={isSummaryOpen}
          setOpen={setIsSummaryOpen}
          totalBudget={formData.campaignBudget}
          campaignId={campaignId}
          campaignName={formData.campaignName}
        />
      )}
    </>
  );
};
