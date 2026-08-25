'use client';

import { ArrowUpRight, CircleQuestionMark, Plus, XIcon } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { GoogleIcon } from '@/assets/icons/google';
import { MetaIcon } from '@/assets/icons/meta';
import { Stepper } from '@/components/onboarding/Stepper';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth.context';
import {
  useVerifyAccount,
  useVerifyLocationGroup,
} from '@/hooks/mutations/onboarding';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { TempLogo } from '@/assets/icons/templogo'

export default function AccountAccess() {
  const [pageIds, setPageIds] = useState(() =>
    Array.from({ length: 3 }, (_) => ({ id: uuidv4(), value: '' }))
  );
  const [isLocationGroupVerified, setIsLocationGroupVerified] = useState(false);
  const [locationGroup, setLocationGroup] = useState('');

  const { userDetails } = useAuth();

  const {
    isPending: isLocationGroupVerifying,
    mutateAsync: verifyLocationGroup,
  } = useVerifyLocationGroup();
  const { isPending: isAccountVerifying, mutateAsync: verifyAccount } =
    useVerifyAccount();

  const accountDetails = useRef(null);

  const addPageId = () => {
    setPageIds((prevPageIds) => [...prevPageIds, { id: uuidv4(), value: '' }]);
  };

  const updatePageId = (id, value) => {
    const updatedPageIds = pageIds.map((pageId) =>
      pageId.id === id ? { ...pageId, value } : pageId
    );
    setPageIds(updatedPageIds);
  };

  const handleRemovePageId = (id) => {
    const filteredPageIds = pageIds.filter((pageId) => pageId.id !== id);
    setPageIds(filteredPageIds);
  };

  const handleLocationGroupVerification = async () => {
    if (locationGroup) {
      const body = {
        groupName: locationGroup,
      };

      try {
        const response = await verifyLocationGroup(body);

        // TODO: store accounid and account name received from response
        if (response?.exist) {
          accountDetails.current = {
            accountId: response?.account_number,
            accountName: response?.account_name,
          };
          setIsLocationGroupVerified(true);
          toast.success('Group name verification complete.');
        } else {
          toast.error(response?.message ?? "Group name don't exist.");
          accountDetails.current = null;
        }
      } catch (error) {
        toast.error(error?.data?.message ?? 'Something went wrong.');
      }
    }
  };

  const handleAccountAccessVerification = async () => {
    if (isLocationGroupVerified) {
      const filteredFbIds = pageIds
        .map((pageId) => pageId.value)
        .filter((pageId) => Boolean(pageId));

      try {
        // NOTE: this is pending right now just commenting
        const body = {
          user_id: userDetails.user_id,
          // account_id: accountDetails.current.accountId,
          // account_name: accountDetails.current.accountName,
          account_id: 'A67890',
          account_name: 'Demo Account',
          facebook_page_ids: filteredFbIds,
        };

        await verifyAccount(body);
      } catch (error) {
        toast.error(error?.data?.message ?? 'Something went wrong.');
      }
    }
  };

  /* ------------------ SHARED HEADER ONLY ------------------ */
  const AccessCardHeader = ({ icon, title, consoleLabel, consoleLink }) => (
    <div className='flex items-center justify-between py-5 px-6 rounded-t-xl border-b bg-gray-50 mb-0'>
      <div className='flex items-center gap-3'>
        {icon}
        <h3 className='text-xl font-semibold text-gray-900 font-body'>
          {title}
        </h3>
      </div>

      <div className='flex items-center gap-4 text-sm'>
        <a
          href={consoleLink}
          target='_blank'
          className='flex items-center gap-1 text-brand-700 font-medium hover:underline'
          rel='noopener'
        >
          {consoleLabel}
          <ArrowUpRight className='h-4 w-4' />
        </a>

        {/* <button className="flex items-center gap-1 text-muted-foreground hover:text-primary">
          See How to Provide Access
          <Info className="h-4 w-4" />
        </button> */}
        <Button
          variant='outline'
          className='text-sm font-semibold text-gray-700'
        >
          See How to Provide Access
          <CircleQuestionMark className='h-4 w-4' color='var(--color-gray-400)' />
        </Button>
      </div>
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
                Provide Access to your accounts
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
                consoleLabel='Google Console'
                consoleLink='https://business.google.com/'
                icon={
                  <div className='flex h-7 w-7 items-center justify-center rounded-full border bg-white'>
                    <GoogleIcon className='w-8 h-8' />
                  </div>
                }
              />

              <div className='space-y-4 text-sm p-4'>
                <p className='text-gray-900 font-semibold text-md'>
                  For us to access your setup please follow the steps below
                </p>

                <ol className='list-decimal list-inside space-y-2'>
                  <li className='py-1'>
                    Create a location group in your Google Business Profile{' '}
                    <span className='text-brand-700 cursor-pointer font-semibold'>
                      See how?
                    </span>
                  </li>
                  <li className='py-1'>
                    Please provide access to this email id
                    <Button
                      variant='outline'
                      className='text-sm font-medium text-gray-700 mx-2 cursor-default pointer-events-none'
                      asChild
                    >
                      <div>dhaval.shah@ia.com</div>
                    </Button>
                  </li>

                  <li className='py-1'>
                    Name the group as follows:{' '}
                    <Input
                      placeholder='Enter Group Name'
                      className='max-w-fit min-w-12 inline-block'
                      value={locationGroup}
                      onChange={(e) => {
                        setLocationGroup(e.target.value);
                        setIsLocationGroupVerified(false);
                      }}
                    />
                  </li>
                </ol>

                <p className='border-t pt-4'>
                  Already shared access? Check if your stores are connected
                  <button
                    style={{
                      opacity: 1,
                    }}
                    className={cn(
                      'cursor-pointer px-1 text-brand-700 font-semibold disabled:cursor-not-allowed',
                      isLocationGroupVerified && 'text-success-600'
                    )}
                    onClick={handleLocationGroupVerification}
                    disabled={isLocationGroupVerified}
                  >
                    {isLocationGroupVerifying
                      ? 'Verifying...'
                      : isLocationGroupVerified
                        ? 'Verified!'
                        : 'Verify'}
                  </button>
                </p>
              </div>
            </div>

            {/* ================= META CARD ================= */}
            <div className='rounded-xl border border-border bg-white space-y-6'>
              <AccessCardHeader
                title='Meta Account Access'
                consoleLabel='Meta Console'
                consoleLink='https://business.google.com/'
                icon={
                  <div className='flex h-7 w-7 items-center justify-center rounded-full border bg-white'>
                    <MetaIcon className='w-8 h-8' />
                  </div>
                }
              />

              <div className='space-y-2 p-4'>
                {/* Email */}
                <div className='flex items-center gap-2'>
                  <p className='text-sm'>
                    Please provide access to this email id
                  </p>
                  <Button
                    variant='outline'
                    className='text-sm font-medium text-gray-700 cursor-default pointer-events-none'
                    asChild
                  >
                    <div>dhaval.shah@ia.com</div>
                  </Button>
                </div>

                {/* Page IDs */}
                <div className='space-y-2'>
                  <Label className='font-medium text-gray-900 text-md'>
                    Page IDs
                  </Label>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    {pageIds.map((pageId, index) => (
                      <div key={index} className='space-y-2'>
                        <Label className='text-sm text-gray-700'>
                          Page ID {index + 1}
                        </Label>
                        <div className='relative'>
                          <Input
                            placeholder='Enter Page ID'
                            value={pageId.value}
                            className='my-2'
                            onChange={(e) =>
                              updatePageId(pageId.id, e.target.value)
                            }
                          />
                          {index >= 3 && (
                            <Button
                              variant={'destructive'}
                              size={'icon'}
                              className={
                                'size-4 rounded-full bg-error-600 hover:bg-error-500 active:hover:bg-error-600 text-white absolute -top-2 -right-2'
                              }
                              onClick={() => handleRemovePageId(pageId.id)}
                            >
                              <XIcon className='size-3' />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button onClick={addPageId} variant='outline'>
                    <Plus className='h-4 w-4' />
                    Add More Pages
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* footer */}
      <div className='py-4 px-6 border-t'>
        <div className='max-w-8xl my-2 mx-3  flex items-center justify-between'>
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
              disabled={isAccountVerifying}
              variant='primary'
              size='lg'
              onClick={handleAccountAccessVerification}
            >
              Verify & Proceed
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
