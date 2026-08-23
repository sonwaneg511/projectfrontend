'use client';

import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';
import { Star } from '@/assets/icons/icons.jsx';
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
const StarRating = ({ value }) => {
  const rating = Number(value) || 0;
  return (
    <div className='flex items-center gap-0.5'>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-200 fill-gray-200'
          }`}
        />
      ))}
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────
export const ReviewTable = ({ tableData, isLoading }) => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState('');

  // ✅ Pin Store Id and Location Name to the left
  const [columnPinning] = useState({
    left: ['storeId', 'locationName'],
  });

  const columns = [
    {
      id: 'storeId', // ✅ must match columnPinning key
      header: 'Store Id',
      accessorKey: 'dealer_id',
      size: 100, // ✅ exact width of this column
      minSize: 100, // ✅ prevent TanStack from shrinking it
      maxSize: 100,
    },
    {
      id: 'locationName', // ✅ must match columnPinning key
      header: 'Location Name',
      accessorKey: 'dealer_name',
      meta: {
        truncate: true, // ✅ fixed 82px + ellipsis
      },
      size: 150, // ✅ locationName's left = storeId's size (100px)
      minSize: 150,
      maxSize: 150,
    },
    {
      header: 'Reviewer',
      accessorKey: 'reviewer',
    },
    {
      header: 'City',
      accessorKey: 'city',
    },
    {
      header: 'Comment',
      accessorKey: 'comment',
      meta: { truncate: true, cellClassName: 'font-semibold text-gray-900' }, // ✅ fixed 82px + ellipsis
      size: 300,
    },
    {
      header: 'Review Date',
      accessorKey: 'date',
      cell: ({ getValue }) => {
        const value = getValue();
        return value ? value.split('T')[0] : '';
      },
    },
    {
      header: 'Reply',
      accessorKey: 'reply',
      meta: { truncate: true, cellClassName: 'font-semibold text-gray-900' }, // ✅ fixed 82px + ellipsis
      size: 300,
    },
    {
      header: 'Rating',
      accessorKey: 'rating',
      // ✅ Render stars instead of number
      cell: ({ getValue }) => <StarRating value={getValue()} />,
    },
    {
      header: 'Reply Date',
      accessorKey: 'reply_date',
      cell: ({ getValue }) => {
        const value = getValue();
        return value ? value.split('T')[0] : '';
      },
    },
  ];

  const table = useReactTable({
    data: tableData?.data ?? [],
    columns,
    state: {
      pagination,
      globalFilter: search,
      columnPinning, // ✅ pass pinning state
    },
    manualFiltering: true,
    manualPagination: true,
    autoResetPageIndex: false,
    columnResizeMode: 'onChange',
    rowCount: tableData?.total_no_pages ?? 0,
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
