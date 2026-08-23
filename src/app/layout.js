import { Toaster } from '@/components/ui/sonner';
import '@styles/globals.css';
import '@styles/typography.css';
import { Inter, Manrope } from 'next/font/google';
import { Providers } from './providers';
import { SessionHandler } from './session-handler';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

export default function RootLayout({ children }) {
  return (
    <html
      lang='en'
      className={`${inter.variable} ${manrope.variable} max-w-[1440px] mx-auto w-full`}
    >
      <body>
        <Providers>{children}</Providers>
        <Toaster />
        <SessionHandler />
      </body>
    </html>
  );
}
