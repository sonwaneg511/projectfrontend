import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  forgotPasswordChange,
  forgotPasswordReq,
  login,
  logout,
  resendVerificationMail,
  signup,
  verifyEmail,
} from '@/lib/services/auth';

export const useLogin = () => {
  return useMutation({
    mutationFn: (body) => login(body),
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: (body) => signup(body),
  });
};

export const useForgotPasswordReq = () => {
  return useMutation({
    mutationFn: (body) => forgotPasswordReq(body),
  });
};

export const useForgotPasswordChange = () => {
  return useMutation({
    mutationFn: (body) => forgotPasswordChange(body),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear(); // NOTE: this clear all cache data
    },
  });
};

export const useResendVerificationMail = () => {
  return useMutation({
    mutationFn: (body) => resendVerificationMail(body),
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (body) => verifyEmail(body),
  });
};
