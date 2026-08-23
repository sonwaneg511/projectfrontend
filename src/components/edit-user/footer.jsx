'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/context/auth.context';
import { useEditUser } from '@/hooks/mutations/users';
import { mapZodErrors } from '@/lib/utils';
import { Button } from '../ui/button';
import { editUserSchema } from './edit-user.schema';
import { useEditUserForm } from './form';

export const EditUserFooter = () => {
  const {
    formData,
    setValidationErrors,
    isLoading,
    editUserDetails,
    userNotFound,
  } = useEditUserForm();

  const { userDetails } = useAuth();

  const { isPending, mutateAsync } = useEditUser();

  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  const handleSubmit = async () => {
    const payload = {
      features: formData.features,
      locations: formData.locations,
    };

    const result = editUserSchema.safeParse(payload);

    if (result.success) {
      const isAdmin = result.data.features.includes('ADMIN');

      const body = {
        current_user_id: userDetails?.user_id,
        target_user_id: editUserDetails?.user_id,
        client_id: userDetails?.clientId,
        locations: result.data.locations,
        roles: isAdmin ? ['ADMIN'] : result.data.features,
      };

      try {
        await mutateAsync(body);
        toast.success('User edited successfully.');

        router.replace(from === 'settings' ? '/settings' : '/users');
      } catch (error) {
        console.log('Error', error);
        toast.error(error?.data?.message ?? 'Something went wrong.');
      }
    } else {
      const errors = mapZodErrors(result.error.issues);

      setValidationErrors((prevValidationErrors) => ({
        ...prevValidationErrors,
        ...errors,
      }));
    }
  };

  if (userNotFound) {
    return null;
  }

  return (
    <div className='py-4 flex items-center justify-center bg-white border-t shrink-0'>
      <div className='max-w-160 w-full flex items-center justify-end gap-3 px-6'>
        <Button variant={'outline'} asChild>
          <Link
            prefetch={false}
            href={from === 'settings' ? '/settings' : '/users'}
          >
            Cancel
          </Link>
        </Button>
        <Button
          variant={'primary'}
          onClick={handleSubmit}
          disabled={isPending || isLoading}
          className={'min-w-30'}
        >
          Edit User
        </Button>
      </div>
    </div>
  );
};
