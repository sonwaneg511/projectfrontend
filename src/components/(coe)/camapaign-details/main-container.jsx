'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useGetCoeCampaignDetails } from '@/hooks/queries/coe';
import { CoeCampaignDetailsFooter } from './footer';
import { CoeCampaignDetailsProvider, CoeCampaignForm } from './form';
import { CoeCampaignDetailsHeader } from './header';

export const CoeCampaignDetails = () => {
  const { campaignId } = useParams();
  const router = useRouter();

  const { isLoading, data, isError, error } =
    useGetCoeCampaignDetails(campaignId);

  const status = error?.response?.status;
  const message = error?.response?.data?.message;

  const isCampaignNotFound = status === 400 && message === 'Campaign not found';

  // biome-ignore lint/correctness/useExhaustiveDependencies: not added dependency
  useEffect(() => {
    if (
      isError &&
      status === 400 &&
      message === 'Client location setup not found'
    ) {
      toast.error(message);
      router.replace('/coe/campaigns');
    }
  }, [isLoading, error, data, isError]);

  return (
    <div className='h-screen overflow-hidden flex flex-col'>
      <CoeCampaignDetailsHeader />
      {isLoading ? (
        <div className='flex-1 px-10 py-4'>
          <div className='bg-neutral-200 size-full animate-pulse rounded-xl'></div>
        </div>
      ) : isError && isCampaignNotFound ? (
        <div className='flex-1 flex items-center justify-center'>
          <div className='flex flex-col items-center gap-2'>
            <h3 className='text-2xl font-semibold font-body'>
              Campaign not found.
            </h3>
            <Button variant={'primary'} asChild>
              <Link prefetch={false} href={'/coe/campaigns'}>
                Campaigns
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <CoeCampaignDetailsProvider
          campaignType={data?.platform}
          data={data ?? {}}
        >
          <CoeCampaignForm />
          <CoeCampaignDetailsFooter />
        </CoeCampaignDetailsProvider>
      )}
    </div>
  );
};
