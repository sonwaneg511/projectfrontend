'use client';

import * as LabelPrimitive from '@radix-ui/react-label';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const labelVariants = cva(
  'text-sm text-gray-700 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
);

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

const LabelInputContainer = ({ className, children, ...props }) => {
  return (
    <div
      className={cn('flex w-full flex-col space-y-1.5', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export { Label, LabelInputContainer, labelVariants };
