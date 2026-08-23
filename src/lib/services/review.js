import { post } from '@/config/api';

export const fetchReviewsInsight = async (body) => {
  const { data } = await post({
    url: 'review/review-insight',
    body,
  });

  return data;
};

export const fetchReviewList = async (body) => {
  const { data } = await post({
    url: 'review/filtered-reviews',
    body,
  });

  return data;
};

export const postReplyComment = async (body) => {
  const { data } = await post({
    url: 'review/reply-comment',
    body,
  });

  return data;
};
