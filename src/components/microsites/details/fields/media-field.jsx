'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuid } from 'uuid';
import {
  MulitImagesUpload,
  MultiImagesPreview,
  MultiImagesUploadInput,
} from '@/components/common/multi-images-upload';
import SingleImageUpload from '@/components/common/SingleImageUpload';
import { ErrorMessage } from '@/components/ui/error-message';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ASSET_TYPES, toImageUploadRules } from '../../component-catalogue';
import { validateMediaFile } from '../validate-media-file';

export function MediaField({
  componentType,
  spec,
  entries,
  onChange,
  error,
  disabled,
}) {
  const isMulti = (spec.maxEntries ?? 1) > 1;
  const isImage = spec.assetType === ASSET_TYPES.IMAGE;
  const [urlDraft, setUrlDraft] = useState('');

  const addNewFileEntry = async (file) => {
    if (!file) {
      onChange([]);
      return;
    }
    const validationError = await validateMediaFile(
      file,
      spec.constraints || {}
    );
    if (validationError) {
      toast.error(validationError);
      return;
    }
    const nextEntry = { _localId: uuid(), kind: 'new', file };
    onChange(isMulti ? [...entries, nextEntry] : [nextEntry]);
  };

  const addUrlEntry = () => {
    if (!urlDraft.trim()) return;
    const nextEntry = {
      _localId: uuid(),
      kind: 'new',
      url: urlDraft.trim(),
      source: 'URL',
    };
    onChange(isMulti ? [...entries, nextEntry] : [nextEntry]);
    setUrlDraft('');
  };

  if (!isImage) {
    // VIDEO / FILE_UPLOAD - simple native picker, no drag-drop chrome.
    const current = entries[0];
    return (
      <div className='flex w-full flex-col gap-2.5'>
        <Label>{spec.label}</Label>
        {current ? (
          <div className='flex items-center gap-3 text-sm'>
            <span className='truncate'>
              {current.file?.name || current.url}
            </span>
            <button
              type='button'
              className='text-red-600 text-xs shrink-0'
              onClick={() => onChange([])}
              disabled={disabled}
            >
              Remove
            </button>
          </div>
        ) : (
          <input
            type='file'
            accept={(spec.constraints?.formats || [])
              .map((f) => `.${f}`)
              .join(',')}
            disabled={disabled}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              await addNewFileEntry(file);
              e.target.value = '';
            }}
          />
        )}
        {error && <ErrorMessage message={error} />}
      </div>
    );
  }

  const localImages = entries.map((e) => ({
    id: e._localId,
    file: e.file,
    url: e.url,
  }));

  return (
    <div className='flex w-full flex-col gap-2.5'>
      <Label>{spec.label}</Label>
      <Tabs defaultValue='photo' variant='default'>
        <TabsList className='flex w-full'>
          <TabsTrigger value='photo'>Image</TabsTrigger>
          <TabsTrigger value='url'>URL</TabsTrigger>
        </TabsList>
        <TabsContent value='photo'>
          {isMulti ? (
            <MulitImagesUpload
              columns={Math.min(spec.maxEntries, 4)}
              maxImages={spec.maxEntries}
              localImages={localImages}
              onChange={(images) =>
                onChange(
                  images.map((img) => ({
                    _localId: img.id,
                    kind: img.file ? 'new' : 'existing',
                    file: img.file,
                    url: img.url,
                    source: img.file ? undefined : 'UPLOAD',
                  }))
                )
              }
            >
              <MultiImagesPreview />
              <MultiImagesUploadInput
                rules={toImageUploadRules(spec.constraints)}
              />
            </MulitImagesUpload>
          ) : (
            <SingleImageUpload
              value={entries[0]?.url}
              onChange={(file) => addNewFileEntry(file)}
            />
          )}
        </TabsContent>
        <TabsContent value='url' className='mt-1.5'>
          <Label htmlFor={`${componentType}-url`}>Image URL</Label>
          <div className='flex gap-2 mt-2'>
            <Input
              id={`${componentType}-url`}
              placeholder='https://'
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              disabled={disabled}
            />
            <button
              type='button'
              onClick={addUrlEntry}
              className='text-sm font-semibold text-brand-700 shrink-0'
              disabled={disabled}
            >
              Add
            </button>
          </div>
        </TabsContent>
      </Tabs>
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
