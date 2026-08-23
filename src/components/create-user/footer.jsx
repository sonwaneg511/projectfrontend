'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/context/auth.context';
import { mapZodErrors } from '@/lib/utils';
import { Button } from '../ui/button';
import { useCreateUserForm } from './form';
import { createUserSchema } from './user.schema';

export const CreateUserFooter = () => {
  const {
    formData,
    setValidationErrors,
    isUserDetailsLoading,
    isUserCreating,
    createUser,
    setExistingUserEmails,
  } = useCreateUserForm();
  const { userDetails } = useAuth();

  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  const handleCreateUser = async () => {
    const payload = {
      emails: formData.emails,
      features: formData.features,
      locations: formData.locations,
    };

    const result = createUserSchema.safeParse(payload);

    if (result.success) {
      const isAdmin = result.data.features.includes('ADMIN');

      const body = {
        current_user_id: userDetails?.user_id,
        client_id: userDetails?.clientId,
        locations: result.data.locations,
        roles: isAdmin ? ['ADMIN'] : result.data.features,
        new_user_ids: result.data.emails,
        action: 'USER_PASSWORD',
      };

      try {
        await createUser(body);

        toast.success(
          `${result.data.emails.length < 1 ? 'Users' : 'User'} created successfully.`
        );

        router.replace(from === 'settings' ? '/settings' : '/users');
      } catch (error) {
        const invalidUsers = error?.data?.invalidUserIds ?? [];

        if (invalidUsers.length) {
          setValidationErrors((prevValidationErrors) => ({
            ...prevValidationErrors,
            invalidEmails: `${invalidUsers.length} ${invalidUsers.length < 1 ? 'emails' : 'email'} already exist. Remove them to continue.`,
          }));
          setExistingUserEmails(invalidUsers);

          toast.error(
            `${invalidUsers.length} ${invalidUsers.length < 1 ? 'emails' : 'email'} already exist.`,
            {
              description: 'Remove them to continue.',
            }
          );
        } else {
          toast.error(error?.data?.message ?? 'Something went wrong.');
        }
      }
    } else {
      const errors = mapZodErrors(result.error.issues);

      setValidationErrors((prevValidationErrors) => ({
        ...prevValidationErrors,
        ...errors,
      }));
      toast.error('Invalid form details.');
    }
  };

  return (
    <div className='py-4 flex items-center justify-center bg-white border-t shrink-0'>
      <div className='max-w-160 w-full flex items-center justify-end gap-3 px-6'>
        <Button variant={'outline'} asChild={true}>
          <Link href={from === 'settings' ? '/settings' : '/users'}>
            Cancel
          </Link>
        </Button>
        <Button
          variant={'primary'}
          onClick={handleCreateUser}
          disabled={isUserCreating || isUserDetailsLoading}
          className={'min-w-30'}
        >
          Send Invite
        </Button>
      </div>
    </div>
  );
};
