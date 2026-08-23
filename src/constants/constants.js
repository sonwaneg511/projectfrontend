export const PROTECTED_ROUTES = [
  '/dashboard',
  '/campaigns',
  '/create-campaign',
  '/reviews',
  '/posts',
  '/create-post',
  '/locations',
  '/reports',
  '/settings',
  '/coe/internal-onboarding',
  '/coe/campaigns',
];

export const DYNAMIC_PROTECTED_ROUTES = [
  /^\/posts\/[^/]+$/,
  /^\/locations\/[^/]+$/,
  /^\/coe\/campaign-details\/[^/]+$/,
];

export const AUTH_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/invalidsession',
  '/reset',
];

export const FILTER_STORAGE_KEY = 'reviews_filters';

export const DEFAULT_FILTERS = {
  locationId: '',
  rating: null,
  replied: false,
  notReplied: false,
  dateRange: null,
  country: '',
  state: '',
  city: '',
  dealer_id: [],
};

export const ALLOWED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
];

export const ROUTE_PERMISSIONS = {
  '/campaigns': ['CAMPAIGNS'],
  '/create-campaign': ['CAMPAIGNS'],
  '/posts': ['POSTS'],
  '/create-post': ['POSTS'],
  '/reviews': ['REVIEWS'],

  // Dynamic routes (regex)
  '^/posts(/.*)?$': ['POSTS'],
};

export const plans = [
  {
    id: 1,
    name: 'Monthly',
    priceKey: 'monthly',
    billingMultiplier: 1,
    popular: false,
  },
  {
    id: 2,
    name: 'Half-Yearly',
    priceKey: 'halfYearly',
    billingMultiplier: 6,
    popular: true,
  },
  {
    id: 3,
    name: 'Annual',
    priceKey: 'yearly',
    billingMultiplier: 12,
    popular: false,
  },
];

export const PLATFORMS = [
  {
    label: 'Search',
    value: 'search',
  },
  {
    label: 'Call Ads',
    value: 'callAds',
  },
  {
    label: 'P-Max',
    value: 'pMax',
  },
  // {
  //   label: 'Demand Gen Multi Asset',
  //   value: 'demandGenMultiAsset',
  // },
];
