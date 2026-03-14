import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hanju Tour Guide',
  description: 'Customer Management for Tour Guides',
  applicationName: '한주 투어 가이드',
  manifest: '/manifest.webmanifest',
  themeColor: '#0ea5e9',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '한주 투어 가이드',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
