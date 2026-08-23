import { z } from 'zod';

export const editUserSchema = z.object({
  features: z.array(z.string()).min(1, 'Select at least 1 feature.'),
  locations: z.array(z.string()).min(1, 'Select at least one location.'),
});
