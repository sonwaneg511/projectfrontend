'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as React from 'react';
import { cn } from '@/lib/utils';

/* Root */
export const Tabs = TabsPrimitive.Root;

/* TabsList */
export const TabsList = React.forwardRef(
  ({ className, variant = 'default', ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        // DEFAULT shadcn style
        variant === 'default' &&
          'inline-flex h-9 items-center justify-center rounded-md bg-gray-50 p-0 text-muted-foreground border border-gray-300',

        // PRIMARY style
        variant === 'primary' &&
          'inline-flex items-center h-9 gap-1 rounded-sm p-1 bg-white',

        // SECONDARY style
        variant === 'secondary' && 'inline-flex w-full h-10 -space-x-px',

        className
      )}
      {...props}
    />
  )
);
TabsList.displayName = 'TabsList';

const tabVariants = {
  default: `
    inline-flex items-center h-9 justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-semibold
    transition-all
    
    text-gray-500
    data-[state=active]:bg-white
    data-[state=active]:text-gray-900
    data-[state=active]:border border-gray-300
    cursor-pointer
  `,

  primary: `
    font-semibold
    rounded-sm
    text-(--tabs-text)
    data-[state=active]:bg-(--tabs-active-bg)
    data-[state=active]:text-(--tabs-active-text)
    cursor-pointer
  `,

  secondary: `
    inline-block text-body bg-white border border-gray-300
    hover:bg-gray-50/90 hover:text-heading
    focus:ring-neutral-secondary-strong focus:outline-none
    font-semibold leading-5 text-sm px-4 py-2.5 shadow-xs cursor-pointer
    text-gray-700
    data-[state=active]:bg-gray-200
    data-[state=active]:text-gray-800
    data-[state=active]:border-gray-300
  `,
};

/* Secondary Rounded Corners */
const positionStyles = {
  first: 'rounded-l-lg',
  middle: 'rounded-none',
  last: 'rounded-r-lg',
};

/* TabsTrigger */
export const TabsTrigger = React.forwardRef(
  ({ className, variant = 'default', position, ...props }, ref) => (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        `
        inline-flex items-center justify-center whitespace-nowrap
        font-medium transition-all
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
        disabled:pointer-events-none disabled:opacity-50
      `,

        /* DEFAULT (shadcn) */
        variant === 'default' && 'px-3 py-2 text-sm rounded-sm w-full',

        /* PRIMARY */
        variant === 'primary' && 'px-3 py-1.5 text-sm rounded-md',

        /* SECONDARY */
        variant === 'secondary' && 'px-4 py-2.5 text-sm leading-5',

        // Variant-specific CSS
        tabVariants[variant],

        // Only secondary has rounded position override
        variant === 'secondary' && position && positionStyles[position],

        className
      )}
      {...props}
    />
  )
);
TabsTrigger.displayName = 'TabsTrigger';

/* TabsContent */
export const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn('mt-2', className)}
    {...props}
  />
));
TabsContent.displayName = 'TabsContent';
