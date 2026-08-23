import { z } from 'zod';

const baseSchema = {
  label: z.string().min(1, 'Label is required'),
  postSummary: z.string().min(1, 'Post text is required'),
  dealer_id: z.array(z.string()).min(1, 'Select at least one dealer'),
};

const textSchema = z.object({
  ...baseSchema,
  postType: z.literal('text'),
});

const linkSchema = z.object({
  ...baseSchema,
  postType: z.literal('link'),
  actionType: z.string().min(1, 'Action type is required'),
  actionTypeUrl: z.string().url('Invalid action URL'),
});

const photoSchema = z.object({
  ...baseSchema,
  postType: z.literal('photo'),
  postImageType: z.enum(['photo', 'url']),
  imageUrl: z.string().trim().optional(),
});

/**
 * Validate imageUrl only when the selected Post Image Type is "url".
 * When "photo" is selected, the image comes from a file upload and is
 * validated separately in the form.
 */
const validateImageUrl = (data, ctx) => {
  if (data.postType !== 'photo' || data.postImageType !== 'url') return;

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

export const createPostFBSchema = z
  .discriminatedUnion('postType', [textSchema, linkSchema, photoSchema])
  .superRefine(validateImageUrl);
