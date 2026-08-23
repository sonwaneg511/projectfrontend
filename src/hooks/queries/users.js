import { useQueries, useQuery } from '@tanstack/react-query';
import {
  getUserDetailedLocations,
  getUserDetails,
  getUserSelfDetails,
  getUsers,
} from '@/lib/services/users';

export const useGetUserSelfDetails = () => {
  return useQuery({
    queryKey: ['user-self'],
    queryFn: getUserSelfDetails,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetUserDetails = (params) => {
  return useQuery({
    queryKey: ['userdetails', { ...params }],
    queryFn: () => getUserDetails(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetUsers = (body) => {
  return useQuery({
    queryKey: ['users', { ...body }],
    queryFn: () => getUsers(body),
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetUserDetailedLocations = (params, enabled) => {
  return useQuery({
    queryKey: ['detailed-locations', { ...params }],
    queryFn: () => getUserDetailedLocations(params),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
};

export const useGetEditUserDetails = ({
  currentUserParams,
  editUserParams,
}) => {
  return useQueries({
    queries: [
      {
        queryKey: ['users', 'userDetails', { ...currentUserParams }],
        queryFn: () => getUserDetails(currentUserParams),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ['users', 'editUserDetails', { ...editUserParams }],
        queryFn: () => getUserDetails(editUserParams),
        staleTime: 5 * 60 * 1000,
      },
    ],
  });
};
