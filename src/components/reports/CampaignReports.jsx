import { useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useAuth } from '@/context/auth.context';
import { useCampaignReports } from '@/hooks/queries/report';
import { formatNumberDecimal } from '@/lib/utils';
import {
  DashboardCard,
  DashboardCardHeading,
  DashboardCardValue,
} from '../dashboard/common';
import DateRangePicker from '../date-range/DateRangePicker';
import { CampaignWiseReportTable } from './tables/CampaignWiseReportTable';
import { PerformanceReportTable } from './tables/PerformanceReportTable';

// ─── Dummy sparkline data generators ─────────────────────────────────────────

const _upTrend = [
  { v: 20 },
  { v: 25 },
  { v: 22 },
  { v: 30 },
  { v: 35 },
  { v: 33 },
  { v: 40 },
  { v: 45 },
  { v: 48 },
  { v: 55 },
];
const _downTrend = [
  { v: 55 },
  { v: 50 },
  { v: 48 },
  { v: 42 },
  { v: 38 },
  { v: 40 },
  { v: 35 },
  { v: 30 },
  { v: 28 },
  { v: 22 },
];
const _flatTrend = [
  { v: 30 },
  { v: 32 },
  { v: 29 },
  { v: 33 },
  { v: 31 },
  { v: 34 },
  { v: 30 },
  { v: 32 },
  { v: 31 },
  { v: 33 },
];

// ─── Card config ──────────────────────────────────────────────────────────────

// ─── Change Badge ─────────────────────────────────────────────────────────────

// const ChangeBadge = ({ change, size = 'md' }) => {
//   if (!change) return null;

//   const isUp = change.dir === 'up';
//   // const isDown = change.dir === 'down';
//   const isNeutral = change.dir === 'neutral';

//   // const bg = isNeutral ? '#fef9c3' : isUp ? '#dcfce7' : '#fee2e2';
//   const color = isNeutral ? '#854d0e' : isUp ? '#079455' : '#b91c1c';

//   const Icon = isNeutral
//     ? () => <X size={11} strokeWidth={2.5} />
//     : isUp
//       ? () => <TrendingUp size={11} strokeWidth={2.5} />
//       : () => <TrendingDown size={11} strokeWidth={2.5} />;

//   return (
//     <span
//       style={{
//         display: 'inline-flex',
//         alignItems: 'center',
//         gap: 3,
//         // background: bg,
//         color,
//         borderRadius: 999,
//         padding: size === 'sm' ? '2px 7px' : '3px 8px',
//         fontSize: size === 'sm' ? 11 : 12,
//         fontWeight: 600,
//         whiteSpace: 'nowrap',
//       }}
//     >
//       <Icon />
//       {change.pct}%
//     </span>
//   );
// };

// ─── Sparkline ────────────────────────────────────────────────────────────────

const _Sparkline = ({ data, color }) => (
  <ResponsiveContainer width='100%' height={52}>
    <AreaChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
      <defs>
        <linearGradient
          id={`grad-${color.replace('#', '')}`}
          x1='0'
          y1='0'
          x2='0'
          y2='1'
        >
          <stop offset='0%' stopColor={color} stopOpacity={0.25} />
          <stop offset='100%' stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>

      <Area
        type='monotone'
        dataKey='v'
        stroke={color}
        strokeWidth={2}
        dot={false}
        fill={`url(#grad-${color.replace('#', '')})`} // ✅ gradient fill
        isAnimationActive={false}
      />
      <Tooltip content={() => null} cursor={false} />
    </AreaChart>
  </ResponsiveContainer>
);

export default function CampaignReports() {
  const { userDetails } = useAuth();
  const [range, setRange] = useState(() => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);

    return {
      from: lastMonth,
      to: today,
    };
  });

  const startDate = range.from ? range.from.toISOString().split('T')[0] : '';
  const endDate = range.to ? range.to.toISOString().split('T')[0] : '';

  const body = {
    client_id: userDetails.clientId,
    user_id: userDetails.user_id,
    start_date: startDate,
    end_date: endDate,
    page_no: 0,
  };

  const { data, isLoading, error } = useCampaignReports(body);

  if (isLoading) return <div>Loading...</div>;

  const metrics = data?.consolidate_campaign_report[0];

  return (
    <>
      <div className='flex items-center justify-between my-4 pb-3 border-b'>
        <div>
          <h1 className='text-2xl font-semibold text-gray-900 my-1.5'>
            Campaign Reports
          </h1>
          <p className='text-sm text-gray-600'>
            An overview of all your reviews data
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
        {/* Row 1 — Large cards with sparklines */}
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-4'>
          {/* Total Cost — no sparkline, has icon */}
          <DashboardCard className='space-y-2'>
            {/* <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 48,
                background: '#DCFAE6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}
            >
              <TrendingUp size={24} color='#16a34a' strokeWidth={2.5} />
            </div> */}
            <DashboardCardHeading>Total Cost</DashboardCardHeading>
            <DashboardCardValue>
              ₹ {formatNumberDecimal(metrics?.total_cost)}
            </DashboardCardValue>
          </DashboardCard>

          {/* Clicks */}
          <DashboardCard className='space-y-2'>
            <div className='flex items-center justify-between'>
              <DashboardCardHeading>Clicks</DashboardCardHeading>
            </div>
            <div className='flex items-center gap-2 justify-between'>
              <DashboardCardValue>
                {metrics?.total_delivered_clicks}
              </DashboardCardValue>
              {/* <div>
                <ChangeBadge change={{ pct: 100, dir: 'up' }} />
                <span className='text-xs text-gray-400'>vs last month</span>
              </div> */}
            </div>
            {/* <Sparkline data={upTrend} color='#16a34a' /> */}
          </DashboardCard>

          {/* Video Views */}
          <DashboardCard className='space-y-2'>
            <div className='flex items-center justify-between'>
              <DashboardCardHeading>Video Views</DashboardCardHeading>
            </div>
            <div className='flex items-center gap-2 justify-between'>
              <DashboardCardValue>
                {metrics?.total_video_views}
              </DashboardCardValue>
              {/* <div>
                <ChangeBadge change={{ pct: 100, dir: 'down' }} />
                <span className='text-xs text-gray-400'>vs last month</span>
              </div> */}
            </div>
            {/* <Sparkline data={downTrend} color='#ef4444' /> */}
          </DashboardCard>

          {/* Cost Per View */}
          <DashboardCard className='space-y-2'>
            <div className='flex items-center justify-between'>
              <DashboardCardHeading>Cost Per View</DashboardCardHeading>
            </div>
            <div className='flex items-center gap-2 justify-between'>
              <DashboardCardValue>
                ₹ {formatNumberDecimal(metrics?.total_cost_per_views)}
              </DashboardCardValue>
              {/* <div>
                <ChangeBadge change={{ pct: 100, dir: 'up' }} />
                <span className='text-xs text-gray-400'>vs last month</span>
              </div> */}
            </div>
            {/* <Sparkline data={flatTrend} color='#16a34a' /> */}
          </DashboardCard>
        </div>
        <div>
          <div className='col-span-1 lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-4'>
            <DashboardCard className={'space-y-2'}>
              <div className='flex items-center justify-between'>
                <DashboardCardHeading>CTR</DashboardCardHeading>
              </div>
              <div className='flex items-center justify-between'>
                <DashboardCardValue>
                  {formatNumberDecimal(metrics?.ctr)}%
                </DashboardCardValue>
              </div>
            </DashboardCard>
            <DashboardCard className={'space-y-2'}>
              <div className='flex items-center justify-between'>
                <DashboardCardHeading>CPM</DashboardCardHeading>
              </div>
              <div className='flex items-center justify-between'>
                <DashboardCardValue>
                  ₹ {formatNumberDecimal(metrics?.cpm)}
                </DashboardCardValue>
              </div>
            </DashboardCard>
            <DashboardCard className={'space-y-2'}>
              <div className='flex items-center justify-between'>
                <DashboardCardHeading>VTR</DashboardCardHeading>
              </div>
              <div className='flex items-center justify-between'>
                <DashboardCardValue>{metrics?.vtr}%</DashboardCardValue>
              </div>
            </DashboardCard>
          </div>
        </div>
      </div>
      <div className='space-y-4 py-4'>
        <div>
          <div className='px-6 py-5'>
            <h1 className='text-2xl font-semibold text-gray-900 my-1.5'>
              Campaign Reports
            </h1>
            <p className='text-sm text-gray-600'>
              An overview of all your reviews data
            </p>
          </div>
          <PerformanceReportTable data={data} isLoading={isLoading} />
        </div>
        <div>
          <div className='px-6 pb-5'>
            <h1 className='text-2xl font-semibold text-gray-900 my-1.5'>
              Daily Performance Report
            </h1>
            <p className='text-sm text-gray-600'>
              Locations where this creative is posted
            </p>
          </div>
          <CampaignWiseReportTable />
        </div>
      </div>
    </>
  );
}
