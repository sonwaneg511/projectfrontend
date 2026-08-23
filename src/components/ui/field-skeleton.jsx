import { cn } from '@/lib/utils';

/** Placeholder shown in place of a select/input-sized field while it loads. */
export const FieldSkeleton = ({ className }) => (
  <div
    className={cn(
      'h-10 w-full animate-pulse rounded-md border border-gray-300 bg-neutral-100',
      className
    )}
  />
);
