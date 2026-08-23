'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PlatformConnectionGate } from '@/components/common/PlatformConnectionGate';
import SuccessDialog from '@/components/common/SuccessDialog';
import Header from '@/components/create-post/Header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/auth.context';
import { useCreatePost } from '@/hooks/mutations/useCreatePost';
import { useDealersLoaction } from '@/hooks/queries/locations';
import SkeletonLoader from '../common/SkeletonLoader';
import GMBForm from './gmb';

const FacebookForm = dynamic(() => import('./facebook'));

export default function CreatePostMain() {
  const [platform, setPlatform] = useState('gmb'); // facebook | gmb
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { userDetails } = useAuth();
  const { mutate, isPending: createPostLoading } = useCreatePost({
    onSuccess: () => {
      setOpen(true);
    },
  });

  const { data, isLoading } = useDealersLoaction({
    client_id: userDetails?.clientId,
    user_id: userDetails?.user_id,
  });

  const gmbDealerOptions =
    data?.gmb_dealer_list?.map((dealer) => ({
      city: dealer.city,
      contry: dealer.contry,
      state: dealer.state,
      label: dealer.dealer_name,
      value: dealer.dealer_id,
    })) ?? [];

  const facebookDealerOptions =
    data?.facebook_dealer_list?.map((dealer) => ({
      city: dealer.city,
      contry: dealer.contry,
      state: dealer.state,
      label: dealer.dealer_name,
      value: dealer.dealer_id,
    })) ?? [];

  if (isLoading) return <SkeletonLoader variant='form-card' />;

  const handleSubmit = (formData, imageFile) => {
    if (createPostLoading) return;

    const payload = {
      ...formData,
      platform: platform.toUpperCase(), // GMB | FACEBOOK
      created_by: userDetails?.user_id,
      user_id: userDetails?.user_id,
      client_id: userDetails?.clientId,
    };

    const body = new FormData();
    body.append(
      'data',
      new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      })
    );

    if (imageFile) {
      body.append('file', imageFile);
    }

    mutate(body);
  };

  return (
    <>
      <Header />
      <div className='p-6 bg-gray-50 min-h-screen'>
        <div className='max-w-160 mx-auto'>
          {/* Select Platform */}
          <div className='bg-white border rounded-lg px-6 py-5'>
            <h3 className='text-lg font-semibold text-gray-900 font-body'>
              Destination
            </h3>
            <p className='text-sm text-gray-600 mb-6'>
              Where would you like to publish this post?
            </p>
            <div className='flex w-full flex-col gap-6'>
              <Tabs
                defaultValue='gmb'
                variant='default'
                value={platform}
                onValueChange={setPlatform}
              >
                <TabsList className='flex w-full'>
                  <TabsTrigger value='gmb'>Google My Buisness</TabsTrigger>
                  <TabsTrigger
                    value='facebook'
                    onMouseEnter={() => import('./facebook')}
                  >
                    Facebook
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <PlatformConnectionGate platform={platform.toUpperCase()}>
            <div>
              {platform === 'facebook' ? (
                <FacebookForm
                  onSubmit={handleSubmit}
                  isSubmitting={createPostLoading}
                  dealerIdOptions={facebookDealerOptions}
                />
              ) : (
                <GMBForm
                  onSubmit={handleSubmit}
                  isSubmitting={createPostLoading}
                  dealerIdOptions={gmbDealerOptions}
                />
              )}
            </div>
          </PlatformConnectionGate>
        </div>
      </div>
      <SuccessDialog
        open={open}
        title='Post created successfully'
        description='Your post has been created successfully.'
        onClose={() => {
          setOpen(false);
          router.push('/posts');
        }}
      />
    </>
  );
}
