'use client';

import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { cva } from 'class-variance-authority';
import {
  ChevronDownIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/auth.context';
import { useDeleteUser } from '@/hooks/mutations/users';
import {
  useGetUserDetailedLocations,
  useGetUsers,
} from '@/hooks/queries/users';
import { cn } from '@/lib/utils';
import {
  DataTable,
  DataTableProvider,
  DataTableWrapper,
} from '../common/data-table/data-table';
import { DataTableHeader } from '../common/data-table/data-table-header';
import { DataTablePagination } from '../common/data-table/data-table-pagination';
import SkeletonLoader from '../common/SkeletonLoader';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Loader } from '../ui/loader';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { TabsContent } from '../ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export const SettingsUsersDataTable = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { userDetails } = useAuth();

  const body = {
    client_id: userDetails?.clientId,
    current_user_id: userDetails?.user_id,
  };

  const { isLoading, data, error } = useGetUsers(body);

  const users = useMemo(() => {
    return data?.users ?? [];
  }, [data]);

  const columns = useMemo(
    () => [
      {
        header: 'Email address',
        accessorKey: 'user_id',
      },
      {
        header: 'Created By',
        cell: ({ row }) => {
          const user = row.original;

          return user.created_by ? user.created_by : '-';
        },
      },
      {
        header: 'Role',
        cell: ({ row }) => {
          const role = row.original.role;

          let badgeVariant;
          let dotVariant;

          switch (role) {
            case 'ADMIN': {
              badgeVariant = 'default';
              dotVariant = 'admin';
              break;
            }

            case 'SUPER_ADMIN': {
              badgeVariant = 'success';
              dotVariant = 'superAdmin';
              break;
            }

            case 'USER': {
              badgeVariant = 'outline';
              dotVariant = 'user';
              break;
            }
          }

          const roleDotVariant = cva('size-1.5 rounded-full', {
            variants: {
              variant: {
                admin: 'bg-brand-500',
                superAdmin: 'bg-success-500',
                user: 'bg-gray-500',
              },
            },
            defaultVariants: {
              variant: 'admin',
            },
          });

          return (
            <Badge variant={badgeVariant} className={'rounded-sm'}>
              <span
                className={cn(roleDotVariant({ variant: dotVariant }))}
              ></span>
              {role}
            </Badge>
          );
        },
      },
      {
        header: 'Modules',
        cell: ({ row }) => {
          const modules = row.original.modules;

          const green = ['CAMPAIGNS'];
          const brand = ['REVIEWS', 'POSTS'];

          function getDotVariant(module) {
            if (green.includes(module)) return 'green';
            if (brand.includes(module)) return 'brand';
          }

          const dotVariant = cva('size-1.5 rounded-full', {
            variants: {
              variant: {
                green: 'bg-success-500',
                brand: 'bg-brand-500',
              },
            },
            defaultVariants: {
              variant: 'brand',
            },
          });

          return (
            <div className='flex gap-1'>
              {modules.map((module) => {
                const variant = getDotVariant(module);

                return (
                  <Badge
                    key={module}
                    variant={'outline'}
                    className={'rounded-sm'}
                  >
                    <span className={cn(dotVariant({ variant }))}></span>
                    {module}
                  </Badge>
                );
              })}
            </div>
          );
        },
      },
      {
        header: 'Location Access',
        cell: ({ row }) => {
          // return <>{row.original.location_count}</>;
          return <UserLocations user={row.original} />;
        },
        meta: {
          cellClassName: 'text-center',
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const user = row.original;

          return (
            <div className='flex items-center gap-2 text-gray-400'>
              <DeleteUserDialog user={user} />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={'ghost'} size={'icon'} asChild>
                    <Link href={`/edit-user/${user.user_id}?from=settings`}>
                      <PencilIcon size={16} />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side={'bottom'}>
                  <p>Edit User</p>
                </TooltipContent>
              </Tooltip>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: users,
    columns,
    state: {
      pagination,
    },

    onPaginationChange: setPagination,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    if (error) {
      const message = error?.data?.message ?? 'Something went wrong.';
      toast.error(message);
    }
  }, [error]);

  return (
    <TabsContent value={'users'}>
      {isLoading ? (
        <SkeletonLoader variant='table' items={10} columns={6} />
      ) : (
        <DataTableProvider table={table}>
          <div className='border-border rounded-xl border'>
            <DataTableHeader className={'border-border gap-4 border-b p-4'}>
              <div className='flex-1'>
                <div className='flex items-center gap-2'>
                  <p className='text-lg font-semibold text-gray-900 dark:text-gray-100'>Users</p>
                  <Badge variant={'outline'} className={'rounded-sm'}>
                    {data?.users?.length ?? 0} users
                  </Badge>
                </div>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Manage your team members and their account permissions here
                </p>
              </div>
              <Button variant={'primary'} asChild className={'shrink-0'}>
                <Link href={'/create-user?from=settings'}>
                  <PlusIcon size={20} />
                  <span>Add User</span>
                </Link>
              </Button>
            </DataTableHeader>
            <DataTableWrapper className={'border-0'}>
              <DataTable />
              <DataTablePagination />
            </DataTableWrapper>
          </div>
        </DataTableProvider>
      )}
    </TabsContent>
  );
};

const DeleteUserDialog = ({ user }) => {
  const [open, setOpen] = useState(false);
  const { userDetails } = useAuth();

  const { isPending, mutateAsync } = useDeleteUser();

  const handleDeleteUser = async () => {
    try {
      const body = {
        current_user_id: userDetails?.user_id,
        target_user_id: user.user_id,
        client_id: userDetails?.clientId,
      };

      await mutateAsync(body);
      toast.success('User deleted successfully.');
      setOpen(false);
    } catch (error) {
      const message = error?.data?.message ?? 'Something went wrong.';
      toast.error(message);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button variant={'ghost'} size={'icon'}>
              <Trash2Icon size={16} />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent side={'bottom'}>
          <p>Delete User</p>
        </TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User Account</AlertDialogTitle>
          <VisuallyHidden>
            <AlertDialogDescription>No description</AlertDialogDescription>
          </VisuallyHidden>
        </AlertDialogHeader>
        <div>
          <p>
            Are you sure you want to delete the account associated with{' '}
            <span className='font-semibold'>{user.user_id}</span>?
          </p>
        </div>
        <AlertDialogFooter>
          <Button
            variant={'outline'}
            className={'shadow-none'}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant={'destructive'}
            disabled={isPending}
            onClick={handleDeleteUser}
          >
            {isPending && <Loader />}
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const UserLocations = ({ user }) => {
  const [open, setOpen] = useState(false);
  const { userDetails } = useAuth();

  const params = {
    userId: user.user_id,
    clientId: userDetails?.clientId,
  };

  const { isLoading, data } = useGetUserDetailedLocations(params, open);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <span className='text-brand-500 cursor-pointer underline'>
          {user.location_count}
        </span>
      </SheetTrigger>

      <SheetContent className='flex w-[640px] flex-col p-0 sm:max-w-none'>
        <div className='flex h-full flex-col overflow-hidden'>
          <SheetHeader className='shrink-0 px-6 pt-5 pb-12'>
            <SheetTitle className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
              User Location Details
            </SheetTitle>
            <VisuallyHidden>
              <SheetDescription>No description</SheetDescription>
            </VisuallyHidden>
          </SheetHeader>

          <div className='flex-1 overflow-y-auto p-2'>
            {isLoading ? (
              <SkeletonLoader variant='table' items={10} columns={5} />
            ) : (
              <LocationTable locations={data ?? []} />
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const LocationTable = ({ locations }) => {
  const [expanded, setExpanded] = useState({});

  const detailedLocations = useMemo(() => {
    const map = new Map();

    locations.forEach((curr) => {
      if (!map.has(curr.state)) {
        map.set(curr.state, {
          id: curr.state,
          accordionItem: true,
          dealer_name: '',
          city: '',
          area: '',
          subLocations: [],
        });
      }

      map.get(curr.state).subLocations.push({
        id: curr.id,
        dealer_id: curr.dealer_id,
        dealer_name: curr.dealer_name,
        state: curr.state,
        city: curr.city,
        area: curr.area,
      });
    });

    return Array.from(map.values());
  }, [locations]);

  const columns = useMemo(
    () => [
      {
        header: 'Location Id',
        cell: ({ row }) => {
          const isAccordionItem = row.original?.accordionItem;

          return (
            <p
              className={cn(
                isAccordionItem
                  ? 'text-sm font-medium text-gray-900 dark:text-gray-100'
                  : 'text-sm text-gray-600 dark:text-gray-400'
              )}
            >
              {row.original.id}
            </p>
          );
        },
      },
      {
        header: 'Location Name',
        accessorKey: 'dealer_name',
      },
      {
        header: 'City',
        accessorKey: 'city',
      },
      {
        header: 'Area',
        accessorKey: 'area',
        cell: ({ row }) => {
          const isAccordionItem = row.original.accordionItem;
          const isOpen = row.getIsExpanded();

          return (
            <div
              className={cn(
                'flex items-center',
                isAccordionItem && 'justify-end'
              )}
            >
              {isAccordionItem ? (
                <ChevronDownIcon
                  size={16}
                  className={cn(
                    'transition-all duration-300',
                    isOpen ? 'rotate-180' : 'rotate-0'
                  )}
                />
              ) : (
                row.original.area
              )}
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: detailedLocations,
    columns,
    state: { expanded },

    onExpandedChange: setExpanded,

    getSubRows: (row) => row.subLocations,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <DataTableWrapper>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className='px-6 py-3.5 text-xs'>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => {
              const isAccordionRow = row.original.accordionItem;

              return (
                <TableRow
                  key={row.id}
                  onClick={
                    isAccordionRow ? row.getToggleExpandedHandler() : undefined
                  }
                  className={isAccordionRow ? 'cursor-pointer' : ''}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className='text-muted-foreground py-10 text-center'
              >
                No results found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </DataTableWrapper>
  );
};
