'use client';

import { toast } from 'sonner';
import { Facebook } from '@/assets/icons/facebook';
import { GoogleIcon } from '@/assets/icons/google';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth.context';
import {
  useGetAccountAccessOauth,
  useGetMetaAccessOauth,
} from '@/hooks/queries/onboarding';

function GmbConnectPrompt({ sectionName, userDetails }) {
  const { refetch: fetchAuthorize, isFetching } = useGetAccountAccessOauth({
    client_id: userDetails?.clientId,
    user_id: userDetails?.user_id,
  });

  const handleConnect = async () => {
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

  return (
    <ConnectPrompt
      icon={<GoogleIcon className='w-8 h-8' />}
      title='Connect to Google My Business'
      description={`Connect your Google My Business account to see your ${sectionName} here`}
      buttonLabel='Connect to Google My Business'
      buttonIcon={<GoogleIcon className='w-5 h-5' />}
      onConnect={handleConnect}
      isLoading={isFetching}
    />
  );
}

function MetaConnectPrompt({ sectionName, userDetails }) {
  const { refetch: fetchAuthorize, isFetching } = useGetMetaAccessOauth({
    client_id: userDetails?.clientId,
    user_id: userDetails?.user_id,
  });

  const handleConnect = async () => {
    const toastId = toast.loading('Connecting to Meta...');
    const { data, error } = await fetchAuthorize();
    toast.dismiss(toastId);

    if (error) {
      toast.error('Failed to initiate Meta connection');
      return;
    }

    const redirectUrl =
      typeof data === 'string' ? data : data?.url || data?.callback_url;
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };

  return (
    <ConnectPrompt
      icon={<Facebook className='w-8 h-8 text-[#1877F2]' />}
      title='Connect to Meta'
      description={`Connect your Meta account to see your ${sectionName} here`}
      buttonLabel='Connect to Meta'
      buttonIcon={<Facebook className='w-5 h-5' />}
      onConnect={handleConnect}
      isLoading={isFetching}
    />
  );
}

function ConnectPrompt({
  icon,
  title,
  description,
  buttonLabel,
  buttonIcon,
  onConnect,
  isLoading,
}) {
  return (
    <div className='flex flex-col items-center justify-center py-20 gap-6'>
      <div className='flex items-center justify-center w-16 h-16 rounded-full bg-gray-100'>
        {icon}
      </div>
      <div className='text-center space-y-2'>
        <h3 className='text-lg font-semibold text-gray-900 font-body'>
          {title}
        </h3>
        <p className='text-sm text-gray-500'>{description}</p>
      </div>
      <Button variant='primary' onClick={onConnect} disabled={isLoading}>
        {buttonIcon}
        {isLoading ? 'Please wait...' : buttonLabel}
      </Button>
    </div>
  );
}

export function PlatformConnectionGate({
  platform,
  sectionName = 'content',
  children,
}) {
  const { userDetails } = useAuth();

  const isGmbSkipped =
    platform === 'GMB' && userDetails?.gmb_status === 'SKIPPED';
  const isMetaSkipped =
    platform === 'FACEBOOK' && userDetails?.meta_status === 'SKIPPED';

  if (isGmbSkipped) {
    return (
      <GmbConnectPrompt sectionName={sectionName} userDetails={userDetails} />
    );
  }

  if (isMetaSkipped) {
    return (
      <MetaConnectPrompt sectionName={sectionName} userDetails={userDetails} />
    );
  }

  return children;
}
