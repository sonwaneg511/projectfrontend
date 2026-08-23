'use client';

import { PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import { useAuth } from '@/context/auth.context';
import { useUpdateCampaignSettings } from '@/hooks/mutations/locations';
import { cn } from '@/lib/utils';
import 'react-international-phone/style.css';
import { toast } from 'sonner';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ErrorMessage } from '../ui/error-message';
import { Input } from '../ui/input';
import { Label, LabelInputContainer, labelVariants } from '../ui/label';
import { Loader } from '../ui/loader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import {
  buildCampaignSettingsPayload,
  campaignSettingsSchema,
  getDirtyFields,
  validateCampaignPhones,
  validateDirtyFields,
} from './location-details.schema';

export const CampaignSettings = ({
  campaignSettings,
  commonDetails,
  setShowSuccessDialog,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className={'bg-white rounded-lg border'}>
      <AccordionItem value={'campaign-details'} className={'border-none'}>
        <AccordionTrigger
          className={'px-6 py-5 text-lg text-gray-900 font-semibold'}
        >
          <div className='flex items-center justify-between w-full gap-3'>
            <p className='text-lg font-semibold text-gray-900 flex-1'>
              Campaign Settings
            </p>
            <Button
              variant={'secondary'}
              className={'shrink-0 mr-4'}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(true);
              }}
            >
              <PencilIcon size={16} className='text-gray-500 mr-1' />
              <span>Modify</span>
            </Button>
          </div>
        </AccordionTrigger>
        <AccordionContent
          className={
            'p-6 border-t grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          }
        >
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Client Business Name</p>
            <p className='text-sm text-gray-600 wrap-break-word'>
              {commonDetails?.clientName || '-'}
            </p>
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Client Email</p>
            <p className='text-sm text-gray-600 wrap-break-word'>
              {campaignSettings?.clientEmail || '-'}
            </p>
          </LabelInputContainer>
          {/* <LabelInputContainer>
            <p className={cn(labelVariants())}>Objective</p>
            <p className="text-sm text-gray-600 wrap-break-word">
              {campaignSettings?.objective || "-"}
            </p>
          </LabelInputContainer> */}
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Client Campaign Phone No.</p>
            <p className='text-sm text-gray-600 wrap-break-word'>
              {campaignSettings?.campaignPhoneNumber || '-'}
            </p>
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Call Ads Phone No.</p>
            <p className='text-sm text-gray-600 wrap-break-word'>
              {campaignSettings?.callAdsPhoneNumber || '-'}
            </p>
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Industry</p>
            <p className='text-sm text-gray-600 wrap-break-word'>
              {campaignSettings?.industry || '-'}
            </p>
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Sub Industry</p>
            <p className='text-sm text-gray-600 wrap-break-word'>
              {campaignSettings?.subIndustry || '-'}
            </p>
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Radius</p>
            <p className='text-sm text-gray-600 wrap-break-word'>
              {campaignSettings?.radius
                ? `${campaignSettings?.radius} ${campaignSettings?.radiusUnit}`
                : '-'}
            </p>
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Landing Page URL</p>
            {campaignSettings?.landingPageUrl ? (
              <Link
                href={campaignSettings?.landingPageUrl}
                className='text-brand-600 hover:underline'
                target='_blank'
              >
                {campaignSettings?.landingPageUrl}
              </Link>
            ) : (
              <p className='text-sm text-gray-600'>-</p>
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>YouTube URL</p>
            {campaignSettings?.youtubeUrl ? (
              <Link
                href={campaignSettings?.youtubeUrl}
                className='text-brand-600 hover:underline'
                target='_blank'
              >
                {campaignSettings?.youtubeUrl}
              </Link>
            ) : (
              <p className='text-sm text-gray-600'>-</p>
            )}
          </LabelInputContainer>
        </AccordionContent>
      </AccordionItem>
      {isOpen && (
        <CampaignSettingsForm
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          campaignSettings={campaignSettings}
          setShowSuccessDialog={setShowSuccessDialog}
        />
      )}
    </Card>
  );
};

const CampaignSettingsForm = ({
  isOpen,
  setIsOpen,
  campaignSettings,
  setShowSuccessDialog,
}) => {
  const campaignCountryCode = campaignSettings?.campaignPhoneNumber
    ?.split(' ')?.[0]
    ?.replace('+', '');
  const callAdsCountryCode = campaignSettings?.callAdsPhoneNumber
    ?.split(' ')?.[0]
    ?.replace('+', '');

  const initialFormData = {
    radius: campaignSettings?.radius ? String(campaignSettings.radius) : '',
    radiusUnit: campaignSettings?.radiusUnit || 'KM',
    campaignPhoneNumber: campaignSettings?.campaignPhoneNumber || '',
    campaignCountryCode: campaignCountryCode || '91',
    callAdsPhoneNumber: campaignSettings?.callAdsPhoneNumber || '',
    callAdsCountryCode: callAdsCountryCode || '91',
    landingPageUrl: campaignSettings?.landingPageUrl || '',
    youtubeUrl: campaignSettings?.youtubeUrl || '',
  };

  const [formData, setFormData] = useState({ ...initialFormData });
  const [validationErrors, setValidationErrors] = useState({
    radius: '',
    landingPageUrl: '',
    youtubeUrl: '',
    campaignPhoneNumber: '',
    callAdsPhoneNumber: '',
  });

  const { userDetails } = useAuth();
  const { dealer_id } = useParams();

  const { isPending, mutateAsync } = useUpdateCampaignSettings();

  const handleInputChange = (e) => {
    const { name, value, dataset } = e.target;

    // NOTE: Allow numbers with optional decimal
    if (dataset.numericOnly && !/^\d*\.?\d*$/.test(value)) return;

    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleCancel = (value) => {
    if (isPending) return;

    setIsOpen(value);
    setFormData({ ...initialFormData });
    setValidationErrors({
      radius: '',
      landingPageUrl: '',
      youtubeUrl: '',
      campaignPhoneNumber: '',
      callAdsPhoneNumber: '',
    });
  };

  const handleSave = async () => {
    const dirtyFields = getDirtyFields(initialFormData, formData);

    const { success, errors } = await validateDirtyFields(
      campaignSettingsSchema,
      formData,
      dirtyFields
    );

    // Phone fields are validated separately because their validity depends on
    // the selected country code.
    const phoneErrors = await validateCampaignPhones(formData, dirtyFields);

    const allErrors = { ...errors, ...phoneErrors };

    if (!success || Object.keys(phoneErrors).length) {
      setValidationErrors((prevValidationErrors) => ({
        ...prevValidationErrors,
        ...allErrors,
      }));
      toast.error('Invalid form details.');
      return;
    }

    const body = buildCampaignSettingsPayload(formData, dirtyFields);

    if (Object.keys(body).length) {
      const params = {
        clientId: userDetails?.clientId,
      };

      try {
        await mutateAsync({ params, dealerId: dealer_id, body });
        setIsOpen(false);
        setShowSuccessDialog(true);
        return;
      } catch (error) {
        toast.error(error?.data?.message || 'Something went wrong.');
        return;
      }
    }

    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleCancel}>
      <SheetContent
        side={'right'}
        className={'w-[640px] sm:max-w-none flex flex-col p-0 gap-0'}
      >
        <SheetHeader className={'px-6 py-4 border-b'}>
          <SheetTitle
            className={'font-body text-gray-900 text-lg font-semibold'}
          >
            Modify Location Overview
          </SheetTitle>
          <SheetDescription className={'text-sm text-gray-600'}>
            Update details about this location
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto space-y-4 px-6 py-4'>
          <LabelInputContainer>
            <Label htmlFor={'campaign-coverage-raduis'}>
              Campaign Coverage Radius
            </Label>

            <div className='h-10 border border-gray-300 overflow-hidden rounded-md focus-within:ring-1 focus-within:ring-brand-500 focus-within:border-brand-500 bg-white flex items-center'>
              <Input
                id={'campaign-coverage-raduis'}
                placeholder={'Enter radius'}
                name={'radius'}
                value={formData.radius}
                data-numeric-only
                onChange={handleInputChange}
                className={
                  'h-full border-none focus-visible:ring-0 focus-visible:border-none shadow-none'
                }
              />

              <Select
                value={formData.radiusUnit}
                onValueChange={(value) => {
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    radiusUnit: value,
                  }));
                }}
              >
                <SelectTrigger
                  className={
                    'w-[136px] h-full focus-visible:ring-0 focus-visible:border-none border-none shadow-none text-sm font-normal focus:ring-0'
                  }
                >
                  <SelectValue placeholder='Select radius unit' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={'KM'}>Kilometers</SelectItem>

                  <SelectItem value={'MLS'}>Miles</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {validationErrors?.radius && (
              <ErrorMessage message={validationErrors?.radius} />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor={'instagramUrl'}>Landing Page URL</Label>
            <LinkComponent
              htmlFor={'landingPageUrl'}
              placeholder={'https://'}
              value={formData.landingPageUrl}
              onChange={handleInputChange}
            />
            {validationErrors?.landingPageUrl && (
              <ErrorMessage message={validationErrors?.landingPageUrl} />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor={'instagramUrl'}>YouTube URL</Label>
            <LinkComponent
              htmlFor={'youtubeUrl'}
              placeholder={'https://'}
              value={formData.youtubeUrl}
              onChange={handleInputChange}
            />
            {validationErrors?.youtubeUrl && (
              <ErrorMessage message={validationErrors?.youtubeUrl} />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Campaign Phone Number</p>
            <PhoneInput
              defaultCountry='in'
              placeholder='Enter your number'
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
                buttonStyle: {
                  padding: '0px 8px',
                },
              }}
              value={formData.campaignPhoneNumber}
              onChange={(phone, meta) => {
                const localNumber = phone.replace(
                  `+${meta.country.dialCode}`,
                  ''
                );

                setFormData((prevFormData) => ({
                  ...prevFormData,
                  campaignPhoneNumber: localNumber,
                  campaignCountryCode: meta.country.dialCode,
                }));
                setValidationErrors((prevValidationErrors) => ({
                  ...prevValidationErrors,
                  campaignPhoneNumber: '',
                }));
              }}
            />
            {validationErrors?.campaignPhoneNumber && (
              <ErrorMessage message={validationErrors?.campaignPhoneNumber} />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Call Ads Phone Number</p>
            <PhoneInput
              defaultCountry='in'
              placeholder='Enter your number'
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
                buttonStyle: {
                  padding: '0px 8px',
                },
              }}
              value={formData.callAdsPhoneNumber}
              onChange={(phone, meta) => {
                const localNumber = phone.replace(
                  `+${meta.country.dialCode}`,
                  ''
                );

                setFormData((prevFormData) => ({
                  ...prevFormData,
                  callAdsPhoneNumber: localNumber,
                  callAdsCountryCode: meta.country.dialCode,
                }));
                setValidationErrors((prevValidationErrors) => ({
                  ...prevValidationErrors,
                  callAdsPhoneNumber: '',
                }));
              }}
            />
            {validationErrors?.callAdsPhoneNumber && (
              <ErrorMessage message={validationErrors?.callAdsPhoneNumber} />
            )}
          </LabelInputContainer>
        </div>
        <SheetFooter className={'p-5 border-t'}>
          <Button
            disabled={isPending}
            variant={'secondary'}
            onClick={() => handleCancel(false)}
          >
            Cancel
          </Button>
          <Button disabled={isPending} variant={'primary'} onClick={handleSave}>
            {isPending ? (
              <>
                <Loader />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

const LinkComponent = ({
  htmlFor,
  onChange,
  value,
  className,
  placeholder,
  ...props
}) => {
  return (
    <Input
      id={htmlFor}
      placeholder={placeholder}
      name={htmlFor}
      data-no-space
      value={value}
      onChange={onChange}
      {...props}
    />
  );
};
