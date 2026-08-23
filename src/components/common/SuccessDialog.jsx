'use client';

import Lottie from 'lottie-react';
import successAnimation from '@/assets/lottie/success.json';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export default function SuccessDialog({
  open,
  onClose,
  title = 'Success',
  description = 'Your request has been completed successfully.',
}) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className='max-w-md'>
        <AlertDialogHeader className='items-center text-center'>
          {/* Lottie Animation */}
          <div className='w-40 h-40'>
            <Lottie animationData={successAnimation} loop={false} />
          </div>

          <AlertDialogTitle className='text-lg mt-2'>{title}</AlertDialogTitle>

          <AlertDialogDescription className='text-sm text-gray-600'>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className='justify-center'>
          <Button variant='secondary' onClick={onClose}>
            Okay
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
