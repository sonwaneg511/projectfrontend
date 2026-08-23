class CoeCampaignForm {
  constructor({
    adName = '',
    matchType = '',
    networkTypes = [],
    biddingStrategy = '',
    landingPgKeywords = [],
    subIndustryKeywords = [],
    headlines = [],
    selectedHeadlines = [],
    descriptions = [],
    selectedDescriptions = [],
    maxCPCBid = '',
  } = {}) {
    this.adName = adName;
    this.matchType = matchType;
    this.networkTypes = networkTypes;
    this.biddingStrategy = biddingStrategy;
    this.landingPgKeywords = landingPgKeywords;
    this.subIndustryKeywords = subIndustryKeywords;
    this.headlines = headlines;
    this.selectedHeadlines = selectedHeadlines;
    this.descriptions = descriptions;
    this.selectedDescriptions = selectedDescriptions;
    this.maxCPCBid = maxCPCBid;
  }
}

export class CoeCampaignFormSearch extends CoeCampaignForm {
  constructor(data = {}) {
    super(data);
  }
}
export class CoeCampaignFormCallAds extends CoeCampaignForm {
  constructor(data = {}) {
    super(data);
  }
}

export class CoeCampaignFormPMax extends CoeCampaignForm {
  constructor(data = {}) {
    super(data);

    const { longHeadlines = [], selectedLongHeadlines = [] } = data;

    this.longHeadlines = longHeadlines;
    this.selectedLongHeadlines = selectedLongHeadlines;
  }
}

class CoeCampaignFormErrors {
  constructor({
    adName = '',
    matchType = '',
    networkTypes = '',
    landingPgKeywords = '',
    subIndustryKeywords = '',
    selectedHeadlines = '',
    selectedDescriptions = '',
    biddingStrategy = '',
    maxCPCBid = '',
  } = {}) {
    this.adName = adName;
    this.matchType = matchType;
    this.networkTypes = networkTypes;
    this.biddingStrategy = biddingStrategy;
    this.landingPgKeywords = landingPgKeywords;
    this.subIndustryKeywords = subIndustryKeywords;
    this.selectedHeadlines = selectedHeadlines;
    this.selectedDescriptions = selectedDescriptions;
    this.maxCPCBid = maxCPCBid;
  }
}

export class CoeCampaignFormSearchErrors extends CoeCampaignFormErrors {
  constructor(data = {}) {
    super(data);
  }
}
export class CoeCampaignFormCallAdsErrors extends CoeCampaignFormErrors {
  constructor(data = {}) {
    super(data);
  }
}

export class CoeCampaignFormPMaxErrors extends CoeCampaignFormErrors {
  constructor(data = {}) {
    super(data);

    const { selectedLongHeadlines = '' } = data;

    this.selectedLongHeadlines = selectedLongHeadlines;
  }
}

export const generateCoeCampaignBody = (formData, platform) => {
  const hasNetworkType = (networkType) => {
    return formData.networkTypes.includes(networkType);
  };

  const defaultCampaignBody = {
    client_id: formData.clientId,
    campaign_id: formData.campaignId,
    match_type: formData.matchType,
    bidding_strategy: formData.biddingStrategy,
    bidding_value: formData.maxCPCBid,
    ad_name: formData.adName,
    keywords: [...formData.subIndustryKeywords, ...formData.landingPgKeywords],
    headlines: formData.selectedHeadlines,
    descriptions: formData.selectedDescriptions,
    is_target_google_search: hasNetworkType('Target Google Search'),
    is_target_search_network: hasNetworkType('Target Search Network'),
    is_target_content_network: false,
    is_target_partner_search_network: false,
  };

  if (platform === 'Pmax campaign') {
    delete defaultCampaignBody.ad_name;

    defaultCampaignBody.long_headlines = formData.selectedLongHeadlines;
  }

  return defaultCampaignBody;
};
