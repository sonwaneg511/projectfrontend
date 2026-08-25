import { getMicrosite, postMicrosite } from '@/config/microsite-api';

export const getMicrositeDealers = async ({ clientId }) => {
  const { data } = await getMicrosite({
    url: '/microsite/template/dealers',
    params: { clientId },
  });

  return data;
};

export const getMicrositeComponents = async ({ clientId, dealerId }) => {
  const { data } = await getMicrosite({
    url: '/microsite/component',
    params: { clientId, dealerId },
  });

  return data;
};

export const getMicrositeAssets = async ({
  clientId,
  dealerId,
  componentType,
}) => {
  const { data } = await getMicrosite({
    url: '/microsite/asset',
    params: { clientId, dealerId, componentType },
  });

  return data;
};

export const saveMicrositeTemplate = async (formData) => {
  const { data } = await postMicrosite({
    url: '/microsite/template',
    body: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
};
