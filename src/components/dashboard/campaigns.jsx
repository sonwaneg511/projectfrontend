'use client';

import {
  ClockCheckIcon,
  EyeIcon,
  TrendingUpIcon,
  WalletIcon,
  ZapIcon,
} from 'lucide-react';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn, formatNumber } from '@/lib/utils';
import { IconBadge } from '../common/icon-badge';
import { Button } from '../ui/button';
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

export const DashboardCampaignsSection = ({
  campaignsData,
  isLocked,
  error,
}) => {
  return (
    <DashboardSection id={'campaigns'}>
      <DashboardSectionHeader>
        <div className='space-y-0.5'>
          <DashboardSectionHeading>Campaigns</DashboardSectionHeading>
          <DashboardSectionDescription>
            An overview of all your campaigns
          </DashboardSectionDescription>
        </div>
      </DashboardSectionHeader>
      <DashboardSectionContent className={cn('space-y-4', error && 'py-10')}>
        {error ? (
          <div className='flex items-center justify-center'>
            <p className='text-destructive text-sm text-center'>
              {error?.data?.message ?? 'Something went wrong.'}
            </p>
          </div>
        ) : (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              <DashboardCard className={'p-0'}>
                <div className='flex px-5 pt-5 pb-10 gap-4 border-b border-border'>
                  <IconBadge variant={'gray'} className={'size-10'}>
                    <WalletIcon size={18} />
                  </IconBadge>
                  <div className='space-y-2'>
                    <DashboardCardHeading>Total Spends</DashboardCardHeading>
                    <div className='flex items-center gap-2 justify-between'>
                      <DashboardCardValue>
                        ₹{formatNumber(campaignsData?.summary?.totalSpends)}
                      </DashboardCardValue>
                    </div>
                  </div>
                </div>
                <div className='py-4 px-5 flex items-center justify-end'>
                  <Button variant={'outline'}>View report</Button>
                </div>
              </DashboardCard>
              <div className='grid grid-rows-2 gap-4'>
                <DashboardCard className={'pb-1'}>
                  <div className='flex gap-4'>
                    <IconBadge variant={'gray'} className={'size-10'}>
                      <EyeIcon size={18} />
                    </IconBadge>
                    <div className='space-y-2'>
                      <DashboardCardHeading>Impressions</DashboardCardHeading>
                      <div className='flex items-center gap-2 justify-between'>
                        <DashboardCardValue>
                          {formatNumber(campaignsData?.summary?.impressions)}
                        </DashboardCardValue>
                      </div>
                    </div>
                  </div>
                </DashboardCard>
                <DashboardCard className={'pb-1'}>
                  <div className='flex gap-4'>
                    <IconBadge variant={'gray'} className={'size-10'}>
                      <TrendingUpIcon size={18} />
                    </IconBadge>
                    <div className='space-y-2'>
                      <DashboardCardHeading>
                        No. of Campaigns
                      </DashboardCardHeading>
                      <div className='flex items-center gap-2 justify-between'>
                        <DashboardCardValue>
                          {formatNumber(campaignsData?.summary?.totalCampaigns)}
                        </DashboardCardValue>
                      </div>
                    </div>
                  </div>
                </DashboardCard>
              </div>
              <DashboardCard
                className={'p-0 col-span-1 md:col-span-2 lg:col-span-1'}
              >
                <div className='flex px-5 pt-5 pb-10 gap-4 border-b border-border'>
                  <IconBadge
                    variant={'warning'}
                    className={'size-10 border-none shrink-0'}
                  >
                    <ClockCheckIcon size={18} />
                  </IconBadge>
                  <div className='space-y-2'>
                    <DashboardCardHeading>
                      Locations with an active campaign in the last 3 months
                    </DashboardCardHeading>
                    <div className='flex items-center gap-2 justify-between'>
                      <DashboardCardValue>
                        {formatNumber(campaignsData?.summary?.activeCampaigns)}
                      </DashboardCardValue>
                    </div>
                  </div>
                </div>
                <div className='py-4 px-5 flex items-center justify-end'>
                  <Button variant={'outline'}>Setup Locations</Button>
                </div>
              </DashboardCard>
            </div>
            <DashboardCampaignBarChart
              graphData={campaignsData?.spends ?? []}
            />
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
                    Upgrade your plan to unlock campaigns to create campaign
                  </DashboardSectionLockDescription>
                </div>
              </div>
              <DashboardSectionLockAction>
                <ZapIcon
                  size={18}
                  strokeWidth={1.5}
                  className='text-brand-300'
                />
                <span>Unlock Campaigns</span>
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
          <span className='font-semibold'>Spends: ₹</span>
          {formatNumber(data.value)}
        </p>
      </DashboardTooltipContent>
    );
  }

  return null;
};

const getRoundedMax = (data) => {
  const maxValue = Math.max(...data.map((d) => d.value));
  if (maxValue === 0) return 100;

  const magnitude = 10 ** Math.floor(Math.log10(maxValue));
  return Math.ceil(maxValue / magnitude) * magnitude;
};

const DashboardCampaignBarChart = ({ graphData }) => {
  const [hoveredMonth, setHoveredMonth] = useState(null);
  const date = new Date();
  const currentMonth = date.getMonth();

  const yAxisMax = getRoundedMax(graphData); // 👈 computed once

  return (
    <DashboardCard className={'p-0 bg-card pb-14'}>
      <div className='py-4 px-6'>
        <DashboardCardHeading className={'text-gray-900 font-semibold'}>
          Campaign Spends Trends
        </DashboardCardHeading>
      </div>
      <div className='w-full h-80 p-5'>
        <ResponsiveContainer width={'100%'} height={'100%'}>
          <BarChart
            data={graphData}
            margin={{ top: 16, left: 16, right: 16, bottom: 24 }}
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
              domain={[0, yAxisMax]} // 👈 use rounded max here
              label={{
                angle: -90,
                position: 'insideLeft',
                textAnchor: 'middle',
                offset: -4,
              }}
            />
            <XAxis
              dataKey={'month'}
              axisLine={false}
              tickLine={false}
              label={{
                value: 'Months',
                textAnchor: 'center',
                offset: -16,
                position: 'insideBottom',
              }}
            />
            <Bar
              dataKey={'value'}
              radius={[8, 8, 0, 0]}
              barSize={32}
              onMouseEnter={(data) => setHoveredMonth(data.month)}
              onMouseLeave={() => setHoveredMonth(null)}
            >
              {graphData.map((data, idx) => {
                const isCurrentMonth = idx === currentMonth;
                const isHoveredMonth = hoveredMonth === data.month;
                return (
                  <Cell
                    key={`cell-${idx}`}
                    fill={
                      isHoveredMonth || isCurrentMonth
                        ? 'var(--color-brand-600)'
                        : 'var(--color-brand-100)'
                    }
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};
