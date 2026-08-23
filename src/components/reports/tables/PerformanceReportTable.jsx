'use client';

import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';
import { formatDate, formatNumberDecimal } from '@/lib/utils';
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
export const PerformanceReportTable = ({ data, isLoading }) => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState('');

  // ✅ Pin Store Id and Location Name to the left
  //   const [columnPinning] = useState({
  //     left: ['storeId', 'locationName'],

  //   });

  const CAMPAIGN_WISE_DATA = data?.report?.campaign_wise_report;

  const columns = [
    {
      header: 'Creation Date',
      accessorKey: 'creation_date',
      cell: ({ row }) => {
        const date = row.original.date;
        return formatDate(date);
      },
    },
    {
      header: 'Campaign Name',
      accessorKey: 'campaign_name',
      size: 220,
      meta: {
        truncate: true,
      },
    },
    {
      header: 'Cost',
      accessorKey: 'cost',
      cell: ({ getValue }) => `₹ ${formatNumberDecimal(getValue())}`,
    },
    {
      header: 'Impression',
      accessorKey: 'delivered_impressions',
    },
    {
      header: 'Clicks',
      accessorKey: 'delivered_clicks',
    },
    {
      header: 'Video Views',
      accessorKey: 'video_views',
    },
    {
      header: 'Conversion',
      accessorKey: 'conversions',
      cell: ({ getValue }) => `${formatNumberDecimal(getValue())}`,
    },
    {
      header: 'CTR',
      accessorKey: 'ctr',
      cell: ({ getValue }) => `${formatNumberDecimal(getValue())}%`,
    },
    {
      header: 'VTR',
      accessorKey: 'vtr',
      cell: ({ getValue }) => `${formatNumberDecimal(getValue())}%`,
    },
    {
      header: 'Cost Per Conversion',
      accessorKey: 'cost_per_conversion',
      cell: ({ getValue }) => `₹ ${formatNumberDecimal(getValue())}`,
    },
    {
      header: 'Cost Per Mile',
      accessorKey: 'cost_per_mile',
      cell: ({ getValue }) => `₹ ${formatNumberDecimal(getValue())}`,
    },
    {
      header: 'Cost Per View',
      accessorKey: 'cost_per_view',
      cell: ({ getValue }) => `₹ ${formatNumberDecimal(getValue())}`,
    },
    {
      header: 'Partner Name',
      accessorKey: 'partner_name',
    },
  ];

  const table = useReactTable({
    data: CAMPAIGN_WISE_DATA?.table_data ?? [],
    columns,
    state: {
      pagination,
      globalFilter: search,
    },
    manualFiltering: true,
    manualPagination: true,
    autoResetPageIndex: false,
    columnResizeMode: 'onChange',
    rowCount: data?.total_no_of_records ?? 0,
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
