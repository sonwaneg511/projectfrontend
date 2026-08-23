import { useQuery } from '@tanstack/react-query';
import {
  getDashboardCampaigns,
  getDashboardGMBInsights,
  getDashboardLocations,
  getDashboardPosts,
  getDashboardReviews,
} from '@/lib/services/dashboard';

const useDashboardPosts = (body, enabled = true) =>
  useQuery({
    queryKey: ['dashboard-posts', body],
    queryFn: () => getDashboardPosts(body),
    staleTime: 5 * 60 * 1000,
    enabled,
    retry: 0,
  });

const useDashboardReviews = (body, enabled = true) =>
  useQuery({
    queryKey: ['dashboard-reviews', body],
    queryFn: () => getDashboardReviews(body),
    staleTime: 5 * 60 * 1000,
    enabled,
    retry: 0,
  });

const useDashboardCampaigns = (body, enabled = true) =>
  useQuery({
    queryKey: ['dashboard-campaigns', body],
    queryFn: () => getDashboardCampaigns(body),
    staleTime: 5 * 60 * 1000,
    enabled,
    retry: 0,
  });

const useDashboardLocations = (body, enabled = true) =>
  useQuery({
    queryKey: ['dashboard-locations', body],
    queryFn: () => getDashboardLocations(body),
    staleTime: 5 * 60 * 1000,
    enabled,
    retry: 0,
  });

const useDashboardGMBInsights = (body, enabled = true) =>
  useQuery({
    queryKey: ['dashboard-gmb-insights', body],
    queryFn: () => getDashboardGMBInsights(body),
    staleTime: 5 * 60 * 1000,
    enabled,
    retry: 0,
  });

export {
  useDashboardCampaigns,
  useDashboardGMBInsights,
  useDashboardLocations,
  useDashboardPosts,
  useDashboardReviews,
};
