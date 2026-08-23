import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postReplyComment } from '@/lib/services/review';

export function useReplyComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postReplyComment,
    onSuccess: (res) => {
      queryClient.invalidateQueries(['reviews', 'list']);
    },
  });
}
