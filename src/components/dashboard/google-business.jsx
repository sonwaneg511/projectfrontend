'use client';

import {
  MapPinnedIcon,
  MousePointerClickIcon,
  PhoneCallIcon,
  RouteIcon,
  SearchIcon,
  ZapIcon,
} from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn, formatNumber } from '@/lib/utils';
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
  DashboardSectionLockAction,
  DashboardSectionLockBackdrop,
  DashboardSectionLockCard,
  DashboardSectionLockDescription,
  DashboardSectionLockHeader,
  DashboardSectionLockHeading,
  DashboardTooltipContent,
} from './common';

export const DashboardGoogleBusinessSection = ({
  googleBusinessData,
  isLocked,
  error,
}) => {
  return (
    <DashboardSection id={'google-business-insights'}>
      <DashboardSectionHeader>
        <div className='space-y-0.5'>
          <DashboardSectionHeading>
            Google Business Insights
          </DashboardSectionHeading>
          <DashboardSectionDescription>
            About your location data
          </DashboardSectionDescription>
        </div>
      </DashboardSectionHeader>
      <DashboardSectionContent
        className={cn(
          'grid grid-cols-1 lg:grid-cols-3 gap-4',
          error && 'py-10'
        )}
      >
        {error ? (
          <div className='flex items-center justify-center col-span-3'>
            <p className='text-destructive text-sm text-center'>
              {error?.data?.message ?? 'Something went wrong.'}
            </p>
          </div>
        ) : (
          <>
            <p className='col-span-full font-medium'>Views</p>
            <DashboardCard>
              <div className='flex gap-4'>
                <IconBadge variant={'gray'} className={'size-10'}>
                  <SearchIcon size={18} />
                </IconBadge>
                <div>
                  <DashboardCardHeading className={'mb-2'}>
                    Total Views
                  </DashboardCardHeading>
                  <DashboardCardValue>
                    {formatNumber(googleBusinessData?.summary?.totalViews)}
                  </DashboardCardValue>
                </div>
              </div>
            </DashboardCard>
            <DashboardCard>
              <div className='flex gap-4'>
                <IconBadge variant={'gray'} className={'size-10'}>
                  <SearchIcon size={18} />
                </IconBadge>
                <div>
                  <DashboardCardHeading className={'mb-2'}>
                    Total Searches
                  </DashboardCardHeading>
                  <DashboardCardValue>
                    {formatNumber(googleBusinessData?.summary?.totalSearches)}
                  </DashboardCardValue>
                </div>
              </div>
            </DashboardCard>
            <DashboardCard>
              <div className='flex gap-4'>
                <IconBadge variant={'gray'} className={'size-10'}>
                  <MapPinnedIcon size={18} />
                </IconBadge>
                <div>
                  <DashboardCardHeading className={'mb-2'}>
                    Total Map Views
                  </DashboardCardHeading>
                  <DashboardCardValue>
                    {formatNumber(googleBusinessData?.summary?.totalMapViews)}
                  </DashboardCardValue>
                </div>
              </div>
            </DashboardCard>
            <p className='col-span-full font-medium'>Actions</p>

            <DashboardCard>
              <div className='flex gap-4'>
                <IconBadge variant={'gray'} className={'size-10'}>
                  <PhoneCallIcon size={18} />
                </IconBadge>
                <div>
                  <DashboardCardHeading className={'mb-2'}>
                    Call Initiated
                  </DashboardCardHeading>
                  <DashboardCardValue>
                    {formatNumber(googleBusinessData?.summary?.callsInitiated)}
                  </DashboardCardValue>
                </div>
              </div>
            </DashboardCard>
            <DashboardCard>
              <div className='flex gap-4'>
                <IconBadge variant={'gray'} className={'size-10'}>
                  <MousePointerClickIcon size={18} />
                </IconBadge>
                <div>
                  <DashboardCardHeading className={'mb-2'}>
                    Website Clicks
                  </DashboardCardHeading>
                  <DashboardCardValue>
                    {formatNumber(googleBusinessData?.summary?.websiteClicks)}
                  </DashboardCardValue>
                </div>
              </div>
            </DashboardCard>
            <DashboardCard>
              <div className='flex gap-4'>
                <IconBadge variant={'gray'} className={'size-10'}>
                  <RouteIcon size={18} />
                </IconBadge>
                <div>
                  <DashboardCardHeading className={'mb-2'}>
                    Driving Direction Requests
                  </DashboardCardHeading>
                  <DashboardCardValue>
                    {formatNumber(
                      googleBusinessData?.summary?.drivingDirectionReq
                    )}
                  </DashboardCardValue>
                </div>
              </div>
            </DashboardCard>

            <div className='col-span-1 lg:col-span-3'>
              <DashboardGoogleInsightChart
                chartData={googleBusinessData?.mapSearchTrends ?? []}
              />
            </div>
          </>
        )}

        {isLocked && (
          <DashboardSectionLockBackdrop>
            <DashboardSectionLockCard>
              <div className='flex flex-col gap-4'>
                <DashboardSectionLockHeader />
                <div>
                  <DashboardSectionLockHeading>
                    You've discovered a locked feature
                  </DashboardSectionLockHeading>
                  <DashboardSectionLockDescription>
                    Upgrade your plan to unlock to see your google business
                    insights
                  </DashboardSectionLockDescription>
                </div>
              </div>
              <DashboardSectionLockAction>
                <ZapIcon
                  size={18}
                  strokeWidth={1.5}
                  className='text-brand-300'
                />
                <span>Unlock Google Business Insights</span>
              </DashboardSectionLockAction>
            </DashboardSectionLockCard>
          </DashboardSectionLockBackdrop>
        )}
      </DashboardSectionContent>
    </DashboardSection>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload) {
    const data = payload[0];

    return (
      <DashboardTooltipContent>
        <p>
          <span className='font-semibold'>Month: </span>
          {data.payload.month}
        </p>
        <p>
          <span className='font-semibold'>Views: </span>
          {data.payload.totalViews}
        </p>
        <p>
          <span className='font-semibold'>Actions: </span>
          {data.payload.totalActions}
        </p>
      </DashboardTooltipContent>
    );
  }

  return null;
};

const DashboardGoogleInsightChart = ({ chartData }) => {
  return (
    <DashboardCard className={'p-0 bg-card pb-14'}>
      <div className='py-4 px-6 flex items-center justify-between gap-3'>
        <DashboardCardHeading className={'text-gray-900 font-semibold'}>
          Map and Search Trends
        </DashboardCardHeading>
        <div className='flex items-center gap-3 text-sm text-gray-600'>
          <p>
            <span className='inline-block size-2 rounded-full bg-success-600'></span>{' '}
            Total Actions
          </p>
          <p>
            <span className='inline-block size-2 rounded-full bg-error-600'></span>{' '}
            Total Views
          </p>
        </div>
      </div>
      <div className='w-full h-80 p-5'>
        <ResponsiveContainer width={'100%'} height={'100%'}>
          <LineChart
            data={chartData}
            margin={{
              bottom: 24,
            }}
          >
            <CartesianGrid
              strokeDasharray='0'
              stroke='#e5e7eb'
              vertical={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'none' }} />
            <YAxis
              axisLine={false}
              tickLine={false}
              // domain={[0, 1000]}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <XAxis
              dataKey={'month'}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickMargin={1}
              label={{
                value: 'Months',
                textAnchor: 'center',
                offset: -20,
                position: 'insideBottom',
              }}
            />
            <Line
              type={'monotone'}
              stroke='var(--color-success-600)'
              dataKey={'totalActions'}
              isAnimationActive={true}
              dot={false}
              strokeWidth={2}
            />
            <Line
              type={'monotone'}
              stroke='var(--color-error-600)'
              dataKey={'totalViews'}
              isAnimationActive={true}
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};
