import { useMutation, useQueryClient } from '@tanstack/react-query';
import { planCreatePayment } from '@/lib/services/payment';

export const usePlanCreatePayment = (clientId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => planCreatePayment(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['campaigns'],
      });
    },
  });
};
