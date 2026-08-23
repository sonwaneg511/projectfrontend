import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createPost } from '@/lib/services/posts';

export const useCreatePost = ({ onSuccess } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,

    onSuccess: (response) => {
      queryClient.invalidateQueries(['posts', 'list']);
      onSuccess?.(response);
    },

    onError: () => {
      toast.error('Failed to create post');
    },
  });
};
