import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const iconBadgeVariant = cva(
  'flex items-center justify-center rounded-full border border-transparent',
  {
    variants: {
      variant: {
        default: 'bg-brand-100 text-brand-700 border-brand-700',
        success: 'bg-success-50 text-success-700 border-success-700',
        destructive: 'bg-error-50 text-error-700 border-error-200',
        warning: 'border-warning-600 bg-warning-100 text-warning-700',
        gray: 'bg-brand-600 text-white',
        outline: 'text-gray-700 bg-background border-[rgba(213,215,218,1)]',
      },
      size: {
        default: 'size-12',
        sm: 'size-8',
        md: 'size-10',
        lg: 'size-14',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export const IconBadge = ({ className, variant, size, children }) => {
  return (
    <div className={cn(iconBadgeVariant({ variant, size }), className)}>
      {children}
    </div>
  );
};
