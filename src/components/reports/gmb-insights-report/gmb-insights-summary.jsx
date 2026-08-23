import { memo } from 'react';
import {
  DashboardCard,
  DashboardCardHeading,
  DashboardCardValue,
} from '@/components/dashboard/common';
import { GMB_INSIGHTS_SUMMARY_LABELS } from '../constant';

export const GmbInsightsReportsSummary = memo(
  ({ summaryData = {}, isSummaryLoading }) => {
    return (
      <div className='flex flex-col space-y-4'>
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
      </div>
    );
  }
);
