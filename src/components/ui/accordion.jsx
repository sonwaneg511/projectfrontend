'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-b', className)}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Header className='flex'>
      <AccordionPrimitive.Trigger ref={ref} asChild {...props}>
        {/* ✅ SINGLE ROOT ELEMENT */}
        <div
          className={cn(
            'flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all cursor-pointer hover:bg-gray-50 rounded-xl text-left [&[data-state=open]>svg]:rotate-180',
            className
          )}
        >
          {/* Left side content */}
          <div className='flex items-center gap-2 w-full'>{children}</div>

          {/* Chevron */}
          <ChevronDown className='h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200' />
        </div>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
);
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content
      ref={ref}
      className='overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'
      {...props}
    >
      <div className={cn('pb-4 pt-0', className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
);
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
