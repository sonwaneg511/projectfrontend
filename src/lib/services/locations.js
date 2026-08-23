import { get, post } from '@/config/api';

export const fetchDealers = async ({ client_id, user_id }) => {
  const { data } = await get({
    url: '/locations/get-dealer-list',
    params: {
      client_id,
      user_id,
    },
    body: {
      dealer_id: user_id, // as per backend contract
      page_no: -1,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return data;
};

export const getClientLocations = async ({ clientId, params }) => {
  const response = await get({
    url: `/campaign/${clientId}/locations`,
    params,
  });

  return response.data;
};

export const getAllLocations = async (body) => {
  const response = await post({ url: '/locations/view-all-locations', body });

  return response.data;
};

export const fetchFilteredLocations = async (body) => {
  const response = await post({
    url: '/locations/dropdown-filtered-locations',
    body,
  });

  return response.data;
};

export const fetchLocationDetails = async (body) => {
  const response = await post({
    url: '/locations/view-location-details',
    body,
  });

  return response.data;
};

export const getCampaignsSettings = async ({ clientId, userId, dealerId }) => {
  const response = await get({
    url: `/locations/get-campaign-settings/${dealerId}`,
    params: {
      clientId,
      userId,
    },
  });

  return response.data;
};

export const updateLocationDetails = async ({
  clientId,
  userId,
  dealer_id,
  body,
}) => {
  const response = await post({
    url: `/locations/update/${dealer_id}`,
    params: {
      clientId,
      userId,
    },
    body,
  });

  return response.data;
};

export const uploadLocationImage = async ({ body }) => {
  const response = await post({
    url: '/location-image/upload',
    body,
  });

  return response.data;
};

export const getLocationCategories = async (params) => {
  const response = await get({
    url: '/locations/get-categories',
    params,
  });

  return response.data;
};

export const updateLocationOverivew = async ({ params, body, dealerId }) => {
  const response = await post({
    url: `/locations/update-location-overview-details/${dealerId}`,
    params,
    body,
  });

  return response.data;
};

export const updateGmbDetails = async ({ params, body, dealerId }) => {
  const response = await post({
    url: `/locations/update-gmb-details/${dealerId}`,
    params,
    body,
  });

  return response.data;
};

export const updateFacebookDetails = async ({ params, body, dealerId }) => {
  const response = await post({
    url: `/locations/update-facebook-details/${dealerId}`,
    params,
    body,
  });

  return response.data;
};

export const updateCampaignSettings = async ({ params, body, dealerId }) => {
  const response = await post({
    url: `/locations/update-campaign-settings/${dealerId}`,
    params,
    body,
  });

  return response.data;
};
