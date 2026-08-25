'use client';

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Link from 'next/link';
import { useState } from 'react';
import { useGetMicrositeDealers } from '@/hooks/queries/microsite';
import {
  DataTable,
  DataTableProvider,
  DataTableWrapper,
} from '../common/data-table/data-table';
import { DataTableHeader } from '../common/data-table/data-table-header';
import { DataTablePagination } from '../common/data-table/data-table-pagination';
import { DataTableSearch } from '../common/data-table/data-table-search';
import { Button } from '../ui/button';

export const MicrositeBody = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState('');

  const {
    data: dealers,
    isLoading,
    error,
    refetch,
  } = useGetMicrositeDealers({ clientId: 'fabric_612055' });

  const columns = [
    {
      header: 'Location ID',
      accessorKey: 'dealer_id',
    },
    {
      header: 'Location Name',
      accessorKey: 'dealer_name',
      meta: {
        cellClassName: 'font-semibold text-gray-900',
      },
    },
    {
      header: 'Area',
      // Not present in the /microsite/template/dealers response - no source
      // field to bind to yet.
      cell: () => '—',
    },
    {
      header: 'City',
      accessorKey: 'city',
    },
    {
      header: 'State',
      accessorKey: 'state',
    },
    {
      id: 'details',
      cell: ({ row }) => {
        const dealerId = row.original.dealer_id;
        return (
          <Link
            href={`/microsites/${dealerId}`}
            className='font-semibold text-brand-700'
          >
            View Details
          </Link>
        );
      },
    },
  ];

  const table = useReactTable({
    data: dealers ?? [],
    columns,
    state: {
      pagination,
      globalFilter: search,
    },

    onPaginationChange: setPagination,
    onGlobalFilterChange: setSearch,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center gap-3 py-16'>
        <p className='text-gray-500'>Failed to load microsite locations.</p>
        <Button variant='outline' onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-4 p-4 flex-1 overflow-y-auto'>
      <DataTableProvider table={table}>
        <DataTableHeader>
          <DataTableSearch placeholder={'Search for microsite'} />
        </DataTableHeader>
        <DataTableWrapper>
          {isLoading ? (
            <div className='h-40 animate-pulse bg-neutral-50 rounded-md' />
          ) : (
            <DataTable />
          )}
          <DataTablePagination />
        </DataTableWrapper>
      </DataTableProvider>
    </div>
  );
};
