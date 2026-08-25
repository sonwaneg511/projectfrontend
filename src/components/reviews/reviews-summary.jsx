import { memo } from 'react';
import ReviewBreakdownCard from '@/components/reviews/ReviewBreakdownCard';
import InsightCard from './InsightCard';
import RatingBarCard from './RatingBarCard';
import TotalReviewsCard from './TotalReviewGraph';

export const ReviewsSummary = memo(({ reviewInsightData, platform }) => {
  const ReviewBreakdownColor = {
    Positive: 'var(--color-success-300)',
    Negative: '#F27B45',
    Neutral: 'var(--color-gray-300)',
  };

  const normalizeSentiment = (data) => [
    { name: 'Positive', value: data?.positive || 0 },
    { name: 'Negative', value: data?.negative || 0 },
    { name: 'Neutral', value: data?.neutral || 0 },
  ];

  const PieData = reviewInsightData?.review_breakdown ?? null;
  const graphData = reviewInsightData?.total_review_graphs ?? null;
  const RatingCountData = reviewInsightData?.starRating_count ?? null;
  const totalReviewCount = reviewInsightData?.total_reviews ?? null;
  const pendingResponse = reviewInsightData?.pending_responses ?? null;

  return (
    <>
      <div className='col-span-4 space-y-4'>
        <ReviewBreakdownCard
          title='Review Breakdown'
          colorMap={ReviewBreakdownColor}
          data={normalizeSentiment(PieData)}
          platform={platform}
        />
      </div>

      <div className='col-span-8 space-y-4'>
        <TotalReviewsCard data={graphData} platform={platform} />
      </div>

      {platform === 'FACEBOOK' && (
        <div className='col-span-4 space-y-4'>
          <RatingBarCard ratings={RatingCountData} />
        </div>
      )}

      <div
        className={`${platform === 'FACEBOOK' ? 'col-span-4' : 'col-span-6'} space-y-4`}
      >
        <InsightCard
          title='Total Reviews'
          value={totalReviewCount ?? 0}
          growth='20%'
          variation='lg'
        />
      </div>

      <div
        className={`${platform === 'FACEBOOK' ? 'col-span-4' : 'col-span-6'} space-y-4`}
      >
        <InsightCard
          title='Pending Response'
          value={pendingResponse ?? 0}
          growth='20%'
          variation='lg'
        />
      </div>
    </>
  );
});
