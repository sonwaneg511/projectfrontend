import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  createPost,
  fetchPostGraphData,
  fetchPostsData,
  fetchPostsDetails,
} from '@/lib/services/posts';

export const useCreatePost = (body) => {
  return useQuery({
    queryKey: ['posts', 'create', body],
    queryFn: () => createPost(body),
    staleTime: 5 * 60 * 1000,
    enabled: !!body,
  });
};

export const usePostsData = (body) => {
  return useQuery({
    queryKey: [
      'posts',
      'list',
      body?.client_id,
      body?.user_id,
      body?.platform,
      body?.status,
      body?.start_date,
      body?.end_date,
      body?.page_no,
    ],
    queryFn: () => fetchPostsData(body),
    staleTime: 5 * 60 * 1000,
    enabled: !!body?.client_id && !!body?.user_id && !!body?.platform,
    placeholderData: keepPreviousData,
  });
};

export const usePostsGraphData = (body) => {
  return useQuery({
    queryKey: ['posts', 'graph', body],
    queryFn: () => fetchPostGraphData(body),
    staleTime: 5 * 60 * 1000,
    enabled: !!body,
  });
};

export const usePostsDetails = (body) => {
  return useQuery({
    queryKey: ['posts', 'details', body],
    queryFn: () => fetchPostsDetails(body),
    staleTime: 5 * 60 * 1000,
    enabled: !!body,
  });
};
