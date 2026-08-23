import { ChevronRightIcon, HouseIcon } from 'lucide-react';
import Link from 'next/link';

export const LocationDetailsHeader = ({ headerData }) => {
  return (
    <div className='px-6 py-5 bg-white border-b border-border shrink-0'>
      <LocationDetailsBreadcrumb dealerName={headerData.dealerName} />
      <div className='mt-5'>
        <p className='font-semibold text-lg text-gray-900'>
          {headerData.dealerName}
        </p>
        <p className='text-sm text-gray-400'>{headerData.city}</p>
      </div>
    </div>
  );
};

const LocationDetailsBreadcrumb = ({ dealerName }) => {
  return (
    <div className='flex items-center gap-2 text-sm'>
      <Link
        href={'/dashboard'}
        className='text-gray-400 hover:text-gray-600 transition-colors'
      >
        <HouseIcon size={18} />
      </Link>
      <ChevronRightIcon size={16} className='text-gray-400' />
      <Link
        href={'/locations'}
        className='text-gray-400 font-semibold hover:text-gray-600 transition-colors'
      >
        Locations
      </Link>
      <ChevronRightIcon size={16} className='text-gray-400' />
      <p className='text-brand-700 font-semibold'>{dealerName}</p>
    </div>
  );
};
