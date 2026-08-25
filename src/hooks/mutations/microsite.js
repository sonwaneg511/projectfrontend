import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { saveMicrositeTemplate } from '@/lib/services/microsite';

export const useSaveMicrositeTemplate = () => {
  return useMutation({
    mutationFn: (formData) => saveMicrositeTemplate(formData),
    onSuccess: () => {
      toast.success('Microsite updated successfully.');
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to update microsite.');
    },
  });
};
