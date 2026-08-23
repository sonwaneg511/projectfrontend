import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  fetchCampaignsReports,
  fetchReports,
  fetchReviewReports,
  getGMBGraphData,
  getGMBSummaryData,
  getGMBTableData,
} from '@/lib/services/report';

export const useReports = (body) => {
  return useQuery({
    queryKey: ['reports', body],
    queryFn: () => fetchReports(body),
    staleTime: 5 * 60 * 1000,
    enabled: !!body,
  });
};

export const useReviewsReports = (body) => {
  return useQuery({
    queryKey: ['review-reports', body],
    queryFn: () => fetchReviewReports(body),
    staleTime: 5 * 60 * 1000,
    enabled: !!body,
  });
};

export const useCampaignReports = (body) => {
  return useQuery({
    queryKey: ['campaign-reports', body],
    queryFn: () => fetchCampaignsReports(body),
    staleTime: 5 * 60 * 1000,
    enabled: !!body,
  });
};

export const useGetGMBTableData = (body) => {
  return useQuery({
    queryKey: ['gmb-reports-table', body],
    queryFn: () => getGMBTableData(body),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};

export const useGetGMBSummaryData = (body) => {
  return useQuery({
    queryKey: ['gmb-reports-summary', body],
    queryFn: () => getGMBSummaryData(body),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetGMBGraphData = (body) => {
  return useQuery({
    queryKey: ['gmb-reports-graph', body],
    queryFn: () => getGMBGraphData(body),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};
