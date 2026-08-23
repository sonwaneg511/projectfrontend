'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PlatformConnectionGate } from '@/components/common/PlatformConnectionGate';
import SkeletonLoader from '@/components/common/SkeletonLoader';
import ReviewItem from '@/components/reviews/ReviewItem';
import { ReviewsSummary } from '@/components/reviews/reviews-summary';
import { Button } from '@/components/ui/button';
import { FILTER_STORAGE_KEY } from '@/constants/constants';
import { useAuth } from '@/context/auth.context';
import { useGetFilteredLocations } from '@/hooks/queries/locations';
import { useReviewsInsight, useReviewsList } from '@/hooks/queries/reviews';
import { buildReviewFilterPayload } from '@/lib/FilterDataNormalize';
import { cn, generatePaginationBtns } from '@/lib/utils';
import { ReviewsFilter } from './filter';
import { ReviewsHeader } from './header';

export const ReviewsMain = () => {
  const pathname = usePathname();
  const [platform, setPlatform] = useState('GMB');
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState(null);
  const { userDetails } = useAuth();
  const [locationFilter, setLocationFilter] = useState({
    country: '',
    state: '',
    city: '',
  });

  const reviewListContainerRef = useRef(null);

  useEffect(() => {
    if (pathname === '/reviews') {
      localStorage.removeItem(FILTER_STORAGE_KEY);
    }
  }, [pathname]);

  const payload = buildReviewFilterPayload({
    client_id: userDetails?.clientId,
    user_id: userDetails?.user_id,
    state: filters?.state || '',
    city: filters?.city || '',
    dealer_id: filters?.dealer_id || [],
    rating_range: filters?.rating || 0,
    rating_type: filters?.rating ? 'gte' : '',
    repliedFilter: {
      replied: filters?.replied,
      notReplied: filters?.notReplied,
    },
    start_date: filters?.dateRange?.startDate,
    end_date: filters?.dateRange?.endDate,
    platform,
    page_no: page,
  });

  const { data: reviewInsightData, isLoading: isInsightLoading } =
    useReviewsInsight({ ...payload, page_no: 0 });

  const {
    data: reviewListData,
    isLoading: isListLoading,
    error: errorList,
  } = useReviewsList(payload);

  const { data: filteredLocations } = useGetFilteredLocations({
    client_id: userDetails?.clientId,
    user_id: userDetails?.user_id,
    ...locationFilter,
  });

  const scrollToContainer = useCallback(() => {
    reviewListContainerRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, []);

  const handleLocationChange = (key, value) => {
    setLocationFilter((prev) => {
      if (key === 'country') return { country: value, state: '', city: '' };
      if (key === 'state') return { ...prev, state: value, city: '' };
      return { ...prev, [key]: value };
    });
  };

  const reviewResponseData = reviewListData?.review_response ?? [];
  const paginationBtns = generatePaginationBtns(
    reviewListData?.total_no_of_pages ?? 0,
    page
  );

  return (
    <>
      <ReviewsHeader />
      <div className='space-y-4 p-4 flex-1 overflow-y-auto'>
        <ReviewsFilter
          platform={platform}
          onPlatformChange={(p) => {
            setPlatform(p);
            setPage(0);
          }}
          onFilterChange={(f) => {
            setFilters(f);
            setPage(0);
          }}
          locationData={filteredLocations}
          locationFilters={locationFilter}
          onLocationChange={handleLocationChange}
        />

        <PlatformConnectionGate platform={platform} sectionName='reviews'>
          <div className='grid grid-cols-12 gap-4'>
            {isInsightLoading ? (
              <div className='col-span-12 space-y-4'>
                <SkeletonLoader variant='card' items={4} />
              </div>
            ) : (
              <ReviewsSummary
                reviewInsightData={reviewInsightData}
                platform={platform}
              />
            )}

            <div ref={reviewListContainerRef} className='col-span-12'>
              <div className='bg-card rounded-lg p-4 border border-gray-200'>
                <div className='flex items-center justify-between mb-4.5 mx-2 mt-0.5'>
                  <h3 className='text-lg fw-semibold text-gray-900 font-body'>
                    Reviews
                  </h3>
                </div>

                <div className='space-y-4'>
                  {isListLoading ? (
                    <SkeletonLoader variant='card' items={1} />
                  ) : errorList ? (
                    <h4 className='font-body text-center text-gray-500 py-5'>
                      {errorList?.data.message}
                    </h4>
                  ) : reviewResponseData.length > 0 ? (
                    reviewResponseData.map((r) => (
                      <ReviewItem
                        key={r.review_id}
                        review={r}
                        platform={platform}
                      />
                    ))
                  ) : (
                    <div className='flex items-center justify-center'>
                      <p className='text-md text-gray-600 font-semibold py-4'>
                        No data available
                      </p>
                    </div>
                  )}
                </div>

                <div className='border-t mt-2 px-4 flex items-center justify-between py-6'>
                  <Button
                    variant='secondary'
                    disabled={page === 0}
                    onClick={() => {
                      setPage((p) => Math.max(p - 1, 0));
                      scrollToContainer();
                    }}
                  >
                    <ArrowLeft className='w-5 h-5' />
                    Previous
                  </Button>

                  <ul className='flex gap-1 justify-center'>
                    {paginationBtns.map((btn, idx) =>
                      btn === 'DOTS' ? (
                        <li key={idx}>
                          <div className='flex size-7 items-center justify-center rounded-md'>
                            ...
                          </div>
                        </li>
                      ) : (
                        <li key={idx}>
                          <Button
                            size='icon'
                            variant={page !== btn - 1 ? 'ghost' : undefined}
                            className={cn(
                              'size-10 cursor-pointer',
                              page === btn - 1 && 'bg-brand-600 text-white'
                            )}
                            onClick={() => {
                              setPage(btn - 1);
                              scrollToContainer();
                            }}
                          >
                            {btn}
                          </Button>
                        </li>
                      )
                    )}
                  </ul>

                  <Button
                    variant='secondary'
                    disabled={
                      page + 1 >= (reviewListData?.total_no_of_pages ?? 1)
                    }
                    onClick={() => {
                      setPage((p) => p + 1);
                      scrollToContainer();
                    }}
                  >
                    Next
                    <ArrowRight className='w-5 h-5' />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </PlatformConnectionGate>
      </div>
    </>
  );
};
