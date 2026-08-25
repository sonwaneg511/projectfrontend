import { XIcon } from 'lucide-react';
import Link from 'next/link';
import { TempLogo } from '@/assets/icons/templogo';
import { Button } from '../../ui/button';

export const MicrositeDetailsHeader = ({ locationName }) => {
  return (
    <div className='py-8 px-10 bg-white border-b flex items-center gap-5 shrink-0'>
      <Link href={'/dashboard'} className='shrink-0'>
        <TempLogo width={130} height={28} />
      </Link>
      <div className='flex-1 flex items-center justify-center'>
        <h1 className='text-2xl font-semibold font-body text-gray-900'>
          {locationName ? ` ${locationName} Microsite` : 'Microsite details'}
        </h1>
      </div>
      <div className='w-40 flex items-center justify-end shrink-0'>
        <Link href={'/microsites'}>
          <Button variant={'ghost'} size={'icon'} className={'shrink-0'}>
            <XIcon className='size-5 text-[rgba(164,167,174,1)]' />
          </Button>
        </Link>
      </div>
    </div>
  );
};
