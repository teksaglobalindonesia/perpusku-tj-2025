import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import {
  Roboto,
  Bebas_Neue,
  Urbanist,
} from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';
import "animate.css/animate.compat.css";
import { ReactQueryClientProvider } from '@/providers/ReactQueryClientProvider';

export const metadata: Metadata = {
  title: 'Teksa Web Starter',
  description: 'Teksa Web Starter Description'
};

const bebasNeueFont = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bebas-neue'
});

const robotoFont = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto'
});

const urbanistFont = Urbanist({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-urbanist'
});

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryClientProvider>
      <html
        lang="en"
        className={`${bebasNeueFont.variable} ${urbanistFont.variable} ${robotoFont.variable}`}
        suppressHydrationWarning={true}
      >
        <body>
          <NextTopLoader showSpinner={false} height={4} />
          <Toaster />
          {children}
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
