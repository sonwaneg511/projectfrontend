import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getCoeCampaignDetails,
  getCoeCampaigns,
  getInternalOnboardingDetails,
} from '@/lib/services/coe';

export const useGetInternalOnboardingDetails = () => {
  return useQuery({
    queryKey: ['internal-onboarding'],
    queryFn: getInternalOnboardingDetails,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetCoeCampaigns = (params) => {
  return useQuery({
    queryKey: ['coe-campaigns', { ...params }],
    queryFn: () => getCoeCampaigns(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};

export const useGetCoeCampaignDetails = (campaignId) => {
  return useQuery({
    queryKey: ['coe-campaign-details', campaignId],
    queryFn: () => getCoeCampaignDetails(campaignId),
    staleTime: 5 * 60 * 1000,
  });
};
