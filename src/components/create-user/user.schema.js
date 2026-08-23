import { z } from 'zod';

export const createUserSchema = z.object({
  // email: emailSchema,
  emails: z.array(z.string()).min(1, 'Enter at least 1 email.'),
  features: z.array(z.string()).min(1, 'Select at least 1 feature.'),
  locations: z.array(z.string()).min(1, 'Select at least one location.'),
});
