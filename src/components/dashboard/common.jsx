import { LockIcon } from '@/assets/icons/lock-icon';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Table, TableBody, TableCell, TableRow } from '../ui/table';

export const DashboardSection = ({ className, ...props }) => {
  return (
    <section
      data-slot={'section'}
      className={cn('flex flex-col', className)}
      {...props}
    />
  );
};

export const DashboardSectionHeader = ({ className, ...props }) => {
  return (
    <div
      data-slot={'section-header'}
      className={cn(
        'flex items-center justify-between border-b border-border py-3 px-4',
        className
      )}
      {...props}
    />
  );
};

export const DashboardSectionHeading = ({ className, children }) => {
  return (
    <h3
      data-slot={'section-heading'}
      className={cn('text-lg font-semibold font-body text-gray-900', className)}
    >
      {children}
    </h3>
  );
};

export const DashboardSectionDescription = ({ className, children }) => {
  return (
    <p
      data-slot={'section-description'}
      className={cn('text-sm font-body text-gray-600', className)}
    >
      {children}
    </p>
  );
};

export const DashboardSectionContent = ({ className, ...props }) => {
  return (
    <div
      data-slot={'section-content'}
      className={cn('p-4 relative', className)}
      {...props}
    />
  );
};

export const DashboardCard = ({ className, children }) => {
  return <Card className={cn('p-5', className)}>{children}</Card>;
};

export const DashboardCardHeading = ({ className, children }) => {
  return (
    <h4 className={cn('text-sm font-semibold text-gray-600', className)}>
      {children}
    </h4>
  );
};

export const DashboardCardValue = ({ className, children }) => {
  return (
    <p
      className={cn(
        'text-3xl font-semibold font-display text-gray-900',
        className
      )}
    >
      {children}
    </p>
  );
};

export const DashboardLocationsCard = ({ className, children }) => {
  return (
    <DashboardCard className={cn('p-0 overflow-hidden', className)}>
      {children}
    </DashboardCard>
  );
};

export const DashboardLocationsCardHeader = ({ className, children }) => {
  return (
    <div
      className={cn('p-4 flex items-center justify-between gap-2', className)}
    >
      {children}
    </div>
  );
};

export const DashboardLocationsTable = ({
  columns,
  tableData = [],
  rowClassName,
}) => {
  if (!tableData?.length) {
    return (
      <div className='flex items-center justify-center py-10 flex-1'>
        <p className='text-muted-foreground'>No data available</p>
      </div>
    );
  }

  return (
    <Table>
      <TableBody>
        {tableData.map((data, idx) => {
          return (
            <TableRow key={data?.id ?? idx} className={rowClassName}>
              {columns.map((column, idx) => {
                return (
                  <TableCell
                    key={idx}
                    className={cn('px-3 text-gray-900', column?.className)}
                  >
                    {typeof column.cell === 'string'
                      ? data?.[column.cell]
                        ? data?.[column.cell]
                        : '-'
                      : column.cell({ data, column })}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export const DashboardTooltipContent = ({ children }) => {
  return (
    <div className='bg-foreground text-background animate-in fade-in-0 zoom-in-95 text-sm rounded-md p-2'>
      {children}
    </div>
  );
};

export const DashboardSectionLockBackdrop = ({ className, children }) => {
  return (
    <div
      className={cn(
        'inset-0 bg-brand-500/10 backdrop-blur-[2.5px] absolute flex items-center justify-center',
        className
      )}
    >
      {children}
    </div>
  );
};

export const DashboardSectionLockCard = ({ className, children }) => {
  return (
    <div
      className={cn(
        'p-4 border border-brand-500 rounded-[12px] w-[320px] bg-white flex flex-col gap-6',
        className
      )}
    >
      {children}
    </div>
  );
};

export const DashboardSectionLockHeader = ({ className, iconClassName }) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-[linear-gradient(136deg,rgba(137,247,254,0.1)_0%,rgba(102,166,255,0.1)_100%)] rounded-sm h-40',
        className
      )}
    >
      <LockIcon className={cn('size-[95px]', iconClassName)} />
    </div>
  );
};

export const DashboardSectionLockHeading = ({ className, children }) => {
  return (
    <p
      className={cn('font-semibold text-gray-900 mb-1 text-center', className)}
    >
      {children}
    </p>
  );
};

export const DashboardSectionLockDescription = ({ className, children }) => {
  return (
    <p className={cn('text-sm text-gray-600 text-center', className)}>
      {children}
    </p>
  );
};

export const DashboardSectionLockAction = ({
  className,
  children,
  ...props
}) => {
  return (
    <Button variant={'primary'} className={cn('w-full', className)} {...props}>
      {children}
    </Button>
  );
};
