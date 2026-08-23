import { useMutation, useQuery } from '@tanstack/react-query';
import {
  callGmbOauthCallback,
  callMetaOauthCallback,
  getAccountAccessOauth,
  getAllplans,
  getCampaignDetails,
  getCampaignSetupDetails,
  getDealerLocationDetails,
  getMetaOauthAuthorize,
  skipPlatformConnection,
  submitCampaignSetup,
} from '@/lib/services/onboarding';

export const useGetAllPlans = () => {
  return useQuery({
    queryKey: ['plans'],
    queryFn: getAllplans,
    staleTime: 5 * 60 * 1000,
    enabled: true,
  });
};

export const useGetCampaignSetupDetails = (clientId) => {
  return useQuery({
    queryKey: ['campaign-setup'],
    queryFn: getCampaignSetupDetails(clientId),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetAccountAccessOauth = (params) => {
  return useQuery({
    queryKey: ['account-access-oauth', { ...params }],
    queryFn: () => getAccountAccessOauth(params),
    staleTime: 5 * 60 * 1000,
    enabled: false,
    retry: false,
  });
};

export const useGmbOauthCallback = (params) => {
  return useQuery({
    queryKey: ['gmb-oauth-callback', { ...params }],
    queryFn: () => callGmbOauthCallback(params),
    enabled: false,
    retry: false,
  });
};

export const useGetMetaAccessOauth = (params) => {
  return useQuery({
    queryKey: ['meta-access-oauth', { ...params }],
    queryFn: () => getMetaOauthAuthorize(params),
    staleTime: 5 * 60 * 1000,
    enabled: false,
    retry: false,
  });
};

export const useMetaOauthCallback = (params) => {
  return useQuery({
    queryKey: ['meta-oauth-callback', { ...params }],
    queryFn: () => callMetaOauthCallback(params),
    enabled: false,
    retry: false,
  });
};

export const useSkipPlatformConnection = () => {
  return useMutation({
    mutationFn: skipPlatformConnection,
  });
};

export const useGetCampaignDetails = ({ clientId, userId }) => {
  return useQuery({
    queryKey: ['campaign-details', clientId],
    queryFn: () => getCampaignDetails({ clientId, userId }),
    enabled: !!clientId && !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetDealerLocationDetails = ({ clientId, dealerId }) => {
  return useQuery({
    queryKey: ['dealer-location', clientId, dealerId],
    queryFn: () => getDealerLocationDetails({ clientId, dealerId }),
    enabled: !!clientId && !!dealerId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSubmitCampaignSetup = () => {
  return useMutation({ mutationFn: submitCampaignSetup });
};
