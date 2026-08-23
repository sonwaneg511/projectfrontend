// post page data
export const posts = [
  {
    id: 1,
    status: 'Approved',
    image: '/dummy_post.png',
    title: 'Happy Ganesh Chaturthi!',
    description:
      'To blessed beginnings. #GaneshChaturthi Book Now - https://bitly.cx/K7t2z #RoyalEnfield #RidePure #PureMotorcycling',
    likes: 256,
    comments: 16,
    shares: 10,
    dealers: '12 Dealers',
    date: '20 Jan 2025',
  },
  {
    id: 2,
    status: 'Rejected',
    image: '/dummy_post.png',
    title: 'Road to Freedom',
    description: 'To roads that lead to freedom 🇮🇳...',
    likes: 150,
    comments: 12,
    shares: 5,
    dealers: '12 Dealers',
    date: '20 Jan 2025',
  },
  {
    id: 3,
    status: 'Pending Approval',
    image: '/dummy_post.png',
    title: 'Hunter 350 - Graphite',
    description: 'Introducing the 2025 Hunter...',
    likes: 200,
    comments: 20,
    shares: 7,
    dealers: '10 Dealers',
    date: '21 Jan 2025',
  },
];

// review page data

export const samplePie = { positive: 60, neutral: 25, negative: 15 };
export const sampleLine = [
  { label: 'Week 1', value1: 0, value2: 0 },
  { label: 'Week 2', value1: 80, value2: 60 },
  { label: 'Week 3', value1: 120, value2: 90 },
  { label: 'Week 4', value1: 140, value2: 100 },
];

export const sampleRatings = [
  { stars: 5, percent: 90 },
  { stars: 4, percent: 60 },
  { stars: 3, percent: 40 },
  { stars: 2, percent: 20 },
  { stars: 1, percent: 10 },
];

export const sampleReviews = [
  {
    id: 1,
    name: 'Aman Raj',
    rating: 2,
    date: '29-July-2025',
    comment:
      "Okay service centre. Zahir is one of the best mechanic I've ever seen. Service manager Shaym's behaviour is great. I have visited this centre in all my Royal Enfield Meteor bike service for the last 7 times in the past 3 years. Update: Zahir left job, the service centre is very bad now. Sales team is also very bad, can't deliver on time, force you to purchase accessories even if you don't want.",
    store_name: 'Royal Enfield Showroom',
    store_location:
      'Alo Automobile, No 3711, Nowdapara Krishnagar to Karimpur Road, Tehatta Near Pwd Bus Stand, Nadia, West Bengal, 741160',
    store_id: '9110122060',
  },
  {
    id: 2,
    name: 'Aman Raj',
    rating: 1,
    date: '28-July-2025',
    comment:
      "Okay service centre. Zahir is one of the best mechanic I've ever seen. Service manager Shaym's behaviour is great. I have visited this centre in all my Royal Enfield Meteor bike service for the last 7 times in the past 3 years. Update: Zahir left job, the service centre is very bad now. Sales team is also very bad, can't deliver on time, force you to purchase accessories even if you don't want.",
    store_name: 'Royal Enfield Showroom',
    store_location:
      'Alo Automobile, No 3711, Nowdapara Krishnagar to Karimpur Road, Tehatta Near Pwd Bus Stand, Nadia, West Bengal, 741160',
    store_id: '9110122060',
  },
];

// multiselect option for loaction
export const multiSelectOptions = [
  { label: '9110122060', value: '9110122060' },
  { label: '9110122910', value: '9110122910' },
  { label: '9110122911', value: '9110122911' },
  { label: '9110122912', value: '9110122912' },
  { label: '9110122913', value: '9110122913' },
  { label: '9110122914', value: '9110122914' },
  { label: '9110122915', value: '9110122915' },
  { label: '9110122916', value: '9110122916' },
  { label: '9110122917', value: '9110122917' },
  { label: '9110122918', value: '9110122918' },
  { label: '9110122919', value: '9110122919' },
  { label: '9110122920', value: '9110122920' },
  { label: '9110122921', value: '9110122921' },
  { label: '9110122922', value: '9110122922' },
  { label: '9110122923', value: '9110122923' },
  { label: '9110122924', value: '9110122924' },
  { label: '9110122925', value: '9110122925' },
  { label: '9110122926', value: '9110122926' },
  { label: '9110122927', value: '9110122927' },
];

export const fbposttypeoption = [
  { label: 'Text', value: 'text' },
  { label: 'Link', value: 'link' },
  { label: 'Photo', value: 'photo' },
  // { label: "Carousel", value: "carousel" },
];

export const ActionTypeUrlOption = [
  { label: 'Book', value: 'book' },
  { label: 'Order', value: 'order' },
  { label: 'Sign Up', value: 'sign_up' },
  { label: 'Learn More', value: 'learn_more' },
  { label: 'Shop', value: 'shop' },
  { label: 'Call', value: 'call' },
];
export const gmbposttypeoption = [
  { label: 'Event', value: 'event' },
  { label: 'Offer', value: 'offer' },
  { label: "What's New", value: 'whats_new' },
];

export const gmbpostimagetypeoption = [
  { label: 'Image', value: 'image' },
  { label: 'URL', value: 'url' },
];

export const dummyPostDetails = {
  id: 'post_1025',

  // Overview
  platform: 'Facebook',
  postType: 'Text Post',
  createdBy: 'Kanishk Karanpuria',
  createdOn: '24-Dec-2025',
  postLabel:
    "This is a post label for internal usage. It won't be visible on the post.",

  // Creative
  postText: 'Discover innovative strategies for reaching new customers.',

  images: [
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c',
  ],

  // Offer section
  couponCode: 'IGSN652',
  redemptionLink: 'https://www.clientwebsite.com/campaign-12025',

  termsAndConditions:
    'Offer valid till stocks last. One coupon per customer. Cannot be combined with other offers.',

  // Metrics (optional but useful)
  metrics: {
    likes: 16,
    comments: 10,
    shares: 4,
  },

  // Status
  status: 'Pending Approval',
};

// Sample campaign data for demonstration
export const CAMPAIGNS_DATA = [
  {
    campaignName: 'Summer Sale 2024',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
  },
  {
    campaignName: 'Black Friday Deals',
    startDate: '2024-11-25',
    endDate: '2024-11-30',
  },
  {
    campaignName: 'Spring Collection',
    startDate: '2024-03-01',
    endDate: '2024-05-31',
  },
  {
    campaignName: 'Holiday Special',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
  },
  {
    campaignName: 'New Year Campaign',
    startDate: '2025-01-01',
    endDate: '2025-01-15',
  },
  {
    campaignName: "Valentine's Day",
    startDate: '2024-02-01',
    endDate: '2024-02-14',
  },
  {
    campaignName: 'Easter Promotion',
    startDate: '2024-03-20',
    endDate: '2024-04-05',
  },
  {
    campaignName: 'Back to School',
    startDate: '2024-08-01',
    endDate: '2024-09-15',
  },
  {
    campaignName: 'Cyber Monday',
    startDate: '2024-11-28',
    endDate: '2024-12-02',
  },
  {
    campaignName: 'Winter Clearance',
    startDate: '2024-01-10',
    endDate: '2024-02-28',
  },
  {
    campaignName: 'Fall Fashion',
    startDate: '2024-09-01',
    endDate: '2024-11-30',
  },
  {
    campaignName: "Mother's Day",
    startDate: '2024-05-01',
    endDate: '2024-05-12',
  },
  {
    campaignName: "Father's Day",
    startDate: '2024-06-01',
    endDate: '2024-06-16',
  },
  {
    campaignName: 'Labor Day Sale',
    startDate: '2024-09-01',
    endDate: '2024-09-05',
  },
  {
    campaignName: 'Memorial Day',
    startDate: '2024-05-20',
    endDate: '2024-05-27',
  },
];

export const dummyLocationDetails = {
  location_overview: {
    completion: 40, // %

    client_name: 'Royal Enfield',
    client_id: '912303990',

    dealer_id: '9120117420',

    store_email: 'mail@store.com',
    store_phone: '+91 98765 43210',

    address: {
      address_1: 'House no.',
      address_2: 'Address line 2',
      address_3: 'Address line 3',
      area: 'Madurai Area',
      pincode: '625106',
      city: 'Madurai',
      state: 'Tamil Nadu',
      country: 'India',
    },

    hours_of_operation: {
      monday: '9:00–18:30',
      tuesday: '9:00–18:30',
      wednesday: '9:00–18:30',
      thursday: '9:00–18:30',
      friday: '9:00–18:30',
      saturday: '9:00–18:30',
      sunday: 'Closed',
    },

    labels: ['S6'],

    latitude: '10.030623',
    longitude: '78.34021',

    description: '',
  },

  gmb_details: {
    completion: 100, // %

    business_name: 'Royal Enfield',

    map_url: 'https://maps.google.com/maps?cid=769358880371338444',

    review_url:
      'https://search.google.com/local/writereview?placeid=ChIJ7e5sbcDr4RsNCgZQETxmo',

    website_url:
      'https://search.google.com/local/writereview?placeid=ChIJ7e5sbcDr4RsNCgZQETxmo',

    additional_phone: '+91 98765 43210',

    primary_category: 'Two Wheeler Repair Shop',
    secondary_category: 'Two Wheeler Repair Shop',

    status: 'Verified',
    open_info_status: 'Open',

    language_code: 'EN',

    appointment_link:
      'https://search.google.com/local/writereview?placeid=ChIJ7e5sbcDr4RsNCgZQETxmo',

    social_links: {
      whatsapp: 'https://wa.me/917825829190',
      twitter: '',
      linkedin: '',
      facebook: '',
      youtube: '',
      instagram: 'https://wa.me/917825829190',
    },
  },

  facebook_details: {
    completion: 100, // %

    business_name: 'Royal Enfield Madras Motors',

    parent_page_id: 'https://maps.google.com/maps?cid=769358880371338444',

    facebook_location_id:
      'accounts/1104679039677848370/locations/13071338260039127866',

    fb_page_url:
      'https://www.royalenfield.com/in/en/locate-us/service-centres/madras_motors',

    fb_website_url:
      'https://www.royalenfield.com/in/en/locate-us/service-centres/madras_motors',

    primary_category: 'Two Wheeler Repair Shop',
    sub_category: 'Two Wheeler Repair Shop',

    page_publish_status: 'Published',
  },

  campaign_settings: {
    completion: 100, // %

    client_business_name: 'Royal Enfield',
    industry: 'Automobile',
    sub_industry: 'Motorcycles',

    radius: '50 KM',

    client_campaign_phone: '+91 98765 43210',
    call_ads_phone: '+91 98765 43210',
  },
};

export const TABLE_DATA = [
  {
    dealer_id: 1,
    dealer_name: 'Sleepycat worli',
    reviewer: 'John Doe',
    city: 'New York',
    comment:
      'I would like to sincerely appreciate Sachin Surve sir for his outstanding support throughout my entire bike purchase journey. From the initial booking to the final delivery, the whole process was handled smoothly and professionally. Sachin sir was extremely supportive, responsive, and helpful at every step. He patiently clarified all my queries, provided timely updates, and ensured that everything was completed without any hassle. His dedication and customer-focused approach truly made the experience pleasant and stress-free. Thanks to him, the entire process was seamless and well-managed. Highly recommended for anyone looking for a smooth and reliable buying experience at pooja motors.',
    reply:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.',
    rating: 4,
    date: '2023-01-01',
    reply_data: '2023-01-09',
  },
  {
    dealer_id: 2,
    dealer_name: 'Sleepycat worli',
    reviewer: 'John Doe',
    city: 'New York',
    comment:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.',
    reply:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.',
    rating: 4,
    date: '2023-01-01',
    reply_data: '2023-01-09',
  },
  {
    dealer_id: 3,
    dealer_name: 'Sleepycat worli',
    reviewer: 'John Doe',
    city: 'New York',
    comment:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.',
    reply:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.',
    rating: 4,
    date: '2023-01-01',
    reply_data: '2023-01-09',
  },
  {
    dealer_id: 4,
    dealer_name: 'Sleepycat worli',
    reviewer: 'John Doe',
    city: 'New York',
    comment:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.',
    reply:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.',
    rating: 4,
    date: '2023-01-01',
    reply_data: '2023-01-09',
  },
];

export const POST_TABLE_DATA = [
  {
    creation_date: '2023-01-01',
    post_title: 'Happy Ganesh Chaturthi!',
    createdBy: 'Kanishk Karanpuria',
    no_of_loaction: '12',
    platform: 'Facebook',
    postType: 'Text Post',
    postId: '8211',
  },
  {
    creation_date: '2023-01-02',
    post_title: 'This is a post title for facebook and google',
    createdBy: 'Kanishk Karanpuria',
    no_of_loaction: '12',
    platform: 'Facebook',
    postType: 'Text Post',
    postId: '8212',
  },
  {
    creation_date: '2023-01-03',
    post_title: 'Hunter 350 - Graphite',
    createdBy: 'Kanishk Karanpuria',
    no_of_loaction: '12',
    platform: 'Facebook',
    postType: 'Text Post',
    postId: '8213',
  },
  {
    creation_date: '2023-01-04',
    post_title: 'Hunter 350 - Graphite',
    createdBy: 'Kanishk Karanpuria',
    no_of_loaction: '12',
    platform: 'Facebook',
    postType: 'Text Post',
    postId: '8214',
  },
  {
    creation_date: '2023-01-05',
    post_title: 'Hunter 350 - Graphite',
    createdBy: 'Kanishk Karanpuria',
    no_of_loaction: '12',
    platform: 'Facebook',
    postType: 'Text Post',
    postId: '8215',
  },
  {
    creation_date: '2023-01-06',
    post_title: 'Hunter 350 - Graphite',
    createdBy: 'Kanishk Karanpuria',
    no_of_loaction: '12',
    platform: 'Facebook',
    postType: 'Text Post',
    postId: '8216',
  },
];

export const CAMPAIGN_WISE_DATA = [
  {
    campaignName: 'Summer Sale 2024',
    creation_date: '2024-06-01',
    cost: '₹ 5,43,552',
    imperssion: '12000',
    clicks: '16000',
    videoViews: '20000',
    conversion: '100',
    CTR: '3%',
    VTR: '15%',
    costPerConversion: '₹ 54',
    costPerMile: '₹ 542',
    costPerView: '₹ 54',
    partnerName: '8458073137102513037',
  },
  {
    campaignName: 'Black Friday Deals',
    creation_date: '2024-11-25',
    cost: '₹ 5,43,552',
    imperssion: '12000',
    clicks: '16000',
    videoViews: '20000',
    conversion: '100',
    CTR: '3%',
    VTR: '15%',
    costPerConversion: '₹ 54',
    costPerMile: '₹ 542',
    costPerView: '₹ 54',
    partnerName: '8458073137102513037',
  },
  {
    campaignName: 'Spring Collection',
    creation_date: '2024-03-01',
    cost: '₹ 5,43,552',
    imperssion: '12000',
    clicks: '16000',
    videoViews: '20000',
    conversion: '100',
    CTR: '3%',
    VTR: '15%',
    costPerConversion: '₹ 54',
    costPerMile: '₹ 542',
    costPerView: '₹ 54',
    partnerName: '8458073137102513037',
  },
  {
    campaignName: 'Holiday Special',
    creation_date: '2024-12-01',
    cost: '₹ 5,43,552',
    imperssion: '12000',
    clicks: '16000',
    videoViews: '20000',
    conversion: '100',
    CTR: '3%',
    VTR: '15%',
    costPerConversion: '₹ 54',
    costPerMile: '₹ 542',
    costPerView: '₹ 54',
    partnerName: '8458073137102513037',
  },
  {
    campaignName: 'New Year Campaign',
    creation_date: '2024-01-01',
    cost: '₹ 5,43,552',
    imperssion: '12000',
    clicks: '16000',
    videoViews: '20000',
    conversion: '100',
    CTR: '3%',
    VTR: '15%',
    costPerConversion: '₹ 54',
    costPerMile: '₹ 542',
    costPerView: '₹ 54',
    partnerName: '8458073137102513037',
  },
  {
    campaignName: "Valentine's Day",
    creation_date: '2024-02-01',
    cost: '₹ 5,43,552',
    imperssion: '12000',
    clicks: '16000',
    videoViews: '20000',
    conversion: '100',
    CTR: '3%',
    VTR: '15%',
    costPerConversion: '₹ 54',
    costPerMile: '₹ 542',
    costPerView: '₹ 54',
    partnerName: '8458073137102513037',
  },
];

export const DAILY_PERFORMANCE_DATA = [
  {
    date: '2023-01-01',
    cost: 10,
    imperssion: 10,
    clicks: 10,
    videoViews: 10,
    conversion: 10,
    CTR: 10,
    VTR: 10,
    costPerConversion: 10,
    CPC: 10,
    CPM: 10,
  },
  {
    date: '2023-01-02',
    cost: 10,
    imperssion: 10,
    clicks: 10,
    videoViews: 10,
    conversion: 10,
    CTR: 10,
    VTR: 10,
    costPerConversion: 10,
    CPC: 10,
    CPM: 10,
  },
  {
    date: '2023-01-03',
    cost: 10,
    imperssion: 10,
    clicks: 10,
    videoViews: 10,
    conversion: 10,
    CTR: 10,
    VTR: 10,
    costPerConversion: 10,
    CPC: 10,
    CPM: 10,
  },
  {
    date: '2023-01-04',
    cost: 10,
    imperssion: 10,
    clicks: 10,
    videoViews: 10,
    conversion: 10,
    CTR: 10,
    VTR: 10,
    costPerConversion: 10,
    CPC: 10,
    CPM: 10,
  },
];

export const LOCATION_WISE_DATA = [
  {
    dealer_id: 1,
    dealer_name: 'Sleepycat worli',
    gbp_status: 'Verified',
    facebook_status: 'Verified',
    campaign_setup: 'Complete',
    health_score: 90,
    email: 'abc@gmail.com',
    latitude: 12.971599,
    longitude: 77.594563,
    phonenumber: '+91 98765 43210',
    area: 'Madurai Area',
    city: 'Madurai',
    state: 'Tamil Nadu',
    country: 'India',
    pincode: '625106',
    address:
      'House no. 12, Address line 2, Address line 3, Area, Pincode, City, State, Country',
    hours_of_operation: {
      mondayOpenTime: '9:00',
      mondayCloseTime: '18:30',
      tuesdayOpenTime: '9:00',
      tuesdayCloseTime: '18:30',
      wednesdayOpenTime: '9:00',
      wednesdayCloseTime: '18:30',
      thursdayOpenTime: '9:00',
      thursdayCloseTime: '18:30',
      fridayOpenTime: '9:00',
      fridayCloseTime: '18:30',
      saturdayOpenTime: '9:00',
      saturdayCloseTime: '14:00',
      sundayOpenTime: 'Closed',
      sundayCloseTime: null,
    },
    website_url:
      'https://www.royalenfield.com/in/en/locate-us/service-centres/madras_motors',
    buisness_description: 'Two Wheeler Repair Shop',
    landing_page_url:
      'https://www.royalenfield.com/in/en/locate-us/service-centres/madras_motors',
    youtube_url:
      'https://www.royalenfield.com/in/en/locate-us/service-centres/madras_motors',
    appointment_link:
      'https://www.royalenfield.com/in/en/locate-us/service-centres/madras_motors',
    whatsapp_url: 'https://wa.me/917825829190',
  },
  {
    dealer_id: 2,
    dealer_name: 'Sleepycat worli',
    gbp_status: 'Unverified',
    facebook_status: 'Verified',
    campaign_setup: 'Verified',
    health_score: 30,
    email: 'abc@gmail.com',
    latitude: 12.971599,
    longitude: 77.594563,
    phonenumber: '+91 98765 43210',
    area: 'Madurai Area',
    city: 'Madurai',
    state: 'Tamil Nadu',
    country: 'India',
    pincode: '625106',
    address:
      'House no. 12, Address line 2, Address line 3, Area, Pincode, City, State, Country',
    hours_of_operation: {
      mondayOpenTime: '9:00',
      mondayCloseTime: '18:30',
      tuesdayOpenTime: '9:00',
      tuesdayCloseTime: '18:30',
      wednesdayOpenTime: '9:00',
      wednesdayCloseTime: '18:30',
      thursdayOpenTime: '9:00',
      thursdayCloseTime: '18:30',
      fridayOpenTime: '9:00',
      fridayCloseTime: '18:30',
      saturdayOpenTime: '9:00',
      saturdayCloseTime: '14:00',
      sundayOpenTime: 'Closed',
      sundayCloseTime: null,
    },
    website_url:
      'https://www.royalenfield.com/in/en/locate-us/service-centres/madras_motors',
    buisness_description: 'Two Wheeler Repair Shop',
    landing_page_url:
      'https://www.royalenfield.com/in/en/locate-us/service-centres/madras_motors',
    youtube_url:
      'https://www.royalenfield.com/in/en/locate-us/service-centres/madras_motors',
    appointment_link:
      'https://www.royalenfield.com/in/en/locate-us/service-centres/madras_motors',
    whatsapp_url: 'https://wa.me/917825829190',
  },
  {
    dealer_id: 3,
    dealer_name: 'First Mumbai Store',
    gbp_status: 'Duplicate',
    facebook_status: 'Verified',
    campaign_setup: 'Verified',
    health_score: 60,
    email: 'abc@gmail.com',
    latitude: 12.971599,
    longitude: 77.594563,
    phonenumber: '+91 98765 43210',
    area: 'Mumbai Area',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    pincode: '625106',
    address:
      'House no. 12, Address line 2, Address line 3, Area, Pincode, City, State, Country',
    hours_of_operation: {
      mondayOpenTime: '9:00',
      mondayCloseTime: '18:30',
      tuesdayOpenTime: '9:00',
      tuesdayCloseTime: '18:30',
      wednesdayOpenTime: '9:00',
      wednesdayCloseTime: '18:30',
      thursdayOpenTime: '9:00',
      thursdayCloseTime: '18:30',
      fridayOpenTime: '9:00',
      fridayCloseTime: '18:30',
      saturdayOpenTime: '9:00',
      saturdayCloseTime: '14:00',
      sundayOpenTime: 'Closed',
      sundayCloseTime: null,
    },
    website_url:
      'https://www.royalenfield.com/in/en/locate-us/service-centres/madras_motors',
    buisness_description: 'Two Wheeler Repair Shop',
    landing_page_url:
      'https://www.royalenfield.com/in/en/locate-us/service-centres/madras_motors',
    youtube_url:
      'https://www.royalenfield.com/in/en/locate-us/service-centres/madras_motors',
    appointment_link:
      'https://www.royalenfield.com/in/en/locate-us/service-centres/madras_motors',
    whatsapp_url: 'https://wa.me/917825829190',
  },
  {
    dealer_id: 4,
    dealer_name: 'Second Mumbai Store',
    gbp_status: 'Not Setup',
    facebook_status: 'Unassigned',
    campaign_setup: 'Incomplete',
    health_score: 20,
    email: 'abc@gmail.com',
    latitude: 12.971599,
    longitude: 77.594563,
    phonenumber: '+91 98765 43210',
    area: 'Mumbai Area',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    pincode: '625106',
    address:
      'House no. 12, Address line 2, Address line 3, Area, Pincode, City, State, Country',
    hours_of_operation: {
      mondayOpenTime: '9:00',
      mondayCloseTime: '18:30',
      tuesdayOpenTime: '9:00',
      tuesdayCloseTime: '18:30',
      wednesdayOpenTime: '9:00',
      wednesdayCloseTime: '18:30',
      thursdayOpenTime: '9:00',
      thursdayCloseTime: '18:30',
      fridayOpenTime: '9:00',
      fridayCloseTime: '18:30',
      saturdayOpenTime: '9:00',
      saturdayCloseTime: '14:00',
      sundayOpenTime: 'Closed',
      sundayCloseTime: null,
    },
    website_url:
      'https://www.royalenfield.com/in/en/locate-us/service-centres/madras_motors',
    buisness_description: 'Two Wheeler Repair Shop',
    landing_page_url:
      'https://www.royalenfield.com/in/en/locate-us/service-centres/madras_motors',
    youtube_url:
      'https://www.royalenfield.com/in/en/locate-us/service-centres/madras_motors',
    appointment_link:
      'https://www.royalenfield.com/in/en/locate-us/service-centres/madras_motors',
    whatsapp_url: 'https://wa.me/917825829190',
  },
];
