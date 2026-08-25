'use client';

import { PlusIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/components/ui/error-message';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ASSET_TYPES } from '../../component-catalogue';

export function TextField({ spec, entries, onChange, error, disabled }) {
  const isMulti = (spec.maxEntries ?? 1) > 1;
  const Control = spec.assetType === ASSET_TYPES.LONG_TEXT ? Textarea : Input;
  const inputType = spec.assetType === ASSET_TYPES.URL ? 'url' : 'text';
  const maxChars = spec.constraints?.maxChars;
  const values = entries.length ? entries : isMulti ? [] : [''];

  const handleChangeAt = (idx, value) => {
    const next = values.slice();
    next[idx] = value;
    onChange(next);
  };

  const handleAdd = () => onChange([...values, '']);
  const handleRemove = (idx) => onChange(values.filter((_, i) => i !== idx));

  return (
    <div className='flex w-full flex-col gap-2.5'>
      <Label>
        {spec.label}
        {isMulti ? ` (Max ${spec.maxEntries})` : ''}
      </Label>
      {values.map((value, idx) => (
        <div key={idx} className={isMulti ? 'flex gap-3 items-start' : ''}>
          <div className='flex-1'>
            <Control
              type={inputType}
              placeholder={isMulti ? `${spec.label} ${idx + 1}` : spec.label}
              value={value}
              maxLength={maxChars || undefined}
              disabled={disabled}
              onChange={(e) => handleChangeAt(idx, e.target.value)}
            />
            {maxChars ? (
              <p className='text-xs text-gray-500 mt-1'>
                Max {maxChars} characters
              </p>
            ) : null}
          </div>
          {isMulti && values.length > (spec.minEntries || 0) && (
            <Button
              variant='outline'
              size='icon'
              className='size-10'
              onClick={() => handleRemove(idx)}
              disabled={disabled}
            >
              <XIcon className='size-4' />
            </Button>
          )}
        </div>
      ))}
      {isMulti && values.length < spec.maxEntries && (
        <Button
          variant='outline'
          size='sm'
          className='w-fit'
          onClick={handleAdd}
          disabled={disabled}
        >
          <PlusIcon className='size-4 mr-1' /> Add
        </Button>
      )}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
