'use client';

import { SearchIcon } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useDataTable } from './data-table';

export const DataTableSearch = ({ placeholder, className }) => {
  const [search, setSearch] = useState('');
  const id = useId();

  const { table } = useDataTable();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      table.setGlobalFilter(search);
      table.setPageIndex(0);
      table.setPageSize(10);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [search, table]);

  return (
    <Label
      htmlFor={id}
      className={cn(
        'w-[400px] rounded-md border border-border h-10 flex items-center bg-white pl-1 pr-2',
        className
      )}
    >
      <div className='h-full w-10 flex items-center justify-center'>
        <SearchIcon size={18} className='text-gray-400' />
      </div>
      <Input
        id={id}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        className={
          'border-0 focus-visible:ring-0 focus-visible:border-0 shadow-none h-full pl-0'
        }
      />
    </Label>
  );
};
