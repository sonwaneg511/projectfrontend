'use client';

import { PencilIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import { useAuth } from '@/context/auth.context';
import {
  useUpdateFacebookDetails,
  useUpdateLocationOverview,
} from '@/hooks/mutations/locations';
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
import { Checkbox } from '../ui/checkbox';
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
import { Textarea } from '../ui/textarea';
import {
  OPERATION_DAYS,
  STORE_CLOSE_TIMES,
  STORE_OPEN_TIMES,
} from './constant';
import {
  buildFacebookSyncPayload,
  buildLocationOverviewPayload,
  getDirtyFields,
  locationOverviewSchema,
  validateDirtyFields,
} from './location-details.schema';

export const LocationOverview = ({
  locationOverview,
  commonDetails,
  setShowSuccessDialog,
  gmbDetails,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className={'bg-white rounded-lg border'}>
      <AccordionItem value={'location-overview'} className={'border-none'}>
        <AccordionTrigger
          className={'px-6 py-5 text-lg text-gray-900 font-semibold'}
        >
          <div className='flex items-center justify-between w-full gap-3'>
            <p className='text-lg font-semibold text-gray-900 flex-1'>
              Location Overview
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
            'p-6 border-t grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'
          }
        >
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Client Name</p>
            <p className='text-sm text-gray-600 wrap-break-word'>
              {commonDetails?.clientName || '-'}
            </p>
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Client Id</p>
            <p className='text-sm text-gray-600 wrap-break-word'>
              {locationOverview?.clientId || '-'}
            </p>
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Dealer Id</p>
            <p className='text-sm text-gray-600 wrap-break-word'>
              {commonDetails?.dealerId || '-'}
            </p>
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Store Phone</p>
            <p className='text-sm text-gray-600 wrap-break-word'>
              {locationOverview?.storePhoneNumber || '-'}
            </p>
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Address 1</p>
            <p className='text-sm text-gray-600 wrap-break-word'>
              {locationOverview?.address1 || '-'}
            </p>
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Address 2</p>
            <p className='text-sm text-gray-600 wrap-break-word'>
              {locationOverview?.address2 || '-'}
            </p>
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Address 3</p>
            <p className='text-sm text-gray-600 wrap-break-word'>
              {locationOverview?.address3 || '-'}
            </p>
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Area</p>
            <p className='text-sm text-gray-600 wrap-break-word'>
              {locationOverview?.area || '-'}
            </p>
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>City</p>
            <p className='text-sm text-gray-600 wrap-break-word'>
              {locationOverview?.city || '-'}
            </p>
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>State</p>
            <p className='text-sm text-gray-600 wrap-break-word'>
              {locationOverview?.state || '-'}
            </p>
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Pincode</p>
            <p className='text-sm text-gray-600 wrap-break-word'>
              {locationOverview?.pincode || '-'}
            </p>
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Country</p>
            <p className='text-sm text-gray-600 wrap-break-word'>
              {locationOverview?.country || '-'}
            </p>
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Labels</p>
            <p className='text-sm text-gray-600 wrap-break-word'>
              {locationOverview?.labels?.length
                ? locationOverview?.labels?.join(',')
                : '-'}
            </p>
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Latitude</p>
            <p className='text-sm text-gray-600 wrap-break-word'>
              {locationOverview?.latitude || '-'}
            </p>
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Longitude</p>
            <p className='text-sm text-gray-600 wrap-break-word'>
              {locationOverview?.longitude || '-'}
            </p>
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Website URL</p>
            {gmbDetails?.websiteUrl ? (
              <Link
                href={gmbDetails?.websiteUrl}
                className='text-brand-600 hover:underline'
                target='_blank'
              >
                {gmbDetails?.websiteUrl}
              </Link>
            ) : (
              <p className='text-sm text-gray-600'>-</p>
            )}
          </LabelInputContainer>
          <LabelInputContainer className='col-span-full'>
            <p className={cn(labelVariants())}>Hours of Operation</p>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 overflow-hidden rounded-lg border bg-white'>
              {locationOverview?.operationHours?.map(
                ({ day, open, close, isClosed }, idx) => (
                  <div
                    key={`${day}-${idx}`}
                    className='border-b border-r p-3 text-sm last:border-r-0'
                  >
                    <p className='font-medium text-gray-600 capitalize'>
                      {day}
                    </p>

                    <p className='text-gray-500'>
                      {isClosed ? 'Closed' : `${open} - ${close}`}
                    </p>
                  </div>
                )
              )}
            </div>
          </LabelInputContainer>
          <LabelInputContainer className={'col-span-full'}>
            <Label>Description</Label>
            <p className='text-sm text-gray-600 wrap-break-word'>
              {locationOverview?.description || '-'}
            </p>
          </LabelInputContainer>
        </AccordionContent>
      </AccordionItem>
      {isOpen && (
        <LocationOverviewForm
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          locationOverview={locationOverview}
          commonDetails={commonDetails}
          setShowSuccessDialog={setShowSuccessDialog}
        />
      )}
    </Card>
  );
};

const LocationOverviewForm = ({
  isOpen,
  setIsOpen,
  locationOverview,
  commonDetails,
  setShowSuccessDialog,
}) => {
  const phoneNumberCountryCode = locationOverview?.storePhoneNumber
    ?.split(' ')?.[0]
    ?.replace('+', '');
  const additionalPhoneNumberCountryCode =
    locationOverview?.additionalPhoneNumber?.split(' ')?.[0]?.replace('+', '');

  const initialFormData = {
    locationTitle: commonDetails?.dealerName || '',
    address1: locationOverview?.address || locationOverview?.address1 || '',
    address2: locationOverview?.address2 || '',
    address3: locationOverview?.address3 || '',
    area: locationOverview?.area || '',
    city: locationOverview?.city || '',
    state: locationOverview?.state || '',
    pincode: locationOverview?.pincode || '',
    country: locationOverview?.country || '',
    labels: locationOverview?.labels || [], // can be empty
    latitude: locationOverview?.latitude || '',
    longitude: locationOverview?.longitude || '',
    description: locationOverview?.description || '',
    websiteUrl: locationOverview?.websiteUrl || '',
    operationHours: locationOverview?.operationHours || [],
    phoneNumber: locationOverview?.storePhoneNumber || '',
    phoneNumberCountryCode: phoneNumberCountryCode || '91',
    additionalPhoneNumber: locationOverview?.additionalPhoneNumber || '',
    additionalPhoneNumberCountryCode: additionalPhoneNumberCountryCode || '91',
  };

  const [formData, setFormData] = useState({ ...initialFormData });
  const [validationErrors, setValidationErrors] = useState({
    locationTitle: '',
    latitude: '',
    longitude: '',
    websiteUrl: '',
  });
  const [labelInput, setLabelInput] = useState('');

  const { userDetails } = useAuth();
  const { dealer_id } = useParams();

  const {
    isPending: isFacebookDetailsUpdating,
    mutateAsync: updateFacebookDetails,
  } = useUpdateFacebookDetails();
  const {
    isPending: isLocationOverviewUpdating,
    mutateAsync: updateLocationOverview,
  } = useUpdateLocationOverview();

  const isPending = isFacebookDetailsUpdating || isLocationOverviewUpdating;

  const handleInputChange = (e) => {
    const { value, name } = e.target;

    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    setValidationErrors((prevValidationErrors) => ({
      ...prevValidationErrors,
      [name]: '',
    }));
  };

  const handleCancel = (value) => {
    if (isPending) return;

    setIsOpen(value);
    setFormData({ ...initialFormData });
    setValidationErrors({
      locationTitle: '',
      latitude: '',
      longitude: '',
      websiteUrl: '',
    });
  };

  const handleSave = async () => {
    const dirtyFields = getDirtyFields(initialFormData, formData);

    const { success, errors } = await validateDirtyFields(
      locationOverviewSchema,
      formData,
      dirtyFields
    );

    if (!success) {
      setValidationErrors((prevValidationErrors) => ({
        ...prevValidationErrors,
        ...errors,
      }));
      toast.error('Invalid form details.');
      return;
    }

    // Location Overview's own update payload (dirty fields only).
    const locationOverviewBody = buildLocationOverviewPayload(
      formData,
      dirtyFields
    );
    const hasLocationOverviewChanges =
      !!Object.keys(locationOverviewBody).length;

    // Separate Facebook update payload synced from the shared geo/address
    // fields — built only from dirty Location Overview fields.
    const facebookBody = buildFacebookSyncPayload(formData, dirtyFields);
    const hasFacebookChanges = !!Object.keys(facebookBody).length;

    const params = { clientId: userDetails?.clientId };

    try {
      if (hasLocationOverviewChanges && hasFacebookChanges) {
        await Promise.all([
          updateLocationOverview({
            params,
            body: locationOverviewBody,
            dealerId: dealer_id,
          }),
          updateFacebookDetails({
            params,
            body: facebookBody,
            dealerId: dealer_id,
          }),
        ]);
        setShowSuccessDialog(true);
      } else if (hasLocationOverviewChanges) {
        await updateLocationOverview({
          params,
          body: locationOverviewBody,
          dealerId: dealer_id,
        });
        setShowSuccessDialog(true);
      } else if (hasFacebookChanges) {
        await updateFacebookDetails({
          params,
          body: facebookBody,
          dealerId: dealer_id,
        });
        setShowSuccessDialog(true);
      }

      setIsOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || 'Something went wrong.');
    }
  };

  const handleAddLabel = (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();

    const trimmedValue = labelInput.trim();

    if (!trimmedValue) return;

    const alreadyExists = formData.labels.some(
      (label) => label.toLowerCase() === trimmedValue.toLowerCase()
    );

    if (alreadyExists) {
      toast.warning('Label already exist.');
      return;
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      labels: [...prevFormData.labels, labelInput],
    }));
    setLabelInput('');
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
            <Label htmlFor={'locationTitle'}>Location Name</Label>
            <Input
              id={'locationTitle'}
              name={'locationTitle'}
              placeholder={'Enter location name'}
              value={formData.locationTitle}
              onChange={handleInputChange}
            />
            {validationErrors.locationTitle && (
              <ErrorMessage message={validationErrors.locationTitle} />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor={'address-1'}>Address 1</Label>
            <Input
              id={'address-1'}
              name={'address1'}
              placeholder={'Enter address details'}
              value={formData.address1}
              onChange={handleInputChange}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor={'address-2'}>Address 2</Label>
            <Input
              id={'address-2'}
              name={'address2'}
              placeholder={'Enter address details'}
              value={formData.address2}
              onChange={handleInputChange}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor={'address-3'}>Address 3</Label>
            <Input
              id={'address-3'}
              name={'address3'}
              placeholder={'Enter address details'}
              value={formData.address3}
              onChange={handleInputChange}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor={'area'}>Area</Label>
            <Input
              id={'area'}
              name={'area'}
              placeholder={'Enter area'}
              value={formData.area}
              onChange={handleInputChange}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor={'city'}>City</Label>
            <Input
              id={'city'}
              name={'city'}
              placeholder={'Enter city'}
              value={formData.city}
              onChange={handleInputChange}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor={'state'}>State</Label>
            <Input
              id={'state'}
              name={'state'}
              placeholder={'Enter state'}
              value={formData.state}
              onChange={handleInputChange}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor={'pincode'}>Pincode</Label>
            <Input
              id={'pincode'}
              name={'pincode'}
              placeholder={'Enter pincode'}
              value={formData.pincode}
              onChange={handleInputChange}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor={'conutry'}>Country</Label>
            <Input
              id={'country'}
              name={'country'}
              placeholder={'Enter country'}
              value={formData.country}
              onChange={handleInputChange}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor={'label'}>Labels</Label>
            {!!formData.labels.length && (
              <div className='flex flex-wrap gap-3'>
                {formData.labels.map((label, idx) => {
                  const handleRemoveLabel = () => {
                    const filteredLabels = formData.labels.filter(
                      (value) => value !== label
                    );
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      labels: filteredLabels,
                    }));
                  };

                  return (
                    <div
                      key={`${label}-${idx}`}
                      className='bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1 hover:bg-gray-200 transition-colors cursor-pointer'
                      onClick={handleRemoveLabel}
                    >
                      <span className='text-gray-800 text-xs'>{label}</span>
                      <button className='text-gray-500'>
                        <XIcon size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <Input
              id={'label'}
              name={'label'}
              placeholder={'Enter label & press enter'}
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
              onKeyDown={handleAddLabel}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor={'latitude'}>Latitude</Label>
            <Input
              id={'latitude'}
              name={'latitude'}
              placeholder={'Enter latitude'}
              value={formData.latitude}
              onChange={handleInputChange}
            />
            {validationErrors.latitude && (
              <ErrorMessage message={validationErrors.latitude} />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor={'longitude'}>Longitude</Label>
            <Input
              id={'longitude'}
              name={'longitude'}
              placeholder={'Enter longitude'}
              value={formData.longitude}
              onChange={handleInputChange}
            />
            {validationErrors.longitude && (
              <ErrorMessage message={validationErrors.longitude} />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor={'websiteUrl'}>Website URL</Label>
            <Input
              id={'websiteUrl'}
              name={'websiteUrl'}
              placeholder={'Enter website url'}
              value={formData.websiteUrl}
              onChange={handleInputChange}
            />
            {validationErrors.websiteUrl && (
              <ErrorMessage message={validationErrors.websiteUrl} />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Phone Number</p>
            <PhoneInput
              defaultCountry='in'
              placeholder='Enter phone number'
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
              value={formData.phoneNumber}
              onChange={(phone, meta) => {
                const localNumber = phone.replace(
                  `+${meta.country.dialCode}`,
                  ''
                );

                setFormData((prevFormData) => ({
                  ...prevFormData,
                  phoneNumber: localNumber,
                  phoneNumberCountryCode: meta.country.dialCode,
                }));
              }}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Additional Phone Number</p>
            <PhoneInput
              defaultCountry='in'
              placeholder='Enter additional phone number'
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
              value={formData.additionalPhoneNumber}
              onChange={(phone, meta) => {
                const localNumber = phone.replace(
                  `+${meta.country.dialCode}`,
                  ''
                );

                setFormData((prevFormData) => ({
                  ...prevFormData,
                  additionalPhoneNumber: localNumber,
                  additionalPhoneNumberCountryCode: meta.country.dialCode,
                }));
              }}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor={'description'}>Description</Label>
            <Textarea
              id={'description'}
              name={'description'}
              placeholder={'Enter description'}
              value={formData.description}
              onChange={handleInputChange}
              className={'min-h-24'}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Hours of Operations</p>
            <div className='space-y-2'>
              {OPERATION_DAYS.map((day) => {
                const currentDay = formData?.operationHours?.find(
                  (operationHour) => operationHour.day === day
                );
                const isClosed = currentDay?.isClosed;

                const handleStoreTimeChange = (time, shift) => {
                  const updatedOperationHours = formData.operationHours.map(
                    (operationHour) =>
                      operationHour.day === day
                        ? shift === 'open'
                          ? { ...operationHour, open: time }
                          : { ...operationHour, close: time }
                        : operationHour
                  );

                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    operationHours: updatedOperationHours,
                  }));
                };

                const handleStoreToggle = (e) => {
                  if (!e.target.checked) {
                    const updatedOperationHours = formData.operationHours.map(
                      (operationHour) =>
                        operationHour.day === day
                          ? { ...operationHour, isClosed: true }
                          : operationHour
                    );
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      operationHours: updatedOperationHours,
                    }));
                  } else {
                    const updatedOperationHours = formData.operationHours.map(
                      (operationHour) =>
                        operationHour.day === day
                          ? {
                              ...operationHour,
                              isClosed: false,
                              open: '09:00',
                              close: '18:00',
                            }
                          : operationHour
                    );
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      operationHours: updatedOperationHours,
                    }));
                  }
                };

                return (
                  <div
                    key={day}
                    className='grid grid-cols-[20px_96px_1fr_1fr] gap-3 items-center'
                  >
                    <Checkbox
                      checked={!isClosed}
                      onChange={handleStoreToggle}
                    />
                    <p className='text-sm text-gray-600'>{day}</p>
                    <Select
                      disabled={isClosed}
                      value={currentDay?.open}
                      onValueChange={(time) =>
                        handleStoreTimeChange(time, 'open')
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={'Open'} />
                      </SelectTrigger>
                      <SelectContent>
                        {STORE_OPEN_TIMES.map((openTime) => {
                          return (
                            <SelectItem key={openTime} value={openTime}>
                              {openTime}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <Select
                      disabled={isClosed}
                      value={currentDay?.close}
                      onValueChange={(time) =>
                        handleStoreTimeChange(time, 'close')
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={'Close'} />
                      </SelectTrigger>
                      <SelectContent>
                        {STORE_CLOSE_TIMES.map((closeTime) => {
                          return (
                            <SelectItem key={closeTime} value={closeTime}>
                              {closeTime}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
            </div>
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
