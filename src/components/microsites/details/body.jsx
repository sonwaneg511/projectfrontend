'use client';

import { COMPONENT_CATALOGUE } from '../component-catalogue';
import { FieldRenderer } from './fields/field-renderer';
import { TemplateSelector } from './template-selector';

export const MicrositeDetailsBody = ({
  components,
  formState,
  onFieldChange,
  templateId,
  onTemplateChange,
}) => {
  const renderableComponents = components.filter(
    (component) => COMPONENT_CATALOGUE[component.component_type]
  );

  return (
    <div className='p-4 flex-1 overflow-y-auto bg-gray-50'>
      <div className='my-6 bg-white border rounded-lg max-w-160 mx-auto'>
        <div className='px-6 py-5 border-b'>
          <h3 className='text-lg font-semibold text-gray-900 font-body'>
            Template
          </h3>
        </div>
        <div className='px-6 py-5'>
          <TemplateSelector value={templateId} onChange={onTemplateChange} />
        </div>
      </div>
      <div className='my-6 bg-white border rounded-lg max-w-160 mx-auto'>
        <div className='px-6 py-5 border-b'>
          <h3 className='text-lg font-semibold text-gray-900 font-body'>
            Details
          </h3>
        </div>
        <div className='space-y-6 px-6 py-5'>
          {renderableComponents.map((component) => {
            const componentType = component.component_type;
            const spec = COMPONENT_CATALOGUE[componentType];
            const entry = formState[componentType];
            if (!entry) return null;

            return (
              <FieldRenderer
                key={componentType}
                componentType={componentType}
                spec={spec}
                entries={entry.entries}
                onChange={(nextEntries) =>
                  onFieldChange(componentType, nextEntries)
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
