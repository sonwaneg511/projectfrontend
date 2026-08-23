'use client';

import { Pencil } from 'lucide-react';
import { useState } from 'react';
import ModifyDetailsSheet from '@/components/common/ModifyDetailsSheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ModifyAccordianDetails({
  title,
  items = [], // [{ label, value }]
  editableFields = [], // <-- fields config for sheet
  initialValues = {}, // <-- data for form
  onSave, // <-- API call
  children,
  icon = null,
  badge = null,
  type = null,
  subtitle = null,
  variant,
}) {
  const [openSheet, setOpenSheet] = useState(false);

  return (
    <>
      {/* ================= ACCORDION ================= */}
      <Card className='border bg-white rounded-lg'>
        <Accordion type='single' collapsible defaultValue='item-1'>
          <AccordionItem value='item-1' className='border-none'>
            {/* Header */}
            <AccordionTrigger className='px-6 py-5 text-lg text-gray-900 font-semibold'>
              <div className='flex items-center justify-between w-full'>
                <div className='flex items-center gap-2'>
                  {icon && <span className='shrink-0'>{icon}</span>}
                  <span className='text-gray-900 font-semibold text-lg'>
                    {title}
                  </span>

                  {/* {badge && <Badge variant={'success'}>{badge}</Badge>} */}
                </div>

                {/* MODIFY BUTTON */}
                {variant === 'modify' && (
                  <Button
                    type='button'
                    variant='secondary'
                    className='mr-4'
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenSheet(true);
                    }}
                  >
                    <Pencil className='w-4 h-4 mr-1 text-gray-500' />
                    Modify
                  </Button>
                )}
              </div>
            </AccordionTrigger>

            {/* Content */}
            <AccordionContent className='p-6 border-t'>
              {items.length > 0 ? (
                <div
                  className='
                    grid gap-x-10 gap-y-6
                    grid-cols-[repeat(auto-fit,minmax(220px,1fr))]
                  '
                >
                  {items.map((item, index) => (
                    <InfoItem
                      key={index}
                      label={item.label}
                      value={item.value}
                      type={item.type}
                    />
                  ))}
                </div>
              ) : (
                children
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      {/* ================= MODIFY SHEET ================= */}
      <ModifyDetailsSheet
        open={openSheet}
        onOpenChange={setOpenSheet}
        title={`Modify ${title}`}
        subtitle={subtitle}
        items={editableFields}
        initialValues={initialValues}
        onSave={(payload) => {
          onSave?.(payload);
          setOpenSheet(false);
        }}
      />
    </>
  );
}

/* -----------------------------
   Helper
------------------------------ */
function InfoItem({ label, value, type }) {
  const isEmpty =
    value === null ||
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0);

  if (type === 'operation_hours' && value) {
    return (
      <div className='col-span-full'>
        <p className='text-sm text-gray-700 font-semibold mb-3'>{label}</p>
        <div className='flex flex-wrap gap-0'>
          {Object.entries(value).map(([day, hours]) => (
            <div
              key={day}
              className={`
                min-w-[120px]
                border
                ${day === 'monday' ? 'rounded-l-lg' : ''}
                ${day === 'sunday' ? 'rounded-r-lg' : ''}
                border-gray-200
                px-3
                py-2
                bg-white
                text-sm
              `}
            >
              <p className='font-medium text-gray-600 capitalize'>{day}</p>

              <p className='text-gray-600 font-regular'>
                {hours?.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (type === 'link' && value) {
    const isValidUrl =
      value.startsWith('http://') || value.startsWith('https://');

    return (
      <div className='col-span-full'>
        <p className='text-sm text-gray-700 font-semibold'>{label}</p>

        <div className='text-sm wrap-break-word'>
          {isEmpty ? (
            '-'
          ) : (
            <a
              href={isValidUrl ? value : `https://${value}`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:underline break-all'
            >
              {value}
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className='text-sm text-gray-700 font-semibold'>{label}</p>
      <div className='text-sm text-gray-600 wrap-break-word'>
        {isEmpty ? '-' : value}
      </div>
    </div>
  );
}
