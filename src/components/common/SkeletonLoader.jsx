'use client';

export default function SkeletonLoader({
  variant = 'card', // 'card' | 'table'
  items = 4, // cards OR table rows
  columns = 5, // only for table
}) {
  return (
    <>
      {variant === 'table' ? (
        <TableSkeleton rows={items} columns={columns} />
      ) : variant === 'form-card' ? (
        <>
          <div className='h-20 border-b'></div>
          <FormCardSkeleton />
        </>
      ) : (
        <CardSkeleton items={items} />
      )}
    </>
  );
}

function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />
  );
}

function CardSkeleton({ items = 4 }) {
  // 🔹 Single full-width card
  if (items === 1) {
    return (
      <div className='p-6'>
        <div className='rounded-lg border bg-white p-4 space-y-3 w-full'>
          <Skeleton className='h-4 w-3/4' />
          <Skeleton className='h-3 w-1/2' />
          <Skeleton className='h-24 w-full' />

          <div className='flex gap-2 pt-2'>
            <Skeleton className='h-3 w-16' />
            <Skeleton className='h-3 w-20' />
          </div>
        </div>
      </div>
    );
  }

  // 🔹 Multiple cards grid
  return (
    <div
      className='
        p-6
        grid gap-4
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
      '
    >
      {Array.from({ length: items }).map((_, index) => (
        <div
          key={index}
          className={`
            rounded-lg border bg-white p-4 space-y-3
            ${index === 3 ? 'lg:col-span-3' : ''}
          `}
        >
          <Skeleton className='h-4 w-3/4' />
          <Skeleton className='h-3 w-1/2' />
          <Skeleton className='h-24 w-full' />

          <div className='flex gap-2 pt-2'>
            <Skeleton className='h-3 w-16' />
            <Skeleton className='h-3 w-20' />
          </div>
        </div>
      ))}
    </div>
  );
}

function TableSkeleton({ rows, columns }) {
  return (
    <div className='rounded-lg border bg-white overflow-hidden'>
      {/* Header */}
      <div className='grid grid-cols-12 gap-4 p-4 border-b'>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className='h-4 col-span-2' />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className='grid grid-cols-12 gap-4 p-4 border-b last:border-none'
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className='h-3 col-span-2' />
          ))}
        </div>
      ))}
    </div>
  );
}

function FormCardSkeleton() {
  return (
    <div className='min-h-[70vh] flex items-center justify-center p-4'>
      <div className='w-full max-w-[640px] mx-auto'>
        <div className='rounded-2xl border bg-white p-6 space-y-6 shadow-sm'>
          {/* Title */}
          <Skeleton className='h-5 w-1/3' />

          {/* Inputs */}
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Skeleton className='h-3 w-24' />
              <Skeleton className='h-10 w-full rounded-lg' />
            </div>

            <div className='space-y-2'>
              <Skeleton className='h-3 w-32' />
              <Skeleton className='h-10 w-full rounded-lg' />
            </div>

            <div className='space-y-2'>
              <Skeleton className='h-3 w-20' />
              <Skeleton className='h-10 w-full rounded-lg' />
            </div>
          </div>

          {/* Divider */}
          <div className='h-px bg-gray-100' />

          {/* Actions */}
          <div className='flex justify-end gap-3'>
            <Skeleton className='h-10 w-24 rounded-lg' />
            <Skeleton className='h-10 w-28 rounded-lg' />
          </div>
        </div>
      </div>
    </div>
  );
}
