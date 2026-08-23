'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { useGetInternalOnboardingDetails } from '@/hooks/queries/coe';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { ErrorMessage } from '../../ui/error-message';
import { Input } from '../../ui/input';
import { Label, LabelInputContainer, labelVariants } from '../../ui/label';
import { MultiSelect } from '../../ui/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

const InternalOnboardingContext = createContext(null);

export const useInternalOnboarding = () => {
  const context = useContext(InternalOnboardingContext);
  if (!context) {
    throw new Error(
      'use useInternalOnboarding within a InternalOnboardingProvider.'
    );
  }

  return context;
};

export const InternalOnboardingProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientCode: '',
    googleAcId: '',
    loginCustomerId: '',
    industryKeywords: [],
    landingPgUrlKeywords: [],
  });
  const [validationErrors, setValidationErrors] = useState({
    clientName: '',
    clientCode: '',
    googleAcId: '',
    loginCustomerId: '',
    industryKeywords: '',
    landingPgUrlKeywords: '',
  });

  const { isLoading, data } = useGetInternalOnboardingDetails();

  const { industryKeywords, urlKeywords } = useMemo(() => {
    const keywords = data?.client_keywords.find(
      (clientKeyword) => clientKeyword.client_id === formData.clientName
    );

    const industries = keywords?.sub_industry_keywords || {};
    const industryKeywords = Object.keys(industries).reduce((acc, curr) => {
      if (industries[curr]) {
        acc.push(...industries[curr]);
      }

      return acc;
    }, []);

    const urls = keywords?.url_keywords || {};
    const urlKeywords = Object.keys(urls).reduce((acc, curr) => {
      if (urls[curr]) {
        acc.push(...urls[curr]);
      }

      return acc;
    }, []);

    return { industryKeywords, urlKeywords };
  }, [data, formData.clientName]);

  const contextValue = {
    formData,
    setFormData,
    validationErrors,
    setValidationErrors,
    isLoading,
    data,
    industryKeywords,
    urlKeywords,
  };

  return (
    <InternalOnboardingContext.Provider value={contextValue}>
      {children}
    </InternalOnboardingContext.Provider>
  );
};

export const InternalOnboardingForm = () => {
  const {
    formData,
    setFormData,
    validationErrors,
    setValidationErrors,
    isLoading,
    data,
    industryKeywords,
    urlKeywords,
  } = useInternalOnboarding();

  const industryKeywordsOptions = industryKeywords.map((industry) => ({
    label: industry.keyword,
    value: industry.keyword,
  }));
  const urlKeywordsOptions = urlKeywords.map((urlKeyword) => ({
    label: urlKeyword.keyword,
    value: urlKeyword.keyword,
  }));

  const handleInputChange = (e) => {
    const { name, value, dataset } = e.target;

    if (dataset.numericOnly && !/^\d*$/.test(value)) return;

    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    setValidationErrors((prevValidationErrors) => ({
      ...prevValidationErrors,
      [name]: '',
    }));
  };

  if (isLoading) {
    return (
      <div className='flex-1 overflow-hidden flex flex-col items-center bg-card py-4'>
        <div className='max-w-160 w-full h-full rounded-xl bg-white animate-pulse'></div>
      </div>
    );
  }

  return (
    <div className='flex-1 overflow-y-auto flex flex-col gap-4 items-center  bg-card py-4'>
      <Card className={'max-w-160 w-full rounded-xl bg-white'}>
        <CardHeader className={'px-6 py-5 border-b'}>
          <CardTitle className={'text-lg text-gray-900'}>Create User</CardTitle>
        </CardHeader>
        <CardContent className={'p-6 flex flex-col gap-6'}>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Client Name</p>
            <Select
              value={formData.clientName}
              onValueChange={(value) => {
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  clientName: value,
                }));
                setValidationErrors((prevValidationErrors) => ({
                  ...prevValidationErrors,
                  clientName: '',
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={'Select client name'} />
              </SelectTrigger>
              <SelectContent>
                {data?.client_names?.map(({ client_names, client_id }) => {
                  return (
                    <SelectItem key={client_id} value={client_id}>
                      {client_names}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {validationErrors.clientName && (
              <ErrorMessage
                message={validationErrors.clientName}
                className={'ml-2'}
              />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor={'client-code'}>Client Code</Label>
            <Input
              id={'client-code'}
              placeholder={'Enter client code'}
              name={'clientCode'}
              data-numeric-only
              value={formData.clientCode}
              onChange={handleInputChange}
            />
            {validationErrors.clientCode && (
              <ErrorMessage
                message={validationErrors.clientCode}
                className={'ml-2'}
              />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor={'google-ac-id'}>Google Account Id</Label>
            <Input
              id={'google-ac-id'}
              placeholder={'Enter google account id'}
              value={formData.googleAcId}
              name={'googleAcId'}
              data-numeric-only
              maxLength={10}
              onChange={handleInputChange}
            />
            {validationErrors.googleAcId && (
              <ErrorMessage
                message={validationErrors.googleAcId}
                className={'ml-2'}
              />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor={'login-customer-id'}>Login Customer Id</Label>
            <Input
              id={'login-customer-id'}
              placeholder={'Enter google account id'}
              value={formData.loginCustomerId}
              name={'loginCustomerId'}
              data-numeric-only
              onChange={handleInputChange}
            />
            {validationErrors.loginCustomerId && (
              <ErrorMessage
                message={validationErrors.loginCustomerId}
                className={'ml-2'}
              />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Industry Keywords</p>
            <MultiSelect
              options={industryKeywordsOptions}
              value={formData.industryKeywords}
              onChange={(newIndustryKeywords) => {
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  industryKeywords: newIndustryKeywords,
                }));
                setValidationErrors((prevValidationErrors) => ({
                  ...prevValidationErrors,
                  industryKeywords: '',
                }));
              }}
            />
            {validationErrors.industryKeywords && (
              <ErrorMessage
                message={validationErrors.industryKeywords}
                className={'ml-2 mt-1.5'}
              />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Landing Page URL Keywords</p>
            <MultiSelect
              options={urlKeywordsOptions}
              value={formData.landingPgUrlKeywords}
              onChange={(newLandingPgUrlKeywords) => {
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  landingPgUrlKeywords: newLandingPgUrlKeywords,
                }));
                setValidationErrors((prevValidationErrors) => ({
                  ...prevValidationErrors,
                  landingPgUrlKeywords: '',
                }));
              }}
            />
            {validationErrors.landingPgUrlKeywords && (
              <ErrorMessage
                message={validationErrors.landingPgUrlKeywords}
                className={'ml-2 mt-1.5'}
              />
            )}
          </LabelInputContainer>
        </CardContent>
      </Card>
    </div>
  );
};
