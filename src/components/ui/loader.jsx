import { LoaderIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Loader = ({ className, ...props }) => {
  return (
    // biome-ignore lint/a11y/useSemanticElements: <>
    <LoaderIcon
      role='status'
      aria-label='Loading'
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  );
};
