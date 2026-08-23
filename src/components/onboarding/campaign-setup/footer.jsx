'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/context/auth.context';
import { useSubmitCampaignSetup } from '@/hooks/queries/onboarding';
import { mapZodErrors } from '@/lib/utils';
import { verifyCampaignSetupSchema } from './campaign-setup-schema';
import { useCampaignSetup } from './provider';

export const CampaignSetupFooter = () => {
  const { formData, setValidationErrors, campaignDetails } = useCampaignSetup();
  const { userDetails } = useAuth();
  const { mutateAsync: submitSetup, isPending } = useSubmitCampaignSetup();
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleCampaignSetup = async () => {
    const _totalLocations = campaignDetails?.dealer_ids?.length ?? 0;
    const campaignSchema = verifyCampaignSetupSchema(1);
    const result = campaignSchema.safeParse(formData);

    if (!result.success) {
      const errors = mapZodErrors(result.error.issues);
      toast.error('Invalid form details.');
      setValidationErrors((prev) => ({ ...prev, ...errors }));
      return;
    }

    try {
      const payload = {
        client_id: userDetails?.clientId,
        client_business_name: campaignDetails?.client_name,
        industry: formData.industry,
        sub_industry: formData.subIndustry,
        client_location_setup_list: formData.locations.map((loc) => ({
          dealer_id: loc.id,
          radius: parseFloat(loc.radius),
          radius_unit: loc.radiusUnit === 'KILOMETERS' ? 'KM' : 'MILES',
          call_ad_phone_number: `+${loc.countryCode}${loc.callAdsPhoneNo}`,
          landing_page_url: loc.landingPgUrl,
          latitude: loc.latitude,
          longitude: loc.longitude,
          objective: loc.objective,
        })),
      };

      await submitSetup(payload);
      setShowSuccess(true);
    } catch {
      toast.error('Failed to submit campaign setup. Please try again.');
    }
  };

  return (
    <>
      <div className='py-4 px-6 border-t bg-white'>
        <div className='max-w-8xl my-2 mx-3 flex items-center justify-between'>
          <div className='flex gap-1'>
            <p className='text-sm text-gray-500 font-medium'>
              Need Help with the sign up process?
            </p>
            <span className='text-sm font-medium text-brand-700 hover:text-brand-600 cursor-pointer'>
              Contact Us
            </span>
          </div>
          <div className='flex gap-3'>
            <Button variant='outline' size='lg'>
              Back
            </Button>
            <Button
              variant='primary'
              size='lg'
              disabled={isPending || !campaignDetails}
              onClick={handleCampaignSetup}
            >
              {isPending ? 'Submitting...' : 'Next'}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showSuccess}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-gray-900'>
              Your onboarding is complete!
            </DialogTitle>
          </DialogHeader>
          <p className='text-sm text-gray-600'>
            Your campaign has been set up successfully. You can now access your
            dashboard.
          </p>
          <Button
            variant='primary'
            className='w-full mt-2'
            onClick={async () => {
              await queryClient.refetchQueries({ queryKey: ['user-self'] });
              router.push('/dashboard');
            }}
          >
            Go to Dashboard
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
