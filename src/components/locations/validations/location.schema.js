import { z } from 'zod';

/* -------------------------
  Latitude Validator
-------------------------- */
export const latitudeSchema = z
  .string()
  .regex(
    /^-?\d{1,2}(\.\d{1,6})?$/,
    'Latitude must have up to 2 digits before decimal and up to 6 after'
  )
  .refine(
    (val) => {
      const num = Number(val);
      return num >= -90 && num <= 90;
    },
    { message: 'Latitude must be between -90 and 90' }
  );

/* -------------------------
  Longitude Validator
-------------------------- */
export const longitudeSchema = z
  .string()
  .regex(
    /^-?\d{1,3}(\.\d{1,6})?$/,
    'Longitude must have up to 3 digits before decimal and up to 6 after'
  )
  .refine(
    (val) => {
      const num = Number(val);
      return num >= -180 && num <= 180;
    },
    { message: 'Longitude must be between -180 and 180' }
  );

const optionalString = z.string().trim().optional();

const urlOptional = z.string().trim().url('Invalid URL').optional();

const phoneOptional = z
  .string()
  .regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number')
  .optional();

/* -------------------------
  Operation Hours
-------------------------- */
export const operationHoursSchema = z.record(
  z.string(),
  z.object({
    open: z
      .string()
      .regex(/^\d{2}:\d{2}$/)
      .optional(),
    close: z
      .string()
      .regex(/^\d{2}:\d{2}$/)
      .optional(),
    closed: z.boolean().optional(),
  })
);

/* -------------------------
  Location Overview
-------------------------- */
export const locationSchema = z.object({
  address1: optionalString,
  address2: optionalString,
  address3: optionalString,
  area: optionalString,
  city: z.string().min(2, 'City is required').optional(),
  state: z.string().min(2, 'State is required').optional(),
  country: z.string().min(2, 'Country is required').optional(),
  pincode: z
    .string()
    .regex(/^\d{6}$/, 'Invalid pincode')
    .optional(),
  latitude: latitudeSchema.optional(),
  longitude: longitudeSchema.optional(),
  description: z.string().max(500, 'Max 500 characters').optional(),
  labels: z.array(z.string()).optional(),
  operationHours: operationHoursSchema.optional(),
});

/* -------------------------
  Google My Business
-------------------------- */
export const gmbSchema = z.object({
  websiteUrl: urlOptional,
  appointmentLink: urlOptional,
  languageCode: z
    .string()
    .length(2, 'Language code must be 2 chars')
    .optional(),

  gmbPrimaryCategory: z.number().int().positive().optional(),
  gmbAdditionalCategories: z.array(z.number().int()).optional(),

  whatsappAttribute: phoneOptional,
  facebookAttribute: urlOptional,
  instagramAttribute: urlOptional,
  twitterAttribute: urlOptional,
  linkedinAttribute: urlOptional,
  youtubeAttribute: urlOptional,
});

/* -------------------------
  Facebook
-------------------------- */
export const facebookSchema = z.object({
  fbPrimaryCategory: z.number().int().positive().optional(),
  fbAdditionalCategories: z.array(z.number().int()).optional(),
  business_name: z.string().min(2).optional(),
});
