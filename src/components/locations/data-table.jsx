'use client';

import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/auth.context';
import { useGetAllLocations } from '@/hooks/queries/locations';
import {
  DataTable,
  DataTableProvider,
  DataTableWrapper,
} from '../common/data-table/data-table';
import { DataTableHeader } from '../common/data-table/data-table-header';
import { DataTablePagination } from '../common/data-table/data-table-pagination';
import { DataTableSearch } from '../common/data-table/data-table-search';
import SkeletonLoader from '../common/SkeletonLoader';

export const LocationsTable = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState('');

  const { userDetails } = useAuth();

  const body = {
    client_id: userDetails?.clientId,
    dealer_id: userDetails?.dealer_ids[0],
    user_id: userDetails?.user_id,
    page_no: pagination.pageIndex,
    search_text: search.trim(),
  };

  const { isLoading, data } = useGetAllLocations(body);

  const columns = [
    {
      header: 'Location Id',
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
      accessorKey: 'area',
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
            href={`/locations/${dealerId}`}
            className='font-semibold text-brand-700'
          >
            View Details
          </Link>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data?.allLocatons ?? [],
    columns,
    state: {
      pagination,
      globalFilter: search,
    },

    manualFiltering: true,
    manualPagination: true,
    autoResetPageIndex: false,
    rowCount: data?.total_no_of_records ?? 0,

    onPaginationChange: setPagination,
    onGlobalFilterChange: setSearch,

    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='space-y-4 p-4 flex-1 overflow-y-auto'>
      {isLoading ? (
        <SkeletonLoader variant='table' items={8} columns={6} />
      ) : (
        <DataTableProvider table={table}>
          <DataTableHeader>
            <DataTableSearch placeholder={'Search for location'} />
          </DataTableHeader>
          <DataTableWrapper>
            <DataTable />
            <DataTablePagination />
          </DataTableWrapper>
        </DataTableProvider>
      )}
    </div>
  );
};
