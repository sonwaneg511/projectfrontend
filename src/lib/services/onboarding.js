import { get, post } from '@/config/api';

export const getAllplans = async () => {
  const response = await get({
    url: `plan/allplans`,
  });

  return response.data;
};

export const verifyLocationGroup = async (body) => {
  const response = await post({ url: '/locations/group-exist', body });

  return response.data;
};

export const verifyAccount = async (body) => {
  const response = await post({
    url: '/onboarding/insert-access-account',
    body,
  });

  return response.data;
};

export const getCampaignSetupDetails = async (clientId) => {
  const response = await get({
    url: `/campaign/${clientId}/location`,
  });

  return response.data;
};

export const getAccountAccessOauth = async (params) => {
  const response = await get({ url: '/gmb-oauth/authorize', params });
  return response.data;
};

export const callGmbOauthCallback = async (params) => {
  const response = await get({ url: '/gmb-oauth/callback', params });
  return response.data;
};

export const getMetaOauthAuthorize = async (params) => {
  const response = await get({ url: '/facebook-oauth/authorize', params });

  return response.data;
};

export const callMetaOauthCallback = async (params) => {
  const response = await get({ url: '/facebook-oauth/callback', params });
  return response.data;
};

export const skipPlatformConnection = async (body) => {
  const response = await post({ url: '/onboarding/skip-connection', body });
  return response.data;
};

export const getCampaignDetails = async ({ clientId, userId }) => {
  const response = await get({
    url: `/campaign/${clientId}/details`,
    params: { userId },
  });
  return response.data;
};

export const getDealerLocationDetails = async ({ clientId, dealerId }) => {
  const response = await get({
    url: `/campaign/${clientId}/location`,
    params: { dealerId },
  });
  return response.data;
};

export const submitCampaignSetup = async (body) => {
  const response = await post({ url: '/campaign/client-setup', body });
  return response.data;
};
