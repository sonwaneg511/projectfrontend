'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { OperationHoursEditor } from '../../components/locations/OperationHoursEditor';
import {
  buildUpdatePayload,
  getChangedFields,
  validateChangedFields,
} from '../../components/locations/utils/util';
import {
  facebookSchema,
  gmbSchema,
  locationSchema,
} from '../../components/locations/validations/location.schema';
import { ErrorMessage } from '../ui/error-message';
import { Label, LabelInputContainer } from '../ui/label';

export default function ModifyDetailsSheet({
  open,
  onOpenChange,
  title,
  subtitle,
  items = [],
  initialValues = {},
  onSave,
  isSaving = false,
  value,
}) {
  const [form, setForm] = useState({});
  const [initialSnapshot, setInitialSnapshot] = useState({});
  const [errors, setErrors] = useState({});

  /* ---------------- init form ---------------- */
  // biome-ignore lint/correctness/useExhaustiveDependencies: 👀 this is a workaround for the bug
  useEffect(() => {
    if (open) {
      setForm(initialValues || {});
      setInitialSnapshot(initialValues || {});
    }
  }, [open]);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // get only modified UI fields
    const changedPayload = getChangedFields(form, initialSnapshot);

    let validation;

    // Decide schema by section
    if (title === 'Modify Location Overview') {
      validation = validateChangedFields(locationSchema, changedPayload);
    }

    if (title === 'Google My Business Details') {
      validation = validateChangedFields(gmbSchema, changedPayload);
    }

    if (title === 'Facebook Details') {
      validation = validateChangedFields(facebookSchema, changedPayload);
    }

    if (validation && !validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});

    // map UI changes → backend payload
    const finalPayload = buildUpdatePayload(changedPayload);

    // send to parent / API
    onSave?.(finalPayload);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side='right'
        className='w-[640px] sm:max-w-none flex flex-col p-0'
      >
        <SheetHeader className='px-6 pt-5'>
          <SheetTitle className='font-body text-gray-900 text-lg font-semibold'>
            {title}
          </SheetTitle>
          {subtitle && (
            <SheetDescription className='text-sm text-gray-600'>
              {subtitle}
            </SheetDescription>
          )}
        </SheetHeader>

        {/* ---------------- FORM ---------------- */}
        <div className='flex-1 overflow-y-auto mt-6 space-y-4 px-6 pb-2'>
          {items.map((item) => (
            <FormField
              key={item.key}
              item={item}
              value={form[item.key] ?? ''}
              onChange={(v) => update(item.key, v)}
              errors={errors[item.key]}
            />
          ))}
        </div>

        {/* ---------------- FOOTER ---------------- */}
        <div className='p-5 border-t flex justify-end gap-3'>
          <Button
            variant='secondary'
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>

          <Button variant='primary' onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save Modifications'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ======================================================
   Field Renderer
====================================================== */
function FormField({ item, value, onChange, errors }) {
  const { label, type, options, placeholder } = item;

  if (type === 'link') {
    return (
      <LabelInputContainer>
        <Label>{label}</Label>
        <div className='relative overflow-hidden focus-within:ring-1 focus-within:ring-brand-500 focus-within:border-brand-500 rounded-md'>
          <span className='absolute inset-y-0 flex items-center border-r px-2 cursor-none'>
            https:
          </span>
          <Input
            className='pl-16 focus-visible:ring-0 focus-visible:border-0 shadow-none read-only:focus-visible:ring-0'
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {errors && <ErrorMessage message={errors} />}
        </div>
      </LabelInputContainer>
    );
  }

  if (type === 'tags') {
    return (
      <div className='space-y-2'>
        <Label htmlFor='labels'>{label}</Label>
        <div className='flex flex-wrap gap-2'>
          {value.map((tag, index) => (
            <span
              key={index}
              className='bg-gray-100 px-2 py-1 rounded text-sm flex items-center gap-1'
            >
              {tag}
              <button
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                className='text-gray-500'
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <Input
          placeholder='Add label & press Enter'
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (!e.target.value.trim()) return;

              onChange([...value, e.target.value.trim()]);
              e.target.value = '';
            }
          }}
        />
        {errors && <ErrorMessage message={errors} />}
      </div>
    );
  }

  if (type === 'operation_hours') {
    return (
      <OperationHoursEditor label={label} value={value} onChange={onChange} />
    );
  }

  return (
    <div className='space-y-1'>
      {/** biome-ignore lint/a11y/noLabelWithoutControl: <> */}
      <label className='text-sm font-medium text-gray-700'>{label}</label>

      {type === 'input' && (
        <>
          <Input
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
          {errors && <ErrorMessage message={errors} />}
        </>
      )}

      {type === 'textarea' && (
        <>
          <Textarea
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
          {errors && <ErrorMessage message={errors} />}
        </>
      )}

      {type === 'select' && (
        <Select
          value={value != null ? String(value) : undefined}
          onValueChange={(val) => onChange(Number(val))}
        >
          <SelectTrigger>
            <SelectValue placeholder={placeholder || 'Select'} />
          </SelectTrigger>

          <SelectContent>
            {options?.map((option) => (
              <SelectItem key={option.value} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
