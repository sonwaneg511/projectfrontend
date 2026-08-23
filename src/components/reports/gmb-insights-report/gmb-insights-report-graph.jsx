import { memo } from 'react';
import { cn } from '@/lib/utils';
import {
  GmbInsightsBarChart,
  GmbInsightsChartCard,
  GmbInsightsChartFooter,
  GmbInsightsChartHeader,
  GmbInsightsChartHeading,
  GmbInsightsPieChart,
} from './common';

export const GmbInsightsCitywiseViewsGraph = memo(
  ({ isGraphLoading, graphData }) => {
    return (
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-4'>
        {isGraphLoading ? (
          <>
            <div className='h-[300px] bg-card border border-border animate-pulse xl:col-span-2 rounded-xl' />
            <div className='h-[300px] bg-card border border-border animate-pulse rounded-xl' />
          </>
        ) : (
          <>
            <GmbInsightsChartCard className={'xl:col-span-2'}>
              <GmbInsightsChartHeader>
                <GmbInsightsChartHeading>
                  Citywise Distribution of Views
                </GmbInsightsChartHeading>
              </GmbInsightsChartHeader>
              {graphData?.citywiseViews?.chartData?.length ? (
                <>
                  <GmbInsightsBarChart
                    data={graphData?.citywiseViews?.chartData ?? []}
                  />
                  <GmbInsightsChartFooter>
                    <p
                      className={cn(
                        'text-sm text-gray-600 flex items-center gap-1.5',
                        "before:content-[''] before:size-2 before:bg-brand-500 before:inline-block before:rounded-full"
                      )}
                    >
                      Views
                    </p>
                  </GmbInsightsChartFooter>
                </>
              ) : (
                <div className='flex items-center justify-center min-h-32 h-full'>
                  <p className='text-muted-foreground'>No data found.</p>
                </div>
              )}
            </GmbInsightsChartCard>
            <GmbInsightsChartCard>
              <GmbInsightsChartHeader>
                <GmbInsightsChartHeading>
                  Citywise Distribution of Views %
                </GmbInsightsChartHeading>
              </GmbInsightsChartHeader>
              {graphData?.citywiseViews?.pieData?.length ? (
                <GmbInsightsPieChart
                  data={graphData?.citywiseViews?.pieData ?? []}
                  toolTipKey='Views'
                />
              ) : (
                <div className='flex items-center justify-center min-h-32 h-full'>
                  <p className='text-muted-foreground'>No data found.</p>
                </div>
              )}
            </GmbInsightsChartCard>
          </>
        )}
      </div>
    );
  }
);

export const GmbInsightsStatewiseViewsGraph = memo(
  ({ isGraphLoading, graphData }) => {
    return (
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-4'>
        {isGraphLoading ? (
          <>
            <div className='h-[300px] bg-card border border-border animate-pulse xl:col-span-2 rounded-xl' />
            <div className='h-[300px] bg-card border border-border animate-pulse rounded-xl' />
          </>
        ) : (
          <>
            <GmbInsightsChartCard className={'xl:col-span-2'}>
              <GmbInsightsChartHeader>
                <GmbInsightsChartHeading>
                  Statewise Distribution of Views
                </GmbInsightsChartHeading>
              </GmbInsightsChartHeader>
              {graphData?.statewiseViews?.chartData?.length ? (
                <>
                  <GmbInsightsBarChart
                    data={graphData?.statewiseViews?.chartData ?? []}
                    toolTipKey={'Actions'}
                  />
                  <GmbInsightsChartFooter>
                    <p
                      className={cn(
                        'text-sm text-gray-600 flex items-center gap-1.5',
                        "before:content-[''] before:size-2 before:bg-brand-500 before:inline-block before:rounded-full"
                      )}
                    >
                      Views
                    </p>
                  </GmbInsightsChartFooter>
                </>
              ) : (
                <div className='flex items-center justify-center min-h-32 h-full'>
                  <p className='text-muted-foreground'>No data found.</p>
                </div>
              )}
            </GmbInsightsChartCard>
            <GmbInsightsChartCard>
              <GmbInsightsChartHeader>
                <GmbInsightsChartHeading>
                  Statewise Distribution of Views %
                </GmbInsightsChartHeading>
              </GmbInsightsChartHeader>
              {graphData?.statewiseViews?.pieData?.length ? (
                <GmbInsightsPieChart
                  data={graphData?.statewiseViews?.pieData ?? []}
                  toolTipKey='Views'
                />
              ) : (
                <div className='flex items-center justify-center min-h-32 h-full'>
                  <p className='text-muted-foreground'>No data found.</p>
                </div>
              )}
            </GmbInsightsChartCard>
          </>
        )}
      </div>
    );
  }
);

export const GmbInsightsCitywiseActionsGraph = memo(
  ({ isGraphLoading, graphData }) => {
    return (
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-4'>
        {isGraphLoading ? (
          <>
            <div className='h-[300px] bg-card border border-border animate-pulse xl:col-span-2 rounded-xl' />
            <div className='h-[300px] bg-card border border-border animate-pulse rounded-xl' />
          </>
        ) : (
          <>
            <GmbInsightsChartCard className={'xl:col-span-2'}>
              <GmbInsightsChartHeader>
                <GmbInsightsChartHeading>
                  Citywise Distribution of Actions
                </GmbInsightsChartHeading>
              </GmbInsightsChartHeader>
              {graphData?.citywiseActions?.chartData?.length ? (
                <>
                  <GmbInsightsBarChart
                    data={graphData?.citywiseActions?.chartData ?? []}
                  />
                  <GmbInsightsChartFooter>
                    <p
                      className={cn(
                        'text-sm text-gray-600 flex items-center gap-1.5',
                        "before:content-[''] before:size-2 before:bg-brand-500 before:inline-block before:rounded-full"
                      )}
                    >
                      Actions
                    </p>
                  </GmbInsightsChartFooter>
                </>
              ) : (
                <div className='flex items-center justify-center min-h-32 h-full'>
                  <p className='text-muted-foreground'>No data found.</p>
                </div>
              )}
            </GmbInsightsChartCard>
            <GmbInsightsChartCard>
              <GmbInsightsChartHeader>
                <GmbInsightsChartHeading>
                  Citywise Distribution of Actions %
                </GmbInsightsChartHeading>
              </GmbInsightsChartHeader>
              {graphData?.citywiseActions?.pieData?.length ? (
                <GmbInsightsPieChart
                  data={graphData?.citywiseActions?.pieData ?? []}
                  toolTipKey='Actions'
                />
              ) : (
                <div className='flex items-center justify-center min-h-32 h-full'>
                  <p className='text-muted-foreground'>No data found.</p>
                </div>
              )}
            </GmbInsightsChartCard>
          </>
        )}
      </div>
    );
  }
);

export const GmbInsightsStatewiseActionsGraph = memo(
  ({ isGraphLoading, graphData }) => {
    return (
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-4'>
        {isGraphLoading ? (
          <>
            <div className='h-[300px] bg-card border border-border animate-pulse xl:col-span-2 rounded-xl' />
            <div className='h-[300px] bg-card border border-border animate-pulse rounded-xl' />
          </>
        ) : (
          <>
            <GmbInsightsChartCard className={'xl:col-span-2'}>
              <GmbInsightsChartHeader>
                <GmbInsightsChartHeading>
                  Statewise Distribution of Actions
                </GmbInsightsChartHeading>
              </GmbInsightsChartHeader>
              {graphData?.statewiseActions?.chartData?.length ? (
                <>
                  <GmbInsightsBarChart
                    data={graphData?.statewiseActions?.chartData ?? []}
                    toolTipKey={'Actions'}
                  />
                  <GmbInsightsChartFooter>
                    <p
                      className={cn(
                        'text-sm text-gray-600 flex items-center gap-1.5',
                        "before:content-[''] before:size-2 before:bg-brand-500 before:inline-block before:rounded-full"
                      )}
                    >
                      Actions
                    </p>
                  </GmbInsightsChartFooter>
                </>
              ) : (
                <div className='flex items-center justify-center min-h-32 h-full'>
                  <p className='text-muted-foreground'>No data found.</p>
                </div>
              )}
            </GmbInsightsChartCard>
            <GmbInsightsChartCard>
              <GmbInsightsChartHeader>
                <GmbInsightsChartHeading>
                  Statewise Distribution of Actions %
                </GmbInsightsChartHeading>
              </GmbInsightsChartHeader>
              {graphData?.statewiseActions?.pieData?.length ? (
                <GmbInsightsPieChart
                  data={graphData?.statewiseActions?.pieData ?? []}
                  toolTipKey='Actions'
                />
              ) : (
                <div className='flex items-center justify-center min-h-32 h-full'>
                  <p className='text-muted-foreground'>No data found.</p>
                </div>
              )}
            </GmbInsightsChartCard>
          </>
        )}
      </div>
    );
  }
);
