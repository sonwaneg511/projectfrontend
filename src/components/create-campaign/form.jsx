'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';
import { getAICampaignSuggestions } from '@/lib/services/aiCampaign';
import {
  CreateCampaignFormSearch,
  CreateCampaignFormSearchErrors,
} from './constants';
import {
  CreateCampaignSearchForm,
  CreateCampaignSearchPreview,
} from './search-form';

const CreateCampaignCallAdsForm = dynamic(() =>
  import('./call-ads-form').then((mod) => mod.CreateCampaignCallAdsForm)
);
const CreateCampaignCallAdsPreview = dynamic(() =>
  import('./call-ads-form').then((mod) => mod.CreateCampaignCallAdsPreview)
);

const CreateCampaignPMaxForm = dynamic(() =>
  import('./pmax-form').then((mod) => mod.CreateCampaignPMaxForm)
);
const CreateCampaignPMaxPreview = dynamic(() =>
  import('./pmax-form').then((mod) => mod.CreateCampaignPMaxPreview)
);

const CreateCampaignDemandGenMultiAssetForm = dynamic(() =>
  import('./demand-gen-multi-asset').then(
    (mod) => mod.CreateCampaignDemandGenMultiAssetForm
  )
);
const CreateCampaignDemandGetMultiAssetPreview = dynamic(() =>
  import('./demand-gen-multi-asset').then(
    (mod) => mod.CreateCampaignDemandGetMultiAssetPreview
  )
);

const CreateCampaignContext = createContext(null);

export const useCreateCampaign = () => {
  const context = useContext(CreateCampaignContext);
  if (!context) {
    throw new Error('use useCreateCampaign within CreateCampaignProvider.');
  }

  return context;
};

export const CreateCampaignProvider = ({ children }) => {
  const [campaignType, setCampaignType] = useState('search');
  const [view, setView] = useState('form');
  const [formData, setFormData] = useState(
    () => new CreateCampaignFormSearch()
  );
  const [validationErrors, setValidationErrors] = useState(
    () => new CreateCampaignFormSearchErrors()
  );

  const [aiSuggestions, setAiSuggestions] = useState({
    headlines: [],
    descriptions: [],
    longHeadlines: [],
  });
  const [isAILoading, setIsAILoading] = useState(false);

  const searchParams = useSearchParams();
  const hasDevFlag = searchParams.has('dev');

  const fillEmptySlots = (items, suggestions, maxLength) => {
    const usedValues = new Set(items.map((i) => i.value).filter(Boolean));
    const available = suggestions.filter((s) => !usedValues.has(s));
    let idx = 0;
    return items.map((item) =>
      item.value === '' && idx < available.length
        ? { ...item, value: available[idx++].slice(0, maxLength) }
        : item
    );
  };

  const handleAutofillWithAI = async () => {
    if (!hasDevFlag) {
      return;
    }

    setIsAILoading(true);
    try {
      const suggestions = await getAICampaignSuggestions();
      setAiSuggestions({
        headlines: suggestions.headlines,
        descriptions: suggestions.descriptions,
        longHeadlines: suggestions.headlines,
      });
      setFormData((prevFormData) => {
        const updates = {
          ...prevFormData,
          headlines: fillEmptySlots(
            prevFormData.headlines,
            suggestions.headlines,
            30
          ),
          descriptions: fillEmptySlots(
            prevFormData.descriptions,
            suggestions.descriptions,
            90
          ),
        };
        if (prevFormData.longHeadlines) {
          updates.longHeadlines = fillEmptySlots(
            prevFormData.longHeadlines,
            suggestions.headlines,
            90
          );
        }
        return updates;
      });
      toast.success('Autofill data with AI.', {
        description: `Please use dropdowns to select AI suggestions for ${campaignType === 'pMax' ? 'headlines, descriptions and longHeadlines.' : 'headlines and descriptions.'}`,
      });
    } catch {
      toast.error('Failed to get AI suggestions. Please try again.');
    } finally {
      setIsAILoading(false);
    }
  };

  const contextValue = {
    campaignType,
    setCampaignType,
    view,
    setView,
    formData,
    setFormData,
    validationErrors,
    setValidationErrors,
    aiSuggestions,
    isAILoading,
    handleAutofillWithAI,
  };

  return (
    <CreateCampaignContext.Provider value={contextValue}>
      {children}
    </CreateCampaignContext.Provider>
  );
};

export const CreateCampaingForm = () => {
  const { view, campaignType } = useCreateCampaign();

  let form;
  let preview;

  switch (campaignType) {
    case 'search': {
      form = <CreateCampaignSearchForm />;
      preview = <CreateCampaignSearchPreview />;
      break;
    }

    case 'pMax': {
      form = <CreateCampaignPMaxForm />;
      preview = <CreateCampaignPMaxPreview />;
      break;
    }

    case 'callAds': {
      form = <CreateCampaignCallAdsForm />;
      preview = <CreateCampaignCallAdsPreview />;
      break;
    }

    case 'demandGenMultiAsset': {
      form = <CreateCampaignDemandGenMultiAssetForm />;
      preview = <CreateCampaignDemandGetMultiAssetPreview />;
      break;
    }

    default:
      form = <CreateCampaignSearchForm />;
      preview = <CreateCampaignSearchPreview />;
  }

  return (
    <div className='flex-1 overflow-y-auto flex flex-col gap-4 items-center  bg-card py-4'>
      {view === 'form' ? form : preview}
    </div>
  );
};
