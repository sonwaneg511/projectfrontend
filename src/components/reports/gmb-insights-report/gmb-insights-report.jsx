'use client';

import { format } from 'date-fns';
import { useState } from 'react';
import { useAuth } from '@/context/auth.context';
import {
  useGetGMBGraphData,
  useGetGMBSummaryData,
} from '@/hooks/queries/report';
import {
  DashboardSection,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionHeading,
} from '../../dashboard/common';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../ui/accordion';
import { GmbInsightsFilter } from './filter';
import { GmbCampaignReportTable } from './gmb-campaign-report-table';
import {
  GmbInsightsCitywiseActionsGraph,
  GmbInsightsCitywiseViewsGraph,
  GmbInsightsStatewiseActionsGraph,
  GmbInsightsStatewiseViewsGraph,
} from './gmb-insights-report-graph';
import { GmbInsightsReportsSummary } from './gmb-insights-summary';

export const GmbInsightsReports = () => {
  const [filter, setFilter] = useState({
    country: '',
    state: '',
    city: '',
    locations: [],
  });
  const [range, setRange] = useState(() => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);

    return {
      from: lastMonth,
      to: today,
    };
  });
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { userDetails } = useAuth();

  const body = {
    user_id: userDetails?.user_id,
    client_id: userDetails?.clientId,
    start_date: range.from ? format(range.from, 'yyyy-MM-dd') : '',
    end_date: range.to ? format(range.to, 'yyyy-MM-dd') : '',
    country: filter.country,
    state: filter.state,
    city: filter.city,
    dealer_id: filter.locations,
  };

  const { isLoading: isSummaryLoading, data: summaryData } =
    useGetGMBSummaryData(body);

  const { isLoading: isGraphLoading, data: graphData } =
    useGetGMBGraphData(body);

  return (
    <DashboardSection className={'space-y-4'}>
      <DashboardSectionHeader className={'px-0'}>
        <div>
          <DashboardSectionHeading className={'mb-0.5'}>
            Google Business Insights
          </DashboardSectionHeading>

          <DashboardSectionDescription>
            An overview of all your reviews data
          </DashboardSectionDescription>
        </div>
        <GmbInsightsFilter
          value={filter}
          onValueChange={setFilter}
          range={range}
          setRange={setRange}
          setPagination={setPagination}
        />
      </DashboardSectionHeader>
      <GmbInsightsReportsSummary
        summaryData={summaryData ?? {}}
        isSummaryLoading={isSummaryLoading}
      />
      {/* <div className='flex flex-col space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {isSummaryLoading
            ? Array.from({ length: 13 }, (_, idx) => idx + 1).map((item) => {
                return (
                  <div
                    key={item}
                    className='rounded-xl border bg-card text-card-foreground h-24 animate-pulse'
                  ></div>
                );
              })
            : Object.keys(GMB_INSIGHTS_SUMMARY_LABELS).map((summaryKey) => {
                return (
                  <DashboardCard key={summaryKey}>
                    <DashboardCardHeading className={'mb-2'}>
                      {GMB_INSIGHTS_SUMMARY_LABELS[summaryKey]}
                    </DashboardCardHeading>
                    <DashboardCardValue>
                      {summaryData?.[summaryKey]}
                    </DashboardCardValue>
                  </DashboardCard>
                );
              })}
        </div>
      </div> */}
      {/* <div className='grid grid-cols-1 xl:grid-cols-3 gap-4'>
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
      </div> */}
      <GmbInsightsCitywiseViewsGraph
        isGraphLoading={isGraphLoading}
        graphData={graphData}
      />
      <GmbInsightsStatewiseViewsGraph
        isGraphLoading={isGraphLoading}
        graphData={graphData}
      />
      <GmbInsightsCitywiseActionsGraph
        isGraphLoading={isGraphLoading}
        graphData={graphData}
      />
      <GmbInsightsStatewiseActionsGraph
        isGraphLoading={isGraphLoading}
        graphData={graphData}
      />
      <Accordion collapsible defaultValue={'campaign-report'}>
        <AccordionItem value={'campaign-report'} className={'border-none'}>
          <AccordionTrigger
            asChild
            className={
              'py-5 px-6 hover:bg-transparent rounded-none border-b border-gray-200'
            }
          >
            <DashboardSectionHeader className={'px-0 border-none py-0'}>
              <div>
                <DashboardSectionHeading className={'mb-0.5'}>
                  Campaign Wise Report
                </DashboardSectionHeading>

                <DashboardSectionDescription className={'font-normal'}>
                  Loations where this creative is posted
                </DashboardSectionDescription>
              </div>
            </DashboardSectionHeader>
          </AccordionTrigger>
          <AccordionContent>
            <GmbCampaignReportTable
              pagination={pagination}
              setPagination={setPagination}
              body={body}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </DashboardSection>
  );
};
