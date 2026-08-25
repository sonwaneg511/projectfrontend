'use client';

import { Share } from 'lucide-react';
import { useState } from 'react';
import CampaignReports from '@/components/reports/CampaignReports';
import LocationReports from '@/components/reports/LocationReports';
import PostReports from '@/components/reports/PostReports';
import ReviewsReports from '@/components/reports/ReviewsReports';
import { useAuth } from '@/context/auth.context';
import { DashboardTabs } from '../dashboard/tabs';
import { Button } from '../ui/button';
import { GmbInsightsReports } from './gmb-insights-report/gmb-insights-report';

export const ReportsBody = () => {
  const [selectedSection, setSelectedSection] = useState('#reviews');
  const { userDetails } = useAuth();

  const hasAccessToCampaign = userDetails?.modules?.includes('CAMPAIGNS');
  const hasAccessToReview = userDetails?.modules?.includes('REVIEWS');
  const hasAccessToPosts = userDetails?.modules?.includes('POSTS');

  // TODO: need to discuss do we have to hide GMB insights for hiding it

  return (
    <div className='p-4 flex-1 overflow-y-auto scroll-smooth'>
      <div className='flex items-center justify-between my-4'>
        <DashboardTabs
          value={selectedSection}
          setValue={setSelectedSection}
          variant={'report'}
        />
        <Button variant={'primary'}>
          <Share size={20} color='var(--color-brand-300)' /> Export Report
        </Button>
      </div>
      {selectedSection === '#reviews' ? (
        hasAccessToReview ? (
          <ReviewsReports />
        ) : (
          <AccessDenied />
        )
      ) : null}
      {selectedSection === '#posts' ? (
        hasAccessToPosts ? (
          <PostReports />
        ) : (
          <AccessDenied />
        )
      ) : null}
      {selectedSection === '#campaigns' ? (
        hasAccessToCampaign ? (
          <CampaignReports />
        ) : (
          <AccessDenied />
        )
      ) : null}
      {selectedSection === '#locations' ? <LocationReports /> : null}
      {selectedSection === '#google-business-insights' && (
        <GmbInsightsReports />
      )}
    </div>
  );
};

const AccessDenied = () => {
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
};
