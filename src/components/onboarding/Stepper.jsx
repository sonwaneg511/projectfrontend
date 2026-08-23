'use client';
import { Check } from 'lucide-react';

export function Stepper({ currentStep = 1, totalSteps = 4 }) {
  return (
    <div className='flex items-center justify-center gap-0'>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        console.log(stepNumber, 'stepNumber');
        console.log(isCompleted, 'isCompleted');

        return (
          <div key={stepNumber} className='flex items-center'>
            {/* Step Circle */}
            <div
              className={`flex h-6 w-6 mr-0.5 items-center justify-center rounded-full transition-all ${
                isCompleted
                  ? 'bg-brand-600 text-white'
                  : isCurrent
                    ? 'bg-white ring-2 ring-brand-600'
                    : 'bg-white ring-2 ring-border'
              }`}
            >
              {isCompleted && <Check className='h-4 w-4' />}

              {isCurrent && !isCompleted && (
                <span className='h-4 w-4 rounded-full bg-brand-600'>
                  <span className='h-2 w-2 rounded-full bg-brand-600' />
                </span>
              )}
              {!isCurrent && !isCompleted && (
                <span className='h-2 w-2 rounded-full bg-gray-300' />
              )}
            </div>

            {/* Connector Line */}
            {stepNumber < totalSteps && (
              <div
                className={`h-0.5 w-18 transition-all ${
                  isCompleted ? 'bg-brand-600' : 'bg-border'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
