import { z } from 'zod';

export const internalOnboardingSchema = z.object({
  clientName: z.string().trim().min(1, 'Select client'),
  clientCode: z
    .string()
    .trim()
    .min(1, "Client code can't be empty.")
    .transform((value) => Number(value))
    .refine((v) => !Number.isNaN(v), 'Please enter a valid client code.'),
  googleAcId: z
    .string()
    .trim()
    .min(1, "Google account id can't be empty.")
    .length(10, 'Google account id must be exactly 10 characters long.')
    .transform((value) => Number(value))
    .refine((v) => !Number.isNaN(v), 'Please enter a valid number.'),
  loginCustomerId: z
    .string()
    .trim()
    .min(1, "Login customer id can't be empty.")
    .transform((value) => Number(value))
    .refine((v) => !Number.isNaN(v), 'Please enter a valid number.'),
  industryKeywords: z
    .array(z.string())
    .min(1, 'Select at least one industry keyword.'),
  landingPgUrlKeywords: z
    .array(z.string())
    .min(1, 'Select at least one landing page url keyword.'),
});
