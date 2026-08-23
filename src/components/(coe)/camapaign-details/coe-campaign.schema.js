import { z } from 'zod';

function customHeadlines(min) {
  const headline = z.object({
    id: z.uuidv4(),
    value: z.string(),
    isNew: z.boolean(),
  });

  const headlines = z
    .array(headline)
    .min(min, `Select at least ${min} headlines.`)
    .transform((headlines) => headlines.map((headline) => headline.value));

  return headlines;
}

function customDescriptions(min) {
  const description = z.object({
    id: z.uuidv4(),
    value: z.string(),
    isNew: z.boolean(),
  });

  const descriptions = z
    .array(description)
    .min(min, `Select at least ${min} descriptions.`)
    .transform((descriptions) =>
      descriptions.map((description) => description.value)
    );

  return descriptions;
}

function customLongHeadlines(min) {
  const longHeadline = z.object({
    id: z.uuidv4(),
    value: z.string(),
    isNew: z.boolean(),
  });

  const longHeadlines = z
    .array(longHeadline)
    .min(min, `Select at least ${min} long headlines.`)
    .transform((longHeadlines) =>
      longHeadlines.map((longHeadline) => longHeadline.value)
    );

  return longHeadlines;
}

const coeCampaignBaseSchema = z
  .object({
    adName: z.string().trim().min(1, "Ad name can't be empty.").optional(),
    matchType: z.string().trim().min(1, 'Select match type.'),
    networkTypes: z.array(z.string()).min(1, 'Select at least 1 network type.'),
    subIndustryKeywords: z
      .array(z.string())
      .min(1, 'Select at least 1 sub industry keyword.'),
    landingPgKeywords: z
      .array(z.string())
      .min(1, 'Select at least 1 landing page keyword.'),
    selectedHeadlines: customHeadlines(3),
    selectedDescriptions: customDescriptions(2),
    biddingStrategy: z.string().min(1, 'Select bidding strategy.'),
    maxCPCBid: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.biddingStrategy === 'Maximize Clicks') {
      const value = data.maxCPCBid?.trim();

      if (!value) {
        ctx.addIssue({
          path: ['maxCPCBid'],
          message: "Max CPC bid can't be empty.",
        });
        return;
      }

      const num = Number(value);

      if (Number.isNaN(num)) {
        ctx.addIssue({
          path: ['maxCPCBid'],
          message: 'Max CPC bid must be a number.',
        });
        return;
      }

      if (num <= 0) {
        ctx.addIssue({
          path: ['maxCPCBid'],
          message: 'Max CPC bid must be greater than 0.',
        });
      }
    }
  });

export const coeCampaignSearchSchema = coeCampaignBaseSchema;

export const coeCampaignCallAdsSchema = coeCampaignBaseSchema.safeExtend({
  selectedHeadlines: customHeadlines(2),
  selectedDescriptions: customDescriptions(2),
});

export const coeCampaignPMaxSchema = coeCampaignBaseSchema.safeExtend({
  selectedLongHeadlines: customLongHeadlines(1),
});
