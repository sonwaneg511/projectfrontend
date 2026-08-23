import { ZapIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DashboardCard,
  DashboardCardHeading,
  DashboardCardValue,
  DashboardSection,
  DashboardSectionContent,
  DashboardSectionHeader,
  DashboardSectionHeading,
  DashboardSectionLockAction,
  DashboardSectionLockBackdrop,
  DashboardSectionLockCard,
  DashboardSectionLockDescription,
  DashboardSectionLockHeader,
  DashboardSectionLockHeading,
} from './common';

export const DashboardSocialMediaSection = ({ socialMediaData, isLocked }) => {
  const STATS = [
    {
      label: 'Followers (Meta)',
      key: 'followers',
    },
    {
      label: 'Total Likes (Meta)',
      key: 'totalLikes',
    },
    {
      label: 'Total Shares (Meta)',
      key: 'totalShares',
    },
  ];

  return (
    <DashboardSection id={'social-media-insights'}>
      <DashboardSectionHeader>
        <DashboardSectionHeading>Social Media Insights</DashboardSectionHeading>
      </DashboardSectionHeader>
      <DashboardSectionContent
        className={cn('grid grid-cols-3 gap-4', isLocked && 'py-10')}
      >
        {STATS.map((stat) => {
          const value = socialMediaData.summary[stat.key].value;

          return (
            <DashboardCard key={stat.label} className={'space-y-2'}>
              <div className='flex items-center justify-between gap-3'>
                <DashboardCardHeading>{stat.label}</DashboardCardHeading>
              </div>
              <div className='flex items-center justify-between gap-3'>
                <DashboardCardValue>{value}</DashboardCardValue>
              </div>
            </DashboardCard>
          );
        })}

        {isLocked && (
          <DashboardSectionLockBackdrop>
            <DashboardSectionLockCard className={'w-auto'}>
              <div className='flex items-center gap-4'>
                <DashboardSectionLockHeader
                  className={'size-16'}
                  iconClassName={'size-12'}
                />
                <div>
                  <DashboardSectionLockHeading>
                    You've discovered a locked feature
                  </DashboardSectionLockHeading>
                  <DashboardSectionLockDescription>
                    Upgrade your plan to unlock social media insights
                  </DashboardSectionLockDescription>
                </div>
              </div>
              <DashboardSectionLockAction>
                <ZapIcon
                  size={18}
                  strokeWidth={1.5}
                  className='text-brand-300'
                />
                <span>Unlock Social Media Insights</span>
              </DashboardSectionLockAction>
            </DashboardSectionLockCard>
          </DashboardSectionLockBackdrop>
        )}
      </DashboardSectionContent>
    </DashboardSection>
  );
};
