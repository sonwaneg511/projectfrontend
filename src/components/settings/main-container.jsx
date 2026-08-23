'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth.context';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { CampaignsTab } from './campaigns-tab';
import { SettingsHeader } from './header';
import { SubscriptionsTab } from './subscription-tab';

export const SettingsMain = () => {
  const { userDetails } = useAuth();

  const [selectedTab, setSelectedTab] = useState(
    userDetails?.role === 'SUPER_ADMIN' ? 'subscriptions' : 'campaign-billing'
  );

  const isSuperAdmin = userDetails?.role === 'SUPER_ADMIN';

  return (
    <>
      <SettingsHeader />
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className='flex flex-col h-full'
        >
          <TabsList className={'p-1 h-auto border-gray-200 w-fit'}>
            {isSuperAdmin && (
              <TabsTrigger
                value={'subscriptions'}
                className={'border-transparent data-[state=active]:shadow-sm'}
              >
                Subscriptions
              </TabsTrigger>
            )}

            <TabsTrigger
              value={'campaign-billing'}
              className={'border-transparent data-[state=active]:shadow-sm'}
            >
              Campaign Billing
            </TabsTrigger>
          </TabsList>
          {isSuperAdmin && selectedTab === 'subscriptions' && (
            <SubscriptionsTab />
          )}
          {selectedTab === 'campaign-billing' && <CampaignsTab />}
        </Tabs>
      </div>
    </>
  );
};
