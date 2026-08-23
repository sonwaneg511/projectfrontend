// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4'>
      <div className='text-center space-y-4 max-w-md'>
        {/* Big 404 */}
        <p className='text-8xl font-bold text-muted-foreground/20 select-none'>
          404
        </p>

        <h1 className='text-2xl font-semibold tracking-tight'>
          Page not found
        </h1>

        <p className='text-muted-foreground text-sm'>
          This page could not be found. It may have been moved, deleted, or
          never existed.
        </p>

        <Link
          href='/'
          className='inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium shadow hover:bg-primary/90 transition-colors'
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
