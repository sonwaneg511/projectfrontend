import { z } from 'zod';
import { mapZodErrors } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*                          Reusable field validators                         */
/* -------------------------------------------------------------------------- */
/*
 * Every field validator below is intentionally lenient: it only enforces a
 * format when a value is actually provided. An empty string always passes so
 * that a previously populated field can be cleared and sent to the backend for
 * removal. Business-required fields opt into `requiredString()` instead.
 */

/**
 * Ensure a URL carries a protocol. If the user already typed a scheme
 * (e.g. "http://", "ftp://") it's kept as-is; otherwise a default "https://"
 * is prepended. Empty values are returned untouched so clearable fields stay
 * clearable.
 */
export const normalizeUrl = (value) => {
  if (!value) return value;
  return /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`;
};

const isValidUrl = (value) => z.url().safeParse(normalizeUrl(value)).success;

/** Validate a URL only when a value is present (clearable). */
export const urlField = z
  .string()
  .trim()
  .refine((value) => !value || isValidUrl(value), 'Invalid url.');

/** Latitude: numeric, between -90 and 90 (validated only when present). */
export const latitudeField = z
  .string()
  .trim()
  .refine((value) => {
    if (!value) return true;
    const num = Number(value);
    return !Number.isNaN(num) && num >= -90 && num <= 90;
  }, 'Latitude must be a number between -90 and 90.');

/** Longitude: numeric, between -180 and 180 (validated only when present). */
export const longitudeField = z
  .string()
  .trim()
  .refine((value) => {
    if (!value) return true;
    const num = Number(value);
    return !Number.isNaN(num) && num >= -180 && num <= 180;
  }, 'Longitude must be a number between -180 and 180.');

/**
 * Validate a phone number using the project's existing libphonenumber-js
 * implementation. `countryCode` is optional — when omitted the value is parsed
 * as-is (it should already carry a leading "+").
 */
export const validatePhoneNumber = async (value, countryCode) => {
  if (!value) return true;

  const { default: parsePhoneNumberFromString } = await import(
    'libphonenumber-js/min'
  );

  const parsed = parsePhoneNumberFromString(
    countryCode ? `+${countryCode}${value}` : value
  );

  return !!parsed?.isValid();
};

/** A string that must not be empty once the field is modified. */
const requiredString = (message = 'This field is required.') =>
  z.string().trim().min(1, message);

/** A plain, always-optional string (no format constraint). */
const optionalString = z.string().trim();

/** Category multi-select values may be strings or numeric ids. */
const categoryArray = z.array(z.union([z.string(), z.number()]));

/* -------------------------------------------------------------------------- */
/*                              Location Overview                             */
/* -------------------------------------------------------------------------- */

export const locationOverviewSchema = z.object({
  locationTitle: requiredString("Location name can't be empty."),
  address1: optionalString,
  address2: optionalString,
  address3: optionalString,
  area: optionalString,
  city: optionalString,
  state: optionalString,
  pincode: optionalString,
  country: optionalString,
  labels: z.array(z.string()),
  latitude: latitudeField,
  longitude: longitudeField,
  description: optionalString,
  websiteUrl: urlField,
  operationHours: z.array(
    z.object({
      day: z.string(),
      open: z.string(),
      close: z.string(),
      isClosed: z.boolean(),
    })
  ),
  // Phone numbers are intentionally not validated.
  phoneNumber: optionalString,
  additionalPhoneNumber: optionalString,
});

/* -------------------------------------------------------------------------- */
/*                               Facebook Details                             */
/* -------------------------------------------------------------------------- */

export const facebookDetailsSchema = z.object({
  businessName: requiredString("Business name can't be empty."),
  fbPrimaryCategory: optionalString,
  fbAdditionalCategories: categoryArray,
});

/* -------------------------------------------------------------------------- */
/*                                 GMB Details                                */
/* -------------------------------------------------------------------------- */

export const gmbDetailsSchema = z.object({
  primaryCategory: optionalString,
  secondaryCategory: categoryArray,
  appointmentLink: urlField,
  languageCode: optionalString,
  whatsappUrl: urlField,
  facebookUrl: urlField,
  twitterUrl: urlField,
  instagramUrl: urlField,
  linkedinUrl: urlField,
  youtubeUrl: urlField,
});

/* -------------------------------------------------------------------------- */
/*                              Campaign Settings                             */
/* -------------------------------------------------------------------------- */

export const campaignSettingsSchema = z.object({
  radius: optionalString.refine((value) => {
    if (!value) return true;
    const num = Number(value);
    return !Number.isNaN(num) && num > 0;
  }, 'Radius must be greater than 0.'),
  radiusUnit: optionalString,
  landingPageUrl: urlField,
  youtubeUrl: urlField,
  // Phone fields below are validated separately because their validity is
  // coupled with the selected country code (see validateCampaignPhones).
});

/* -------------------------------------------------------------------------- */
/*                               Dirty helpers                                */
/* -------------------------------------------------------------------------- */

/**
 * Compute which top-level fields changed between the initial and current form
 * values. Arrays/objects are compared deeply. A cleared field (e.g. "" or [])
 * is still reported as dirty so it can be sent to the backend for removal.
 *
 * @returns {Record<string, boolean>} dirtyFields map
 */
export const getDirtyFields = (initialValues = {}, currentValues = {}) => {
  const dirtyFields = {};

  for (const key of Object.keys(currentValues)) {
    const before = JSON.stringify(initialValues[key] ?? '');
    const after = JSON.stringify(currentValues[key] ?? '');

    if (before !== after) {
      dirtyFields[key] = true;
    }
  }

  return dirtyFields;
};

/**
 * Validate only the modified (dirty) fields of a form against its schema.
 * Untouched fields are never validated, so an unchanged form always passes.
 *
 * @returns {Promise<{ success: boolean, data: object|null, errors: object }>}
 */
export const validateDirtyFields = async (schema, values, dirtyFields) => {
  // Only validate dirty keys the schema actually knows about. Fields handled
  // outside the schema (e.g. country-code-coupled phones) are skipped here.
  const dirtyKeys = Object.keys(dirtyFields).filter(
    (key) => dirtyFields[key] && key in schema.shape
  );

  if (!dirtyKeys.length) {
    return { success: true, data: {}, errors: {} };
  }

  const mask = Object.fromEntries(dirtyKeys.map((key) => [key, true]));
  const subset = Object.fromEntries(dirtyKeys.map((key) => [key, values[key]]));

  const result = await schema.pick(mask).safeParseAsync(subset);

  if (result.success) {
    return { success: true, data: result.data, errors: {} };
  }

  return {
    success: false,
    data: null,
    errors: mapZodErrors(result.error.issues),
  };
};

/* -------------------------------------------------------------------------- */
/*                              Payload builders                              */
/* -------------------------------------------------------------------------- */

/**
 * Form field names that hold URLs. Their values are normalized (a default
 * "https://" protocol is added when missing) before being sent to the backend,
 * keeping the persisted value consistent with what `urlField` validates.
 */
const URL_FIELDS = new Set([
  'websiteUrl',
  'appointmentLink',
  'whatsappUrl',
  'facebookUrl',
  'twitterUrl',
  'instagramUrl',
  'linkedinUrl',
  'youtubeUrl',
  'landingPageUrl',
]);

/** Normalize a value only when its form field is a URL field. */
const normalizeFieldValue = (field, value) =>
  URL_FIELDS.has(field) ? normalizeUrl(value) : value;

/**
 * Build an update payload containing only the modified fields. Optionally remap
 * form field names to backend keys via `keyMap`. Cleared values are included so
 * the backend can remove them; nested objects/arrays are passed through as-is.
 *
 * @example
 *   buildDirtyPayload(
 *     { city: "Mumbai", state: "Maharashtra", latitude: "" },
 *     { city: true, latitude: true },
 *   ) // => { city: "Mumbai", latitude: "" }
 */
export const buildDirtyPayload = (values, dirtyFields, keyMap = {}) => {
  const payload = {};

  for (const key of Object.keys(dirtyFields)) {
    if (!dirtyFields[key]) continue;

    const apiKey = keyMap[key] ?? key;
    payload[apiKey] = normalizeFieldValue(key, values[key]);
  }

  return payload;
};

/**
 * The only fields that belong to the Location Overview update body. Everything
 * else the form edits (address/geo) is routed to the Facebook sync body.
 */
const LOCATION_OVERVIEW_BODY_FIELDS = [
  'locationTitle',
  'phoneNumber',
  'additionalPhoneNumber',
  'websiteUrl',
  'operationHours',
  'description',
  'labels',
];

/**
 * Map the form's operation hours array into the backend `days` shape. Closed
 * days are omitted; each open day carries its own open/close day + time.
 *
 * @example
 *   [{ day: "Monday", open: "09:00", close: "18:00", isClosed: false }]
 *   // => [{ openDay: "MONDAY", openTime: "09:00", closeDay: "MONDAY", closeTime: "18:00" }]
 */
export const mapOperationHoursToDays = (operationHours = []) =>
  operationHours.map((entry) => {
    const day = entry.day?.toUpperCase();
    const isClosed = entry.isClosed || !entry.open || !entry.close;
    return {
      openDay: day,
      openTime: isClosed ? '' : entry.open,
      closeDay: day,
      closeTime: isClosed ? '' : entry.close,
    };
  });

/**
 * Combine a local number with its country code, space-separated.
 * e.g. ("9876543210", "91") -> "+91 9876543210".
 */
const combinePhone = (number, countryCode) =>
  number ? `+${countryCode} ${number}` : '';

/** Convert a coordinate string to a number, leaving an empty value untouched. */
const toNumberOrEmpty = (value) => (value === '' ? '' : Number(value));

export const buildLocationOverviewPayload = (values, dirtyFields) => {
  const payload = {};

  for (const field of LOCATION_OVERVIEW_BODY_FIELDS) {
    if (!dirtyFields[field]) continue;

    if (field === 'operationHours') {
      payload.operationHours = {
        days: mapOperationHoursToDays(values.operationHours),
      };
    } else if (field === 'phoneNumber') {
      payload.phoneNumber = combinePhone(
        values.phoneNumber,
        values.phoneNumberCountryCode
      );
    } else if (field === 'additionalPhoneNumber') {
      payload.additionalPhoneNumber = [
        combinePhone(
          values.additionalPhoneNumber,
          values.additionalPhoneNumberCountryCode
        ),
      ];
    } else {
      payload[field] = normalizeFieldValue(field, values[field]);
    }
  }

  return payload;
};

/**
 * Location Overview field -> Facebook field. The geo fields and the three
 * address lines that Facebook shares with Location Overview are synced as-is.
 * This keeps Facebook data up to date without duplicating fields in either
 * form's UI.
 */
const LOCATION_OVERVIEW_TO_FACEBOOK_MAP = {
  address1: 'address1',
  address2: 'address2',
  address3: 'address3',
  area: 'area',
  city: 'city',
  state: 'state',
  pincode: 'pincode',
  country: 'country',
  latitude: 'latitude',
  longitude: 'longitude',
};

/**
 * Build a separate Facebook update payload from Location Overview data. Sends
 * only the dirty fields that map onto Facebook. Returns an empty object when no
 * mapped field changed.
 */
export const buildFacebookSyncPayload = (values, dirtyFields) => {
  const payload = {};

  for (const loKey of Object.keys(LOCATION_OVERVIEW_TO_FACEBOOK_MAP)) {
    if (!dirtyFields[loKey]) continue;

    const value = values[loKey];

    payload[LOCATION_OVERVIEW_TO_FACEBOOK_MAP[loKey]] =
      loKey === 'latitude' || loKey === 'longitude'
        ? toNumberOrEmpty(value)
        : value;
  }

  return payload;
};

/** Facebook Details form field -> backend key. */
const FACEBOOK_DETAILS_KEY_MAP = {
  businessName: 'businessName',
  fbPrimaryCategory: 'fbPrimaryCategory',
  fbAdditionalCategories: 'fbAdditionalCategories',
};

// Categories are stored as their ids already: the single select holds the id
// as-is and the multi-select holds an array of ids — both go to the payload
// unchanged via buildDirtyPayload.
export const buildFacebookDetailsPayload = (values, dirtyFields) =>
  buildDirtyPayload(values, dirtyFields, FACEBOOK_DETAILS_KEY_MAP);

/** GMB Details form field -> backend key. */
const GMB_DETAILS_KEY_MAP = {
  primaryCategory: 'gmbPrimaryCategory',
  secondaryCategory: 'gmbAdditionalCategories',
  appointmentLink: 'appointmentLink',
  languageCode: 'languageCode',
  instagramUrl: 'instagramAttribute',
  facebookUrl: 'facebookAttribute',
  youtubeUrl: 'youtubeAttribute',
  twitterUrl: 'twitterAttribute',
  whatsappUrl: 'whatsAppAttribute',
  linkedinUrl: 'linkedinAttribute',
};

export const buildGmbDetailsPayload = (values, dirtyFields) =>
  buildDirtyPayload(values, dirtyFields, GMB_DETAILS_KEY_MAP);

/** Campaign Settings form field -> backend key. */
const CAMPAIGN_SETTINGS_KEY_MAP = {
  radius: 'radius',
  radiusUnit: 'radiusUnit',
  campaignPhoneNumber: 'campaignPhoneNumber',
  callAdsPhoneNumber: 'callAdsPhoneNumber',
  landingPageUrl: 'landingPageUrl',
  youtubeUrl: 'youtubeUrl',
};

/**
 * Only the mapped payload fields are sent. Helper-only form state such as the
 * country-code fields is intentionally excluded.
 */
export const buildCampaignSettingsPayload = (values, dirtyFields) => {
  const payload = {};

  for (const formKey of Object.keys(CAMPAIGN_SETTINGS_KEY_MAP)) {
    if (!dirtyFields[formKey]) continue;

    if (formKey === 'campaignPhoneNumber') {
      payload.campaignPhoneNumber = combinePhone(
        values.campaignPhoneNumber,
        values.campaignCountryCode
      );
    } else if (formKey === 'callAdsPhoneNumber') {
      payload.callAdsPhoneNumber = combinePhone(
        values.callAdsPhoneNumber,
        values.callAdsCountryCode
      );
    } else {
      payload[CAMPAIGN_SETTINGS_KEY_MAP[formKey]] = normalizeFieldValue(
        formKey,
        values[formKey]
      );
    }
  }

  return payload;
};

/* -------------------------------------------------------------------------- */
/*                       Campaign phone validation helper                     */
/* -------------------------------------------------------------------------- */

/**
 * Validate the campaign phone fields, honouring dirty state and country codes.
 * Only modified phone fields are validated; cleared values are allowed.
 *
 * @returns {Promise<Record<string, string>>} errors keyed by field name
 */
export const validateCampaignPhones = async (values, dirtyFields) => {
  const errors = {};

  if (dirtyFields.campaignPhoneNumber && values.campaignPhoneNumber) {
    const valid = await validatePhoneNumber(
      values.campaignPhoneNumber,
      values.campaignCountryCode
    );
    if (!valid) errors.campaignPhoneNumber = 'Invalid phone number.';
  }

  if (dirtyFields.callAdsPhoneNumber && values.callAdsPhoneNumber) {
    const valid = await validatePhoneNumber(
      values.callAdsPhoneNumber,
      values.callAdsCountryCode
    );
    if (!valid) errors.callAdsPhoneNumber = 'Invalid phone number.';
  }

  return errors;
};
