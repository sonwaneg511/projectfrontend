import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-gray-300 bg-transparentpx-3.5 py-2 px-3 text-sm shadow-xs placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 active:border-brand-500 disabled:cursor-not-allowed disabled:opacity-50 appearance-none focus-visible:outline-none outline-none not-focus:focus-within:ring-0',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
