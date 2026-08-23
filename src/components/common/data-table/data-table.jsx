'use client';

import { flexRender } from '@tanstack/react-table';
import { createContext, useContext } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

const DataTableContext = createContext(null);

const useDataTable = () => {
  const context = useContext(DataTableContext);
  if (!context) {
    throw new Error('user useDataTable within DataTableProvider.');
  }
  return context;
};

const DataTableProvider = ({ table, className, children }) => {
  return (
    <DataTableContext.Provider value={{ table }}>
      <div className={cn('flex flex-col gap-4', className)}>{children}</div>
    </DataTableContext.Provider>
  );
};

const DataTableWrapper = ({ className, children }) => {
  return (
    // ✅ overflow-x: auto here — this is the scroll container
    <div
      className={cn(
        'rounded-xl border border-border overflow-x-auto',
        className
      )}
    >
      {children}
    </div>
  );
};

// Helper: is this the last pinned-left column? Used to draw the shadow separator.
// const isLastLeftPinned = (column) => {
//   if (column.getIsPinned() !== 'left') return false;
//   const leftCols = column
//     .getLeafColumns?.()
//     ?.filter((c) => c.getIsPinned() === 'left') ?? [];
//   // Use the table's left-pinned columns via the header
//   return column.getPinnedIndex?.() === -1
//     ? false
//     : true; // fallback — we'll compute via getAfter below
// };

const DataTable = () => {
  const { table } = useDataTable();

  // IDs of all left-pinned columns so we can find the last one
  const leftPinnedIds = table.getState().columnPinning?.left ?? [];
  const lastLeftPinnedId = leftPinnedIds[leftPinnedIds.length - 1];

  const getPinnedStyles = (column) => {
    const pinned = column.getIsPinned();
    if (!pinned) return {};

    const isLastLeft = pinned === 'left' && column.id === lastLeftPinnedId;

    return {
      position: 'sticky',
      left: pinned === 'left' ? column.getStart('left') : undefined,
      right: pinned === 'right' ? column.getAfter('right') : undefined,
      width: column.getSize(), // ✅ force exact width on the cell itself
      minWidth: column.getSize(), // ✅ no shrinking
      maxWidth: column.getSize(), // ✅ no growing
      zIndex: 20,
      background: 'white',
      boxShadow: isLastLeft ? '4px 0 8px -2px rgba(0,0,0,0.10)' : undefined,
      clipPath: isLastLeft ? 'inset(0px -12px 0px 0px)' : undefined,
    };
  };

  const getHeaderPinnedStyles = (column) => {
    const base = getPinnedStyles(column);
    if (!base.position) return {};
    return {
      ...base,
      zIndex: 30, // headers sit above body cells
    };
  };

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const meta = header.column.columnDef?.meta ?? {};
              return (
                <TableHead
                  key={header.id}
                  variant={meta.variant}
                  className={cn(
                    meta.headerClassName,
                    // ✅ Fixed width + ellipsis for truncated columns
                    meta.truncate && 'truncate'
                  )}
                  style={{
                    ...getHeaderPinnedStyles(header.column),
                    // ✅ use column size — works for any column, not just 82px
                    width: meta.truncate ? header.column.getSize() : undefined,
                    background: 'white',
                    maxWidth: meta.truncate
                      ? header.column.getSize()
                      : undefined,
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody>
        {table.getRowModel().rows.length > 0 ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-stat={row.getIsSelected() ? 'selected' : ''}
            >
              {row.getVisibleCells().map((cell) => {
                const meta = cell.column.columnDef?.meta ?? {};
                return (
                  <TableCell
                    key={cell.id}
                    variant={meta.variant}
                    className={cn(
                      meta.cellClassName,
                      // ✅ Fixed width + ellipsis for truncated columns
                      meta.truncate &&
                        ' truncate overflow-hidden text-ellipsis whitespace-nowrap'
                    )}
                    style={{
                      ...getPinnedStyles(cell.column),
                      // ✅ use column size — works for any column, not just 82px
                      width: meta.truncate ? cell.column.getSize() : undefined,
                      maxWidth: meta.truncate
                        ? cell.column.getSize()
                        : undefined,
                    }}
                    // ✅ Show full text on hover for truncated cells
                    title={
                      meta.truncate ? String(cell.getValue() ?? '') : undefined
                    }
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                );
              })}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={table.getAllColumns().length}
              className='py-10 text-center text-muted-foreground'
            >
              No results found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export { DataTable, DataTableProvider, DataTableWrapper, useDataTable };
