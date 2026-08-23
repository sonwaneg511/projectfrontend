import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateCampaignSettings,
  updateFacebookDetails,
  updateGmbDetails,
  updateLocationOverivew,
  uploadLocationImage,
} from '@/lib/services/locations';

export const useUploadLocationImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => uploadLocationImage({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['location-details'],
      });
    },
  });
};

export const useUpdateLocationOverview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dealerId, params, body }) =>
      updateLocationOverivew({ dealerId, params, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['location-details'],
      });
    },
  });
};

export const useUpdateGmbDetails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dealerId, params, body }) =>
      updateGmbDetails({ dealerId, params, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['location-details'],
      });
    },
  });
};

export const useUpdateFacebookDetails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dealerId, params, body }) =>
      updateFacebookDetails({ dealerId, params, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['location-details'],
      });
    },
  });
};

export const useUpdateCampaignSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dealerId, params, body }) =>
      updateCampaignSettings({ dealerId, params, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['location-details'],
      });
    },
  });
};
