import {
  ChromiumIcon,
  ClockCheckIcon,
  FacebookIcon,
  MapPinIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { IconBadge } from '../common/icon-badge';
import {
  DashboardCard,
  DashboardCardHeading,
  DashboardCardValue,
  DashboardSection,
  DashboardSectionContent,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionHeading,
} from './common';

export const DashboardLocationsSection = ({ locationData, error }) => {
  const ITEMS = [
    {
      label: 'Locations',
      key: 'totalLocations',
      icon: MapPinIcon,
    },
    {
      label: 'GMB Connected',
      key: 'gmbLocations',
      icon: ChromiumIcon, // TODO: replace this with google icon
    },
    {
      label: 'Meta Connected',
      key: 'metaLocations',
      icon: FacebookIcon,
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

  return (
    <DashboardSection id={'locations'}>
      <DashboardSectionHeader>
        <div className='space-y-0.5'>
          <DashboardSectionHeading>Locations</DashboardSectionHeading>
          <DashboardSectionDescription>
            An overview of all your location data
          </DashboardSectionDescription>
        </div>
      </DashboardSectionHeader>
      <DashboardSectionContent
        className={cn(
          'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4',
          error && 'py-10'
        )}
      >
        {error ? (
          <div className='flex items-center justify-center col-span-1 md:col-span-2 lg:col-span-4'>
            <p className='text-destructive text-sm text-center'>
              {error?.data?.message ?? 'Something went wrong.'}
            </p>
          </div>
        ) : (
          ITEMS.map((item) => {
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
          })
        )}
      </DashboardSectionContent>
    </DashboardSection>
  );
};
