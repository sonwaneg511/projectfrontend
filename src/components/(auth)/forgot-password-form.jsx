'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ArrowLeftIcon, KeyRoundIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { useForgotPasswordReq } from '@/hooks/mutations/auth';
import { cn, mapZodErrors } from '@/lib/utils';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '../ui/dialog';
import { ErrorMessage } from '../ui/error-message';
import { Input } from '../ui/input';
import { Label, LabelInputContainer } from '../ui/label';
import { Loader } from '../ui/loader';
import { forgotPasswordSchema } from './auth.schema';

export const ForgotPasswordForm = () => {
  const [formData, setFormData] = useState({
    email: '',
  });
  const [validationErrors, setValidationErrors] = useState({
    email: '',
  });
  const [isOpen, setIsOpen] = useState(false);

  const { isPending: isForgotReqPending, mutateAsync: forgotPasswordReq } =
    useForgotPasswordReq();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (/\s/.test(value)) {
      return;
    }

    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    setValidationErrors((prevValidationErrors) => ({
      ...prevValidationErrors,
      [name]: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parseResult = forgotPasswordSchema.safeParse(formData);

    if (!parseResult.success) {
      setValidationErrors((prev) => ({
        ...prev,
        ...mapZodErrors(parseResult.error.issues),
      }));
      return;
    }

    const body = {
      email: parseResult.data.email,
    };

    try {
      await forgotPasswordReq(body);

      setValidationErrors({
        email: '',
      });
      setIsOpen(true);
    } catch (error) {
      toast.error(error?.data?.message ?? 'Something went wrong.');
    }
  };

  return (
    <div className='w-full max-w-sm h-screen flex flex-col items-center'>
      <div className='relative mt-20 mb-6 w-full flex items-center justify-center'>
        <div className='size-14 border border-gray-300 rounded-lg flex items-center justify-center relative z-10 text-[#414651]'>
          <KeyRoundIcon size={21} />
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
            Forgot password?
          </h2>
          <p className='text-gray-600 text-center'>
            No worries, we'll send you reset instructions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='w-full flex flex-col gap-6'>
          <LabelInputContainer>
            <Label htmlFor={'email'}>Email</Label>
            <Input
              id={'email'}
              name={'email'}
              placeholder={'Enter your email'}
              value={formData.email}
              onChange={handleInputChange}
            />
            {validationErrors.email && (
              <ErrorMessage message={validationErrors.email} />
            )}
          </LabelInputContainer>

          <Button variant={'primary'} size={'lg'} disabled={isForgotReqPending}>
            {isForgotReqPending && <Loader />}
            {isForgotReqPending ? 'Sending...' : 'Send'}
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
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <VisuallyHidden>
            <DialogTitle>No Title</DialogTitle>
          </VisuallyHidden>
          <DialogDescription>
            We’ve sent a password reset link to{' '}
            <span className='font-semibold underline'>{formData.email}</span>.
            Please check your inbox and follow the instructions to reset your
            password. If you don’t see the email, please check your spam or junk
            folder as well.
          </DialogDescription>
          <DialogFooter>
            <Button
              variant={'primary'}
              onClick={() => {
                setIsOpen(false);
                setFormData((prevFormData) => ({ ...prevFormData, email: '' }));
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
