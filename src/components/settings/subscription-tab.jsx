'use client';

import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { format } from 'date-fns';
import { CloudDownloadIcon, DownloadIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAuth } from '@/context/auth.context';
import {
  useGetSubscriptionDetails,
  useGetSubscriptionHistory,
} from '@/hooks/queries/settings';
import { cn, formatNumber } from '@/lib/utils';
import {
  DataTable,
  DataTableProvider,
  DataTableWrapper,
} from '../common/data-table/data-table';
import { DataTablePagination } from '../common/data-table/data-table-pagination';
import SkeletonLoader from '../common/SkeletonLoader';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ErrorMessage } from '../ui/error-message';
import { TabsContent } from '../ui/tabs';

export const SubscriptionsTab = () => {
  return (
    <TabsContent
      value={'subscriptions'}
      className={'space-y-4 mt-4 h-full overflow-y-auto'}
    >
      <SubscriptionOverview />
      <SubscriptionsDataTable />
    </TabsContent>
  );
};

const SubscriptionOverview = () => {
  const { userDetails } = useAuth();

  const { isLoading, data, error, isError } = useGetSubscriptionDetails(
    userDetails?.clientId
  );

  const statusConfig = {
    ACTIVE: {
      bg: 'bg-green-500',
      label: 'Active',
    },
    EXPIRED: {
      bg: 'bg-red-500',
      label: 'Expired',
    },
    INACTIVE: {
      bg: 'bg-gray-400',
      label: 'Inactive',
    },
  };
  const planStautsLabel = statusConfig[data?.status]?.label ?? '-';
  const planStatusBg = statusConfig[data?.status]?.bg;

  const durationConfig = {
    MONTHLY: {
      duration: 'Monthly',
      paymentLabel: 'month',
    },
    HALF_YEARLY: {
      duration: 'Half Yearly',
      paymentLabel: 'half year',
    },
    YEARLY: {
      duration: 'Annual',
      paymentLabel: 'year',
    },
  };
  const planDuration = durationConfig[data?.durationType]?.duration ?? '-';
  const planPaymentLabel =
    durationConfig[data?.durationType]?.paymentLabel ?? '';

  if (isLoading) {
    return <div className='min-h-80 rounded-xl bg-neutral-100 animate-pulse' />;
  }

  if (isError) {
    const message = error?.response?.data?.message ?? 'Something went wrong.';

    return (
      <div className='py-6 md:py-10 flex items-center justify-center'>
        <ErrorMessage message={message} />
      </div>
    );
  }

  return (
    <Card className={'bg-white pt-6 space-y-6 px-0'}>
      <div className='flex items-center justify-between px-6 gap-4 flex-wrap'>
        <div>
          <div className='flex items-center gap-2'>
            <p className='text-lg font-semibold'>{data?.planName ?? '-'}</p>
            <Badge variant={'outline'} className={'rounded-sm'}>
              <div
                className={cn(
                  'size-1.5 rounded-full bg-success-500',
                  planStatusBg
                )}
              />
              <span>{planStautsLabel}</span>
            </Badge>
          </div>
          <p className='text-sm mt-1 text-gray-600'>{planDuration}</p>
        </div>
        <p>
          <span className='text-5xl font-semibold font-display'>
            ₹ {formatNumber(data?.amount)}
          </span>
          <span className='text-gray-600'>per {planPaymentLabel}</span>
        </p>
      </div>
      <div className='px-6 flex-wrap flex items-start gap-6'>
        <div>
          <p className='text-sm font-medium'>Renewal Date</p>
          <p className='text-sm text-gray-600 mt-2'>
            {format(data?.renewalDate, 'MMM d, yyyy')}
          </p>
        </div>
        <div>
          <p className='text-sm font-medium'>No. of Locations</p>
          <p className='text-sm text-gray-600 mt-2'>
            {data?.locationCount} Locations
          </p>
        </div>
        <div>
          <p className='text-sm font-medium'>Purchased Modules</p>
          <div className='flex items-center gap-3 flex-wrap mt-2'>
            {data?.purchasedModules?.map((module) => {
              return (
                <Badge key={module} className={'font-medium'}>
                  {module}
                </Badge>
              );
            })}
          </div>
        </div>
      </div>
      <div className='px-6 py-4 border-t border-border'>
        <div className='flex items-center justify-between flex-wrap'>
          <div className='flex items-center gap-4'>
            <p className='text-sm'>
              <span className='font-medium'>Expires on</span>
              <span className='ml-2 text-gray-600'>
                {format(data?.expiresOn, 'MMM d yyyy')}
              </span>
            </p>
            <Button variant={'outline'}>Renew</Button>
          </div>
          <Button variant={'outline'}>Modify Plan</Button>
        </div>
      </div>
    </Card>
  );
};

const SubscriptionsDataTable = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { userDetails } = useAuth();

  const { isLoading, data } = useGetSubscriptionHistory({
    clientId: userDetails?.clientId,
    params: {
      page: pagination.pageIndex,
      size: pagination.pageSize,
    },
  });

  const columns = useMemo(
    () => [
      {
        header: 'Invoice',
        cell: ({ row }) => {
          const { planName } = row.original;

          return <>{planName || ''}</>;
        },
      },
      {
        header: 'Billing Date',
        cell: ({ row }) => {
          const billingDate = new Date(row.original?.billingDate);
          const formattedBillingDate = format(billingDate, 'MMM d, yyyy');

          return <>{formattedBillingDate}</>;
        },
      },
      {
        header: 'Amount',
        cell: ({ row }) => {
          return <>₹ {formatNumber(row.original?.amount)}</>;
        },
        meta: {
          variant: 'number',
        },
      },
      {
        header: 'Status',
        cell: ({ row }) => {
          const _status = row.original?.status;
          const _statusConfig = {
            CREATED: {
              label: 'Created',
              variant: 'default',
            },
            PAID: {
              label: 'Paid',
              variant: 'success',
            },
            FAILED: {
              label: 'Failed',
              variant: 'destructive',
            },
            EXPIRED: {
              label: 'Expired',
              variant: 'warning',
            },
          };

          // return (
          //   <Badge variant={status?.[status]?.variant}>
          //     {statusConfig?.[status]?.label}
          //   </Badge>
          // );

          // NOTE: this is hardcoded as of now later change it
          return <Badge variant={'success'}>Paid</Badge>;
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          return (
            <Button variant={'ghost'} className={'text-brand-600'}>
              <DownloadIcon size={20} />
              <span>Download</span>
            </Button>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: data?.content ?? [],
    columns,
    state: {
      pagination,
    },

    manualPagination: true,

    rowCount: data?.totalElements ?? 0,

    onPaginationChange: setPagination,

    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='flex-1 w-full'>
      <div className='flex items-center justify-between flex-wrap gap-4 mb-6'>
        <div>
          <h3 className='text-lg font-semibold'>
            Subscription Payment History
          </h3>
          <p className='mt-0.5 text-sm text-gray-600'>
            Track your billing lifecycle and download invoices for accounting.
          </p>
        </div>
        <Button variant={'outline'}>
          <CloudDownloadIcon size={18} />
          <span>Download all</span>
        </Button>
      </div>

      {isLoading ? (
        <SkeletonLoader variant='table' items={10} columns={5} />
      ) : (
        <DataTableProvider table={table}>
          <DataTableWrapper>
            <DataTable />
            <DataTablePagination />
          </DataTableWrapper>
        </DataTableProvider>
      )}
    </div>
  );
};
