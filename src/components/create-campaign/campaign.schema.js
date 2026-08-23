import { z } from 'zod';
import { normalizeUrl } from '../location-details/location-details.schema';

function customHeadlines(min) {
  const headline = z.object({
    id: z.uuidv4(),
    value: z.string(),
  });

  const headlines = z
    .array(headline)
    .superRefine((headlines, ctx) => {
      const filteredHeadlines = headlines.filter((headline) => headline.value);

      if (filteredHeadlines.length < min) {
        ctx.addIssue({
          message: `Fill at least ${min} headlines.`,
        });
      }
    })
    .transform((headlines) => headlines.map((headline) => headline.value));

  return headlines;
}

function customDescriptions(min) {
  const description = z.object({
    id: z.uuidv4(),
    value: z.string(),
  });

  const descriptions = z
    .array(description)
    .superRefine((descriptions, ctx) => {
      const filteredDescriptions = descriptions.filter(
        (description) => description.value
      );

      if (filteredDescriptions.length < min) {
        ctx.addIssue({
          message: `Fill at least ${min} descriptions.`,
        });
      }
    })
    .transform((descriptions) =>
      descriptions.map((description) => description.value)
    );

  return descriptions;
}

function customLongHeadlines(min) {
  const longHeadline = z.object({
    id: z.uuidv4(),
    value: z.string(),
  });

  const longHeadlines = z
    .array(longHeadline)
    .superRefine((longHeadlines, ctx) => {
      const filteredLongHeadlines = longHeadlines.filter(
        (longHeadline) => longHeadline.value
      );

      if (filteredLongHeadlines.length < min) {
        ctx.addIssue({
          message: `Fill at least ${min} long headlines.`,
        });
      }
    })
    .transform((longHeadlines) =>
      longHeadlines.map((longHeadline) => longHeadline.value)
    );

  return longHeadlines;
}

const fileSchema = z.object({
  id: z.string(),
  file: z.instanceof(File),
  errorType: z.string(),
});

const campaignBaseSchema = z.object({
  campaignName: z.string().trim().min(1, "Campaign name can't be empty."),
  campaignBudget: z
    .string()
    .trim()
    .min(1, "Campaign budget can't be empty.")
    .transform((value) => Number(value))
    .refine((v) => v > 0, 'Campaign Budget must be greater than 0'),
  startDate: z.date({
    error: (issue) => {
      if (issue.input === null || issue.input === undefined) {
        return "Start date can't be empty.";
      }
    },
  }),
  endDate: z.date({
    error: (issue) => {
      if (issue.input === null || issue.input === undefined) {
        return "End date can't be empty.";
      }
    },
  }),
  location: z.string().trim().min(1, { error: 'Select location.' }),
  clientComment: z.string().trim().min(1, "Client comment can't be empty."),
  headlines: customHeadlines(3),
  descriptions: customDescriptions(2),
});

export const campaignSearchSchema = campaignBaseSchema.extend({
  landingPgURL: z
    .string()
    .trim()
    .min(1, 'Landing page url is required.')
    .transform((val) => normalizeUrl(val))
    .pipe(
      z.url({
        error: 'Landing page url is invalid.',
      })
    ),
});

export const campaignCallAdsSchema = campaignBaseSchema.extend({
  headlines: customHeadlines(2),
  descriptions: customDescriptions(2),
  path1: z
    .string()
    .trim()
    .min(1, "Path 1 can't be empty.")
    .max(30, 'Path 1 should be less than 15 character.'),
  path2: z
    .string()
    .trim()
    .min(1, "Path 2 can't be empty.")
    .max(15, 'Path 2 should be less than 15 character.'),
  callAdsPhoneNumber: z
    .string()
    .trim()
    .min(1, 'Call Ads phone number is required.')
    .min(10, 'Invalid phone number.')
    .max(10, 'Invalid phone number.'),
});

export const campaignPmaxSchema = campaignBaseSchema.extend({
  businessName: z
    .string()
    .trim()
    .min(1, "Business name can't be empty.")
    .max(25, 'Buniess name should be less than 25 character.'),
  landingPgURL: z
    .string()
    .trim()
    .min(1, 'Landing page url is required.')
    .transform((val) => normalizeUrl(val))
    .pipe(
      z.url({
        error: 'Landing page url is invalid.',
      })
    ),
  ytVideoURL: z
    .string()
    .trim()
    .transform((val) => (val === '' ? undefined : normalizeUrl(val)))
    .pipe(
      z
        .url({
          error: 'Youtube video url is invalid.',
        })
        .optional()
    ),
  longHeadlines: customLongHeadlines(1),
  logos: z
    .array(fileSchema)
    .min(1, { error: 'At least one logo is required.' }),
  landscapeLogos: z
    .array(fileSchema)
    .min(1, { error: 'At least one landscape logo is required.' }),
  marketingImages: z
    .array(fileSchema)
    .min(1, { error: 'At least one marketing image is required.' }),

  portraitMarketingImages: z.array(fileSchema).min(1, {
    error: 'At least one portrait marketing image is required.',
  }),
  squareMarketingImages: z.array(fileSchema).min(1, {
    error: 'At least one square marketing image is required.',
  }),
});

export const campaignDemandGenMultiAssetSchema = campaignBaseSchema.extend({
  businessName: z
    .string()
    .trim()
    .min(1, "Business name can't be empty.")
    .max(25, 'Buniess name should be less than 25 character.'),
  cta: z.string().trim().min(1, "CTA can't be empty."),
  ytVideoURL: z
    .string()
    .trim()
    .min(1, "Youtube video url can't be empty")
    .transform((val) => normalizeUrl(val))
    .pipe(
      z.url({
        error: 'Youtube video url is invalid.',
      })
    ),
  url: z
    .string()
    .trim()
    .min(1, "Url can't be empty")
    .transform((val) => normalizeUrl(val))
    .pipe(
      z.url({
        error: 'Url is invalid.',
      })
    ),
  logos: z
    .array(fileSchema)
    .min(1, { error: 'At least one logo is required.' }),
  marketingImages: z
    .array(fileSchema)
    .min(1, { error: 'At least one marketing image is required.' }),

  portraitMarketingImages: z.array(fileSchema).min(1, {
    error: 'At least one portrait marketing image is required.',
  }),
  squareMarketingImages: z.array(fileSchema).min(1, {
    error: 'At least one square marketing image is required.',
  }),
});
