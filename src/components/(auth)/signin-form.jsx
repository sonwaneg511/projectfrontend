'use client';

// import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/components/ui/error-message';
import { Input } from '@/components/ui/input';
import { Label, LabelInputContainer } from '@/components/ui/label';
import { Loader } from '@/components/ui/loader';
import { useLogin, useResendVerificationMail } from '@/hooks/mutations/auth';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { loginSchema } from './auth.schema';
import { PasswordInput } from './common';
import { TempLogo } from '@/assets/icons/templogo'

export const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
    serverError: '',
  });
  const [isVerifyPopupOpen, setIsVerifyPopupOpen] = useState(false);

  const router = useRouter();

  const { isPending, isSuccess, mutateAsync } = useLogin();
  const { isPending: isResendingMail, mutateAsync: sendVerificationMail } =
    useResendVerificationMail();

  // Keep the button disabled while the request is in flight AND during the
  // post-success navigation window (router.replace + target route data load),
  // otherwise the re-enabled button lets the user fire duplicate logins.
  const isSubmitting = isPending || isSuccess;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (/\s/.test(value)) {
      return;
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    setValidationErrors((prevValidationErrors) => ({
      ...prevValidationErrors,
      [name]: '',
      serverError: '',
    }));
  };

  const handleSignin = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const result = loginSchema.safeParse(formData);

    if (result.success) {
      try {
        const body = {
          user_id: result.data.email,
          password: result.data.password,
        };

        const data = await mutateAsync(body);

        // const userDetails = {
        //   user_id: result.data.email,
        //   clientId: data.client_id,
        //   dealer_ids: data.dealer_ids,
        //   role: data.role,
        //   modules: data.modules,
        //   planStatus: data.planStatus,
        // };

        // setUserDetails(userDetails);
        // localStorage.setItem('userDetails', JSON.stringify(userDetails));

        const onboardingRoutes = {
          PLAN_PENDING: '/subscription-plan',
          SOCIAL_ACCOUNT_SETUP: '/account-access',
          CAMPAIGN_SETUP: '/campaign-setup',
          COMPLETED: '/dashboard',
        };

        router.replace(onboardingRoutes[data.onboarding_step] || '/dashboard');
      } catch (error) {
        if (error?.data?.status === 403 && error?.data?.error === 'PENDING') {
          setIsVerifyPopupOpen(true);
        } else {
          const message = error?.data?.message || 'Something went wrong.';

          toast.error('Login Failed', {
            description: message,
          });
        }
      }
    } else {
      const errors = result.error.issues.reduce((acc, curr) => {
        const key = curr.path[0];

        if (!acc[key]) {
          acc[key] = curr.message;
        }

        return acc;
      }, {});

      setValidationErrors((prevValidationErrors) => ({
        ...prevValidationErrors,
        ...errors,
      }));
    }
  };

  const handleResendMail = async () => {
    if (isResendingMail) return;

    try {
      await sendVerificationMail({
        email: formData.email.trim(),
      });
      setIsVerifyPopupOpen(false);
      setFormData({
        email: '',
        password: '',
      });
      toast.success('Email send', {
        message: 'Verification email has been send successfully.',
      });
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <>
      <div className='w-full max-w-sm flex flex-col items-center'>
        <div className='w-full flex items-center justify-center mb-11'>
          <div className='flex flex-col relative'>
            {/* <Image
              src='./Logo.png'
              alt='Caliper Logo'
              width={278}
              height={64}
              priority
            /> */}
            <TempLogo  width={180} height={50} />

            <p className='absolute -bottom-[18px] right-9 text-xs text-gray-900'>
              Scale your local reach
            </p>
          </div>
        </div>
        <div className='flex flex-col gap-3 w-full items-center mb-8'>
          <h2 className='text-gray-900 font-display font-semibold text-3xl'>
            Log in to your account
          </h2>
          <p className='text-gray-600 text-base'>
            Welcome back! Please enter your details.
          </p>
        </div>
        <form onSubmit={handleSignin} className='flex flex-col gap-5 w-full'>
          <LabelInputContainer>
            <Label htmlFor={'email'}>Email</Label>
            <Input
              id={'email'}
              placeholder={'Enter your email'}
              name={'email'}
              value={formData.email}
              onChange={handleInputChange}
            />
            {validationErrors.email && (
              <ErrorMessage message={validationErrors.email} />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor={'password'}>Password</Label>
            <PasswordInput
              id={'password'}
              placeholder={'Enter your password'}
              name={'password'}
              value={formData.password}
              onChange={handleInputChange}
            />
            {validationErrors.password && (
              <ErrorMessage message={validationErrors.password} />
            )}
            {validationErrors.serverError && (
              <ErrorMessage message={validationErrors.serverError} />
            )}
          </LabelInputContainer>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <input
                id='remember-checkbox'
                type='checkbox'
                className='size-4'
              />
              <Label htmlFor={'remember-checkbox'}>Remember for 30 days</Label>
            </div>
            <Link
              href={'/forgot-password'}
              className='text-brand-700 text-sm font-semibold'
            >
              Forgot password
            </Link>
          </div>
          <Button disabled={isSubmitting} variant={'primary'} size={'lg'}>
            {isSubmitting && <Loader />}
            {isSubmitting ? 'Signing' : 'Sign'} in
          </Button>
        </form>
        <div className='text-sm text-gray-700 w-full flex items-center justify-center gap-1 mt-4'>
          <p>Don't have an Account?</p>
          <Link
            href={'/register'}
            className='text-brand-700 font-semibold underline'
          >
            Register
          </Link>
        </div>
      </div>
      <AlertDialog open={isVerifyPopupOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Verify Your Email to Continue</AlertDialogTitle>
          </AlertDialogHeader>
          <div>
            <p className='text-sm text-gray-500'>
              Your email address hasn't been verified yet. We've sent a
              verification link to your email. Please check your inbox and
              verify your email before signing in.
            </p>
          </div>
          <AlertDialogFooter>
            <Button
              variant={'primary'}
              disabled={isResendingMail}
              onClick={handleResendMail}
            >
              {isResendingMail && <Loader />}
              {isResendingMail ? 'Sending' : 'Send'} Verification Mail
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
