import { z } from 'zod';

/**
 * Shared fields across all post types
 */
const baseSchema = {
  label: z.string().min(1, 'Label is required'),
  postSummary: z.string().min(1, 'Post text is required'),
  imageUrl: z.string().trim().optional(),
  postImageType: z.enum(['photo', 'url']),
  dealer_id: z.array(z.string()).min(1, 'Select at least one dealer'),
};

/**
 * Event post
 */
const eventSchema = z.object({
  ...baseSchema,
  postType: z.literal('event'),
  postTitle: z.string().min(1, 'Title is required'),
  actionType: z.string().min(1, 'Action type is required'),
  actionTypeUrl: z.string().url('Invalid action URL'),
  startDate: z.date({ error: 'Start date is required' }),
  endDate: z.date({ error: 'End date is required' }),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
});

/**
 * Offer post
 */
const offerSchema = z.object({
  ...baseSchema,
  postType: z.literal('offer'),
  offerTitle: z.string().min(1, 'Offer title is required'),
  couponCode: z.string().min(1, 'Coupon code is required'),
  redeemLink: z.string().url('Invalid redeem link'),
  termsandConditions: z.string().min(1, 'Terms and conditions are required'),
  startDate: z.date({ error: 'Start date is required' }),
  endDate: z.date({ error: 'End date is required' }),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
});

/**
 * Whats New post
 */
const whatsNewSchema = z.object({
  ...baseSchema,
  postType: z.literal('whats_new'),
  actionType: z.string().min(1, 'Action type is required'),
  actionTypeUrl: z.string().url('Invalid action URL'),
});

/**
 * Validate imageUrl only when the selected Post Image Type is "url".
 * When "photo" is selected, the image comes from a file upload and is
 * validated separately in the form.
 */
const validateImageUrl = (data, ctx) => {
  if (data.postImageType !== 'url') return;

  const url = data.imageUrl?.trim() ?? '';
  if (!url) {
    ctx.addIssue({
      code: 'custom',
      path: ['imageUrl'],
      message: 'Image is required.',
    });
    return;
  }
  if (!z.string().url().safeParse(url).success) {
    ctx.addIssue({
      code: 'custom',
      path: ['imageUrl'],
      message: 'Image URL is invalid.',
    });
  }
};

/**
 * Final schema
 */
export const createPostGMBSchema = z
  .discriminatedUnion('postType', [eventSchema, offerSchema, whatsNewSchema])
  .superRefine(validateImageUrl);
