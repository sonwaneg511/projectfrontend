'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { CheckIcon, CircleAlertIcon, PencilIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorMessage } from '@/components/ui/error-message';
import { Input } from '@/components/ui/input';
import {
  Label,
  LabelInputContainer,
  labelVariants,
} from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/auth.context';
import { useGetDealerLocationDetails } from '@/hooks/queries/onboarding';
import { cn, mapZodErrors } from '@/lib/utils';
import 'react-international-phone/style.css';
import { toast } from 'sonner';
import { locationExtendedSchema } from './campaign-setup-schema';
import { FB_PAGE_IDS } from './constant';
import { useCampaignSetup } from './provider';

export const CampaignSetupForm = () => {
  const {
    formData,
    setFormData,
    validationErrors,
    setValidationErrors,
    activeLocation,
    setActiveLocation,
    hasPrefilledLocationDetails,
    campaignDetails,
  } = useCampaignSetup();

  const locations = (campaignDetails?.dealer_ids ?? []).map((id) => ({
    id,
    dealerName: campaignDetails?.locations?.[id] ?? id,
  }));

  const industryOptions = Object.keys(
    campaignDetails?.industry_vs_subindustry ?? {}
  ).filter(Boolean);
  const subIndustryOptions = (
    campaignDetails?.industry_vs_subindustry?.[formData.industry] ?? []
  ).filter(Boolean);

  console.log(formData, 'formData');

  return (
    <main className='pt-7'>
      <div className='border-b pb-4'>
        <h2 className='text-lg mb-0.5 font-semibold text-gray-900'>
          Finalise your campaign setup
        </h2>
        <p className='text-sm text-gray-600'>
          Share a few more details to help us setup your media campaigns.
        </p>
      </div>
      <div className='max-w-[640px] mt-4 mb-[52px] mx-auto flex flex-col gap-4'>
        <Card className={'rounded-[12px] bg-white border'}>
          <CardHeader className={'px-6 py-5 border-b'}>
            <CardTitle className={'text-lg font-semibold text-gray-900'}>
              Business Details
            </CardTitle>
          </CardHeader>
          <CardContent className={'flex-col flex gap-6 p-6'}>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>Client Name</p>
              <div className='h-10 rounded-[8px] border bg-[rgba(250,250,250,1)] shadow-xs px-3 py-2'>
                <p className='text-[rgba(113,118,128,1)]'>
                  {campaignDetails?.client_name ?? '—'}
                </p>
              </div>
            </LabelInputContainer>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>Client Phone No.</p>
              <div className='h-10 rounded-[8px] border bg-[rgba(250,250,250,1)] shadow-xs px-3 py-2'>
                <p className='text-[rgba(113,118,128,1)]'>
                  {campaignDetails?.phone_number ?? '—'}
                </p>
              </div>
            </LabelInputContainer>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>Industry</p>
              <Select
                value={formData.industry}
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    industry: value,
                    subIndustry: '',
                  }));
                  setValidationErrors((prev) => ({ ...prev, industry: '' }));
                }}
              >
                <SelectTrigger className={'h-10 text-sm font-normal'}>
                  <SelectValue placeholder={'Select industry'} />
                </SelectTrigger>
                <SelectContent>
                  {industryOptions.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.industry && (
                <ErrorMessage
                  className={'ml-2'}
                  message={validationErrors.industry}
                />
              )}
            </LabelInputContainer>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>Sub-Industry</p>
              <Select
                value={formData.subIndustry}
                disabled={!formData.industry}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, subIndustry: value }));
                  setValidationErrors((prev) => ({ ...prev, subIndustry: '' }));
                }}
              >
                <SelectTrigger className={'h-10 text-sm font-normal'}>
                  <SelectValue placeholder={'Select sub industry'} />
                </SelectTrigger>
                <SelectContent>
                  {subIndustryOptions.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.subIndustry && (
                <ErrorMessage
                  className={'ml-2'}
                  message={validationErrors.subIndustry}
                />
              )}
            </LabelInputContainer>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>Objective</p>
              <Select
                value={formData.objective}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, objective: value }));
                  setValidationErrors((prev) => ({ ...prev, objective: '' }));
                }}
              >
                <SelectTrigger className={'h-10 text-sm font-normal'}>
                  <SelectValue placeholder={'Select objective'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={'Leads'}>Leads</SelectItem>
                  <SelectItem value={'Store Visits'}>Store Visits</SelectItem>
                  <SelectItem value={'Awareness'}>Awareness</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.objective && (
                <ErrorMessage
                  className={'ml-2'}
                  message={validationErrors.objective}
                />
              )}
            </LabelInputContainer>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>Monthly Budget</p>
              <Select
                value={formData.monthlyBudget}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, monthlyBudget: value }));
                  setValidationErrors((prev) => ({
                    ...prev,
                    monthlyBudget: '',
                  }));
                }}
              >
                <SelectTrigger className={'h-10 text-sm font-normal'}>
                  <SelectValue placeholder={'Select monthly budget'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={'<10K'}>&lt;10K</SelectItem>
                  <SelectItem value={'10-50K'}>10-50K</SelectItem>
                  <SelectItem value={'50K-2 lakhs'}>50K-2 Lakhs</SelectItem>
                  <SelectItem value={'2 lakhs+'}>2 Lakhs+</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.monthlyBudget && (
                <ErrorMessage
                  className={'ml-2'}
                  message={validationErrors.monthlyBudget}
                />
              )}
            </LabelInputContainer>
          </CardContent>
        </Card>
        <Card className={'rounded-[12px] bg-white border'}>
          <CardHeader className={'px-6 py-5 border-b'}>
            <CardTitle className={'text-lg font-semibold text-gray-900'}>
              Location Details
            </CardTitle>
          </CardHeader>
          <CardContent className={'p-2 space-y-1.5'}>
            <ul className='flex-col flex gap-2'>
              {locations.map((location) => {
                const hasAddedDetails = formData.locations.find(
                  (added) => added.id === location.id
                );
                const hasFacebookPageId = formData.locations.some(
                  (added) => added.id === location.id && added?.fbPageId
                );

                return (
                  <li
                    key={location.id}
                    className='p-4 rounded-[12px] bg-white border border-[rgba(233,234,235,1)]'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center gap-2 flex-1'>
                        <p className='text-lg font-medium text-gray-900'>
                          {hasPrefilledLocationDetails
                            ? location.dealerName
                            : (hasAddedDetails?.locationName ??
                              'Location Name')}
                        </p>
                        {(!hasFacebookPageId || !hasAddedDetails) && (
                          <div className='size-[22px] rounded-full flex items-center justify-center bg-warning-50 border border-warning-200'>
                            <CircleAlertIcon
                              size={14}
                              className='text-warning-500'
                            />
                          </div>
                        )}
                      </div>
                      <div className='flex items-center gap-2.5'>
                        {hasAddedDetails && (
                          <div className='size-[22px] rounded-full flex items-center justify-center bg-success-50 border border-success-200 text-success-500'>
                            <CheckIcon size={14} />
                          </div>
                        )}
                        {hasAddedDetails ? (
                          <Button
                            variant={'outline'}
                            size={'icon'}
                            className={
                              'size-9 text-gray-400 hover:text-gray-500'
                            }
                            onClick={() => {
                              setActiveLocation(location.id);
                              setValidationErrors((prev) => ({
                                ...prev,
                                locations: '',
                              }));
                            }}
                          >
                            <PencilIcon size={16} />
                          </Button>
                        ) : (
                          <button
                            onClick={() => {
                              setActiveLocation(location.id);
                              setValidationErrors((prev) => ({
                                ...prev,
                                locations: '',
                              }));
                            }}
                            className='text-sm font-medium text-brand-700 outline-none'
                          >
                            Add Details
                          </button>
                        )}
                      </div>
                    </div>

                    {!hasFacebookPageId && hasAddedDetails && (
                      <ErrorMessage
                        message={'Please assign facebook page id.'}
                        className={'text-warning-500'}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
            {activeLocation && <CampaignLocationForm />}
            {validationErrors.locations && (
              <ErrorMessage
                className={'ml-2'}
                message={validationErrors.locations}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

const CampaignLocationForm = () => {
  const [locationFormData, setLocationFormData] = useState({
    locationName: '',
    state: '',
    city: '',
    address: '',
    pincode: '',
    fbPageId: '',
    latitude: '',
    longitude: '',
    radius: '',
    radiusUnit: 'KILOMETERS',
    landingPgUrl: '',
    country: '',
    countryCode: '',
    callAdsPhoneNo: '',
    monthlyBudget: '',
    objective: '',
  });
  const [validationErrors, setValidationErrors] = useState({
    locationName: '',
    state: '',
    city: '',
    address: '',
    pincode: '',
    callAdsPhoneNo: '',
    fbPageId: '',
    latitude: '',
    longitude: '',
    radius: '',
    landingPgUrl: '',
    'lat&long': '',
    monthlyBudget: '',
    objective: '',
  });

  const {
    activeLocation,
    setActiveLocation,
    formData,
    setFormData,
    hasPrefilledLocationDetails,
    campaignDetails,
  } = useCampaignSetup();

  const { userDetails } = useAuth();

  const { data: locationDetails } = useGetDealerLocationDetails({
    clientId: userDetails?.clientId,
    dealerId: activeLocation,
  });

  const isFbPageIdAlreadyAssigned = formData.locations.find(
    (location) => location.fbPageId === locationFormData.fbPageId
  );

  const stateOptions = (locationDetails?.state ?? []).filter(Boolean);
  const cityOptions = (locationDetails?.city ?? []).filter(Boolean);
  const radiusUnitOptions = (
    campaignDetails?.radius_metric ?? ['KILOMETERS', 'MILES']
  ).filter(Boolean);

  useEffect(() => {
    if (!activeLocation) return;

    const edited = formData.locations.find((l) => l.id === activeLocation);

    setLocationFormData({
      locationName:
        campaignDetails?.locations?.[activeLocation] ??
        edited?.locationName ??
        '',
      state: edited?.state ?? locationDetails?.state?.[0] ?? '',
      city: edited?.city ?? locationDetails?.city?.[0] ?? '',
      address: edited?.address ?? locationDetails?.address ?? '',
      pincode: edited?.pincode ?? locationDetails?.pincode ?? '',
      fbPageId: edited?.fbPageId ?? '',
      latitude:
        edited?.latitude ?? locationDetails?.campaign_detail?.latitude ?? '',
      longitude:
        edited?.longitude ?? locationDetails?.campaign_detail?.longitude ?? '',
      radius:
        edited?.radius ??
        locationDetails?.campaign_detail?.campaign_coverage_radius ??
        '',
      radiusUnit:
        edited?.radiusUnit ??
        campaignDetails?.radius_metric?.[0] ??
        'KILOMETERS',
      landingPgUrl:
        edited?.landingPgUrl ??
        locationDetails?.campaign_detail?.landing_page_url ??
        '',
      country: edited?.country ?? '',
      countryCode: edited?.countryCode ?? '',
      callAdsPhoneNo:
        edited?.callAdsPhoneNo ??
        locationDetails?.campaign_detail?.advertising_phone_no ??
        '',
      monthlyBudget: edited?.monthlyBudget ?? '',
      objective:
        edited?.objective ?? locationDetails?.campaign_detail?.objective ?? '',
    });
  }, [
    locationDetails,
    activeLocation,
    campaignDetails?.locations?.[activeLocation],
    campaignDetails?.radius_metric?.[0],
    formData.locations.find,
  ]);

  const handleClose = () => {
    setActiveLocation(null);
  };

  const handleInputChange = (e) => {
    const { value, name, dataset } = e.target;

    if (dataset.noSpace && /\s/.test(value)) return;
    if (dataset.numericOnly && !/^\d*\.?\d*$/.test(value)) return;

    setLocationFormData((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({
      ...prev,
      [name]: '',
      'lat&long':
        name === 'latitude' || name === 'longitude' ? '' : prev['lat&long'],
    }));
  };

  const handleSubmit = () => {
    const body = {
      locationName: locationFormData.locationName,
      state: locationFormData.state,
      city: locationFormData.city,
      address: locationFormData.address,
      pincode: locationFormData.pincode,
      latitude: locationFormData.latitude,
      longitude: locationFormData.longitude,
      radius: locationFormData.radius,
      landingPgUrl: locationFormData.landingPgUrl,
      country: locationFormData.country,
      countryCode: locationFormData.countryCode,
      callAdsPhoneNo: locationFormData.callAdsPhoneNo,
      monthlyBudget: locationFormData.monthlyBudget,
      objective: locationFormData.objective,
    };

    const result = locationExtendedSchema.safeParse(body);

    if (result.success) {
      const payload = result.data;
      payload.radiusUnit = locationFormData.radiusUnit;

      if (locationFormData.fbPageId) {
        payload.fbPageId = locationFormData.fbPageId;
      }

      const isExistingLocation = formData.locations.some(
        (location) => location.id === activeLocation
      );

      if (isExistingLocation) {
        const updatedLocations = formData.locations.map((location) =>
          location.id === activeLocation
            ? { ...location, ...payload }
            : location
        );
        setFormData((prev) => ({ ...prev, locations: updatedLocations }));
      } else {
        setFormData((prev) => ({
          ...prev,
          locations: [...prev.locations, { id: activeLocation, ...payload }],
        }));
      }

      setActiveLocation(null);
    } else {
      const errors = mapZodErrors(result.error.issues);
      setValidationErrors((prev) => ({ ...prev, ...errors }));
      toast.error('Invalid form details.', { position: 'bottom-center' });
    }
  };

  const handleClearFbPageId = () => {
    const updatedLocations = formData.locations.map((location) => {
      if (location.id === activeLocation) {
        delete location.fbPageId;
      }
      return location;
    });
    setFormData((prev) => ({ ...prev, locations: updatedLocations }));
  };

  return (
    <Sheet open={!!activeLocation} onOpenChange={handleClose}>
      <SheetContent className={'w-[496px] p-0 flex flex-col gap-0'}>
        <SheetHeader className={'px-6 py-5 shrink-0 border-b'}>
          <SheetTitle className={'text-gray-900'}>Location Details</SheetTitle>
          <VisuallyHidden>
            <SheetDescription>No description</SheetDescription>
          </VisuallyHidden>
        </SheetHeader>
        <div className='px-2 py-6 flex-1 overflow-y-auto'>
          <Card className={'rounded-[12px] bg-white'}>
            <div className='p-6 flex flex-col space-y-6'>
              <p className='text-sm font-semibold text-gray-900'>
                Address Information
              </p>
              <LabelInputContainer>
                <Label htmlFor={'location-name'}>Location Name</Label>
                <Input
                  id={'location-name'}
                  name={'locationName'}
                  value={locationFormData.locationName}
                  placeholder={'Enter location name'}
                  className={'disabled:pointer-events-none disabled:opacity-80'}
                  onChange={handleInputChange}
                  disabled={true}
                />
                {validationErrors.locationName && (
                  <ErrorMessage
                    message={validationErrors.locationName}
                    className={'ml-2'}
                  />
                )}
              </LabelInputContainer>
              <LabelInputContainer>
                <p className={cn(labelVariants())}>State</p>
                <Select
                  value={locationFormData.state}
                  onValueChange={(value) => {
                    setLocationFormData((prev) => ({ ...prev, state: value }));
                    setValidationErrors((prev) => ({ ...prev, state: '' }));
                  }}
                  disabled={true}
                >
                  <SelectTrigger
                    className={
                      'h-10 text-sm font-normal disabled:pointer-events-none disabled:opacity-80'
                    }
                  >
                    <SelectValue placeholder={'Select state'} />
                  </SelectTrigger>
                  <SelectContent>
                    {stateOptions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.state && (
                  <ErrorMessage
                    message={validationErrors.state}
                    className={'ml-2'}
                  />
                )}
              </LabelInputContainer>
              <LabelInputContainer>
                <p className={cn(labelVariants())}>City</p>
                <Select
                  value={locationFormData.city}
                  onValueChange={(value) => {
                    setLocationFormData((prev) => ({ ...prev, city: value }));
                    setValidationErrors((prev) => ({ ...prev, city: '' }));
                  }}
                  disabled={true}
                >
                  <SelectTrigger
                    className={
                      'h-10 text-sm font-normal disabled:pointer-events-none disabled:opacity-80'
                    }
                  >
                    <SelectValue placeholder={'Select city'} />
                  </SelectTrigger>
                  <SelectContent>
                    {cityOptions.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.city && (
                  <ErrorMessage
                    message={validationErrors.city}
                    className={'ml-2'}
                  />
                )}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor={'address'}>Address</Label>
                <Textarea
                  id={'address'}
                  name={'address'}
                  placeholder={'Enter address'}
                  value={locationFormData.address}
                  disabled={true}
                  className={
                    'text-sm placeholder:text-sm p-2 max-h-[120px] disabled:pointer-events-none disabled:opacity-80'
                  }
                  onChange={handleInputChange}
                />
                {validationErrors.address && (
                  <ErrorMessage
                    message={validationErrors.address}
                    className={'ml-2'}
                  />
                )}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor={'pincode'}>Pincode</Label>
                <Input
                  id={'pincode'}
                  name={'pincode'}
                  placeholder={'Enter pincode'}
                  data-no-space
                  value={locationFormData.pincode}
                  disabled={true}
                  onChange={handleInputChange}
                  className={'disabled:pointer-events-none disabled:opacity-80'}
                />
                {validationErrors.pincode && (
                  <ErrorMessage
                    message={validationErrors.pincode}
                    className={'ml-2'}
                  />
                )}
              </LabelInputContainer>
            </div>
            <div className='p-6 flex flex-col space-y-6'>
              <p className='text-sm font-semibold text-gray-900'>
                Campaign Related Details
              </p>
              <LabelInputContainer>
                <div className='flex items-center justify-between'>
                  <p className={cn(labelVariants())}>Facebook Page Id</p>
                  {isFbPageIdAlreadyAssigned && (
                    <button
                      onClick={handleClearFbPageId}
                      className='text-xs hover:underline font-semibold text-brand-500'
                    >
                      Clear
                    </button>
                  )}
                </div>
                <Select
                  value={locationFormData.fbPageId}
                  onValueChange={(value) => {
                    setLocationFormData((prev) => ({
                      ...prev,
                      fbPageId: value,
                    }));
                  }}
                >
                  <SelectTrigger className={'h-10 text-sm font-normal'}>
                    <SelectValue placeholder={'Select facebook page id'} />
                  </SelectTrigger>
                  <SelectContent>
                    {FB_PAGE_IDS.map((fbPageId) => {
                      const isDisabled = formData.locations.some(
                        (location) =>
                          location.id !== activeLocation &&
                          location.fbPageId === fbPageId
                      );
                      return (
                        <SelectItem
                          key={fbPageId}
                          value={fbPageId}
                          disabled={isDisabled}
                        >
                          {fbPageId}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {validationErrors.fbPageId && (
                  <ErrorMessage
                    message={validationErrors.fbPageId}
                    className={'ml-2'}
                  />
                )}
              </LabelInputContainer>
              <LabelInputContainer>
                <p className={cn(labelVariants())}>Advertising Phone No.</p>
                <PhoneInput
                  defaultCountry='in'
                  placeholder='Enter your number(optional)'
                  forceDialCode={false}
                  disableDialCodePrefill
                  disableCountryGuess
                  disableDialCodeAndPrefix
                  style={{
                    '--react-international-phone-height': '40px',
                    '--react-international-phone-border-radius': '8px',
                  }}
                  className='shadow-xs rounded-md'
                  inputClassName='w-full px-3'
                  countrySelectorStyleProps={{
                    buttonStyle: { padding: '0px 8px' },
                  }}
                  value={locationFormData.callAdsPhoneNo}
                  onChange={(phone, meta) => {
                    const localNumber = phone.replace(
                      `+${meta.country.dialCode}`,
                      ''
                    );
                    setLocationFormData((prev) => ({
                      ...prev,
                      callAdsPhoneNo: localNumber,
                      countryCode: meta.country.dialCode,
                      country: meta.country.iso2,
                    }));
                    setValidationErrors((prev) => ({
                      ...prev,
                      callAdsPhoneNo: '',
                    }));
                  }}
                />
                {validationErrors.callAdsPhoneNo && (
                  <ErrorMessage
                    message={validationErrors.callAdsPhoneNo}
                    className={'ml-2'}
                  />
                )}
              </LabelInputContainer>
              <LabelInputContainer>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  <LabelInputContainer>
                    <Label htmlFor={'latitude'}>Latitude</Label>
                    <Input
                      id={'latitude'}
                      placeholder={'Enter latitude'}
                      name={'latitude'}
                      data-no-space
                      value={locationFormData.latitude}
                      onChange={handleInputChange}
                      disabled={true}
                    />
                    {validationErrors.latitude && (
                      <ErrorMessage
                        message={validationErrors.latitude}
                        className={'ml-2 sm:hidden'}
                      />
                    )}
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor={'longitude'}>Longitude</Label>
                    <Input
                      id={'longitude'}
                      placeholder={'Enter longitude'}
                      name={'longitude'}
                      data-no-space
                      value={locationFormData.longitude}
                      onChange={handleInputChange}
                      disabled={true}
                    />
                    {validationErrors.longitude && (
                      <ErrorMessage
                        message={validationErrors.longitude}
                        className={'ml-2 sm:hidden'}
                      />
                    )}
                  </LabelInputContainer>
                </div>
                {validationErrors['lat&long'] && (
                  <ErrorMessage
                    message={validationErrors['lat&long']}
                    className={'hidden sm:block'}
                  />
                )}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor={'campaign-coverage-raduis'}>
                  Campaign Coverage Radius
                </Label>
                <div className='h-10 border border-gray-300 overflow-hidden rounded-md focus-within:ring-1 focus-within:ring-brand-500 focus-within:border-brand-500 bg-white flex items-center'>
                  <Input
                    id={'campaign-coverage-raduis'}
                    placeholder={'Enter radius'}
                    name={'radius'}
                    value={locationFormData.radius}
                    data-numeric-only
                    onChange={handleInputChange}
                    className={
                      'h-full border-none focus-visible:ring-0 focus-visible:border-none shadow-none'
                    }
                  />
                  <Select
                    value={locationFormData.radiusUnit}
                    onValueChange={(value) => {
                      setLocationFormData((prev) => ({
                        ...prev,
                        radiusUnit: value,
                      }));
                      setValidationErrors((prev) => ({ ...prev, radius: '' }));
                    }}
                  >
                    <SelectTrigger
                      className={
                        'w-[72px] h-full focus-visible:ring-0 focus-visible:border-none border-none shadow-none text-sm font-normal focus:ring-0'
                      }
                    >
                      <SelectValue placeholder='Select radius' />
                    </SelectTrigger>
                    <SelectContent>
                      {radiusUnitOptions.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit === 'KILOMETERS'
                            ? 'KMS'
                            : unit === 'MILES'
                              ? 'MLS'
                              : unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {validationErrors.radius && (
                  <ErrorMessage
                    message={validationErrors.radius}
                    className={'ml-2'}
                  />
                )}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor={'landing-pg-url'}>Landing Page URL</Label>
                <Input
                  id={'landing-pg-url'}
                  placeholder={'https://landingpage.com'}
                  name={'landingPgUrl'}
                  data-no-space
                  value={locationFormData.landingPgUrl}
                  onChange={handleInputChange}
                />
                {validationErrors.landingPgUrl && (
                  <ErrorMessage
                    message={validationErrors.landingPgUrl}
                    className={'ml-2'}
                  />
                )}
              </LabelInputContainer>
            </div>
          </Card>
        </div>
        <SheetFooter className={'shrink-0 px-6 py-5 border-t'}>
          <Button variant={'outline'} onClick={() => setActiveLocation(null)}>
            Cancel
          </Button>
          <Button variant={'primary'} onClick={handleSubmit}>
            Save Modification
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
