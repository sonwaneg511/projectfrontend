'use client';

import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Facebook } from '@/assets/icons/facebook';
import { GoogleIcon } from '@/assets/icons/google';
import { Stepper } from '@/components/onboarding/Stepper';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth.context';
import {
  useGetAccountAccessOauth,
  useSkipPlatformConnection,
} from '@/hooks/queries/onboarding';
import { TempLogo } from '@/assets/icons/templogo'

export default function NewAccountAccess() {
  const searchParams = useSearchParams();
  const gmbStatus = searchParams.get('gmb');
  const gmbMessage = searchParams.get('message');
  const router = useRouter();

  const { userDetails } = useAuth();
  const { refetch: fetchAuthorize, isFetching: isAuthorizeFetching } =
    useGetAccountAccessOauth({
      client_id: userDetails?.clientId,
      user_id: userDetails?.user_id,
    });

  const [gmbConnected, setGmbConnected] = useState(gmbStatus === 'success');
  const [metaConnected, setMetaConnected] = useState(false);

  const queryClient = useQueryClient();
  const { mutateAsync: skipConnection, isPending: isSkipping } =
    useSkipPlatformConnection();

  const canProceed = gmbConnected || metaConnected;
  const _bothConnected = gmbConnected && metaConnected;
  const skippedPlatform =
    gmbConnected && !metaConnected
      ? 'META'
      : !gmbConnected && metaConnected
        ? 'GMB'
        : null;

  useEffect(() => {
    if (userDetails?.gmb_status === 'CONNECTED') setGmbConnected(true);
    if (userDetails?.meta_status === 'CONNECTED') setMetaConnected(true);
  }, [userDetails]);

  useEffect(() => {
    if (gmbStatus === 'success') {
      setGmbConnected(true);
      toast.success('Google My Business connected successfully');
    } else if (gmbStatus === 'error') {
      toast.error(gmbMessage || 'Failed to connect Google My Business');
    }
  }, [gmbStatus, gmbMessage]);

  const handleGMBConnect = async () => {
    const toastId = toast.loading('Connecting to Google My Business...');
    const { data, error } = await fetchAuthorize();
    toast.dismiss(toastId);

    if (error) {
      toast.error('Failed to initiate Google My Business connection');
      return;
    }

    const redirectUrl =
      typeof data === 'string' ? data : data?.url || data?.callback_url;
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };

  const handleContinue = async () => {
    if (skippedPlatform) {
      await skipConnection({
        client_id: userDetails?.clientId,
        platform: skippedPlatform,
        user_id: userDetails?.user_id,
      });
    }
    await queryClient.refetchQueries({ queryKey: ['user-self'] });
    const hasCampaigns = userDetails?.modules?.includes('CAMPAIGNS');
    router.push(hasCampaigns ? '/campaign-setup' : '/dashboard');
  };

  const AccessCardHeader = ({ icon, title }) => (
    <div className='flex items-center justify-between py-5 px-6 rounded-t-xl border-b bg-gray-50 mb-0'>
      <div className='flex items-center gap-3'>
        {icon}
        <h3 className='text-xl font-semibold text-gray-900 font-body'>
          {title}
        </h3>
      </div>
    </div>
  );

  const ConnectedBadge = ({ label }) => (
    <div className='flex items-center gap-2 text-sm text-green-600 font-medium'>
      <CheckCircle2 className='w-5 h-5' />
      {label}
    </div>
  );

  return (
    <div className='min-h-screen bg-background flex flex-col'>
      <div className='flex-1'>
        <div className='mx-auto max-w-7xl px-4 pb-8 pt-4 sm:px-6 lg:px-8 '>
          {/* Header */}
          <div className='mb-7 mt-2 flex items-center justify-between'>
            {/* <Image
              src='/Logo.png'
              alt='Logo'
              width={139}
              height={32}
              priority
            /> */}
            <TempLogo width={130} height={28} />
            <Stepper currentStep={2} totalSteps={3} />
          </div>

          <main className='space-y-8 pt-6'>
            {/* Title */}
            <div className='border-b pb-4'>
              <h2 className='text-lg font-semibold text-gray-900'>
                Provide access to your accounts
              </h2>
              <p className='mt-1 text-sm text-gray-600'>
                Share access with our team to help you setup your caliper
                account.
              </p>
            </div>

            {/* ================= GOOGLE CARD ================= */}
            <div className='rounded-xl border border-border bg-white space-y-6'>
              <AccessCardHeader
                title='Google Account Access'
                icon={
                  <div className='flex h-7 w-7 items-center justify-center rounded-full border bg-white'>
                    <GoogleIcon className='w-8 h-8' />
                  </div>
                }
              />

              <div className='space-y-4 text-sm p-4 flex'>
                {gmbConnected ? (
                  <ConnectedBadge label='Google My Business connected. Your locations will sync shortly.' />
                ) : (
                  <Button
                    variant='outline'
                    className='h-11'
                    onClick={handleGMBConnect}
                    disabled={isAuthorizeFetching}
                  >
                    <GoogleIcon className='w-6 h-6' /> Connect to Google My
                    Business
                  </Button>
                )}
              </div>
            </div>

            {/* ================= META CARD ================= */}
            <div className='rounded-xl border border-border bg-white space-y-6'>
              <AccessCardHeader
                title='Meta Account Access'
                icon={<Facebook className='w-8 h-8' />}
              />

              <div className='space-y-4 text-sm p-4 flex'>
                {metaConnected ? (
                  <ConnectedBadge label='Meta account connected.' />
                ) : (
                  <Button variant='outline' className='h-11'>
                    <Facebook className='w-6 h-6' /> Connect to Meta
                  </Button>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* footer */}
      <div className='py-4 px-6 border-t'>
        <div className='max-w-8xl my-2 mx-3 flex items-center justify-between'>
          <div className='flex gap-1'>
            <p className='text-sm text-gray-500 font-medium'>
              Need Help with the sign up process?
            </p>
            <span className='text-sm font-medium text-brand-700 hover:text-brand-600 cursor-pointer'>
              Learn more
            </span>
          </div>
          <div className='flex gap-3'>
            <Button variant='outline' size='lg'>
              Back
            </Button>
            <Button
              variant='primary'
              size='lg'
              disabled={!canProceed || isSkipping}
              onClick={handleContinue}
            >
              {isSkipping ? 'Please wait...' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
