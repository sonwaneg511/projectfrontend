'use client';

import { format } from 'date-fns';
import { MoveUpIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { useAuth } from '@/context/auth.context';
import {
  useDashboardCampaigns,
  useDashboardGMBInsights,
  useDashboardLocations,
  useDashboardPosts,
  useDashboardReviews,
} from '@/hooks/queries/dashboard';
import DateRangePicker from '../date-range/DateRangePicker';
import { Button } from '../ui/button';
import { DashboardCampaignsSection } from './campaigns';
import { DASHBOARD_DATA } from './constant';
import { DashboardGoogleBusinessSection } from './google-business';
import { DashboardHeader } from './header';
import { DashboardLocationsSection } from './locations';
import { DashboardPostsSection } from './posts';
import { DashboardReviewsSection } from './reviews';
import { DashboardTabs } from './tabs';

export const DashboardMain = () => {
  const [range, setRange] = useState(() => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);

    return {
      from: lastMonth,
      to: today,
    };
  });
  const [isTopBtnVisible, setIsTopBtnVisible] = useState(false);
  const [selectedSection, setSelectedSection] = useState('#locations');

  const containerRef = useRef(null);

  const { userDetails } = useAuth();

  const body = {
    client_id: userDetails?.clientId,
    user_id: userDetails?.user_id,
    from_date: range.from ? format(range.from, 'yyyy-MM-dd') : '',
    to_date: range.to ? format(range.to, 'yyyy-MM-dd') : '',
  };

  const hasAccessToCampaign = userDetails?.modules.includes('CAMPAIGNS');
  const hasAccessToReview = userDetails?.modules.includes('REVIEWS');
  const hasAccessToPost = userDetails?.modules.includes('POSTS');
  const hasAccessToGMBInsights = ['ADMIN', 'SUPER_ADMIN'].includes(
    userDetails?.role
  );

  const {
    data: locationData,
    isLoading: isLocationLoading,
    error: locationError,
  } = useDashboardLocations(body);
  const {
    data: campaignsData,
    isLoading: isCampaignsLoading,
    error: campaignsError,
  } = useDashboardCampaigns(body, hasAccessToCampaign);
  const {
    data: reviewsData,
    isLoading: isReviewsLoading,
    error: reviewsError,
  } = useDashboardReviews(body, hasAccessToReview);
  const {
    data: postsData,
    isLoading: isPostsLoading,
    error: postsError,
  } = useDashboardPosts(body, hasAccessToPost);
  const {
    data: gmbInsightsData,
    isLoading: isGMBInsightsLoading,
    error: gmbInsightsError,
  } = useDashboardGMBInsights(body, hasAccessToGMBInsights);

  const isLoading =
    isLocationLoading ||
    isCampaignsLoading ||
    isReviewsLoading ||
    isPostsLoading ||
    isGMBInsightsLoading;

  const handleContainerScroll = (e) => {
    const scrollTop = e.currentTarget.scrollTop;
    setIsTopBtnVisible(scrollTop > 80);
  };

  const removeHash = () => {
    const { pathname, search } = window.location;

    window.history.replaceState(null, '', pathname + search);
  };

  const handleScrollToTop = () => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    removeHash();
    setSelectedSection('#locations');
  };

  return (
    <>
      <DashboardHeader />
      {isLoading ? (
        <div className='flex-1 flex items-center justify-center'>
          Loading...
        </div>
      ) : (
        <div
          ref={containerRef}
          onScroll={handleContainerScroll}
          className='py-4 flex-1 overflow-y-auto scroll-smooth'
        >
          <div className='flex items-center justify-between mb-4 px-4'>
            <DashboardTabs
              value={selectedSection}
              setValue={setSelectedSection}
            />
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
          <DashboardLocationsSection
            locationData={locationData}
            error={locationError}
          />
          <DashboardCampaignsSection
            campaignsData={
              hasAccessToCampaign ? campaignsData : DASHBOARD_DATA.campaign
            }
            isLocked={!hasAccessToCampaign}
            error={campaignsError}
          />
          <DashboardReviewsSection
            reviewsData={
              hasAccessToReview ? reviewsData : DASHBOARD_DATA.review
            }
            isLocked={!hasAccessToReview}
            error={reviewsError}
          />
          <DashboardPostsSection
            postsData={hasAccessToPost ? postsData : DASHBOARD_DATA.posts}
            isLocked={!hasAccessToPost}
            error={postsError}
          />
          {['ADMIN', 'SUPER_ADMIN'].includes(userDetails?.role) && (
            <DashboardGoogleBusinessSection
              googleBusinessData={
                // biome-ignore lint/correctness/noConstantCondition: once the role confirmed then will remove it
                true ? gmbInsightsData : DASHBOARD_DATA.googleBusinessInsights
              }
              error={gmbInsightsError}
            />
          )}

          {/* <DashboardSocialMediaSection
            socialMediaData={DASHBOARD_DATA.socialMediaInsights}
            // NOTE: if user have access to post then only show this
          /> */}
        </div>
      )}
      {isTopBtnVisible && (
        <Button
          variant={'outline'}
          size={'icon'}
          onClick={handleScrollToTop}
          className={
            'size-12 fixed right-6 bottom-4  rounded-full border border-gray-300'
          }
        >
          <MoveUpIcon size={20} />
        </Button>
      )}
    </>
  );
};
