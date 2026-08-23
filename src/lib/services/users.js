import { get, post } from '@/config/api';

export const getUserSelfDetails = async () => {
  const response = await get({ url: '/api/user/self' });

  return response.data;
};

export const getUserDetails = async (params) => {
  const response = await get({ url: '/api/viewuser', params });

  return response.data;
};

export const deleteUser = async (body) => {
  const response = await post({ url: '/api/user/delete', body });

  return response.data;
};

export const getUsers = async (body) => {
  const response = await post({ url: '/api/user/view', body });

  return response.data;
};

export const createUser = async (body) => {
  const response = await post({ url: '/api/user/create', body });

  return response.data;
};

export const getUserDetailedLocations = async (params) => {
  const response = await get({ url: '/api/viewlocations', params });

  return response.data;
};

export const editUser = async (body) => {
  const response = await post({ url: '/api/user/edit', body });

  return response.data;
};
