'use client';

import { MoreVertical } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PieChartCard({
  title = 'Chart',
  data = [],
  colorMap = {},
}) {
  function PieTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;

    const { name, value } = payload[0];

    return (
      <div className='bg-white border rounded-md px-3 py-2 shadow-sm'>
        <p className='text-sm font-medium text-gray-900'>{name}</p>
        <p className='text-sm text-gray-600'>Count: {value}</p>
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <Card className='p-0'>
      <CardHeader className='pb-2 p-6 flex flex-row items-center justify-between'>
        <CardTitle className='text-base font-semibold text-[#181D27]'>
          {title}
        </CardTitle>
        <MoreVertical className='text-gray-400 w-5 h-5 cursor-pointer' />
      </CardHeader>

      <CardContent className='px-4 pb-4'>
        <div className='flex justify-between items-start'>
          {/* Pie */}
          <div className='w-[200px] h-[200px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={data}
                  dataKey='value'
                  nameKey='name'
                  cx='50%'
                  cy='50%'
                  innerRadius={20}
                  outerRadius={85}
                >
                  {data.map((entry, index) => (
                    <Cell key={index} fill={colorMap[entry.name] || '#ccc'} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className='flex flex-col gap-1 pr-3'>
            {data.map((item, index) => (
              <div key={index} className='flex items-center gap-2'>
                <div
                  className='w-2.5 h-2.5 rounded-full'
                  style={{
                    backgroundColor: colorMap[item.name] || '#ccc',
                  }}
                />
                <span className='text-sm text-[#6B7280]'>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
