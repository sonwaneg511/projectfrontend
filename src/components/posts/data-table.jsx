'use client';

// import { useGetAllCampaigns } from '@/hooks/queries/campaigns';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import {
  DataTable,
  DataTableProvider,
  DataTableWrapper,
} from '../common/data-table/data-table';
import { DataTableHeader } from '../common/data-table/data-table-header';
import { DataTablePagination } from '../common/data-table/data-table-pagination';
import { DataTableSearch } from '../common/data-table/data-table-search';
import { Badge } from '../ui/badge';

export const PostLoactionDataTable = ({ data }) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState('');

  const columns = [
    {
      header: 'Location Name',
      accessorKey: 'location_name',
      meta: {
        cellClassName: 'text-gray-900 font-semibold',
      },
    },
    {
      header: 'Dealer ID',
      accessorKey: 'dealer_id',
    },
    {
      header: 'Area',
      accessorKey: 'area',
    },
    {
      header: 'City',
      accessorKey: 'city',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => {
        const Status = row.getValue('status');
        return <Badge variant={'success'}>{Status}</Badge>;
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      globalFilter: search,
    },

    onGlobalFilterChange: setSearch,
    onPaginationChange: setPagination,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className=''>
      <DataTableProvider table={table}>
        <DataTableHeader>
          <DataTableSearch placeholder={'Search campaign'} />
        </DataTableHeader>
        <DataTableWrapper>
          <DataTable />
          <DataTablePagination />
        </DataTableWrapper>
      </DataTableProvider>
    </div>
  );
};
