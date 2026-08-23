'use client';

import { MoreVertical } from 'lucide-react';
import {
  Area,
  AreaChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TotalReviewsCard({ data, platform }) {
  function AreaTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;

    return (
      <div className='bg-white border rounded-md px-3 py-2 shadow-sm'>
        <p className='text-xs text-gray-500'>{label}</p>
        <p className='text-sm font-semibold text-gray-900'>
          Reviews: {payload[0].value}
        </p>
      </div>
    );
  }

  if (!data) return null;
  return (
    <Card className='h-full'>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Total Reviews</CardTitle>
        <MoreVertical className='text-gray-400 w-5 h-5 cursor-pointer' />
      </CardHeader>
      <CardContent className='h-56'>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <defs>
              <linearGradient
                id='area-chart-09-fillMobile'
                x1='0'
                y1='0'
                x2='0'
                y2='1'
              >
                <stop offset='5%' stopColor='#A9EFC5' stopOpacity={0.8} />
                <stop offset='95%' stopColor='#A9EFC5' stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey='created_time'
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<AreaTooltip />}
              cursor={{ stroke: '#22C55E', strokeWidth: 1 }}
            />
            {/* <Line
              type='linear'
              dataKey='value2'
              stroke='#A4A7AE'
              strokeWidth={2}
              strokeDasharray='5 5' // dashed line
              dot={false}
            /> */}
            <Line
              type='linear'
              dataKey='no_of_reviews'
              stroke='#22C55E'
              strokeWidth={3}
              dot={false}
            />
            <Area
              dataKey='no_of_reviews'
              type='natural'
              fill='url(#area-chart-09-fillMobile)'
              fillOpacity={0.4}
              stroke='#A9EFC5'
              stackId='a'
            />
            {/* <Area
              dataKey='value2'
              type='natural'
              fill='url(#area-chart-09-fillDesktop)'
              fillOpacity={0.4}
              stroke='var(--color-desktop)'
              stackId='a'
            /> */}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
