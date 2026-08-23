'use client';

import { createContext, useContext, useState } from 'react';
import { useAuth } from '@/context/auth.context';
import { useGetCampaignDetails } from '@/hooks/queries/onboarding';

const CampaignSetupContext = createContext(null);

export const CampaignSetupProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    industry: '',
    subIndustry: '',
    locations: [],
  });
  const [validationErrors, setValidationErrors] = useState({
    industry: '',
    setIndustry: '',
    locations: '',
  });
  const [activeLocation, setActiveLocation] = useState(null);

  const { userDetails } = useAuth();

  const { data: campaignDetails } = useGetCampaignDetails({
    clientId: userDetails?.clientId,
    userId: userDetails?.user_id,
  });

  const hasPrefilledLocationDetails =
    userDetails?.modules?.includes('POSTS') ||
    userDetails?.modules?.includes('REVIEWS');

  const contextValue = {
    formData,
    setFormData,
    validationErrors,
    setValidationErrors,
    activeLocation,
    setActiveLocation,
    hasPrefilledLocationDetails,
    campaignDetails,
  };

  return (
    <CampaignSetupContext.Provider value={contextValue}>
      {children}
    </CampaignSetupContext.Provider>
  );
};

export const useCampaignSetup = () => {
  const context = useContext(CampaignSetupContext);
  if (!context) {
    throw new Error('use useCampaignSetup within CampaignSetupProvider.');
  }

  return context;
};
