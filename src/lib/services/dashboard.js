import { post } from '@/config/api';

const getDashboardLocations = async (body) => {
  const response = await post({
    url: '/dashboard/locations',
    body,
  });

  return response.data;
};

const getDashboardCampaigns = async (body) => {
  const response = await post({
    url: '/dashboard/campaigns',
    body,
  });

  return response.data;
};

const getDashboardReviews = async (body) => {
  const response = await post({
    url: '/dashboard/reviews',
    body,
  });

  return response.data;
};

const getDashboardPosts = async (body) => {
  const response = await post({
    url: '/dashboard/posts',
    body,
  });

  return response.data;
};

const getDashboardGMBInsights = async (body) => {
  const response = await post({
    url: '/dashboard/insights',
    body,
  });

  return response.data;
};

export {
  getDashboardCampaigns,
  getDashboardGMBInsights,
  getDashboardLocations,
  getDashboardPosts,
  getDashboardReviews,
};
