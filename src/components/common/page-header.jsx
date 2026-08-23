import { cn } from '@/lib/utils';
import React from 'react';
import { SidebarToggleBtn } from './app-sidebar';

export const PageHeader = ({ className, children, ...props }) => {
  return (
    <header
      className={cn(
        'border-border flex items-center justify-between border-b px-4 py-2',
        className
      )}
      {...props}
    >
      {children}
    </header>
  );
};

export const PageHeaderContent = ({ className, children }) => {
  return (
    <div className={cn('flex items-center', className)}>
      <div className='flex items-center'>
        <SidebarToggleBtn />
        <div className='bg-border mx-2 h-6 w-px' />
      </div>
      {children}
    </div>
  );
};

export const PageHeading = ({ className, children }) => {
  return (
    <h2 className={cn('text-base font-semibold', className)}>{children}</h2>
  );
};

export const PageDescription = ({ className, children }) => {
  return (
    <p
      className={cn('text-muted-foreground hidden text-sm sm:block', className)}
    >
      {children}
    </p>
  );
};

export const PageContent = ({ className, children }) => {
  return (
    <div className={cn('flex flex-1 flex-col overflow-hidden py-4', className)}>
      {children}
    </div>
  );
};
