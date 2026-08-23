import { cn } from '@/lib/utils';

export const Checkbox = ({ checked, className, onChange, ...props }) => (
  <input
    type='checkbox'
    checked={checked}
    onChange={onChange}
    className={cn(
      'size-4 rounded border-gray-300 accent-brand-600 cursor-pointer',
      className
    )}
    {...props}
  />
);
