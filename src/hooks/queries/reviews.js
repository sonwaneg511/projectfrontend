import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchReviewList, fetchReviewsInsight } from '@/lib/services/review';

export const useReviewsInsight = (body) => {
  return useQuery({
    queryKey: ['reviews', 'insight', body],
    queryFn: () => fetchReviewsInsight(body),
    staleTime: 0,
    enabled: !!body,
  });
};

export const useReviewsList = (body) => {
  return useQuery({
    queryKey: ['reviews', 'list', body],
    queryFn: () => fetchReviewList(body),
    staleTime: 0,
    enabled: !!body,
    placeholderData: keepPreviousData,
  });
};
