import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import { normalizeUrl } from '../location-details/location-details.schema';

// const DEFAULT_HEADLINES = Array.from({ length: 3 }, (_, idx) => ({
//   id: uuid(),
//   value: '',
// }));

// const DEFAULT_DESCRIPTIONS = Array.from({ length: 2 }, (_, idx) => ({
//   id: uuid(),
//   value: '',
// }));

const normalizeAssetsList = (arr = [], min, max) => {
  const trimmed = arr.slice(0, max);

  const padded = [...trimmed];

  while (padded.length < min) {
    padded.push({
      id: uuid(),
      value: '',
    });
  }

  return padded;
};

const DEFAULT_LONG_HEADLINES = Array.from({ length: 1 }, (_, idx) => ({
  id: uuid(),
  value: '',
}));

export const PMAX_IMAGES_RULES = {
  marketingImages: { aspectRatio: 1.91, minWidth: 600, minHeight: 314 },
  squareImages: { aspectRatio: 1, minWidth: 300, minHeight: 300 },
  portraitImages: { aspectRatio: 4 / 5, minWidth: 480, minHeight: 600 },
  logo: { aspectRatio: 1, minWidth: 128, minHeight: 128 },
  landscapeLogo: { aspectRatio: 4, minWidth: 512, minHeight: 128 },
};

export const calculateDailyBudget = (campaignBudget, startDate, endDate) => {
  let dailyBudget;

  if (startDate && endDate && campaignBudget) {
    const days = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;

    if (days > 0) {
      const calculatedBudget = campaignBudget / days;
      const budget = Math.max(calculatedBudget, 0).toFixed(2);
      dailyBudget = `${budget}`;
    } else {
      dailyBudget = '';
    }
  } else {
    dailyBudget = '';
  }

  return dailyBudget;
};

export function calculatePayable(totalBudget, commissionRate = 0.1) {
  const commission = totalBudget * commissionRate;
  const taxableValue = totalBudget + commission;

  const sgst = taxableValue * 0.09; // 9%
  const cgst = taxableValue * 0.09; // 9%

  const grandTotal = taxableValue + sgst + cgst;

  return {
    agencyCommission: Math.round(commission),
    taxableValue: Math.round(taxableValue),
    sgst: Math.round(sgst),
    cgst: Math.round(cgst),
    grandTotal: Math.round(grandTotal),
  };
}

// class CreateCampaignForm {
//   constructor({
//     campaignName = '',
//     startDate = null,
//     endDate = null,
//     campaignBudget = '',
//     landingPgURL = '',
//     location = '',
//     clientComment = '',
//     headlines = DEFAULT_HEADLINES,
//     descriptions = DEFAULT_DESCRIPTIONS,
//   } = {}) {
//     this.campaignName = campaignName;
//     this.startDate = startDate;
//     this.endDate = endDate;
//     this.campaignBudget = campaignBudget;
//     this.landingPgURL = landingPgURL;
//     this.location = location;
//     this.clientComment = clientComment;
//     this.headlines = headlines;
//     this.descriptions = descriptions;
//   }
// }

class CreateCampaignForm {
  constructor({
    campaignName = '',
    startDate = null,
    endDate = null,
    campaignBudget = '',
    // landingPgURL = '',
    location = '',
    clientComment = '',
  } = {}) {
    this.campaignName = campaignName;
    this.startDate = startDate;
    this.endDate = endDate;
    this.campaignBudget = campaignBudget;
    this.location = location;
    this.clientComment = clientComment;
  }
}

export class CreateCampaignFormSearch extends CreateCampaignForm {
  constructor(data = {}) {
    super(data);

    this.headlines = normalizeAssetsList(data.headlines, 3, 15);
    this.descriptions = normalizeAssetsList(data.descriptions, 2, 4);
    this.landingPgURL = data.landingPgURL ?? '';
  }
}

export class CreateCampaignFormPmax extends CreateCampaignForm {
  constructor(data = {}) {
    super(data);

    this.headlines = normalizeAssetsList(data.headlines, 3, 15);
    this.descriptions = normalizeAssetsList(data.descriptions, 2, 4);

    this.logos = data.logos ?? [];
    this.landscapeLogos = data.landscapeLogos ?? [];

    this.marketingImages = data.marketingImages ?? [];
    this.portraitMarketingImages = data.portraitMarketingImages ?? [];
    this.squareMarketingImages = data.squareMarketingImages ?? [];

    this.landingPgURL = data.landingPgURL ?? '';
    this.ytVideoURL = data.ytVideoURL ?? '';
    this.longHeadlines = data.longHeadlines ?? DEFAULT_LONG_HEADLINES;
    this.businessName = data.businessName ?? '';
  }
}

export class CreateCampaignFormDemandGenMultiAsset extends CreateCampaignForm {
  constructor(data = {}) {
    super(data);

    this.headlines = normalizeAssetsList(data.headlines, 3, 15);
    this.descriptions = normalizeAssetsList(data.descriptions, 2, 4);

    this.logos = data.logos ?? [];
    this.marketingImages = data.marketingImages ?? [];
    this.portraitMarketingImages = data.portraitMarketingImages ?? [];
    this.squareMarketingImages = data.squareMarketingImages ?? [];

    this.ytVideoURL = data.ytVideoURL ?? '';
    this.businessName = data.businessName ?? '';

    this.url = data.url ?? '';
    this.cta = data.cta ?? '';
  }
}

export class CreateCampaignFormCallAds extends CreateCampaignForm {
  constructor(data = {}) {
    super(data);

    this.callAdsPhoneNumber = data.callAdsPhoneNumber ?? '';
    this.path1 = data.path1 ?? '';
    this.path2 = data.path2 ?? '';

    this.headlines = normalizeAssetsList(data.headlines, 2, 2);
    this.descriptions = normalizeAssetsList(data.descriptions, 2, 2);
  }
}

export class CreateCampaignFormErrors {
  constructor({
    campaignName = '',
    startDate = '',
    endDate = '',
    campaignBudget = '',
    // landingPgURL = '',
    location = '',
    clientComment = '',
    headlines = '',
    descriptions = '',
  } = {}) {
    this.campaignName = campaignName;
    this.startDate = startDate;
    this.endDate = endDate;
    this.campaignBudget = campaignBudget;
    // this.landingPgURL = landingPgURL;
    this.location = location;
    this.clientComment = clientComment;
    this.headlines = headlines;
    this.descriptions = descriptions;
  }
}

export class CreateCampaignFormSearchErrors extends CreateCampaignFormErrors {
  constructor(data = {}) {
    super(data);

    this.landingPgURL = data.landingPgURL ?? '';
  }
}

export class CreateCampaignFormPmaxErrors extends CreateCampaignFormErrors {
  constructor(data = {}) {
    super(data);

    const {
      ytVideoURL = '',
      logos = '',
      landscapeLogos = '',
      marketingImages = '',
      portraitMarketingImages = '',
      squareMarketingImages = '',
      longHeadlines = '',
      businessName = '',
      landingPgURL = '',
    } = data;

    this.longHeadlines = longHeadlines;
    this.landingPgURL = landingPgURL;
    this.ytVideoURL = ytVideoURL;
    this.logos = logos;
    this.landscapeLogos = landscapeLogos;
    this.marketingImages = marketingImages;
    this.portraitMarketingImages = portraitMarketingImages;
    this.squareMarketingImages = squareMarketingImages;
    this.businessName = businessName;
  }
}
export class CreateCampaignFormDemandGenMultiAssetErrors extends CreateCampaignFormErrors {
  constructor(data = {}) {
    super(data);

    const {
      ytVideoURL = '',
      logos = '',
      marketingImages = '',
      portraitMarketingImages = '',
      squareMarketingImages = '',
      businessName = '',
      url = '',
      cta = '',
    } = data;

    this.ytVideoURL = ytVideoURL;
    this.logos = logos;
    this.marketingImages = marketingImages;
    this.portraitMarketingImages = portraitMarketingImages;
    this.squareMarketingImages = squareMarketingImages;
    this.businessName = businessName;
    this.url = url;
    this.cta = cta;
  }
}

export class CreateCampaignFormCallAdsErrors extends CreateCampaignFormErrors {
  constructor(data = {}) {
    super(data);

    const { path1 = '', path2 = '', callAdsPhoneNumber = '' } = data;

    this.path1 = path1;
    this.path2 = path2;
    this.callAdsPhoneNumber = callAdsPhoneNumber;
  }
}

export const generateCampaignBody = (formData, platform) => {
  const dailyBudget = calculateDailyBudget(
    formData.campaignBudget,
    formData.startDate,
    formData.endDate
  );

  const defaultCampaignBody = {
    campaign_name: formData.campaignName,
    start_date: format(formData.startDate, 'yyyy-MM-dd'),
    end_date: format(formData.endDate, 'yyyy-MM-dd'),
    daily_budget: +dailyBudget,
    total_budget: formData.campaignBudget,
    dealer_id: formData.location,
    client_comment: formData.clientComment,
    headlines: formData.headlines,
    descriptions: formData.descriptions,
    platform,
    gemini_bool: false,
  };

  if (platform === 'search') {
    defaultCampaignBody.landing_page_url = normalizeUrl(formData.landingPgURL);
  }

  if (platform === 'callAds') {
    defaultCampaignBody.path_1 = formData.path1;
    defaultCampaignBody.path_2 = formData.path2;
    defaultCampaignBody.callAdsPhoneNumber = formData.callAdsPhoneNumber;
  }

  if (platform === 'pMax') {
    defaultCampaignBody.long_headlines = formData.longHeadlines;
    defaultCampaignBody.youtube_url = normalizeUrl(formData.ytVideoURL);
    defaultCampaignBody.logo = formData.logos;
    defaultCampaignBody.landscape_logo = formData.landscapeLogos;
    defaultCampaignBody.marketing_images = formData.marketingImages;
    defaultCampaignBody.portrait_marketing_images =
      formData.portraitMarketingImages;
    defaultCampaignBody.square_marketing_images =
      formData.squareMarketingImages;
    defaultCampaignBody.business_name = formData.businessName;
    defaultCampaignBody.landing_page_url = normalizeUrl(formData.landingPgURL);
  }

  if (platform === 'demandGenMultiAsset') {
    defaultCampaignBody.url = normalizeUrl(formData.url);
    defaultCampaignBody.youtube_url = normalizeUrl(formData.ytVideoURL);
    defaultCampaignBody.logo = formData.logos;
    defaultCampaignBody.marketing_images = formData.marketingImages;
    defaultCampaignBody.portrait_marketing_images =
      formData.portraitMarketingImages;
    defaultCampaignBody.square_marketing_images =
      formData.squareMarketingImages;
    defaultCampaignBody.business_name = formData.businessName;
    defaultCampaignBody.cta = formData.cta;
  }

  return defaultCampaignBody;
};
