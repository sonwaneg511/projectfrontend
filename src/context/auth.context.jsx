'use client';

import { useGetUserSelfDetails } from '@/hooks/queries/users';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

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
  const [userDetails, setUserDetails] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const { isLoading, data } = useGetUserSelfDetails();
  console.log(data,'dataaaaaaaaaaaaaa')

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // API finished but no user
    if (!data) {
      setIsAuthReady(true);
      return;
    }

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
      is_gmb_location_selected: data.is_gmb_location_selected,
      total_locations: data.total_locations,
    };

    setUserDetails(body);

    const onboardingStep = data.onboarding_step;

    const targetRoute = ONBOARDING_STEP_ROUTES[onboardingStep] || '/dashboard';

    const isOnboardingPath = ONBOARDING_PATHS.some((path) =>
      pathname.startsWith(path)
    );

    if (onboardingStep === 'COMPLETED') {
      if (isOnboardingPath) {
        router.replace('/dashboard');
        return;
      }

      setIsAuthReady(true);
      return;
    }

    // NOTE :- User hasn't completed onboarding
    if (!pathname.startsWith(targetRoute)) {
      router.replace(targetRoute);
      return;
    }

    setIsAuthReady(true);
  }, [data, isLoading, pathname, router]);

  // NOTE :- Don't render anything untill the route has been determined in above useEffect
  if (isLoading || !isAuthReady) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};