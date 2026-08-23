'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { SegmentedRadioGroup } from '@/components/common/SegmentedRadioGroup';
import SingleImageUpload from '@/components/common/SingleImageUpload';
import { createPostGMBSchema } from '@/components/create-post/schema/createPostGMB.schema';
import { EndDatePicker } from '@/components/date-range/EndDatePicker';
import { StartDatePicker } from '@/components/date-range/StartDatePicker';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/components/ui/error-message';
import { Input } from '@/components/ui/input';
import { Label, labelVariants } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  createEventGMB,
  createOfferGMB,
  createWhatsNewGMB,
} from '@/constants/createPost_constant';
import {
  ActionTypeUrlOption,
  gmbposttypeoption,
} from '@/constants/static_data';
import {
  buildBackendDateTime,
  cn,
  generateTimeOptions,
  getEndTimeOptions,
  mapZodErrors,
} from '@/lib/utils';
import { normalizeUrl } from '../location-details/location-details.schema';

export default function FacebookForm({
  onSubmit,
  isSubmitting,
  dealerIdOptions,
}) {
  const [postType, setPostType] = useState('event');
  const [formData, setFormData] = useState(createEventGMB);
  const [imageFile, setImageFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const timeoptions = generateTimeOptions();
  const router = useRouter();

  const handleDropdownChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handlePostImageUpload = async (file) => {
    // ✅ user removed image
    if (!file) {
      setImageFile(null);
      return;
    }

    setImageFile(file);
    setValidationErrors((prevErrors) => ({ ...prevErrors, imageUrl: '' }));
  };

  const handleCreate = () => {
    const result = createPostGMBSchema.safeParse(formData);

    const isPhoto = formData.postImageType === 'photo';

    if (!result.success) {
      toast.error('Required fields cannot be empty');
      const errors = mapZodErrors(result.error.issues);

      if (isPhoto && !imageFile) {
        errors.imageUrl = 'Image is required.';
      }

      setValidationErrors((prevErrors) => ({ ...prevErrors, ...errors }));
      return;
    }

    const payload = {
      summary: formData.postSummary,
      coupon_code: formData.couponCode,
      redeem_url: formData.redeemLink,
      terms_conditions: formData.termsandConditions,
      action_type: formData.actionType,
      action_url: formData.actionTypeUrl
        ? normalizeUrl(formData.actionTypeUrl)
        : '',
      media_format: 'PHOTO',
      start_date: buildBackendDateTime(formData.startDate, formData.startTime),
      end_date: buildBackendDateTime(formData.endDate, formData.endTime, {
        isEnd: true,
      }),
      dealer_id: formData.dealer_id,
      image_url: formData.imageUrl ? normalizeUrl(formData.imageUrl) : '', // URL for now
      post_type: formData.postType,
      label: formData.label,
      offer_title: formData?.postTitle || formData.offerTitle,
      created_date: buildBackendDateTime(new Date()),
      status: 'submit',
    };

    onSubmit(payload, isPhoto ? imageFile : null);
  };

  return (
    <>
      {/* Post Details Section */}
      <div className='my-6 bg-white border rounded-lg '>
        <div className='px-6 py-5  border-b'>
          <h3 className='text-lg font-semibold text-gray-900 font-body'>
            Post Details
          </h3>
          <p className='text-sm text-gray-600'>Create your post</p>
        </div>
        <div className='space-y-6 px-6 py-5'>
          {/* Post Type Selection */}
          <div>
            <Label htmlFor='postType'>Select Post Type</Label>
            <SegmentedRadioGroup
              value={formData.postType}
              onChange={(value) => {
                setPostType(value);
                switch (value) {
                  case 'event':
                    setFormData(createEventGMB);
                    break;
                  case 'offer':
                    setFormData(createOfferGMB);
                    break;
                  case 'whats_new':
                    setFormData(createWhatsNewGMB);
                    break;
                }
              }}
              options={gmbposttypeoption}
            />
          </div>
          <div>
            <Label htmlFor='label'>Label</Label>
            <Input
              id='label'
              placeholder='write label here...'
              value={formData.label}
              onChange={(e) => handleInputChange('label', e.target.value)}
              className='mt-1.5'
            />
            {validationErrors.label && (
              <ErrorMessage message={validationErrors.label} />
            )}
          </div>

          {/* title input */}
          {postType === 'event' && (
            <div>
              <Label htmlFor='title'>Title</Label>
              <Input
                id='title'
                placeholder='write title here...'
                value={formData.postTitle}
                onChange={(e) => handleInputChange('postTitle', e.target.value)}
                className='mt-1.5'
              />
              {validationErrors.postTitle && (
                <ErrorMessage message={validationErrors.postTitle} />
              )}
            </div>
          )}
          {/* offer title input */}
          {postType === 'offer' && (
            <div>
              <Label htmlFor='label'>Offer Title</Label>
              <Input
                id='label'
                placeholder='write label here...'
                value={formData.offerTitle}
                onChange={(e) =>
                  handleInputChange('offerTitle', e.target.value)
                }
                className='mt-1.5'
              />
              {validationErrors.offerTitle && (
                <ErrorMessage message={validationErrors.offerTitle} />
              )}
            </div>
          )}
          {/* Post Text */}
          <div>
            <Label htmlFor='postText'>Post Text</Label>
            <Textarea
              id='postText'
              placeholder='write summary here...'
              value={formData.postSummary}
              onChange={(e) => handleInputChange('postSummary', e.target.value)}
              className='mt-1.5 min-h-38.5'
              maxLength={500}
            />
            {validationErrors.postSummary && (
              <ErrorMessage message={validationErrors.postSummary} />
            )}
            <p className='text-sm text-gray-500 mt-1 mx-1'>
              {formData.postSummary.length}/500
            </p>
          </div>

          <div className='flex w-full flex-col gap-2.5'>
            <Label htmlFor='postImageType'>Post Image Type</Label>
            <Tabs
              defaultValue='photo'
              variant='default'
              value={formData.postImageType}
              onValueChange={(value) =>
                setFormData({ ...formData, postImageType: value })
              }
            >
              <TabsList className='flex w-full'>
                <TabsTrigger value='photo'>Photo</TabsTrigger>
                <TabsTrigger value='url'>URL</TabsTrigger>
              </TabsList>
              <TabsContent value='photo'>
                <SingleImageUpload onChange={handlePostImageUpload} />
              </TabsContent>
              <TabsContent value='url' className='mt-1.5'>
                <Label htmlFor='photoUrl'>Image URL</Label>
                <Input
                  id='photoUrl'
                  value={formData.imageUrl ?? ''}
                  onChange={(e) =>
                    handleInputChange('imageUrl', e.target.value)
                  }
                  placeholder='https://'
                  className='mt-2'
                />
              </TabsContent>
            </Tabs>
            {validationErrors.imageUrl && (
              <ErrorMessage message={validationErrors.imageUrl} />
            )}
          </div>

          {postType !== 'offer' && (
            <>
              <div>
                <Label htmlFor='actionType'>Select Action Type</Label>
                <Select
                  id='actionType'
                  value={formData.actionType}
                  onValueChange={(value) =>
                    handleDropdownChange('actionType', value)
                  }
                >
                  <SelectTrigger id='actionType' className='mt-2'>
                    <SelectValue placeholder='Select Action Type' />
                  </SelectTrigger>
                  <SelectContent>
                    {ActionTypeUrlOption.map((option) => (
                      <SelectItem value={option.value} key={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.actionType && (
                  <ErrorMessage message={validationErrors.actionType} />
                )}
              </div>

              <div>
                <Label htmlFor='actionTypeUrl'>Select Action Url</Label>
                <Input
                  id='actionTypeUrl'
                  placeholder='https://'
                  value={formData.actionTypeUrl}
                  onChange={(e) =>
                    handleInputChange('actionTypeUrl', e.target.value)
                  }
                  className='mt-2'
                />
                {validationErrors.actionTypeUrl && (
                  <ErrorMessage message={validationErrors.actionTypeUrl} />
                )}
              </div>
            </>
          )}

          {postType === 'offer' && (
            <>
              <div>
                <Label htmlFor='couponCode'>Coupon Code</Label>
                <Input
                  id='couponCode'
                  placeholder='write code here...'
                  value={formData.couponCode}
                  onChange={(e) =>
                    handleInputChange('couponCode', e.target.value)
                  }
                  className='mt-1.5'
                />
                {validationErrors.couponCode && (
                  <ErrorMessage message={validationErrors.couponCode} />
                )}
              </div>

              <div>
                <Label htmlFor='redeemLink'>Link to redeem offer</Label>
                <Input
                  id='redeemLink'
                  placeholder='https://'
                  value={formData.redeemLink}
                  onChange={(e) =>
                    handleInputChange('redeemLink', e.target.value)
                  }
                  className='mt-1.5'
                />
                {validationErrors.redeemLink && (
                  <ErrorMessage message={validationErrors.redeemLink} />
                )}
              </div>
              <div>
                <Label htmlFor='termsandConditions'>Terms and Conditions</Label>
                <Textarea
                  id='termsandConditions'
                  placeholder='write here...'
                  value={formData.termsandConditions}
                  onChange={(e) =>
                    handleInputChange('termsandConditions', e.target.value)
                  }
                  className='mt-1.5 min-h-38.5'
                />
                {validationErrors.termsandConditions && (
                  <ErrorMessage message={validationErrors.termsandConditions} />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Publishing Details Section */}
      <div className='bg-white border rounded-lg'>
        <div className='px-6 py-5  border-b'>
          <h3 className='text-lg font-semibold text-gray-900 font-body'>
            Publishing Details
          </h3>
          <p className='text-sm text-gray-600'>
            Select locations where this post will be published
          </p>
        </div>
        <div className='space-y-1.5 px-6 py-5'>
          <p className={cn(labelVariants())}>Select Locations</p>
          <MultiSelect
            options={dealerIdOptions}
            value={formData.dealer_id}
            onChange={(newLocations) => {
              setFormData((prevFormData) => ({
                ...prevFormData,
                dealer_id: newLocations,
              }));
              setValidationErrors((prevValidationErrors) => ({
                ...prevValidationErrors,
                dealer_id: '',
              }));
            }}
          />
          {validationErrors.dealer_id && (
            <ErrorMessage message={validationErrors.dealer_id} />
          )}
        </div>
        <div className='space-y-6 px-6 pb-5 border-b'>
          {/* Start Date & Time */}
          <div className='grid grid-cols-2 gap-4'>
            {/* Start Date */}
            <div className='flex flex-col gap-1'>
              <Label htmlFor='startDate'>Start Date</Label>
              <StartDatePicker
                value={formData.startDate}
                onChange={(d) =>
                  setFormData({
                    ...formData,
                    startDate: d,
                    startTime: '00:00',
                    endTime: '23:59',
                  })
                }
              />
              {validationErrors.startDate && (
                <ErrorMessage message={validationErrors.startDate} />
              )}
            </div>

            {/* Start Time */}
            <div className='flex flex-col gap-1'>
              <Label>Start Time</Label>
              <Select
                value={formData.startTime}
                onValueChange={(value) =>
                  setFormData({ ...formData, startTime: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select Time' />
                </SelectTrigger>
                <SelectContent>
                  {timeoptions.map((time) => (
                    <SelectItem value={time} key={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.startTime && (
                <ErrorMessage message={validationErrors.startTime} />
              )}
            </div>
          </div>

          {/* End Date & Time */}
          <div className='grid grid-cols-2 gap-4'>
            {/* End Date */}
            <div className='flex flex-col gap-1'>
              <Label htmlFor='endDate'>End Date</Label>
              <EndDatePicker
                value={formData.endDate}
                onChange={(d) => setFormData({ ...formData, endDate: d })}
                startDate={formData.startDate}
                disabled={!formData.startDate}
              />
              {validationErrors.endDate && (
                <ErrorMessage message={validationErrors.endDate} />
              )}
            </div>

            {/* End Time */}
            <div className='flex flex-col gap-1'>
              <Label>End Time</Label>
              <Select
                value={formData.endTime}
                onValueChange={(value) =>
                  setFormData({ ...formData, endTime: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select Time' />
                </SelectTrigger>
                <SelectContent>
                  {getEndTimeOptions(
                    formData.startTime,
                    timeoptions,
                    formData.startDate,
                    formData.endDate
                  ).map((time) => (
                    <SelectItem value={time} key={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.endTime && (
                <ErrorMessage message={validationErrors.endTime} />
              )}
            </div>
          </div>
        </div>

        <div className='space-y-6 px-6 py-5'>
          <div className='flex items-end gap-3 justify-end'>
            <Button variant='outline' onClick={() => router.push('/posts')}>
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={handleCreate}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Post'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
