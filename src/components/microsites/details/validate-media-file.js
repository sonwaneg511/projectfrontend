import { getImageErrorDescription, validateImage } from '@/lib/utils';
import { toImageUploadRules } from '../component-catalogue';

export async function validateMediaFile(file, constraints = {}) {
  if (!file) return undefined;

  if (file.type?.startsWith('image/')) {
    const rules = toImageUploadRules(constraints);
    try {
      await validateImage(file, rules);
      return undefined;
    } catch (imageError) {
      return getImageErrorDescription([imageError], rules);
    }
  }

  const { formats, maxSizeMB } = constraints;
  const extension = file.name?.split('.').pop()?.toLowerCase();

  if (formats?.length && !formats.includes(extension)) {
    return `Unsupported file type. Allowed: ${formats.join(', ')}.`;
  }

  if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
    return `File must be smaller than ${maxSizeMB}MB.`;
  }

  return undefined;
}
