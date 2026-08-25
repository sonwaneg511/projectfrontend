'use client';

import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import {
  DataTable,
  DataTableProvider,
  DataTableWrapper,
} from '@/components/common/data-table/data-table';
import { DataTablePagination } from '@/components/common/data-table/data-table-pagination';
import { DataTableSearch } from '@/components/common/data-table/data-table-search';
import SkeletonLoader from '@/components/common/SkeletonLoader';
import { useGetGMBTableData } from '@/hooks/queries/report';
import { formatNumber } from '@/lib/utils';

export const GmbCampaignReportTable = ({ body, pagination, setPagination }) => {
  // const [sorting, setSorting] = useState('desc');

  const [search, setSearch] = useState('');

  const columns = useMemo(() => {
    return [
      {
        header: 'Id',
        cell: ({ row }) =>
          pagination.pageIndex * pagination.pageSize + row.index + 1,
      },
      {
        header: 'Location Name',
        accessorKey: 'location_name',
      },
      {
        header: 'Search Views',
        cell: ({ row }) => {
          const searchViews = row.original.search_views;

          return <>{formatNumber(searchViews)}</>;
        },
        meta: {
          variant: 'number',
        },
      },
      {
        header: 'Map Views',
        cell: ({ row }) => {
          const mapViews = row.original.map_views;

          return <>{formatNumber(mapViews)}</>;
        },
        meta: {
          variant: 'number',
        },
      },
      {
        header: 'Total Views',
        cell: ({ row }) => {
          const totalViews = row.original.total_views;

          return <>{formatNumber(totalViews)}</>;
        },
        meta: {
          variant: 'number',
        },
      },
      {
        header: 'Driving Direction Actions',
        cell: ({ row }) => {
          const drivingDirectionActions =
            row.original.driving_direction_actions;

          return <>{formatNumber(drivingDirectionActions)}</>;
        },
        meta: {
          variant: 'number',
        },
      },
      {
        header: 'Website Actions',
        cell: ({ row }) => {
          const websiteActions = row.original.website_actions;

          return <>{formatNumber(websiteActions)}</>;
        },
        meta: {
          variant: 'number',
        },
      },
      {
        header: 'Total Actions',
        cell: ({ row }) => {
          const totalActions = row.original.total_actions;

          return <>{formatNumber(totalActions)}</>;
        },
        meta: {
          variant: 'number',
        },
      },
    ];
  }, [pagination]);

  const tableBody = { ...body, search, page_no: pagination.pageIndex };

  const { isLoading, data } = useGetGMBTableData(tableBody);

  const table = useReactTable({
    data: data?.insight_data ?? [],
    columns,
    state: {
      pagination,
      globalFilter: search,
    },

    manualFiltering: true,
    manualPagination: true,
    rowCount: data?.total_no_of_records ?? 0,

    onPaginationChange: setPagination,
    onGlobalFilterChange: setSearch,

    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <SkeletonLoader variant='table' items={10} columns={columns.length} />
    );
  }

  return (
    <DataTableProvider table={table} className={'gap-0'}>
      <div className='bg-gray-50 border-b border-gray-200 p-4 flex items-center justify-between'>
        <DataTableSearch placeholder={'Search'} className={'w-[320px]'} />
        {/* <Button
          variant={'outline'}
          size={'lg'}
          className={'px-4'}
          onClick={() =>
            setSorting((prevState) => (prevState === 'desc' ? 'asc' : 'desc'))
          }
        >
          {sorting === 'desc' ? (
            <ArrowUpNarrowWideIcon size={18} className='text-gray-400' />
          ) : (
            <ArrowDownWideNarrowIcon size={18} className='text-gray-400' />
          )}
          Sort By: {sorting === 'desc' ? 'Newest First' : 'Oldest First'}
        </Button> */}
      </div>
      <DataTableWrapper className={'rounded-none rounded-b-xl border-t-0'}>
        <DataTable />
        <DataTablePagination />
      </DataTableWrapper>
    </DataTableProvider>
  );
};
