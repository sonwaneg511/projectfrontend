'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { PencilIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { MetaIcon } from '@/assets/icons/meta';
import { PlatformConnectionGate } from '@/components/common/PlatformConnectionGate';
import { useAuth } from '@/context/auth.context';
import {
  useUpdateFacebookDetails,
  useUploadLocationImage,
} from '@/hooks/mutations/locations';
import { useGetLocationCategories } from '@/hooks/queries/locations';
import { useObjectUrl } from '@/hooks/useObjectUrl';
import { cn, validateImageFile } from '@/lib/utils';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ErrorMessage } from '../ui/error-message';
import { FieldSkeleton } from '../ui/field-skeleton';
import { Input } from '../ui/input';
import { Label, LabelInputContainer, labelVariants } from '../ui/label';
import { Loader } from '../ui/loader';
import { MultiSelect } from '../ui/multi-select';
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
  ImageUploader,
  ImageUploaderHeader,
  ImageUploaderInput,
  ImageUploaderLabel,
  ImageUploaderLocations,
} from './common';
import {
  allowedTypes,
  COVER_IMAGE_DIMS,
  getImageValidationError,
  LOCATION_IMG_CATEGORIES,
  LOCATION_IMG_PLATOFORMS,
  LOGO_PROFILE_DIMS,
} from './constant';
import {
  buildFacebookDetailsPayload,
  facebookDetailsSchema,
  getDirtyFields,
  validateDirtyFields,
} from './location-details.schema';

export const FacebookDetails = ({
  facebookDetails,
  commonDetails,
  setShowSuccessDialog,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [profilePicLocations, setProfilePicLocations] = useState([
    commonDetails?.dealerId,
  ]);
  const [coverImgLocations, setCoverImgLocations] = useState([
    commonDetails?.dealerId,
  ]);

  const searchParams = useSearchParams();
  const hasDevFlag = searchParams.has('dev');

  const { userDetails } = useAuth();

  const { isPending, mutateAsync } = useUploadLocationImage();

  const isProfileUpdating = profilePicture && isPending;
  const isCoverImageUpdating = coverImage && isPending;

  const profilePictureLocalPreviewUrl = useObjectUrl(profilePicture);
  const profilePicturePreviewUrl =
    profilePictureLocalPreviewUrl || facebookDetails?.profilePicture?.url;

  const coverImgLocalPreviewUrl = useObjectUrl(coverImage);
  const coverImagePreviewUrl =
    coverImgLocalPreviewUrl || facebookDetails?.coverImage?.url;

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG and PNG files are allowed.');
      return;
    }

    try {
      await validateImageFile(file, LOGO_PROFILE_DIMS);
      setProfilePicture(file);
    } catch ({ errorType }) {
      toast.error(getImageValidationError(errorType, LOGO_PROFILE_DIMS));
    }
  };

  const handleDeleteProfilePicture = () => {
    if (profilePicture) {
      setProfilePicture(null);
      setProfilePicLocations([commonDetails?.dealerId]);
    } else {
      console.log('hit delete API');
    }
  };

  const handleCoverImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG and PNG files are allowed.');
      return;
    }

    try {
      await validateImageFile(file, COVER_IMAGE_DIMS);
      setCoverImage(file);
    } catch ({ errorType }) {
      toast.error(getImageValidationError(errorType, COVER_IMAGE_DIMS));
    }
  };

  const handleCoverIamgeDelete = () => {
    if (coverImage) {
      setCoverImage(null);
      setCoverImgLocations([commonDetails?.dealerId]);
    } else {
      console.log('hit delete API');
    }
  };

  const handleProfileImgSave = async () => {
    const formData = new FormData();

    const payload = {
      dealer_id: profilePicLocations,
      client_id: userDetails?.clientId,
      image_category: LOCATION_IMG_CATEGORIES.profile,
      platform: LOCATION_IMG_PLATOFORMS.facebook,
      image_format: 'photo',
    };

    formData.append(
      'data',
      new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      })
    );

    formData.append('file', profilePicture);

    try {
      await mutateAsync(formData);
      setProfilePicture(null);
      setProfilePicLocations([commonDetails?.dealerId]);

      toast.success('Profile picture updated successfully.');
    } catch (error) {
      console.error('error', error);
      toast.error(error?.data?.message ?? 'Something went wrong.');
    }
  };

  const handleCoverImgSave = async () => {
    const formData = new FormData();

    const payload = {
      dealer_id: profilePicLocations,
      client_id: userDetails?.clientId,
      image_category: LOCATION_IMG_CATEGORIES.cover,
      platform: LOCATION_IMG_PLATOFORMS.facebook,
      image_format: 'photo',
    };

    formData.append(
      'data',
      new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      })
    );

    formData.append('file', profilePicture);

    try {
      await mutateAsync(formData);
      setCoverImage(null);
      setCoverImgLocations([commonDetails?.dealerId]);

      toast.success('Cover image updated successfully.');
    } catch (error) {
      console.error('error', error);
      toast.error(error?.data?.message ?? 'Something went wrong.');
    }
  };

  return (
    <PlatformConnectionGate platform='FACEBOOK' sectionName='Facebook details'>
      <Card className={'bg-white rounded-lg border'}>
        <AccordionItem value={'facebook-details'} className={'border-none'}>
          <AccordionTrigger
            className={'px-6 py-5 text-lg text-gray-900 font-semibold'}
          >
            <div className='flex items-center justify-between w-full gap-3'>
              <div className='flex items-center gap-2'>
                <MetaIcon />
                <p className='text-lg font-semibold text-gray-900 flex-1'>
                  Facebook Details
                </p>
              </div>
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
            <div className='col-span-full'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-start'>
                <ImageUploader>
                  <LabelInputContainer>
                    <ImageUploaderHeader>
                      <ImageUploaderLabel>Profie Picture</ImageUploaderLabel>
                    </ImageUploaderHeader>
                    {profilePicturePreviewUrl ? (
                      <div className='border overflow-hidden border-[rgba(213,215,218,1)] rounded-md flex items-center justify-center p-4 h-32'>
                        <div className='flex items-center gap-4'>
                          <div className='size-28 rounded-md overflow-hidden border border-border'>
                            <Image
                              priority
                              quality={100}
                              src={profilePicturePreviewUrl}
                              alt='profile-image'
                              width={32}
                              height={32}
                              className='size-full object-cover'
                            />
                          </div>
                          <div className='flex items-center flex-col gap-3'>
                            {isProfileUpdating ? (
                              <Button
                                variant={'outline'}
                                size={'sm'}
                                className={'min-w-24'}
                                disabled={isProfileUpdating}
                              >
                                Change
                              </Button>
                            ) : (
                              <Label
                                className={
                                  'cursor-pointer relative overflow-hidden'
                                }
                              >
                                <Button
                                  variant={'outline'}
                                  size={'sm'}
                                  className={'min-w-24'}
                                >
                                  Change
                                </Button>
                                <Input
                                  type={'file'}
                                  accept='image/png, image/jpg'
                                  className={'opacity-0 absolute inset-0 h-8'}
                                  onChange={(e) => {
                                    handleProfilePictureChange(e);
                                    e.target.value = null;
                                  }}
                                  disabled={isProfileUpdating}
                                />
                              </Label>
                            )}

                            {(hasDevFlag || profilePictureLocalPreviewUrl) && (
                              <Button
                                variant={'destructive'}
                                size={'sm'}
                                className={'min-w-24'}
                                disabled={isProfileUpdating}
                                onClick={handleDeleteProfilePicture}
                              >
                                {profilePictureLocalPreviewUrl
                                  ? 'Remove'
                                  : 'Delete'}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <ImageUploaderInput
                        handleInputChange={handleProfilePictureChange}
                      />
                    )}
                    {profilePicture && (
                      <>
                        <ImageUploaderLocations
                          isUploading={isProfileUpdating}
                          value={profilePicLocations}
                          onValueChange={setProfilePicLocations}
                          platform={'FB'}
                          dealerId={commonDetails?.dealerId}
                        />
                        <div className='h-px bg-border my-4' />
                        <div className='flex items-center justify-end gap-4 mt-6'>
                          <Button
                            variant={'outline'}
                            disabled={isProfileUpdating}
                            onClick={() => {
                              setProfilePicture(null);
                              setProfilePicLocations([commonDetails?.dealerId]);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant={'primary'}
                            disabled={isProfileUpdating}
                            onClick={handleProfileImgSave}
                          >
                            {isProfileUpdating && <Loader />}
                            {isProfileUpdating ? 'Saving...' : 'Save'}
                          </Button>
                        </div>
                      </>
                    )}
                  </LabelInputContainer>
                </ImageUploader>
                <ImageUploader>
                  <LabelInputContainer>
                    <ImageUploaderHeader>
                      <ImageUploaderLabel>Cover Image</ImageUploaderLabel>
                    </ImageUploaderHeader>
                    {coverImagePreviewUrl ? (
                      <div className='border overflow-hidden border-[rgba(213,215,218,1)] rounded-md flex items-center justify-center p-4 h-32'>
                        <div className='flex items-center  gap-4'>
                          <div className='size-28 rounded-md overflow-hidden border border-border'>
                            <Image
                              src={coverImagePreviewUrl}
                              alt='profile-image'
                              width={32}
                              height={32}
                              className='size-full object-cover'
                            />
                          </div>
                          <div className='flex items-center flex-col gap-3'>
                            {isCoverImageUpdating ? (
                              <Button
                                variant={'outline'}
                                size={'sm'}
                                className={'min-w-24'}
                                disabled={isCoverImageUpdating}
                              >
                                Change
                              </Button>
                            ) : (
                              <Label
                                className={
                                  'cursor-pointer relative overflow-hidden'
                                }
                              >
                                <Button
                                  variant={'outline'}
                                  size={'sm'}
                                  className={'min-w-24'}
                                >
                                  Change
                                </Button>
                                <Input
                                  type={'file'}
                                  accept='image/png, image/jpg'
                                  className={'opacity-0 absolute inset-0 h-8'}
                                  onChange={(e) => {
                                    handleCoverImageChange(e);
                                    e.target.value = null;
                                  }}
                                  disabled={isCoverImageUpdating}
                                />
                              </Label>
                            )}

                            {(hasDevFlag || coverImgLocalPreviewUrl) && (
                              <Button
                                variant={'destructive'}
                                size={'sm'}
                                className={'min-w-24'}
                                onClick={handleCoverIamgeDelete}
                                disabled={isCoverImageUpdating}
                              >
                                {coverImgLocalPreviewUrl ? 'Remove' : 'Delete'}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <ImageUploaderInput
                        handleInputChange={handleCoverImageChange}
                      />
                    )}
                    {coverImage && (
                      <>
                        <ImageUploaderLocations
                          isUploading={isCoverImageUpdating}
                          value={coverImgLocations}
                          onValueChange={setCoverImgLocations}
                          dealerId={commonDetails?.dealerId}
                          platform={'FB'}
                        />
                        <div className='h-px bg-border my-4' />
                        <div className='flex items-center justify-end gap-4 mt-6'>
                          <Button
                            variant={'outline'}
                            disabled={isCoverImageUpdating}
                            onClick={() => {
                              setCoverImage(null);
                              setCoverImgLocations([commonDetails?.dealerId]);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant={'primary'}
                            disabled={isCoverImageUpdating}
                            onClick={handleCoverImgSave}
                          >
                            {isCoverImageUpdating && <Loader />}
                            {isCoverImageUpdating ? 'Saving...' : 'Save'}
                          </Button>
                        </div>
                      </>
                    )}
                  </LabelInputContainer>
                </ImageUploader>
              </div>
            </div>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>Business Name</p>
              <p className='text-sm text-gray-600 wrap-break-word'>
                {facebookDetails?.businessName || '-'}
              </p>
            </LabelInputContainer>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>Parent Page Id</p>
              <p className='text-sm text-gray-600 wrap-break-word'>
                {facebookDetails?.parentPageId || '-'}
              </p>
            </LabelInputContainer>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>FB Location Id</p>
              <p className='text-sm text-gray-600 wrap-break-word'>
                {facebookDetails?.fbLocationId || '-'}
              </p>
            </LabelInputContainer>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>Primary Category</p>
              <p className='text-sm text-gray-600 wrap-break-word'>
                {facebookDetails?.primaryCategory || '-'}
              </p>
            </LabelInputContainer>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>Secondary Category</p>
              <p className='text-sm text-gray-600 wrap-break-word'>
                {facebookDetails?.secondaryCategory || '-'}
              </p>
            </LabelInputContainer>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>Page Publish Status</p>
              <p className='text-sm text-gray-600 wrap-break-word'>
                {facebookDetails?.pagePublishStatus || '-'}
              </p>
            </LabelInputContainer>
            <LabelInputContainer className={'col-span-full'}>
              <p className={cn(labelVariants())}>FB website URL</p>
              {facebookDetails?.fbWebsiteUrl ? (
                <Link
                  href={facebookDetails?.fbWebsiteUrl}
                  className='text-brand-600 hover:underline'
                  target='_blank'
                >
                  {facebookDetails?.fbWebsiteUrl}
                </Link>
              ) : (
                <p className='text-sm text-gray-600'>-</p>
              )}
            </LabelInputContainer>
            <LabelInputContainer className={'col-span-full'}>
              <p className={cn(labelVariants())}>Facebook Page URL</p>
              {facebookDetails?.facebookPageUrl ? (
                <Link
                  href={facebookDetails?.facebookPageUrl}
                  className='text-brand-600 hover:underline'
                  target='_blank'
                >
                  {facebookDetails?.facebookPageUrl}
                </Link>
              ) : (
                <p className='text-sm text-gray-600'>-</p>
              )}
            </LabelInputContainer>
          </AccordionContent>
        </AccordionItem>
        {isOpen && (
          <FacebookDetailsForm
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            facebookDetails={facebookDetails}
            commonDetails={commonDetails}
            setShowSuccessDialog={setShowSuccessDialog}
          />
        )}
      </Card>
    </PlatformConnectionGate>
  );
};

const FacebookDetailsForm = ({
  isOpen,
  setIsOpen,
  facebookDetails,
  setShowSuccessDialog,
}) => {
  const { data: categories, isLoading: isCategoriesLoading } =
    useGetLocationCategories({ source: 'FB' });

  const categoryOptions = (categories ?? []).map((category) => ({
    label: category.display_name,
    value: String(category.id),
  }));

  const initialFormData = {
    businessName: facebookDetails?.businessName || '',
    fbPrimaryCategory: facebookDetails?.primaryCategory || '',
    fbAdditionalCategories: facebookDetails?.fbAdditionalCategories || [],
  };

  const [formData, setFormData] = useState({ ...initialFormData });
  const [validationErrors, setValidationErrors] = useState({
    businessName: '',
  });

  const { userDetails } = useAuth();
  const { dealer_id } = useParams();

  const { isPending, mutateAsync } = useUpdateFacebookDetails();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

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
    setValidationErrors({ businessName: '' });
  };

  const handleSave = async () => {
    const dirtyFields = getDirtyFields(initialFormData, formData);

    const { success, errors } = await validateDirtyFields(
      facebookDetailsSchema,
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

    const body = buildFacebookDetailsPayload(formData, dirtyFields);

    if (Object.keys(body).length) {
      try {
        const params = {
          clientId: userDetails?.clientId,
        };

        await mutateAsync({ params, body, dealerId: dealer_id });
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
            Modify Facebook Details
          </SheetTitle>
          <VisuallyHidden>
            <SheetDescription className={'text-sm text-gray-600'}>
              No description
            </SheetDescription>
          </VisuallyHidden>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto space-y-4 px-6 py-4'>
          <LabelInputContainer>
            <Label htmlFor={'businessName'}>Business Name</Label>
            <Input
              id={'businessName'}
              name={'businessName'}
              placeholder={'Enter business name'}
              value={formData.businessName}
              data-required
              onChange={handleInputChange}
            />
            {validationErrors.businessName && (
              <ErrorMessage message={"Business name can't be empty."} />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Primary Category</p>
            {isCategoriesLoading ? (
              <FieldSkeleton />
            ) : (
              <Select
                value={formData.fbPrimaryCategory}
                onValueChange={(value) =>
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    fbPrimaryCategory: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select Primary Category' />
                </SelectTrigger>
                <SelectContent align={'start'}>
                  {categoryOptions.length ? (
                    categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))
                  ) : (
                    <p className='px-2 py-1.5 text-sm text-gray-500'>
                      No data found
                    </p>
                  )}
                </SelectContent>
              </Select>
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Additional Categories</p>
            {isCategoriesLoading ? (
              <FieldSkeleton />
            ) : (
              <MultiSelect
                options={categoryOptions}
                value={formData.fbAdditionalCategories}
                selectLabel='categories'
                placeholder='Select additional categories'
                onChange={(newAdditionalCategories) =>
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    fbAdditionalCategories: newAdditionalCategories,
                  }))
                }
              />
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
