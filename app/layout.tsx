import type { Metadata } from 'next';
import './globals.css';
import { DesktopProvider } from './context/DesktopContext';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'Jared Grimes',
  description: 'Personal website of Jared Grimes',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' />
      </head>
      <body className={`font-sans antialiased overflow-hidden`}>
        <DesktopProvider>
          {children}
        </DesktopProvider>
        <Analytics />
      </body>
    </html>
  );
}
