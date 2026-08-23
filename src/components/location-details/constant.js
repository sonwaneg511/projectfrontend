function generateTimes(startHour, endHour) {
  const times = [];

  for (let hour = startHour; hour <= endHour; hour++) {
    const formattedHour = String(hour).padStart(2, '0');

    times.push(`${formattedHour}:00`);

    if (hour !== endHour) {
      times.push(`${formattedHour}:30`);
    }
  }

  return times;
}

export const OPERATION_HOURS = [
  {
    day: 'Monday',
    open: '',
    close: '',
    isClosed: true,
  },
  {
    day: 'Tuesday',
    open: '',
    close: '',
    isClosed: true,
  },
  {
    day: 'Wednesday',
    open: '',
    close: '',
    isClosed: true,
  },
  {
    day: 'Thursday',
    open: '',
    close: '',
    isClosed: true,
  },
  {
    day: 'Friday',
    open: '',
    close: '',
    isClosed: true,
  },
  {
    day: 'Saturday',
    open: '',
    close: '',
    isClosed: true,
  },
  {
    day: 'Sunday',
    open: '',
    close: '',
    isClosed: true,
  },
];

export const OPERATION_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const STORE_OPEN_TIMES = generateTimes(9, 12);

export const STORE_CLOSE_TIMES = generateTimes(17, 22);

export const LOCATION_DETAILS_DATA = {
  dealerName: 'Royal Enfield Global Headquarters',
  dealerId: 'Office',
  clientName: 'Royal Enfield',
  locationOverview: {
    clientId: 'Royal_Enfield_913705',
    address1: '#296 Rajiv Gandhi Salai, Sholinganallur',
    address2: '',
    address3: '',
    area: '',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: '',
    labels: ['Global HQ'],
    latitude: '12.9026901',
    longitude: '80.2272972',
    operationHours: OPERATION_HOURS,
    description:
      'The oldest motorcycle manufacturer in continuous production in the world. Pure motorcycling, since 1901.',
    storePhoneNumber: '',
  },
  gmbDetails: {
    businessName: 'Royal Enfield Global Headquarters',
    mapUrl: 'https://maps.google.com/maps?cid=13782408700450875142',
    reviewUrl:
      'https://search.google.com/local/writereview?placeid=ChIJlTFA2cZdUjoRBqeg07DzRL8',
    websiteUrl:
      'https://www.royalenfield.com/?utm_source=GMBlisting&utm_medium=organic',
    phoneNumber: '+91 9876543210',
    primaryCategory: '',
    secondaryCategory: '',
    status: '',
    openInfoStatus: '',
    languageCode: 'en',
    appointmentLink: '',
    whatsappUrl: '',
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    youtubeUrl: '',
    logo: null,
    coverImage: null,
  },
  facebookDetails: {
    businessName: 'Royal Enfield Global Headquarters',
    parentPageId: '',
    fbLocationId: '',
    fbWebsiteUrl: '',
    facebookPageUrl: '',
    primaryCategory: '',
    secondaryCategory: '',
    pagePublishStatus: 'Published',
    profilePicture: {
      id: '18981981',
      url: 'https://caliper-image.s3.ap-south-1.amazonaws.com/posts/1776842971614-jumpman.jpeg',
    },
    // profilePicture: null,
    coverImage: null,
  },
  campaignSettings: {
    industry: 'Automobile',
    subIndustry: 'Car',
    radius: '10',
    radiusUnit: 'KMS',
    clientEmail: 'kanishk.karanpuria@interactiveavenues.com',
    campaignPhoneNumber: '',
    callAdsPhoneNumber: '+91 9876543210',
    landingPageUrl: '',
    youtubeUrl: '',
    platform: 'search',
    objective: '',
  },
};

export const getLocationDetails = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return LOCATION_DETAILS_DATA;
};

export const LOCATION_IMG_PLATOFORMS = {
  gmb: 'GMB',
  facebook: 'FACEBOOK',
};

export const LOCATION_IMG_CATEGORIES = {
  cover: 'COVER',
  profile: 'PROFILE',
  logo: 'LOGO',
  interior: 'INTERIOR',
  exterior: 'EXTERIOR',
  categoryUnspecified: 'CATEGORY_UNSPECIFIED',
};

// NOTE: cap on how many images can be uploaded in a single request. Uploading
// more than this can cause API failures due to the large content size.
export const MAX_MULTI_IMAGE_UPLOAD = 10;

export const COVER_IMAGE_DIMS = {
  minWidth: 480,
  minHeight: 270,
  maxWidth: 2120,
  maxHeight: 1192,
};

export const SQUARE_IMAGE_DIMS = {
  minWidth: 250,
  minHeight: 250,
  maxWidth: 5200,
  maxHeight: 5300,
};

export const LOGO_PROFILE_DIMS = {
  minWidth: 250,
  minHeight: 250,
  maxWidth: 5200,
  maxHeight: 5300,
  aspectRatio: 1,
  aspectRatioLabel: '1:1',
};

export const allowedTypes = ['image/jpeg', 'image/png'];

export const getImageValidationError = (errorType, dims) => {
  switch (errorType) {
    case 'FILE_TOO_SMALL':
      return 'Image must be at least 10KB.';
    case 'FILE_TOO_LARGE':
      return 'Image must not exceed 5MB.';
    case 'RESOLUTION_TOO_SMALL':
      return `Image is too small. Minimum: ${dims.minWidth}×${dims.minHeight}px.`;
    case 'RESOLUTION_TOO_LARGE':
      return `Image is too large. Maximum: ${dims.maxWidth}×${dims.maxHeight}px.`;
    case 'INVALID_ASPECT_RATIO':
      return `Image must have a ${dims.aspectRatioLabel} aspect ratio.`;
    default:
      return 'Invalid image.';
  }
};

export const mapOperationHours = (data) => {
  const days = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  return days.map((day) => {
    const open = data[`${day}OpenTime`] || '';
    const close = data[`${day}CloseTime`] || '';
    const isClosed = !open && !close;

    return {
      day: day.charAt(0).toUpperCase() + day.slice(1),
      open,
      close,
      isClosed,
    };
  });
};
