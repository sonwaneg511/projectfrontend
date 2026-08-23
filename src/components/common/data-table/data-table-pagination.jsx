'use client';

import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, generatePaginationBtns } from '@/lib/utils';
import { useDataTable } from './data-table';

export const DataTablePagination = () => {
  const { table } = useDataTable();

  const paginationBtns = generatePaginationBtns(
    table.getPageCount(),
    table.getState().pagination.pageIndex + 1
  );

  if (!(table.getFilteredRowModel().rows.length > 0)) {
    return null;
  }

  return (
    <div className='flex items-center justify-between px-6 pt-3.5 pb-[18px]'>
      <Button
        variant={'outline'}
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.previousPage()}
      >
        <ArrowLeftIcon size={18} className='text-gray-400' />
        <span className='font-semibold text-gray-700'>Previous</span>
      </Button>
      <ul className='flex items-center'>
        {paginationBtns.map((paginationBtn, idx) => {
          const isCurrentBtn =
            table.getState().pagination.pageIndex + 1 === paginationBtn;

          let btn;

          if (paginationBtn === 'DOTS') {
            btn = (
              <div className='flex size-7 items-center justify-center rounded-md'>
                ...
              </div>
            );
          } else {
            btn = (
              <Button
                size={'icon'}
                variant={!isCurrentBtn && 'ghost'}
                className={cn(
                  'size-10 cursor-pointer',
                  isCurrentBtn && 'bg-gray-100'
                )}
                onClick={() => table.setPageIndex(paginationBtn - 1)}
              >
                {paginationBtn}
              </Button>
            );
          }

          return <li key={idx}>{btn}</li>;
        })}
      </ul>
      <Button
        variant={'outline'}
        disabled={!table.getCanNextPage()}
        onClick={() => table.nextPage()}
      >
        <span className='font-semibold text-gray-700'>Next</span>
        <ArrowRightIcon size={18} className='text-gray-400' />
      </Button>
    </div>
  );
};
