'use client';

import { PlusIcon, XIcon } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/components/ui/error-message';
import { Label } from '@/components/ui/label';
import { ASSET_TYPES } from '../../component-catalogue';
import { FieldRenderer } from './field-renderer';

const MEDIA_TYPES = [
  ASSET_TYPES.IMAGE,
  ASSET_TYPES.VIDEO,
  ASSET_TYPES.FILE_UPLOAD,
];

function emptyCardEntry(spec) {
  const entry = { _localId: uuid() };
  for (const field of spec.fields) {
    entry[field.fieldKey] = MEDIA_TYPES.includes(field.assetType) ? null : '';
  }
  return entry;
}

export function CompositeField({
  componentType,
  spec,
  entries,
  onChange,
  error,
  disabled,
}) {
  const handleAddCard = () => onChange([...entries, emptyCardEntry(spec)]);

  const handleRemoveCard = (localId) =>
    onChange(entries.filter((e) => e._localId !== localId));

  const handleFieldChange = (cardIdx, fieldKey, nextValue) => {
    const next = entries.slice();
    next[cardIdx] = { ...next[cardIdx], [fieldKey]: nextValue };
    onChange(next);
  };

  return (
    <div className='flex w-full flex-col gap-3'>
      <Label>
        {spec.label}
        {spec.maxEntries ? ` (Max ${spec.maxEntries})` : ''}
      </Label>
      {entries.map((entry, idx) => (
        <div
          key={entry._localId}
          className='border rounded-lg p-4 space-y-4 relative'
        >
          <button
            type='button'
            onClick={() => handleRemoveCard(entry._localId)}
            disabled={disabled}
            className='absolute top-2 right-2 text-gray-400 hover:text-red-600'
          >
            <XIcon className='size-4' />
          </button>
          {spec.fields.map((field) => {
            const subSpec = {
              ...field,
              minEntries: field.mandatory ? 1 : 0,
              maxEntries: 1,
            };
            const isMedia = MEDIA_TYPES.includes(field.assetType);
            const value = entry[field.fieldKey];
            const subEntries = isMedia ? (value ? [value] : []) : [value ?? ''];

            return (
              <FieldRenderer
                key={field.fieldKey}
                componentType={`${componentType}.${field.fieldKey}`}
                spec={subSpec}
                entries={subEntries}
                onChange={(nextSubEntries) =>
                  handleFieldChange(
                    idx,
                    field.fieldKey,
                    isMedia
                      ? (nextSubEntries[0] ?? null)
                      : (nextSubEntries[0] ?? '')
                  )
                }
                disabled={disabled}
              />
            );
          })}
        </div>
      ))}
      {entries.length < spec.maxEntries && (
        <Button
          variant='outline'
          size='sm'
          className='w-fit'
          onClick={handleAddCard}
          disabled={disabled}
        >
          <PlusIcon className='size-4 mr-1' /> Add {spec.label}
        </Button>
      )}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
