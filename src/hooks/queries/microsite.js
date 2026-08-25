import { useQuery } from '@tanstack/react-query';
import {
  getMicrositeAssets,
  getMicrositeComponents,
  getMicrositeDealers,
} from '@/lib/services/microsite';

export const useGetMicrositeDealers = ({ clientId }) => {
  return useQuery({
    queryKey: ['microsite-dealers', clientId],
    queryFn: () => getMicrositeDealers({ clientId }),
    staleTime: 30 * 60 * 1000,
    enabled: !!clientId,
  });
};

export const useGetMicrositeComponents = ({ clientId, dealerId }) => {
  return useQuery({
    queryKey: ['microsite-components', clientId, dealerId],
    queryFn: () => getMicrositeComponents({ clientId, dealerId }),
    staleTime: 5 * 60 * 1000,
    enabled: !!clientId && !!dealerId,
  });
};

export const useGetMicrositeAssets = ({
  clientId,
  dealerId,
  componentType,
}) => {
  return useQuery({
    queryKey: ['microsite-assets', clientId, dealerId, componentType],
    queryFn: () => getMicrositeAssets({ clientId, dealerId, componentType }),
    staleTime: 5 * 60 * 1000,
    enabled: !!clientId && !!dealerId && !!componentType,
  });
};
