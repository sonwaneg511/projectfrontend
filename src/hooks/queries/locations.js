import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { mapOperationHours } from '@/components/location-details/constant';
import {
  fetchDealers,
  fetchFilteredLocations,
  fetchLocationDetails,
  getAllLocations,
  getCampaignsSettings,
  getClientLocations,
  getLocationCategories,
  updateLocationDetails,
} from '@/lib/services/locations';

export const useDealersLoaction = ({ client_id, user_id }) => {
  return useQuery({
    queryKey: ['dealers', client_id, user_id],
    queryFn: () => fetchDealers({ client_id, user_id }),
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
    enabled: !!client_id && !!user_id,
  });
};

export const useGetClientLocations = ({ clientId, params }) => {
  return useQuery({
    queryKey: ['campaign', `${clientId}-location`, { ...params }],
    queryFn: () => getClientLocations({ clientId, params }),
    staleTime: 30 * 60 * 1000,
  });
};

export const useGetAllLocations = (body) => {
  return useQuery({
    queryKey: ['locations', { ...body }],
    queryFn: () => getAllLocations(body),
    staleTime: 30 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};

export const useGetFilteredLocations = (body) => {
  return useQuery({
    queryKey: ['filtered-locations', { ...body }],
    queryFn: () => fetchFilteredLocations(body),
    staleTime: 30 * 60 * 1000,
    enabled: !!body.client_id && !!body.user_id,
  });
};

export const useGetLocationDetails = (body) => {
  return useQuery({
    queryKey: ['location-details', { ...body }],
    queryFn: () => fetchLocationDetails(body),
    staleTime: 30 * 60 * 1000,
    enabled: !!body.client_id && !!body.user_id,
    select: (data) => ({
      ...data,
      locationOverview: {
        ...data.locationOverview,
        operationHours: mapOperationHours(data.locationOverview.operationHours),
      },
    }),
  });
};

export const useGetCampaignsSettings = ({ clientId, userId, dealerId }) => {
  return useQuery({
    queryKey: ['campaign-settings', { clientId, userId, dealerId }],
    queryFn: () => getCampaignsSettings({ clientId, userId, dealerId }),
    staleTime: 30 * 60 * 1000,
    enabled: !!clientId && !!userId && !!dealerId,
  });
};

export const useUpdateLocationDetails = ({ clientId, userId, dealerId }) => {
  return useMutation({
    mutationFn: (body) =>
      updateLocationDetails({
        clientId,
        userId,
        dealer_id: dealerId,
        body,
      }),
  });
};

export const useGetLocationCategories = (params) => {
  return useQuery({
    queryKey: ['location-categories', { ...params }],
    queryFn: () => getLocationCategories(params),
    staleTime: 30 * 60 * 1000,
    enabled: !!params?.source,
  });
};
