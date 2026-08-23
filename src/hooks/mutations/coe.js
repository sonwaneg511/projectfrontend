import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createInternalClient,
  deployCoeCallAdsCampaign,
  deployCoePMaxCampaign,
  deployCoeSearchCampaign,
} from '@/lib/services/coe';

export const useCreateInternalClient = () => {
  return useMutation({
    mutationFn: (body) => createInternalClient(body),
  });
};

export const useDeployCoeSearchCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => deployCoeSearchCampaign(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['coe-campaigns'],
      });
    },
  });
};

export const useDeployCoeCallAdsCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => deployCoeCallAdsCampaign(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['coe-campaigns'],
      });
    },
  });
};

export const useDeployCoePMaxCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => deployCoePMaxCampaign(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['coe-campaigns'],
      });
    },
  });
};
