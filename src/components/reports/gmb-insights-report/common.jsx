'use client';

import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  DashboardCard,
  DashboardTooltipContent,
} from '@/components/dashboard/common';
import { cn, formatNumber } from '@/lib/utils';

export const GmbInsightsChartCard = ({ className, children }) => {
  return (
    <DashboardCard className={cn('px-6 py-4 flex flex-col gap-6', className)}>
      {children}
    </DashboardCard>
  );
};

export const GmbInsightsChartHeader = ({ className, children }) => {
  return (
    <div
      className={cn('flex items-center justify-between shrink-0', className)}
    >
      {children}
    </div>
  );
};

export const GmbInsightsChartHeading = ({ className, children }) => {
  return (
    <h3
      className={cn(
        'text-base font-semibold text-gray-900 font-body',
        className
      )}
    >
      {children}
    </h3>
  );
};

export const GmbInsightsChartFooter = ({ className, children }) => {
  return (
    <div className={cn('flex items-center justify-end shrink-0', className)}>
      {children}
    </div>
  );
};

const CustomTooltip = ({ active, payload, toolTipKey = 'Views' }) => {
  if (active && payload) {
    const data = payload[0];
    const { name, value } = data.payload;

    return (
      <DashboardTooltipContent>
        <p className='font-semibold'>{toolTipKey}</p>
        <p>
          <span className='font-semibold text-xs'>{name}: </span>{' '}
          {formatNumber(value)}
        </p>
      </DashboardTooltipContent>
    );
  }

  return null;
};

export const GmbInsightsBarChart = ({
  data,
  layout = 'vertical',
  toolTipKey,
}) => {
  const BAR_HEIGHT = 16;
  const GAP = 8; // space between bars
  const TOP_BOTTOM_PADDING = 40;

  const chartHeight = data.length * (BAR_HEIGHT + GAP) + TOP_BOTTOM_PADDING;

  return (
    <div className='flex-1'>
      <div
        style={{
          width: '100%',
          height: chartHeight,
        }}
      >
        <ResponsiveContainer width={'100%'} height={'100%'}>
          <BarChart
            accessibilityLayer
            data={data}
            layout={layout}
            margin={{ left: 24 }}
          >
            <XAxis hide axisLine={false} type='number' dataKey={'value'} />
            <YAxis
              dataKey={'name'}
              type='category'
              tickLine={false}
              tickMargin={10}
              fontSize={12}
              tickFormatter={(value) =>
                value.length > 7 ? `${value.slice(0, 7)}…` : value
              }
            />
            <Bar
              dataKey={'value'}
              fill='var(--color-brand-600)'
              radius={[0, 4, 4, 0]}
              barSize={16}
            />
            <Tooltip
              cursor={false}
              content={<CustomTooltip toolTipKey={toolTipKey} />}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const TOOLTIP_COLORS = {
  0: 'var(--color-brand-900)',
  1: 'var(--color-brand-800)',
  2: 'var(--color-brand-700)',
  3: 'var(--color-brand-600)',
  4: 'var(--color-brand-500)',
  5: 'var(--color-brand-400)',
  6: 'var(--color-brand-300)',
  7: 'var(--color-brand-200)',
  8: 'var(--color-brand-100)',
  9: 'var(--color-gray-200)',
};

export const GmbInsightsPieChart = ({ data, toolTipKey = 'Views' }) => {
  return (
    <div className='flex gap-3 overflow-hidden'>
      <div className='size-[200px] mx-auto'>
        <ResponsiveContainer width={'100%'} height={'100%'}>
          <PieChart>
            <Tooltip
              content={<CustomTooltip toolTipKey={toolTipKey} />}
              cursor={false}
            />

            <Pie
              data={data ?? []}
              dataKey='value'
              cx='50%'
              cy='50%'
              outerRadius={85}
            >
              {data.map((item, idx) => (
                <Cell key={item.name} fill={TOOLTIP_COLORS[idx]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <GmbPieChartLegends data={data} />
    </div>
  );
};

const GmbPieChartLegends = ({ data }) => {
  return (
    <div className='flex items-start justify-center gap-1.5 flex-col'>
      {data.map((item, idx) => {
        return (
          <p
            key={item.name}
            style={{
              '--legend-bg': TOOLTIP_COLORS[idx],
            }}
            className={cn(
              'text-sm flex items-center gap-1.5',
              "before:content-[''] before:size-2 before:bg-(--legend-bg) before:inline-block before:rounded-full"
            )}
          >
            {item.name}
          </p>
        );
      })}
    </div>
  );
};
