import { post } from '@/config/api';

export const login = async (body) => {
  const response = await post({ url: '/api/login', body });

  return response.data;
};

export const signup = async (body) => {
  const response = await post({ url: '/api/signup', body });

  return response.data;
};

export const forgotPasswordReq = async (body) => {
  const response = await post({ url: '/api/request', body });

  return response.data;
};

export const forgotPasswordChange = async (body) => {
  const response = await post({ url: '/api/change', body });

  return response.data;
};

export const logout = async () => {
  const response = await post({ url: '/api/logout' });

  return response.data;
};

export const resendVerificationMail = async (body) => {
  const response = await post({
    url: '/api/resend-verification',
    body,
  });

  return response.data;
};

export const verifyEmail = async (body) => {
  const response = await post({
    url: '/api/verify-email',
    body,
  });

  return response.data;
};
