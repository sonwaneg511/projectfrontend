'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as React from 'react';
import { cn } from '@/lib/utils';

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef(
  (
    {
      className,
      dropdown = false,
      matchTriggerWidth = false,
      side = 'left',
      align = 'start',
      sideOffset = 4,
      alignOffset = 0,
      collisionPadding = 8,
      withArrow = true,
      ...props
    },
    ref
  ) => {
    const contentRef = React.useRef(null);

    // merge forwarded ref + local ref
    React.useImperativeHandle(ref, () => contentRef.current);

    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={contentRef}
          side={dropdown ? 'bottom' : side}
          align={dropdown ? 'start' : align}
          sideOffset={dropdown ? 2 : sideOffset}
          alignOffset={alignOffset}
          collisionPadding={collisionPadding} // 🔥 viewport collision handling
          className={cn(
            'z-50 rounded-2xl border bg-popover p-4 text-popover-foreground shadow-md outline-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2',
            'data-[side=left]:slide-in-from-right-2',
            'data-[side=right]:slide-in-from-left-2',
            'data-[side=top]:slide-in-from-bottom-2',
            dropdown && 'p-0',
            className
          )}
          {...props}
          style={{
            ...(matchTriggerWidth
              ? {
                  width: 'var(--radix-popover-trigger-width)',
                }
              : {}),
            ...props.style,
          }}
        >
          {/* 🔥 Arrow support */}
          {withArrow && (
            <PopoverPrimitive.Arrow className='fill-white stroke-gray-300' />
          )}

          {props.children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    );
  }
);

PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger };
