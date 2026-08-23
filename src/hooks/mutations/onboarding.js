import { useMutation } from '@tanstack/react-query';
import { verifyAccount, verifyLocationGroup } from '@/lib/services/onboarding';

const useVerifyLocationGroup = () => {
  return useMutation({
    mutationFn: (body) => verifyLocationGroup(body),
  });
};

const useVerifyAccount = () => {
  return useMutation({
    mutationFn: (body) => verifyAccount(body),
  });
};

export { useVerifyAccount, useVerifyLocationGroup };
