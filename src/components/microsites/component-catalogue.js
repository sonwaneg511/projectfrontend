export const ASSET_TYPES = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  FILE_UPLOAD: 'FILE_UPLOAD',
  FREE_TEXT: 'FREE_TEXT',
  LONG_TEXT: 'LONG_TEXT',
  URL: 'URL',
  CHECKBOX: 'CHECKBOX',
  RADIO: 'RADIO',
  COMPOSITE: 'COMPOSITE',
};

const IMAGE_FORMATS = ['png', 'jpg', 'jpeg', 'webp'];

export const COMPONENT_CATALOGUE = {
  LOGO: {
    label: 'Logo',
    assetType: ASSET_TYPES.IMAGE,
    minEntries: 1,
    maxEntries: 1,
    constraints: {
      formats: IMAGE_FORMATS,
      aspectRatio: 1,
      minWidth: 200,
      minHeight: 200,
    },
  },
  SPOTLIGHT_BANNER: {
    label: 'Spotlight Banner',
    assetType: ASSET_TYPES.IMAGE,
    minEntries: 1,
    maxEntries: 5,
    constraints: {
      formats: IMAGE_FORMATS,
      aspectRatio: 1600 / 700,
      minWidth: 1600,
      minHeight: 700,
    },
  },
  PRODUCTS: {
    label: 'Products',
    assetType: ASSET_TYPES.COMPOSITE,
    minEntries: 0,
    maxEntries: 8,
    fields: [
      {
        fieldKey: 'text',
        label: 'Product Name',
        assetType: ASSET_TYPES.FREE_TEXT,
        mandatory: true,
        constraints: { maxChars: 60 },
      },
      {
        fieldKey: 'image',
        label: 'Product Image',
        assetType: ASSET_TYPES.IMAGE,
        mandatory: true,
        constraints: {
          formats: IMAGE_FORMATS,
          aspectRatio: 1,
          minWidth: 500,
          minHeight: 500,
        },
      },
      {
        fieldKey: 'redirect_url',
        label: 'Redirect URL',
        assetType: ASSET_TYPES.URL,
        mandatory: false,
      },
    ],
  },
  STORE_FEATURES_AMENITIES: {
    label: 'Store Features & Amenities',
    assetType: ASSET_TYPES.CHECKBOX,
  },
  IMAGE_GALLERY: {
    label: 'Image Gallery',
    assetType: ASSET_TYPES.IMAGE,
    minEntries: 3,
    maxEntries: 10,
    constraints: {
      formats: IMAGE_FORMATS,
      aspectRatio: 1,
      minWidth: 700,
      minHeight: 700,
    },
  },
  FAQ: {
    label: 'FAQ',
    assetType: ASSET_TYPES.COMPOSITE,
    minEntries: 0,
    maxEntries: 10,
    fields: [
      {
        fieldKey: 'question',
        label: 'Question',
        assetType: ASSET_TYPES.FREE_TEXT,
        mandatory: true,
        constraints: { maxChars: 120 },
      },
      {
        fieldKey: 'answer',
        label: 'Answer',
        assetType: ASSET_TYPES.LONG_TEXT,
        mandatory: true,
        constraints: { maxChars: 500 },
      },
    ],
  },
  LANGUAGES_SPOKEN: {
    label: 'Languages Spoken',
    assetType: ASSET_TYPES.CHECKBOX,
  },
  PAYMENT_OPTIONS: {
    label: 'Payment Options',
    assetType: ASSET_TYPES.CHECKBOX,
  },
  PARKING_INFO: {
    label: 'Parking Info',
    assetType: ASSET_TYPES.FREE_TEXT,
    minEntries: 0,
    maxEntries: 1,
    constraints: { maxChars: 200 },
  },
};

export function toImageUploadRules(constraints = {}) {
  return {
    aspectRatio: constraints.aspectRatio ?? 1,
    minWidth: constraints.minWidth ?? 0,
    minHeight: constraints.minHeight ?? 0,
  };
}
