import { ASSET_TYPES, COMPONENT_CATALOGUE } from '../component-catalogue';

const MEDIA_TYPES = [
  ASSET_TYPES.IMAGE,
  ASSET_TYPES.VIDEO,
  ASSET_TYPES.FILE_UPLOAD,
];

function validateComponent(spec, entries) {
  if (spec.assetType === ASSET_TYPES.COMPOSITE) {
    for (const entry of entries) {
      for (const field of spec.fields) {
        if (!field.mandatory) continue;
        const value = entry[field.fieldKey];
        const isMedia = MEDIA_TYPES.includes(field.assetType);
        const isEmpty = isMedia ? !value : !value?.trim?.();
        if (isEmpty) {
          return `${field.label} is required for every ${spec.label} entry.`;
        }
      }
    }
    return null;
  }

  if (
    MEDIA_TYPES.includes(spec.assetType) &&
    entries.length < (spec.minEntries || 0)
  ) {
    return `${spec.label} needs at least ${spec.minEntries} item${
      spec.minEntries > 1 ? 's' : ''
    }.`;
  }

  return null;
}

function serializeMediaEntry(entry, fileRef, formData) {
  if (!entry) return null;

  if (entry.kind === 'new' && entry.file) {
    formData.append(fileRef, entry.file);
    return { file_ref: fileRef, source: 'UPLOAD', order_index: 0 };
  }

  if (entry.kind === 'new' && entry.url) {
    return { url: entry.url, source: 'URL', order_index: 0 };
  }

  const { _localId, kind: _kind, file: _file, ...rest } = entry;
  return rest;
}

function buildComponentConfig(componentType, spec, entries, formData) {
  if (spec.assetType === ASSET_TYPES.COMPOSITE) {
    return {
      entries: entries.map((entry, idx) => {
        const out = {};
        for (const field of spec.fields) {
          const value = entry[field.fieldKey];
          out[field.fieldKey] = MEDIA_TYPES.includes(field.assetType)
            ? serializeMediaEntry(
                value,
                `${componentType}_${idx}_${field.fieldKey}`,
                formData
              )
            : (value ?? '');
        }
        return out;
      }),
    };
  }

  if (MEDIA_TYPES.includes(spec.assetType)) {
    return {
      entries: entries.map((entry, idx) =>
        serializeMediaEntry(entry, `${componentType}_${idx}`, formData)
      ),
    };
  }

  if (
    spec.assetType === ASSET_TYPES.CHECKBOX ||
    spec.assetType === ASSET_TYPES.RADIO
  ) {
    return {
      entries: entries.map(({ label, selected }) => ({ label, selected })),
    };
  }

  return { entries: entries.filter((value) => value?.trim?.()) };
}

export async function submitMicrositeForm({
  formState,
  templateId,
  clientId,
  dealerId,
  createdBy,
  saveMutateAsync,
  markAllClean,
}) {
  const errors = {};

  for (const [componentType, data] of Object.entries(formState)) {
    const spec = COMPONENT_CATALOGUE[componentType];
    if (!spec) continue;
    const error = validateComponent(spec, data.entries);
    if (error) errors[componentType] = error;
  }

  if (Object.keys(errors).length) {
    return { status: 'invalid', errors };
  }

  const formData = new FormData();
  const components = Object.entries(formState).map(([componentType, data]) => ({
    component_type: componentType,
    config: buildComponentConfig(
      componentType,
      COMPONENT_CATALOGUE[componentType],
      data.entries,
      formData
    ),
  }));

  formData.append(
    'data',new Blob([ JSON.stringify({
      client_id: clientId,
      dealer_id: dealerId,
      template_id: templateId,
      components,
      created_by: createdBy,
    })],{type: 'application/json'})
  );

  try {
    await saveMutateAsync(formData);
    markAllClean();
    return { status: 'success' };
  } catch (err) {
    return {
      status: 'upload-error',
      message: err?.message || 'Failed to save changes.',
    };
  }
}
