'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCreateInternalClient } from '@/hooks/mutations/coe';
import { mapZodErrors } from '@/lib/utils';
import { Button } from '../../ui/button';
import { useInternalOnboarding } from './form';
import { internalOnboardingSchema } from './internal-onboarding.schema';

export const InternalOnboardingFooter = () => {
  const {
    formData,
    setValidationErrors,
    industryKeywords,
    urlKeywords,
    isLoading,
  } = useInternalOnboarding();

  const router = useRouter();
  const { isLoading: isClientCreating, mutateAsync } =
    useCreateInternalClient();

  const handleSubmit = async () => {
    const result = internalOnboardingSchema.safeParse(formData);

    if (result.success) {
      const selectedIndustryKeywords = industryKeywords.filter(
        (industryKeyword) =>
          formData.industryKeywords.includes(industryKeyword.keyword)
      );

      const selectedUrlKeywords = urlKeywords.filter((urlKeyword) =>
        formData.landingPgUrlKeywords.includes(urlKeyword.keyword)
      );

      const body = {
        client_id: result.data.clientName,
        client_code: result.data.clientCode,
        google_account_id: `${result.data.googleAcId}`,
        login_customer_id: result.data.loginCustomerId,
        sub_industry_keywords: selectedIndustryKeywords,
        url_keywords: selectedUrlKeywords,
      };

      try {
        await mutateAsync(body);
        toast.success('Internal client created successfully.');
        router.replace('/coe/campaigns');
      } catch (error) {
        toast.error(error?.data?.error || 'Something went wrong.', {
          description: error?.data?.message || 'Please try again later.',
        });
      }
    } else {
      const errors = mapZodErrors(result.error.issues);

      setValidationErrors((prevValidationErrors) => ({
        ...prevValidationErrors,
        ...errors,
      }));
    }
  };

  return (
    <div className='py-4 flex items-center justify-center bg-white border-t shrink-0'>
      <div className='max-w-160 w-full flex items-center justify-end gap-3 px-6'>
        <Button variant={'outline'} asChild>
          <Link href={'/coe/campaigns'}>Cancel</Link>
        </Button>
        <Button
          variant={'primary'}
          className={'min-w-30'}
          onClick={handleSubmit}
          disabled={isClientCreating || isLoading}
        >
          Create new user
        </Button>
      </div>
    </div>
  );
};
