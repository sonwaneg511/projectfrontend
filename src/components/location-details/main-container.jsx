'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/auth.context';
import { useGetLocationDetails } from '@/hooks/queries/locations';
import SuccessDialog from '../common/SuccessDialog';
import { Accordion } from '../ui/accordion';
import { Button } from '../ui/button';
import { CampaignSettings } from './campaign-settings';
import { FacebookDetails } from './facebook-details';
import { GmbDetails } from './gmb-details';
import { LocationDetailsHeader } from './header';
import { LocationOverview } from './location-overview';

export const LocationDetailsMain = () => {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const { dealer_id } = useParams();
  const { userDetails } = useAuth();

  const hasAccess = userDetails?.modules?.includes('CAMPAIGNS');

  const {
    isLoading,
    data: locationDetails,
    error,
  } = useGetLocationDetails({
    client_id: userDetails?.clientId,
    user_id: userDetails?.user_id,
    dealer_id: dealer_id,
    page_no: 1,
  });

  const commonDetails = {
    dealerId: locationDetails?.dealerId,
    dealerName: locationDetails?.dealerName,
    city: locationDetails?.locationOverview?.city || '-',
    clientName: locationDetails?.clientName,
  };

  const mediaDetails = locationDetails?.media ?? {};
  // TODO: FB media is pending from backend once done will start working on it

  if (isLoading) {
    return (
      <>
        <div className='h-[120px] w-full bg-neutral-50 border-b border-border shrink-0 animate-pulse'></div>
        <div className='flex-1 p-4 flex flex-col gap-4 overflow-hidden'>
          <div className='h-80 bg-neutral-50 animate-pulse'></div>
          <div className='h-80 bg-neutral-50 animate-pulse'></div>
          <div className='h-80 bg-neutral-50 animate-pulse'></div>
          <div className='h-80 bg-neutral-50 animate-pulse'></div>
        </div>
      </>
    );
  }

  if (error?.data?.status === 404) {
    return (
      <div className='flex items-center justify-center size-full'>
        <div className='flex flex-col items-center'>
          <h2 className='text-3xl font-semibold mb-2'>Location not found.</h2>
          <Button variant={'primary'} asChild>
            <Link href={'/locations'}>Go back</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <LocationDetailsHeader headerData={commonDetails} />
      <div className='flex-1 overflow-y-auto p-4'>
        <Accordion
          type='multiple'
          collapsible={'true'}
          defaultValue={[
            'location-overview',
            'gmb-details',
            'facebook-details',
            'campaign-details',
          ]}
          className='space-y-4'
        >
          <LocationOverview
            locationOverview={locationDetails?.locationOverview}
            commonDetails={commonDetails}
            gmbDetails={locationDetails?.gmbDetails}
            setShowSuccessDialog={setShowSuccessDialog}
          />
          <GmbDetails
            gmbDetails={locationDetails?.gmbDetails}
            commonDetails={commonDetails}
            setShowSuccessDialog={setShowSuccessDialog}
            mediaDetails={mediaDetails}
          />
          <FacebookDetails
            facebookDetails={locationDetails?.facebookDetails}
            commonDetails={commonDetails}
            setShowSuccessDialog={setShowSuccessDialog}
          />
          {hasAccess && (
            <CampaignSettings
              campaignSettings={locationDetails?.campaignSettings}
              commonDetails={commonDetails}
              setShowSuccessDialog={setShowSuccessDialog}
            />
          )}
        </Accordion>
      </div>
      {showSuccessDialog && (
        <SuccessDialog
          open={showSuccessDialog}
          title='Location details updated successfully.'
          description='Your details location has been updated successfully.'
          onClose={() => setShowSuccessDialog(false)}
        />
      )}
    </>
  );
};
