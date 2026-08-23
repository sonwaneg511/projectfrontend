'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { SegmentedRadioGroup } from '@/components/common/SegmentedRadioGroup';
import SingleImageUpload from '@/components/common/SingleImageUpload';
import { createPostFBSchema } from '@/components/create-post/schema/createPostFB.schema';
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
  createLinkFB,
  createPhotoFB,
  createTextFB,
} from '@/constants/createPost_constant';
import { ActionTypeUrlOption, fbposttypeoption } from '@/constants/static_data';
import { buildBackendDateTime, cn, mapZodErrors } from '@/lib/utils';
import { normalizeUrl } from '../location-details/location-details.schema';

export default function FacebookForm({
  onSubmit,
  isSubmitting,
  dealerIdOptions,
}) {
  const [postType, setPostType] = useState('text');
  const [formData, setFormData] = useState(createTextFB);
  const [imageFile, setImageFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
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
    const result = createPostFBSchema.safeParse(formData);

    const isPhoto = formData?.postImageType === 'photo';

    if (!result.success) {
      toast.error('Required fields cannot be empty');
      const errors = mapZodErrors(result.error.issues);

      if (isPhoto && !imageFile) {
        errors.imageUrl = 'Image is required.';
      }

      setValidationErrors(errors);
      return;
    }

    const payload = {
      summary: formData.postSummary,
      action_type: formData.actionType,
      action_url: formData.actionTypeUrl
        ? normalizeUrl(formData.actionTypeUrl)
        : '',
      media_format: 'PHOTO',
      dealer_id: formData.dealer_id,
      image_url: formData.imageUrl ? normalizeUrl(formData.imageUrl) : '', // URL for now
      post_type: formData.postType,
      label: formData.label,
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
                  case 'text':
                    setFormData(createTextFB);
                    break;
                  case 'link':
                    setFormData(createLinkFB);
                    break;
                  case 'photo':
                    setFormData(createPhotoFB);
                    break;
                }
              }}
              options={fbposttypeoption}
            />
          </div>
          {/* Post Text */}
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
              {formData.label.length}/500
            </p>
          </div>

          {postType === 'link' && (
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
          {postType === 'photo' && (
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
                  <TabsTrigger value='photo'>Image</TabsTrigger>
                  <TabsTrigger value='url'>URL</TabsTrigger>
                </TabsList>
                <TabsContent value='photo'>
                  <SingleImageUpload onChange={handlePostImageUpload} />
                  {validationErrors.imageUrl && (
                    <ErrorMessage message={validationErrors.imageUrl} />
                  )}
                </TabsContent>
                <TabsContent value='url' className='mt-1.5'>
                  <Label htmlFor='photoUrl'>Image URL</Label>
                  <Input
                    id='photoUrl'
                    placeholder='https://'
                    className='mt-2'
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        imageUrl: e.target.value,
                      })
                    }
                  />
                  {validationErrors.imageUrl && (
                    <ErrorMessage message={validationErrors.imageUrl} />
                  )}
                </TabsContent>
              </Tabs>
            </div>
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
        <div className='space-y-1.5 px-6 py-5 border-b'>
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
              Create Post
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
