'use client';

import { ASSET_TYPES } from '../../component-catalogue';
import { CheckboxField } from './checkbox-field';
import { CompositeField } from './composite-field';
import { MediaField } from './media-field';
import { RadioField } from './radio-field';
import { TextField } from './text-field';

export function FieldRenderer({
  componentType,
  spec,
  entries,
  onChange,
  error,
  disabled,
}) {
  switch (spec.assetType) {
    case ASSET_TYPES.IMAGE:
    case ASSET_TYPES.VIDEO:
    case ASSET_TYPES.FILE_UPLOAD:
      return (
        <MediaField
          componentType={componentType}
          spec={spec}
          entries={entries}
          onChange={onChange}
          error={error}
          disabled={disabled}
        />
      );
    case ASSET_TYPES.FREE_TEXT:
    case ASSET_TYPES.LONG_TEXT:
    case ASSET_TYPES.URL:
      return (
        <TextField
          spec={spec}
          entries={entries}
          onChange={onChange}
          error={error}
          disabled={disabled}
        />
      );
    case ASSET_TYPES.CHECKBOX:
      return (
        <CheckboxField
          spec={spec}
          entries={entries}
          onChange={onChange}
          error={error}
          disabled={disabled}
        />
      );
    case ASSET_TYPES.RADIO:
      return (
        <RadioField
          spec={spec}
          entries={entries}
          onChange={onChange}
          error={error}
          disabled={disabled}
        />
      );
    case ASSET_TYPES.COMPOSITE:
      return (
        <CompositeField
          componentType={componentType}
          spec={spec}
          entries={entries}
          onChange={onChange}
          error={error}
          disabled={disabled}
        />
      );
    default:
      return null;
  }
}
