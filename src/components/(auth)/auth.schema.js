import { z } from 'zod';

const PASSWORD_MESSAGE =
  'Password must be 8–64 characters long and include at least one uppercase letter, one lowercase letter, one number, and one symbol.';

export const emailSchema = z
  .email({
    error: (issue) => {
      if (issue.input === undefined || issue.input === '') {
        return "Email can't be empty.";
      }
    },
  })
  .trim();

export const passwordSchema = z
  .string({
    error: (issue) => {
      if (issue.input === undefined) {
        return "Password can't be empty.";
      }
    },
  })
  .trim()
  .min(8, 'Password must be 8–64 characters long')
  .max(64, 'Password must be 8–64 characters long')
  .regex(/[A-Z]/, PASSWORD_MESSAGE)
  .regex(/[a-z]/, PASSWORD_MESSAGE)
  .regex(/[0-9]/, PASSWORD_MESSAGE)
  .regex(/[^A-Za-z0-9]/, PASSWORD_MESSAGE);

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().trim().min(1, "Password can't be empty."),
});

export const signupSchema = loginSchema
  .extend({
    confirmPassword: passwordSchema,
    businessName: z.string().trim().min(1, "Business name can't be empty."),
    mobileNo: z.string().trim().min(1, "Mobile number can't be empty."),
    country: z.string(),
    countryCode: z.string(),
    // industry: z.string().trim().min(1, "Select industry."),
    // subIndustry: z.string().trim().min(1, "Select sub industry."),
  })
  .superRefine(async (data, ctx) => {
    const { default: parsePhoneNumberFromString } = await import(
      'libphonenumber-js/min'
    );

    const phoneNumber = parsePhoneNumberFromString(
      data.mobileNo,
      data.country.toUpperCase()
    );

    if (!phoneNumber?.isValid()) {
      ctx.addIssue({
        path: ['mobileNo'],
        code: z.ZodIssueCode.custom,
        message: 'Invalid mobile number',
      });
    }

    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        code: z.ZodIssueCode.custom,
        message: 'Password and confirm password do not match.',
      });
    }
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const passwordChangeSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['commonError'],
    message: 'Password and confirm password do not match.',
  });
