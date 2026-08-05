import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Jared Grimes',
  description: 'Personal website of Jared Grimes',
};

export const viewport: Viewport = {
  themeColor: '#ffffeb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' style={{ backgroundColor: '#ffffeb' }}>
      <head>
        <meta name='theme-color' content='#ffffeb' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover' />
      </head>
      <body className='font-sans antialiased overflow-hidden' style={{ backgroundColor: '#ffffeb' }}>
        {children}
      </body>
    </html>
  );
}
