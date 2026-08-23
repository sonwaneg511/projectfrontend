import { post } from '@/config/api';

export const fetchReports = async (body) => {
  const { data } = await post({
    url: 'reporting/post',
    body,
  });

  return data;
};

export const fetchReviewReports = async (body) => {
  const { data } = await post({
    url: 'reporting/review-report',
    body,
  });

  return data;
};

export const fetchCampaignsReports = async (body) => {
  const { data } = await post({
    url: 'reporting/campaign-report',
    body,
  });

  return data;
};

export const getGMBTableData = async (body) => {
  const { data } = await post({
    url: '/reporting/insight-table-data',
    body,
  });

  return data;
};

export const getGMBSummaryData = async (body) => {
  const { data } = await post({
    url: '/reporting/insight-sum-data',
    body,
  });

  return data;
};

export const getGMBGraphData = async (body) => {
  const { data } = await post({
    url: '/reporting/insight-graph-data',
    body,
  });

  return data;
};
