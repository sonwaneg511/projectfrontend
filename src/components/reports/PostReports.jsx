import { useState } from 'react';
import SkeletonLoader from '@/components/common/SkeletonLoader';
import { useAuth } from '@/context/auth.context';
import { useReports } from '@/hooks/queries/report';
import {
  DashboardCard,
  DashboardCardHeading,
  DashboardCardValue,
} from '../dashboard/common';
import DateRangePicker from '../date-range/DateRangePicker';
import PostsBarChart from './PostsBarCharts';
import { ReportsPostTable } from './tables/ReportsPostTable';

export default function PostReports() {
  const { userDetails } = useAuth();
  const [page, _setPage] = useState(0);
  const [range, setRange] = useState(() => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);

    return {
      from: lastMonth,
      to: today,
    };
  });

  const hasAccess = userDetails?.modules?.includes('POSTS');

  const startDate = range.from ? range.from.toISOString().split('T')[0] : '';
  const endDate = range.to ? range.to.toISOString().split('T')[0] : '';

  const body = {
    client_id: userDetails.clientId,
    user_id: userDetails.user_id,
    start_date: startDate,
    end_date: endDate,
    page_no: page,
  };

  const { data, isLoading, error } = useReports(hasAccess ? body : false);

  if (!hasAccess) {
    return (
      <div className='size-full flex items-center justify-center'>
        <div>
          <h1 className='text-3xl font-semibold font-display text-center'>
            You don't have access to this module.
          </h1>
          <p className='text-sm text-gray-400 text-center mt-2'>
            Please contact your administrator to request access to this module.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) return <SkeletonLoader variant='card' />;
  if (error) return <p>Error loading posts</p>;

  return (
    <>
      <div className='flex items-center justify-between my-4 pb-3 border-b'>
        <div>
          <h1 className='text-2xl font-semibold text-gray-900 my-1.5'>Posts</h1>
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
        <div>
          <div>
            <div className='col-span-1 lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-4'>
              <DashboardCard className={'space-y-2'}>
                <div className='flex items-center justify-between'>
                  <DashboardCardHeading>Total Post</DashboardCardHeading>
                </div>
                <div className='flex items-center justify-between'>
                  <DashboardCardValue>
                    {data?.post_reporting_data?.total_posts}
                  </DashboardCardValue>
                </div>
              </DashboardCard>

              <DashboardCard className={'space-y-2'}>
                <div className='flex items-center justify-between'>
                  <DashboardCardHeading>Pending Approval</DashboardCardHeading>
                </div>
                <div className='flex items-center justify-between'>
                  <DashboardCardValue>
                    {data?.post_reporting_data?.pending_deployment}
                  </DashboardCardValue>
                </div>
              </DashboardCard>
            </div>
          </div>
        </div>
        <div>
          <PostsBarChart
            range={range}
            onChange={setRange}
            data={data?.post_reporting_data}
          />
        </div>
        <div>
          <ReportsPostTable data={data} isLoading={isLoading} />
        </div>
      </div>
    </>
  );
}
