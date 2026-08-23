'use client';

import { StarIcon, ZapIcon } from 'lucide-react';
import { useState } from 'react';
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn, formatNumber } from '@/lib/utils';
import {
  DashboardCard,
  DashboardCardHeading,
  DashboardCardValue,
  DashboardLocationsCard,
  DashboardLocationsCardHeader,
  DashboardLocationsTable,
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
import { PIE_COLORS } from './constant';

export const DashboardReviewsSection = ({ reviewsData, isLocked, error }) => {
  const topReviewLocationsColumns = [
    {
      header: 'Id',
      cell: 'locationId',
    },
    {
      header: 'Location Name',
      cell: 'locationName',
      className: 'font-medium',
    },
    {
      header: 'Summary',
      cell: ({ data }) => {
        return (
          <div>
            <p className='font-medium text-gray-900'>{data.ratings} Ratings</p>
            <p className='text-gray-600'>Avg: {data.averageRating}</p>
          </div>
        );
      },
    },
  ];

  const lowestReviewLocationsColumns = [
    {
      header: 'Id',
      cell: 'locationId',
    },
    {
      header: 'Location Name',
      cell: 'locationName',
      className: 'font-medium',
    },
    {
      header: 'Summary',
      cell: ({ data }) => {
        return (
          <div>
            <p className='text-gray-600'>Avg: {data.averageRating}</p>
            <p className='font-medium text-gray-900'>{data.ratings} Ratings</p>
          </div>
        );
      },
    },
  ];

  return (
    <DashboardSection id={'reviews'}>
      <DashboardSectionHeader>
        <div className='space-y-0.5'>
          <DashboardSectionHeading>Reviews</DashboardSectionHeading>
          <DashboardSectionDescription>
            An overview of all of your reviews data
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
            <div className='col-span-1 lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-4'>
              <DashboardCard className={'space-y-2'}>
                <div className='flex items-center justify-between'>
                  <DashboardCardHeading>Total Reviews</DashboardCardHeading>
                </div>
                <div className='flex items-center justify-between'>
                  <DashboardCardValue>
                    {formatNumber(reviewsData?.reviewSummary?.totalReviews)}
                  </DashboardCardValue>
                </div>
              </DashboardCard>
              <DashboardCard className={'space-y-2'}>
                <div className='flex items-center justify-between'>
                  <DashboardCardHeading>Average Rating</DashboardCardHeading>
                </div>
                <div className='flex items-center justify-between'>
                  <DashboardCardValue>
                    {formatNumber(reviewsData?.reviewSummary?.avRating)}
                  </DashboardCardValue>
                </div>
              </DashboardCard>
              <DashboardCard className={'space-y-2'}>
                <div className='flex items-center justify-between'>
                  <DashboardCardHeading>NPS</DashboardCardHeading>
                </div>
                <div className='flex items-center justify-between'>
                  <DashboardCardValue>
                    {reviewsData?.reviewSummary?.nps}%
                  </DashboardCardValue>
                </div>
              </DashboardCard>
            </div>
            <div className='col-span-1 lg:col-span-3 grid grid-cols-1 xl:grid-cols-3 gap-4'>
              <div className='col-span-1 xl:col-span-2'>
                <DashboardReviewChart
                  reviewChartData={reviewsData?.reviewsChart}
                />
              </div>
              <DashboardReviewPieChart
                reviewChartData={reviewsData?.reviewSentiment}
              />
            </div>
            <DashboardReviewRatings
              reviewRatingsData={reviewsData?.ratingsBreakdown}
              averageRating={reviewsData?.reviewSummary?.avRating}
            />
            <DashboardLocationsCard className={'flex flex-col'}>
              <DashboardLocationsCardHeader className={'shrink-0'}>
                <DashboardCardHeading className={'text-base text-gray-900'}>
                  Top Review Locations
                </DashboardCardHeading>
              </DashboardLocationsCardHeader>
              <DashboardLocationsTable
                columns={topReviewLocationsColumns}
                tableData={reviewsData?.topReviewLocations}
              />
            </DashboardLocationsCard>
            <DashboardLocationsCard className={'flex flex-col'}>
              <DashboardLocationsCardHeader className={'shrink-0'}>
                <DashboardCardHeading className={'text-base text-gray-900'}>
                  Lowest Review Locations
                </DashboardCardHeading>
              </DashboardLocationsCardHeader>
              <DashboardLocationsTable
                columns={lowestReviewLocationsColumns}
                tableData={reviewsData?.lowestReviewLocations}
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
                    Upgrade your plan to unlock reviews for all your locations
                  </DashboardSectionLockDescription>
                </div>
              </div>
              <DashboardSectionLockAction>
                <ZapIcon
                  size={18}
                  strokeWidth={1.5}
                  className='text-brand-300'
                />
                <span>Unlock Reviews</span>
              </DashboardSectionLockAction>
            </DashboardSectionLockCard>
          </DashboardSectionLockBackdrop>
        )}
      </DashboardSectionContent>
    </DashboardSection>
  );
};

const DashboardReviewRatings = ({ reviewRatingsData, averageRating = 0 }) => {
  const RATINGS = [
    {
      key: 'fiveStar',
      fill: 5,
    },
    {
      key: 'fourStar',
      fill: 4,
    },
    {
      key: 'threeStar',
      fill: 3,
    },
    {
      key: 'twoStar',
      fill: 2,
    },
    {
      key: 'oneStar',
      fill: 1,
    },
  ];

  const normalizeRating = (rating) => {
    const whole = Math.floor(rating);
    const decimal = rating - whole;

    if (decimal >= 0.3 && decimal <= 0.7) {
      return whole + 0.5;
    }

    if (decimal > 0.7) {
      return whole + 1;
    }

    return whole;
  };

  return (
    <DashboardCard className={'flex flex-col gap-4'}>
      <div className='flex items-center justify-between gap-2 shrin-0'>
        <DashboardCardHeading className={'text-base text-gray-900'}>
          Rating Percentage
        </DashboardCardHeading>
      </div>
      <div className='flex flex-col gap-4 flex-1'>
        {RATINGS.map((rating) => {
          const ratingValue = reviewRatingsData?.[rating.key];

          return (
            <div key={rating.key} className='flex items-center gap-4'>
              <div className='flex items-center gap-0.5 shrink-0'>
                {Array.from({ length: 5 }, (_, idx) => idx + 1).map((item) => {
                  const isFilled = item <= rating.fill;

                  return (
                    <StarIcon
                      key={item}
                      size={18}
                      className={cn(
                        'text-transparent',
                        isFilled
                          ? 'fill-warning-400'
                          : 'fill-[rgba(245,245,245,1)]'
                      )}
                    />
                  );
                })}
              </div>
              <div className='flex items-center gap-3 flex-1'>
                <div className='flex-1 bg-[rgba(233,234,235,1)] h-2 rounded-full w-full relative overflow-hidden'>
                  <div
                    style={{ width: `${ratingValue}%` }}
                    className='bg-brand-600 rounded-full h-full'
                  />
                </div>
                <p className='shrink-0 text-sm font-medium'>{ratingValue}%</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className='flex items-center gap-4 shrink-0'>
        <p className='font-bold text-sm'>Average</p>
        <p className='font-bold text-sm'>{averageRating}</p>
        <div className='flex items-center gap-0.5'>
          {Array.from({ length: 5 }, (_, i) => {
            const normalizedRating = normalizeRating(averageRating);

            const fillPercentage =
              Math.min(Math.max(normalizedRating - i, 0), 1) * 100;

            return (
              <div key={i} className='relative size-[18px]'>
                <StarIcon
                  size={18}
                  className='absolute fill-[rgba(245,245,245,1)] text-transparent'
                />

                {fillPercentage > 0 && (
                  <StarIcon
                    size={18}
                    className='absolute fill-warning-400 text-transparent'
                    style={{
                      clipPath: `inset(0 ${100 - fillPercentage}% 0 0)`,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardCard>
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
          <span className='font-semibold'>Review: </span>{' '}
          {data.payload.totalReviews}
        </p>
        <p>
          <span className='font-semibold'>Rating: </span>{' '}
          {data.payload.totalRating}
        </p>
      </DashboardTooltipContent>
    );
  }

  return null;
};

const DashboardReviewChart = ({ reviewChartData = [] }) => {
  const [hoveredMonth, setHoveredMonth] = useState(null);

  const date = new Date();
  const currentMonth = date.getMonth();

  return (
    <DashboardCard className={'p-0 bg-card'}>
      <div className='px-6 py-4'>
        <DashboardCardHeading className={'text-gray-900 font-semibold'}>
          Reviews
        </DashboardCardHeading>
      </div>
      <div className='p-5'>
        <div className='flex items-center justify-end mb-5'>
          {/* <div className='flex items-center gap-3 flex-1'>
            <p className='text-3xl font-semibold'>526</p>
            <p className='flex items-center gap-1 text-sm text-gray-600'>
              <span className='text-success-600 flex items-center'>
                <TrendingUpIcon size={16} /> 2.4%
              </span>
              <span>vs last month</span>
            </p>
          </div> */}
          <div className='flex justify-center gap-3 text-sm text-gray-600 shrink-0'>
            <p className='flex items-center gap-1'>
              <span className='size-2 rounded-full bg-success-600' />
              Star Rating
            </p>

            <p className='flex items-center gap-1'>
              <span className='size-2 rounded-full bg-brand-500' />
              Total Reviews
            </p>
          </div>
        </div>
        <div className='h-60'>
          <ResponsiveContainer width={'100%'} height={'100%'}>
            <ComposedChart data={reviewChartData ?? []}>
              <CartesianGrid
                strokeDasharray='0'
                stroke='#e5e7eb'
                vertical={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'none' }} />
              <XAxis dataKey={'month'} axisLine={false} tickLine={false} />
              <YAxis
                hide={true}
                axisLine={false}
                tickLine={false}
                // domain={[0, 1000]}
                // ticks={[0, 200, 400, 600, 800, 1000]}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Bar
                name={'Total Reviews'}
                dataKey={'totalReviews'}
                radius={[8, 8, 0, 0]}
                barSize={32}
                onMouseEnter={(data) => setHoveredMonth(data.month)}
                onMouseLeave={() => setHoveredMonth(null)}
              >
                {reviewChartData?.map((data, idx) => {
                  const isCurrentMonth = idx === currentMonth;
                  const isHoveredMonth = hoveredMonth === data.month;

                  return (
                    <Cell
                      key={`cell-${idx}`}
                      fill={`${isHoveredMonth ? 'var(--color-brand-600)' : isCurrentMonth ? 'var(--color-brand-600)' : 'var(--color-brand-100)'}`}
                    />
                  );
                })}
              </Bar>
              <Line
                name='Total Rating'
                dataKey={'totalRating'}
                type={'linear'}
                strokeWidth={2}
                stroke='var(--color-success-600)'
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardCard>
  );
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload) {
    const data = payload[0];

    return (
      <DashboardTooltipContent>
        <p className='text-sm font-semibold'>
          {data.payload.name}:{' '}
          <span className='font-normal'>{data.payload.value}%</span>
        </p>
      </DashboardTooltipContent>
    );
  }

  return null;
};

const DashboardReviewPieChart = ({ reviewChartData }) => {
  const hasData =
    reviewChartData?.pieData?.some((item) => item.value > 0) ?? false;

  return (
    <DashboardCard>
      <div className='flex flex-col gap-6 h-64 xl:h-full'>
        <div className='shrink-0'>
          <DashboardCardHeading className={'text-gray-900 text-base'}>
            Review Sentiment
          </DashboardCardHeading>
        </div>
        {hasData ? (
          <div className='flex-1 grid grid-cols-[210px_1fr] h-[210px] gap-4'>
            <ResponsiveContainer width={'100%'} height={'100%'}>
              <PieChart>
                <Pie
                  data={reviewChartData?.pieData ?? []}
                  dataKey={'value'}
                  cx={'50%'}
                  cy={'50%'}
                  innerRadius={20}
                  outerRadius={85}
                  // TODO: Add label later
                >
                  <Tooltip
                    content={<CustomPieTooltip />}
                    cursor={{ fill: 'none' }}
                  />
                  {reviewChartData?.pieData.map((data, idx) => {
                    return <Cell key={data.name} fill={PIE_COLORS[idx]} />;
                  })}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className='flex flex-col space-y-1 justify-center shrink-0 '>
              {reviewChartData?.pieData.map((data, idx) => {
                return (
                  <div key={data.name} className='flex items-center gap-2'>
                    <span
                      style={{
                        backgroundColor: PIE_COLORS[idx],
                      }}
                      className='size-2 block rounded-full'
                    />
                    <p className='text-sm text-gray-600'>{data.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className='h-full flex items-center justify-center'>
            <p className='text-sm text-muted-foreground'>No data available</p>
          </div>
        )}

        {/* <div className='shrink-0'>
          <p className='text-sm text-gray-600 flex items-center gap-1'>
            Sentiment is
            <span className='text-green-600 flex items-center'>
              <TrendingUpIcon size={16} />
              <span>2.4%</span>
            </span>
            vs last month
          </p>
          <p className='text-success-600 text-3xl font-semibold'>
            +{reviewChartData.sentiment.value}%
          </p>
        </div> */}
      </div>
    </DashboardCard>
  );
};
