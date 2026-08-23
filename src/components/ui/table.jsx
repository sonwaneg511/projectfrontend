'use client';

import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const tableHeadVariant = cva(
  'p-4 text-left text-gray-500 font-semibold align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5',
  {
    variants: {
      variant: {
        default: 'text-left',
        number: 'text-center',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const tableCellVariant = cva(
  'p-4 text-gray-600 text-sm align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5',
  {
    variants: {
      variant: {
        default: 'text-left',
        number: 'text-right',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Table({ className, ...props }) {
  return (
    <div
      data-slot='table-container'
      className='relative w-full overflow-x-auto'
    >
      <table
        data-slot='table'
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }) {
  return (
    <thead
      data-slot='table-header'
      className={cn('[&_tr]:border-b bg-white group', className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }) {
  return (
    <tbody
      data-slot='table-body'
      className={cn(
        'bg-white',
        // '[&_tr:last-child]:border-0',
        className
      )}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }) {
  return (
    <tfoot
      data-slot='table-footer'
      className={cn(
        'bg-white border-t border-border font-medium [&>tr]:last:border-b-0 group',
        className
      )}
      {...props}
    />
  );
}

function TableRow({ className, slot = 'table-row', ...props }) {
  return (
    <tr
      data-slot={slot}
      className={cn(
        'border-b border-border transition-colors',
        // 'data-[slot=table-row]:hover:bg-row-accent data-[slot=table-row]:hover:text-row-accent-foreground data-[slot=table-row]:bg-row data-[slot=table-row]:text-row-foreground',
        // 'data-[state=selected]:bg-selected-row data-[state=selected]:text-selected-row-foreground',
        className
      )}
      {...props}
    />
  );
}

function TableHead({ className, variant = 'default', ...props }) {
  return (
    <th
      data-slot='table-head'
      className={cn(tableHeadVariant({ variant }), className)}
      {...props}
    />
  );
}

function TableCell({ className, variant = 'default', ...props }) {
  return (
    <td
      data-slot='table-cell'
      className={cn(tableCellVariant({ variant }), className)}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }) {
  return (
    <caption
      data-slot='table-caption'
      className={cn('text-muted-foreground mt-4 text-sm', className)}
      {...props}
    />
  );
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
