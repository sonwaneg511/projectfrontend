'use client';

import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { DownloadIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAuth } from '@/context/auth.context';
import { formatNumber } from '@/lib/utils';
import {
  DataTable,
  DataTableProvider,
  DataTableWrapper,
} from '../common/data-table/data-table';
import { DataTableHeader } from '../common/data-table/data-table-header';
import { DataTablePagination } from '../common/data-table/data-table-pagination';
import { DataTableSearch } from '../common/data-table/data-table-search';
import {
  DashboardCard,
  DashboardCardHeading,
  DashboardCardValue,
} from '../dashboard/common';
import DateRangePicker from '../date-range/DateRangePicker';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { TabsContent } from '../ui/tabs';

export const CampaignsTab = () => {
  const [range, setRange] = useState(() => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);

    return {
      from: lastMonth,
      to: today,
    };
  });

  const { userDetails } = useAuth();

  if (!userDetails?.modules?.includes('CAMPAIGNS')) {
    return (
      <TabsContent value={'campaign-billing'} className={'h-full'}>
        <div className='flex-1 h-full flex items-center justify-center'>
          <div>
            <h1 className='text-3xl font-semibold font-display text-center'>
              You don't have access to this module.
            </h1>
            <p className='text-sm text-gray-400 text-center mt-2'>
              Please contact your administrator to request access to this
              module.
            </p>
          </div>
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent
      value={'campaign-billing'}
      className={'space-y-4 overflow-y-auto h-full'}
    >
      <div className='flex flex-col gap-4 md:flex-row justify-between items-start border-b py-3'>
        <div className='flex flex-col'>
          <h3 className='text-lg font-semibold text-gray-900'>
            Campaign Billing History
          </h3>
          <p className='text-sm text-gray-600'>
            An Overview of all your reviews data
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <p className='text-sm text-gray-600'>Show for: </p>
          <DateRangePicker
            value={range}
            onChange={setRange}
            placeholder='Select Date Range'
            triggerClassName={'w-fit'}
            clearDate={() => {
              setRange({
                from: null,
                to: null,
              });
            }}
          />
        </div>
      </div>
      <CampaignOverview />
      <CampaignDataTable />
    </TabsContent>
  );
};

const CampaignOverview = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      <DashboardCard>
        <DashboardCardHeading className={'font-medium mb-2'}>
          Total Ad Spends
        </DashboardCardHeading>
        <DashboardCardValue>₹ 4,000</DashboardCardValue>
      </DashboardCard>
      <DashboardCard>
        <DashboardCardHeading className={'font-medium mb-2'}>
          Active Campaigns
        </DashboardCardHeading>
        <DashboardCardValue>04</DashboardCardValue>
      </DashboardCard>
      <DashboardCard>
        <DashboardCardHeading className={'font-medium mb-2'}>
          Total Campaigns
        </DashboardCardHeading>
        <DashboardCardValue>40</DashboardCardValue>
      </DashboardCard>
      <DashboardCard>
        <DashboardCardHeading className={'font-medium mb-2'}>
          Average Spend Per Campaign
        </DashboardCardHeading>
        <DashboardCardValue>₹ 500</DashboardCardValue>
      </DashboardCard>
    </div>
  );
};

const campaignData = [
  {
    campaignName: 'Summer Sale Blast',
    location: 'Mumbai',
    duration: '30 Days',
    amountPaid: 15000,
    amountPerDay: 500,
    paymentDate: '2026-05-25',
    startDate: '2026-06-01',
    endDate: '2026-06-30',
    status: 'Active',
  },
  {
    campaignName: 'Monsoon Special',
    location: 'Pune',
    duration: '20 Days',
    amountPaid: 10000,
    amountPerDay: 500,
    paymentDate: '2026-05-18',
    startDate: '2026-05-20',
    endDate: '2026-06-08',
    status: 'Completed',
  },
  {
    campaignName: 'Festival Offers',
    location: 'Delhi',
    duration: '15 Days',
    amountPaid: 7500,
    amountPerDay: 500,
    paymentDate: '2026-06-02',
    startDate: '2026-06-05',
    endDate: '2026-06-19',
    status: 'Scheduled',
  },
  {
    campaignName: 'Weekend Rush',
    location: 'Bangalore',
    duration: '10 Days',
    amountPaid: 6000,
    amountPerDay: 600,
    paymentDate: '2026-04-12',
    startDate: '2026-04-15',
    endDate: '2026-04-24',
    status: 'Completed',
  },
  {
    campaignName: 'Local Awareness',
    location: 'Hyderabad',
    duration: '45 Days',
    amountPaid: 27000,
    amountPerDay: 600,
    paymentDate: '2026-03-10',
    startDate: '2026-03-15',
    endDate: '2026-04-28',
    status: 'Completed',
  },
  {
    campaignName: 'Brand Launch',
    location: 'Chennai',
    duration: '60 Days',
    amountPaid: 48000,
    amountPerDay: 800,
    paymentDate: '2026-01-05',
    startDate: '2026-01-10',
    endDate: '2026-03-10',
    status: 'Completed',
  },
  {
    campaignName: 'New Store Opening',
    location: 'Ahmedabad',
    duration: '25 Days',
    amountPaid: 12500,
    amountPerDay: 500,
    paymentDate: '2026-05-08',
    startDate: '2026-05-10',
    endDate: '2026-06-03',
    status: 'Active',
  },
  {
    campaignName: 'Holiday Promo',
    location: 'Kolkata',
    duration: '14 Days',
    amountPaid: 8400,
    amountPerDay: 600,
    paymentDate: '2026-04-20',
    startDate: '2026-04-22',
    endDate: '2026-05-05',
    status: 'Completed',
  },
  {
    campaignName: 'Customer Retargeting',
    location: 'Mumbai',
    duration: '30 Days',
    amountPaid: 18000,
    amountPerDay: 600,
    paymentDate: '2026-02-15',
    startDate: '2026-02-18',
    endDate: '2026-03-19',
    status: 'Completed',
  },
  {
    campaignName: 'Flash Discount',
    location: 'Jaipur',
    duration: '7 Days',
    amountPaid: 3500,
    amountPerDay: 500,
    paymentDate: '2026-06-10',
    startDate: '2026-06-12',
    endDate: '2026-06-18',
    status: 'Scheduled',
  },
  {
    campaignName: 'Mega Electronics Sale',
    location: 'Surat',
    duration: '21 Days',
    amountPaid: 12600,
    amountPerDay: 600,
    paymentDate: '2026-05-01',
    startDate: '2026-05-03',
    endDate: '2026-05-23',
    status: 'Completed',
  },
  {
    campaignName: 'Restaurant Promotion',
    location: 'Nagpur',
    duration: '30 Days',
    amountPaid: 15000,
    amountPerDay: 500,
    paymentDate: '2026-04-01',
    startDate: '2026-04-05',
    endDate: '2026-05-04',
    status: 'Completed',
  },
  {
    campaignName: 'Fitness Membership Drive',
    location: 'Indore',
    duration: '40 Days',
    amountPaid: 24000,
    amountPerDay: 600,
    paymentDate: '2026-03-25',
    startDate: '2026-04-01',
    endDate: '2026-05-10',
    status: 'Paused',
  },
  {
    campaignName: 'Real Estate Leads',
    location: 'Noida',
    duration: '50 Days',
    amountPaid: 40000,
    amountPerDay: 800,
    paymentDate: '2026-02-05',
    startDate: '2026-02-10',
    endDate: '2026-03-31',
    status: 'Completed',
  },
  {
    campaignName: 'Education Admissions',
    location: 'Lucknow',
    duration: '35 Days',
    amountPaid: 21000,
    amountPerDay: 600,
    paymentDate: '2026-05-12',
    startDate: '2026-05-15',
    endDate: '2026-06-18',
    status: 'Active',
  },
  {
    campaignName: 'Healthcare Awareness',
    location: 'Bhopal',
    duration: '28 Days',
    amountPaid: 16800,
    amountPerDay: 600,
    paymentDate: '2026-04-18',
    startDate: '2026-04-20',
    endDate: '2026-05-17',
    status: 'Completed',
  },
  {
    campaignName: 'Automobile Launch',
    location: 'Chandigarh',
    duration: '45 Days',
    amountPaid: 36000,
    amountPerDay: 800,
    paymentDate: '2026-01-15',
    startDate: '2026-01-20',
    endDate: '2026-03-05',
    status: 'Completed',
  },
  {
    campaignName: 'Wedding Season Deals',
    location: 'Patna',
    duration: '20 Days',
    amountPaid: 12000,
    amountPerDay: 600,
    paymentDate: '2026-06-01',
    startDate: '2026-06-05',
    endDate: '2026-06-24',
    status: 'Scheduled',
  },
  {
    campaignName: 'Retail Growth Campaign',
    location: 'Nashik',
    duration: '30 Days',
    amountPaid: 18000,
    amountPerDay: 600,
    paymentDate: '2026-03-05',
    startDate: '2026-03-10',
    endDate: '2026-04-08',
    status: 'Completed',
  },
  {
    campaignName: 'Year End Clearance',
    location: 'Thane',
    duration: '60 Days',
    amountPaid: 54000,
    amountPerDay: 900,
    paymentDate: '2026-05-20',
    startDate: '2026-06-01',
    endDate: '2026-07-30',
    status: 'Active',
  },
];

const CampaignDataTable = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState('');

  const columns = useMemo(
    () => [
      {
        header: 'Campaign Name',
        accessorKey: 'campaignName',
      },
      {
        header: 'Location',
        accessorKey: 'location',
      },
      {
        header: 'Duration',
        accessorKey: 'duration',
      },
      {
        header: 'Amount Paid',
        cell: ({ row }) => {
          return <>₹ {formatNumber(row.original?.amountPaid)}</>;
        },
      },
      {
        header: 'Amount per Day',
        cell: ({ row }) => {
          return <>₹ {formatNumber(row.original?.amountPerDay)}</>;
        },
      },
      {
        header: 'Payment Date',
        accessorKey: 'paymentDate',
      },
      {
        header: 'Start Date',
        accessorKey: 'startDate',
      },
      {
        header: 'End Date',
        accessorKey: 'endDate',
      },
      {
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original?.status;

          return <Badge>{status}</Badge>;
        },
      },
      {
        header: 'Actions',
        cell: ({ row }) => {
          return (
            <Button variant={'ghost'} className={'text-brand-500'}>
              <DownloadIcon size={20} />
              <span>Invoice</span>
            </Button>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: campaignData ?? [],
    columns,
    state: {
      pagination,
      globalFilter: search,
    },

    manualFiltering: true,
    manualPagination: true,
    rowCount: 20 ?? 0,

    onGlobalFilterChange: setSearch,
    onPaginationChange: setPagination,

    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <DataTableProvider table={table} className={'gap-0'}>
      <DataTableHeader className={'bg-[#FAFAFA] p-4 border-b border-[#E9EAEB]'}>
        <DataTableSearch placeholder={'Search'} />
      </DataTableHeader>
      <DataTableWrapper
        className={'rounded-tr-none rounded-tl-none border-t-0'}
      >
        <DataTable />
        <DataTablePagination />
      </DataTableWrapper>
    </DataTableProvider>
  );
};
