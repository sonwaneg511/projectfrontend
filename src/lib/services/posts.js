import { post } from '@/config/api';

export const createPost = async (body) => {
  const { data } = await post({
    url: '/post/create-post',
    body,
  });

  return data;
};

export const fetchPostsData = async (body) => {
  const { data } = await post({
    url: 'post/post-data',
    body,
  });

  return data;
};

export const fetchPostGraphData = async (body) => {
  const { data } = await post({
    url: 'post/post-graph',
    body,
  });

  return data;
};

export const fetchPostsDetails = async (body) => {
  const { data } = await post({
    url: `post/location-details`,
    body,
  });

  return data;
};
