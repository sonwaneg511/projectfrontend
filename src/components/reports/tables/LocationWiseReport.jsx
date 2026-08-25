'use client';

import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { X } from 'lucide-react';
import { useState } from 'react';
import { mapBackendOperationHours } from '@/components/locations/utils/util';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { LOCATION_WISE_DATA } from '@/constants/static_data';
import { useAuth } from '@/context/auth.context';
import { useGetAllLocations } from '@/hooks/queries/locations';
import SkeletonLoader from '../../common/SkeletonLoader';
import { Badge } from '../../ui/badge';

// ─── Star Rating Cell ─────────────────────────────────────────────────────────

// ─── Component ────────────────────────────────────────────────────────────────
export const LocationWiseReportTable = () => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState('');

  // ✅ Pin Store Id and Location Name to the left
  //   const [columnPinning] = useState({
  //     left: ['storeId', 'locationName'],
  //   });

  const getStatusVariant = (status) => {
    const s = status?.toLowerCase();

    switch (s) {
      // ── Green (success) ──────────────────────
      case 'verified':
      case 'active':
      case 'complete':
        return 'success';

      // ── Red (destructive) ────────────────────
      case 'unverified':
        return 'destructive';

      // ── Yellow/Orange (warning) ──────────────
      case 'duplicate':
        return 'warning';

      // ── No badge / plain text ────────────────
      case 'not setup':
      case 'unassigned':
      case 'incomplete':
        return 'outline'; // render plain text, no badge

      default:
        return 'outline';
    }
  };

  // ── Updated StatusCell ───────────────────────────────────────────
  const StatusCell = ({ getValue }) => {
    const value = getValue();
    if (!value) return <span className='text-gray-400'>—</span>;

    const variant = getStatusVariant(value);

    // Plain text — no badge (Not Setup, Unassigned, Incomplete)
    if (variant === null) {
      return <span className='text-sm text-gray-500'>{value}</span>;
    }

    return <Badge variant={variant}>{value}</Badge>;
  };

  const HealthScoreCell = ({ getValue }) => {
    const value = Number(getValue()) || 0;

    const getColor = (score) => {
      if (score >= 75) return 'var(--color-success-500)'; // green
      if (score >= 50) return 'var(--color-brand-600)'; // blue
      if (score >= 25) return 'var(--color-warning-500)'; // orange
      return 'var(--color-error-500)'; // red
    };

    const color = getColor(value);

    return (
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 80 }}
      >
        {/* Track */}
        <div
          style={{
            width: 48,
            height: 8,
            borderRadius: 999,
            background: '#e5e7eb',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {/* Fill */}
          <div
            style={{
              width: `${value}%`,
              height: '100%',
              borderRadius: 999,
              background: color,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        {/* Label */}
        <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>
          {value}%
        </span>
      </div>
    );
  };
  const HoursOfOperationCell = ({ getValue, row }) => {
    const [open, setOpen] = useState(false);
    const raw = getValue();
    const rowData = row.original;

    const schedule = mapBackendOperationHours(raw);

    const firstOpen = Object.values(schedule).find((d) => !d.closed);
    const triggerLabel = firstOpen
      ? `${firstOpen.open} – ${firstOpen.close}`
      : 'View Hours';

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {/* Trigger */}
        <button
          onClick={() => setOpen(true)}
          className='text-sm text-blue-600 underline underline-offset-2 hover:text-blue-800 transition-colors cursor-pointer whitespace-nowrap'
        >
          {triggerLabel}
        </button>

        {/* Modal */}
        <DialogContent className='max-w-[880px] p-4'>
          <VisuallyHidden.Root>
            <DialogTitle>Hours of Operation</DialogTitle>
          </VisuallyHidden.Root>

          {/* Header */}
          <div className='flex items-start justify-between'>
            <div>
              <p className='font-semibold text-gray-900 text-lg leading-snug'>
                {rowData.dealer_name}
              </p>
              <p className='text-sm text-gray-600'>{rowData.city}</p>
            </div>
            <DialogClose asChild>
              <button className='text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded ml-8'>
                <X size={15} />
              </button>
            </DialogClose>
          </div>
          <div className='flex flex-col gap-0'>
            <p className='text-sm font-semibold text-gray-700 tracking-wide'>
              Hours of Operation
            </p>
            {/* ✅ Tabular format from your structure */}
            <div className='flex flex-wrap gap-0'>
              {Object.entries(schedule).map(([day, hours]) => (
                <div
                  key={day}
                  className={`
          min-w-[120px]
          border border-gray-200
          px-3 py-2
          bg-white
          text-sm
          ${day === 'monday' ? 'rounded-l-lg' : ''}
          ${day === 'sunday' ? 'rounded-r-lg' : ''}
        `}
                >
                  <p className='font-medium text-gray-600 capitalize'>{day}</p>
                  <p className='text-gray-500 font-normal'>
                    {hours?.closed ? (
                      <span className='text-red-400'>Closed</span>
                    ) : (
                      `${hours.open} - ${hours.close}`
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

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
      header: 'Id',
      accessorKey: 'dealer_id',
    },
    {
      header: 'Location Name',
      accessorKey: 'dealer_name',
      meta: {
        cellClassName: 'font-semibold text-gray-900',
        truncate: true,
      },
    },
    { header: 'Status', accessorKey: 'gbp_status', cell: StatusCell },
    {
      header: 'Facebook Status',
      accessorKey: 'facebook_status',
      cell: StatusCell,
    },
    {
      header: 'Campaign Setup',
      accessorKey: 'campaign_setup',
      cell: StatusCell,
    },
    {
      header: 'Health Score',
      accessorKey: 'health_score',
      cell: HealthScoreCell,
    },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Latitude', accessorKey: 'latitude' },
    { header: 'Longitude', accessorKey: 'longitude' },
    { header: 'Phone Number', accessorKey: 'phonenumber' },
    { header: 'Area', accessorKey: 'area' },
    { header: 'City', accessorKey: 'city' },
    { header: 'State', accessorKey: 'state' },
    { header: 'Country', accessorKey: 'country' },
    { header: 'Pincode', accessorKey: 'pincode' },
    { header: 'Address', accessorKey: 'address' },
    {
      header: 'Hours of Operation',
      accessorKey: 'hours_of_operation',
      cell: HoursOfOperationCell,
    },
    { header: 'Website Url', accessorKey: 'website_url' },
    { header: 'Business Description', accessorKey: 'buisness_description' },
    { header: 'Landing Page Url', accessorKey: 'landing_page_url' },
    { header: 'Youtube Url', accessorKey: 'youtube_url' },
    { header: 'Appointment Link', accessorKey: 'appointment_link' },
    { header: 'Whatsapp Url', accessorKey: 'whatsapp_url' },
  ];

  const _table = useReactTable({
    data: LOCATION_WISE_DATA ?? [],
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
          // <DataTableProvider table={table}>
          //   <DataTableHeader>
          //     <DataTableSearch placeholder='Search for location' />
          //   </DataTableHeader>
          //   <DataTableWrapper>
          //     <DataTable />
          //     <DataTablePagination />
          //   </DataTableWrapper>
          // </DataTableProvider>
          <div className='md:col-span-2 lg:col-span-4 flex items-center justify-center p-4'>
            <p className='text-muted-foreground'>No data available!</p>
          </div>
        )}
      </div>
    </div>
  );
};
