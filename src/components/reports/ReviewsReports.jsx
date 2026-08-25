import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth.context';
import { useReviewsReports } from '@/hooks/queries/report';
import { formatNumber } from '@/lib/utils';
import {
  DashboardCard,
  DashboardCardHeading,
  DashboardCardValue,
  DashboardTooltipContent,
} from '../dashboard/common';
import DateRangePicker from '../date-range/DateRangePicker';
import RatingBarCard from '../reviews/RatingBarCard';
import ReviewBreakdownCard from '../reviews/ReviewBreakdownCard';
import ReportsReviewChart from './ReportsReviewChart';
import { ReviewTable } from './tables/ReportsReviewTable';

const sentimentColors = {
  Positive: 'var(--color-success-300)',
  Negative: '#F27B45',
  Neutral: 'var(--color-gray-300)',
};

const commentColors = {
  Blank: 'var(--color-success-300)',
  'With Comments': '#F27B45',
};

export default function ReviewsReports() {
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

  const startDate = range.from
    ? `${range.from.toISOString().split('T')[0]} 00:00:00`
    : '';

  const endDate = range.to
    ? `${range.to.toISOString().split('T')[0]} 23:59:59`
    : '';

  const body = {
    client_id: userDetails.clientId,
    user_id: userDetails.user_id,
    start_date: startDate,
    end_date: endDate,
    page_no: 0,
  };

  const { data, isLoading, error } = useReviewsReports(body);

  const overviewData = data?.review_overview_data ?? {};
  const RatingCountData = data?.rating_count_data ?? {};
  const commentSplit = data?.comment_split_review ?? {};
  const sentimentData = data?.sentiment_review ?? {};
  const graphData = data?.review_graph_data ?? {};
  const tableData = data?.review_table_data ?? {};

  useEffect(() => {
    if (error) {
      const message = error?.data?.message ?? 'Something went wrong.';
      toast.error(message);
    }
  }, [error]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className='flex items-center justify-between my-4 pb-3 border-b'>
        <div>
          <h1 className='text-2xl font-semibold text-gray-900 my-1.5'>
            Reviews
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
        <div>
          <div className='col-span-1 lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-4'>
            <DashboardCard className={'space-y-2'}>
              <div className='flex items-center justify-between'>
                <DashboardCardHeading>
                  Reviews Replied to After a Month
                </DashboardCardHeading>
              </div>
              <div className='flex items-center justify-between'>
                <DashboardCardValue>
                  {overviewData?.reviews_replied_after_month}
                </DashboardCardValue>
              </div>
            </DashboardCard>
            <DashboardCard className={'space-y-2'}>
              <div className='flex items-center justify-between'>
                <DashboardCardHeading>Average Rating</DashboardCardHeading>
              </div>
              <div className='flex items-center justify-between'>
                <DashboardCardValue>
                  {overviewData?.avg_review}
                </DashboardCardValue>
              </div>
            </DashboardCard>
            <DashboardCard className={'space-y-2'}>
              <div className='flex items-center justify-between'>
                <DashboardCardHeading>Un-replied Reviews</DashboardCardHeading>
              </div>
              <div className='flex items-center justify-between'>
                <DashboardCardValue>
                  {overviewData?.unreplied_review}%
                </DashboardCardValue>
              </div>
            </DashboardCard>
          </div>
        </div>
        <div>
          <div className='col-span-1 lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-4'>
            <RatingBarCard ratings={RatingCountData} title={true} />
            <ReviewBreakdownCard
              title='Review Sentiment'
              data={sentimentData}
              colorMap={sentimentColors}
            />
            <ReviewBreakdownCard
              title='Review Comment Split'
              data={commentSplit}
              colorMap={commentColors}
            />
          </div>
        </div>
        <div>
          <div className='col-span-1 xl:col-span-2'>
            <ReportsReviewChart reviewChartData={graphData} />
          </div>
        </div>
        <div>
          <ReviewTable tableData={tableData} isLoading={isLoading} />
        </div>
      </div>
      {/* <div className='h-full flex-1 flex items-center justify-center'>
        <p className='text-muted-foreground'>No data available!</p>
      </div> */}
    </>
  );
}

const _CustomTooltip = ({ active, payload }) => {
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
