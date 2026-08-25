import axios from 'axios';

const micrositeAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MICROSITE_BASE_URL,
  headers: {
    // Bypasses the ngrok free-tier browser interstitial page, which
    // otherwise returns an HTML warning instead of the JSON response.
    'ngrok-skip-browser-warning': 'true',
  },
});

function normalizeError(error) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message =
      status >= 500
        ? 'Something went wrong.'
        : error.response?.data?.message || error.message;

    return { data: error.response?.data, message };
  }

  return { data: undefined, message: 'Something went wrong.' };
}

export const getMicrosite = ({ url = '', params, headers } = {}) =>
  micrositeAxios
    .get(url, { params, headers })
    .catch((error) => Promise.reject(normalizeError(error)));

export const postMicrosite = ({ url = '', body, params, headers } = {}) =>
  micrositeAxios
    .post(url, body, { params, headers })
    .catch((error) => Promise.reject(normalizeError(error)));
