'use client';

import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/context/auth.context';
import { useSaveMicrositeTemplate } from '@/hooks/mutations/microsite';
import { useGetMicrositeComponents } from '@/hooks/queries/microsite';
import { Button } from '../../ui/button';
import { MicrositeDetailsBody } from './body';
import { MicrositeDetailsFooter } from './footer';
import { MicrositeDetailsHeader } from './header';
import { submitMicrositeForm } from './payload';
import { useMicrositeForm } from './use-microsite-form';

function resolveDealerName(queryClient, clientId, dealerId) {
  const dealers = queryClient.getQueryData(['microsite-dealers', clientId]);
  return (
    dealers?.find((d) => d.dealer_id === dealerId)?.dealer_name || dealerId
  );
}

export const MicrositeDetailsMain = () => {
  const { dealer_id: dealerId } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { userDetails } = useAuth();
  const clientId = 'fabric_612055';

  const {
    isLoading,
    data: components,
    error,
  } = useGetMicrositeComponents({ clientId, dealerId });

  const {
    formState,
    updateEntries,
    templateId,
    setTemplateId,
    hasDirtyChanges,
    markAllClean,
  } = useMicrositeForm(components);
  const { mutateAsync: save, isPending: isSaving } = useSaveMicrositeTemplate();

  const locationName = resolveDealerName(queryClient, clientId, dealerId);

  const handleSave = async () => {
    console.log(formState,'formState');
    const result = await submitMicrositeForm({
      formState,
      templateId,
      clientId,
      dealerId,
      createdBy:'admin',
      saveMutateAsync: save,
      markAllClean,
    }).catch(() => ({ status: 'save-error' }));

    console.log(result,'ressssssssss')

    if (result.status === 'invalid') {
      const firstMessage = Object.values(result.errors)[0];
      toast.error(firstMessage);
    } else if (result.status === 'upload-error') {
      toast.error(result.message);
    }
    // 'success' -> mutation's own onSuccess toasts; 'save-error' -> mutation's
    // own onError already toasted; 'skipped' -> nothing to do.
  };

  if (isLoading) {
    return (
      <div className='h-screen overflow-hidden flex flex-col'>
        <div className='h-[92px] w-full bg-neutral-50 border-b shrink-0 animate-pulse' />
        <div className='flex-1 p-4 flex flex-col gap-4 overflow-hidden'>
          <div className='h-80 bg-neutral-50 animate-pulse max-w-160 w-full mx-auto' />
        </div>
      </div>
    );
  }

  if (error?.data?.status === 404) {
    return (
      <div className='h-screen overflow-hidden flex flex-col'>
        <MicrositeDetailsHeader />
        <div className='flex-1 flex items-center justify-center'>
          <div className='flex flex-col items-center'>
            <h2 className='text-3xl font-semibold mb-2'>
              Microsite not found.
            </h2>
            <Button variant={'primary'} asChild>
              <Link href={'/microsites'}>Go back</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!components?.length) {
    return (
      <div className='h-screen overflow-hidden flex flex-col'>
        <MicrositeDetailsHeader locationName={locationName} />
        <div className='flex-1 flex items-center justify-center'>
          <p className='text-gray-500'>
            No configurable components found for this location yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='h-screen overflow-hidden flex flex-col'>
      <MicrositeDetailsHeader locationName={locationName} />
      <MicrositeDetailsBody
        components={components}
        formState={formState}
        onFieldChange={updateEntries}
        templateId={templateId}
        onTemplateChange={setTemplateId}
      />
      <MicrositeDetailsFooter
        isSaving={isSaving}
        hasDirtyChanges={hasDirtyChanges}
        onCancel={() => router.push('/microsites')}
        onSave={handleSave}
      />
    </div>
  );
};
