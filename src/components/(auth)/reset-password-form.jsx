'use client';

import { ArrowLeftIcon, LockKeyholeIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useForgotPasswordChange } from '@/hooks/mutations/auth';
import { cn, mapZodErrors } from '@/lib/utils';
import { Button } from '../ui/button';
import { ErrorMessage } from '../ui/error-message';
import { Label, LabelInputContainer } from '../ui/label';
import { Loader } from '../ui/loader';
import { passwordChangeSchema } from './auth.schema';
import { PasswordInput } from './common';

export const ResetPasswordForm = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const {
    isPending: isForgotPasswordChanging,
    mutateAsync: forgotPasswordReq,
  } = useForgotPasswordChange();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (/\s/.test(value)) {
      return;
    }

    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    setValidationErrors((prevValidationErrors) => ({
      ...prevValidationErrors,
      [name]: '',
      commonError: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = passwordChangeSchema.safeParse({
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });

    if (!result.success) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        ...mapZodErrors(result.error.issues),
      }));

      return;
    }

    const body = {
      token: token,
      newPassword: result.data.password,
      confirmPassword: result.data.password,
    };

    try {
      await forgotPasswordReq(body);
      toast.success('Password updated successfully.');
      router.replace('/login');
    } catch (error) {
      toast.error(
        error?.data?.massage || error?.message || 'Something went wrong.'
      );
    }
  };

  return (
    <div className='w-full max-w-sm h-screen flex flex-col items-center'>
      <div className='relative mt-20 mb-6 w-full flex items-center justify-center'>
        <div className='size-14 border border-gray-300 rounded-lg flex items-center justify-center relative z-10 text-[#414651]'>
          <LockKeyholeIcon size={24} />
        </div>

        <div
          className={cn(
            'w-xl h-[576px] absolute top-1/2 left-1/2 -translate-1/2',
            'bg-[repeating-radial-gradient(circle,rgba(233,234,235,1)_0px,rgba(233,234,235,1)_1px,transparent_1px,transparent_46px)]',
            'mask-radial-from-5%'
          )}
        ></div>
      </div>
      <div className='relative z-10 w-full flex flex-col items-center gap-8'>
        <div className='flex flex-col gap-3 items-center w-full'>
          <h2 className='text-3xl font-semibold text-gray-900 font-display'>
            Set new password
          </h2>
          <p className='text-gray-600 text-center'>
            Your new password must be different to previously used passwords.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='w-full flex flex-col gap-4'>
          <LabelInputContainer>
            <Label htmlFor={'password'}>Password</Label>
            <PasswordInput
              id={'password'}
              name={'password'}
              placeholder={'Enter new password'}
              value={formData.password}
              onChange={handleInputChange}
            />
            {validationErrors.password && (
              <ErrorMessage message={validationErrors.password} />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor={'confirm-password'}>Confirm password</Label>
            <PasswordInput
              id={'confirm-password'}
              name={'confirmPassword'}
              placeholder={'Enter password'}
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            {validationErrors.confirmPassword && (
              <ErrorMessage message={validationErrors.confirmPassword} />
            )}
            {validationErrors?.commonError && (
              <ErrorMessage message={validationErrors?.commonError} />
            )}
          </LabelInputContainer>

          <Button
            variant={'primary'}
            size={'lg'}
            disabled={isForgotPasswordChanging}
            className={'mt-6'}
          >
            {isForgotPasswordChanging && <Loader />}
            {isForgotPasswordChanging ? 'Resetting' : 'Reset'} Password
          </Button>
        </form>

        <Link
          href={'/login'}
          className='w-full flex items-center justify-center gap-1'
        >
          <ArrowLeftIcon size={18} className='text-[rgba(164,167,174,1)]' />
          <span className='text-sm text-gray-600 font-semibold'>
            Back to login
          </span>
        </Link>
      </div>
    </div>
  );
};
