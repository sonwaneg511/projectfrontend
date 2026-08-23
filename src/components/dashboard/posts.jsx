'use client';

import { ZapIcon } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '@/lib/utils';
import {
  DashboardCard,
  DashboardCardHeading,
  DashboardCardValue,
  DashboardLocationsCard,
  DashboardLocationsCardHeader,
  DashboardLocationsTable,
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
  DashboardTooltipContent,
} from './common';

export const DashboardPostsSection = ({ postsData, isLocked, error }) => {
  const topPostLocationsColumns = [
    {
      header: 'Id',
      cell: 'id',
    },
    {
      header: 'Location Name',
      cell: 'locationName',
    },
    {
      header: 'Summary',
      cell: ({ data }) => {
        return <p>{data.averagePosts} Posts</p>;
      },
    },
  ];

  const leastPostLocationsColumns = [
    {
      header: 'Id',
      cell: 'id',
    },
    {
      header: 'Location Name',
      cell: 'locationName',
    },
    {
      header: 'Summary',
      cell: ({ data }) => {
        return <p>{data.averagePosts} Posts</p>;
      },
    },
  ];

  return (
    <DashboardSection id={'posts'}>
      <DashboardSectionHeader>
        <DashboardSectionHeading>Posts</DashboardSectionHeading>
      </DashboardSectionHeader>
      <DashboardSectionContent
        className={cn(
          'grid grid-cols-1 md:grid-cols-2 gap-4',
          error && 'py-10'
        )}
      >
        {error ? (
          <div className='flex items-center justify-center col-span-1 md:col-span-2'>
            <p className='text-destructive text-sm text-center'>
              {error?.data?.message ?? 'Something went wrong.'}
            </p>
          </div>
        ) : (
          <>
            <DashboardCard className={'space-y-2'}>
              <div className='flex items-center justify-between gap-3'>
                <DashboardCardHeading>Total Posts</DashboardCardHeading>
              </div>
              <div className='flex items-center justify-between gap-3'>
                <DashboardCardValue>
                  {postsData?.postsSummary?.totalPosts}
                </DashboardCardValue>
              </div>
            </DashboardCard>
            <DashboardCard className={'space-y-2'}>
              <div className='flex items-center justify-between gap-3'>
                <DashboardCardHeading>Pending Posts</DashboardCardHeading>
              </div>
              <div className='flex items-center justify-between gap-3'>
                <DashboardCardValue>
                  {postsData?.postsSummary?.unDeployedPosts}
                </DashboardCardValue>
              </div>
            </DashboardCard>
            <div className='col-span-1 md:col-span-2'>
              <DashboardPostsChart
                postsGraphData={postsData?.postsGraphData ?? []}
              />
            </div>
            <DashboardLocationsCard className={'flex flex-col'}>
              <DashboardLocationsCardHeader className={'shrink-0'}>
                <DashboardCardHeading className={'text-base text-gray-900'}>
                  Top Locations by Posts
                </DashboardCardHeading>
              </DashboardLocationsCardHeader>
              <DashboardLocationsTable
                columns={topPostLocationsColumns}
                tableData={postsData?.topPostLocations}
              />
            </DashboardLocationsCard>
            <DashboardLocationsCard className={'flex flex-col'}>
              <DashboardLocationsCardHeader className={'shrink-0'}>
                <DashboardCardHeading className={'text-base text-gray-900'}>
                  Least Locations by Posts
                </DashboardCardHeading>
              </DashboardLocationsCardHeader>
              <DashboardLocationsTable
                columns={leastPostLocationsColumns}
                tableData={postsData?.leastPostLocations}
              />
            </DashboardLocationsCard>
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
                    Upgrade your plan to unlock posts to post content.
                  </DashboardSectionLockDescription>
                </div>
              </div>
              <DashboardSectionLockAction>
                <ZapIcon
                  size={18}
                  strokeWidth={1.5}
                  className='text-brand-300'
                />
                <span>Unlock Posts</span>
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
          <span className='font-semibold'>Month: </span> {data.payload.month}
        </p>
        <p>
          <span className='font-semibold'>GMB Posts: </span>{' '}
          {data.payload.totalGMBPosts}
        </p>
        <p>
          <span className='font-semibold'>FB Posts: </span>{' '}
          {data.payload.totalFbPosts}
        </p>
      </DashboardTooltipContent>
    );
  }

  return null;
};

const DashboardPostsChart = ({ postsGraphData }) => {
  return (
    <DashboardCard className={'p-0'}>
      <div className='px-5 pt-3 pb-2 flex items-center justify-between'>
        <DashboardCardHeading className={'text-gray-900'}>
          Posts
        </DashboardCardHeading>
        <div className='flex items-center gap-3 text-sm text-gray-600'>
          <div className='flex items-center gap-2'>
            <span className='size-2 rounded-full bg-success-500' />
            <p>GMB Posts</p>
          </div>
          <div className='flex items-center gap-2'>
            <span className='size-2 rounded-full bg-brand-500' />
            <p>Facebook Posts</p>
          </div>
        </div>
      </div>
      <div className='p-5'>
        <div className='h-64'>
          <ResponsiveContainer width={'100%'} height={'100%'}>
            <AreaChart data={postsGraphData} margin={{ left: 16, right: 16 }}>
              <defs>
                <linearGradient id='colorGMBPost' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='var(--color-success-400)'
                    stopOpacity={0.8}
                  />
                  <stop
                    offset='95%'
                    stopColor='var(--color-success-400)'
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id='colorFBPost' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='var(--color-brand-400)'
                    stopOpacity={0.8}
                  />
                  <stop
                    offset='95%'
                    stopColor='var(--color-brand-400)'
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray='0'
                stroke='#e5e7eb'
                vertical={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'none' }} />
              <YAxis
                hide
                axisLine={false}
                tickLine={false}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <XAxis
                dataKey={'month'}
                axisLine={false}
                tickLine={false}
                interval={0}
                tick={{ fontSize: 12 }}
                tickMargin={2}
              />
              <Area
                type={'linear'}
                dataKey={'totalGMBPosts'}
                stroke='var(--color-success-500)'
                fillOpacity={1}
                fill='url(#colorGMBPost)'
              />
              <Area
                type={'linear'}
                dataKey={'totalFbPosts'}
                stroke='var(--color-brand-500)'
                fillOpacity={1}
                fill='url(#colorFBPost)'
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardCard>
  );
};
