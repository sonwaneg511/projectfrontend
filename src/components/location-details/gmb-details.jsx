'use client';

import { GoogleIcon } from '@/assets/icons/google';
import { BlobImage } from '@/components/common/BlobImage';
import { PlatformConnectionGate } from '@/components/common/PlatformConnectionGate';
import { useAuth } from '@/context/auth.context';
import {
  useUpdateGmbDetails,
  useUploadLocationImage,
} from '@/hooks/mutations/locations';
import { useGetLocationCategories } from '@/hooks/queries/locations';
import { useObjectUrl } from '@/hooks/useObjectUrl';
import { cn, validateImageFile } from '@/lib/utils';
import { CheckIcon, PencilIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import 'react-international-phone/style.css';
import { toast } from 'sonner';
import { v4 as uuid } from 'uuid';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselNavigation,
} from '../ui/carousel';
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
  MAX_MULTI_IMAGE_UPLOAD,
  SQUARE_IMAGE_DIMS,
} from './constant';
import {
  buildGmbDetailsPayload,
  getDirtyFields,
  gmbDetailsSchema,
  validateDirtyFields,
} from './location-details.schema';

export const GmbDetails = ({
  gmbDetails,
  commonDetails,
  setShowSuccessDialog,
  mediaDetails,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [logo, setLogo] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [locations, setLocations] = useState([commonDetails?.dealerId]);
  const [coverImgLocations, setCoverImgLocations] = useState([
    commonDetails?.dealerId,
  ]);
  const [interiorImages, setInteriorImages] = useState([]);
  const [exteriorImages, setExteriorImages] = useState([]);
  const [imgGallery, setImgGallery] = useState([]);

  const { userDetails } = useAuth();

  const searchParams = useSearchParams();
  const hasDevFlag = searchParams.has('dev');

  const { isPending, mutateAsync } = useUploadLocationImage();

  const isLogoUpdating = logo && isPending;
  const isCoverImageUpdating = coverImage && isPending;
  const isInteriorImgUpading = interiorImages.length && isPending;
  const isExteriorImgUploading = exteriorImages.length && isPending;
  const isImgGalleryUpdating = imgGallery.length && isPending;

  const logoLocalPreviewUrl = useObjectUrl(logo);
  const logoImgPreviewUrl =
    logoLocalPreviewUrl || mediaDetails?.GMB_PROFILE?.url;
  const uploadedLogoImg = mediaDetails?.GMB_PROFILE;

  const coverImgLocalPreviewUrl = useObjectUrl(coverImage);
  const coverImagePreviewUrl =
    coverImgLocalPreviewUrl || mediaDetails?.GMB_COVER?.url;
  const uploadedCoverImg = mediaDetails?.GMB_COVER;

  const handleSingleImageChange = async (e, category) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG and PNG files are allowed.');
      return;
    }

    const dims =
      category === LOCATION_IMG_CATEGORIES.cover
        ? COVER_IMAGE_DIMS
        : LOGO_PROFILE_DIMS;

    try {
      await validateImageFile(file, dims);
      switch (category) {
        case LOCATION_IMG_CATEGORIES.logo: {
          setLogo(file);
          break;
        }
        case LOCATION_IMG_CATEGORIES.cover: {
          setCoverImage(file);
          break;
        }
      }
    } catch ({ errorType }) {
      toast.error(getImageValidationError(errorType, dims));
    }
  };

  const handleSingleImgUpload = async (category) => {
    const formData = new FormData();

    const payload = {
      dealer_id: locations,
      client_id: userDetails?.clientId,
      platform: LOCATION_IMG_PLATOFORMS.gmb,
      image_format: 'photo',
    };

    switch (category) {
      case LOCATION_IMG_CATEGORIES.logo: {
        payload.image_category = LOCATION_IMG_CATEGORIES.logo;
        formData.append('file', logo);
        break;
      }

      case LOCATION_IMG_CATEGORIES.cover: {
        payload.image_category = LOCATION_IMG_CATEGORIES.cover;
        formData.append('file', coverImage);
        break;
      }
    }

    formData.append(
      'data',
      new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      })
    );

    try {
      await mutateAsync(formData);

      switch (category) {
        case LOCATION_IMG_CATEGORIES.logo: {
          setLogo(null);
          setLocations([commonDetails?.dealerId]);
          toast.success('Logo updated successfully.');
          break;
        }

        case LOCATION_IMG_CATEGORIES.cover: {
          setCoverImage(null);
          setCoverImgLocations([commonDetails?.dealerId]);
          toast.success('Cover image updated successfully.');
          break;
        }
      }
    } catch (error) {
      console.error('error', error);
      toast.error(error?.data?.message || 'Something went wrong.');
    }
  };

  const handleDeleteLogo = () => {
    if (logo) {
      setLogo(null);
      setLocations([commonDetails?.dealerId]);
    } else {
      console.log('hit delete API');
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

  const handleMultipleImageChange = async (e, category) => {
    const files = Array.from(e.target.files ?? []);

    if (!files.length) return;

    const existingImages =
      category === LOCATION_IMG_CATEGORIES.interior
        ? interiorImages
        : category === LOCATION_IMG_CATEGORIES.exterior
          ? exteriorImages
          : imgGallery;

    const remainingSlots = MAX_MULTI_IMAGE_UPLOAD - existingImages.length;

    if (remainingSlots <= 0) {
      toast.error(
        `You can upload up to ${MAX_MULTI_IMAGE_UPLOAD} images at a time.`
      );
      return;
    }

    const typedFiles = files.filter((f) => allowedTypes.includes(f.type));
    const typeInvalidCount = files.length - typedFiles.length;

    if (typeInvalidCount > 0) {
      toast.error(
        typeInvalidCount > 1
          ? `${typeInvalidCount} files were skipped. Only JPG and PNG files are supported.`
          : 'Only JPG and PNG files are supported.'
      );
    }

    const results = await Promise.allSettled(
      typedFiles.map((file) => validateImageFile(file, SQUARE_IMAGE_DIMS))
    );

    const validFiles = typedFiles
      .filter((_, i) => results[i].status === 'fulfilled')
      .map((file) => ({ id: uuid(), file }));

    const rejectedTypes = results
      .filter((r) => r.status === 'rejected')
      .map((r) => r.reason?.errorType);

    const sizeErrors = rejectedTypes.filter(
      (t) => t === 'FILE_TOO_SMALL' || t === 'FILE_TOO_LARGE'
    ).length;
    const resolutionErrors = rejectedTypes.filter(
      (t) => t === 'RESOLUTION_TOO_SMALL' || t === 'RESOLUTION_TOO_LARGE'
    ).length;

    if (sizeErrors > 0) {
      toast.error(
        `${sizeErrors === 1 ? 'Image' : `${sizeErrors} images`} must be between 10KB and 5MB.`
      );
    }
    if (resolutionErrors > 0) {
      toast.error(
        `${resolutionErrors === 1 ? 'Image' : `${resolutionErrors} images`} must be between ${SQUARE_IMAGE_DIMS.minWidth}×${SQUARE_IMAGE_DIMS.minHeight}px and ${SQUARE_IMAGE_DIMS.maxWidth}×${SQUARE_IMAGE_DIMS.maxHeight}px.`
      );
    }

    if (!validFiles.length) return;

    const allowedFiles = validFiles.slice(0, remainingSlots);

    if (validFiles.length > remainingSlots) {
      toast.error(
        `You can upload up to ${MAX_MULTI_IMAGE_UPLOAD} images at a time. Only ${remainingSlots} ${remainingSlots === 1 ? 'image was' : 'images were'} added.`
      );
    }

    switch (category) {
      case LOCATION_IMG_CATEGORIES.interior: {
        setInteriorImages((prevImages) => [...prevImages, ...allowedFiles]);
        break;
      }
      case LOCATION_IMG_CATEGORIES.exterior: {
        setExteriorImages((prevImages) => [...prevImages, ...allowedFiles]);
        break;
      }
      case LOCATION_IMG_CATEGORIES.categoryUnspecified: {
        setImgGallery((prevImages) => [...prevImages, ...allowedFiles]);
      }
    }
  };

  const handleMultipleImgUpload = async (category) => {
    const imagesToUpload =
      category === LOCATION_IMG_CATEGORIES.interior
        ? interiorImages
        : category === LOCATION_IMG_CATEGORIES.exterior
          ? exteriorImages
          : imgGallery;

    if (imagesToUpload.length > MAX_MULTI_IMAGE_UPLOAD) {
      toast.error(
        `You can upload up to ${MAX_MULTI_IMAGE_UPLOAD} images at a time.`
      );
      return;
    }

    const formData = new FormData();

    const payload = {
      dealer_id: [commonDetails?.dealerId],
      client_id: userDetails?.clientId,
      platform: LOCATION_IMG_PLATOFORMS.gmb,
      image_format: 'photo',
    };

    switch (category) {
      case LOCATION_IMG_CATEGORIES.interior: {
        for (let i = 0; i < interiorImages.length; i++) {
          formData.append('file', interiorImages[i].file);
        }
        payload.image_category = LOCATION_IMG_CATEGORIES.interior;

        break;
      }

      case LOCATION_IMG_CATEGORIES.exterior: {
        for (let i = 0; i < exteriorImages.length; i++) {
          formData.append('file', exteriorImages[i].file);
        }
        payload.image_category = LOCATION_IMG_CATEGORIES.exterior;

        break;
      }

      case LOCATION_IMG_CATEGORIES.categoryUnspecified: {
        for (let i = 0; i < imgGallery.length; i++) {
          formData.append('file', imgGallery[i].file);
        }
        payload.image_category = LOCATION_IMG_CATEGORIES.categoryUnspecified;

        break;
      }
    }

    formData.append(
      'data',
      new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      })
    );

    try {
      await mutateAsync(formData);

      switch (category) {
        case LOCATION_IMG_CATEGORIES.interior: {
          setInteriorImages([]);
          toast.success('Interior images uploaded successfully.');
          break;
        }

        case LOCATION_IMG_CATEGORIES.exterior: {
          setExteriorImages([]);
          toast.success('Exterior images uploaded successfully.');
          break;
        }

        case LOCATION_IMG_CATEGORIES.categoryUnspecified: {
          setImgGallery([]);
          toast.success('Images uploaded successfully.');
          break;
        }
      }
    } catch (error) {
      console.error('error', error);
      toast.error(error?.data?.message ?? 'Something went wrong.');
    }
  };

  return (
    <PlatformConnectionGate
      platform='GMB'
      sectionName='Google My Business details'
    >
      <Card className={'bg-white rounded-lg border'}>
        <AccordionItem value={'gmb-details'} className={'border-none'}>
          <AccordionTrigger
            className={'px-6 py-5 text-lg text-gray-900 font-semibold'}
          >
            <div className='flex items-center justify-between w-full gap-3'>
              <div className='flex items-center gap-2'>
                <GoogleIcon />
                <p className='text-lg font-semibold text-gray-900 flex-1'>
                  Google My Business Details
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
                      <ImageUploaderLabel>Logo</ImageUploaderLabel>
                    </ImageUploaderHeader>
                    {logoImgPreviewUrl ? (
                      <div className='border overflow-hidden border-[rgba(213,215,218,1)] rounded-md flex items-center justify-center p-4 min-h-32'>
                        <div className='flex items-center gap-4'>
                          {logo ? (
                            <div className='size-28 rounded-md overflow-hidden border border-border'>
                              <Image
                                src={logoImgPreviewUrl}
                                alt='profile-image'
                                width={32}
                                height={32}
                                className='size-full object-cover'
                              />
                            </div>
                          ) : (
                            <div className='flex flex-col gap-4'>
                              <div
                                className={cn(
                                  'size-28 rounded-md overflow-hidden border border-border relative',
                                  uploadedLogoImg?.status === 'error' &&
                                    'border-error-400'
                                )}
                              >
                                <Image
                                  src={logoImgPreviewUrl}
                                  alt='profile-image'
                                  width={32}
                                  height={32}
                                  className='size-full object-cover'
                                />
                                {uploadedLogoImg?.status === 'error' && (
                                  <Badge
                                    variant={'destructive'}
                                    className={
                                      'absolute top-1 left-1 z-10 bg-error-600 text-white border-none rounded-sm'
                                    }
                                  >
                                    Error
                                  </Badge>
                                )}
                              </div>
                              {uploadedLogoImg?.status === 'error' && (
                                <div className='border-error-200 bg-error-100 border text-error-700 rounded-md py-1 px-2 text-xs font-medium'>
                                  Failed to deploy this image to GBP. Please try
                                  re-uploading.
                                </div>
                              )}
                            </div>
                          )}

                          <div className='flex items-center flex-col gap-3'>
                            {isLogoUpdating ? (
                              <Button
                                variant={'outline'}
                                size={'sm'}
                                className={'min-w-24'}
                                disabled={isLogoUpdating}
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
                                    handleSingleImageChange(
                                      e,
                                      LOCATION_IMG_CATEGORIES.logo
                                    );
                                    e.target.value = null;
                                  }}
                                  disabled={isLogoUpdating}
                                />
                              </Label>
                            )}

                            {(hasDevFlag || logoLocalPreviewUrl) && (
                              <Button
                                variant={'destructive'}
                                size={'sm'}
                                className={'min-w-24'}
                                disabled={isLogoUpdating}
                                onClick={handleDeleteLogo}
                              >
                                {logoLocalPreviewUrl ? 'Remove' : 'Delete'}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <ImageUploaderInput
                        handleInputChange={(e) =>
                          handleSingleImageChange(
                            e,
                            LOCATION_IMG_CATEGORIES.logo
                          )
                        }
                      />
                    )}
                    {logo && (
                      <>
                        <ImageUploaderLocations
                          value={locations}
                          onValueChange={setLocations}
                          platform={'gmb'}
                          dealerId={commonDetails?.dealerId}
                          isUploading={isLogoUpdating}
                        />
                        <div className='h-px bg-border my-4' />
                        <div className='flex items-center justify-end gap-4 mt-6'>
                          <Button
                            variant={'outline'}
                            disabled={isLogoUpdating}
                            onClick={() => {
                              setLogo(null);
                              setLocations([commonDetails?.dealerId]);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant={'primary'}
                            disabled={isLogoUpdating}
                            onClick={() =>
                              handleSingleImgUpload(
                                LOCATION_IMG_CATEGORIES.logo
                              )
                            }
                          >
                            {isLogoUpdating && <Loader />}
                            {isLogoUpdating ? 'Saving...' : 'Save'}
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
                      <div className='border overflow-hidden border-[rgba(213,215,218,1)] rounded-md flex items-center justify-center p-4 min-h-32'>
                        <div className='flex items-center gap-4'>
                          {coverImage ? (
                            <div className='size-28 rounded-md overflow-hidden border border-border'>
                              <Image
                                src={coverImagePreviewUrl}
                                alt='profile-image'
                                width={32}
                                height={32}
                                className='size-full object-cover'
                              />
                            </div>
                          ) : (
                            <div className='flex flex-col gap-4'>
                              <div
                                className={cn(
                                  'size-28 rounded-md overflow-hidden border border-border relative',
                                  uploadedCoverImg?.status === 'error' &&
                                    'border-error-400'
                                )}
                              >
                                <Image
                                  src={coverImagePreviewUrl}
                                  alt='profile-image'
                                  width={32}
                                  height={32}
                                  className='size-full object-cover'
                                />
                                {uploadedCoverImg?.status === 'error' && (
                                  <Badge
                                    variant={'destructive'}
                                    className={
                                      'absolute top-1 left-1 z-10 bg-error-600 text-white border-none rounded-sm'
                                    }
                                  >
                                    Error
                                  </Badge>
                                )}
                              </div>
                              {uploadedCoverImg?.status === 'error' && (
                                <div className='border-error-200 bg-error-100 border text-error-700 rounded-md py-1 px-2 text-xs font-medium'>
                                  Failed to deploy this image to GBP. Please try
                                  re-uploading.
                                </div>
                              )}
                            </div>
                          )}

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
                                    handleSingleImageChange(
                                      e,
                                      LOCATION_IMG_CATEGORIES.cover
                                    );
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
                                disabled={isCoverImageUpdating}
                                onClick={handleCoverIamgeDelete}
                              >
                                {coverImgLocalPreviewUrl ? 'Remove' : 'Delete'}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <ImageUploaderInput
                        handleInputChange={(e) =>
                          handleSingleImageChange(
                            e,
                            LOCATION_IMG_CATEGORIES.cover
                          )
                        }
                      />
                    )}
                    {coverImage && (
                      <>
                        <ImageUploaderLocations
                          isUploading={isCoverImageUpdating}
                          value={coverImgLocations}
                          onValueChange={setCoverImgLocations}
                          dealerId={commonDetails?.dealerId}
                          platform={'gmb'}
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
                            onClick={() =>
                              handleSingleImgUpload(
                                LOCATION_IMG_CATEGORIES.cover
                              )
                            }
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
            <div className='col-span-full'>
              <ImageUploader>
                <LabelInputContainer>
                  <ImageUploaderHeader>
                    <ImageUploaderLabel>
                      Add Interior Images{' '}
                      <span className='text-xs text-gray-600 font-normal'>
                        (Max {MAX_MULTI_IMAGE_UPLOAD} at a time)
                      </span>
                    </ImageUploaderLabel>
                  </ImageUploaderHeader>
                  <ImageUploaderInput
                    isMultiple={true}
                    disabled={isInteriorImgUpading}
                    handleInputChange={(e) =>
                      handleMultipleImageChange(
                        e,
                        LOCATION_IMG_CATEGORIES.interior
                      )
                    }
                  />
                  {!!interiorImages.length && (
                    <LabelInputContainer className={'my-4'}>
                      <p className={cn(labelVariants())}>Images Preview</p>
                      <Carousel>
                        <CarouselContent>
                          {interiorImages.map((interiorImage) => {
                            const handleRemoveImage = () => {
                              const filteredImages = interiorImages.filter(
                                ({ id }) => interiorImage.id !== id
                              );

                              setInteriorImages(filteredImages);
                            };

                            return (
                              <div
                                key={interiorImage.id}
                                className='h-32 rounded-md relative overflow-hidden border border-border w-[244px] shrink-0'
                              >
                                <BlobImage
                                  file={interiorImage.file}
                                  alt={`image-${interiorImage.id}`}
                                  width={50}
                                  height={50}
                                  className='size-full object-cover'
                                />
                                <button
                                  disabled={isInteriorImgUpading}
                                  onClick={handleRemoveImage}
                                  className='size-6 rounded-full flex items-center justify-center border border-white bg-gray-900 text-white absolute top-1 right-1 z-10 cursor-pointer disabled:opacity-50 disabled:pointer-events-none'
                                >
                                  <XIcon strokeWidth={1.5} size={16} />
                                </button>
                              </div>
                            );
                          })}
                        </CarouselContent>
                        <div className='flex items-center justify-between gap-4'>
                          <CarouselIndicator />
                          <CarouselNavigation />
                        </div>
                      </Carousel>
                    </LabelInputContainer>
                  )}
                  {!!interiorImages.length && (
                    <>
                      <div className='h-px bg-border my-4' />
                      <div className='flex items-center justify-end gap-4 mt-6'>
                        <Button
                          variant={'outline'}
                          disabled={isInteriorImgUpading}
                          onClick={() => {
                            setInteriorImages([]);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant={'primary'}
                          disabled={isInteriorImgUpading}
                          onClick={() =>
                            handleMultipleImgUpload(
                              LOCATION_IMG_CATEGORIES.interior
                            )
                          }
                        >
                          {isInteriorImgUpading && <Loader />}
                          {isInteriorImgUpading ? 'Saving...' : 'Save'}
                        </Button>
                      </div>
                    </>
                  )}
                  {!!mediaDetails?.GMB_INTERIOR?.length && (
                    <LabelInputContainer>
                      <p className={cn(labelVariants())}>Uploaded Images</p>
                      <Carousel>
                        <CarouselContent>
                          {mediaDetails?.GMB_INTERIOR?.map((interiorImage) => {
                            const isError = interiorImage.status === 'error';
                            const handleRemoveImage = () => {
                              console.log('hit delete API here.');
                            };

                            const statusConfig = {
                              deployed: {
                                background: 'bg-success-500 text-white',
                                foreground: 'text-success-500',
                                label: 'Deployed',
                              },
                              error: {
                                background: 'bg-error-500 text-white',
                                foreground: 'text-error-500',
                                label: 'Error',
                              },
                            };

                            return (
                              <div
                                key={interiorImage?.id}
                                className={cn(
                                  'border border-border p-2 rounded-lg bg-white shadow-sm w-[244px] shrink-0',
                                  isError && 'bg-error-50 border-error-200'
                                )}
                              >
                                <div className='h-32 rounded-md relative overflow-hidden border border-border'>
                                  <Image
                                    src={interiorImage?.url}
                                    alt={`image-${interiorImage?.id}`}
                                    width={50}
                                    height={50}
                                    className='size-full object-cover'
                                  />
                                  {hasDevFlag && (
                                    <button
                                      onClick={handleRemoveImage}
                                      className='size-6 rounded-full flex items-center justify-center border border-white bg-gray-900 text-white absolute top-1 right-1 z-10 cursor-pointer'
                                    >
                                      <XIcon strokeWidth={1.5} size={16} />
                                    </button>
                                  )}
                                </div>
                                <div className='flex flex-col gap-2 text-sm mt-4'>
                                  <div className='flex items-center gap-2'>
                                    <div
                                      className={cn(
                                        'size-5 rounded-full flex items-center justify-center',
                                        statusConfig?.[interiorImage?.status]
                                          ?.background
                                      )}
                                    >
                                      {isError ? (
                                        <XIcon size={14} />
                                      ) : (
                                        <CheckIcon size={14} />
                                      )}
                                    </div>
                                    <p
                                      className={cn(
                                        statusConfig?.[interiorImage?.status]
                                          ?.foreground
                                      )}
                                    >
                                      {
                                        statusConfig?.[interiorImage?.status]
                                          ?.label
                                      }
                                    </p>
                                  </div>
                                  <div className='flex items-center gap-1 text-gray-600 font-medium'>
                                    <p>Platform :</p>
                                    <p>GBP</p>
                                  </div>
                                  {isError && (
                                    <div className='border-error-200 bg-error-100 border text-error-700 rounded-md py-1 px-2 text-xs font-medium'>
                                      Failed to deploy this image to GBP. Please
                                      try re-uploading.
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </CarouselContent>
                        <div className='flex items-center justify-between gap-4'>
                          <CarouselIndicator />
                          <CarouselNavigation />
                        </div>
                      </Carousel>
                    </LabelInputContainer>
                  )}
                </LabelInputContainer>
              </ImageUploader>
            </div>
            <div className='col-span-full'>
              <ImageUploader>
                <LabelInputContainer>
                  <ImageUploaderHeader>
                    <ImageUploaderLabel>
                      Add Exterior Images{' '}
                      <span className='text-xs text-gray-600 font-normal'>
                        (Max {MAX_MULTI_IMAGE_UPLOAD} at a time)
                      </span>
                    </ImageUploaderLabel>
                  </ImageUploaderHeader>
                  <ImageUploaderInput
                    isMultiple={true}
                    disabled={isExteriorImgUploading}
                    handleInputChange={(e) =>
                      handleMultipleImageChange(
                        e,
                        LOCATION_IMG_CATEGORIES.exterior
                      )
                    }
                  />
                  {!!exteriorImages.length && (
                    <LabelInputContainer className={'my-4'}>
                      <p className={cn(labelVariants())}>Images Preview</p>
                      <Carousel>
                        <CarouselContent>
                          {exteriorImages.map((exteriorImage) => {
                            const handleRemoveImage = () => {
                              const filteredImages = exteriorImages.filter(
                                ({ id }) => exteriorImage.id !== id
                              );

                              setExteriorImages(filteredImages);
                            };

                            return (
                              <div
                                key={exteriorImage.id}
                                className='h-32 rounded-md relative overflow-hidden border border-border w-[244px] shrink-0'
                              >
                                <BlobImage
                                  file={exteriorImage.file}
                                  alt={`image-${exteriorImage.id}`}
                                  width={50}
                                  height={50}
                                  className='size-full object-cover'
                                />
                                <button
                                  disabled={isExteriorImgUploading}
                                  onClick={handleRemoveImage}
                                  className='size-6 rounded-full flex items-center justify-center border border-white bg-gray-900 text-white absolute top-1 right-1 z-10 cursor-pointer disabled:opacity-50 disabled:pointer-events-none'
                                >
                                  <XIcon strokeWidth={1.5} size={16} />
                                </button>
                              </div>
                            );
                          })}
                        </CarouselContent>
                        <div className='flex items-center justify-between gap-4'>
                          <CarouselIndicator />
                          <CarouselNavigation />
                        </div>
                      </Carousel>
                    </LabelInputContainer>
                  )}
                  {!!exteriorImages.length && (
                    <>
                      <div className='h-px bg-border my-4' />
                      <div className='flex items-center justify-end gap-4 mt-6'>
                        <Button
                          variant={'outline'}
                          disabled={isExteriorImgUploading}
                          onClick={() => {
                            setExteriorImages([]);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant={'primary'}
                          disabled={isExteriorImgUploading}
                          onClick={() =>
                            handleMultipleImgUpload(
                              LOCATION_IMG_CATEGORIES.exterior
                            )
                          }
                        >
                          {isExteriorImgUploading && <Loader />}
                          {isExteriorImgUploading ? 'Saving...' : 'Save'}
                        </Button>
                      </div>
                    </>
                  )}
                  {!!mediaDetails?.GMB_EXTERIOR?.length && (
                    <LabelInputContainer>
                      <p className={cn(labelVariants())}>Uploaded Images</p>
                      <Carousel>
                        <CarouselContent>
                          {mediaDetails?.GMB_EXTERIOR?.map((exteriorImage) => {
                            const isError = exteriorImage.status === 'error';

                            const handleRemoveImage = () => {
                              console.log('hit delete API here.');
                            };

                            const statusConfig = {
                              deployed: {
                                background: 'bg-success-500 text-white',
                                foreground: 'text-success-500',
                                label: 'Deployed',
                              },
                              error: {
                                background: 'bg-error-500 text-white',
                                foreground: 'text-error-500',
                                label: 'Error',
                              },
                            };

                            return (
                              <div
                                key={exteriorImage?.id}
                                className={cn(
                                  'border border-border p-2 rounded-lg bg-white shadow-sm w-[244px] shrink-0',
                                  isError && 'bg-error-50 border-error-200'
                                )}
                              >
                                <div className='h-32 rounded-md relative overflow-hidden border border-border'>
                                  <Image
                                    src={exteriorImage?.url}
                                    alt={`image-${exteriorImage?.id}`}
                                    width={50}
                                    height={50}
                                    className='size-full object-cover'
                                  />
                                  {hasDevFlag && (
                                    <button
                                      onClick={handleRemoveImage}
                                      className='size-6 rounded-full flex items-center justify-center border border-white bg-gray-900 text-white absolute top-1 right-1 z-10 cursor-pointer'
                                    >
                                      <XIcon strokeWidth={1.5} size={16} />
                                    </button>
                                  )}
                                </div>
                                <div className='flex flex-col gap-2 text-sm mt-4'>
                                  <div className='flex items-center gap-2'>
                                    <div
                                      className={cn(
                                        'size-5 rounded-full flex items-center justify-center',
                                        statusConfig?.[exteriorImage?.status]
                                          ?.background
                                      )}
                                    >
                                      {isError ? (
                                        <XIcon size={14} />
                                      ) : (
                                        <CheckIcon size={14} />
                                      )}
                                    </div>
                                    <p
                                      className={cn(
                                        statusConfig?.[exteriorImage?.status]
                                          ?.foreground
                                      )}
                                    >
                                      {
                                        statusConfig?.[exteriorImage?.status]
                                          ?.label
                                      }
                                    </p>
                                  </div>
                                  <div className='flex items-center gap-1 text-gray-600 font-medium'>
                                    <p>Platform :</p>
                                    <p>GBP</p>
                                  </div>
                                  {isError && (
                                    <div className='border-error-200 bg-error-100 border text-error-700 rounded-md py-1 px-2 text-xs font-medium'>
                                      Failed to deploy this image to GBP. Please
                                      try re-uploading.
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </CarouselContent>
                        <div className='flex items-center justify-between gap-4'>
                          <CarouselIndicator />
                          <CarouselNavigation />
                        </div>
                      </Carousel>
                    </LabelInputContainer>
                  )}
                </LabelInputContainer>
              </ImageUploader>
            </div>
            <div className='col-span-full'>
              <ImageUploader>
                <LabelInputContainer>
                  <ImageUploaderHeader>
                    <ImageUploaderLabel>
                      Add Image to Image Gallery{' '}
                      <span className='text-xs text-gray-600 font-normal'>
                        (Max {MAX_MULTI_IMAGE_UPLOAD} at a time)
                      </span>
                    </ImageUploaderLabel>
                  </ImageUploaderHeader>
                  <ImageUploaderInput
                    isMultiple={true}
                    disabled={isImgGalleryUpdating}
                    handleInputChange={(e) =>
                      handleMultipleImageChange(
                        e,
                        LOCATION_IMG_CATEGORIES.categoryUnspecified
                      )
                    }
                  />
                  {!!imgGallery.length && (
                    <LabelInputContainer className={'my-4'}>
                      <p className={cn(labelVariants())}>Images Preview</p>
                      <Carousel>
                        <CarouselContent>
                          {imgGallery.map((img) => {
                            const handleRemoveImage = () => {
                              const filteredImages = imgGallery.filter(
                                ({ id }) => img.id !== id
                              );

                              setImgGallery(filteredImages);
                            };

                            return (
                              <div
                                key={img.id}
                                className='h-32 rounded-md relative overflow-hidden border border-border w-[244px] shrink-0'
                              >
                                <BlobImage
                                  file={img.file}
                                  alt={`image-${img.id}`}
                                  width={50}
                                  height={50}
                                  className='size-full object-cover'
                                />
                                <button
                                  disabled={isImgGalleryUpdating}
                                  onClick={handleRemoveImage}
                                  className='size-6 rounded-full flex items-center justify-center border border-white bg-gray-900 text-white absolute top-1 right-1 z-10 cursor-pointer disabled:opacity-50 disabled:pointer-events-none'
                                >
                                  <XIcon strokeWidth={1.5} size={16} />
                                </button>
                              </div>
                            );
                          })}
                        </CarouselContent>
                        <div className='flex items-center justify-between gap-4'>
                          <CarouselIndicator />
                          <CarouselNavigation />
                        </div>
                      </Carousel>
                    </LabelInputContainer>
                  )}
                  {!!imgGallery.length && (
                    <>
                      <div className='h-px bg-border my-4' />
                      <div className='flex items-center justify-end gap-4 mt-6'>
                        <Button
                          variant={'outline'}
                          disabled={isImgGalleryUpdating}
                          onClick={() => {
                            setImgGallery([]);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant={'primary'}
                          disabled={isImgGalleryUpdating}
                          onClick={() =>
                            handleMultipleImgUpload(
                              LOCATION_IMG_CATEGORIES.categoryUnspecified
                            )
                          }
                        >
                          {isImgGalleryUpdating && <Loader />}
                          {isImgGalleryUpdating ? 'Saving...' : 'Save'}
                        </Button>
                      </div>
                    </>
                  )}
                  {!!mediaDetails?.GMB_CATEGORY_UNSPECIFIED?.length && (
                    <LabelInputContainer>
                      <p className={cn(labelVariants())}>Uploaded Images</p>
                      <Carousel>
                        <CarouselContent>
                          {mediaDetails?.GMB_CATEGORY_UNSPECIFIED?.map(
                            (img) => {
                              const isError = img.status === 'error';
                              const handleRemoveImage = () => {
                                console.log('hit delete API here.');
                              };

                              const statusConfig = {
                                deployed: {
                                  background: 'bg-success-500 text-white',
                                  foreground: 'text-success-500',
                                  label: 'Deployed',
                                },
                                error: {
                                  background: 'bg-error-500 text-white',
                                  foreground: 'text-error-500',
                                  label: 'Error',
                                },
                              };

                              return (
                                <div
                                  key={img?.id}
                                  className={cn(
                                    'border border-border p-2 rounded-lg bg-white shadow-sm w-[244px] shrink-0',
                                    isError && 'bg-error-50 border-error-200'
                                  )}
                                >
                                  <div className='h-32 rounded-md relative overflow-hidden border border-border'>
                                    <Image
                                      src={img?.url}
                                      alt={`image-${img?.id}`}
                                      width={50}
                                      height={50}
                                      className='size-full object-cover'
                                    />
                                    {hasDevFlag && (
                                      <button
                                        onClick={handleRemoveImage}
                                        className='size-6 rounded-full flex items-center justify-center border border-white bg-gray-900 text-white absolute top-1 right-1 z-10 cursor-pointer'
                                      >
                                        <XIcon strokeWidth={1.5} size={16} />
                                      </button>
                                    )}
                                  </div>
                                  <div className='flex flex-col gap-2 text-sm mt-4'>
                                    <div className='flex items-center gap-2'>
                                      <div
                                        className={cn(
                                          'size-5 rounded-full flex items-center justify-center',
                                          statusConfig?.[img?.status]
                                            ?.background
                                        )}
                                      >
                                        {isError ? (
                                          <XIcon size={14} />
                                        ) : (
                                          <CheckIcon size={14} />
                                        )}
                                      </div>
                                      <p
                                        className={cn(
                                          statusConfig?.[img?.status]
                                            ?.foreground
                                        )}
                                      >
                                        {statusConfig?.[img?.status]?.label}
                                      </p>
                                    </div>
                                    <div className='flex items-center gap-1 text-gray-600 font-medium'>
                                      <p>Platform :</p>
                                      <p>GBP</p>
                                    </div>
                                    {isError && (
                                      <div className='border-error-200 bg-error-100 border text-error-700 rounded-md py-1 px-2 text-xs font-medium'>
                                        Failed to deploy this image to GBP.
                                        Please try re-uploading.
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </CarouselContent>
                        <div className='flex items-center justify-between gap-4'>
                          <CarouselIndicator />
                          <CarouselNavigation />
                        </div>
                      </Carousel>
                    </LabelInputContainer>
                  )}
                </LabelInputContainer>
              </ImageUploader>
            </div>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>Business Name</p>
              <p className='text-sm text-gray-600 wrap-break-word'>
                {commonDetails?.dealerName || '-'}
              </p>
            </LabelInputContainer>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>Map URL</p>
              {gmbDetails?.mapUrl ? (
                <Link
                  href={gmbDetails?.mapUrl}
                  className='text-brand-600 hover:underline'
                  target='_blank'
                >
                  {gmbDetails?.mapUrl}
                </Link>
              ) : (
                <p className='text-sm text-gray-600'>-</p>
              )}
            </LabelInputContainer>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>Review URL</p>
              {gmbDetails?.reviewUrl ? (
                <Link
                  href={gmbDetails?.reviewUrl}
                  className='text-brand-600 hover:underline'
                  target='_blank'
                >
                  {gmbDetails?.reviewUrl}
                </Link>
              ) : (
                <p className='text-sm text-gray-600'>-</p>
              )}
            </LabelInputContainer>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>Appointment Link</p>
              {gmbDetails?.appointmentLink ? (
                <Link
                  href={gmbDetails?.appointmentLink}
                  className='text-brand-600 hover:underline'
                  target='_blank'
                >
                  {gmbDetails?.appointmentLink}
                </Link>
              ) : (
                <p className='text-sm text-gray-600'>-</p>
              )}
            </LabelInputContainer>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>Whatsapp URL</p>
              {gmbDetails?.whatsappUrl ? (
                <Link
                  href={gmbDetails?.whatsappUrl}
                  className='text-brand-600 hover:underline'
                  target='_blank'
                >
                  {gmbDetails?.whatsappUrl}
                </Link>
              ) : (
                <p className='text-sm text-gray-600'>-</p>
              )}
            </LabelInputContainer>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>Facebook URL</p>
              {gmbDetails?.facebookUrl ? (
                <Link
                  href={gmbDetails?.facebookUrl}
                  className='text-brand-600 hover:underline'
                  target='_blank'
                >
                  {gmbDetails?.facebookUrl}
                </Link>
              ) : (
                <p className='text-sm text-gray-600'>-</p>
              )}
            </LabelInputContainer>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>Twitter URL</p>
              {gmbDetails?.twitterUrl ? (
                <Link
                  href={gmbDetails?.twitterUrl}
                  className='text-brand-600 hover:underline'
                  target='_blank'
                >
                  {gmbDetails?.twitterUrl}
                </Link>
              ) : (
                <p className='text-sm text-gray-600'>-</p>
              )}
            </LabelInputContainer>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>Instagram URL</p>
              {gmbDetails?.instagramUrl ? (
                <Link
                  href={gmbDetails?.instagramUrl}
                  className='text-brand-600 hover:underline'
                  target='_blank'
                >
                  {gmbDetails?.instagramUrl}
                </Link>
              ) : (
                <p className='text-sm text-gray-600'>-</p>
              )}
            </LabelInputContainer>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>LinkedIn URL</p>
              {gmbDetails?.linkedinUrl ? (
                <Link
                  href={gmbDetails?.linkedinUrl}
                  className='text-brand-600 hover:underline'
                  target='_blank'
                >
                  {gmbDetails?.linkedinUrl}
                </Link>
              ) : (
                <p className='text-sm text-gray-600'>-</p>
              )}
            </LabelInputContainer>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>YouTube URL</p>
              {gmbDetails?.youtubeUrl ? (
                <Link
                  href={gmbDetails?.youtubeUrl}
                  className='text-brand-600 hover:underline'
                  target='_blank'
                >
                  {gmbDetails?.youtubeUrl}
                </Link>
              ) : (
                <p className='text-sm text-gray-600'>-</p>
              )}
            </LabelInputContainer>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>Additional Phone Number</p>
              <p className='text-sm text-gray-600 wrap-break-word'>
                {gmbDetails?.phoneNumber || '-'}
              </p>
            </LabelInputContainer>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>Primary Category</p>
              <p className='text-sm text-gray-600 wrap-break-word'>
                {gmbDetails?.gmbPrimaryCategoryDetails || '-'}
              </p>
            </LabelInputContainer>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>Secondary Category</p>
              <p className='text-sm text-gray-600 wrap-break-word'>
                {gmbDetails?.gmbAdditionalCategoryDetails?.length
                  ? gmbDetails?.gmbAdditionalCategoryDetails?.join(', ')
                  : '-'}
              </p>
            </LabelInputContainer>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>Status</p>
              <p className='text-sm text-gray-600 wrap-break-word'>
                {gmbDetails?.status || 'NA'}
              </p>
            </LabelInputContainer>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>Open Info Status</p>
              <p className='text-sm text-gray-600 wrap-break-word'>
                {gmbDetails?.openInfoStatus || '-'}
              </p>
            </LabelInputContainer>
            <LabelInputContainer>
              <p className={cn(labelVariants())}>Language Code</p>
              <p className='text-sm text-gray-600 wrap-break-word'>
                {gmbDetails?.languageCode || '-'}
              </p>
            </LabelInputContainer>
          </AccordionContent>
        </AccordionItem>
        {isOpen && (
          <GmbDetailsForm
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            gmbDetails={gmbDetails}
            setShowSuccessDialog={setShowSuccessDialog}
          />
        )}
      </Card>
    </PlatformConnectionGate>
  );
};

const GmbDetailsForm = ({
  isOpen,
  setIsOpen,
  gmbDetails,
  setShowSuccessDialog,
}) => {
  const initialFormData = {
    primaryCategory: gmbDetails?.gmbPrimaryCategoryDetails || '',
    secondaryCategory: gmbDetails?.gmbPrimaryCategoryDetails?.length
      ? gmbDetails?.gmbPrimaryCategoryDetails
      : [],
    whatsappUrl: gmbDetails?.whatsappUrl || '',
    facebookUrl: gmbDetails?.facebookUrl || '',
    twitterUrl: gmbDetails?.twitterUrl || '',
    instagramUrl: gmbDetails?.instagramUrl || '',
    linkedinUrl: gmbDetails?.linkedinUrl || '',
    youtubeUrl: gmbDetails?.youtubeUrl || '',
    appointmentLink: gmbDetails?.appointmentLink || '',
    languageCode: gmbDetails?.languageCode || '',
  };

  const { data: categories, isLoading: isCategoriesLoading } =
    useGetLocationCategories({ source: 'GMB' });

  const categoryOptions = (categories ?? []).map((category) => ({
    label: category.display_name,
    value: String(category.id),
  }));

  const [formData, setFormData] = useState({ ...initialFormData });
  const [validationErrors, setValidationErrors] = useState({
    primaryCategory: '',
    secondaryCategory: '',
    whatsappUrl: '',
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    youtubeUrl: '',
    appointmentLink: '',
    languageCode: '',
  });

  const { userDetails } = useAuth();
  const { dealer_id } = useParams();

  const { isPending, mutateAsync } = useUpdateGmbDetails();

  const handleCategoryChange = (value, category) => {
    const body = {};

    category === 'primary'
      ? (body.primaryCategory = value)
      : (body.secondaryCategory = value);

    setFormData((prevFormData) => ({ ...prevFormData, ...body }));
  };

  const handleInputChange = (e) => {
    const { name, value, dataset } = e.target;

    if (dataset.noSpace && /\s/.test(value)) return;

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
      primaryCategory: '',
      secondaryCategory: '',
      whatsappUrl: '',
      facebookUrl: '',
      twitterUrl: '',
      instagramUrl: '',
      linkedinUrl: '',
      youtubeUrl: '',
      appointmentLink: '',
      languageCode: '',
    });
  };

  const handleSave = async () => {
    const dirtyFields = getDirtyFields(initialFormData, formData);

    const { success, errors } = await validateDirtyFields(
      gmbDetailsSchema,
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

    const body = buildGmbDetailsPayload(formData, dirtyFields);

    if (Object.keys(body).length) {
      try {
        const params = {
          clientId: userDetails?.clientId,
        };

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
            Modify Google My Business Details
          </SheetTitle>
          <SheetDescription className={'text-sm text-gray-600'}>
            Update details about this location
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto space-y-4 px-6 py-4'>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Primary Category GMB</p>
            {isCategoriesLoading ? (
              <FieldSkeleton />
            ) : (
              <Select
                value={formData.primaryCategory}
                onValueChange={(value) =>
                  handleCategoryChange(value, 'primary')
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select Primary Category' />
                </SelectTrigger>
                <SelectContent>
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
            {validationErrors.primaryCategory && (
              <ErrorMessage message={validationErrors.primaryCategory} />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Secondary Category GMB</p>
            {isCategoriesLoading ? (
              <FieldSkeleton />
            ) : (
              <MultiSelect
                options={categoryOptions}
                value={formData.secondaryCategory}
                selectLabel='categories'
                onChange={(newSecondaryCategories) => {
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    secondaryCategory: newSecondaryCategories,
                  }));
                }}
                placeholder='Select secondary category'
              />
            )}
            {validationErrors.secondaryCategory && (
              <ErrorMessage message={validationErrors.secondaryCategory} />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor={'languageCode'}>Language Code</Label>
            <Input
              id={'languageCode'}
              placeholder={'Enter language code'}
              name={'languageCode'}
              value={formData.languageCode}
              onChange={handleInputChange}
            />
            {validationErrors?.languageCode && (
              <ErrorMessage message={validationErrors?.languageCode} />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor={'appointmentLink'}>Appointment Link</Label>
            <LinkComponent
              htmlFor={'appointmentLink'}
              placeholder={'https://'}
              value={formData.appointmentLink}
              onChange={handleInputChange}
            />
            {validationErrors.appointmentLink && (
              <ErrorMessage message={validationErrors.appointmentLink} />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor={'whatsappUrl'}>Whatsapp URL</Label>
            <LinkComponent
              htmlFor={'whatsappUrl'}
              placeholder={'https://'}
              value={formData.whatsappUrl}
              onChange={handleInputChange}
            />
            {validationErrors.whatsappUrl && (
              <ErrorMessage message={validationErrors.whatsappUrl} />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor={'facebookUrl'}>Facebook URL</Label>
            <LinkComponent
              htmlFor={'facebookUrl'}
              placeholder={'https://'}
              value={formData.facebookUrl}
              onChange={handleInputChange}
            />
            {validationErrors.facebookUrl && (
              <ErrorMessage message={validationErrors.facebookUrl} />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor={'twitterUrl'}>Twitter URL</Label>
            <LinkComponent
              htmlFor={'twitterUrl'}
              placeholder={'https://'}
              value={formData.twitterUrl}
              onChange={handleInputChange}
            />
            {validationErrors.twitterUrl && (
              <ErrorMessage message={validationErrors.twitterUrl} />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor={'instagramUrl'}>Instagram URL</Label>
            <LinkComponent
              htmlFor={'instagramUrl'}
              placeholder={'https://'}
              value={formData.instagramUrl}
              onChange={handleInputChange}
            />
            {validationErrors.instagramUrl && (
              <ErrorMessage message={validationErrors.instagramUrl} />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor={'linkedinUrl'}>LinkedIn URL</Label>
            <LinkComponent
              htmlFor={'linkedinUrl'}
              placeholder={'https://'}
              value={formData.linkedinUrl}
              onChange={handleInputChange}
            />
            {validationErrors.linkedinUrl && (
              <ErrorMessage message={validationErrors.linkedinUrl} />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor={'youtubeUrl'}>YouTube URL</Label>
            <LinkComponent
              htmlFor={'youtubeUrl'}
              placeholder={'https://'}
              value={formData.youtubeUrl}
              onChange={handleInputChange}
            />
            {validationErrors.youtubeUrl && (
              <ErrorMessage message={validationErrors.youtubeUrl} />
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
          <Button variant={'primary'} disabled={isPending} onClick={handleSave}>
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
