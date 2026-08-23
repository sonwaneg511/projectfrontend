'use client';

import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';
import { DAILY_PERFORMANCE_DATA } from '@/constants/static_data';
import { useAuth } from '@/context/auth.context';
import { useGetAllLocations } from '@/hooks/queries/locations';
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
export const CampaignWiseReportTable = () => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState('');

  // ✅ Pin Store Id and Location Name to the left
  //   const [columnPinning] = useState({
  //     left: ['storeId', 'locationName'],
  //   });

  const { userDetails } = useAuth();

  const body = {
    client_id: userDetails?.clientId,
    dealer_id: userDetails?.dealer_ids[0],
    user_id: userDetails?.user_id,
    page_no: pagination.pageIndex,
    dealer_name: search.trim(),
  };

  const { isLoading, data } = useGetAllLocations(body);

  const columns = [
    {
      header: 'Date',
      accessorKey: 'date',
    },
    {
      header: 'Cost',
      accessorKey: 'cost',
    },
    {
      header: 'impression',
      accessorKey: 'imperssion',
    },
    {
      header: 'clicks',
      accessorKey: 'clicks',
    },
    { header: 'videoViews', accessorKey: 'videoViews' },
    { header: 'conversion', accessorKey: 'conversion' },
    { header: 'CTR', accessorKey: 'CTR' },
    { header: 'VTR', accessorKey: 'VTR' },
    { header: 'costPerConversion', accessorKey: 'costPerConversion' },
    { header: 'CPC', accessorKey: 'CPC' },
    { header: 'CPM', accessorKey: 'CPM' },
  ];

  const table = useReactTable({
    data: DAILY_PERFORMANCE_DATA ?? [],
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
