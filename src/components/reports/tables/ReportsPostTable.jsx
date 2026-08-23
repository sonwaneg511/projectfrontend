'use client';

import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import Link from 'next/link';
import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import {
  DataTable,
  DataTableProvider,
  DataTableWrapper,
} from '../../common/data-table/data-table';
import { DataTableHeader } from '../../common/data-table/data-table-header';
import { DataTablePagination } from '../../common/data-table/data-table-pagination';
import { DataTableSearch } from '../../common/data-table/data-table-search';
import SkeletonLoader from '../../common/SkeletonLoader';

// ─── Star Rating Cell ─────────────────────────────────────────────────────────

// ─── Component ────────────────────────────────────────────────────────────────
export const ReportsPostTable = ({ data, isLoading }) => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState('');

  // ✅ Pin Store Id and Location Name to the left
  //   const [columnPinning] = useState({
  //     left: ['storeId', 'locationName'],
  //   });
  const post_table_data = data?.post_reporting_data?.post_table_data;

  const columns = [
    {
      header: 'Creation Date',
      accessorKey: 'date',
      cell: ({ row }) => {
        const date = row.original.date;
        return formatDate(date);
      },
    },
    {
      header: 'Post Title',
      accessorKey: 'label',
      size: 220,
      meta: {
        truncate: true,
      },
    },
    {
      header: 'Created By',
      accessorKey: 'created_by',
    },
    {
      header: 'No of Location',
      accessorKey: 'no_of_loaction',
    },
    {
      header: 'Platform',
      accessorKey: 'platform',
    },
    {
      header: 'Post Type',
      accessorKey: 'postType',
    },
    {
      header: 'Action',
      cell: ({ row }) => {
        const postId = row.original.post_id;
        const platform = row.original.platform;
        return (
          <Link
            prefetch={false}
            href={{
              pathname: `/posts/${postId}`,
              query: { platform },
            }}
            className='font-semibold text-brand-700'
          >
            View Details
          </Link>
        );
      },
    },
  ];

  const table = useReactTable({
    data: post_table_data?.post_data ?? [],
    columns,
    state: {
      pagination,
      globalFilter: search,
    },
    manualFiltering: true,
    manualPagination: true,
    autoResetPageIndex: false,
    columnResizeMode: 'onChange',
    rowCount: post_table_data?.total_no_of_records ?? 0,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setSearch,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='bg-card rounded-lg border border-gray-200'>
      <div className='space-y-4 p-4 flex-1 overflow-y-auto'>
        {isLoading ? (
          <SkeletonLoader variant='table' items={8} columns={6} />
        ) : (
          <DataTableProvider table={table}>
            <DataTableHeader>
              <DataTableSearch placeholder='Search for location' />
            </DataTableHeader>
            <DataTableWrapper>
              <DataTable />
              <DataTablePagination />
            </DataTableWrapper>
          </DataTableProvider>
        )}
      </div>
    </div>
  );
};
