'use client';

import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { CirclePauseIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { CampaignDetailsIcon } from '@/assets/icons/icons';
import { useAuth } from '@/context/auth.context';
import { useGetAllCampaigns } from '@/hooks/queries/campaigns';
import { cn, formatNumber } from '@/lib/utils';
import {
  DataTable,
  DataTableProvider,
  DataTableWrapper,
} from '../common/data-table/data-table';
import { DataTableHeader } from '../common/data-table/data-table-header';
import { DataTablePagination } from '../common/data-table/data-table-pagination';
import { DataTableSearch } from '../common/data-table/data-table-search';
import SkeletonLoader from '../common/SkeletonLoader';
import { calculateDailyBudget } from '../create-campaign/constants';
import { CreateCampaignPaymentSummary } from '../create-campaign/payment-summary';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { dotVariants, getDotVariant } from './constants';
import { CampaignsFilter } from './filter';

export const CampaignsDataTable = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({
    country: '',
    state: '',
    city: '',
    locations: [],
  });
  const { userDetails } = useAuth();

  const body = {
    pageNo: pagination.pageIndex,
    search: search.trim(),
    user_id: userDetails?.user_id,
    client_id: userDetails?.clientId,
    state: filter.state,
    city: filter.city,
    dealer_id: filter.locations,
    country: filter.country,
  };

  const { isLoading, data, error } = useGetAllCampaigns(body);

  const columns = [
    // {
    //   id: 'select',
    //   header: ({ table }) => {
    //     return (
    //       <div className='flex items-center justify-center'>
    //         <Checkbox
    //           checked={table.getIsAllRowsSelected()}
    //           onChange={table.getToggleAllRowsSelectedHandler()}
    //         />
    //       </div>
    //     );
    //   },
    //   cell: ({ row }) => {
    //     return (
    //       <div className='flex items-center justify-center'>
    //         <Checkbox
    //           checked={row.getIsSelected()}
    //           onChange={row.getToggleSelectedHandler()}
    //         />
    //       </div>
    //     );
    //   },
    //   size: 50,
    // },
    {
      header: 'Campaign Name',
      accessorKey: 'campaign_name',
      meta: {
        cellClassName: 'text-gray-900 font-semibold',
      },
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

        return platform ? <Badge variant={'success'}>{platform}</Badge> : null;
      },
    },
    {
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const dotVariant = getDotVariant(status);
        let content;

        switch (status) {
          case 'Pending Deployment': {
            content = [
              'Payment Successful',
              'Review Approved',
              'Pending Deployment',
            ].map((customStatus) => {
              const dotVariant = getDotVariant(customStatus);

              return (
                <Badge
                  key={customStatus}
                  variant={'outline'}
                  className={'px-1.5 rounded-md'}
                >
                  <span
                    className={cn(dotVariants({ variant: dotVariant }))}
                  ></span>
                  {customStatus}
                </Badge>
              );
            });

            break;
          }

          case 'Payment Processed, Pending Deployment': {
            content = ['Payment Successful', 'Under Expert Review'].map(
              (customStatus) => {
                const dotVariant = getDotVariant(customStatus);

                return (
                  <Badge
                    key={customStatus}
                    variant={'outline'}
                    className={'px-1.5 rounded-md'}
                  >
                    <span
                      className={cn(dotVariants({ variant: dotVariant }))}
                    ></span>
                    {customStatus.trim()}
                  </Badge>
                );
              }
            );

            break;
          }

          default:
            content = (
              <Badge variant={'outline'} className={'px-1.5 rounded-md'}>
                <span
                  className={cn(dotVariants({ variant: dotVariant }))}
                ></span>
                {status}
              </Badge>
            );
        }

        return <div className='flex gap-2'>{content}</div>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const {
          campaign_id: campaignId,
          campaign_name,
          status,
          total_budget: totalBudget,
        } = row.original;

        const isPauseResumeBtnDisable = !['Deployed', 'Paused'].includes(
          status
        );

        const handlePauseCampaign = () => {
          toast.success('Camapign Pause', {
            description: `Campaign ${campaign_name} is pause successfully.`,
          });
        };

        return (
          <div className='flex items-center gap-2 text-gray-600'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={'ghost'}
                  size={'icon'}
                  disabled={isPauseResumeBtnDisable}
                  onClick={handlePauseCampaign}
                >
                  <CirclePauseIcon size={16} className='text-gray-400' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side={'bottom'}>
                <p>Pause Campaign</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={'ghost'} size={'icon'}>
                  <CampaignDetailsIcon className={'size-4'} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side={'bottom'}>
                <p>View Campaign</p>
              </TooltipContent>
            </Tooltip>
            {(status === 'Payment Failed' || status === 'Payment Pending') && (
              <CampaignPaymentSummary
                label={
                  status === 'Payment Failed' ? 'Retry Payment' : 'Pay Now'
                }
                campaignId={campaignId}
                campaignName={campaign_name}
                totalBudget={totalBudget}
              />
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data?.view_all_campaigns_response ?? [],
    columns,
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

  const message = error?.response?.data?.message;

  if (message === 'campaign list is empty') {
    return (
      <div className='space-y-4 p-4 flex items-center justify-center'>
        <div className='flex flex-col items-center'>
          <h1 className='text-4xl font-semibold font-body'>No data found.</h1>
          <p className='text-lg text-neutral-500'>Please create campaign.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4 p-4 flex-1 overflow-y-auto'>
      {isLoading ? (
        <SkeletonLoader variant='table' items={8} columns={6} />
      ) : (
        <DataTableProvider table={table}>
          <DataTableHeader>
            <DataTableSearch placeholder={'Search campaign'} />
            <CampaignsFilter value={filter} onValueChange={setFilter} />
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

const CampaignPaymentSummary = ({
  campaignId,
  campaignName,
  totalBudget,
  label,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant={'primary'} onClick={() => setOpen(true)}>
        {label}
      </Button>
      {open && (
        <CreateCampaignPaymentSummary
          open={open}
          setOpen={setOpen}
          campaignId={campaignId}
          campaignName={campaignName}
          totalBudget={totalBudget}
          usingIn='campaignTable'
        />
      )}
    </>
  );
};
