'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label='Toggle theme'
    >
      <Sun className='block h-4 w-4 dark:hidden' />
      <Moon className='hidden h-4 w-4 dark:block' />
    </Button>
  );
}
