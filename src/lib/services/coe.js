import { get, post } from '@/config/api';

export const getInternalOnboardingDetails = async () => {
  const response = await get({ url: '/campaign/coe/onboarding-details' });

  return response.data;
};

export const createInternalClient = async (body) => {
  const response = await post({
    url: '/campaign/coe/client-account-setup',
    body,
  });

  return response.data;
};

export const getCoeCampaigns = async (params) => {
  const response = await get({ url: '/campaign/coe/all-campaigns', params });

  return response.data;
};

export const getCoeCampaignDetails = async (campaignId) => {
  const response = await get({
    url: `/campaign/coe/campaign-setup-details/${campaignId}`,
  });

  return response.data;
};

export const deployCoeSearchCampaign = async (body) => {
  const response = await post({
    url: '/search-campaign/coe-campaign',
    body,
  });

  return response.data;
};
export const deployCoeCallAdsCampaign = async (body) => {
  const response = await post({
    url: '/call-ad-campaign/coe-campaign',
    body,
  });

  return response.data;
};
export const deployCoePMaxCampaign = async (body) => {
  const response = await post({
    url: '/pmax-campaign/coe-campaign',
    body,
  });

  return response.data;
};
