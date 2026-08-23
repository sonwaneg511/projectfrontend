import { XIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import { TempLogo } from '@/assets/icons/templogo'

export const CreateCampaignHeader = () => {
  return (
    <div className='py-8 px-10 bg-white border-b flex items-center gap-5 shrink-0'>
      <Link href={'/dashboard'} className='shrink-0'>
        {/* <Image src='/Logo.png' alt='Logo' width={160} height={32} priority /> */}
        <TempLogo width={130} height={28} />
      </Link>
      <div className='flex-1 flex items-center justify-center'>
        <h1 className='text-2xl font-semibold font-body text-gray-900'>
          Create a new campaign for your location
        </h1>
      </div>
      <div className='w-40 flex items-center justify-end shrink-0'>
        <Link href={'/campaigns'}>
          <Button variant={'ghost'} size={'icon'} className={'shrink-0'}>
            <XIcon className='size-5 text-[rgba(164,167,174,1)]' />
          </Button>
        </Link>
      </div>
    </div>
  );
};
