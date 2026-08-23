import axios from 'axios';
import { queryClient } from '@/lib/query-client';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  // timeout: 10000, // NOTE: Disabling timeout because some APIs are taking a lot of time
  withCredentials: true,
});

let isRedirecting = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isRedirecting) {
      isRedirecting = true;

      window.dispatchEvent(new Event('session-expired'));
      queryClient.clear();
    }

    return Promise.reject(error);
  }
);

export const get = ({ url = '', params, headers }) =>
  new Promise((resolve, reject) => {
    axiosInstance
      .get(url, {
        headers: {
          ...headers,
        },
        params: params,
      })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const post = ({ url = '', params, body, headers }) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(url, body, {
        headers: {
          ...headers,
        },
        params,
      })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          let message;

          if (error.status >= 500 && error.status < 600) {
            message = 'Something went wrong.';
          } else {
            message = error?.response?.data?.message || error.message;
          }

          return reject({ data: error?.response?.data, message });
        } else {
          return reject(error?.response?.data ?? 'Something went wrong.');
        }
      });
  });
};
