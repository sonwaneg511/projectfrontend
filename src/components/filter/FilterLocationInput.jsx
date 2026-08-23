'use client';

import { Check, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Input } from '../ui/input';

export default function MultiSelectSearch({
  locations = [], // [{ value: string, label: string }]
  value = [], // selected values: string[]
  onChange = () => {},
  placeholder = 'Select Location Id',
}) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  /* ---------------- click outside ---------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setQ('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setQ('');
  }, [value]);

  /* ---------------- search filter ---------------- */
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return locations;

    return locations.filter((l) =>
      `${l.value} ${l.label || ''}`.toLowerCase().includes(term)
    );
  }, [locations, q]);

  /* ---------------- selection logic ---------------- */
  const toggleSelect = (val) => {
    const next = value.includes(val)
      ? value.filter((v) => v !== val)
      : [...value, val];

    onChange(next);
  };

  const isSelected = (val) => value.includes(val);

  /* ---------------- input display ---------------- */
  const displayText = value
    .map((v) => locations.find((l) => l.value === v))
    .filter(Boolean)
    .map((item) => item.value)
    .join(', ');

  return (
    <div className='relative w-full mt-1.5' ref={wrapperRef}>
      {/* Input */}
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />

        <Input
          value={open ? q : displayText}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          placeholder={placeholder}
          className='w-full h-10 pl-10 pr-3 text-sm rounded-md'
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className='absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-50'>
          {filtered.map((item) => (
            <div
              key={item.value}
              onClick={() => toggleSelect(item.value)}
              className='flex items-center justify-between px-4 py-3 text-sm cursor-pointer hover:bg-gray-50'
            >
              <div>
                <div className='text-gray-800'>{item.value}</div>
                {/* {item.label && (
                  <div className='text-xs text-gray-500'>{item.label}</div>
                )} */}
              </div>

              {isSelected(item.value) && (
                <Check className='w-4 h-4 text-brand-600' />
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className='p-3 text-sm text-gray-500'>No results found</div>
          )}
        </div>
      )}
    </div>
  );
}
