import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createCallAdsCampaign,
  createPMaxCampaign,
  createSearchCampaign,
} from '@/lib/services/campaigns';

const useCreateSearchCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => createSearchCampaign(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['campaigns'],
      });
    },
  });
};

const useCreateCallAdsCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => createCallAdsCampaign(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['campaigns'],
      });
    },
  });
};

const useCreatePMaxCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => createPMaxCampaign(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['campaigns'],
      });
    },
  });
};

export {
  useCreateCallAdsCampaign,
  useCreatePMaxCampaign,
  useCreateSearchCampaign,
};
