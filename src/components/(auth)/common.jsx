'use client';

import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { Input } from '../ui/input';

export const PasswordInput = ({
  placeholder,
  value,
  onChange,
  className,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className='relative h-10 border border-gray-300 overflow-hidden rounded-md focus-within:ring-1 focus-within:ring-brand-500 focus-within:border-brand-500 bg-white'>
      <Input
        type={isPasswordVisible ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
        className={
          'pr-12 h-full border-none focus-visible:ring-0 focus-visible:border-0 shadow-none'
        }
      />
      <button
        type={'button'}
        onClick={() => setIsPasswordVisible((prevState) => !prevState)}
        className='absolute inset-y-0 w-10 border-l border-gray-300 flex items-center justify-center right-0'
      >
        {isPasswordVisible ? (
          <EyeIcon size={20} className='text-gray-400' />
        ) : (
          <EyeOffIcon size={20} className='text-gray-400' />
        )}
      </button>
    </div>
  );
};
