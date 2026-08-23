import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getAllCampaigns } from '@/lib/services/campaigns';

const useGetAllCampaigns = (body) => {
  return useQuery({
    queryKey: ['campaigns', { ...body }],
    queryFn: () => getAllCampaigns(body),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};

export { useGetAllCampaigns };
