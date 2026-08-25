import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { ASSET_TYPES, COMPONENT_CATALOGUE } from '../component-catalogue';

const MEDIA_TYPES = [
  ASSET_TYPES.IMAGE,
  ASSET_TYPES.VIDEO,
  ASSET_TYPES.FILE_UPLOAD,
];

function hydrateMediaEntry(entry) {
  return entry ? { ...entry, _localId: uuid(), kind: 'existing' } : entry;
}

function hydrateEntries(component, spec) {
  const rawEntries = component.config?.entries ?? [];

  if (spec.assetType === ASSET_TYPES.COMPOSITE) {
    return rawEntries.map((entry) => {
      const next = { ...entry, _localId: uuid() };
      for (const field of spec.fields) {
        if (MEDIA_TYPES.includes(field.assetType) && next[field.fieldKey]) {
          next[field.fieldKey] = hydrateMediaEntry(next[field.fieldKey]);
        }
      }
      return next;
    });
  }

  if (MEDIA_TYPES.includes(spec.assetType)) {
    return rawEntries.map(hydrateMediaEntry);
  }

  return rawEntries;
}

function buildInitialState(components) {
  const state = {};

  for (const component of components ?? []) {
    const spec = COMPONENT_CATALOGUE[component.component_type];
    if (!spec) continue;

    state[component.component_type] = {
      id: component.id,
      order: component.order,
      enabled: component.enabled,
      resolvedScope: component.resolved_scope,
      entries: hydrateEntries(component, spec),
    };
  }

  return state;
}

function getInitialTemplateId(components) {
  return Array.isArray(components) ? null : (components?.template_id ?? null);
}

export function useMicrositeForm(components) {
  const [formState, setFormState] = useState(() =>
    buildInitialState(components)
  );
  const [dirtyTypes, setDirtyTypes] = useState(() => new Set());
  const [templateId, setTemplateIdState] = useState(() =>
    getInitialTemplateId(components)
  );
  const [templateDirty, setTemplateDirty] = useState(false);

  useEffect(() => {
    setFormState(buildInitialState(components));
    setDirtyTypes(new Set());
    setTemplateIdState(getInitialTemplateId(components));
    setTemplateDirty(false);
  }, [components]);

  const updateEntries = (componentType, nextEntries) => {
    setFormState((prev) => ({
      ...prev,
      [componentType]: { ...prev[componentType], entries: nextEntries },
    }));
    setDirtyTypes((prev) => new Set(prev).add(componentType));
  };

  const setTemplateId = (id) => {
    setTemplateIdState(id);
    setTemplateDirty(true);
  };

  const markAllClean = () => {
    setDirtyTypes(new Set());
    setTemplateDirty(false);
  };

  return {
    formState,
    updateEntries,
    templateId,
    setTemplateId,
    hasDirtyChanges: dirtyTypes.size > 0 || templateDirty,
    markAllClean,
  };
}
