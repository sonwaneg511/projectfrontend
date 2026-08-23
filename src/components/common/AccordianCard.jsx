'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';

export default function DetailsAccordionCard({ title, items = [], children }) {
  return (
    <Card className='border bg-white rounded-lg'>
      <Accordion type='single' collapsible defaultValue='item-1'>
        <AccordionItem value='item-1' className='border-none'>
          <AccordionTrigger className='px-6 py-5 text-lg text-gray-900 font-semibold'>
            {title}
          </AccordionTrigger>

          <AccordionContent className='p-6 border-t'>
            {/* Grid */}
            {items.length > 0 ? (
              <div
                className='
                grid gap-x-10 gap-y-6
                grid-cols-[repeat(auto-fit,minmax(220px,1fr))]
              '
              >
                {items.map((item, index) => (
                  <div key={index}>
                    <p className='text-sm text-gray-700 font-semibold'>
                      {item.label}
                    </p>
                    <div className='text-sm font-regular text-gray-600 wrap-break-word'>
                      {item.value || '-'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              children
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
