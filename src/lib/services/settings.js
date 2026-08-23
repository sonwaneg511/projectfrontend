import { get } from '@/config/api';

export const getSubscriptionDetails = async (clientId) => {
  const response = await get({
    url: `plan/subscription/${clientId}`,
  });

  return response.data;
};

export const getSubscriptionHistory = async ({ clientId, params }) => {
  const response = await get({
    url: `/plan/history/${clientId}`,
    params,
  });

  return response.data;
};
