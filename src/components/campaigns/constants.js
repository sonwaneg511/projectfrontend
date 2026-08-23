import { cva } from 'class-variance-authority';

export const dotVariants = cva('size-1.5 rounded-full', {
  variants: {
    variant: {
      default: 'bg-gray-300',
      success: 'bg-success-500',
      pending: 'bg-warning-400',
      rejected: 'bg-error-500',
      processing: 'bg-brand-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const processing = [
  'Payment Processed, Pending Deployment',
  'Payment Processing',
  'Under Expert Review',
];
const success = ['Live', 'Deployed', 'Payment Successful', 'Review Approved'];
const pending = ['Paused', 'Pending Deployment', 'Payment Pending'];
const rejected = ['Payment Failed'];

export function getDotVariant(status) {
  if (processing.includes(status)) return 'processing';
  if (success.includes(status)) return 'success';
  if (pending.includes(status)) return 'pending';
  if (rejected.includes(status)) return 'rejected';

  return 'processing';
}
