'use client';

import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { useGetUserSelfDetails } from '@/hooks/queries/users';

const AuthContext = createContext(null);

const BYPASS_AUTH = process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true';

const BYPASS_USER_DETAILS = {
  user_id: 'bypass-user',
  clientId: 'bypass-client',
  dealer_ids: [],
  role: 'admin',
  modules: [],
  planStatus: 'ACTIVE',
  onboarding_step: 'COMPLETED',
  gmb_status: 'CONNECTED',
  meta_status: 'CONNECTED',
  clientName: 'Bypass Client',
};

const ONBOARDING_STEP_ROUTES = {
  PLAN_PENDING: '/subscription-plan',
  SOCIAL_ACCOUNT_SETUP: '/account-access',
  CAMPAIGN_SETUP: '/campaign-setup',
  COMPLETED: '/dashboard',
};

const ONBOARDING_PATHS = [
  '/subscription-plan',
  '/account-access',
  '/campaign-setup',
];

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('use useAuth within AuthProvider.');
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(
    BYPASS_AUTH ? BYPASS_USER_DETAILS : null
  );
  const { isLoading, data } = useGetUserSelfDetails({ enabled: !BYPASS_AUTH });
  const router = useRouter();
  const pathname = usePathname();

  const contextValue = {
    isLoading,
    userDetails,
  };

  useEffect(() => {
    if (!isLoading && data) {
      const body = {
        user_id: data?.userId,
        clientId: data.client_id,
        dealer_ids: data.dealer_ids,
        role: data.role,
        modules: data.modules,
        planStatus: data.planStatus,
        onboarding_step: data.onboarding_step,
        gmb_status: data.gmb_status,
        meta_status: data.meta_status,
        clientName: data.client_name,
      };

      setUserDetails(body);
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (!userDetails) return;

    const { onboarding_step } = userDetails;
    const targetRoute = ONBOARDING_STEP_ROUTES[onboarding_step] || '/dashboard';
    const isOnOnboardingPath = ONBOARDING_PATHS.some((p) =>
      pathname.startsWith(p)
    );

    if (onboarding_step === 'COMPLETED') {
      if (isOnOnboardingPath) {
        router.replace('/dashboard');
      }
    } else {
      if (!pathname.startsWith(targetRoute)) {
        router.replace(targetRoute);
      }
    }
  }, [userDetails, pathname, router]);

  if (!userDetails) {
    return null;
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
