import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        `
        flex min-h-15 w-full rounded-md
        border border-gray-300 bg-transparent
        px-3.5 py-3 text-sm shadow-xs
        placeholder:text-gray-500
        focus:outline-none
        focus:border-brand-500
        focus:ring-1 focus:ring-brand-500
        active:border-brand-500
        disabled:cursor-not-allowed disabled:opacity-50
        `,
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export { Textarea };
