import { cn } from '@/lib/utils';

export const ErrorMessage = ({ message, className }) => {
  return <p className={cn('text-xs text-red-500', className)}>{message}</p>;
};
