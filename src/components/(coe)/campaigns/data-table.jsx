'use client';

import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { PenIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import {
  DataTable,
  DataTableProvider,
  DataTableWrapper,
} from '@/components/common/data-table/data-table';
import { DataTableHeader } from '@/components/common/data-table/data-table-header';
import { DataTablePagination } from '@/components/common/data-table/data-table-pagination';
import { DataTableSearch } from '@/components/common/data-table/data-table-search';
import SkeletonLoader from '@/components/common/SkeletonLoader';
import { calculateDailyBudget } from '@/components/create-campaign/constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useGetCoeCampaigns } from '@/hooks/queries/coe';
import { formatNumber } from '@/lib/utils';

export const CoeCampaignsDataTable = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState('');

  const params = {
    pageNo: pagination.pageIndex,
    search: search.trim(),
  };

  const { data, isLoading } = useGetCoeCampaigns(params);

  const columns = [
    {
      header: 'Campaign Id',
      accessorKey: 'campaign_id',
    },
    {
      header: 'Campaign Name',
      accessorKey: 'campaign_name',
    },
    {
      header: 'Location',
      cell: ({ row }) => {
        return <>{row.original?.location_detail ?? '-'}</>;
      },
    },
    {
      header: 'Start Date',
      accessorKey: 'start_date',
    },
    {
      header: 'End Date',
      accessorKey: 'end_date',
    },
    {
      header: 'Total Budget',
      cell: ({ row }) => {
        return <>₹ {formatNumber(row.original.total_budget)}</>;
      },
      meta: {
        variant: 'number',
      },
    },
    {
      header: 'Daily Budget',
      cell: ({ row }) => {
        const startDate = new Date(row.original.start_date);
        const endDate = new Date(row.original.end_date);
        const totalBudget = row.original.total_budget;

        const dailyBudget = calculateDailyBudget(
          totalBudget,
          startDate,
          endDate
        );

        return <>₹ {formatNumber(dailyBudget)}</>;
      },
      meta: {
        variant: 'number',
      },
    },
    {
      header: 'Platform',
      cell: ({ row }) => {
        const platform = row.original.platform;

        return <Badge variant={'success'}>{platform}</Badge>;
      },
    },
    {
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <Badge variant={'outline'} className={'px-1.5 rounded-md'}>
            <span className={'size-1.5 rounded-full bg-brand-500'}></span>
            {status}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const { campaign_id } = row.original;

        return (
          <div className='flex items-center'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={'ghost'} size={'icon'} asChild>
                  <Link
                    prefetch={false}
                    href={`/coe/campaign-details/${campaign_id}`}
                  >
                    <PenIcon size={16} className='text-gray-400' />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side={'bottom'}>
                <p>Edit Campaign</p>
              </TooltipContent>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    columns,
    data: data?.view_all_campaigns_response ?? [],
    state: {
      pagination,
      globalFilter: search,
    },

    manualFiltering: true,
    manualPagination: true,
    rowCount: data?.total_no_of_records ?? 0,

    onGlobalFilterChange: setSearch,
    onPaginationChange: setPagination,

    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return <SkeletonLoader variant='table' items={10} columns={9} />;
  }

  return (
    <DataTableProvider table={table}>
      <DataTableHeader>
        <DataTableSearch placeholder={'Search campaign'} />
      </DataTableHeader>

      <DataTableWrapper>
        <DataTable />
        <DataTablePagination />
      </DataTableWrapper>
    </DataTableProvider>
  );
};
