import { cn } from '@/lib/utils';

export const DataTableHeader = ({ className, children }) => {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      {children}
    </div>
  );
};
