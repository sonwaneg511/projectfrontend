export const createPostGMB = {
  label: '',
  postSummary: '',
  imageUrl: '',
  postImageType: 'photo',
  dealer_id: [],
  status: '',
};

export const createEventGMB = {
  ...createPostGMB,
  postType: 'event',
  postTitle: '',
  actionType: '',
  actionTypeUrl: '',
  startDate: null,
  endDate: null,
  startTime: '00:00',
  endTime: '23:59',
};

export const createOfferGMB = {
  ...createPostGMB,
  postType: 'offer',
  offerTitle: '',
  couponCode: '',
  redeemLink: '',
  termsandConditions: '',
  startDate: null,
  endDate: null,
  startTime: '',
  endTime: '',
};

export const createWhatsNewGMB = {
  ...createPostGMB,
  postType: 'whats_new',
  actionType: '',
  actionTypeUrl: '',
};

export const createPostFB = {
  label: '',
  postSummary: '',
  dealer_id: [],
  status: '',
};

export const createTextFB = {
  ...createPostFB,
  postType: 'text',
};

export const createLinkFB = {
  ...createPostFB,
  postType: 'link',
  actionType: '',
  actionTypeUrl: '',
};

export const createPhotoFB = {
  ...createPostFB,
  postType: 'photo',
  postImageType: 'photo',
  imageUrl: '',
};
