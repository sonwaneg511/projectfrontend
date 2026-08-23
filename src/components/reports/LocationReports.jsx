import { ClockCheckIcon, MapPinIcon } from 'lucide-react';
import { useState } from 'react';
import { GoogleIcon } from '@/assets/icons/google';
import { MetaIcon } from '@/assets/icons/meta';
import { cn } from '@/lib/utils';
import { DashboardSectionContent } from '../dashboard/common';
import DateRangePicker from '../date-range/DateRangePicker';
import { LocationWiseReportTable } from './tables/LocationWiseReport';

const _ITEMS = [
  {
    label: 'Locations',
    key: 'totalLocations',
    icon: MapPinIcon,
  },
  {
    label: 'GMB Connected',
    key: 'gmbLocations',
    icon: GoogleIcon, // TODO: replace this with google icon
  },
  {
    label: 'Meta Connected',
    key: 'metaLocations',
    icon: MetaIcon,
  },
  // {
  //   label: 'Microsites',
  //   key: 'micrositeLocations',
  //   icon: GlobeIcon,
  // },
  {
    label: 'Audit Score',
    key: 'auditScore',
    icon: ClockCheckIcon,
  },
];

// TODO: later remove dummy data
const _locationData = {
  totalLocations: 10,
  gmbLocations: 5,
  metaLocations: 3,
  micrositeLocations: 2,
  auditScore: 90,
};
export default function LocationReports() {
  const [range, setRange] = useState(() => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);

    return {
      from: lastMonth,
      to: today,
    };
  });

  return (
    <>
      <div className='flex items-center justify-between my-4 pb-3 border-b'>
        <div>
          <h1 className='text-2xl font-semibold text-gray-900 my-1.5'>
            Location
          </h1>
          <p className='text-sm text-gray-600'>
            An overview of all your location data
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <p className='text-sm text-gray-600'>Show for: </p>
          <DateRangePicker
            value={range}
            onChange={setRange}
            placeholder='Select Date Range'
            triggerClassName={'w-fit'}
            clearDate={() => {
              setRange({
                from: null,
                to: null,
              });
            }}
          />
        </div>
      </div>
      <div className='space-y-4'>
        <DashboardSectionContent
          className={cn(
            'p-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'
          )}
        >
          <div className='md:col-span-2 lg:col-span-4 flex items-center justify-center p-4'>
            <p className='text-muted-foreground'>No data available!</p>
          </div>
          {/* {ITEMS.map((item) => {
            const IconComponent = item.icon;

            const isAuditCard = item.label === 'Audit Score';

            return (
              <DashboardCard key={item.label}>
                <div className='flex gap-4'>
                  <IconBadge
                    variant={isAuditCard ? 'warning' : 'gray'}
                    className={cn(
                      'size-10 shrink-0',
                      isAuditCard && 'border-none'
                    )}
                  >
                    <IconComponent size={18} />
                  </IconBadge>
                  <div>
                    <DashboardCardHeading className={'mb-2'}>
                      {item.label}
                    </DashboardCardHeading>
                    <DashboardCardValue>
                      {locationData?.[item.key] || 0} {isAuditCard && '%'}
                    </DashboardCardValue>
                  </div>
                </div>
              </DashboardCard>
            );
          })} */}
        </DashboardSectionContent>
        <div>
          <div className='px-6 pb-2 pt-8'>
            <h1 className='text-2xl font-semibold text-gray-900 my-1.5'>
              Daily Performance Report
            </h1>
            <p className='text-sm text-gray-600'>
              Locations where this creative is posted
            </p>
          </div>
        </div>
        <LocationWiseReportTable />
      </div>
    </>
  );
}
