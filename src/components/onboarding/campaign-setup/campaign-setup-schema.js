import parsePhoneNumberFromString from 'libphonenumber-js';
import { z } from 'zod';

export const locationBaseSchema = z
  .object({
    fbPageId: z.string().optional(),
    // fbPageId: z.string().trim().min(1, 'Select a facebook page id.'),
    country: z.string(),
    countryCode: z.string(),
    callAdsPhoneNo: z
      .string()
      .trim()
      .min(1, "Advertising phone number can't be empty."),
    monthlyBudget: z.string().trim().min(1, 'Select a monthly budget.'),
    objective: z.string().trim().min(1, 'Select an objective.'),
    latitude: z.string().trim().min(1, "Latitude can't be empty."),
    longitude: z.string().trim().min(1, "Logitude can't be empty."),
    radius: z.string().trim().min(1, "Campaign radius can't be empty."),
    landingPgUrl: z
      .string()
      .trim()
      .min(1, 'Landing page url is required.')
      .transform((val) => (/^https?:\/\//i.test(val) ? val : `https://${val}`))
      .pipe(
        z.url({
          protocol: /^https?$/,
          hostname: z.regexes.domain,
          error: 'Landing page url is invalid.',
        })
      ),
  })
  .refine(
    (data) => {
      const phoneNumber = parsePhoneNumberFromString(
        data.callAdsPhoneNo,
        data.country.toUpperCase()
      );

      return phoneNumber?.isValid();
    },
    {
      message: 'Invalid phone number.',
      path: ['callAdsPhoneNo'],
    }
  )
  .superRefine((data, ctx) => {
    const latitude = data.latitude.trim();
    const longitude = data.longitude.trim();

    if (!latitude && !longitude) {
      ctx.addIssue({
        message: "Latitude and longitude can't be empty.",
        path: ['lat&long'],
      });

      ctx.addIssue({
        message: "Latitude can't be empty.",
        path: ['latitude'],
      });

      ctx.addIssue({
        message: "Longitude can't be empty.",
        path: ['longitude'],
      });

      return;
    }

    if (!latitude) {
      ctx.addIssue({
        message: "Latitude can't be empty.",
        path: ['lat&long'],
      });

      ctx.addIssue({
        message: "Latitude can't be empty.",
        path: ['latitude'],
      });
    }

    if (!longitude) {
      ctx.addIssue({
        message: "Longitude can't be empty.",
        path: ['lat&long'],
      });

      ctx.addIssue({
        message: "Longitude can't be empty.",
        path: ['longitude'],
      });
    }
  });

export const locationExtendedSchema = locationBaseSchema.safeExtend({
  locationName: z.string().trim().min(1, "Location name can't be empty."),
  state: z.string().trim().min(1, 'Select a state.'),
  city: z.string().trim().min(1, 'Select a city.'),
  address: z.string().trim().min(1, "Address can't be empty."),
  pincode: z.string().trim().min(1, "Pincode can't be empty."),
});

export const verifyCampaignSetupSchema = (totalLocations) => {
  return z
    .object({
      industry: z.string().trim().min(1, 'Select industry.'),
      subIndustry: z.string().trim().min(1, 'Select sub industry.'),
      locations: z
        .array(locationExtendedSchema)
        .min(totalLocations, 'Add locations details.'),
    })
    .superRefine((data, ctx) => {
      if (data.locations.length === totalLocations) {
        const missing = data.locations.filter((l) => !l?.fbPageId);

        if (missing.length) {
          ctx.addIssue({
            message: `Please assign facebook page ${missing.length > 1 ? 'IDs' : 'ID'} to ${missing.length > 1 ? 'pages' : 'page'}.`,
            path: ['locations'],
          });
        }
      }
    });
};
