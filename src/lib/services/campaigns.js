import { post } from '@/config/api';

const getAllCampaigns = async (body) => {
  const response = await post({
    url: `/campaign/all-campaigns`,
    body,
  });

  return response.data;
};

const createSearchCampaign = async (body) => {
  const response = await post({
    url: '/search-campaign/client-campaign',
    body,
  });

  return response.data;
};

const createCallAdsCampaign = async (body) => {
  const response = await post({
    url: '/call-ad-campaign/client-campaign',
    body,
  });

  return response.data;
};

const createPMaxCampaign = async (body) => {
  const response = await post({
    url: '/pmax-campaign/client-campaign',
    body,
  });

  return response.data;
};

export {
  createCallAdsCampaign,
  createPMaxCampaign,
  createSearchCampaign,
  getAllCampaigns,
};
