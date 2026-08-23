import { post } from '@/config/api';

export const planCreatePayment = async (body) => {
  const response = await post({ url: '/plan/createpayment', body });

  return response.data;
};
