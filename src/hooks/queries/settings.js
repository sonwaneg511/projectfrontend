import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getSubscriptionDetails,
  getSubscriptionHistory,
} from '@/lib/services/settings';

export const useGetSubscriptionDetails = (clientId) => {
  return useQuery({
    queryFn: () => getSubscriptionDetails(clientId),
    queryKey: ['subscription-details', clientId],
    staleTime: 30 * 60 * 1000,
    retry: 0,
  });
};

export const useGetSubscriptionHistory = ({ clientId, params }) => {
  return useQuery({
    queryFn: () => getSubscriptionHistory({ clientId, params }),
    queryKey: ['subscripiton-history', clientId, { ...params }],
    staleTime: 30 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};
