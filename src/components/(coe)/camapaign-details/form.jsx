'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { CoeCampaignCallAdsForm } from './call-ads-form';
import {
  CoeCampaignFormCallAds,
  CoeCampaignFormCallAdsErrors,
  CoeCampaignFormPMax,
  CoeCampaignFormPMaxErrors,
  CoeCampaignFormSearch,
  CoeCampaignFormSearchErrors,
} from './constant';
import { CoeCampaignPMaxForm } from './pmax-form';
import { CoeCampaignSearchForm } from './search-form';

const CoeCampaignDetailsContext = createContext(null);

const useCoeCampaignDetails = () => {
  const context = useContext(CoeCampaignDetailsContext);
  if (!context) {
    throw new Error(
      'use useCoeCampaignDetails within CoeCampaignDetailsProvider.'
    );
  }

  return context;
};

const CoeCampaignDetailsProvider = ({ campaignType, data, children }) => {
  const [formData, setFormData] = useState(null);
  const [validationErrors, setValidationErrors] = useState(null);

  useEffect(() => {
    switch (campaignType) {
      case 'Search campaign': {
        const headlines = data?.headlines?.map((headline) => ({
          id: uuid(),
          value: headline,
          isNew: false,
        }));
        const descriptions = data?.descriptions?.map((description) => ({
          id: uuid(),
          value: description,
          isNew: false,
        }));

        setFormData(
          () =>
            new CoeCampaignFormSearch({
              adName: data?.ad_name,
              headlines,
              descriptions,
            })
        );
        setValidationErrors(() => new CoeCampaignFormSearchErrors());
        break;
      }

      case 'Call ad campaign': {
        const headlines = data?.headlines?.map((headline) => ({
          id: uuid(),
          value: headline,
          isNew: false,
        }));
        const descriptions = data?.descriptions?.map((description) => ({
          id: uuid(),
          value: description,
          isNew: false,
        }));

        setFormData(
          () =>
            new CoeCampaignFormCallAds({
              adName: data?.ad_name,
              headlines,
              descriptions,
            })
        );
        setValidationErrors(() => new CoeCampaignFormCallAdsErrors());
        break;
      }

      case 'Pmax campaign': {
        const headlines = data?.headlines?.map((headline) => ({
          id: uuid(),
          value: headline,
          isNew: false,
        }));
        const descriptions = data?.descriptions?.map((description) => ({
          id: uuid(),
          value: description,
          isNew: false,
        }));
        const longHeadlines = data?.long_headlines?.map((longHeadline) => ({
          id: uuid(),
          value: longHeadline,
          isNew: false,
        }));

        setFormData(
          () =>
            new CoeCampaignFormPMax({
              adName: data?.ad_name,
              headlines,
              descriptions,
              longHeadlines,
            })
        );
        setValidationErrors(() => new CoeCampaignFormPMaxErrors());
        break;
      }
    }
  }, [data, campaignType]);

  const contextValue = {
    campaignType,
    data,
    formData,
    setFormData,
    validationErrors,
    setValidationErrors,
  };

  return (
    <CoeCampaignDetailsContext.Provider value={contextValue}>
      {children}
    </CoeCampaignDetailsContext.Provider>
  );
};

const CoeCampaignForm = () => {
  const { campaignType } = useCoeCampaignDetails();

  let form;

  switch (campaignType) {
    case 'Search campaign': {
      form = <CoeCampaignSearchForm />;
      break;
    }

    case 'Call ad campaign': {
      form = <CoeCampaignCallAdsForm />;
      break;
    }

    case 'Pmax campaign': {
      form = <CoeCampaignPMaxForm />;
      break;
    }
  }

  return <div className='flex-1 px-10 py-4 overflow-y-auto'>{form}</div>;
};

export { CoeCampaignDetailsProvider, CoeCampaignForm, useCoeCampaignDetails };
